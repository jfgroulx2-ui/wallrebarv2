export function renderGrid(ctx, canvas, view, grid) {
  if (!grid.visible) return;

  let spacing = grid.spacing;
  const minPx = 8;
  while (spacing * view.zoom < minPx) spacing *= 5;
  while (spacing * view.zoom > minPx * 10 && spacing > grid.spacing) spacing /= 5;

  const stepPx = spacing * view.zoom;
  const startWorldX = -(view.offsetX / view.zoom);
  const endWorldX = (canvas.width - view.offsetX) / view.zoom;
  const startWorldY = -((canvas.height - view.offsetY) / view.zoom);
  const endWorldY = view.offsetY / view.zoom;

  const firstX = Math.floor(startWorldX / spacing) * spacing;
  const firstY = Math.floor(startWorldY / spacing) * spacing;

  ctx.save();
  ctx.strokeStyle = grid.color;
  ctx.lineWidth = 0.5;

  for (let worldX = firstX; worldX <= endWorldX; worldX += spacing) {
    const x = worldX * view.zoom + view.offsetX;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let worldY = firstY; worldY <= endWorldY; worldY += spacing) {
    const y = -worldY * view.zoom + view.offsetY;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.restore();
}
