import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Html, PerspectiveCamera, Text } from '@react-three/drei';
import * as THREE from 'three';
import { WORLD_AREAS } from '@/data/worldNodes';

const MOUSE_SENSITIVITY = 0.0025;
const MIN_LOOK_PITCH = -0.72;
const MAX_LOOK_PITCH = 0.56;
const DEFAULT_CAMERA_DISTANCE = 4.35;
const MIN_CAMERA_DISTANCE = 2.35;
const MAX_CAMERA_DISTANCE = 7.2;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function rotatedEllipseMask(x, z, centerX, centerZ, radiusX, radiusZ, rotation = 0) {
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  const dx = x - centerX;
  const dz = z - centerZ;
  const localX = dx * cos - dz * sin;
  const localZ = dx * sin + dz * cos;
  const distance = Math.hypot(localX / radiusX, localZ / radiusZ);

  return clamp(1 - distance, 0, 1);
}

function getTerrainHeight(x, z) {
  const seaChannel = rotatedEllipseMask(x, z, 0.12, -0.55, 3.35, 8.2, -0.28);
  const innerLake = rotatedEllipseMask(x, z, -3.25, 2.55, 1.55, 0.92, -0.12);
  const westHighland = rotatedEllipseMask(x, z, -4.2, -2.75, 3.9, 3.1, -0.18);
  const eastHighland = rotatedEllipseMask(x, z, 4.15, -2.1, 3.35, 4.25, 0.18);
  const southShelf = rotatedEllipseMask(x, z, -3.4, 3.15, 2.7, 1.9, -0.28);
  const mistBridge = rotatedEllipseMask(x, z, 0.05, 0.65, 1.35, 0.82, -0.2);
  const ridgeGrain = Math.sin(x * 0.64 + z * 0.22) * 0.08 + Math.cos(z * 0.52) * 0.06;

  const land =
    0.1 +
    ridgeGrain +
    westHighland * 1.55 +
    eastHighland * 1.35 +
    southShelf * 0.72 +
    mistBridge * 0.48;
  const waterCut = seaChannel * 0.78 * (1 - mistBridge * 0.68) + innerLake * 0.56;

  return Math.max(-0.18, land - waterCut);
}

function FogTerrain() {
  const terrain = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(24, 18, 144, 112);
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
        />
      </mesh>
      <mesh position={[-4.2, 1.24, -2.75]} rotation={[-Math.PI / 2, 0, -0.18]} scale={[1.55, 0.95, 1]}>
        <circleGeometry args={[2.2, 72]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.18} depthWrite={false} />
      </mesh>
      <mesh position={[4.2, 0.92, -2.1]} rotation={[-Math.PI / 2, 0, 0.18]} scale={[1.1, 1.45, 1]}>
        <circleGeometry args={[2.4, 72]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.12} depthWrite={false} />
      </mesh>
      <mesh position={[0.05, 0.14, 0.65]} rotation={[-Math.PI / 2, 0, -0.2]} scale={[1.35, 0.82, 1]}>
        <circleGeometry args={[1, 72]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.42} depthWrite={false} />
      </mesh>
    </group>
  );
}

function WaterSurface() {
  return (
    <group>
      <mesh position={[0.12, 0.035, -0.55]} rotation={[-Math.PI / 2, 0, -0.28]} scale={[3.35, 8.2, 1]}>
        <circleGeometry args={[1, 96]} />
        <meshStandardMaterial
          color="#031b3f"
          roughness={0.24}
          metalness={0.08}
          transparent
          opacity={0.82}
          emissive="#04295c"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[-3.25, 0.07, 2.55]} rotation={[-Math.PI / 2, 0, -0.12]} scale={[1.55, 0.92, 1]}>
        <circleGeometry args={[1, 112]} />
        <meshStandardMaterial
          color="#062c5f"
          roughness={0.18}
          metalness={0.04}
          transparent
          opacity={0.8}
          emissive="#063b7d"
          emissiveIntensity={0.16}
        />
      </mesh>
    </group>
  );
}

function MistLayer() {
  const wisps = useMemo(
    () => [
      [-4.7, 0.34, -1.2, 4.1, 0.34],
      [4.3, 0.42, -0.4, 3.8, 0.28],
      [0.2, 0.74, -3.4, 4.8, 0.22],
      [-2.6, 1.08, 2.8, 3.9, 0.18],
      [4.9, 1.16, -4.4, 4.6, 0.13],
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
    <group>
      {[
        [-5.7, -4.9, 1.7, 1.25, -0.16],
        [-3.4, -4.7, 2.1, 1.45, 0.08],
        [3.5, -5.2, 1.75, 1.35, 0.12],
        [5.6, -4.4, 2.25, 1.6, -0.08],
      ].map(([x, z, height, width, rotation]) => (
        <mesh
          key={`${x}-${z}`}
          position={[x, getTerrainHeight(x, z) + height * 0.38, z]}
          rotation={[0.08, 0, rotation]}
          scale={[width, height, 0.62]}
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
  const companionPosition = [visitorPosition.x + 0.52, height + 0.74, visitorPosition.z + 0.58];

  return (
    <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.22}>
      <group position={companionPosition}>
        <mesh castShadow>
          <sphereGeometry args={[0.24, 36, 36]} />
          <meshStandardMaterial color="#f7f3e8" roughness={0.34} metalness={0.08} />
        </mesh>
        <mesh position={[0, -0.32, 0]} castShadow>
          <capsuleGeometry args={[0.16, 0.34, 8, 24]} />
          <meshStandardMaterial color="#1f2937" roughness={0.58} />
        </mesh>
        <Text
          position={[0, 0.4, 0]}
          fontSize={0.11}
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
  const y = getTerrainHeight(position.x, position.z) + 0.26;

  return (
    <group position={[position.x, y, position.z]}>
      <mesh castShadow>
        <sphereGeometry args={[0.13, 28, 28]} />
        <meshStandardMaterial
          color="#f7f3e8"
          roughness={0.28}
          metalness={0.05}
          emissive="#58c7d7"
          emissiveIntensity={0.16}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}>
        <ringGeometry args={[0.19, 0.23, 30]} />
        <meshBasicMaterial color="#58c7d7" transparent opacity={0.62} />
      </mesh>
      <Text
        position={[0, 0.26, 0]}
        fontSize={0.08}
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
  const scale = isActive ? 1.06 : 1;
  const [x, , z] = node.position;
  const y = getTerrainHeight(x, z) + 0.48;

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
          <boxGeometry args={[0.72, 0.72, 0.72]} />
          <meshStandardMaterial
            color={node.color}
            roughness={0.42}
            metalness={0.18}
            emissive={node.color}
            emissiveIntensity={isActive ? 0.25 : 0.08}
          />
        </mesh>
        <mesh position={[0, -0.42, 0]}>
          <cylinderGeometry args={[0.46, 0.58, 0.12, 36]} />
          <meshStandardMaterial color="#263241" roughness={0.76} />
        </mesh>
        <Text
          position={[0, 0.56, 0]}
          fontSize={0.11}
          color="#f8fafc"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.25}
        >
          {node.title}
        </Text>
      </group>
    </Float>
  );
}

function Scene({
  nodes,
  activeNode,
  onHover,
  onSelect,
  visitorPosition,
  cameraMode,
  cameraLook,
  cameraDistance,
}) {
  return (
    <>
      <CameraRig
        visitorPosition={visitorPosition}
        cameraMode={cameraMode}
        cameraLook={cameraLook}
        cameraDistance={cameraDistance}
      />
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

function CameraRig({ visitorPosition, cameraMode, cameraLook, cameraDistance }) {
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
      const cameraLift = 1.2 + cameraDistance * 0.24 + cameraLook.pitch * 1.4;
      forwardFlat.set(Math.sin(cameraLook.yaw), 0, -Math.cos(cameraLook.yaw));

      cameraTarget.set(
        visitorPosition.x - forwardFlat.x * cameraDistance,
        groundY + cameraLift,
        visitorPosition.z - forwardFlat.z * cameraDistance,
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
  cameraLook = { yaw: 0, pitch: 0.04 },
  onCameraLookChange,
  onMouseLookChange,
}) {
  const stageRef = useRef(null);
  const [internalActiveNode, setInternalActiveNode] = useState(nodes[0]);
  const [cameraDistance, setCameraDistance] = useState(DEFAULT_CAMERA_DISTANCE);
  const visibleActiveNode = activeNode || internalActiveNode;
  const cameraFov =
    cameraMode === 'firstPerson'
      ? clamp(62 - (cameraDistance - MIN_CAMERA_DISTANCE) * 4.8, 42, 62)
      : 54;

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (document.pointerLockElement !== stageRef.current) return;

      onCameraLookChange?.((current) => ({
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
  }, [onCameraLookChange, onMouseLookChange]);

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

  const handleWheel = (event) => {
    event.preventDefault();
    setCameraDistance((current) =>
      clamp(current + event.deltaY * 0.0048, MIN_CAMERA_DISTANCE, MAX_CAMERA_DISTANCE),
    );
  };

  if (lowMode) {
    return null;
  }

  return (
    <div className="world-stage" ref={stageRef} onClick={handleStageClick} onWheel={handleWheel}>
      <Canvas
        shadows
        dpr={[1, 1.8]}
        gl={{ preserveDrawingBuffer: true }}
      >
        <PerspectiveCamera makeDefault position={[0, 2.4, 5.2]} fov={cameraFov} near={0.05} far={55} />
        <Scene
          nodes={nodes}
          activeNode={visibleActiveNode}
          onHover={handleHover}
          onSelect={onSelectNode}
          visitorPosition={visitorPosition}
          cameraMode={cameraMode}
          cameraLook={cameraLook}
          cameraDistance={cameraDistance}
        />
      </Canvas>
    </div>
  );
}
