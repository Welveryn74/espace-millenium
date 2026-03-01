import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ROOM_BOUNDS, FURNITURE_COLLIDERS } from "./roomColliders";

const SPEED = 2.0;
const MAX_DELTA = 0.05; // clamp to 50ms
const LERP = 0.08;
const MAX_YAW = (50 * Math.PI) / 180;
const MAX_PITCH = (25 * Math.PI) / 180;
const PLAYER_RADIUS = 0.25;

// AZERTY + QWERTY + arrows combined
const FORWARD = new Set(["KeyW", "KeyZ", "ArrowUp"]);
const BACK = new Set(["KeyS", "ArrowDown"]);
const LEFT = new Set(["KeyA", "KeyQ", "ArrowLeft"]);
const RIGHT = new Set(["KeyD", "ArrowRight"]);
const ALL_KEYS = new Set([...FORWARD, ...BACK, ...LEFT, ...RIGHT]);

function circleVsAABB(cx, cz, r, box) {
  const nearX = Math.max(box.minX, Math.min(cx, box.maxX));
  const nearZ = Math.max(box.minZ, Math.min(cz, box.maxZ));
  const dx = cx - nearX;
  const dz = cz - nearZ;
  return dx * dx + dz * dz < r * r;
}

export default function FirstPersonController({ enabled = true }) {
  const { camera, gl } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const keys = useRef(new Set());
  const posRef = useRef([0, 1.5, 1.5]);

  // Init camera position
  useEffect(() => {
    camera.position.set(...posRef.current);
  }, [camera]);

  // Mouse look — on canvas element
  useEffect(() => {
    const el = gl.domElement;
    const handler = (e) => {
      const rect = el.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    el.addEventListener("mousemove", handler);
    return () => el.removeEventListener("mousemove", handler);
  }, [gl]);

  // Keyboard — on window (enabled prop handles isolation)
  useEffect(() => {
    if (!enabled) {
      keys.current.clear();
      return;
    }
    const onDown = (e) => {
      if (ALL_KEYS.has(e.code)) {
        e.preventDefault();
        keys.current.add(e.code);
      }
    };
    const onUp = (e) => {
      keys.current.delete(e.code);
    };
    const onBlur = () => {
      keys.current.clear();
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      window.removeEventListener("blur", onBlur);
      keys.current.clear();
    };
  }, [enabled]);

  useFrame((_, rawDelta) => {
    if (!enabled) return;
    const delta = Math.min(rawDelta, MAX_DELTA);

    // --- Mouse look (lerp) ---
    target.current.x += (mouse.current.x - target.current.x) * LERP;
    target.current.y += (mouse.current.y - target.current.y) * LERP;
    camera.rotation.order = "YXZ";
    camera.rotation.y = -target.current.x * MAX_YAW;
    camera.rotation.x = target.current.y * MAX_PITCH;

    // --- WASD movement ---
    const k = keys.current;
    let fwd = 0;
    let strafe = 0;
    for (const code of k) {
      if (FORWARD.has(code)) fwd -= 1;
      if (BACK.has(code)) fwd += 1;
      if (LEFT.has(code)) strafe -= 1;
      if (RIGHT.has(code)) strafe += 1;
    }
    if (fwd === 0 && strafe === 0) return;

    // Normalize diagonal
    const len = Math.sqrt(fwd * fwd + strafe * strafe);
    fwd /= len;
    strafe /= len;

    const yaw = camera.rotation.y;
    const sinY = Math.sin(yaw);
    const cosY = Math.cos(yaw);
    const moveX = (strafe * cosY - fwd * sinY) * SPEED * delta;
    const moveZ = (strafe * sinY + fwd * cosY) * SPEED * delta;

    const pos = posRef.current;
    // Try X independently (wall-sliding)
    let newX = pos[0] + moveX;
    let newZ = pos[2];
    newX = Math.max(ROOM_BOUNDS.minX, Math.min(ROOM_BOUNDS.maxX, newX));
    let blocked = false;
    for (const box of FURNITURE_COLLIDERS) {
      if (circleVsAABB(newX, newZ, PLAYER_RADIUS, box)) {
        blocked = true;
        break;
      }
    }
    if (blocked) newX = pos[0];

    // Try Z independently
    newZ = pos[2] + moveZ;
    newZ = Math.max(ROOM_BOUNDS.minZ, Math.min(ROOM_BOUNDS.maxZ, newZ));
    blocked = false;
    for (const box of FURNITURE_COLLIDERS) {
      if (circleVsAABB(newX, newZ, PLAYER_RADIUS, box)) {
        blocked = true;
        break;
      }
    }
    if (blocked) newZ = pos[2];

    pos[0] = newX;
    pos[2] = newZ;
    camera.position.x = newX;
    camera.position.z = newZ;
  });

  return null;
}
