export const SNAP_MM = 10;

export const mmToPx = (mm, scale) => mm * scale;
export const pxToMm = (px, scale) => px / scale;
export const snapMm = (mm) => Math.round(mm / SNAP_MM) * SNAP_MM;

export function getBarAtPosition(mx, my, barPositions, origins, scale, hitRadius = 10) {
  const allBars = [...barPositions.verticalBars, ...barPositions.horizontalBars];
  for (const bar of allBars) {
    const x = origins.wallX + bar.x_mm * scale;
    const yMm = bar.y_center_mm ?? bar.y_mm ?? 0;
    const y = origins.wallY + origins.wallH - yMm * scale;
    if (Math.hypot(mx - x, my - y) <= hitRadius) return bar;
  }
  return null;
}
