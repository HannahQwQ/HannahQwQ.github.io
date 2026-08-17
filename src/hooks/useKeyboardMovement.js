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

const WORLD_LIMIT = 3.8;
const SPEED = 2.4;

function clamp(value) {
  return Math.max(-WORLD_LIMIT, Math.min(WORLD_LIMIT, value));
}

function shouldIgnoreKeyboard(event) {
  const target = event.target;
  const tagName = target?.tagName?.toLowerCase();
  return tagName === 'input' || tagName === 'textarea' || target?.isContentEditable;
}

export default function useKeyboardMovement(initialPosition = { x: 0, z: 0.7 }) {
  const [position, setPosition] = useState(initialPosition);
  const pressedKeysRef = useRef(new Set());
  const lastFrameRef = useRef(0);

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
      let dx = 0;
      let dz = 0;

      if (keys.has('KeyW') || keys.has('ArrowUp')) dz -= 1;
      if (keys.has('KeyS') || keys.has('ArrowDown')) dz += 1;
      if (keys.has('KeyA') || keys.has('ArrowLeft')) dx -= 1;
      if (keys.has('KeyD') || keys.has('ArrowRight')) dx += 1;

      if (dx !== 0 || dz !== 0) {
        const length = Math.hypot(dx, dz) || 1;
        const step = SPEED * delta;
        setPosition((current) => ({
          x: clamp(current.x + (dx / length) * step),
          z: clamp(current.z + (dz / length) * step),
        }));
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, []);

  return position;
}
