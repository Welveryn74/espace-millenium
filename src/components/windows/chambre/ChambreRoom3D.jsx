import { Suspense, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import RoomScene from "./room3d/RoomScene";
import RoomInteraction from "./room3d/RoomInteraction";

const CANVAS_STYLE = {
  width: "100%",
  height: "100%",
  imageRendering: "pixelated",
};

export default function ChambreRoom3D({
  lampOn,
  couetteColor,
  onToggleLamp,
  setActiveItem,
  hoveredItem,
  setHoveredItem,
}) {
  const containerRef = useRef(null);

  // Auto-focus the container so WASD works immediately
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      style={{ position: "absolute", inset: 0, outline: "none" }}
    >
      <Canvas
        dpr={0.6}
        gl={{ antialias: false, alpha: false }}
        camera={{ fov: 60, position: [0, 1.5, 1.5], near: 0.1, far: 20 }}
        style={CANVAS_STYLE}
        raycaster={{ params: { Line: { threshold: 0.1 } } }}
      >
        <Suspense fallback={null}>
          <RoomScene lampOn={lampOn} couetteColor={couetteColor} fpsEnabled />
          <RoomInteraction
            setActiveItem={setActiveItem}
            onToggleLamp={onToggleLamp}
            hoveredItem={hoveredItem}
            setHoveredItem={setHoveredItem}
          />
        </Suspense>
      </Canvas>

      {/* Crosshair — central dot */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "rgba(200,176,232,0.45)",
          pointerEvents: "none",
        }}
      />

      {/* Hint text — HTML overlay, stays crisp */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          left: 0,
          right: 0,
          textAlign: "center",
          color: "rgba(139,107,174,0.35)",
          fontSize: 11,
          fontFamily: "Tahoma, sans-serif",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        ZQSD / WASD pour se déplacer — Clique sur les objets
      </div>
    </div>
  );
}
