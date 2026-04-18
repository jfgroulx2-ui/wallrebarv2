import { drawWall, drawZoneContext } from "./drawWall.js";
import { drawGrid } from "./drawGrid.js";
import { drawOrigin } from "./drawOrigin.js";
import { drawHorizontalBars, drawTies, drawVerticalBars } from "./drawBars.js";
import { drawEndConditions } from "./drawEndConditions.js";
import { drawSpecialElements } from "./drawSpecial.js";
import { drawDimensions } from "./drawDimensions.js";
import { drawAllQLeaders } from "./drawQLeaders.js";
import { drawCartouche } from "./drawCartouche.js";

export function computeScale(geometry, conditions, canvasW, canvasH, draw) {
  const totalHeight = (geometry.Z_sup - geometry.Z_inf) * 1000 + conditions.contextHeightInf + conditions.contextHeightSup;
  const margin = draw.leaderMargin * 2 + 120;
  const scaleX = (canvasW - margin) / geometry.thickness;
  const scaleY = (canvasH - 160) / totalHeight;
  const scaleAuto = Math.min(scaleX, scaleY);
  if (draw.scale === "auto") return scaleAuto;
  const denom = Number(draw.scale.replace("1:", ""));
  return scaleAuto * (25 / denom);
}

export function computeOrigins(canvas, geometry, conditions, scale, draw) {
  const wallW = geometry.thickness * scale;
  const wallH = (geometry.Z_sup - geometry.Z_inf) * 1000 * scale;
  const futureH = conditions.contextHeightSup * scale;
  const previousH = conditions.contextHeightInf * scale;
  const contentH = wallH + futureH + previousH;
  const wallX = Math.round((canvas.width - wallW) / 2);
  const wallY = Math.round((canvas.height - contentH) / 2 + futureH);

  return {
    wallX,
    wallY,
    wallW,
    wallH,
    futureH,
    previousH,
    baselineY: wallY + wallH,
    leaderLeftX: wallX - draw.leaderMargin,
    leaderRightX: wallX + wallW + draw.leaderMargin,
  };
}

export function renderAll(ctx, canvas, model) {
  const { geometry, rebar, conditions, special, draw, barPositions, derived, barOverrides, interaction } = model;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const scale = computeScale(geometry, conditions, canvas.width, canvas.height, draw);
  const origins = computeOrigins(canvas, geometry, conditions, scale, draw);

  drawZoneContext(ctx, "previous", origins, draw);
  drawZoneContext(ctx, "future", origins, draw);
  drawWall(ctx, origins, draw);
  if (draw.gridEnabled) drawGrid(ctx, origins, scale, draw);
  drawSpecialElements(ctx, special, origins, scale, draw);
  drawEndConditions(ctx, "inf", rebar, conditions, derived, barPositions, origins, scale, draw);
  drawEndConditions(ctx, "sup", rebar, conditions, derived, barPositions, origins, scale, draw);
  drawTies(ctx, barPositions.ties, origins, scale, draw);
  drawHorizontalBars(ctx, barPositions.horizontalBars, barOverrides, origins, scale, draw);
  drawVerticalBars(ctx, barPositions.verticalBars, barOverrides, origins, scale, draw, interaction.selectedBar);
  drawDimensions(ctx, geometry, barPositions, origins, scale, draw);
  if (draw.leaderEnabled) drawAllQLeaders(ctx, geometry, rebar, conditions, special, barPositions, origins, scale, draw);
  if (draw.showOrigin) drawOrigin(ctx, origins);
  drawCartouche(ctx, geometry, canvas, scale, draw);

  return { scale, origins };
}
