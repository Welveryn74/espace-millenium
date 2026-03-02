import { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import MondeReelScene from "./MondeReelScene";

const CANVAS_STYLE = {
  width: "100%",
  height: "100%",
  imageRendering: "pixelated",
};

export default function MondeReelCanvas({
  currentZone,
  vhsPreset,
  lampOn,
  couetteColor,
  fpsEnabled,
  onToggleLamp,
  setActiveItem,
  hoveredItem,
  setHoveredItem,
}) {
  const containerRef = useRef(null);

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
        dpr={0.5}
        gl={{ antialias: false, alpha: false }}
        camera={{ fov: 60, position: [0, 1.5, 1.5], near: 0.1, far: 20 }}
        style={CANVAS_STYLE}
        raycaster={{ params: { Line: { threshold: 0.1 } } }}
      >
        <MondeReelScene
          currentZone={currentZone}
          vhsPreset={vhsPreset}
          lampOn={lampOn}
          couetteColor={couetteColor}
          fpsEnabled={fpsEnabled}
          onToggleLamp={onToggleLamp}
          setActiveItem={setActiveItem}
          hoveredItem={hoveredItem}
          setHoveredItem={setHoveredItem}
        />
      </Canvas>
    </div>
  );
}
