import { useCallback } from "react";
import Win from "../../Win";
import { ROOM_ITEMS } from "../../../data/chambreItems";
import useChambreState from "./hooks/useChambreState";
import ChambreDoorAnimation from "./ChambreDoorAnimation";
import ChambreRoomSVG from "./ChambreRoomSVG";
import ChambreDetailRouter from "./ChambreDetailRouter";

export default function ChambreWindow({ onClose, onMinimize, zIndex, onFocus }) {
  const state = useChambreState();
  const { activeItem, setActiveItem, hoveredItem, setHoveredItem, doorPhase, setDoorPhase,
          lampOn, toggleLamp, currentCouette, goBack } = state;

  const onDoorComplete = useCallback(() => setDoorPhase("done"), [setDoorPhase]);

  const titleText = activeItem
    ? `La Chambre — ${ROOM_ITEMS.find((i) => i.id === activeItem)?.label || ""}`
    : "La Chambre d'Enfant";

  return (
    <Win title={titleText} onClose={onClose} onMinimize={onMinimize}
         width={660} height={580} zIndex={zIndex} onFocus={onFocus}
         initialPos={{ x: 160, y: 40 }} color="#8B6BAE">
      <div style={{
        height: "100%",
        background: "linear-gradient(180deg, #0a0612 0%, #1a1028 50%, #0a0612 100%)",
        overflow: "hidden",
        position: "relative",
      }}>
        {/* Door animation (plays once on open) */}
        {doorPhase !== "done" && (
          <ChambreDoorAnimation onComplete={onDoorComplete} />
        )}

        {/* Room or detail view */}
        {doorPhase === "done" && (
          <>
            {activeItem === null ? (
              <ChambreRoomSVG
                lampOn={lampOn}
                couetteColor={currentCouette.color}
                onToggleLamp={toggleLamp}
                setActiveItem={setActiveItem}
                hoveredItem={hoveredItem}
                setHoveredItem={setHoveredItem}
              />
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
    </Win>
  );
}
