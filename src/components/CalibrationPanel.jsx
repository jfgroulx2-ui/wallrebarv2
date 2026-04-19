export default function CalibrationPanel({
  calibration,
  onStart,
  onCancel,
  onChangeDistance,
  onValidate,
  onReset,
  onConfirm,
}) {
  if (!calibration.validated && !calibration.active && !calibration.point1 && !calibration.point2) {
    return (
      <div className="card">
        <div className="card-header">
          <strong>Etape 2</strong>
          <span>Calibration</span>
        </div>
        <button className="primary-button full-width" type="button" onClick={onStart}>
          Calibrer l'echelle
        </button>
      </div>
    );
  }

  if (!calibration.validated) {
    return (
      <div className="card">
        <div className="card-header">
          <strong>Calibration en cours</strong>
          <span>{calibration.active ? "Mode actif" : "En attente de validation"}</span>
        </div>
        <div className="step-list">
          <div>Point 1 : {calibration.point1 ? "place" : "a placer"}</div>
          <div>Point 2 : {calibration.point2 ? "place" : "a placer"}</div>
        </div>
        {calibration.point1 && calibration.point2 ? (
          <>
            <label className="field">
              <span className="field-label">Distance reelle (mm)</span>
              <input
                type="number"
                value={calibration.distanceMm}
                onChange={(event) => onChangeDistance(event.target.value)}
              />
            </label>
            <div className="info-strip">Distance mesuree : {calibration.distancePx ?? 0} px</div>
            <div className="inline-actions">
              <button className="primary-button" type="button" onClick={onValidate} disabled={!calibration.distanceMm}>
                Valider
              </button>
              <button className="ghost-button" type="button" onClick={onReset}>
                Recommencer
              </button>
            </div>
          </>
        ) : (
          <button className="ghost-button full-width" type="button" onClick={onCancel}>
            Annuler
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <strong>Calibration enregistree</strong>
        <span>{calibration.label}</span>
      </div>
      <div className="step-list">
        <div>Distance mesuree : {calibration.distancePx} px</div>
        <div>Distance saisie : {calibration.distanceMm} mm</div>
        <div>Echelle calculee : {calibration.scalePxMm?.toFixed(3)} px/mm</div>
      </div>
      <div className="inline-actions">
        <button className="ghost-button" type="button" onClick={onReset}>
          Recalibrer
        </button>
        <button className="primary-button" type="button" onClick={onConfirm}>
          Confirmer et annoter
        </button>
      </div>
    </div>
  );
}
