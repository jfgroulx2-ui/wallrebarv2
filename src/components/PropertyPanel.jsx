import { OBJECT_TYPES } from "../constants/objectTypes.js";
import { TOOLS } from "../constants/toolModes.js";
import { useDrawingStore } from "../store/useDrawingStore.js";
import { useToolStore } from "../store/useToolStore.js";
import { normalizeSeriesProperties } from "../utils/seriesCalc.js";
import WallToolPanel from "./tools/WallToolPanel.jsx";
import RebarToolPanel from "./tools/RebarToolPanel.jsx";
import AnnotToolPanel from "./tools/AnnotToolPanel.jsx";

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

function SelectedObjectPanel({ object }) {
  const updateObject = useDrawingStore((state) => state.updateObject);
  const deleteObject = useDrawingStore((state) => state.deleteObject);

  const updateProps = (changes) => updateObject(object.id, { properties: changes });
  const updateGeometry = (changes) => updateObject(object.id, { geometry: changes });

  const updateSeries = (changes) => {
    const nextProps = { ...object.properties, ...changes };
    const lengthMm =
      object.geometry.direction === "vertical"
        ? object.geometry.y_end_mm - object.geometry.y_start_mm
        : object.geometry.x_end_mm - object.geometry.x_start_mm;
    updateObject(object.id, {
      properties: {
        ...changes,
        ...normalizeSeriesProperties(lengthMm, nextProps.spacing_mm, nextProps.count || null),
      },
    });
  };

  return (
    <div className="panel-card">
      <div className="panel-title">
        <strong>{object.type}</strong>
        <span>{object.id}</span>
      </div>

      {(object.type === OBJECT_TYPES.REBAR || object.type === OBJECT_TYPES.REBAR_SERIES) && (
        <>
          {object.type === OBJECT_TYPES.REBAR ? (
            <div className="field">
              <span>Type</span>
              <ToggleButtons
                options={[
                  { value: "vertical", label: "Verticale" },
                  { value: "horizontal", label: "Horizontale" },
                ]}
                value={object.properties.role}
                onChange={(value) => updateProps({ role: value })}
              />
            </div>
          ) : (
            <div className="field">
              <span>Orientation de serie</span>
              <div className="muted">{object.geometry.direction === "horizontal" ? "Horizontale" : "Verticale"}</div>
            </div>
          )}

          <div className="field">
            <span>Diametre</span>
            <div className="chip-row">
              {BAR_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`chip ${object.properties.diameter === size ? "active" : ""}`}
                  onClick={() => updateProps({ diameter: size })}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          {object.type === OBJECT_TYPES.REBAR_SERIES ? (
            <div className="two-col">
              <label className="field">
                <span>Espacement (mm)</span>
                <input type="number" value={object.properties.spacing_mm} onChange={(event) => updateSeries({ spacing_mm: Number(event.target.value) })} />
              </label>
              <label className="field">
                <span>Nb. barres</span>
                <input type="number" value={object.properties.actualCount} readOnly />
              </label>
            </div>
          ) : null}
          <div className="two-col">
            <label className="field">
              <span>Face</span>
              <select value={object.properties.face} onChange={(event) => updateProps({ face: event.target.value })}>
                <option value="single">Single</option>
                <option value="ext">Ext.</option>
                <option value="int">Int.</option>
                <option value="EF">EF</option>
              </select>
            </label>
            <label className="field">
              <span>Enrobage (mm)</span>
              <input type="number" value={object.properties.cover_mm} onChange={(event) => updateProps({ cover_mm: Number(event.target.value) })} />
            </label>
          </div>

          {(object.type === OBJECT_TYPES.REBAR_SERIES ? object.geometry.direction : object.properties.role) !== "horizontal" ? (
            <>
              <div className="field">
                <span>Crochet a la base</span>
                <ToggleButtons
                  options={HOOK_OPTIONS}
                  value={object.properties.hookStart ?? null}
                  onChange={(hookStart) => updateProps({ hookStart })}
                />
              </div>

              {object.properties.hookStart ? (
                <div className="field">
                  <span>Direction a la base</span>
                  <ToggleButtons
                    options={[
                      { value: "left", label: "Vers la gauche" },
                      { value: "right", label: "Vers la droite" },
                    ]}
                    value={object.properties.hookStartDirection ?? "left"}
                    onChange={(hookStartDirection) => updateProps({ hookStartDirection })}
                  />
                </div>
              ) : null}

              <div className="field">
                <span>Crochet a la tete</span>
                <ToggleButtons
                  options={HOOK_OPTIONS}
                  value={object.properties.hookEnd ?? null}
                  onChange={(hookEnd) => updateProps({ hookEnd })}
                />
              </div>

              {object.properties.hookEnd ? (
                <div className="field">
                  <span>Direction a la tete</span>
                  <ToggleButtons
                    options={[
                      { value: "left", label: "Vers la gauche" },
                      { value: "right", label: "Vers la droite" },
                    ]}
                    value={object.properties.hookEndDirection ?? "left"}
                    onChange={(hookEndDirection) => updateProps({ hookEndDirection })}
                  />
                </div>
              ) : null}
            </>
          ) : null}
        </>
      )}

      {(object.type === OBJECT_TYPES.WALL || object.type === OBJECT_TYPES.FOOTING || object.type === OBJECT_TYPES.RECTANGLE) && (
        <div className="two-col">
          <label className="field">
            <span>Largeur (mm)</span>
            <input type="number" value={object.geometry.width_mm} onChange={(event) => updateGeometry({ width_mm: Number(event.target.value) })} />
          </label>
          <label className="field">
            <span>Hauteur (mm)</span>
            <input type="number" value={object.geometry.height_mm} onChange={(event) => updateGeometry({ height_mm: Number(event.target.value) })} />
          </label>
        </div>
      )}

      {object.type === OBJECT_TYPES.ANNOTATION ? (
        <>
          <label className="field">
            <span>Texte</span>
            <textarea value={object.properties.text} onChange={(event) => updateProps({ text: event.target.value })} />
          </label>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={Boolean(object.properties.autoUpdate)}
              onChange={(event) => updateProps({ autoUpdate: event.target.checked })}
            />
            <span>Mise a jour auto</span>
          </label>
        </>
      ) : null}

      <div className="inline-actions">
        <button type="button" className="danger-button" onClick={() => deleteObject(object.id)}>
          Supprimer
        </button>
      </div>
    </div>
  );
}

export default function PropertyPanel({ selectedObject }) {
  const activeTool = useToolStore((state) => state.activeTool);

  if (selectedObject) return <SelectedObjectPanel object={selectedObject} />;
  if (activeTool === TOOLS.WALL) return <WallToolPanel />;
  if (activeTool === TOOLS.REBAR || activeTool === TOOLS.REBAR_SERIES) return <RebarToolPanel tool={activeTool} />;
  if (activeTool === TOOLS.ANNOTATE) return <AnnotToolPanel />;

  return (
    <div className="panel-card">
      <div className="panel-title">
        <strong>Proprietes</strong>
        <span>Aucun objet selectionne</span>
      </div>
      <p className="muted">Selectionnez un objet ou activez un outil pour modifier ses parametres.</p>
    </div>
  );
}
