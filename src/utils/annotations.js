import { pxToMm } from "./calibration.js";

function enrichAnnotation(annotation, scalePxMm) {
  if (!scalePxMm) {
    return {
      ...annotation,
      x_mm: null,
      y_mm: null,
      length_mm: null,
    };
  }

  return {
    ...annotation,
    x_mm: pxToMm(annotation.x_pdf, scalePxMm),
    y_mm: pxToMm(annotation.y_pdf, scalePxMm),
    length_mm: pxToMm(annotation.length_pdf, scalePxMm),
  };
}

export function buildAnnotation({
  id,
  page,
  type,
  x_pdf,
  y_pdf,
  length_pdf,
  barSize,
  spacing_mm,
  cover_mm,
  face,
  note,
  scalePxMm,
}) {
  return enrichAnnotation(
    {
      id,
      type,
      page,
      x_pdf,
      y_pdf,
      length_pdf,
      barSize,
      spacing_mm,
      cover_mm,
      face,
      note,
      selected: false,
      locked: false,
    },
    scalePxMm,
  );
}

export function addAnnotation(annotationsByPage, page, annotation) {
  return {
    ...annotationsByPage,
    [page]: [...(annotationsByPage[page] || []), annotation],
  };
}

export function updateAnnotation(annotationsByPage, page, id, changes, scalePxMm) {
  return {
    ...annotationsByPage,
    [page]: (annotationsByPage[page] || []).map((annotation) =>
      annotation.id === id ? enrichAnnotation({ ...annotation, ...changes }, scalePxMm) : annotation,
    ),
  };
}

export function deleteAnnotation(annotationsByPage, page, id) {
  return {
    ...annotationsByPage,
    [page]: (annotationsByPage[page] || []).filter((annotation) => annotation.id !== id),
  };
}

export function duplicateAnnotation(annotationsByPage, page, id, newId, scalePxMm) {
  const source = (annotationsByPage[page] || []).find((annotation) => annotation.id === id);
  if (!source) return annotationsByPage;

  const copy = enrichAnnotation(
    {
      ...source,
      id: newId,
      x_pdf: source.x_pdf + 20,
      y_pdf: source.y_pdf + 20,
      selected: false,
    },
    scalePxMm,
  );

  return addAnnotation(annotationsByPage, page, copy);
}

export function applyCalibrationToAnnotations(annotationsByPage, scalePxMm) {
  return Object.fromEntries(
    Object.entries(annotationsByPage).map(([page, annotations]) => [
      page,
      annotations.map((annotation) => enrichAnnotation(annotation, scalePxMm)),
    ]),
  );
}

function pointToSegmentDistance(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  if (dx === 0 && dy === 0) return Math.hypot(point.x - start.x, point.y - start.y);

  const t = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy)));
  const projX = start.x + t * dx;
  const projY = start.y + t * dy;
  return Math.hypot(point.x - projX, point.y - projY);
}

export function hitTestAnnotation(annotations, point, tolerance = 10) {
  return (
    [...annotations].reverse().find((annotation) => {
      const start = { x: annotation.x_pdf, y: annotation.y_pdf };
      const end =
        annotation.type === "vertical"
          ? { x: annotation.x_pdf, y: annotation.y_pdf + annotation.length_pdf }
          : { x: annotation.x_pdf + annotation.length_pdf, y: annotation.y_pdf };

      return pointToSegmentDistance(point, start, end) <= tolerance;
    }) || null
  );
}
