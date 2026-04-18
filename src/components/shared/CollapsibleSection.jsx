export default function CollapsibleSection({ title, summary, children, defaultOpen = true }) {
  return (
    <details className="tab-section" open={defaultOpen}>
      <summary>
        <span>{title}</span>
        <small>{summary}</small>
      </summary>
      <div className="tab-section-body">{children}</div>
    </details>
  );
}
