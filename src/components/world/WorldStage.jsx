import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Html, Text } from '@react-three/drei';
import * as THREE from 'three';
import { WORLD_AREAS } from '@/data/worldNodes';

const MOUSE_SENSITIVITY = 0.0025;
const MIN_LOOK_PITCH = -0.72;
const MAX_LOOK_PITCH = 0.56;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getTerrainHeight(x, z) {
  const ridge = Math.sin(x * 0.72) * 0.18 + Math.cos(z * 0.58) * 0.14;
  const mainSlope = Math.max(0, 1 - Math.hypot(x + 2.6, z + 2.4) / 4.8) * 1.35;
  const farRise = Math.max(0, 1 - Math.hypot(x - 3.4, z + 4.6) / 4.2) * 0.82;
  const shoreDip = Math.max(0, 1 - Math.hypot(x - 1.8, z - 1.65) / 2.2) * 0.42;

  return Math.max(-0.08, ridge + mainSlope + farRise - shoreDip);
}

function FogTerrain() {
  const terrain = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(18, 18, 112, 112);
    const positions = geometry.attributes.position;

    for (let index = 0; index < positions.count; index += 1) {
      const x = positions.getX(index);
      const z = -positions.getY(index);
      positions.setZ(index, getTerrainHeight(x, z));
    }

    geometry.rotateX(-Math.PI / 2);
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  return (
    <group>
      <mesh geometry={terrain} receiveShadow>
        <meshStandardMaterial
          color="#f8fbff"
          roughness={0.96}
          metalness={0.02}
          transparent
          opacity={0.72}
          flatShading
        />
      </mesh>
      <mesh position={[-2.8, 0.82, -2.65]} rotation={[-Math.PI / 2, 0, -0.3]}>
        <circleGeometry args={[2.2, 72]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.18} depthWrite={false} />
      </mesh>
      <mesh position={[3.1, 0.5, -4.45]} rotation={[-Math.PI / 2, 0, 0.12]}>
        <circleGeometry args={[2.8, 72]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.12} depthWrite={false} />
      </mesh>
    </group>
  );
}

function WaterSurface() {
  return (
    <group>
      <mesh position={[1.82, 0.045, 1.65]} rotation={[-Math.PI / 2, 0, -0.2]} scale={[1.9, 1.05, 1]}>
        <circleGeometry args={[1, 96]} />
        <meshStandardMaterial
          color="#062c5f"
          roughness={0.24}
          metalness={0.08}
          transparent
          opacity={0.82}
          emissive="#063b7d"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[0, -0.05, -6.6]} rotation={[-Math.PI / 2, 0, 0]} scale={[8.4, 2.25, 1]}>
        <circleGeometry args={[1, 112]} />
        <meshStandardMaterial
          color="#031b3f"
          roughness={0.18}
          metalness={0.04}
          transparent
          opacity={0.76}
          emissive="#04295c"
          emissiveIntensity={0.16}
        />
      </mesh>
    </group>
  );
}

function MistLayer() {
  const wisps = useMemo(
    () => [
      [-4.2, 0.28, -1.6, 3.5, 0.34],
      [3.6, 0.36, 0.3, 3.1, 0.28],
      [0.4, 0.72, -3.8, 4.2, 0.22],
      [-0.6, 1.2, 2.4, 3.8, 0.16],
      [4.7, 1.05, -4.7, 4.5, 0.12],
    ],
    [],
  );

  return (
    <group>
      {wisps.map(([x, y, z, radius, opacity]) => (
        <mesh key={`${x}-${z}`} position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[radius, 72]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={opacity} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function MountainSilhouette() {
  return (
    <group position={[0, 0, -7.6]}>
      {[-4.8, -2.5, 0.2, 2.7, 5.1].map((x, index) => (
        <mesh
          key={x}
          position={[x, 1.25 + index * 0.12, 0]}
          rotation={[0.12, 0, index % 2 ? 0.08 : -0.08]}
          scale={[1.35 + index * 0.18, 1.55 + index * 0.28, 0.7]}
        >
          <coneGeometry args={[1.25, 2.8, 5]} />
          <meshStandardMaterial color="#eef6ff" transparent opacity={0.16} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function Companion33({ visitorPosition }) {
  const height = getTerrainHeight(visitorPosition.x, visitorPosition.z);
  const companionPosition = [visitorPosition.x + 0.78, height + 1.18, visitorPosition.z + 0.88];

  return (
    <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.22}>
      <group position={companionPosition}>
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
          <div className="world-speech">The map is mostly mist. Follow the blue water and the gates.</div>
        </Html>
      </group>
    </Float>
  );
}

function VisitorMarker({ position }) {
  const y = getTerrainHeight(position.x, position.z) + 0.42;

  return (
    <group position={[position.x, y, position.z]}>
      <mesh castShadow>
        <sphereGeometry args={[0.22, 28, 28]} />
        <meshStandardMaterial
          color="#f7f3e8"
          roughness={0.28}
          metalness={0.05}
          emissive="#58c7d7"
          emissiveIntensity={0.16}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.25, 0]}>
        <ringGeometry args={[0.32, 0.38, 30]} />
        <meshBasicMaterial color="#58c7d7" transparent opacity={0.62} />
      </mesh>
      <Text
        position={[0, 0.42, 0]}
        fontSize={0.14}
        color="#f8fafc"
        anchorX="center"
        anchorY="middle"
      >
        You
      </Text>
    </group>
  );
}

function WorldNode({ node, isActive, onHover, onSelect }) {
  const scale = isActive ? 1.08 : 1;
  const [x, , z] = node.position;
  const y = getTerrainHeight(x, z) + 0.68;

  return (
    <Float speed={1.1} rotationIntensity={0.08} floatIntensity={0.14}>
      <group
        position={[x, y, z]}
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

function Scene({ nodes, activeNode, onHover, onSelect, visitorPosition, cameraMode, cameraLook }) {
  return (
    <>
      <CameraRig visitorPosition={visitorPosition} cameraMode={cameraMode} cameraLook={cameraLook} />
      <color attach="background" args={['#eef4f8']} />
      <fog attach="fog" args={['#eef4f8', 2.2, 11]} />
      <ambientLight intensity={1.05} />
      <hemisphereLight args={['#ffffff', '#bfd8ef', 1.1]} />
      <directionalLight position={[3.8, 7.6, 4.2]} intensity={1.75} castShadow />
      <pointLight position={[0, 2.5, 3.5]} color="#ffffff" intensity={1.4} />
      <FogTerrain />
      <WaterSurface />
      <MountainSilhouette />
      <MistLayer />
      <Companion33 visitorPosition={visitorPosition} />
      <VisitorMarker position={visitorPosition} />
      {nodes.map((node) => (
        <WorldNode
          key={node.id}
          node={node}
          isActive={activeNode?.id === node.id}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

function CameraRig({ visitorPosition, cameraMode, cameraLook }) {
  const { camera } = useThree();
  const cameraTarget = useMemo(() => new THREE.Vector3(), []);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);
  const forward = useMemo(() => new THREE.Vector3(), []);
  const forwardFlat = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const groundY = getTerrainHeight(visitorPosition.x, visitorPosition.z);
    const cosPitch = Math.cos(cameraLook.pitch);

    forward.set(
      Math.sin(cameraLook.yaw) * cosPitch,
      Math.sin(cameraLook.pitch),
      -Math.cos(cameraLook.yaw) * cosPitch,
    );

    if (cameraMode === 'firstPerson') {
      cameraTarget.set(visitorPosition.x, groundY + 1.18, visitorPosition.z);
      lookTarget.copy(cameraTarget).addScaledVector(forward, 4.2);
    } else {
      const horizontalDistance = 4.35;
      const cameraLift = 2.25 + cameraLook.pitch * 1.4;
      forwardFlat.set(Math.sin(cameraLook.yaw), 0, -Math.cos(cameraLook.yaw));

      cameraTarget.set(
        visitorPosition.x - forwardFlat.x * horizontalDistance,
        groundY + cameraLift,
        visitorPosition.z - forwardFlat.z * horizontalDistance,
      );
      lookTarget.set(
        visitorPosition.x + forwardFlat.x * 1.55,
        groundY + 0.68 + cameraLook.pitch * 1.2,
        visitorPosition.z + forwardFlat.z * 1.55,
      );
    }

    camera.position.lerp(cameraTarget, 0.08);
    camera.lookAt(lookTarget);
  });

  return null;
}

export default function WorldStage({
  nodes = WORLD_AREAS,
  activeNode,
  onHoverNode,
  onSelectNode,
  visitorPosition = { x: 0, z: 0.7 },
  lowMode = false,
  cameraMode = 'thirdPerson',
  onMouseLookChange,
}) {
  const stageRef = useRef(null);
  const [internalActiveNode, setInternalActiveNode] = useState(nodes[0]);
  const [cameraLook, setCameraLook] = useState({ yaw: 0, pitch: 0.04 });
  const visibleActiveNode = activeNode || internalActiveNode;

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (document.pointerLockElement !== stageRef.current) return;

      setCameraLook((current) => ({
        yaw: current.yaw + event.movementX * MOUSE_SENSITIVITY,
        pitch: clamp(
          current.pitch - event.movementY * MOUSE_SENSITIVITY,
          MIN_LOOK_PITCH,
          MAX_LOOK_PITCH,
        ),
      }));
    };

    const handlePointerLockChange = () => {
      onMouseLookChange?.(document.pointerLockElement === stageRef.current);
    };

    const handlePointerLockError = () => {
      onMouseLookChange?.(false);
    };

    const handleKeyDown = (event) => {
      if (event.code !== 'Escape' || document.pointerLockElement !== stageRef.current) return;
      document.exitPointerLock?.();
      onMouseLookChange?.(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('pointerlockerror', handlePointerLockError);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('pointerlockerror', handlePointerLockError);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onMouseLookChange]);

  const handleHover = (node) => {
    setInternalActiveNode(node);
    onHoverNode?.(node);
  };

  const handleStageClick = () => {
    if (document.pointerLockElement || !stageRef.current?.requestPointerLock) return;
    const lockRequest = stageRef.current.requestPointerLock();
    onMouseLookChange?.(true);
    lockRequest?.catch?.(() => onMouseLookChange?.(false));
  };

  if (lowMode) {
    return null;
  }

  return (
    <div className="world-stage" ref={stageRef} onClick={handleStageClick}>
      <Canvas
        shadows
        camera={{ position: [0, 2.4, 5.2], fov: 54, near: 0.05, far: 55 }}
        dpr={[1, 1.8]}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Scene
          nodes={nodes}
          activeNode={visibleActiveNode}
          onHover={handleHover}
          onSelect={onSelectNode}
          visitorPosition={visitorPosition}
          cameraMode={cameraMode}
          cameraLook={cameraLook}
        />
      </Canvas>
    </div>
  );
}
