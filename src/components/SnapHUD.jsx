export default function SnapHUD({ interaction }) {
  if (!interaction.dragging || !interaction.snapPos) return null;

  return (
    <div className="snap-hud">
      x = {interaction.snapPos.x} mm | y = {interaction.snapPos.y} mm | grille 10 mm
    </div>
  );
}
