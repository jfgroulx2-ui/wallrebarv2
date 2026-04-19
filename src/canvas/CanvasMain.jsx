import { useEffect, useRef, useState } from "react";
import DropZone from "../components/DropZone.jsx";
import ZoomControls from "../components/ZoomControls.jsx";
import PageNav from "../components/PageNav.jsx";
import { renderAll } from "./renderAll.js";
import { canvasToPdf, fitView, getViewportCenter, zoomAtPoint } from "./viewTransform.js";
import { hitTestAnnotation } from "../utils/annotations.js";

function defaultDraft(type, point) {
  return {
    id: "draft",
    type,
    x_pdf: point.x,
    y_pdf: point.y,
    length_pdf: 0,
    barSize: type === "vertical" ? "15M" : "10M",
    spacing_mm: type === "vertical" ? 200 : 300,
    cover_mm: 40,
    face: "EF",
    note: "",
    locked: false,
  };
}

export default function CanvasMain({
  pdf,
  calibration,
  setCalibration,
  view,
  setView,
  mode,
  selectedId,
  setSelectedId,
  draftAnnotation,
  setDraftAnnotation,
  currentAnnotations,
  onCreateAnnotation,
  onUpdateAnnotation,
  onOpenFileDialog,
  onDropFile,
  onChangePage,
}) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const actionRef = useRef({ type: null });
  const spacePressedRef = useRef(false);
  const [hoverId, setHoverId] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper || !pdf.loaded) return;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const rect = wrapper.getBoundingClientRect();
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext("2d");
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      renderAll(ctx, { width: rect.width, height: rect.height }, pdf, calibration, view, selectedId, draftAnnotation, hoverId);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [pdf, calibration, view, selectedId, draftAnnotation, hoverId]);

  useEffect(() => {
    if (!pdf.loaded || !wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    setView(fitView(rect.width, rect.height, pdf.nativeW, pdf.nativeH));
  }, [pdf.currentPage, pdf.loaded, pdf.nativeW, pdf.nativeH, setView]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space") {
        spacePressedRef.current = true;
      }
    };

    const handleKeyUp = (event) => {
      if (event.code === "Space") {
        spacePressedRef.current = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const getCanvasPoint = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const beginPan = (point) => {
    actionRef.current = {
      type: "pan",
      startPoint: point,
      startOffsetX: view.offsetX,
      startOffsetY: view.offsetY,
    };
  };

  const handleMouseDown = (event) => {
    if (!pdf.loaded) return;
    if (event.button === 2) return;

    const canvasPoint = getCanvasPoint(event);
    const pdfPoint = canvasToPdf(canvasPoint.x, canvasPoint.y, view);
    const panIntent = mode === "pan" || spacePressedRef.current || event.button === 1;

    if (panIntent) {
      beginPan(canvasPoint);
      return;
    }

    if (mode === "calibrate") {
      if (!calibration.point1 || (calibration.point1 && calibration.point2)) {
        setCalibration((prev) => ({
          ...prev,
          active: true,
          point1: pdfPoint,
          point2: null,
          distancePx: null,
          distanceMm: "",
          validated: false,
          scalePxMm: null,
          label: "",
        }));
      } else {
        const dx = pdfPoint.x - calibration.point1.x;
        const dy = pdfPoint.y - calibration.point1.y;
        const distancePx = Math.round(Math.sqrt(dx * dx + dy * dy) * 10) / 10;
        setCalibration((prev) => ({ ...prev, point2: pdfPoint, distancePx }));
      }
      return;
    }

    if (mode === "annot_vertical" || mode === "annot_horizontal") {
      const type = mode === "annot_vertical" ? "vertical" : "horizontal";
      actionRef.current = { type: "draw", startPoint: pdfPoint };
      setDraftAnnotation(defaultDraft(type, pdfPoint));
      setSelectedId(null);
      setHoverId(null);
      return;
    }

    if (mode === "select") {
      const hit = hitTestAnnotation(currentAnnotations, pdfPoint, 12 / view.zoom);
      setSelectedId(hit?.id ?? null);
      if (hit && !hit.locked) {
        actionRef.current = {
          type: "drag-annotation",
          id: hit.id,
          startPoint: pdfPoint,
          startX: hit.x_pdf,
          startY: hit.y_pdf,
        };
      } else {
        actionRef.current = { type: null };
      }
      return;
    }

    if (mode === "idle") {
      beginPan(canvasPoint);
    }
  };

  const handleMouseMove = (event) => {
    if (!pdf.loaded) return;
    const canvasPoint = getCanvasPoint(event);
    const pdfPoint = canvasToPdf(canvasPoint.x, canvasPoint.y, view);

    if (actionRef.current.type === "draw" && draftAnnotation) {
      const start = actionRef.current.startPoint;
      if (draftAnnotation.type === "vertical") {
        setDraftAnnotation((prev) => ({
          ...prev,
          x_pdf: start.x,
          y_pdf: Math.min(start.y, pdfPoint.y),
          length_pdf: Math.abs(pdfPoint.y - start.y),
        }));
      } else {
        setDraftAnnotation((prev) => ({
          ...prev,
          x_pdf: Math.min(start.x, pdfPoint.x),
          y_pdf: start.y,
          length_pdf: Math.abs(pdfPoint.x - start.x),
        }));
      }
      return;
    }

    if (actionRef.current.type === "drag-annotation") {
      const deltaX = pdfPoint.x - actionRef.current.startPoint.x;
      const deltaY = pdfPoint.y - actionRef.current.startPoint.y;
      onUpdateAnnotation(actionRef.current.id, {
        x_pdf: actionRef.current.startX + deltaX,
        y_pdf: actionRef.current.startY + deltaY,
      });
      return;
    }

    if (actionRef.current.type === "pan") {
      const dx = canvasPoint.x - actionRef.current.startPoint.x;
      const dy = canvasPoint.y - actionRef.current.startPoint.y;
      setView((prev) => ({
        ...prev,
        offsetX: actionRef.current.startOffsetX + dx,
        offsetY: actionRef.current.startOffsetY + dy,
      }));
      return;
    }

    const hit = hitTestAnnotation(currentAnnotations, pdfPoint, 10 / view.zoom);
    setHoverId(hit?.id ?? null);
  };

  const handleMouseUp = () => {
    if (actionRef.current.type === "draw" && draftAnnotation) {
      const defaultLength = draftAnnotation.type === "vertical" ? 240 : 320;
      const length = draftAnnotation.length_pdf < 5 ? defaultLength : draftAnnotation.length_pdf;
      onCreateAnnotation({ ...draftAnnotation, length_pdf: length });
      setDraftAnnotation(null);
    }

    actionRef.current = { type: null };
  };

  const handleWheel = (event) => {
    if (!pdf.loaded) return;
    event.preventDefault();
    const canvasPoint = getCanvasPoint(event);
    const nextZoom = Math.max(0.1, Math.min(10, view.zoom * (event.deltaY > 0 ? 0.9 : 1.1)));
    setView(zoomAtPoint(view, nextZoom, canvasPoint.x, canvasPoint.y));
  };

  const handleFit = () => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    setView(fitView(rect.width, rect.height, pdf.nativeW, pdf.nativeH));
  };

  const handleZoomOut = () => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const center = getViewportCenter(rect.width, rect.height);
    setView((prev) => zoomAtPoint(prev, Math.max(0.1, prev.zoom * 0.9), center.x, center.y));
  };

  const handleZoomIn = () => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const center = getViewportCenter(rect.width, rect.height);
    setView((prev) => zoomAtPoint(prev, Math.min(10, prev.zoom * 1.1), center.x, center.y));
  };

  return (
    <div className="canvas-main">
      <div className="canvas-topbar">
        <ZoomControls
          zoom={view.zoom}
          onZoomOut={handleZoomOut}
          onZoomIn={handleZoomIn}
          onFit={handleFit}
        />
        <PageNav
          currentPage={pdf.currentPage}
          pageCount={pdf.pageCount}
          onPrev={() => onChangePage(pdf.currentPage - 1)}
          onNext={() => onChangePage(pdf.currentPage + 1)}
        />
      </div>

      <div ref={wrapperRef} className="canvas-stage">
        {!pdf.loaded ? (
          <DropZone onPickFile={onOpenFileDialog} onDropFile={onDropFile} />
        ) : (
          <canvas
            ref={canvasRef}
            className={`annot-canvas mode-${mode}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            onContextMenu={(event) => event.preventDefault()}
          />
        )}
      </div>
    </div>
  );
}
