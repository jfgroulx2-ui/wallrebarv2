import { TOOLS } from "./toolModes.js";

export const DEFAULT_VIEW = {
  zoom: 0.25,
  offsetX: 320,
  offsetY: 520,
};

export const DEFAULT_GRID = {
  visible: true,
  spacing: 10,
  snapSize: 10,
  color: "rgba(255,255,255,0.05)",
};

export const DEFAULT_TOOL = TOOLS.SELECT;

export const DEFAULT_WALL_PARAMS = {
  label: "Mur M-01",
  height: 3000,
  thickness: 250,
  coverExt: 40,
  coverInt: 25,
  hasFooting: true,
  footingWidth: 650,
  footingThickness: 400,
  eccentricity: 0,
  terrainLevel: 0,
  slabLevel: null,
};

export const DEFAULT_REBAR_PARAMS = {
  diameter: "15M",
  face: "single",
  cover_mm: 40,
  hookStart: null,
  hookEnd: null,
  hookStartDirection: "left",
  hookEndDirection: "left",
  role: "vertical",
};

export const DEFAULT_SERIES_PARAMS = {
  diameter: "15M",
  spacing_mm: 200,
  count: 0,
  face: "EF",
  cover_mm: 40,
  hookStart: null,
  hookEnd: null,
  hookStartDirection: "left",
  hookEndDirection: "left",
  direction: "vertical",
};

export const DEFAULT_DIMENSION_PARAMS = {
  offset: -30,
};
