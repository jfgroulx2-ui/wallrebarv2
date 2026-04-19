import { drawHorizontalAnnotation, drawVerticalAnnotation } from "./drawAnnotations.js";
import { drawCalibrationLine, drawCalibrationPoint } from "./drawCalibration.js";

export function renderAll(ctx, canvas, pdf, calibration, view, selectedId, draftAnnotation, hoverId) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!pdf.bitmap) return;

  ctx.save();
  ctx.translate(view.offsetX, view.offsetY);
  ctx.scale(view.zoom, view.zoom);

  ctx.drawImage(pdf.bitmap, 0, 0, pdf.nativeW, pdf.nativeH);

  const annotations = pdf.annotations[pdf.currentPage] || [];
  annotations.forEach((annotation) => {
    const selected = annotation.id === selectedId;
    const hover = annotation.id === hoverId;
    const drawAnnotation = annotation.type === "vertical" ? drawVerticalAnnotation : drawHorizontalAnnotation;
    drawAnnotation(ctx, annotation, selected, hover, view.zoom);
  });

  if (draftAnnotation) {
    const drawDraft = draftAnnotation.type === "vertical" ? drawVerticalAnnotation : drawHorizontalAnnotation;
    drawDraft(ctx, draftAnnotation, false, true, view.zoom);
  }

  if (calibration.point1) drawCalibrationPoint(ctx, calibration.point1, view.zoom);
  if (calibration.point2) drawCalibrationPoint(ctx, calibration.point2, view.zoom);
  if (calibration.point1 && calibration.point2) drawCalibrationLine(ctx, calibration.point1, calibration.point2, view.zoom);

  ctx.restore();
}
