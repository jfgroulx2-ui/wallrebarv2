export default function AnnotationList({
  annotations,
  selectedId,
  onSelect,
  onDelete,
  onToggleLock,
  onExport,
  canExport,
  currentPage,
}) {
  return (
    <div className="card">
      <div className="card-header">
        <strong>Annotations - Page {currentPage}</strong>
        <span>{annotations.length}</span>
      </div>
      <div className="annotation-list">
        {annotations.length === 0 ? <p className="muted">Aucune annotation sur cette page.</p> : null}
        {annotations.map((annotation) => (
          <div key={annotation.id} className={`annotation-item ${selectedId === annotation.id ? "selected" : ""}`}>
            <button type="button" className="annotation-main" onClick={() => onSelect(annotation.id)}>
              <strong>{annotation.id}</strong>
              <span>
                {annotation.barSize}@{annotation.spacing_mm} {annotation.face}
              </span>
            </button>
            <div className="annotation-actions">
              <button type="button" className="mini-action" onClick={() => onToggleLock(annotation.id)}>
                {annotation.locked ? "Deverr." : "Verrou."}
              </button>
              <button type="button" className="mini-action danger" onClick={() => onDelete(annotation.id)}>
                Suppr.
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="primary-button full-width" type="button" onClick={onExport} disabled={!canExport}>
        Exporter JSON
      </button>
    </div>
  );
}
