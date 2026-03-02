import { Suspense } from "react";
import ChambreZone from "./zones/chambre/ChambreZone";
import VHSEffectComposer from "./vhs/VHSEffectComposer";

export default function MondeReelScene({
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
  return (
    <Suspense fallback={null}>
      {/* Zone router — Phase 1: chambre only */}
      {currentZone === "chambre" && (
        <ChambreZone
          lampOn={lampOn}
          couetteColor={couetteColor}
          fpsEnabled={fpsEnabled}
          onToggleLamp={onToggleLamp}
          setActiveItem={setActiveItem}
          hoveredItem={hoveredItem}
          setHoveredItem={setHoveredItem}
        />
      )}

      {/* VHS post-processing pipeline */}
      <VHSEffectComposer preset={vhsPreset} />
    </Suspense>
  );
}
