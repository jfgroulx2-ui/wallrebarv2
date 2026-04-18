import { EXPOSURE_CLASSES } from "../../constants/csaData.js";
import CollapsibleSection from "../shared/CollapsibleSection.jsx";
import FieldWithTooltip from "../shared/FieldWithTooltip.jsx";

export default function TabGeometry({ geometry, setGeometry }) {
  const height = Math.round((geometry.Z_sup - geometry.Z_inf) * 1000);

  return (
    <>
      <CollapsibleSection title="Identification" summary={geometry.wallMark}>
        <div className="field-grid">
          <FieldWithTooltip label="Repere mur">
            <input value={geometry.wallMark} onChange={(event) => setGeometry((prev) => ({ ...prev, wallMark: event.target.value }))} />
          </FieldWithTooltip>
          <FieldWithTooltip label="Reference plan">
            <input value={geometry.planRef} onChange={(event) => setGeometry((prev) => ({ ...prev, planRef: event.target.value }))} />
          </FieldWithTooltip>
          <FieldWithTooltip label="Ingenieur">
            <input value={geometry.engineer} onChange={(event) => setGeometry((prev) => ({ ...prev, engineer: event.target.value }))} />
          </FieldWithTooltip>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Origine projet" summary={`X ${geometry.origin_x_m.toFixed(3)} | Z ${geometry.origin_z_m.toFixed(3)}`}>
        <div className="field-grid">
          <FieldWithTooltip label="Origine X (m)" hint="Repere exporte pour Dynamo">
            <input type="number" step="0.001" value={geometry.origin_x_m} onChange={(event) => setGeometry((prev) => ({ ...prev, origin_x_m: Number(event.target.value) }))} />
          </FieldWithTooltip>
          <FieldWithTooltip label="Origine Y (m)">
            <input type="number" step="0.001" value={geometry.origin_y_m} onChange={(event) => setGeometry((prev) => ({ ...prev, origin_y_m: Number(event.target.value) }))} />
          </FieldWithTooltip>
          <FieldWithTooltip label="Origine Z (m)">
            <input type="number" step="0.001" value={geometry.origin_z_m} onChange={(event) => setGeometry((prev) => ({ ...prev, origin_z_m: Number(event.target.value), Z_inf: Number(event.target.value) }))} />
          </FieldWithTooltip>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Dimensions" summary={`${geometry.thickness} mm | H ${height} mm`}>
        <div className="field-grid">
          <FieldWithTooltip label="Epaisseur (mm)">
            <input type="number" min="150" max="1000" value={geometry.thickness} onChange={(event) => setGeometry((prev) => ({ ...prev, thickness: Number(event.target.value) }))} />
          </FieldWithTooltip>
          <FieldWithTooltip label="Z inf (m)">
            <input type="number" step="0.001" value={geometry.Z_inf} onChange={(event) => setGeometry((prev) => ({ ...prev, Z_inf: Number(event.target.value), origin_z_m: Number(event.target.value) }))} />
          </FieldWithTooltip>
          <FieldWithTooltip label="Z sup (m)">
            <input type="number" step="0.001" value={geometry.Z_sup} onChange={(event) => setGeometry((prev) => ({ ...prev, Z_sup: Number(event.target.value) }))} />
          </FieldWithTooltip>
          <FieldWithTooltip label="Hauteur H (mm)">
            <input value={height} readOnly />
          </FieldWithTooltip>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Beton et facteurs" summary={`f'c ${geometry.fc} | fy ${geometry.fy}`} defaultOpen={false}>
        <div className="field-grid">
          <FieldWithTooltip label="f'c (MPa)">
            <input type="number" value={geometry.fc} onChange={(event) => setGeometry((prev) => ({ ...prev, fc: Number(event.target.value) }))} />
          </FieldWithTooltip>
          <FieldWithTooltip label="fy (MPa)">
            <input type="number" value={geometry.fy} onChange={(event) => setGeometry((prev) => ({ ...prev, fy: Number(event.target.value) }))} />
          </FieldWithTooltip>
          <FieldWithTooltip label="Lambda">
            <select value={geometry.lambda} onChange={(event) => setGeometry((prev) => ({ ...prev, lambda: Number(event.target.value) }))}>
              <option value={1}>Normal 1.0</option>
              <option value={0.85}>Semi-allege 0.85</option>
              <option value={0.75}>Allege 0.75</option>
            </select>
          </FieldWithTooltip>
          <FieldWithTooltip label="Classe exposition">
            <select value={geometry.exposureClass} onChange={(event) => setGeometry((prev) => ({ ...prev, exposureClass: event.target.value }))}>
              {Object.entries(EXPOSURE_CLASSES).map(([value, item]) => (
                <option key={value} value={value}>
                  {value} - min {item.c_min} mm
                </option>
              ))}
            </select>
          </FieldWithTooltip>
          <FieldWithTooltip label="k1">
            <select value={geometry.k1} onChange={(event) => setGeometry((prev) => ({ ...prev, k1: Number(event.target.value) }))}>
              <option value={1}>1.0</option>
              <option value={1.3}>1.3</option>
            </select>
          </FieldWithTooltip>
          <FieldWithTooltip label="k2">
            <select value={geometry.k2} onChange={(event) => setGeometry((prev) => ({ ...prev, k2: Number(event.target.value) }))}>
              <option value={1}>1.0</option>
              <option value={1.2}>1.2</option>
              <option value={1.5}>1.5</option>
            </select>
          </FieldWithTooltip>
        </div>
      </CollapsibleSection>
    </>
  );
}
