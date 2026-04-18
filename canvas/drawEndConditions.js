import { drawHook } from "./drawHook.js";

function drawVerticalProjection(ctx, x, yStart, yEnd, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, yStart);
  ctx.lineTo(x, yEnd);
  ctx.stroke();
}

export function drawEndConditions(ctx, side, rebar, conditions, derived, barPositions, origins, scale, draw) {
  const top = side === "sup";
  barPositions.verticalBars.forEach((bar) => {
    const condition = bar.face === "exterior" ? conditions[side].ext : conditions[side].int;
    if (condition.type === "continue" || condition.type === "terminee") return;

    const x = origins.wallX + bar.x_mm * scale;
    const baseY = top ? origins.wallY : origins.wallY + origins.wallH;
    const baseLength = bar.face === "exterior" ? derived.vert_ext.ld : derived.vert_int.ld;
    const length = (condition.l_override ?? baseLength) * scale;
    const targetY = top ? baseY - length : baseY + length;

    drawVerticalProjection(ctx, x, baseY, targetY, "#f59e0b");

    if (condition.type === "hook_90") drawHook(ctx, x, targetY, bar.size, 90, top ? "up" : "down", scale, draw);
    if (condition.type === "hook_180") drawHook(ctx, x, targetY, bar.size, 180, top ? "up" : "down", scale, draw);
    if (condition.type === "hook_135") drawHook(ctx, x, targetY, bar.size, 135, top ? "up" : "down", scale, draw);
  });
}
