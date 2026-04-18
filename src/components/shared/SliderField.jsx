export default function SliderField({ label, min, max, step, value, onChange, suffix = "" }) {
  return (
    <label className="field">
      <span className="field-label">
        {label} <strong>{value}{suffix}</strong>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}
