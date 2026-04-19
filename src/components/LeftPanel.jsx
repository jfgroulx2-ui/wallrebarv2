import CalibrationPanel from "./CalibrationPanel.jsx";
import AnnotationList from "./AnnotationList.jsx";
import PropertyPanel from "./PropertyPanel.jsx";

const TOOLS = [
  { id: "pan", label: "Pan / Zoom" },
  { id: "annot_vertical", label: "Barre verticale" },
  { id: "annot_horizontal", label: "Barre horizontale" },
  { id: "select", label: "Selectionner" },
];

export default function LeftPanel({
  pdf,
  calibration,
  mode,
  setMode,
  currentAnnotations,
  selectedAnnotation,
  selectedId,
  onSelectAnnotation,
  onDeleteAnnotation,
  onToggleLock,
  onUpdateAnnotation,
  onDuplicateAnnotation,
  onExport,
  onStartCalibration,
  onCancelCalibration,
  onCalibrationDistanceChange,
  onValidateCalibration,
  onResetCalibration,
  onConfirmCalibration,
  canExport,
}) {
  return (
    <aside className="left-panel">
      {!pdf.loaded ? <p className="muted">En attente d'un PDF...</p> : null}

      {pdf.loaded ? (
        <div className="step-status card">
          <div className="card-header">
            <strong>PDF charge</strong>
            <span>{pdf.sourceName}</span>
          </div>
        </div>
      ) : null}

      {pdf.loaded ? (
        <CalibrationPanel
          calibration={calibration}
          onStart={onStartCalibration}
          onCancel={onCancelCalibration}
          onChangeDistance={onCalibrationDistanceChange}
          onValidate={onValidateCalibration}
          onReset={onResetCalibration}
          onConfirm={onConfirmCalibration}
        />
      ) : null}

      {pdf.loaded && calibration.validated ? (
        <div className="card">
          <div className="card-header">
            <strong>Outils</strong>
            <span>V / H / S / Echap</span>
          </div>
          <div className="tool-grid">
            {TOOLS.map((tool) => (
              <button
                key={tool.id}
                type="button"
                className={`tool-button ${mode === tool.id ? "active" : ""}`}
                onClick={() => setMode(tool.id)}
              >
                {tool.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {selectedAnnotation ? (
        <PropertyPanel
          annotation={selectedAnnotation}
          onChange={onUpdateAnnotation}
          onDelete={onDeleteAnnotation}
          onDuplicate={onDuplicateAnnotation}
          onBack={() => onSelectAnnotation(null)}
        />
      ) : (
        <AnnotationList
          annotations={currentAnnotations}
          selectedId={selectedId}
          onSelect={onSelectAnnotation}
          onDelete={onDeleteAnnotation}
          onToggleLock={onToggleLock}
          onExport={onExport}
          canExport={canExport}
          currentPage={pdf.currentPage}
        />
      )}
    </aside>
  );
}
