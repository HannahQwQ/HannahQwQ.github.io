import { useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Html, OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { WORLD_AREAS } from '@/data/worldNodes';

function Ground() {
  const grid = useMemo(() => new THREE.GridHelper(10, 20, '#5a6678', '#253041'), []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[5.4, 72]} />
        <meshStandardMaterial color="#151c26" roughness={0.82} metalness={0.05} />
      </mesh>
      <primitive object={grid} position={[0, 0.012, 0]} />
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.65, 4.75, 72]} />
        <meshBasicMaterial color="#58c7d7" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

function Companion33() {
  return (
    <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.22}>
      <group position={[0, 1.15, 1.45]}>
        <mesh castShadow>
          <sphereGeometry args={[0.42, 36, 36]} />
          <meshStandardMaterial color="#f7f3e8" roughness={0.34} metalness={0.08} />
        </mesh>
        <mesh position={[0, -0.56, 0]} castShadow>
          <capsuleGeometry args={[0.28, 0.58, 8, 24]} />
          <meshStandardMaterial color="#1f2937" roughness={0.58} />
        </mesh>
        <Text
          position={[0, 0.68, 0]}
          fontSize={0.18}
          color="#f8fafc"
          anchorX="center"
          anchorY="middle"
        >
          33
        </Text>
        <Html position={[0.72, 0.22, 0]} center distanceFactor={7}>
          <div className="world-speech">I will keep this world small enough to enter.</div>
        </Html>
      </group>
    </Float>
  );
}

function WorldNode({ node, isActive, onHover, onSelect }) {
  const scale = isActive ? 1.08 : 1;

  return (
    <Float speed={1.1} rotationIntensity={0.08} floatIntensity={0.14}>
      <group
        position={node.position}
        scale={scale}
        onPointerOver={(event) => {
          event.stopPropagation();
          onHover(node);
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          onHover(null);
        }}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(node);
        }}
      >
        <mesh castShadow>
          <boxGeometry args={[1.08, 1.08, 1.08]} />
          <meshStandardMaterial
            color={node.color}
            roughness={0.42}
            metalness={0.18}
            emissive={node.color}
            emissiveIntensity={isActive ? 0.25 : 0.08}
          />
        </mesh>
        <mesh position={[0, -0.62, 0]}>
          <cylinderGeometry args={[0.74, 0.9, 0.18, 36]} />
          <meshStandardMaterial color="#263241" roughness={0.76} />
        </mesh>
        <Text
          position={[0, 0.82, 0]}
          fontSize={0.16}
          color="#f8fafc"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8}
        >
          {node.title}
        </Text>
      </group>
    </Float>
  );
}

function Scene({ nodes, activeNode, onHover, onSelect }) {
  return (
    <>
      <CameraSetup />
      <color attach="background" args={['#0d1118']} />
      <fog attach="fog" args={['#0d1118', 8, 18]} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 6, 3]} intensity={1.4} castShadow />
      <pointLight position={[-3, 2.5, 3]} color="#58c7d7" intensity={2.3} />
      <pointLight position={[3, 2.1, 2]} color="#f07f6f" intensity={1.5} />
      <Ground />
      <Companion33 />
      {nodes.map((node) => (
        <WorldNode
          key={node.id}
          node={node}
          isActive={activeNode?.id === node.id}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
      <OrbitControls
        target={[0, 0.5, 0]}
        enablePan={false}
        minDistance={4.5}
        maxDistance={7.8}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.25}
      />
    </>
  );
}

function CameraSetup() {
  const { camera } = useThree();

  useEffect(() => {
    camera.lookAt(0, 0.5, 0);
  }, [camera]);

  useFrame(() => {
    camera.lookAt(0, 0.5, 0);
  });

  return null;
}

export default function WorldStage({
  nodes = WORLD_AREAS,
  activeNode,
  onHoverNode,
  onSelectNode,
  lowMode = false,
}) {
  const [internalActiveNode, setInternalActiveNode] = useState(nodes[0]);
  const visibleActiveNode = activeNode || internalActiveNode;

  const handleHover = (node) => {
    setInternalActiveNode(node);
    onHoverNode?.(node);
  };

  if (lowMode) {
    return null;
  }

  return (
    <div className="world-stage">
      <Canvas
        shadows
        camera={{ position: [0, 1.6, 7], fov: 48 }}
        dpr={[1, 1.8]}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Scene
          nodes={nodes}
          activeNode={visibleActiveNode}
          onHover={handleHover}
          onSelect={onSelectNode}
        />
      </Canvas>
    </div>
  );
}
