export function drawAllQLeaders(ctx, geometry, rebar, conditions, special, barPositions, origins, scale, draw) {
  const leaders = [
    { text: `${rebar.vert_ext.size} @ ${rebar.vert_ext.spacing}`, xMm: barPositions.x_ext, yMm: barPositions.H * 0.74 },
    { text: `${rebar.vert_int.size} @ ${rebar.vert_int.spacing}`, xMm: barPositions.x_int, yMm: barPositions.H * 0.55 },
    { text: `${rebar.horiz_ext.size} @ ${rebar.horiz_ext.spacing}`, xMm: barPositions.h_ext_x, yMm: barPositions.H * 0.42 },
    { text: `H = ${barPositions.H} mm`, xMm: geometry.thickness / 2, yMm: barPositions.H * 0.92 },
  ];

  ctx.strokeStyle = "#9fb2d5";
  ctx.fillStyle = "#dce6f6";
  ctx.lineWidth = draw.leaderLineWidth;
  ctx.font = `${draw.leaderFontSize}px 'DM Sans'`;

  leaders.forEach((leader, index) => {
    const side = draw.leaderSide === "left" ? "left" : "right";
    const startX = origins.wallX + leader.xMm * scale;
    const startY = origins.wallY + origins.wallH - leader.yMm * scale;
    const elbowX = side === "right" ? origins.leaderRightX - 18 : origins.leaderLeftX + 18;
    const textX = side === "right" ? origins.leaderRightX : origins.leaderLeftX;
    const textY = startY - index * 2;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(elbowX, textY);
    ctx.lineTo(textX, textY);
    ctx.stroke();
    ctx.fillText(leader.text, side === "right" ? textX + 4 : textX - 100, textY - 4);
  });
}
