import { worldToCanvas } from "./viewTransform.js";

function renderHatch(ctx, x, y, width, height, spacing, color) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.75;
  const diag = width + height;
  for (let i = -height; i < width + height; i += spacing) {
    ctx.beginPath();
    ctx.moveTo(x + i, y + height);
    ctx.lineTo(x + i + diag, y - diag);
    ctx.stroke();
  }
  ctx.restore();
}

export function renderRectObject(ctx, object, view, options = {}) {
  const { geometry } = object;
  const p1 = worldToCanvas(geometry.x_mm, geometry.y_mm, view);
  const p2 = worldToCanvas(geometry.x_mm + geometry.width_mm, geometry.y_mm + geometry.height_mm, view);
  const x = Math.min(p1.x, p2.x);
  const y = Math.min(p1.y, p2.y);
  const width = Math.abs(p2.x - p1.x);
  const height = Math.abs(p2.y - p1.y);

  ctx.save();
  ctx.strokeStyle = options.strokeStyle;
  ctx.lineWidth = options.lineWidth ?? 2;
  ctx.strokeRect(x, y, width, height);
  if (options.hatch) renderHatch(ctx, x, y, width, height, options.hatchSpacing ?? 10, options.hatch);
  ctx.restore();
}

export function renderWall(ctx, object, view) {
  renderRectObject(ctx, object, view, {
    strokeStyle: "#cbd5e1",
    lineWidth: 2,
    hatch: "rgba(71,85,105,0.55)",
    hatchSpacing: 14,
  });
}

export function renderFooting(ctx, object, view) {
  renderRectObject(ctx, object, view, {
    strokeStyle: "#cbd5e1",
    lineWidth: 2,
    hatch: "rgba(71,85,105,0.4)",
    hatchSpacing: 14,
  });
}

export function renderSoil(ctx, object, view) {
  renderRectObject(ctx, object, view, {
    strokeStyle: "#78350f",
    lineWidth: 2,
    hatch: "rgba(113,63,18,0.45)",
    hatchSpacing: 12,
  });
}
