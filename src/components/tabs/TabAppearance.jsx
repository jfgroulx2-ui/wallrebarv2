import CollapsibleSection from "../shared/CollapsibleSection.jsx";
import SliderField from "../shared/SliderField.jsx";

export default function TabAppearance({ draw, setDraw }) {
  return (
    <>
      <CollapsibleSection title="Contour et hatch" summary={`${draw.wallLineWidth}px | ${draw.hatchPattern}`}>
        <SliderField label="Epaisseur mur" min={0.5} max={4} step={0.1} value={draw.wallLineWidth} onChange={(value) => setDraw((prev) => ({ ...prev, wallLineWidth: value }))} suffix=" px" />
        <SliderField label="Espacement hatch" min={4} max={24} step={1} value={draw.hatchSpacing} onChange={(value) => setDraw((prev) => ({ ...prev, hatchSpacing: value }))} suffix=" px" />
        <label className="field">
          <span className="field-label">Motif hatch</span>
          <select value={draw.hatchPattern} onChange={(event) => setDraw((prev) => ({ ...prev, hatchPattern: event.target.value }))}>
            <option value="diagonal_45">Diagonales 45°</option>
            <option value="cross">Croise</option>
            <option value="dot">Pointille</option>
          </select>
        </label>
      </CollapsibleSection>

      <CollapsibleSection title="Armature et cotes" summary={`${draw.barSizeMultiplier}x | ${draw.dimLineWidth}px`} defaultOpen={false}>
        <SliderField label="Taille cercles" min={0.5} max={2} step={0.1} value={draw.barSizeMultiplier} onChange={(value) => setDraw((prev) => ({ ...prev, barSizeMultiplier: value }))} suffix="x" />
        <SliderField label="Contour barres" min={0.5} max={2} step={0.1} value={draw.barStrokeWidth} onChange={(value) => setDraw((prev) => ({ ...prev, barStrokeWidth: value }))} suffix=" px" />
        <SliderField label="Lignes de cote" min={0.5} max={1.5} step={0.05} value={draw.dimLineWidth} onChange={(value) => setDraw((prev) => ({ ...prev, dimLineWidth: value }))} suffix=" px" />
      </CollapsibleSection>

      <CollapsibleSection title="Leaders, grille, echelle" summary={draw.scale} defaultOpen={false}>
        <label className="field">
          <span className="field-label">Leaders</span>
          <select value={draw.leaderEnabled ? "yes" : "no"} onChange={(event) => setDraw((prev) => ({ ...prev, leaderEnabled: event.target.value === "yes" }))}>
            <option value="yes">Actifs</option>
            <option value="no">Masques</option>
          </select>
        </label>
        <label className="field">
          <span className="field-label">Grille</span>
          <select value={draw.gridEnabled ? "yes" : "no"} onChange={(event) => setDraw((prev) => ({ ...prev, gridEnabled: event.target.value === "yes" }))}>
            <option value="no">Masquee</option>
            <option value="yes">Visible</option>
          </select>
        </label>
        <label className="field">
          <span className="field-label">Afficher l'origine</span>
          <select value={draw.showOrigin ? "yes" : "no"} onChange={(event) => setDraw((prev) => ({ ...prev, showOrigin: event.target.value === "yes" }))}>
            <option value="yes">Oui</option>
            <option value="no">Non</option>
          </select>
        </label>
        <label className="field">
          <span className="field-label">Echelle</span>
          <select value={draw.scale} onChange={(event) => setDraw((prev) => ({ ...prev, scale: event.target.value }))}>
            <option value="auto">Auto</option>
            <option value="1:10">1:10</option>
            <option value="1:20">1:20</option>
            <option value="1:25">1:25</option>
            <option value="1:50">1:50</option>
          </select>
        </label>
      </CollapsibleSection>
    </>
  );
}
