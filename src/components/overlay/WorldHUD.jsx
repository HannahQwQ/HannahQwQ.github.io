import { Link } from 'react-router-dom';

export default function WorldHUD({ nodes, activeNode, visitorSignal, onSelectNode, lowMode }) {
  return (
    <section className="world-hud" aria-label="World navigation">
      <div className="world-brand">
        <span className="world-kicker">Portfolio world MVP</span>
        <h1>Compact world, clear gates.</h1>
        <p>{activeNode ? activeNode.guide : 'Hover a gate for context. Click to inspect.'}</p>
      </div>
      <nav className="world-nav">
        {nodes.map((node) => (
          <button key={node.id} type="button" onClick={() => onSelectNode(node)}>
            {node.title}
          </button>
        ))}
        <Link to="/contact">Contact</Link>
        <Link to={lowMode ? '/world' : '/world?mode=2d'}>{lowMode ? 'Canvas mode' : '2D mode'}</Link>
      </nav>
      <div className="visitor-chip" style={{ '--visitor-color': visitorSignal.color }}>
        <span />
        {visitorSignal.nickname || 'Visitor'} · {visitorSignal.trail}
      </div>
    </section>
  );
}
