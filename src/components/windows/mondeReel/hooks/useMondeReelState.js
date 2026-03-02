import { useState, useMemo, useCallback } from "react";
import useChambreState from "../../chambre/hooks/useChambreState";
import { ROOM_ITEMS } from "../../../../data/chambreItems";
import { VHS_DEFAULTS } from "../vhs/vhsConfig";

// VHS subtitle lookup — returns subtitle text for hovered item, or null
const VHS_SUBTITLES = Object.fromEntries(
  ROOM_ITEMS.filter((i) => i.vhsSubtitle).map((i) => [i.id, i.vhsSubtitle]),
);

export default function useMondeReelState() {
  const chambreState = useChambreState();

  // Zone navigation — Phase 1: chambre only
  const [currentZone] = useState("chambre");

  // Intro phase: "tape" → "playing"
  const [introPhase, setIntroPhase] = useState("tape");
  const onIntroComplete = useCallback(() => setIntroPhase("playing"), []);

  // VHS preset — default for now, could switch during transitions
  const [vhsPreset] = useState(VHS_DEFAULTS);

  // Subtitle: derived from hovered item
  const subtitle = useMemo(
    () => VHS_SUBTITLES[chambreState.hoveredItem] || null,
    [chambreState.hoveredItem],
  );

  return {
    ...chambreState,
    currentZone,
    introPhase,
    onIntroComplete,
    vhsPreset,
    subtitle,
  };
}
