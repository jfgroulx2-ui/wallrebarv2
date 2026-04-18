import { WATERSTOP_TYPES } from "../constants/csaData.js";

function drawWaterstop(ctx, jointY, special, origins, scale) {
  const width = special.width * scale;
  const x = origins.wallX + (origins.wallW - width) / 2;
  ctx.fillStyle = WATERSTOP_TYPES[special.type].color;
  ctx.fillRect(x, jointY - 3, width, 6);
}

export function drawSpecialElements(ctx, special, origins, scale) {
  if (special.waterstop_sup.enabled) drawWaterstop(ctx, origins.wallY, special.waterstop_sup, origins, scale);
  if (special.waterstop_inf.enabled) drawWaterstop(ctx, origins.wallY + origins.wallH, special.waterstop_inf, origins, scale);

  if (special.insulation.enabled) {
    const sideX = special.insulation.position === "ext" ? origins.wallX - 10 : origins.wallX + origins.wallW + 4;
    ctx.fillStyle = "rgba(245, 222, 89, 0.8)";
    ctx.fillRect(sideX, origins.wallY, 6, origins.wallH);
  }

  if (special.membrane.enabled) {
    const sideX = special.membrane.face === "ext" ? origins.wallX - 4 : origins.wallX + origins.wallW - 2;
    ctx.fillStyle = "#f472b6";
    ctx.fillRect(sideX, origins.wallY, 2, origins.wallH);
  }

  special.sleeves.forEach((sleeve) => {
    const xCenter = sleeve.x_pos === "center" ? origins.wallX + origins.wallW / 2 : origins.wallX + Number(sleeve.x_pos || 0) * scale;
    const yCenter = origins.wallY + origins.wallH - sleeve.y_mm * scale;
    const width = Math.max(10, sleeve.diam_mm * scale * 0.6);
    ctx.fillStyle = "#93c5fd";
    ctx.fillRect(xCenter - width / 2, yCenter - 6, width, 12);
    ctx.strokeStyle = "#0f172a";
    ctx.strokeRect(xCenter - width / 2, yCenter - 6, width, 12);
  });
}
