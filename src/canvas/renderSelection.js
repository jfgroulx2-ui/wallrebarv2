import { bboxFromPoints, getObjectEndpoints } from "../utils/geometry.js";
import { worldToCanvas } from "./viewTransform.js";

export function renderSelectionHandles(ctx, object, view) {
  const points = getObjectEndpoints(object);
  if (!points.length) return;
  const bbox = bboxFromPoints(points);
  const p1 = worldToCanvas(bbox.minX, bbox.minY, view);
  const p2 = worldToCanvas(bbox.maxX, bbox.maxY, view);
  const x = Math.min(p1.x, p2.x);
  const y = Math.min(p1.y, p2.y);
  const width = Math.abs(p2.x - p1.x);
  const height = Math.abs(p2.y - p1.y);

  ctx.save();
  ctx.strokeStyle = "#0021F2";
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(x - 4, y - 4, width + 8, height + 8);
  ctx.restore();
}
