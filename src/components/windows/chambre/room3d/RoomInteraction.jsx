import { useRef, useCallback, useState } from "react";
import { Html } from "@react-three/drei";
import { ROOM_ITEMS } from "../../../../data/chambreItems";
import { HITBOXES } from "./roomLayout";

// Single interactive hitbox — invisible plane with hover/click events
function Hitbox({ item, hitbox, isHovered, onHover, onClick }) {
  const meshRef = useRef();
  const isFloor = !!hitbox.isFloor;

  const handlePointerOver = useCallback(
    (e) => {
      e.stopPropagation();
      onHover(hitbox.id, true);
      document.body.style.cursor = "pointer";
    },
    [hitbox.id, onHover]
  );

  const handlePointerOut = useCallback(
    (e) => {
      e.stopPropagation();
      onHover(hitbox.id, false);
      document.body.style.cursor = "auto";
    },
    [hitbox.id, onHover]
  );

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      onClick(hitbox.id);
    },
    [hitbox.id, onClick]
  );

  return (
    <group>
      <mesh
        ref={meshRef}
        position={hitbox.position}
        rotation={isFloor ? [-Math.PI / 2, 0, 0] : [0, 0, 0]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <planeGeometry args={hitbox.size} />
        <meshBasicMaterial
          transparent
          opacity={isHovered ? 0.12 : 0}
          color="#C8B0E8"
          depthWrite={false}
        />
      </mesh>

      {/* Hover border effect */}
      {isHovered && (
        <mesh
          position={hitbox.position}
          rotation={isFloor ? [-Math.PI / 2, 0, 0] : [0, 0, 0]}
        >
          <planeGeometry args={[hitbox.size[0] + 0.04, hitbox.size[1] + 0.04]} />
          <meshBasicMaterial
            transparent
            opacity={0.2}
            color="#C8B0E8"
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Tooltip via drei Html — stays crisp outside canvas pixelation */}
      {isHovered && item && (
        <Html
          position={[
            hitbox.position[0],
            hitbox.position[1] + (isFloor ? 0.3 : hitbox.size[1] / 2 + 0.15),
            hitbox.position[2] + 0.1,
          ]}
          center
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              background: "rgba(0,0,0,0.92)",
              border: "1px solid rgba(139,107,174,0.5)",
              borderRadius: 4,
              padding: "3px 10px",
              color: "#C8B0E8",
              fontSize: 11,
              fontFamily: "Tahoma, sans-serif",
              whiteSpace: "nowrap",
              userSelect: "none",
            }}
          >
            {item.hint}
          </div>
        </Html>
      )}
    </group>
  );
}

export default function RoomInteraction({
  setActiveItem,
  onToggleLamp,
  hoveredItem,
  setHoveredItem,
}) {
  const handleHover = useCallback(
    (id, entering) => {
      setHoveredItem(entering ? id : null);
    },
    [setHoveredItem]
  );

  const handleClick = useCallback(
    (id) => {
      const item = ROOM_ITEMS.find((i) => i.id === id);
      if (!item?.interactive) return;
      if (id === "lampe") {
        onToggleLamp();
        return;
      }
      setActiveItem(id);
    },
    [onToggleLamp, setActiveItem]
  );

  return (
    <group>
      {HITBOXES.map((hitbox) => {
        const item = ROOM_ITEMS.find((i) => i.id === hitbox.id);
        if (!item?.interactive) return null;
        return (
          <Hitbox
            key={hitbox.id}
            item={item}
            hitbox={hitbox}
            isHovered={hoveredItem === hitbox.id}
            onHover={handleHover}
            onClick={handleClick}
          />
        );
      })}
    </group>
  );
}
