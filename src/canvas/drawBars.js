function barPoint(origins, scale, xMm, yMm) {
  return {
    x: origins.wallX + xMm * scale,
    y: origins.wallY + origins.wallH - yMm * scale,
  };
}

export function drawVerticalBars(ctx, bars, overrides, origins, scale, draw, selectedBar) {
  bars.forEach((bar) => {
    const xMm = overrides[bar.id]?.x_mm_override ?? bar.x_mm;
    const yMm = overrides[bar.id]?.y_center_override ?? bar.y_center_mm;
    const point = barPoint(origins, scale, xMm, yMm);
    const radius = Math.max(3.8, scale * 0.45 * draw.barSizeMultiplier * 10);
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = selectedBar?.id === bar.id ? "#fb923c" : "#f97316";
    ctx.fill();
    ctx.lineWidth = draw.barStrokeWidth;
    ctx.strokeStyle = "#1c120d";
    ctx.stroke();
  });
}

export function drawHorizontalBars(ctx, bars, overrides, origins, scale, draw) {
  bars.forEach((bar) => {
    const xMm = overrides[bar.id]?.x_mm_override ?? bar.x_mm;
    const yMm = overrides[bar.id]?.y_mm_override ?? bar.y_mm;
    const point = barPoint(origins, scale, xMm, yMm);
    const radius = Math.max(3, scale * 0.32 * draw.barSizeMultiplier * 10);
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#0f1725";
    ctx.fill();
    ctx.lineWidth = draw.barStrokeWidth;
    ctx.strokeStyle = "#38bdf8";
    ctx.stroke();
  });
}

export function drawTies(ctx, ties, origins, scale, draw) {
  ctx.strokeStyle = "#a3e635";
  ctx.lineWidth = draw.tieLineWidth;
  ties.forEach((tie) => {
    const y = origins.wallY + origins.wallH - tie.y_mm * scale;
    ctx.beginPath();
    ctx.moveTo(origins.wallX + tie.x_start_mm * scale, y);
    ctx.lineTo(origins.wallX + tie.x_end_mm * scale, y);
    ctx.stroke();
  });
}
