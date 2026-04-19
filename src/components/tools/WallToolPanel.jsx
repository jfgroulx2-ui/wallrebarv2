import { TOOLS } from "../../constants/toolModes.js";
import { useToolStore } from "../../store/useToolStore.js";

export default function WallToolPanel() {
  const params = useToolStore((state) => state.toolParams[TOOLS.WALL]);
  const updateToolParams = useToolStore((state) => state.updateToolParams);

  return (
    <div className="panel-card">
      <div className="panel-title">
        <strong>Mur</strong>
        <span>Parametres de placement</span>
      </div>
      <label className="field">
        <span>Libelle</span>
        <input value={params.label} onChange={(event) => updateToolParams(TOOLS.WALL, { label: event.target.value })} />
      </label>
      <div className="two-col">
        <label className="field">
          <span>Hauteur (mm)</span>
          <input type="number" value={params.height} onChange={(event) => updateToolParams(TOOLS.WALL, { height: Number(event.target.value) })} />
        </label>
        <label className="field">
          <span>Epaisseur (mm)</span>
          <input type="number" value={params.thickness} onChange={(event) => updateToolParams(TOOLS.WALL, { thickness: Number(event.target.value) })} />
        </label>
      </div>
      <div className="two-col">
        <label className="field">
          <span>Semelle largeur</span>
          <input type="number" value={params.footingWidth} onChange={(event) => updateToolParams(TOOLS.WALL, { footingWidth: Number(event.target.value) })} />
        </label>
        <label className="field">
          <span>Semelle epaisseur</span>
          <input type="number" value={params.footingThickness} onChange={(event) => updateToolParams(TOOLS.WALL, { footingThickness: Number(event.target.value) })} />
        </label>
      </div>
      <label className="checkbox-row">
        <input type="checkbox" checked={params.hasFooting} onChange={(event) => updateToolParams(TOOLS.WALL, { hasFooting: event.target.checked })} />
        <span>Avec semelle</span>
      </label>
    </div>
  );
}
