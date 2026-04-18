import { WATERSTOP_TYPES } from "../../constants/csaData.js";
import CollapsibleSection from "../shared/CollapsibleSection.jsx";

function WaterstopBlock({ title, value, onChange }) {
  return (
    <div className="mini-card">
      <h3>{title}</h3>
      <label className="field">
        <span className="field-label">Actif</span>
        <select value={value.enabled ? "yes" : "no"} onChange={(event) => onChange({ ...value, enabled: event.target.value === "yes" })}>
          <option value="no">Non</option>
          <option value="yes">Oui</option>
        </select>
      </label>
      <label className="field">
        <span className="field-label">Type</span>
        <select value={value.type} onChange={(event) => onChange({ ...value, type: event.target.value })}>
          {Object.entries(WATERSTOP_TYPES).map(([key, item]) => (
            <option key={key} value={key}>{item.label}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span className="field-label">Largeur (mm)</span>
        <input type="number" value={value.width} onChange={(event) => onChange({ ...value, width: Number(event.target.value) })} />
      </label>
    </div>
  );
}

export default function TabSpecial({ special, setSpecial }) {
  return (
    <>
      <CollapsibleSection title="Waterstops" summary="Joints inf. et sup.">
        <div className="two-col-grid">
          <WaterstopBlock title="Joint inferieur" value={special.waterstop_inf} onChange={(value) => setSpecial((prev) => ({ ...prev, waterstop_inf: value }))} />
          <WaterstopBlock title="Joint superieur" value={special.waterstop_sup} onChange={(value) => setSpecial((prev) => ({ ...prev, waterstop_sup: value }))} />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Hydrostatique et enveloppe" summary={special.hydrostatic.enabled ? "Hydro active" : "Standard"} defaultOpen={false}>
        <div className="field-grid">
          <label className="field">
            <span className="field-label">Pression hydrostatique</span>
            <select value={special.hydrostatic.enabled ? "yes" : "no"} onChange={(event) => setSpecial((prev) => ({ ...prev, hydrostatic: { ...prev.hydrostatic, enabled: event.target.value === "yes" } }))}>
              <option value="no">Non</option>
              <option value="yes">Oui</option>
            </select>
          </label>
          <label className="field">
            <span className="field-label">Niveau nappe (m)</span>
            <input type="number" step="0.001" value={special.hydrostatic.waterLevel ?? ""} onChange={(event) => setSpecial((prev) => ({ ...prev, hydrostatic: { ...prev.hydrostatic, waterLevel: event.target.value === "" ? null : Number(event.target.value) } }))} />
          </label>
          <label className="field">
            <span className="field-label">Isolation</span>
            <select value={special.insulation.enabled ? "yes" : "no"} onChange={(event) => setSpecial((prev) => ({ ...prev, insulation: { ...prev.insulation, enabled: event.target.value === "yes" } }))}>
              <option value="no">Non</option>
              <option value="yes">Oui</option>
            </select>
          </label>
          <label className="field">
            <span className="field-label">Membrane</span>
            <select value={special.membrane.enabled ? "yes" : "no"} onChange={(event) => setSpecial((prev) => ({ ...prev, membrane: { ...prev.membrane, enabled: event.target.value === "yes" } }))}>
              <option value="no">Non</option>
              <option value="yes">Oui</option>
            </select>
          </label>
        </div>
      </CollapsibleSection>
    </>
  );
}
