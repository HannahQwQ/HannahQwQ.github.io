import { useEffect, useState } from 'react';
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
  const [cameraMode, setCameraMode] = useState('thirdPerson');
  const [cameraLook, setCameraLook] = useState({ yaw: 0, pitch: 0.04 });
  const [mouseLookActive, setMouseLookActive] = useState(false);
  const visitorPosition = useKeyboardMovement(undefined, cameraLook.yaw);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code !== 'KeyV') return;

      const target = event.target;
      const tagName = target?.tagName?.toLowerCase();
      if (tagName === 'input' || tagName === 'textarea' || target?.isContentEditable) return;

      event.preventDefault();
      setCameraMode((current) => (current === 'thirdPerson' ? 'firstPerson' : 'thirdPerson'));
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
        cameraMode={cameraMode}
        cameraLook={cameraLook}
        onCameraLookChange={setCameraLook}
        onMouseLookChange={setMouseLookActive}
      />

      <section
        className={`world-map-fallback ${effectiveLowMode ? 'world-map-fallback-full' : 'world-map-minimap'}`}
        aria-label="Interactive world map"
      >
        <div className="fallback-orbit">
          <div className="minimap-layer minimap-sea-channel" aria-hidden="true" />
          <div className="minimap-layer minimap-land-west" aria-hidden="true" />
          <div className="minimap-layer minimap-land-east" aria-hidden="true" />
          <div className="minimap-layer minimap-ridge-west" aria-hidden="true" />
          <div className="minimap-layer minimap-ridge-east" aria-hidden="true" />
          <div className="minimap-layer minimap-inner-lake" aria-hidden="true" />
          <div className="minimap-layer minimap-fog-bridge" aria-hidden="true" />
          <div className="minimap-layer minimap-fault-line" aria-hidden="true" />
          <div className="minimap-layer minimap-fog-west" aria-hidden="true" />
          <div className="minimap-layer minimap-fog-east" aria-hidden="true" />
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
              left: `${50 + visitorPosition.x * 5.8}%`,
              top: `${56 + visitorPosition.z * 4.4}%`,
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
        <span>{effectiveLowMode ? '2D fallback active' : cameraMode === 'thirdPerson' ? 'MMO camera' : 'First-person camera'}</span>
        <span>WASD moves with view</span>
        <span>{mouseLookActive ? 'Mouse look active · Esc to release' : 'Click scene + move mouse'}</span>
        <span>Wheel to zoom</span>
        <span>V to switch view</span>
        <Link to="/avatar">Edit signal</Link>
      </div>
    </main>
  );
}
