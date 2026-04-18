export default function LengthField({ label, value, overrideValue, onOverrideChange }) {
  const isOverride = overrideValue !== null && overrideValue !== undefined;

  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <div className="length-field">
        <input
          type="number"
          value={isOverride ? overrideValue : value}
          onChange={(event) => onOverrideChange(event.target.value === "" ? null : Number(event.target.value))}
        />
        <span className={`length-badge ${isOverride ? "override" : "auto"}`}>{isOverride ? "override" : "auto"}</span>
      </div>
    </label>
  );
}
