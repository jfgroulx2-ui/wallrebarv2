const BAR_SIZES = ["10M", "15M", "20M", "25M", "30M", "35M"];

export default function PropertyPanel({
  annotation,
  onChange,
  onDelete,
  onDuplicate,
  onBack,
}) {
  if (!annotation) return null;

  return (
    <div className="card">
      <div className="card-header">
        <strong>{annotation.id}</strong>
        <div className="inline-actions tight">
          <button type="button" className="mini-action danger" onClick={() => onDelete(annotation.id)}>
            Suppr.
          </button>
        </div>
      </div>
      <button type="button" className="ghost-button full-width" onClick={onBack}>
        Retour a la liste
      </button>

      <div className="field">
        <span className="field-label">Diametre</span>
        <div className="chip-row">
          {BAR_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              className={`chip-button ${annotation.barSize === size ? "active" : ""}`}
              onClick={() => onChange(annotation.id, { barSize: size })}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <label className="field">
        <span className="field-label">Espacement (mm)</span>
        <input type="number" value={annotation.spacing_mm} onChange={(event) => onChange(annotation.id, { spacing_mm: Number(event.target.value) })} />
      </label>

      <label className="field">
        <span className="field-label">Face</span>
        <select value={annotation.face} onChange={(event) => onChange(annotation.id, { face: event.target.value })}>
          <option value="EF">EF</option>
          <option value="ext">Ext.</option>
          <option value="int">Int.</option>
        </select>
      </label>

      <label className="field">
        <span className="field-label">Recouvrement (mm)</span>
        <input type="number" value={annotation.cover_mm} onChange={(event) => onChange(annotation.id, { cover_mm: Number(event.target.value) })} />
      </label>

      <label className="field">
        <span className="field-label">Note libre</span>
        <input value={annotation.note} onChange={(event) => onChange(annotation.id, { note: event.target.value })} />
      </label>

      <div className="metrics-box">
        <strong>Dimensions mesurees</strong>
        <span>Longueur: {annotation.length_mm ?? "-"} mm</span>
        <span>Position X: {annotation.x_mm ?? "-"} mm</span>
        <span>Position Y: {annotation.y_mm ?? "-"} mm</span>
      </div>

      <div className="inline-actions">
        <button className="ghost-button" type="button" onClick={() => onDuplicate(annotation.id)}>
          Dupliquer
        </button>
      </div>
    </div>
  );
}
