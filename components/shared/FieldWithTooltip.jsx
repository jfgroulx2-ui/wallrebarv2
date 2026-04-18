export default function FieldWithTooltip({ label, hint, children }) {
  return (
    <label className="field">
      <span className="field-label">
        {label}
        {hint ? <small className="tooltip-text">{hint}</small> : null}
      </span>
      {children}
    </label>
  );
}
