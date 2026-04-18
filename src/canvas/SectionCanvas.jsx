import { useEffect, useRef } from "react";
import { renderAll } from "./renderAll.js";

export default function SectionCanvas({ model, onImportPdf, pdf }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    const ctx = canvas.getContext("2d");
    ctx.scale(ratio, ratio);
    renderAll(ctx, { width: rect.width, height: rect.height }, model);
  }, [model]);

  return (
    <div className="canvas-shell">
      <div className="canvas-toolbar">
        <div>
          <strong>Coupe transversale</strong>
          <span>Rendu statique MVP - calculs et export priorises</span>
        </div>
        <button className="ghost-button compact" type="button" onClick={onImportPdf}>
          {pdf.loaded ? `PDF: ${pdf.fileName}` : "Importer PDF"}
        </button>
      </div>
      <canvas ref={canvasRef} className="section-canvas" />
      {pdf.loaded ? <div className="pdf-banner">PDF de reference charge: {pdf.fileName}</div> : null}
    </div>
  );
}
