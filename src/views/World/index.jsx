import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import WorldStage from '@/components/world/WorldStage';
import WorldHUD from '@/components/overlay/WorldHUD';
import ObjectPreviewPanel from '@/components/overlay/ObjectPreviewPanel';
import Floating33Chat from '@/components/overlay/Floating33Chat';
import useKeyboardMovement from '@/hooks/useKeyboardMovement';
import { DEFAULT_VISITOR_SIGNAL, WORLD_AREAS } from '@/data/worldNodes';
import './World.css';

function loadVisitorSignal() {
  try {
    const saved = localStorage.getItem('visitorSignal');
    return saved ? { ...DEFAULT_VISITOR_SIGNAL, ...JSON.parse(saved) } : DEFAULT_VISITOR_SIGNAL;
  } catch {
    return DEFAULT_VISITOR_SIGNAL;
  }
}

function canUseWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function World() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lowMode = searchParams.get('mode') === '2d';
  const [webglAvailable] = useState(canUseWebGL);
  const effectiveLowMode = lowMode || !webglAvailable;
  const [visitorSignal] = useState(loadVisitorSignal);
  const [activeNode, setActiveNode] = useState(WORLD_AREAS[0]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const visitorPosition = useKeyboardMovement();

  const selectNode = (node) => {
    setActiveNode(node);
    setSelectedNode(node);
  };

  const openSelectedNode = () => {
    if (selectedNode) navigate(selectedNode.route);
  };

  return (
    <main className="home-page fade-in">
      <WorldStage
        nodes={WORLD_AREAS}
        activeNode={activeNode}
        onHoverNode={(node) => node && setActiveNode(node)}
        onSelectNode={selectNode}
        visitorPosition={visitorPosition}
        lowMode={effectiveLowMode}
      />

      <section
        className={`world-map-fallback ${effectiveLowMode ? 'world-map-fallback-full' : 'world-map-minimap'}`}
        aria-label="Interactive world map"
      >
        <div className="fallback-orbit">
          {WORLD_AREAS.map((node) => (
            <button
              key={node.id}
              type="button"
              className={`fallback-node ${node.fallbackClassName} ${activeNode.id === node.id ? 'active' : ''}`}
              onMouseEnter={() => setActiveNode(node)}
              onFocus={() => setActiveNode(node)}
              onClick={() => selectNode(node)}
            >
              <span>{node.fallbackLabel}</span>
            </button>
          ))}
          <div className="fallback-companion" style={{ '--visitor-color': visitorSignal.color }}>
            33
          </div>
          <div
            className="fallback-visitor"
            style={{
              '--visitor-color': visitorSignal.color,
              left: `${50 + visitorPosition.x * 8}%`,
              top: `${54 + visitorPosition.z * 8}%`,
            }}
          >
            You
          </div>
        </div>
      </section>

      <WorldHUD
        nodes={WORLD_AREAS}
        activeNode={activeNode}
        visitorSignal={visitorSignal}
        onSelectNode={selectNode}
        lowMode={effectiveLowMode}
      />

      <ObjectPreviewPanel
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onOpen={openSelectedNode}
        onAsk33={() => setChatOpen(true)}
      />

      <Floating33Chat
        activeNode={selectedNode || activeNode}
        isOpen={chatOpen}
        onToggle={() => setChatOpen((current) => !current)}
      />

      <div className="world-status">
        <span>{effectiveLowMode ? '2D fallback active' : 'Drag to orbit'}</span>
        <span>WASD / Arrow keys to move</span>
        <Link to="/avatar">Edit signal</Link>
      </div>
    </main>
  );
}
