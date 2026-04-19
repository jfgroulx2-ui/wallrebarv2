export function drawCalibrationPoint(ctx, point, viewZoom) {
  const radius = 5 / viewZoom;
  ctx.fillStyle = "#0021F2";
  ctx.strokeStyle = "#93c5fd";
  ctx.lineWidth = 1.5 / viewZoom;

  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(point.x - 8 / viewZoom, point.y);
  ctx.lineTo(point.x + 8 / viewZoom, point.y);
  ctx.moveTo(point.x, point.y - 8 / viewZoom);
  ctx.lineTo(point.x, point.y + 8 / viewZoom);
  ctx.stroke();
}

export function drawCalibrationLine(ctx, point1, point2, viewZoom) {
  ctx.strokeStyle = "#60a5fa";
  ctx.lineWidth = 1.5 / viewZoom;
  ctx.setLineDash([8 / viewZoom, 6 / viewZoom]);
  ctx.beginPath();
  ctx.moveTo(point1.x, point1.y);
  ctx.lineTo(point2.x, point2.y);
  ctx.stroke();
  ctx.setLineDash([]);
}
