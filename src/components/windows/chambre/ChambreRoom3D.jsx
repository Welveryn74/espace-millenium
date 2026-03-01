import { Suspense } from "react";
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
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Canvas
        dpr={0.4}
        gl={{ antialias: false, alpha: false }}
        camera={{ fov: 60, position: [0, 1.5, 2.0], near: 0.1, far: 20 }}
        style={CANVAS_STYLE}
        raycaster={{ params: { Line: { threshold: 0.1 } } }}
      >
        <Suspense fallback={null}>
          <RoomScene lampOn={lampOn} couetteColor={couetteColor} />
          <RoomInteraction
            setActiveItem={setActiveItem}
            onToggleLamp={onToggleLamp}
            hoveredItem={hoveredItem}
            setHoveredItem={setHoveredItem}
          />
        </Suspense>
      </Canvas>

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
        Clique sur les objets pour les explorer
      </div>
    </div>
  );
}
