export function drawDimensions(ctx, geometry, barPositions, origins, scale, draw) {
  ctx.strokeStyle = "#d6e2f5";
  ctx.fillStyle = "#d6e2f5";
  ctx.lineWidth = draw.dimLineWidth;
  ctx.font = "11px 'DM Mono'";

  const x1 = origins.wallX;
  const x2 = origins.wallX + origins.wallW;
  const y = origins.wallY + origins.wallH + 36;

  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.moveTo(x1, y - 8);
  ctx.lineTo(x1, y + 8);
  ctx.moveTo(x2, y - 8);
  ctx.lineTo(x2, y + 8);
  ctx.stroke();
  ctx.fillText(`${geometry.thickness} mm`, x1 + origins.wallW / 2 - 24, y - 10);

  const dimX = origins.wallX - 38;
  ctx.beginPath();
  ctx.moveTo(dimX, origins.wallY);
  ctx.lineTo(dimX, origins.wallY + origins.wallH);
  ctx.moveTo(dimX - 8, origins.wallY);
  ctx.lineTo(dimX + 8, origins.wallY);
  ctx.moveTo(dimX - 8, origins.wallY + origins.wallH);
  ctx.lineTo(dimX + 8, origins.wallY + origins.wallH);
  ctx.stroke();
  ctx.save();
  ctx.translate(dimX - 12, origins.wallY + origins.wallH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(`${barPositions.H} mm`, -24, 0);
  ctx.restore();
}
