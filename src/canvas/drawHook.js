import { BARS } from "../constants/csaData.js";
import { getExtension, getRayon } from "../utils/hookGeometry.js";

export function drawHook(ctx, xPx, yPx, barSize, angle, direction, scale, draw) {
  const { db } = BARS[barSize];
  const r = getRayon(barSize);
  const ext = getExtension(barSize, angle).ext;
  const rPx = r * scale;
  const extPx = ext * scale;

  ctx.strokeStyle = "#f97316";
  ctx.lineWidth = Math.max(2, db * scale * 0.25 * draw.barSizeMultiplier);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (angle === 90) {
    const cx = xPx + rPx;
    ctx.beginPath();
    ctx.arc(cx, yPx, rPx, Math.PI, Math.PI * 1.5, false);
    ctx.lineTo(cx + extPx, yPx - rPx);
    ctx.stroke();
    return;
  }

  if (angle === 180) {
    const sign = direction === "down" ? 1 : -1;
    const cy = yPx + sign * rPx;
    ctx.beginPath();
    ctx.arc(xPx, cy, rPx, -sign * Math.PI / 2, sign * Math.PI / 2, direction === "down");
    ctx.lineTo(xPx, cy - sign * (rPx - extPx));
    ctx.stroke();
    return;
  }

  if (angle === 135) {
    const cx = xPx + rPx;
    const endAngle = Math.PI + (135 * Math.PI) / 180;
    ctx.beginPath();
    ctx.arc(cx, yPx, rPx, Math.PI, endAngle, false);
    const endX = cx + rPx * Math.cos(endAngle);
    const endY = yPx + rPx * Math.sin(endAngle);
    ctx.lineTo(endX + extPx * Math.cos(endAngle), endY + extPx * Math.sin(endAngle));
    ctx.stroke();
  }
}
