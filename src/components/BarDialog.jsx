export default function BarDialog({ interaction, onClose }) {
  if (!interaction.showDialog || !interaction.selectedBar) return null;

  return (
    <div className="dialog-overlay" onMouseDown={onClose}>
      <div className="dialog-card" onMouseDown={(event) => event.stopPropagation()}>
        <h3>{interaction.selectedBar.id}</h3>
        <p>La modification individuelle des barres arrive en Phase 3.</p>
        <button className="ghost-button compact" type="button" onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>
  );
}
