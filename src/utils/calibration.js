export function computePixelDistance(point1, point2) {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function computeCalibration(point1, point2, distanceMm) {
  const distancePx = computePixelDistance(point1, point2);
  const scalePxMm = distancePx / Number(distanceMm);
  const mmPerPx = 1 / scalePxMm;

  return {
    distancePx: Math.round(distancePx * 10) / 10,
    scalePxMm,
    mmPerPx,
    label: `1mm = ${scalePxMm.toFixed(3)} px | 1px = ${mmPerPx.toFixed(3)} mm`,
  };
}

export function pxToMm(px, scalePxMm) {
  return Math.round((px / scalePxMm) * 10) / 10;
}

export function mmToPx(mm, scalePxMm) {
  return mm * scalePxMm;
}
