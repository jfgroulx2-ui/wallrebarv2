import { create } from "zustand";

export const useUIStore = create((set) => ({
  cursorWorld: { x_mm: 0, y_mm: 0 },
  snapPoint: null,
  draftObject: null,
  activeRightPanel: "properties",
  setCursorWorld: (cursorWorld) => set({ cursorWorld }),
  setSnapPoint: (snapPoint) => set({ snapPoint }),
  setDraftObject: (draftObject) => set({ draftObject }),
  setActiveRightPanel: (activeRightPanel) => set({ activeRightPanel }),
  clearTransient: () => set({ snapPoint: null, draftObject: null }),
}));
