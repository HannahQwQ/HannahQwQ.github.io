import { Link, useNavigate } from 'react-router-dom';
import WorldStage, { WORLD_NODES } from '@/components/world/WorldStage';
import './Home.css';

const GUIDE_LINES = [
  'I am 33. This is the first small version of the world.',
  'Rotate the view, choose a gate, then we can replace the blocks with real models.',
  'Avatar generation is reserved. For now, you enter as a fixed visitor.',
];

export default function Home() {
  const navigate = useNavigate();

  const handleSelectNode = (node) => {
    navigate(node.route);
  };

  return (
    <main className="home-page fade-in">
      <WorldStage onSelectNode={handleSelectNode} />

      <section className="world-map-fallback" aria-label="Interactive world map">
        <div className="fallback-orbit">
          <button
            type="button"
            className="fallback-node fallback-node-projects"
            onClick={() => handleSelectNode(WORLD_NODES[0])}
          >
            <span>Project Gate</span>
          </button>
          <button
            type="button"
            className="fallback-node fallback-node-about"
            onClick={() => handleSelectNode(WORLD_NODES[1])}
          >
            <span>Archive Wall</span>
          </button>
          <button
            type="button"
            className="fallback-node fallback-node-mailbox"
            onClick={() => handleSelectNode(WORLD_NODES[2])}
          >
            <span>Letter Box</span>
          </button>
          <div className="fallback-companion">33</div>
        </div>
      </section>

      <section className="world-hud" aria-label="World navigation">
        <div className="world-brand">
          <span className="world-kicker">Portfolio world v0.1</span>
          <h1>Enter the compact archive.</h1>
        </div>
        <nav className="world-nav">
          {WORLD_NODES.map((node) => (
            <button key={node.id} type="button" onClick={() => handleSelectNode(node)}>
              {node.title}
            </button>
          ))}
          <Link to="/contact">Contact</Link>
        </nav>
      </section>

      <aside className="world-guide" aria-label="33 guide">
        <div className="guide-avatar">33</div>
        <div className="guide-copy">
          {GUIDE_LINES.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </aside>

      <div className="world-status">
        <span>Drag to orbit</span>
        <span>Click blocks to enter</span>
      </div>
    </main>
  );
}
