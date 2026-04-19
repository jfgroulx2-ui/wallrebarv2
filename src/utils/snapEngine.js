import { getObjectEndpoints, getObjectMidpoints, getWallFaces, projectPointOnSegment, distance } from "./geometry.js";

export const SNAP_MODES = {
  GRID: "grid",
  ENDPOINT: "endpoint",
  MIDPOINT: "midpoint",
  INTERSECTION: "intersection",
  OBJECT_FACE: "object_face",
  COVER: "cover",
  PERPENDICULAR: "perpendicular",
};

function snapGrid(rawPoint, gridSize) {
  return {
    point: {
      x_mm: Math.round(rawPoint.x_mm / gridSize) * gridSize,
      y_mm: Math.round(rawPoint.y_mm / gridSize) * gridSize,
    },
    type: SNAP_MODES.GRID,
  };
}

export function computeSnap(rawPoint_mm, objects, snapModes, gridSize = 10, snapTolerance_mm = 25) {
  const visibleObjects = Object.values(objects).filter((object) => object.visible !== false);

  if (snapModes.includes(SNAP_MODES.ENDPOINT)) {
    for (const object of visibleObjects) {
      for (const endpoint of getObjectEndpoints(object)) {
        if (distance(rawPoint_mm, endpoint) <= snapTolerance_mm) {
          return { point: endpoint, type: SNAP_MODES.ENDPOINT, sourceId: object.id };
        }
      }
    }
  }

  if (snapModes.includes(SNAP_MODES.MIDPOINT)) {
    for (const object of visibleObjects) {
      for (const midpoint of getObjectMidpoints(object)) {
        if (distance(rawPoint_mm, midpoint) <= snapTolerance_mm) {
          return { point: midpoint, type: SNAP_MODES.MIDPOINT, sourceId: object.id };
        }
      }
    }
  }

  if (snapModes.includes(SNAP_MODES.OBJECT_FACE)) {
    for (const object of visibleObjects) {
      for (const face of getWallFaces(object)) {
        const projected = projectPointOnSegment(rawPoint_mm, face);
        if (distance(rawPoint_mm, projected) <= snapTolerance_mm) {
          return { point: projected, type: SNAP_MODES.OBJECT_FACE, sourceId: object.id };
        }
      }
    }
  }

  return snapGrid(rawPoint_mm, gridSize);
}
