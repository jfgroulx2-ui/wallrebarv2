import { GUIDE_CONTENT } from "../constants/csaData.js";

export default function GuideDrawer({ activeTab, open, onClose }) {
  return (
    <aside className={`guide-drawer ${open ? "open" : ""}`}>
      <div className="guide-header">
        <strong>Guide</strong>
        <button type="button" className="ghost-button compact" onClick={onClose}>
          Fermer
        </button>
      </div>
      <pre>{GUIDE_CONTENT[activeTab]}</pre>
    </aside>
  );
}
