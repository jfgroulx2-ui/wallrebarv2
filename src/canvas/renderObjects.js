import { OBJECT_TYPES } from "../constants/objectTypes.js";
import { renderObjectAnnotation } from "./renderAnnotations.js";
import { renderObjectReinforcement } from "./renderRebar.js";
import { renderFooting, renderRectObject, renderSoil, renderWall } from "./renderWall.js";
import { worldToCanvas } from "./viewTransform.js";

function renderSimpleLine(ctx, object, view, selected, draft = false) {
  const p1 = worldToCanvas(object.geometry.x1_mm, object.geometry.y1_mm, view);
  const p2 = worldToCanvas(object.geometry.x2_mm, object.geometry.y2_mm, view);
  ctx.save();
  ctx.strokeStyle = selected ? "#0021F2" : draft ? "#a3e635" : "#94a3b8";
  ctx.lineWidth = selected ? 3 : 2;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
  ctx.restore();
}

function renderPolyline(ctx, object, view, selected, draft = false) {
  const color = selected ? "#0021F2" : draft ? "#a3e635" : "#94a3b8";
  const points = object.geometry.points || [];
  if (points.length < 2) return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = selected ? 3 : 2;
  ctx.beginPath();
  points.forEach((point, index) => {
    const canvasPoint = {
      x: point.x_mm * view.zoom + view.offsetX,
      y: -point.y_mm * view.zoom + view.offsetY,
    };
    if (index === 0) ctx.moveTo(canvasPoint.x, canvasPoint.y);
    else ctx.lineTo(canvasPoint.x, canvasPoint.y);
  });
  ctx.stroke();
  ctx.restore();
}

export function renderObject(ctx, object, view, selected = false, draft = false) {
  if (!object) return;

  if (object.type === OBJECT_TYPES.WALL) return renderWall(ctx, object, view, selected, draft);
  if (object.type === OBJECT_TYPES.FOOTING) return renderFooting(ctx, object, view, selected, draft);
  if (object.type === OBJECT_TYPES.SOIL) return renderSoil(ctx, object, view, selected, draft);
  if (object.type === OBJECT_TYPES.RECTANGLE || object.type === OBJECT_TYPES.SLAB) {
    return renderRectObject(ctx, object, view, {
      strokeStyle: selected ? "#0021F2" : "#94a3b8",
      lineWidth: selected ? 3 : 2,
    });
  }

  if (
    object.type === OBJECT_TYPES.REBAR ||
    object.type === OBJECT_TYPES.REBAR_SERIES ||
    object.type === OBJECT_TYPES.DOWEL
  ) {
    return renderObjectReinforcement(ctx, object, view, selected, draft);
  }

  if (object.type === OBJECT_TYPES.ANNOTATION || object.type === OBJECT_TYPES.REF_LEVEL) {
    return renderObjectAnnotation(ctx, object, view, selected, draft);
  }

  if (object.type === OBJECT_TYPES.LINE) {
    return renderSimpleLine(ctx, object, view, selected, draft);
  }

  if (object.type === OBJECT_TYPES.POLYLINE) {
    return renderPolyline(ctx, object, view, selected, draft);
  }
}
