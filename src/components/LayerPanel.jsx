import { useDrawingStore } from "../store/useDrawingStore.js";

export default function LayerPanel() {
  const layers = useDrawingStore((state) => state.layers);
  const toggleLayerVisibility = useDrawingStore((state) => state.toggleLayerVisibility);

  return (
    <div className="panel-card">
      <div className="panel-title">
        <strong>Calques</strong>
        <span>Visibilite</span>
      </div>
      <div className="layer-list">
        {Object.entries(layers).map(([name, layer]) => (
          <label key={name} className="layer-row">
            <input type="checkbox" checked={layer.visible} onChange={() => toggleLayerVisibility(name)} />
            <span>{layer.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
