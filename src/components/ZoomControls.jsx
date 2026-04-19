import { Minus, Plus, Scan } from "lucide-react";
import { useDrawingStore } from "../store/useDrawingStore.js";
import { zoomAtPoint } from "../canvas/viewTransform.js";

export default function ZoomControls({ onFit }) {
  const view = useDrawingStore((state) => state.view);
  const setView = useDrawingStore((state) => state.setView);

  const zoom = (factor) => {
    const centerX = window.innerWidth * 0.45;
    const centerY = window.innerHeight * 0.45;
    setView(zoomAtPoint(view, Math.max(0.05, Math.min(50, view.zoom * factor)), centerX, centerY));
  };

  return (
    <div className="zoom-controls">
      <button type="button" className="tool-lite-button" onClick={() => zoom(0.9)}>
        <Minus size={16} />
      </button>
      <span>{Math.round(view.zoom * 100)}%</span>
      <button type="button" className="tool-lite-button" onClick={() => zoom(1.1)}>
        <Plus size={16} />
      </button>
      <button type="button" className="tool-lite-button" onClick={onFit}>
        <Scan size={16} />
        Fit
      </button>
    </div>
  );
}
