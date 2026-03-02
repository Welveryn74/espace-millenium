import RoomScene from "../../../chambre/room3d/RoomScene";
import RoomInteraction from "../../../chambre/room3d/RoomInteraction";

export default function ChambreZone({
  lampOn,
  couetteColor,
  fpsEnabled,
  onToggleLamp,
  setActiveItem,
  hoveredItem,
  setHoveredItem,
}) {
  return (
    <>
      <RoomScene
        lampOn={lampOn}
        couetteColor={couetteColor}
        fpsEnabled={fpsEnabled}
      />
      <RoomInteraction
        setActiveItem={setActiveItem}
        onToggleLamp={onToggleLamp}
        hoveredItem={hoveredItem}
        setHoveredItem={setHoveredItem}
      />
    </>
  );
}
