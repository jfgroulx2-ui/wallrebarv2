import { FileUp } from "lucide-react";

function getStatus(errors, warnings) {
  if (errors.length) return { label: "Erreur", className: "status-error" };
  if (warnings.length) return { label: `${warnings.length} avert.`, className: "status-warning" };
  return { label: "Conforme", className: "status-ok" };
}

export default function Header({ errors, warnings, onImportPdf, pdf }) {
  const status = getStatus(errors, warnings);

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">GBI Experts-Conseils</p>
        <h1>Wall Section Tool</h1>
        <p className="tagline">Design once. Export. Execute.</p>
      </div>

      <div className="topbar-actions">
        <button className="ghost-button" type="button" onClick={onImportPdf}>
          <FileUp size={16} />
          {pdf.loaded ? "Remplacer PDF" : "Importer PDF"}
        </button>
        <div className={`status-pill ${status.className}`}>{status.label}</div>
      </div>
    </header>
  );
}
