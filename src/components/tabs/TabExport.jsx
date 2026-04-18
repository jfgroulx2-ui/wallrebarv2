export default function TabExport({ geometry, exportText, errors, onExportJson }) {
  return (
    <div className="card">
      <div className="card-header">
        <strong>Export</strong>
        <span>{`armature_${geometry.wallMark}_${geometry.thickness}mm_+${geometry.Z_inf.toFixed(3)}-+${geometry.Z_sup.toFixed(3)}.json`}</span>
      </div>
      <div className="export-actions">
        <button className="primary-button" type="button" onClick={onExportJson} disabled={errors.length > 0}>
          Exporter JSON
        </button>
      </div>
      <pre className="export-preview">{exportText}</pre>
      {errors.length > 0 ? <p className="error-note">Corriger les erreurs rouges avant l'export.</p> : null}
    </div>
  );
}
