import { OBJECT_TYPES } from "../constants/objectTypes.js";
import { worldToCanvas } from "./viewTransform.js";

export function renderReferenceLevel(ctx, object, view, selected, draft = false) {
  const p1 = worldToCanvas(object.geometry.x_start_mm, object.geometry.y_mm, view);
  const p2 = worldToCanvas(object.geometry.x_end_mm, object.geometry.y_mm, view);
  ctx.save();
  ctx.strokeStyle = selected ? "#0021F2" : draft ? "#a3e635" : "#60a5fa";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([12, 8]);
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#f1f5f9";
  ctx.font = '500 11px "DM Sans"';
  ctx.fillText(object.properties.label || "Niveau", p2.x + 8, p2.y - 6);
  ctx.restore();
}

export function renderAnnotation(ctx, object, view, selected, draft = false) {
  const { x_mm, y_mm, leaderPoints = [] } = object.geometry;
  const anchor = worldToCanvas(x_mm, y_mm, view);
  ctx.save();
  ctx.strokeStyle = selected ? "#0021F2" : "#94a3b8";
  ctx.lineWidth = 1;
  if (draft) ctx.strokeStyle = "#a3e635";

  if (leaderPoints.length) {
    ctx.beginPath();
    leaderPoints.forEach((point, index) => {
      const canvasPoint = worldToCanvas(point.x, point.y, view);
      if (index === 0) ctx.moveTo(canvasPoint.x, canvasPoint.y);
      else ctx.lineTo(canvasPoint.x, canvasPoint.y);
    });
    ctx.lineTo(anchor.x, anchor.y);
    ctx.stroke();
  }

  ctx.fillStyle = selected ? "#0021F2" : "#f1f5f9";
  ctx.font = '500 11px "DM Sans"';
  const lines = String(object.properties.text || "").split("\n");
  const maxWidth = Math.max(...lines.map((line) => ctx.measureText(line).width), 0);
  lines.forEach((line, index) => ctx.fillText(line, anchor.x + 4, anchor.y - 4 + index * 14));

  // Small grip at the label anchor so annotations feel draggable.
  ctx.beginPath();
  ctx.arc(anchor.x, anchor.y, selected ? 4.5 : 3.25, 0, Math.PI * 2);
  ctx.fillStyle = selected ? "#0021F2" : "#94a3b8";
  ctx.fill();

  if (object.properties.underline) {
    ctx.beginPath();
    ctx.moveTo(anchor.x, anchor.y);
    ctx.lineTo(anchor.x + maxWidth + 8, anchor.y);
    ctx.stroke();
  }
  ctx.restore();
}

export function renderObjectAnnotation(ctx, object, view, selected, draft = false) {
  if (object.type === OBJECT_TYPES.ANNOTATION) return renderAnnotation(ctx, object, view, selected, draft);
  if (object.type === OBJECT_TYPES.REF_LEVEL) return renderReferenceLevel(ctx, object, view, selected, draft);
}
