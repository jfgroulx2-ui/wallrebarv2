import { OBJECT_TYPES } from "../constants/objectTypes.js";
import { getBarDbMm } from "./geometry.js";
import { normalizeSeriesProperties } from "./seriesCalc.js";
import { generateWall } from "./wallGenerator.js";

export const TEMPLATES = [
  {
    id: "wall_standard",
    label: "Mur standard",
    thumb: "M1",
    description: "Mur 250 avec semelle centree, nappe verticale ext. et horizontale de base.",
    params: {
      label: "Mur standard",
      wallHeight: 3000,
      wallThickness: 250,
      footingWidth: 650,
      footingThickness: 400,
      eccentricity: 0,
      terrainLevel: 0,
      coverExt: 40,
      coverInt: 25,
      vertical: { diameter: "15M", spacing: 200, face: "ext" },
      horizontal: { diameter: "10M", spacing: 300, face: "EF" },
    },
  },
  {
    id: "wall_double_face",
    label: "Mur double face",
    thumb: "M2",
    description: "Deux nappes verticales et une lecture plus proche d'un detail de fondation courant.",
    params: {
      label: "Mur double face",
      wallHeight: 3200,
      wallThickness: 250,
      footingWidth: 700,
      footingThickness: 400,
      eccentricity: 0,
      terrainLevel: 2000,
      coverExt: 40,
      coverInt: 40,
      vertical: [
        { diameter: "15M", spacing: 200, face: "ext", xRatio: 0.2 },
        { diameter: "15M", spacing: 200, face: "int", xRatio: 0.8 },
      ],
      horizontal: { diameter: "10M", spacing: 300, face: "EF", yRatio: 0.55 },
    },
  },
  {
    id: "wall_retaining",
    label: "Mur soutenement",
    thumb: "M3",
    description: "Mur plus haut avec semelle plus large et armature verticale plus dense.",
    params: {
      label: "Mur soutenement",
      wallHeight: 3600,
      wallThickness: 300,
      footingWidth: 900,
      footingThickness: 450,
      eccentricity: 60,
      terrainLevel: 2600,
      coverExt: 50,
      coverInt: 40,
      vertical: { diameter: "20M", spacing: 180, face: "ext" },
      horizontal: { diameter: "15M", spacing: 250, face: "EF", yRatio: 0.5 },
    },
  },
];

function buildSeries({
  direction,
  diameter,
  spacing,
  face,
  cover,
  x_mm,
  y_mm,
  y_start_mm,
  y_end_mm,
  x_start_mm,
  x_end_mm,
}) {
  const vertical = direction === "vertical";
  const lengthMm = vertical ? y_end_mm - y_start_mm : x_end_mm - x_start_mm;

  return {
    type: OBJECT_TYPES.REBAR_SERIES,
    category: "reinforcement",
    layer: "reinforcement",
    geometry: vertical
      ? {
          x_mm,
          y_start_mm,
          y_end_mm,
          direction: "vertical",
          barLength_mm: 600,
        }
      : {
          x_start_mm,
          x_end_mm,
          y_mm,
          direction: "horizontal",
          barLength_mm: 600,
        },
    properties: {
      diameter,
      db_mm: getBarDbMm(diameter),
      spacing_mm: spacing,
      count: null,
      face,
      cover_mm: cover,
      hookStart: null,
      hookEnd: null,
      role: vertical ? "vertical" : "horizontal",
      ...normalizeSeriesProperties(lengthMm, spacing, null),
    },
    linkedAnnotations: [],
    childIds: [],
    parentId: null,
  };
}

export function buildTemplateObjects(template, originX = 0, originY = 0) {
  if (!template) return [];

  const params = template.params;
  const wallObjects = generateWall(
    {
      label: params.label,
      height: params.wallHeight,
      thickness: params.wallThickness,
      coverExt: params.coverExt,
      coverInt: params.coverInt,
      hasFooting: true,
      footingWidth: params.footingWidth,
      footingThickness: params.footingThickness,
      eccentricity: params.eccentricity,
      terrainLevel: params.terrainLevel,
    },
    originX,
    originY,
  );

  const verticalConfigs = Array.isArray(params.vertical) ? params.vertical : [params.vertical];
  const verticalSeries = verticalConfigs.map((config, index) =>
    buildSeries({
      direction: "vertical",
      diameter: config.diameter,
      spacing: config.spacing,
      face: config.face,
      cover: config.face === "int" ? params.coverInt : params.coverExt,
      x_mm: originX + (config.xRatio != null ? params.wallThickness * config.xRatio : params.coverExt + 30 + index * 25),
      y_start_mm: originY + 100,
      y_end_mm: originY + params.wallHeight - 700,
    }),
  );

  const horizontalConfig = params.horizontal;
  const horizontalSeries = horizontalConfig
    ? [
        buildSeries({
          direction: "horizontal",
          diameter: horizontalConfig.diameter,
          spacing: horizontalConfig.spacing,
          face: horizontalConfig.face,
          cover: params.coverExt,
          x_start_mm: originX + 40,
          x_end_mm: originX + params.wallThickness - 40,
          y_mm: originY + params.wallHeight * (horizontalConfig.yRatio ?? 0.5),
        }),
      ]
    : [];

  return [...wallObjects, ...verticalSeries, ...horizontalSeries];
}
