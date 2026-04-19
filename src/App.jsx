import { useEffect, useMemo } from "react";
import DrawingCanvas from "./canvas/DrawingCanvas.jsx";
import Header from "./components/Header.jsx";
import Toolbar from "./components/Toolbar.jsx";
import PropertyPanel from "./components/PropertyPanel.jsx";
import LayerPanel from "./components/LayerPanel.jsx";
import ExportPanel from "./components/ExportPanel.jsx";
import StatusBar from "./components/StatusBar.jsx";
import ZoomControls from "./components/ZoomControls.jsx";
import TemplatePanel from "./components/TemplatePanel.jsx";
import { TOOLS } from "./constants/toolModes.js";
import { useDrawingStore } from "./store/useDrawingStore.js";
import { useToolStore } from "./store/useToolStore.js";
import { useUIStore } from "./store/useUIStore.js";
import { getWorldBounds } from "./utils/geometry.js";
import { fitView } from "./canvas/viewTransform.js";

const TOOL_SHORTCUTS = {
  l: TOOLS.LINE,
  r: TOOLS.RECTANGLE,
  p: TOOLS.POLYLINE,
  w: TOOLS.WALL,
  b: TOOLS.REBAR,
  s: TOOLS.REBAR_SERIES,
  n: TOOLS.REBAR_LAYER,
  d: TOOLS.DOWEL,
  a: TOOLS.ANNOTATE,
  c: TOOLS.DIMENSION,
};

export default function App() {
  const drawingStore = useDrawingStore();
  const { activeTool, setTool } = useToolStore();
  const cursorWorld = useUIStore((state) => state.cursorWorld);
  const snapPoint = useUIStore((state) => state.snapPoint);

  const selectedObject = drawingStore.selectedIds[0] ? drawingStore.objects[drawingStore.selectedIds[0]] : null;
  const objectCount = useMemo(() => Object.keys(drawingStore.objects).length, [drawingStore.objects]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Delete" && drawingStore.selectedIds[0]) {
        drawingStore.deleteObject(drawingStore.selectedIds[0]);
        return;
      }

      if (event.key === "Escape") {
        setTool(TOOLS.SELECT);
        useUIStore.getState().clearTransient();
        return;
      }

      const nextTool = TOOL_SHORTCUTS[event.key.toLowerCase()];
      if (nextTool) setTool(nextTool);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [drawingStore, setTool]);

  const handleFitView = () => {
    const canvas = document.querySelector(".drawing-canvas");
    if (!canvas) return;
    const bounds = getWorldBounds(drawingStore.objects);
    useDrawingStore.getState().setView(fitView(canvas.clientWidth, canvas.clientHeight, bounds));
  };

  return (
    <div className="studio-shell">
      <Header activeTool={activeTool} cursorWorld={cursorWorld} />

      <main className="studio-layout">
        <Toolbar />

        <section className="canvas-column">
          <div className="canvas-toolbar">
            <div className="canvas-toolbar-title">
              <strong>Zone de dessin</strong>
              <span>Canvas monde en mm avec snap, zoom et pan</span>
            </div>
            <ZoomControls onFit={handleFitView} />
          </div>

          <DrawingCanvas />
          <StatusBar zoom={drawingStore.view.zoom} cursorWorld={cursorWorld} snapPoint={snapPoint} objectCount={objectCount} />
        </section>

        <aside className="right-panel">
          <PropertyPanel selectedObject={selectedObject} />
          <LayerPanel />
          <ExportPanel />
          <TemplatePanel />
        </aside>
      </main>
    </div>
  );
}
