import { BARS } from "../../constants/csaData.js";

export default function BarSizeSelector({ value, onChange }) {
  return (
    <div className="bar-size-selector">
      {Object.keys(BARS).map((size) => (
        <button key={size} type="button" className={`chip-button ${value === size ? "active" : ""}`} onClick={() => onChange(size)}>
          {size}
        </button>
      ))}
    </div>
  );
}
