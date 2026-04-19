export function worldToCanvas(x_mm, y_mm, view) {
  return {
    x: x_mm * view.zoom + view.offsetX,
    y: -y_mm * view.zoom + view.offsetY,
  };
}

export function canvasToWorld(cx, cy, view) {
  return {
    x_mm: (cx - view.offsetX) / view.zoom,
    y_mm: -(cy - view.offsetY) / view.zoom,
  };
}

export function zoomAtPoint(view, nextZoom, cx, cy) {
  return {
    zoom: nextZoom,
    offsetX: cx - ((cx - view.offsetX) * nextZoom) / view.zoom,
    offsetY: cy - ((cy - view.offsetY) * nextZoom) / view.zoom,
  };
}

export function fitView(canvasWidth, canvasHeight, bounds, padding = 80) {
  const width = Math.max(1, bounds.maxX - bounds.minX);
  const height = Math.max(1, bounds.maxY - bounds.minY);
  const zoom = Math.min(
    Math.max(0.05, (canvasWidth - padding * 2) / width),
    Math.max(0.05, (canvasHeight - padding * 2) / height),
  );

  return {
    zoom,
    offsetX: padding - bounds.minX * zoom + (canvasWidth - padding * 2 - width * zoom) / 2,
    offsetY: padding + bounds.maxY * zoom + (canvasHeight - padding * 2 - height * zoom) / 2,
  };
}
