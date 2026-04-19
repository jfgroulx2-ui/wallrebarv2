export default function ZoomControls({ zoom, onZoomOut, onZoomIn, onFit }) {
  return (
    <div className="zoom-controls">
      <button type="button" className="ghost-button compact" onClick={onZoomOut}>
        -
      </button>
      <span>{Math.round(zoom * 100)}%</span>
      <button type="button" className="ghost-button compact" onClick={onZoomIn}>
        +
      </button>
      <button type="button" className="ghost-button compact" onClick={onFit}>
        Ajuster
      </button>
    </div>
  );
}
