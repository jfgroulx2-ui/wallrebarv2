import { CONDITION_TYPES } from "../../constants/csaData.js";
import CollapsibleSection from "../shared/CollapsibleSection.jsx";
import LengthField from "../shared/LengthField.jsx";

function ConditionBlock({ title, options, value, onChange, calcLength }) {
  return (
    <div className="mini-card">
      <h3>{title}</h3>
      <label className="field">
        <span className="field-label">Type</span>
        <select value={value.type} onChange={(event) => onChange({ ...value, type: event.target.value })}>
          {options.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </label>
      <LengthField label="Longueur (mm)" value={calcLength} overrideValue={value.l_override} onOverrideChange={(l_override) => onChange({ ...value, l_override })} />
      {value.type === "recouvrement" ? (
        <>
          <label className="field">
            <span className="field-label">As requis (mm²)</span>
            <input type="number" value={value.As_requis ?? ""} onChange={(event) => onChange({ ...value, As_requis: event.target.value === "" ? null : Number(event.target.value) })} />
          </label>
          <label className="field">
            <span className="field-label">% recouvert</span>
            <input type="number" value={value.pct_recouvert} onChange={(event) => onChange({ ...value, pct_recouvert: Number(event.target.value) })} />
          </label>
        </>
      ) : null}
    </div>
  );
}

export default function TabJoints({ conditions, setConditions, derived }) {
  return (
    <>
      <CollapsibleSection title="Parametres communs" summary={`${conditions.contextHeightInf} / ${conditions.contextHeightSup} mm`}>
        <div className="field-grid">
          <label className="field">
            <span className="field-label">Meme condition pour les deux faces</span>
            <select value={conditions.sameConditionBothFaces ? "yes" : "no"} onChange={(event) => setConditions((prev) => ({ ...prev, sameConditionBothFaces: event.target.value === "yes" }))}>
              <option value="yes">Oui</option>
              <option value="no">Non</option>
            </select>
          </label>
          <label className="field">
            <span className="field-label">Contexte inferieur (mm)</span>
            <input type="number" value={conditions.contextHeightInf} onChange={(event) => setConditions((prev) => ({ ...prev, contextHeightInf: Number(event.target.value) }))} />
          </label>
          <label className="field">
            <span className="field-label">Contexte superieur (mm)</span>
            <input type="number" value={conditions.contextHeightSup} onChange={(event) => setConditions((prev) => ({ ...prev, contextHeightSup: Number(event.target.value) }))} />
          </label>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Joint inferieur" summary={conditions.inf.ext.type}>
        <div className="two-col-grid">
          <ConditionBlock title="Face exterieure" options={CONDITION_TYPES.inf} value={conditions.inf.ext} onChange={(value) => setConditions((prev) => ({ ...prev, inf: { ...prev.inf, ext: value } }))} calcLength={derived.vert_ext.ld} />
          <ConditionBlock title="Face interieure" options={CONDITION_TYPES.inf} value={conditions.inf.int} onChange={(value) => setConditions((prev) => ({ ...prev, inf: { ...prev.inf, int: value } }))} calcLength={derived.vert_int.ld} />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Joint superieur" summary={conditions.sup.ext.type} defaultOpen={false}>
        <div className="two-col-grid">
          <ConditionBlock title="Face exterieure" options={CONDITION_TYPES.sup} value={conditions.sup.ext} onChange={(value) => setConditions((prev) => ({ ...prev, sup: { ...prev.sup, ext: value } }))} calcLength={derived.vert_ext.ls_B} />
          <ConditionBlock title="Face interieure" options={CONDITION_TYPES.sup} value={conditions.sup.int} onChange={(value) => setConditions((prev) => ({ ...prev, sup: { ...prev.sup, int: value } }))} calcLength={derived.vert_int.ls_B} />
        </div>
      </CollapsibleSection>
    </>
  );
}
