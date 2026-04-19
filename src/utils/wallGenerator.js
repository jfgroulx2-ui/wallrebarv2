import { OBJECT_TYPES } from "../constants/objectTypes.js";

export function generateWall(params, originX_mm, originY_mm) {
  const objects = [];

  objects.push({
    type: OBJECT_TYPES.WALL,
    category: "structure",
    layer: "structure",
    visible: true,
    locked: false,
    selected: false,
    geometry: {
      x_mm: originX_mm,
      y_mm: originY_mm,
      width_mm: params.thickness,
      height_mm: params.height,
    },
    properties: {
      label: params.label || "Mur",
      cover_ext_mm: params.coverExt,
      cover_int_mm: params.coverInt,
      hasFooting: params.hasFooting,
    },
    linkedAnnotations: [],
    parentId: null,
    childIds: [],
  });

  if (params.hasFooting) {
    const footingX = originX_mm - (params.footingWidth - params.thickness) / 2 + params.eccentricity;
    objects.push({
      type: OBJECT_TYPES.FOOTING,
      category: "structure",
      layer: "structure",
      visible: true,
      locked: false,
      selected: false,
      geometry: {
        x_mm: footingX,
        y_mm: originY_mm - params.footingThickness,
        width_mm: params.footingWidth,
        height_mm: params.footingThickness,
      },
      properties: {
        eccentricity_mm: params.eccentricity,
      },
      linkedAnnotations: [],
      parentId: null,
      childIds: [],
    });
  }

  if (params.terrainLevel != null) {
    objects.push({
      type: OBJECT_TYPES.REF_LEVEL,
      category: "reference",
      layer: "reference",
      visible: true,
      locked: false,
      selected: false,
      geometry: {
        y_mm: originY_mm + params.terrainLevel,
        x_start_mm: originX_mm - 200,
        x_end_mm: originX_mm + params.thickness + 200,
      },
      properties: {
        label: "Terrain naturel",
        elevation_m: params.terrainLevel / 1000,
        style: "dashed",
      },
      linkedAnnotations: [],
      parentId: null,
      childIds: [],
    });
  }

  return objects;
}
