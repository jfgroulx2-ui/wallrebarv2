export function drawCartouche(ctx, geometry, canvas, scale, draw) {
  const h = 58;
  const y = canvas.height - h - 12;
  ctx.fillStyle = "rgba(8,16,31,0.92)";
  ctx.strokeStyle = "rgba(120,167,255,0.22)";
  ctx.lineWidth = 1;
  ctx.fillRect(16, y, canvas.width - 32, h);
  ctx.strokeRect(16, y, canvas.width - 32, h);
  ctx.fillStyle = "#eef4ff";
  ctx.font = "12px 'DM Sans'";
  ctx.fillText(`[GBI] COUPE TRANSVERSALE - MUR ${geometry.wallMark}`, 28, y + 20);
  ctx.fillText(`f'c=${geometry.fc} MPa | fy=${geometry.fy} MPa | t=${geometry.thickness} mm | Classe ${geometry.exposureClass}`, 28, y + 38);
  ctx.fillText(`Origine: X=${geometry.origin_x_m.toFixed(3)} Y=${geometry.origin_y_m.toFixed(3)} Z=${geometry.origin_z_m.toFixed(3)} m`, 360, y + 20);
  ctx.fillText(`Echelle ${draw.scale === "auto" ? "auto" : draw.scale} | ${new Date().toISOString().slice(0, 10)}`, 360, y + 38);
}
