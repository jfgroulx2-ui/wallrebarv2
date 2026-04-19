import { buildExportJSON, getFilename } from "../utils/jsonExport.js";
import { useDrawingStore } from "../store/useDrawingStore.js";

export default function ExportPanel() {
  const snapshot = useDrawingStore();
  const exportText = JSON.stringify(buildExportJSON(snapshot), null, 2);

  const handleExport = () => {
    const blob = new Blob([exportText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = getFilename("detail");
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="panel-card">
      <div className="panel-title">
        <strong>Export</strong>
        <span>JSON Revit</span>
      </div>
      <button type="button" className="primary-button full-width" onClick={handleExport}>
        Exporter JSON
      </button>
      <pre className="json-preview">{exportText}</pre>
    </div>
  );
}
