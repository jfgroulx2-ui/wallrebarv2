import { FileUp } from "lucide-react";

function modeLabel(mode) {
  return {
    idle: "Navigation",
    calibrate: "Calibration",
    annot_vertical: "Barre verticale",
    annot_horizontal: "Barre horizontale",
    select: "Selection",
    pan: "Pan",
  }[mode];
}

export default function Header({ calibration, mode, onImportPdf, pdf }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">GBI Experts-Conseils</p>
        <h1>Rebar Annotator</h1>
        <p className="tagline">Annoter l'armature directement sur une coupe PDF, puis exporter en JSON.</p>
      </div>

      <div className="topbar-actions">
        <button className="ghost-button" type="button" onClick={onImportPdf}>
          <FileUp size={16} />
          {pdf.loaded ? "Remplacer PDF" : "Importer PDF"}
        </button>
        <div className={`status-pill ${calibration.validated ? "status-ok" : "status-warning"}`}>
          {calibration.validated ? "Calibre" : "Non calibre"}
        </div>
        <div className="status-pill status-neutral">{modeLabel(mode)}</div>
      </div>
    </header>
  );
}
