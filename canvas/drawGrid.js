export function drawGrid(ctx, origins, scale) {
  ctx.save();
  ctx.strokeStyle = "rgba(120,167,255,0.12)";
  ctx.lineWidth = 1;

  for (let x = origins.wallX; x <= origins.wallX + origins.wallW; x += 10 * scale) {
    ctx.beginPath();
    ctx.moveTo(x, origins.wallY - origins.futureH);
    ctx.lineTo(x, origins.wallY + origins.wallH + origins.previousH);
    ctx.stroke();
  }

  for (let y = origins.wallY - origins.futureH; y <= origins.wallY + origins.wallH + origins.previousH; y += 10 * scale) {
    ctx.beginPath();
    ctx.moveTo(origins.wallX, y);
    ctx.lineTo(origins.wallX + origins.wallW, y);
    ctx.stroke();
  }

  ctx.restore();
}
