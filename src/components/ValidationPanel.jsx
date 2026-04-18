export default function ValidationPanel({ validations, setActiveTab }) {
  return (
    <div className="card validation-card">
      <div className="card-header">
        <strong>Validations</strong>
        <span>{validations.length} active(s)</span>
      </div>
      <div className="validation-list">
        {validations.length === 0 ? <p className="muted">Aucune alerte active.</p> : null}
        {validations.map((item) => (
          <button key={item.id} type="button" className={`validation-item ${item.level}`} onClick={() => setActiveTab(item.tabId)}>
            <strong>{item.level === "error" ? "Erreur" : "Avertissement"}</strong>
            <span>{item.msg}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
