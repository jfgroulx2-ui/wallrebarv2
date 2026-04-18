function drawHatch(ctx, origins, draw) {
  const { wallX, wallY, wallW, wallH } = origins;
  ctx.save();
  ctx.beginPath();
  ctx.rect(wallX, wallY, wallW, wallH);
  ctx.clip();
  ctx.strokeStyle = draw.hatchColor;
  ctx.globalAlpha = draw.hatchOpacity;
  ctx.lineWidth = draw.hatchLineWidth;
  const spacing = draw.hatchSpacing;
  const diag = Math.max(wallW, wallH) * 2;

  if (draw.hatchPattern === "dot") {
    for (let x = wallX + spacing / 2; x < wallX + wallW; x += spacing) {
      for (let y = wallY + spacing / 2; y < wallY + wallH; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = draw.hatchColor;
        ctx.fill();
      }
    }
  } else {
    for (let i = -diag; i < diag; i += spacing) {
      ctx.beginPath();
      ctx.moveTo(wallX + i, wallY);
      ctx.lineTo(wallX + i + wallH, wallY + wallH);
      ctx.stroke();
      if (draw.hatchPattern === "cross") {
        ctx.beginPath();
        ctx.moveTo(wallX + i + wallH, wallY);
        ctx.lineTo(wallX + i, wallY + wallH);
        ctx.stroke();
      }
    }
  }

  ctx.restore();
}

export function drawZoneContext(ctx, zone, origins) {
  const isFuture = zone === "future";
  const h = isFuture ? origins.futureH : origins.previousH;
  const y = isFuture ? origins.wallY - origins.futureH : origins.wallY + origins.wallH;
  ctx.fillStyle = isFuture ? "#132032" : "#0d1626";
  ctx.fillRect(origins.wallX, y, origins.wallW, h);
  ctx.strokeStyle = "rgba(190,204,226,0.14)";
  ctx.lineWidth = 1;
  ctx.strokeRect(origins.wallX, y, origins.wallW, h);
}

export function drawWall(ctx, origins, draw) {
  ctx.fillStyle = "#1c293d";
  ctx.fillRect(origins.wallX, origins.wallY, origins.wallW, origins.wallH);
  if (draw.hatchEnabled) drawHatch(ctx, origins, draw);
  ctx.strokeStyle = draw.wallLineColor;
  ctx.lineWidth = draw.wallLineWidth;
  ctx.strokeRect(origins.wallX, origins.wallY, origins.wallW, origins.wallH);

  ctx.strokeStyle = draw.jointColor;
  ctx.lineWidth = draw.jointLineWidth;
  ctx.setLineDash(draw.jointStyle === "solid" ? [] : draw.jointStyle === "dashed_dot" ? [10, 5, 2, 5] : [10, 6]);
  ctx.beginPath();
  ctx.moveTo(origins.wallX - 24, origins.wallY);
  ctx.lineTo(origins.wallX + origins.wallW + 24, origins.wallY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(origins.wallX - 24, origins.wallY + origins.wallH);
  ctx.lineTo(origins.wallX + origins.wallW + 24, origins.wallY + origins.wallH);
  ctx.stroke();
  ctx.setLineDash([]);
}
