import { useEffect, useMemo, useRef, useState } from "react";
import { defaultBarOverrides, defaultConditions, defaultDraw, defaultGeometry, defaultInteraction, defaultPdf, defaultRebar, defaultSpecial } from "./constants/defaults.js";
import { computeAllDerivedLengths } from "./utils/calculations.js";
import { computeBarPositions } from "./utils/coordinates.js";
import { runValidations } from "./utils/validations.js";
import { generateJSON, getFilename } from "./utils/jsonExport.js";
import Header from "./components/Header.jsx";
import TabBar from "./components/TabBar.jsx";
import ValidationPanel from "./components/ValidationPanel.jsx";
import LengthTable from "./components/LengthTable.jsx";
import GuideDrawer from "./components/GuideDrawer.jsx";
import BarDialog from "./components/BarDialog.jsx";
import SnapHUD from "./components/SnapHUD.jsx";
import SectionCanvas from "./canvas/SectionCanvas.jsx";
import TabGeometry from "./components/tabs/TabGeometry.jsx";
import TabRebar from "./components/tabs/TabRebar.jsx";
import TabJoints from "./components/tabs/TabJoints.jsx";
import TabSpecial from "./components/tabs/TabSpecial.jsx";
import TabAppearance from "./components/tabs/TabAppearance.jsx";
import TabReference from "./components/tabs/TabReference.jsx";
import TabExport from "./components/tabs/TabExport.jsx";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export default function App() {
  const inputRef = useRef(null);
  const [activeTab, setActiveTab] = useState(1);
  const [guideOpen, setGuideOpen] = useState(false);
  const [geometry, setGeometry] = useState(clone(defaultGeometry));
  const [rebar, setRebar] = useState(clone(defaultRebar));
  const [conditions, setConditions] = useState(clone(defaultConditions));
  const [special, setSpecial] = useState(clone(defaultSpecial));
  const [draw, setDraw] = useState(clone(defaultDraw));
  const [barOverrides, setBarOverrides] = useState(clone(defaultBarOverrides));
  const [interaction, setInteraction] = useState(clone(defaultInteraction));
  const [pdf, setPdf] = useState(clone(defaultPdf));

  useEffect(() => {
    return () => {
      if (pdf.url) URL.revokeObjectURL(pdf.url);
    };
  }, [pdf.url]);

  const derived = useMemo(() => computeAllDerivedLengths(geometry, rebar), [geometry, rebar]);
  const barPositions = useMemo(() => computeBarPositions(geometry, rebar), [geometry, rebar]);
  const validations = useMemo(() => runValidations(geometry, rebar, conditions, special, derived), [geometry, rebar, conditions, special, derived]);
  const errors = validations.filter((item) => item.level === "error");
  const warnings = validations.filter((item) => item.level === "warning");
  const exportPayload = useMemo(() => generateJSON(geometry, rebar, conditions, special, derived, barPositions, barOverrides, pdf), [geometry, rebar, conditions, special, derived, barPositions, barOverrides, pdf]);
  const exportText = useMemo(() => JSON.stringify(exportPayload, null, 2), [exportPayload]);

  const handleImportPdf = () => inputRef.current?.click();

  const onPdfChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPdf((current) => {
      if (current.url) URL.revokeObjectURL(current.url);
      return {
        loaded: true,
        fileName: file.name,
        url: URL.createObjectURL(file),
        calibrated: false,
      };
    });
  };

  const handleExportJson = () => {
    const blob = new Blob([exportText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = getFilename(geometry);
    link.click();
    URL.revokeObjectURL(url);
  };

  const tabProps = {
    geometry,
    rebar,
    conditions,
    special,
    draw,
    setGeometry,
    setRebar,
    setConditions,
    setSpecial,
    setDraw,
    derived,
    barPositions,
    exportText,
    errors,
    onExportJson: handleExportJson,
  };

  return (
    <div className="app-shell">
      <Header errors={errors} warnings={warnings} onImportPdf={handleImportPdf} pdf={pdf} />
      <input ref={inputRef} type="file" accept="application/pdf" onChange={onPdfChange} hidden />

      <main className="app-layout">
        <aside className="left-panel">
          <div className="panel-topline">
            <strong>Parametres</strong>
            <button type="button" className="ghost-button compact" onClick={() => setGuideOpen((value) => !value)}>
              {guideOpen ? "Masquer guide" : "Afficher guide"}
            </button>
          </div>

          <TabBar activeTab={activeTab} setActiveTab={setActiveTab} validations={validations} />

          <div className="tab-content">
            {activeTab === 1 ? <TabGeometry {...tabProps} /> : null}
            {activeTab === 2 ? <TabRebar {...tabProps} /> : null}
            {activeTab === 3 ? <TabJoints {...tabProps} /> : null}
            {activeTab === 4 ? <TabSpecial {...tabProps} /> : null}
            {activeTab === 5 ? <TabAppearance {...tabProps} /> : null}
            {activeTab === 6 ? <TabReference {...tabProps} /> : null}
            {activeTab === 7 ? <TabExport {...tabProps} /> : null}
          </div>

          <ValidationPanel validations={validations} setActiveTab={setActiveTab} />
        </aside>

        <section className="right-panel">
          <SectionCanvas model={{ geometry, rebar, conditions, special, draw, barPositions, derived, barOverrides, interaction }} onImportPdf={handleImportPdf} pdf={pdf} />
          <LengthTable derived={derived} rebar={rebar} />
          <SnapHUD interaction={interaction} />
        </section>
      </main>

      <GuideDrawer activeTab={activeTab} open={guideOpen} onClose={() => setGuideOpen(false)} />
      <BarDialog interaction={interaction} onClose={() => setInteraction((prev) => ({ ...prev, showDialog: false }))} />
    </div>
  );
}
