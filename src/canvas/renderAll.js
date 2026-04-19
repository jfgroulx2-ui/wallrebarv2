import { renderGrid } from "./renderGrid.js";
import { renderObject } from "./renderObjects.js";
import { renderSelectionHandles } from "./renderSelection.js";
import { renderSnapIndicator } from "./renderSnapIndicator.js";

export function renderAll(ctx, canvas, storeSnapshot) {
  const { objects, objectOrder, view, grid, layers, selectedIds, draftObject, snapPoint } = storeSnapshot;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#0a0f1e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  renderGrid(ctx, canvas, view, grid);

  const orderedObjects = objectOrder
    .map((id) => objects[id])
    .filter((object) => object && layers[object.category]?.visible);

  ["structure", "geometry", "reinforcement", "reference", "annotation"].forEach((category) => {
    orderedObjects
      .filter((object) => object.category === category)
      .forEach((object) => renderObject(ctx, object, view, selectedIds.includes(object.id), false));
  });

  if (draftObject) {
    renderObject(ctx, draftObject, view, false, true);
  }

  if (snapPoint) {
    renderSnapIndicator(ctx, snapPoint, view);
  }

  selectedIds.forEach((id) => {
    if (objects[id]) renderSelectionHandles(ctx, objects[id], view);
  });
}
