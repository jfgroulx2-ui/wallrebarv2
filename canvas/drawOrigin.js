export function drawOrigin(ctx, origins) {
  const ox = origins.wallX;
  const oy = origins.wallY + origins.wallH;
  ctx.strokeStyle = "#0021f2";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(ox - 12, oy);
  ctx.lineTo(ox + 12, oy);
  ctx.moveTo(ox, oy - 12);
  ctx.lineTo(ox, oy + 12);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(ox, oy, 4, 0, Math.PI * 2);
  ctx.fillStyle = "#0021f2";
  ctx.fill();
  ctx.fillStyle = "#78a7ff";
  ctx.font = "10px 'DM Mono'";
  ctx.fillText("(0,0)", ox + 8, oy - 8);
}
