function drawArrowhead(ctx, x, y, direction, color, scale = 1) {
  const size = 10 / scale;
  ctx.fillStyle = color;
  ctx.beginPath();

  if (direction === "up") {
    ctx.moveTo(x, y - size);
    ctx.lineTo(x - size * 0.6, y);
    ctx.lineTo(x + size * 0.6, y);
  } else if (direction === "down") {
    ctx.moveTo(x, y + size);
    ctx.lineTo(x - size * 0.6, y);
    ctx.lineTo(x + size * 0.6, y);
  } else if (direction === "left") {
    ctx.moveTo(x - size, y);
    ctx.lineTo(x, y - size * 0.6);
    ctx.lineTo(x, y + size * 0.6);
  } else {
    ctx.moveTo(x + size, y);
    ctx.lineTo(x, y - size * 0.6);
    ctx.lineTo(x, y + size * 0.6);
  }

  ctx.closePath();
  ctx.fill();
}

function drawAnnotationLabel(ctx, annotation, x, y, side, scale = 1) {
  const lines = [
    `${annotation.barSize}@${annotation.spacing_mm}`,
    annotation.cover_mm ? `c=${annotation.cover_mm}mm` : null,
    annotation.face !== "EF" ? annotation.face : null,
    annotation.note || null,
  ].filter(Boolean);

  const offsetX = side === "right" ? 20 / scale : -20 / scale;
  const textX = x + offsetX + (side === "right" ? 4 / scale : -4 / scale);
  const fontSize = 11 / scale;
  const lineHeight = 14 / scale;

  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 0.75 / scale;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + offsetX, y);
  ctx.stroke();

  ctx.fillStyle = "#f1f5f9";
  ctx.font = `${fontSize}px "DM Sans"`;
  ctx.textAlign = side === "right" ? "left" : "right";
  const maxWidth = Math.max(...lines.map((line) => ctx.measureText(line).width), 0);

  lines.forEach((line, index) => ctx.fillText(line, textX, y - 4 / scale + index * lineHeight));

  ctx.beginPath();
  if (side === "right") {
    ctx.moveTo(x + offsetX, y);
    ctx.lineTo(x + offsetX + maxWidth + 8 / scale, y);
  } else {
    ctx.moveTo(x + offsetX, y);
    ctx.lineTo(x + offsetX - maxWidth - 8 / scale, y);
  }
  ctx.stroke();
}

export function drawVerticalAnnotation(ctx, annotation, selected, hover, viewZoom) {
  const color = selected ? "#0021F2" : hover ? "#a3e635" : "#f97316";
  const x = annotation.x_pdf;
  const y = annotation.y_pdf;
  const length = annotation.length_pdf;

  ctx.strokeStyle = color;
  ctx.lineWidth = (selected ? 3 : 2) / viewZoom;
  ctx.setLineDash(selected ? [6 / viewZoom, 3 / viewZoom] : []);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + length);
  ctx.stroke();
  ctx.setLineDash([]);

  drawArrowhead(ctx, x, y, "up", color, viewZoom);
  drawArrowhead(ctx, x, y + length, "down", color, viewZoom);
  drawAnnotationLabel(ctx, annotation, x, y + length / 2, "right", viewZoom);
}

export function drawHorizontalAnnotation(ctx, annotation, selected, hover, viewZoom) {
  const color = selected ? "#0021F2" : hover ? "#a3e635" : "#38bdf8";
  const x = annotation.x_pdf;
  const y = annotation.y_pdf;
  const length = annotation.length_pdf;

  ctx.strokeStyle = color;
  ctx.lineWidth = (selected ? 3 : 2) / viewZoom;
  ctx.setLineDash(selected ? [6 / viewZoom, 3 / viewZoom] : []);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + length, y);
  ctx.stroke();
  ctx.setLineDash([]);

  drawArrowhead(ctx, x, y, "left", color, viewZoom);
  drawArrowhead(ctx, x + length, y, "right", color, viewZoom);
  drawAnnotationLabel(ctx, annotation, x + length / 2, y, "right", viewZoom);
}
