import { useEffect, useRef } from "react";
import { DEFAULT_GRID } from "../constants/defaults.js";
import { OBJECT_TYPES } from "../constants/objectTypes.js";
import { TOOLS } from "../constants/toolModes.js";
import { useDrawingStore } from "../store/useDrawingStore.js";
import { useToolStore } from "../store/useToolStore.js";
import { useUIStore } from "../store/useUIStore.js";
import { computeSnap, SNAP_MODES } from "../utils/snapEngine.js";
import { inferRebarRole, getBarDbMm, getWorldBounds } from "../utils/geometry.js";
import { normalizeSeriesProperties } from "../utils/seriesCalc.js";
import { generateWall } from "../utils/wallGenerator.js";
import { renderAll } from "./renderAll.js";
import { canvasToWorld, fitView, zoomAtPoint } from "./viewTransform.js";

function createLineObject(start, end) {
  return {
    type: OBJECT_TYPES.LINE,
    category: "geometry",
    layer: "geometry",
    geometry: {
      x1_mm: start.x_mm,
      y1_mm: start.y_mm,
      x2_mm: end.x_mm,
      y2_mm: end.y_mm,
    },
    properties: {},
  };
}

function createRectangleObject(start, end) {
  return {
    type: OBJECT_TYPES.RECTANGLE,
    category: "geometry",
    layer: "geometry",
    geometry: {
      x_mm: Math.min(start.x_mm, end.x_mm),
      y_mm: Math.min(start.y_mm, end.y_mm),
      width_mm: Math.abs(end.x_mm - start.x_mm),
      height_mm: Math.abs(end.y_mm - start.y_mm),
    },
    properties: {},
  };
}

function createPolylineObject(points) {
  return {
    type: OBJECT_TYPES.POLYLINE,
    category: "geometry",
    layer: "geometry",
    geometry: {
      points,
    },
    properties: {},
  };
}

function createRebarObject(start, end, params) {
  return {
    type: OBJECT_TYPES.REBAR,
    category: "reinforcement",
    layer: "reinforcement",
    geometry: {
      x1_mm: start.x_mm,
      y1_mm: start.y_mm,
      x2_mm: end.x_mm,
      y2_mm: end.y_mm,
    },
    properties: {
      diameter: params.diameter,
      db_mm: getBarDbMm(params.diameter),
      face: params.face,
      cover_mm: params.cover_mm,
      hookStart: params.hookStart,
      hookEnd: params.hookEnd,
      hookStartDirection: params.hookStartDirection,
      hookEndDirection: params.hookEndDirection,
      role: inferRebarRole({
        x1_mm: start.x_mm,
        y1_mm: start.y_mm,
        x2_mm: end.x_mm,
        y2_mm: end.y_mm,
      }),
    },
  };
}

function createSeriesObject(start, end, params) {
  const vertical = params.direction !== "horizontal";
  const barLength_mm = 600;
  const lengthMm = vertical ? end.y_mm - start.y_mm : end.x_mm - start.x_mm;
  const normalized = normalizeSeriesProperties(lengthMm, params.spacing_mm, params.count || null);

  return {
    type: OBJECT_TYPES.REBAR_SERIES,
    category: "reinforcement",
    layer: "reinforcement",
    geometry: vertical
      ? {
          x_mm: start.x_mm,
          y_start_mm: Math.min(start.y_mm, end.y_mm),
          y_end_mm: Math.max(start.y_mm, end.y_mm),
          direction: "vertical",
          barLength_mm,
        }
      : {
          x_start_mm: Math.min(start.x_mm, end.x_mm),
          x_end_mm: Math.max(start.x_mm, end.x_mm),
          y_mm: start.y_mm,
          direction: "horizontal",
          barLength_mm,
        },
    properties: {
      diameter: params.diameter,
      db_mm: getBarDbMm(params.diameter),
      spacing_mm: params.spacing_mm,
      count: params.count || null,
      face: params.face,
      cover_mm: params.cover_mm,
      hookStart: params.hookStart,
      hookEnd: params.hookEnd,
      hookStartDirection: params.hookStartDirection,
      hookEndDirection: params.hookEndDirection,
      role: vertical ? "vertical" : "horizontal",
      ...normalized,
    },
  };
}

function getCanvasPoint(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

export default function DrawingCanvas() {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const interactionRef = useRef({
    pan: null,
    drag: null,
    firstPoint: null,
    polylinePoints: [],
  });
  const spacePressedRef = useRef(false);

  const drawingStore = useDrawingStore();
  const { activeTool, toolParams, setTool } = useToolStore();
  const { setCursorWorld, setSnapPoint, draftObject, setDraftObject, clearTransient } = useUIStore();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space") spacePressedRef.current = true;
    };
    const handleKeyUp = (event) => {
      if (event.code === "Space") spacePressedRef.current = false;
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      const nextWidth = Math.max(1, Math.round(rect.width * ratio));
      const nextHeight = Math.max(1, Math.round(rect.height * ratio));

      if (canvas.width !== nextWidth) canvas.width = nextWidth;
      if (canvas.height !== nextHeight) canvas.height = nextHeight;

      const ctx = canvas.getContext("2d");
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      renderAll(ctx, { width: rect.width, height: rect.height }, { ...drawingStore, ...useUIStore.getState() });
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [drawingStore, draftObject]);

  useEffect(() => {
    if (!wrapperRef.current || drawingStore.objectOrder.length) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const bounds = getWorldBounds(drawingStore.objects);
    useDrawingStore.getState().setView(fitView(rect.width, rect.height, bounds));
  }, [drawingStore.objectOrder.length, drawingStore.objects]);

  const buildSnap = (canvasPoint) => {
    const worldPoint = canvasToWorld(canvasPoint.x, canvasPoint.y, drawingStore.view);
    const snap = computeSnap(
      worldPoint,
      drawingStore.objects,
      [SNAP_MODES.ENDPOINT, SNAP_MODES.MIDPOINT, SNAP_MODES.OBJECT_FACE, SNAP_MODES.GRID],
      drawingStore.grid.snapSize || DEFAULT_GRID.snapSize,
    );
    setCursorWorld(worldPoint);
    setSnapPoint(snap);
    return snap.point;
  };

  const updateDraft = (start, current) => {
    if (activeTool === TOOLS.LINE) setDraftObject(createLineObject(start, current));
    if (activeTool === TOOLS.RECTANGLE) setDraftObject(createRectangleObject(start, current));
    if (activeTool === TOOLS.REBAR) setDraftObject(createRebarObject(start, current, toolParams.rebar));
    if (activeTool === TOOLS.REBAR_SERIES) setDraftObject(createSeriesObject(start, current, toolParams.rebar_series));
    if (activeTool === TOOLS.POLYLINE && interactionRef.current.polylinePoints.length) {
      const previewPoints = [...interactionRef.current.polylinePoints, current];
      setDraftObject(previewPoints.length > 1 ? createPolylineObject(previewPoints) : null);
    }
  };

  const finalizeTwoClickObject = (start, end) => {
    if (activeTool === TOOLS.LINE) drawingStore.addObject(createLineObject(start, end));
    if (activeTool === TOOLS.RECTANGLE) drawingStore.addObject(createRectangleObject(start, end));
    if (activeTool === TOOLS.REBAR) drawingStore.addObjectWithAnnotation(createRebarObject(start, end, toolParams.rebar));
    if (activeTool === TOOLS.REBAR_SERIES) drawingStore.addObjectWithAnnotation(createSeriesObject(start, end, toolParams.rebar_series));
  };

  const handleMouseDown = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasPoint = getCanvasPoint(event, canvas);
    const snapPoint = buildSnap(canvasPoint);
    const panIntent = activeTool === TOOLS.PAN || spacePressedRef.current || event.button === 1;

    if (panIntent) {
      interactionRef.current.pan = {
        startX: canvasPoint.x,
        startY: canvasPoint.y,
        offsetX: drawingStore.view.offsetX,
        offsetY: drawingStore.view.offsetY,
      };
      return;
    }

    if (activeTool === TOOLS.SELECT) {
      const hit = drawingStore.findTopObjectAt(snapPoint, 18 / drawingStore.view.zoom);
      if (hit) {
        drawingStore.selectObject(hit.id);
        interactionRef.current.drag = {
          id: hit.id,
          startPoint: snapPoint,
        };
      } else {
        drawingStore.clearSelection();
      }
      return;
    }

    if (activeTool === TOOLS.WALL) {
      const createdIds = drawingStore.addObjects(generateWall(toolParams.wall, snapPoint.x_mm, snapPoint.y_mm));
      drawingStore.selectObject(createdIds[0] || null);
      setTool(TOOLS.SELECT);
      return;
    }

    if (activeTool === TOOLS.POLYLINE) {
      interactionRef.current.polylinePoints = [...interactionRef.current.polylinePoints, snapPoint];
      setDraftObject(createPolylineObject(interactionRef.current.polylinePoints));
      return;
    }

    if ([TOOLS.LINE, TOOLS.RECTANGLE, TOOLS.REBAR, TOOLS.REBAR_SERIES].includes(activeTool)) {
      if (!interactionRef.current.firstPoint) {
        interactionRef.current.firstPoint = snapPoint;
        updateDraft(snapPoint, snapPoint);
      } else {
        finalizeTwoClickObject(interactionRef.current.firstPoint, snapPoint);
        interactionRef.current.firstPoint = null;
        setDraftObject(null);
        drawingStore.clearSelection();
        if (activeTool === TOOLS.LINE || activeTool === TOOLS.RECTANGLE) setTool(TOOLS.SELECT);
      }
    }
  };

  const handleMouseMove = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasPoint = getCanvasPoint(event, canvas);
    const snapPoint = buildSnap(canvasPoint);

    if (interactionRef.current.pan) {
      useDrawingStore.getState().setView({
        ...drawingStore.view,
        offsetX: interactionRef.current.pan.offsetX + (canvasPoint.x - interactionRef.current.pan.startX),
        offsetY: interactionRef.current.pan.offsetY + (canvasPoint.y - interactionRef.current.pan.startY),
      });
      return;
    }

    if (interactionRef.current.drag) {
      const dx = snapPoint.x_mm - interactionRef.current.drag.startPoint.x_mm;
      const dy = snapPoint.y_mm - interactionRef.current.drag.startPoint.y_mm;
      drawingStore.translateObject(interactionRef.current.drag.id, dx, dy);
      interactionRef.current.drag.startPoint = snapPoint;
      return;
    }

    if (interactionRef.current.firstPoint) {
      updateDraft(interactionRef.current.firstPoint, snapPoint);
    } else if (activeTool === TOOLS.POLYLINE && interactionRef.current.polylinePoints.length) {
      updateDraft(interactionRef.current.polylinePoints.at(-1), snapPoint);
    }
  };

  const handleMouseUp = () => {
    interactionRef.current.pan = null;
    interactionRef.current.drag = null;
  };

  const handleWheel = (event) => {
    event.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasPoint = getCanvasPoint(event, canvas);
    const factor = event.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.05, Math.min(50, drawingStore.view.zoom * factor));
    useDrawingStore.getState().setView(zoomAtPoint(drawingStore.view, newZoom, canvasPoint.x, canvasPoint.y));
  };

  const handleDoubleClick = () => {
    if (activeTool === TOOLS.POLYLINE && interactionRef.current.polylinePoints.length > 1) {
      drawingStore.addObject(createPolylineObject([...interactionRef.current.polylinePoints]));
      interactionRef.current.polylinePoints = [];
      setDraftObject(null);
    }
  };

  return (
    <div ref={wrapperRef} className="drawing-stage">
      <canvas
        ref={canvasRef}
        className={`drawing-canvas tool-${activeTool}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        onContextMenu={(event) => event.preventDefault()}
      />
    </div>
  );
}
