import Win from "../../Win";
import { ROOM_ITEMS } from "../../../data/chambreItems";
import useMondeReelState from "./hooks/useMondeReelState";
import VHSTapeTransition from "./transitions/VHSTapeTransition";
import MondeReelCanvas from "./MondeReelCanvas";
import MondeReelOverlay from "./MondeReelOverlay";
import ChambreDetailRouter from "../chambre/ChambreDetailRouter";

export default function MondeReelWindow({ onClose, onMinimize, zIndex, onFocus }) {
  const state = useMondeReelState();
  const {
    activeItem, setActiveItem, hoveredItem, setHoveredItem,
    lampOn, toggleLamp, currentCouette, goBack,
    currentZone, introPhase, onIntroComplete,
    vhsPreset, subtitle,
  } = state;

  const titleText = activeItem
    ? `Le Monde Réel — ${ROOM_ITEMS.find((i) => i.id === activeItem)?.label || ""}`
    : "Le Monde Réel";

  return (
    <Win
      title={titleText}
      onClose={onClose}
      onMinimize={onMinimize}
      width={720}
      height={580}
      zIndex={zIndex}
      onFocus={onFocus}
      initialPos={{ x: 120, y: 30 }}
      color="#6B4830"
    >
      {/* 4:3 container with black bars */}
      <div style={{
        height: "100%",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}>
        <div style={{
          position: "relative",
          width: "100%",
          maxWidth: "calc(100% * 4 / 3)",
          aspectRatio: "4 / 3",
          maxHeight: "100%",
          overflow: "hidden",
        }}>
          {/* Tape intro transition */}
          {introPhase !== "playing" && (
            <VHSTapeTransition onComplete={onIntroComplete} />
          )}

          {/* 3D scene or detail view */}
          {introPhase === "playing" && (
            <>
              {activeItem === null ? (
                <>
                  <MondeReelCanvas
                    currentZone={currentZone}
                    vhsPreset={vhsPreset}
                    lampOn={lampOn}
                    couetteColor={currentCouette.color}
                    fpsEnabled
                    onToggleLamp={toggleLamp}
                    setActiveItem={setActiveItem}
                    hoveredItem={hoveredItem}
                    setHoveredItem={setHoveredItem}
                  />
                  <MondeReelOverlay subtitle={subtitle} />
                </>
              ) : (
                <ChambreDetailRouter
                  activeItem={activeItem}
                  goBack={goBack}
                  state={state}
                />
              )}
            </>
          )}
        </div>
      </div>
    </Win>
  );
}
