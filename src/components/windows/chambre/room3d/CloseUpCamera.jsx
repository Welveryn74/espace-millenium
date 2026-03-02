import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CLOSE_UPS } from "./closeUpPositions";

const LERP_FACTOR = 0.06; // ~0.5s to arrive
const DONE_THRESHOLD = 0.05;

const _targetPos = new THREE.Vector3();
const _targetLook = new THREE.Vector3();
const _currentLook = new THREE.Vector3();

export default function CloseUpCamera({ activeItem }) {
  const { camera } = useThree();
  const savedPos = useRef(new THREE.Vector3());
  const savedRot = useRef(new THREE.Euler());
  const prevItem = useRef(null);
  const animating = useRef(false);
  const returning = useRef(false);

  // Detect transitions
  useEffect(() => {
    if (activeItem && !prevItem.current) {
      // Entering close-up: save current camera state
      savedPos.current.copy(camera.position);
      savedRot.current.copy(camera.rotation);
      animating.current = true;
      returning.current = false;
    } else if (!activeItem && prevItem.current) {
      // Leaving close-up: animate back
      animating.current = true;
      returning.current = true;
    }
    prevItem.current = activeItem;
  }, [activeItem, camera]);

  useFrame(() => {
    if (!animating.current) return;

    if (returning.current) {
      // Fly back to saved position
      camera.position.lerp(savedPos.current, LERP_FACTOR);

      // Smoothly interpolate rotation back
      camera.rotation.x += (savedRot.current.x - camera.rotation.x) * LERP_FACTOR;
      camera.rotation.y += (savedRot.current.y - camera.rotation.y) * LERP_FACTOR;

      const dist = camera.position.distanceTo(savedPos.current);
      if (dist < DONE_THRESHOLD) {
        camera.position.copy(savedPos.current);
        camera.rotation.copy(savedRot.current);
        animating.current = false;
        returning.current = false;
      }
    } else {
      // Fly to close-up
      const closeUp = CLOSE_UPS[prevItem.current];
      if (!closeUp) {
        animating.current = false;
        return;
      }

      _targetPos.set(...closeUp.cam);
      _targetLook.set(...closeUp.lookAt);

      camera.position.lerp(_targetPos, LERP_FACTOR);

      // Compute current look direction and lerp toward target lookAt
      _currentLook.copy(camera.position).add(
        new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
      );
      _currentLook.lerp(_targetLook, LERP_FACTOR);
      camera.lookAt(_currentLook);

      const dist = camera.position.distanceTo(_targetPos);
      if (dist < DONE_THRESHOLD) {
        camera.position.copy(_targetPos);
        camera.lookAt(_targetLook);
        animating.current = false;
      }
    }
  });

  return null;
}
