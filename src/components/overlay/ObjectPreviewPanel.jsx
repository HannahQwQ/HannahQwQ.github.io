export default function ObjectPreviewPanel({ node, onClose, onOpen, onAsk33 }) {
  if (!node) return null;

  return (
    <aside className="object-preview" aria-label={`${node.title} preview`}>
      <button className="panel-close" type="button" onClick={onClose}>
        Close
      </button>
      <span className="panel-kicker">{node.area}</span>
      <h2>{node.preview.title}</h2>
      <p>{node.preview.summary}</p>
      <div className="panel-stack">
        {node.preview.stack.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <div className="panel-actions">
        <button type="button" onClick={onOpen}>
          {node.preview.actionLabel}
        </button>
        <button type="button" onClick={onAsk33}>
          Ask 33
        </button>
      </div>
    </aside>
  );
}
