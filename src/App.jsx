import { useEffect, useMemo, useRef, useState } from "react";
import Header from "./components/Header.jsx";
import LeftPanel from "./components/LeftPanel.jsx";
import CanvasMain from "./canvas/CanvasMain.jsx";
import { loadPDF, renderPage } from "./utils/pdfLoader.js";
import { computeCalibration } from "./utils/calibration.js";
import {
  addAnnotation,
  applyCalibrationToAnnotations,
  buildAnnotation,
  deleteAnnotation,
  duplicateAnnotation,
  updateAnnotation,
} from "./utils/annotations.js";
import { buildExportJSON, getFilename } from "./utils/jsonExport.js";

const MODES = {
  IDLE: "idle",
  CALIBRATE: "calibrate",
  ANNOT_V: "annot_vertical",
  ANNOT_H: "annot_horizontal",
  SELECT: "select",
  PAN: "pan",
};

export default function App() {
  const fileInputRef = useRef(null);
  const pdfDocRef = useRef(null);
  const annotationCounter = useRef(1);

  const [pdf, setPdf] = useState({
    loaded: false,
    bitmap: null,
    pageCount: 0,
    currentPage: 1,
    nativeW: 0,
    nativeH: 0,
    sourceName: "",
    annotations: {},
  });

  const [calibration, setCalibration] = useState({
    active: false,
    point1: null,
    point2: null,
    distanceMm: "",
    distancePx: null,
    scalePxMm: null,
    validated: false,
    label: "",
  });

  const [view, setView] = useState({
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
  });

  const [mode, setMode] = useState(MODES.IDLE);
  const [selectedId, setSelectedId] = useState(null);
  const [draftAnnotation, setDraftAnnotation] = useState(null);

  const currentAnnotations = pdf.annotations[pdf.currentPage] || [];
  const selectedAnnotation = currentAnnotations.find((annotation) => annotation.id === selectedId) || null;
  const canExport = pdf.loaded && calibration.validated;

  useEffect(() => {
    return () => {
      if (pdf.bitmap?.close) pdf.bitmap.close();
    };
  }, [pdf.bitmap]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key.toLowerCase() === "v" && calibration.validated) setMode(MODES.ANNOT_V);
      if (event.key.toLowerCase() === "h" && calibration.validated) setMode(MODES.ANNOT_H);
      if (event.key.toLowerCase() === "s" && calibration.validated) setMode(MODES.SELECT);
      if (event.key === "Escape") {
        setMode(MODES.IDLE);
        setDraftAnnotation(null);
      }
      if (event.key === "Delete" && selectedId) {
        setPdf((prev) => ({
          ...prev,
          annotations: deleteAnnotation(prev.annotations, prev.currentPage, selectedId),
        }));
        setSelectedId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, calibration.validated]);

  const exportData = useMemo(() => buildExportJSON(pdf, calibration), [pdf, calibration]);
  const exportText = useMemo(() => JSON.stringify(exportData, null, 2), [exportData]);

  const handleOpenFileDialog = () => fileInputRef.current?.click();

  const handleLoadFile = async (file) => {
    if (!file || file.type !== "application/pdf") return;

    const result = await loadPDF(file, 1);
    pdfDocRef.current = result.pdfDoc;

    setPdf({
      loaded: true,
      bitmap: result.bitmap,
      pageCount: result.pageCount,
      currentPage: result.currentPage,
      nativeW: result.nativeW,
      nativeH: result.nativeH,
      sourceName: result.sourceName,
      annotations: {},
    });

    setCalibration({
      active: false,
      point1: null,
      point2: null,
      distanceMm: "",
      distancePx: null,
      scalePxMm: null,
      validated: false,
      label: "",
    });
    setView({ zoom: 1, offsetX: 0, offsetY: 0 });
    setMode(MODES.IDLE);
    setSelectedId(null);
    setDraftAnnotation(null);
    annotationCounter.current = 1;
  };

  const handleFileInput = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await handleLoadFile(file);
    event.target.value = "";
  };

  const handleChangePage = async (nextPage) => {
    if (!pdfDocRef.current || nextPage < 1 || nextPage > pdf.pageCount) return;
    const pageData = await renderPage(pdfDocRef.current, nextPage);
    setPdf((prev) => ({
      ...prev,
      ...pageData,
    }));
    setSelectedId(null);
    setDraftAnnotation(null);
  };

  const handleCreateAnnotation = (draft) => {
    const id = `ANN-${String(annotationCounter.current++).padStart(3, "0")}`;
    const annotation = buildAnnotation({
      ...draft,
      id,
      page: pdf.currentPage,
      scalePxMm: calibration.validated ? calibration.scalePxMm : null,
    });

    setPdf((prev) => ({
      ...prev,
      annotations: addAnnotation(prev.annotations, prev.currentPage, annotation),
    }));
    setSelectedId(id);
  };

  const handleUpdateAnnotation = (id, changes) => {
    setPdf((prev) => ({
      ...prev,
      annotations: updateAnnotation(
        prev.annotations,
        prev.currentPage,
        id,
        changes,
        calibration.validated ? calibration.scalePxMm : null,
      ),
    }));
  };

  const handleDeleteAnnotation = (id) => {
    setPdf((prev) => ({
      ...prev,
      annotations: deleteAnnotation(prev.annotations, prev.currentPage, id),
    }));
    if (selectedId === id) setSelectedId(null);
  };

  const handleToggleLock = (id) => {
    const annotation = currentAnnotations.find((item) => item.id === id);
    if (!annotation) return;
    handleUpdateAnnotation(id, { locked: !annotation.locked });
  };

  const handleDuplicateAnnotation = (id) => {
    const nextId = `ANN-${String(annotationCounter.current++).padStart(3, "0")}`;
    setPdf((prev) => ({
      ...prev,
      annotations: duplicateAnnotation(
        prev.annotations,
        prev.currentPage,
        id,
        nextId,
        calibration.validated ? calibration.scalePxMm : null,
      ),
    }));
  };

  const handleStartCalibration = () => {
    setCalibration((prev) => ({
      ...prev,
      active: true,
      point1: null,
      point2: null,
      distanceMm: "",
      distancePx: null,
      validated: false,
      scalePxMm: null,
      label: "",
    }));
    setMode(MODES.CALIBRATE);
    setSelectedId(null);
  };

  const handleCancelCalibration = () => {
    setCalibration((prev) => ({ ...prev, active: false, point1: null, point2: null, distanceMm: "", distancePx: null }));
    setMode(MODES.IDLE);
  };

  const handleValidateCalibration = () => {
    if (!calibration.point1 || !calibration.point2 || !calibration.distanceMm) return;
    const result = computeCalibration(calibration.point1, calibration.point2, calibration.distanceMm);
    setCalibration((prev) => ({
      ...prev,
      ...result,
      validated: true,
      active: false,
    }));
    setPdf((prev) => ({
      ...prev,
      annotations: applyCalibrationToAnnotations(prev.annotations, result.scalePxMm),
    }));
  };

  const handleResetCalibration = () => {
    setCalibration({
      active: false,
      point1: null,
      point2: null,
      distanceMm: "",
      distancePx: null,
      scalePxMm: null,
      validated: false,
      label: "",
    });
    setPdf((prev) => ({
      ...prev,
      annotations: applyCalibrationToAnnotations(prev.annotations, null),
    }));
    setMode(MODES.IDLE);
  };

  const handleConfirmCalibration = () => {
    setMode(MODES.SELECT);
  };

  const handleExport = () => {
    const blob = new Blob([exportText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = getFilename(pdf.sourceName);
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-shell">
      <Header calibration={calibration} mode={mode} onImportPdf={handleOpenFileDialog} pdf={pdf} />

      <input ref={fileInputRef} type="file" accept="application/pdf" hidden onChange={handleFileInput} />

      <main className="annotator-layout">
        <LeftPanel
          pdf={pdf}
          calibration={calibration}
          mode={mode}
          setMode={setMode}
          currentAnnotations={currentAnnotations}
          selectedAnnotation={selectedAnnotation}
          selectedId={selectedId}
          onSelectAnnotation={setSelectedId}
          onDeleteAnnotation={handleDeleteAnnotation}
          onToggleLock={handleToggleLock}
          onUpdateAnnotation={handleUpdateAnnotation}
          onDuplicateAnnotation={handleDuplicateAnnotation}
          onExport={handleExport}
          onStartCalibration={handleStartCalibration}
          onCancelCalibration={handleCancelCalibration}
          onCalibrationDistanceChange={(distanceMm) => setCalibration((prev) => ({ ...prev, distanceMm }))}
          onValidateCalibration={handleValidateCalibration}
          onResetCalibration={handleResetCalibration}
          onConfirmCalibration={handleConfirmCalibration}
          canExport={canExport}
        />

        <section className="canvas-panel">
          <CanvasMain
            pdf={pdf}
            calibration={calibration}
            setCalibration={setCalibration}
            view={view}
            setView={setView}
            mode={mode}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            draftAnnotation={draftAnnotation}
            setDraftAnnotation={setDraftAnnotation}
            currentAnnotations={currentAnnotations}
            onCreateAnnotation={handleCreateAnnotation}
            onUpdateAnnotation={handleUpdateAnnotation}
            onOpenFileDialog={handleOpenFileDialog}
            onDropFile={handleLoadFile}
            onChangePage={handleChangePage}
          />
        </section>
      </main>
    </div>
  );
}
