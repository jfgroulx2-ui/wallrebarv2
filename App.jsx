import { useEffect, useMemo, useRef, useState } from "react";
import { Download, FileText, FileUp, Layers3 } from "lucide-react";
import { BAR_OPTIONS, BARS, EXPOSURE_CLASSES } from "./constants/csaData.js";
import { computeAllDerivedLengths } from "./utils/calculations.js";
import { generateJSON, getFilename } from "./utils/jsonExport.js";

const initialProject = {
  wallMark: "M-01",
  planRef: "S-101",
  engineer: "",
};

const initialGeometry = {
  origin_x_m: 0,
  origin_y_m: 0,
  origin_z_m: 0,
  thickness: 250,
  Z_inf: 0,
  Z_sup: 3.65,
  fc: 30,
  fy: 400,
  lambda: 1,
  exposureClass: "C-2",
  k1: 1,
  k2: 1,
};

const initialRebar = {
  vert_ext: { size: "15M", spacing: 200, cover: 40 },
  vert_int: { size: "15M", spacing: 200, cover: 25 },
  horiz_ext: { size: "10M", spacing: 300 },
  horiz_int: { size: "10M", spacing: 300 },
  ties: { size: "10M", spacing_v: 400, spacing_h: 600, hook: 135 },
};

function Section({ title, summary, children, defaultOpen = true }) {
  return (
    <details className="panel-section" open={defaultOpen}>
      <summary>
        <span>{title}</span>
        <small>{summary}</small>
      </summary>
      <div className="panel-section-body">{children}</div>
    </details>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint ? <small className="field-hint">{hint}</small> : null}
    </label>
  );
}

function NumberField({ value, onChange, min, max, step = 1 }) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  );
}

function TextField({ value, onChange }) {
  return <input type="text" value={value} onChange={(event) => onChange(event.target.value)} />;
}

function SelectField({ value, onChange, options }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function computeRatios(geometry, rebar) {
  const rhoV =
    (BARS[rebar.vert_ext.size].Ab / rebar.vert_ext.spacing +
      BARS[rebar.vert_int.size].Ab / rebar.vert_int.spacing) /
    geometry.thickness;
  const rhoH =
    (BARS[rebar.horiz_ext.size].Ab / rebar.horiz_ext.spacing +
      BARS[rebar.horiz_int.size].Ab / rebar.horiz_int.spacing) /
    geometry.thickness;

  return {
    rhoV: rhoV / 100,
    rhoH: rhoH / 100,
  };
}

function formatPercent(value) {
  return `${(value * 100).toFixed(2)}%`;
}

export default function App() {
  const inputRef = useRef(null);
  const [project, setProject] = useState(initialProject);
  const [geometry, setGeometry] = useState(initialGeometry);
  const [rebar, setRebar] = useState(initialRebar);
  const [notes, setNotes] = useState("");
  const [pdf, setPdf] = useState({ fileName: "", url: "" });

  useEffect(() => {
    return () => {
      if (pdf.url) URL.revokeObjectURL(pdf.url);
    };
  }, [pdf.url]);

  const derived = useMemo(() => computeAllDerivedLengths(geometry, rebar), [geometry, rebar]);
  const ratios = useMemo(() => computeRatios(geometry, rebar), [geometry, rebar]);
  const exportPayload = useMemo(
    () => generateJSON({ project, geometry, rebar, notes, derived, pdf }),
    [project, geometry, rebar, notes, derived, pdf],
  );
  const exportText = useMemo(() => JSON.stringify(exportPayload, null, 2), [exportPayload]);
  const heightMm = Math.round((geometry.Z_sup - geometry.Z_inf) * 1000);
  const minCover = EXPOSURE_CLASSES[geometry.exposureClass]?.c_min ?? 0;

  const openFileDialog = () => inputRef.current?.click();

  const handlePdfChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPdf((previous) => {
      if (previous.url) URL.revokeObjectURL(previous.url);
      return {
        fileName: file.name,
        url: URL.createObjectURL(file),
      };
    });
  };

  const downloadJson = () => {
    const blob = new Blob([exportText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = getFilename(project, geometry);
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">GBI Experts-Conseils</p>
          <h1>Wall Section Tool</h1>
          <p className="tagline">
            Point de depart simplifie: importer le PDF en premier, puis parametrer le mur sans perdre le plan de fond.
          </p>
        </div>

        <div className="topbar-actions">
          <button className="ghost-button" type="button" onClick={openFileDialog}>
            <FileUp size={16} />
            Importer un PDF
          </button>
          <button className="primary-button" type="button" onClick={downloadJson}>
            <Download size={16} />
            Exporter JSON
          </button>
          <input ref={inputRef} type="file" accept="application/pdf" onChange={handlePdfChange} hidden />
        </div>
      </header>

      <main className="workspace">
        <aside className="sidebar">
          <Section title="Projet" summary={project.wallMark || "Sans repere"}>
            <Field label="Repere mur">
              <TextField value={project.wallMark} onChange={(value) => setProject((prev) => ({ ...prev, wallMark: value }))} />
            </Field>
            <Field label="Reference plan">
              <TextField value={project.planRef} onChange={(value) => setProject((prev) => ({ ...prev, planRef: value }))} />
            </Field>
            <Field label="Ingenieur">
              <TextField value={project.engineer} onChange={(value) => setProject((prev) => ({ ...prev, engineer: value }))} />
            </Field>
          </Section>

          <Section title="Origine et geometrie" summary={`${geometry.thickness} mm | H ${heightMm} mm`}>
            <div className="field-grid">
              <Field label="Origine X (m)">
                <NumberField value={geometry.origin_x_m} step={0.001} onChange={(value) => setGeometry((prev) => ({ ...prev, origin_x_m: value }))} />
              </Field>
              <Field label="Origine Y (m)">
                <NumberField value={geometry.origin_y_m} step={0.001} onChange={(value) => setGeometry((prev) => ({ ...prev, origin_y_m: value }))} />
              </Field>
              <Field label="Origine Z (m)">
                <NumberField value={geometry.origin_z_m} step={0.001} onChange={(value) => setGeometry((prev) => ({ ...prev, origin_z_m: value, Z_inf: value }))} />
              </Field>
              <Field label="Epaisseur (mm)">
                <NumberField value={geometry.thickness} min={150} max={1000} onChange={(value) => setGeometry((prev) => ({ ...prev, thickness: value }))} />
              </Field>
              <Field label="Z inf (m)">
                <NumberField value={geometry.Z_inf} step={0.001} onChange={(value) => setGeometry((prev) => ({ ...prev, Z_inf: value, origin_z_m: value }))} />
              </Field>
              <Field label="Z sup (m)">
                <NumberField value={geometry.Z_sup} step={0.001} onChange={(value) => setGeometry((prev) => ({ ...prev, Z_sup: value }))} />
              </Field>
              <Field label="Hauteur H (mm)">
                <input value={heightMm} readOnly />
              </Field>
            </div>
          </Section>

          <Section title="Materiaux et CSA" summary={`f'c ${geometry.fc} | fy ${geometry.fy}`} defaultOpen={false}>
            <div className="field-grid">
              <Field label="f'c (MPa)">
                <NumberField value={geometry.fc} min={15} onChange={(value) => setGeometry((prev) => ({ ...prev, fc: value }))} />
              </Field>
              <Field label="fy (MPa)">
                <NumberField value={geometry.fy} min={300} onChange={(value) => setGeometry((prev) => ({ ...prev, fy: value }))} />
              </Field>
              <Field label="Lambda">
                <SelectField
                  value={String(geometry.lambda)}
                  onChange={(value) => setGeometry((prev) => ({ ...prev, lambda: Number(value) }))}
                  options={[
                    { value: "1", label: "Normal 1.0" },
                    { value: "0.85", label: "Semi-allege 0.85" },
                    { value: "0.75", label: "Allege 0.75" },
                  ]}
                />
              </Field>
              <Field label="Classe exposition" hint={`Recouvrement min ${minCover} mm`}>
                <SelectField
                  value={geometry.exposureClass}
                  onChange={(value) => setGeometry((prev) => ({ ...prev, exposureClass: value }))}
                  options={Object.entries(EXPOSURE_CLASSES).map(([value, data]) => ({
                    value,
                    label: `${value} - ${data.c_min} mm`,
                  }))}
                />
              </Field>
              <Field label="k1">
                <SelectField
                  value={String(geometry.k1)}
                  onChange={(value) => setGeometry((prev) => ({ ...prev, k1: Number(value) }))}
                  options={[
                    { value: "1", label: "1.0" },
                    { value: "1.3", label: "1.3" },
                  ]}
                />
              </Field>
              <Field label="k2">
                <SelectField
                  value={String(geometry.k2)}
                  onChange={(value) => setGeometry((prev) => ({ ...prev, k2: Number(value) }))}
                  options={[
                    { value: "1", label: "1.0" },
                    { value: "1.2", label: "1.2" },
                    { value: "1.5", label: "1.5" },
                  ]}
                />
              </Field>
            </div>
          </Section>

          <Section title="Armature" summary={`${rebar.vert_ext.size} | ${rebar.horiz_ext.size}`} defaultOpen={false}>
            <div className="rebar-grid">
              <div className="mini-card">
                <h3>Verticales ext.</h3>
                <Field label="Barre">
                  <SelectField
                    value={rebar.vert_ext.size}
                    onChange={(value) => setRebar((prev) => ({ ...prev, vert_ext: { ...prev.vert_ext, size: value } }))}
                    options={BAR_OPTIONS.map((value) => ({ value, label: value }))}
                  />
                </Field>
                <Field label="Espacement (mm)">
                  <NumberField value={rebar.vert_ext.spacing} step={10} min={50} onChange={(value) => setRebar((prev) => ({ ...prev, vert_ext: { ...prev.vert_ext, spacing: value } }))} />
                </Field>
                <Field label="Recouvrement (mm)">
                  <NumberField value={rebar.vert_ext.cover} step={5} min={0} onChange={(value) => setRebar((prev) => ({ ...prev, vert_ext: { ...prev.vert_ext, cover: value } }))} />
                </Field>
              </div>

              <div className="mini-card">
                <h3>Verticales int.</h3>
                <Field label="Barre">
                  <SelectField
                    value={rebar.vert_int.size}
                    onChange={(value) => setRebar((prev) => ({ ...prev, vert_int: { ...prev.vert_int, size: value } }))}
                    options={BAR_OPTIONS.map((value) => ({ value, label: value }))}
                  />
                </Field>
                <Field label="Espacement (mm)">
                  <NumberField value={rebar.vert_int.spacing} step={10} min={50} onChange={(value) => setRebar((prev) => ({ ...prev, vert_int: { ...prev.vert_int, spacing: value } }))} />
                </Field>
                <Field label="Recouvrement (mm)">
                  <NumberField value={rebar.vert_int.cover} step={5} min={0} onChange={(value) => setRebar((prev) => ({ ...prev, vert_int: { ...prev.vert_int, cover: value } }))} />
                </Field>
              </div>

              <div className="mini-card">
                <h3>Horizontales</h3>
                <Field label="Barre ext.">
                  <SelectField
                    value={rebar.horiz_ext.size}
                    onChange={(value) => setRebar((prev) => ({ ...prev, horiz_ext: { ...prev.horiz_ext, size: value } }))}
                    options={BAR_OPTIONS.map((value) => ({ value, label: value }))}
                  />
                </Field>
                <Field label="Espacement ext. (mm)">
                  <NumberField value={rebar.horiz_ext.spacing} step={10} min={50} onChange={(value) => setRebar((prev) => ({ ...prev, horiz_ext: { ...prev.horiz_ext, spacing: value } }))} />
                </Field>
                <Field label="Barre int.">
                  <SelectField
                    value={rebar.horiz_int.size}
                    onChange={(value) => setRebar((prev) => ({ ...prev, horiz_int: { ...prev.horiz_int, size: value } }))}
                    options={BAR_OPTIONS.map((value) => ({ value, label: value }))}
                  />
                </Field>
                <Field label="Espacement int. (mm)">
                  <NumberField value={rebar.horiz_int.spacing} step={10} min={50} onChange={(value) => setRebar((prev) => ({ ...prev, horiz_int: { ...prev.horiz_int, spacing: value } }))} />
                </Field>
              </div>
            </div>

            <div className="stat-row">
              <div className="stat-chip">
                <span>rho_v</span>
                <strong>{formatPercent(ratios.rhoV)}</strong>
              </div>
              <div className="stat-chip">
                <span>rho_h</span>
                <strong>{formatPercent(ratios.rhoH)}</strong>
              </div>
            </div>
          </Section>

          <Section title="Longueurs CSA" summary={`${derived.vert_ext.ld} mm`} defaultOpen={false}>
            <div className="derived-table">
              {Object.entries(derived).map(([key, value]) => (
                <div className="derived-card" key={key}>
                  <h3>{key}</h3>
                  <p>ld: {value.ld} mm</p>
                  <p>ldc: {value.ldc} mm</p>
                  <p>ldh: {value.ldh} mm</p>
                  <p>ls A: {value.ls_A} mm</p>
                  <p>ls B: {value.ls_B} mm</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Notes" summary={notes ? "Avec texte" : "Aucune note"} defaultOpen={false}>
            <Field label="Commentaires">
              <textarea rows={5} value={notes} onChange={(event) => setNotes(event.target.value)} />
            </Field>
          </Section>
        </aside>

        <section className="content">
          {!pdf.url ? (
            <div className="empty-state">
              <div className="empty-card">
                <FileText size={34} />
                <h2>Importer le PDF d'abord</h2>
                <p>
                  L'import PDF est maintenant le point d'entree principal. Le bouton est aussi visible en permanence
                  dans le header.
                </p>
                <button className="primary-button large" type="button" onClick={openFileDialog}>
                  <FileUp size={18} />
                  Importer un PDF
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="content-toolbar">
                <div className="toolbar-badge">
                  <Layers3 size={16} />
                  PDF charge
                </div>
                <span>{pdf.fileName}</span>
              </div>

              <div className="pdf-frame-wrap">
                <iframe className="pdf-frame" src={pdf.url} title="Apercu PDF" />
              </div>

              <div className="bottom-panels">
                <div className="bottom-card">
                  <h3>Apercu JSON</h3>
                  <pre>{exportText}</pre>
                </div>
                <div className="bottom-card">
                  <h3>Resume rapide</h3>
                  <ul>
                    <li>Repere: {project.wallMark || "-"}</li>
                    <li>Epaisseur: {geometry.thickness} mm</li>
                    <li>Origine: X {geometry.origin_x_m.toFixed(3)} | Y {geometry.origin_y_m.toFixed(3)} | Z {geometry.origin_z_m.toFixed(3)} m</li>
                    <li>Verticales ext.: {rebar.vert_ext.size} @ {rebar.vert_ext.spacing} mm</li>
                    <li>Verticales int.: {rebar.vert_int.size} @ {rebar.vert_int.spacing} mm</li>
                    <li>Horizontales ext.: {rebar.horiz_ext.size} @ {rebar.horiz_ext.spacing} mm</li>
                    <li>Horizontales int.: {rebar.horiz_int.size} @ {rebar.horiz_int.spacing} mm</li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
