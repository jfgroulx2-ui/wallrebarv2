function labelForTool(tool) {
  return {
    select: "Selection",
    pan: "Pan",
    line: "Ligne",
    polyline: "Polyligne",
    rectangle: "Rectangle",
    wall: "Mur",
    rebar: "Barre",
    rebar_series: "Serie",
    rebar_layer: "Nappe",
    dowel: "Goujon",
    annotate: "Annotation",
    dimension: "Cote",
  }[tool] || tool;
}

export default function Header({ activeTool, cursorWorld }) {
  return (
    <header className="studio-header">
      <div>
        <p className="eyebrow">GBI Experts-Conseils</p>
        <h1>Wall Detail Studio</h1>
      </div>
      <div className="header-status">
        <div className="badge neutral">Outil actif: {labelForTool(activeTool)}</div>
        <div className="badge neutral">
          x: {cursorWorld.x_mm.toFixed(1)} mm | y: {cursorWorld.y_mm.toFixed(1)} mm
        </div>
      </div>
    </header>
  );
}
