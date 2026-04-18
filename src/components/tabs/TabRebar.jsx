import { BARS } from "../../constants/csaData.js";
import { computeReinforcementRatios } from "../../utils/calculations.js";
import CollapsibleSection from "../shared/CollapsibleSection.jsx";
import BarSizeSelector from "../shared/BarSizeSelector.jsx";

function BarBlock({ title, value, onChange, showCover = true }) {
  return (
    <div className="mini-card">
      <h3>{title}</h3>
      <BarSizeSelector value={value.size} onChange={(size) => onChange({ ...value, size })} />
      <p className="mono-line">db = {BARS[value.size].db} mm | Ab = {BARS[value.size].Ab} mm²</p>
      <label className="field">
        <span className="field-label">Espacement (mm)</span>
        <input type="number" step="10" value={value.spacing} onChange={(event) => onChange({ ...value, spacing: Number(event.target.value) })} />
      </label>
      {showCover ? (
        <label className="field">
          <span className="field-label">Recouvrement (mm)</span>
          <input type="number" step="5" value={value.cover} onChange={(event) => onChange({ ...value, cover: Number(event.target.value) })} />
        </label>
      ) : null}
    </div>
  );
}

export default function TabRebar({ geometry, rebar, setRebar, barPositions }) {
  const ratios = computeReinforcementRatios(geometry, rebar);

  return (
    <>
      <CollapsibleSection title="Barres verticales" summary={`${rebar.vert_ext.size} / ${rebar.vert_int.size}`}>
        <div className="two-col-grid">
          <BarBlock title="Face exterieure" value={rebar.vert_ext} onChange={(value) => setRebar((prev) => ({ ...prev, vert_ext: value }))} />
          <BarBlock title="Face interieure" value={rebar.vert_int} onChange={(value) => setRebar((prev) => ({ ...prev, vert_int: value }))} />
        </div>
        <div className="info-strip">Barres calculees: ext {barPositions.verticalBars.filter((bar) => bar.face === "exterior").length} | int {barPositions.verticalBars.filter((bar) => bar.face === "interior").length}</div>
      </CollapsibleSection>

      <CollapsibleSection title="Barres horizontales" summary={`${rebar.horiz_ext.size} / ${rebar.horiz_int.size}`}>
        <div className="two-col-grid">
          <BarBlock title="Face exterieure" value={rebar.horiz_ext} onChange={(value) => setRebar((prev) => ({ ...prev, horiz_ext: value }))} showCover={false} />
          <BarBlock title="Face interieure" value={rebar.horiz_int} onChange={(value) => setRebar((prev) => ({ ...prev, horiz_int: value }))} showCover={false} />
        </div>
        <div className="info-strip">rho_h = {(ratios.rho_h * 100).toFixed(2)}%</div>
      </CollapsibleSection>

      <CollapsibleSection title="Epingles" summary={`${rebar.ties.size} | ${rebar.ties.hook}°`} defaultOpen={false}>
        <div className="field-grid">
          <label className="field">
            <span className="field-label">Barre</span>
            <select value={rebar.ties.size} onChange={(event) => setRebar((prev) => ({ ...prev, ties: { ...prev.ties, size: event.target.value } }))}>
              {Object.keys(BARS).map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field-label">Espacement vertical (mm)</span>
            <input type="number" step="10" value={rebar.ties.spacing_v} onChange={(event) => setRebar((prev) => ({ ...prev, ties: { ...prev.ties, spacing_v: Number(event.target.value) } }))} />
          </label>
          <label className="field">
            <span className="field-label">Espacement horizontal (mm)</span>
            <input type="number" step="10" value={rebar.ties.spacing_h} onChange={(event) => setRebar((prev) => ({ ...prev, ties: { ...prev.ties, spacing_h: Number(event.target.value) } }))} />
          </label>
          <label className="field">
            <span className="field-label">Crochet</span>
            <select value={rebar.ties.hook} onChange={(event) => setRebar((prev) => ({ ...prev, ties: { ...prev.ties, hook: Number(event.target.value) } }))}>
              <option value={90}>90°</option>
              <option value={135}>135°</option>
            </select>
          </label>
        </div>
        <div className="info-strip">rho_v = {(ratios.rho_v * 100).toFixed(2)}%</div>
      </CollapsibleSection>
    </>
  );
}
