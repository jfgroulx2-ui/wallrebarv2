import { worldToCanvas } from "./viewTransform.js";

export function renderSnapIndicator(ctx, snapResult, view) {
  if (!snapResult) return;
  const point = worldToCanvas(snapResult.point.x_mm, snapResult.point.y_mm, view);
  ctx.save();
  ctx.strokeStyle = "#0021F2";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(point.x - 8, point.y);
  ctx.lineTo(point.x + 8, point.y);
  ctx.moveTo(point.x, point.y - 8);
  ctx.lineTo(point.x, point.y + 8);
  ctx.stroke();
  ctx.restore();
}
