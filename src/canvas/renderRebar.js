import { OBJECT_TYPES } from "../constants/objectTypes.js";
import { computeSeriesPositions } from "../utils/seriesCalc.js";
import { worldToCanvas } from "./viewTransform.js";

function getRebarColor(object) {
  if (object.properties?.role === "horizontal" || object.geometry?.direction === "horizontal") return "#38bdf8";
  return "#f97316";
}

function renderSegment(ctx, segment, view, color, selected, draft) {
  const p1 = worldToCanvas(segment.x1_mm, segment.y1_mm, view);
  const p2 = worldToCanvas(segment.x2_mm, segment.y2_mm, view);
  ctx.save();
  ctx.strokeStyle = selected ? "#0021F2" : draft ? "#a3e635" : color;
  ctx.lineWidth = selected ? 3 : 2;
  ctx.lineCap = "square";
  if (selected) ctx.setLineDash([8, 4]);
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
  ctx.restore();
}

function renderPoint(ctx, xMm, yMm, radiusMm, view, color, selected, draft) {
  const point = worldToCanvas(xMm, yMm, view);
  const radiusPx = Math.max(3, radiusMm * view.zoom * 0.5);
  ctx.save();
  ctx.fillStyle = selected ? "#0021F2" : draft ? "#a3e635" : color;
  ctx.strokeStyle = "rgba(10, 15, 30, 0.92)";
  ctx.lineWidth = selected ? 2 : 1.25;
  ctx.beginPath();
  ctx.arc(point.x, point.y, radiusPx, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

export function renderRebar(ctx, object, view, selected, draft = false) {
  const role = object.properties?.role;
  const dbMm = object.properties?.db_mm ?? 16;

  if (role === "horizontal") {
    const centerX = (object.geometry.x1_mm + object.geometry.x2_mm) / 2;
    const centerY = (object.geometry.y1_mm + object.geometry.y2_mm) / 2;
    renderPoint(ctx, centerX, centerY, dbMm, view, getRebarColor(object), selected, draft);
    return;
  }

  renderSegment(ctx, object.geometry, view, getRebarColor(object), selected, draft);
}

export function renderRebarSeries(ctx, object, view, selected, draft = false) {
  const positions = computeSeriesPositions(object);
  const dbMm = object.properties?.db_mm ?? 16;

  if (object.geometry?.direction === "horizontal" || object.properties?.role === "horizontal") {
    positions.forEach((segment) => {
      const centerX = (segment.x1_mm + segment.x2_mm) / 2;
      const centerY = (segment.y1_mm + segment.y2_mm) / 2;
      renderPoint(ctx, centerX, centerY, dbMm, view, getRebarColor(object), selected, draft);
    });
    return;
  }

  positions.forEach((segment) => renderSegment(ctx, segment, view, getRebarColor(object), selected, draft));
}

export function renderObjectReinforcement(ctx, object, view, selected, draft = false) {
  if (object.type === OBJECT_TYPES.REBAR) return renderRebar(ctx, object, view, selected, draft);
  if (object.type === OBJECT_TYPES.REBAR_SERIES) return renderRebarSeries(ctx, object, view, selected, draft);
  if (object.type === OBJECT_TYPES.DOWEL) return renderRebar(ctx, object, view, selected, draft);
}
