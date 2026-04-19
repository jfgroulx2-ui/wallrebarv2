import { create } from "zustand";
import {
  DEFAULT_DIMENSION_PARAMS,
  DEFAULT_REBAR_PARAMS,
  DEFAULT_SERIES_PARAMS,
  DEFAULT_TOOL,
  DEFAULT_WALL_PARAMS,
} from "../constants/defaults.js";

const defaultParams = {
  wall: DEFAULT_WALL_PARAMS,
  rebar: DEFAULT_REBAR_PARAMS,
  rebar_series: DEFAULT_SERIES_PARAMS,
  line: {},
  rectangle: {},
  polyline: {},
  select: {},
  pan: {},
  dimension: DEFAULT_DIMENSION_PARAMS,
};

export const useToolStore = create((set) => ({
  activeTool: DEFAULT_TOOL,
  toolParams: structuredClone(defaultParams),
  setTool: (tool) => set((state) => ({ activeTool: tool, toolParams: { ...state.toolParams } })),
  updateToolParams: (tool, changes) =>
    set((state) => ({
      toolParams: {
        ...state.toolParams,
        [tool]: {
          ...(state.toolParams[tool] || {}),
          ...changes,
        },
      },
    })),
  resetToolParams: (tool) =>
    set((state) => ({
      toolParams: {
        ...state.toolParams,
        [tool]: structuredClone(defaultParams[tool] || {}),
      },
    })),
}));
