import { useEffect, useRef, useState } from 'react';

const MOVEMENT_KEYS = new Set([
  'KeyW',
  'KeyA',
  'KeyS',
  'KeyD',
  'ArrowUp',
  'ArrowLeft',
  'ArrowDown',
  'ArrowRight',
]);

const WORLD_LIMIT = 5.2;
const SPEED = 2.4;

function clamp(value) {
  return Math.max(-WORLD_LIMIT, Math.min(WORLD_LIMIT, value));
}

function shouldIgnoreKeyboard(event) {
  const target = event.target;
  const tagName = target?.tagName?.toLowerCase();
  return tagName === 'input' || tagName === 'textarea' || target?.isContentEditable;
}

export default function useKeyboardMovement(initialPosition = { x: 0, z: 0.7 }, lookYaw = 0) {
  const [position, setPosition] = useState(initialPosition);
  const pressedKeysRef = useRef(new Set());
  const lastFrameRef = useRef(0);
  const lookYawRef = useRef(lookYaw);

  useEffect(() => {
    lookYawRef.current = lookYaw;
  }, [lookYaw]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!MOVEMENT_KEYS.has(event.code) || shouldIgnoreKeyboard(event)) return;
      event.preventDefault();
      pressedKeysRef.current.add(event.code);
    };

    const handleKeyUp = (event) => {
      if (!MOVEMENT_KEYS.has(event.code)) return;
      event.preventDefault();
      pressedKeysRef.current.delete(event.code);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    let frameId;

    const tick = (time) => {
      const lastFrame = lastFrameRef.current || time;
      const delta = Math.min((time - lastFrame) / 1000, 0.05);
      lastFrameRef.current = time;

      const keys = pressedKeysRef.current;
      let strafe = 0;
      let forward = 0;

      if (keys.has('KeyW') || keys.has('ArrowUp')) forward += 1;
      if (keys.has('KeyS') || keys.has('ArrowDown')) forward -= 1;
      if (keys.has('KeyA') || keys.has('ArrowLeft')) strafe -= 1;
      if (keys.has('KeyD') || keys.has('ArrowRight')) strafe += 1;

      if (strafe !== 0 || forward !== 0) {
        const yaw = lookYawRef.current;
        const length = Math.hypot(strafe, forward) || 1;
        const step = SPEED * delta;
        const worldDx = Math.sin(yaw) * forward + Math.cos(yaw) * strafe;
        const worldDz = -Math.cos(yaw) * forward + Math.sin(yaw) * strafe;

        setPosition((current) => ({
          x: clamp(current.x + (worldDx / length) * step),
          z: clamp(current.z + (worldDz / length) * step),
        }));
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, []);

  return position;
}
