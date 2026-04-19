export default function StatusBar({ zoom, cursorWorld, snapPoint, objectCount }) {
  return (
    <div className="status-bar">
      <span>Snap: {snapPoint?.type || "aucun"}</span>
      <span>Zoom: {Math.round(zoom * 100)}%</span>
      <span>x: {cursorWorld.x_mm.toFixed(1)} mm</span>
      <span>y: {cursorWorld.y_mm.toFixed(1)} mm</span>
      <span>Objets: {objectCount}</span>
      <span>Unite: mm</span>
    </div>
  );
}
