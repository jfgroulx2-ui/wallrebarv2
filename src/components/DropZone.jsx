import { FileText } from "lucide-react";

export default function DropZone({ onPickFile, onDropFile }) {
  return (
    <button
      type="button"
      className="dropzone"
      onClick={onPickFile}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (file) onDropFile(file);
      }}
    >
      <FileText size={34} />
      <strong>Deposer un PDF de coupes de murs</strong>
      <span>ou cliquer pour parcourir</span>
      <small>Formats acceptes : PDF uniquement</small>
    </button>
  );
}
