import { TOOLS } from "../../constants/toolModes.js";
import { useToolStore } from "../../store/useToolStore.js";

const BAR_SIZES = ["10M", "15M", "20M", "25M", "30M", "35M"];
const HOOK_OPTIONS = [
  { value: null, label: "Non" },
  { value: "90", label: "90°" },
  { value: "135", label: "135°" },
  { value: "180", label: "180°" },
];

function ToggleButtons({ options, value, onChange }) {
  return (
    <div className="chip-row">
      {options.map((option) => (
        <button
          key={String(option.value)}
          type="button"
          className={`chip ${value === option.value ? "active" : ""}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function BarButtons({ value, onChange }) {
  return (
    <div className="chip-row">
      {BAR_SIZES.map((size) => (
        <button key={size} type="button" className={`chip ${value === size ? "active" : ""}`} onClick={() => onChange(size)}>
          {size}
        </button>
      ))}
    </div>
  );
}

export default function RebarToolPanel({ tool }) {
  const params = useToolStore((state) => state.toolParams[tool]);
  const updateToolParams = useToolStore((state) => state.updateToolParams);
  const isSeries = tool === TOOLS.REBAR_SERIES;
  const isVertical = isSeries ? params.direction !== "horizontal" : params.role !== "horizontal";

  return (
    <div className="panel-card">
      <div className="panel-title">
        <strong>{isSeries ? "Serie de barres" : "Barre simple"}</strong>
        <span>{isSeries ? "2 clics pour poser la serie" : "2 clics pour poser la barre"}</span>
      </div>

      <div className="field">
        <span>{isSeries ? "Type de serie" : "Type de barre"}</span>
        <ToggleButtons
          options={[
            { value: "vertical", label: "Verticale" },
            { value: "horizontal", label: "Horizontale" },
          ]}
          value={isSeries ? params.direction : params.role}
          onChange={(value) =>
            updateToolParams(tool, isSeries ? { direction: value } : { role: value })
          }
        />
      </div>

      <label className="field">
        <span>Diametre</span>
        <BarButtons value={params.diameter} onChange={(diameter) => updateToolParams(tool, { diameter })} />
      </label>
      {isSeries ? (
        <div className="two-col">
          <label className="field">
            <span>Espacement (mm)</span>
            <input type="number" value={params.spacing_mm} onChange={(event) => updateToolParams(tool, { spacing_mm: Number(event.target.value) })} />
          </label>
          <label className="field">
            <span>Nombre (0 auto)</span>
            <input type="number" value={params.count} onChange={(event) => updateToolParams(tool, { count: Number(event.target.value) })} />
          </label>
        </div>
      ) : null}

      <div className="two-col">
        <label className="field">
          <span>Face</span>
          <select value={params.face} onChange={(event) => updateToolParams(tool, { face: event.target.value })}>
            <option value="single">Single</option>
            <option value="ext">Ext.</option>
            <option value="int">Int.</option>
            <option value="EF">EF</option>
          </select>
        </label>
        <label className="field">
          <span>Enrobage (mm)</span>
          <input type="number" value={params.cover_mm} onChange={(event) => updateToolParams(tool, { cover_mm: Number(event.target.value) })} />
        </label>
      </div>

      {isVertical ? (
        <>
          <div className="field">
            <span>Crochet a la base</span>
            <ToggleButtons
              options={HOOK_OPTIONS}
              value={params.hookStart}
              onChange={(hookStart) => updateToolParams(tool, { hookStart })}
            />
          </div>

          {params.hookStart ? (
            <div className="field">
              <span>Direction a la base</span>
              <ToggleButtons
                options={[
                  { value: "left", label: "Vers la gauche" },
                  { value: "right", label: "Vers la droite" },
                ]}
                value={params.hookStartDirection}
                onChange={(hookStartDirection) => updateToolParams(tool, { hookStartDirection })}
              />
            </div>
          ) : null}

          <div className="field">
            <span>Crochet a la tete</span>
            <ToggleButtons
              options={HOOK_OPTIONS}
              value={params.hookEnd}
              onChange={(hookEnd) => updateToolParams(tool, { hookEnd })}
            />
          </div>

          {params.hookEnd ? (
            <div className="field">
              <span>Direction a la tete</span>
              <ToggleButtons
                options={[
                  { value: "left", label: "Vers la gauche" },
                  { value: "right", label: "Vers la droite" },
                ]}
                value={params.hookEndDirection}
                onChange={(hookEndDirection) => updateToolParams(tool, { hookEndDirection })}
              />
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
