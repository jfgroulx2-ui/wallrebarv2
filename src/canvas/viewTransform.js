export function canvasToPdf(cx, cy, view) {
  return {
    x: (cx - view.offsetX) / view.zoom,
    y: (cy - view.offsetY) / view.zoom,
  };
}

export function pdfToCanvas(px, py, view) {
  return {
    x: px * view.zoom + view.offsetX,
    y: py * view.zoom + view.offsetY,
  };
}

export function zoomAtPoint(view, nextZoom, cx, cy) {
  return {
    zoom: nextZoom,
    offsetX: cx - ((cx - view.offsetX) * nextZoom) / view.zoom,
    offsetY: cy - ((cy - view.offsetY) * nextZoom) / view.zoom,
  };
}

export function getViewportCenter(containerWidth, containerHeight) {
  return {
    x: containerWidth / 2,
    y: containerHeight / 2,
  };
}

export function fitView(containerWidth, containerHeight, pdfWidth, pdfHeight, padding = 24) {
  if (!pdfWidth || !pdfHeight || !containerWidth || !containerHeight) {
    return { zoom: 1, offsetX: 0, offsetY: 0 };
  }

  const zoom = Math.min(
    (containerWidth - padding * 2) / pdfWidth,
    (containerHeight - padding * 2) / pdfHeight,
  );

  return {
    zoom,
    offsetX: (containerWidth - pdfWidth * zoom) / 2,
    offsetY: (containerHeight - pdfHeight * zoom) / 2,
  };
}
