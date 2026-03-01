import { useState, useRef, useCallback, useEffect } from "react";
import { DESKTOP_ICONS } from "../data/desktopIcons";
import NostalImg from "./NostalImg";
import { playIconSelect } from "../utils/uiSounds";
import { loadState, saveState } from "../utils/storage";

const GRID = 90;
const ICON_W = 90;
const ICON_H = 90;
const DRAG_THRESHOLD = 5;

function getDefaultPositions() {
  const positions = {};
  DESKTOP_ICONS.forEach((icon, i) => {
    const col = Math.floor(i / 8);
    const row = i % 8;
    positions[icon.id] = { x: 18 + col * GRID, y: 18 + row * GRID };
  });
  return positions;
}

export function resetIconPositions() {
  saveState('icon_positions', null);
}

export default function DesktopIcons({ selectedIcon, setSelectedIcon, openWindow, konamiActive }) {
  const [positions, setPositions] = useState(() => {
    const saved = loadState('icon_positions', null);
    return saved || getDefaultPositions();
  });
  const dragRef = useRef(null);

  // Persist positions
  useEffect(() => {
    saveState('icon_positions', positions);
  }, [positions]);

  const handleMouseDown = useCallback((e, iconId) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startPos = { ...positions[iconId] };
    let dragging = false;

    const onMouseMove = (ev) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (!dragging && Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
      dragging = true;
      dragRef.current = true;

      // Snap to grid + constrain to viewport
      const maxX = window.innerWidth - ICON_W;
      const maxY = window.innerHeight - ICON_H - 36; // taskbar
      const newX = Math.max(0, Math.min(maxX, Math.round((startPos.x + dx) / GRID) * GRID));
      const newY = Math.max(0, Math.min(maxY, Math.round((startPos.y + dy) / GRID) * GRID));

      setPositions(prev => ({ ...prev, [iconId]: { x: newX, y: newY } }));
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      // Small delay to let onClick distinguish drag from click
      setTimeout(() => { dragRef.current = false; }, 50);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [positions]);

  const handleClick = useCallback((e, iconId) => {
    e.stopPropagation();
    if (dragRef.current) return;
    playIconSelect();
    setSelectedIcon(iconId);
  }, [setSelectedIcon]);

  const handleDoubleClick = useCallback((iconId) => {
    if (dragRef.current) return;
    openWindow(iconId);
  }, [openWindow]);

  // Reset to default positions (called externally via ref or prop)
  return (
    <>
      {DESKTOP_ICONS.map((icon) => {
        const pos = positions[icon.id] || { x: 18, y: 18 };
        return (
          <div
            key={icon.id}
            onMouseDown={(e) => handleMouseDown(e, icon.id)}
            onClick={(e) => handleClick(e, icon.id)}
            onDoubleClick={() => handleDoubleClick(icon.id)}
            style={{
              position: "absolute",
              left: pos.x, top: pos.y,
              width: ICON_W, padding: "10px 6px", borderRadius: 3, cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              background: selectedIcon === icon.id ? "rgba(80,130,255,0.35)" : "transparent",
              border: selectedIcon === icon.id ? "1px dotted rgba(150,200,255,0.6)" : "1px solid transparent",
              transition: "background 0.1s",
              zIndex: 1,
              userSelect: "none",
              boxSizing: "border-box",
            }}
            onMouseEnter={e => { if (selectedIcon !== icon.id) e.currentTarget.style.background = "rgba(80,130,255,0.15)"; }}
            onMouseLeave={e => { if (selectedIcon !== icon.id) e.currentTarget.style.background = "transparent"; }}
          >
            <div style={{
              filter: "drop-shadow(1px 2px 3px rgba(0,0,0,0.5))",
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: konamiActive ? "konamiSpin 0.5s linear infinite" : "none",
              pointerEvents: "none",
            }}>
              <NostalImg src={icon.img} fallback={icon.emoji} size={52} alt={icon.label} />
            </div>
            <div style={{
              color: "#fff", fontSize: 12, textAlign: "center", lineHeight: 1.3,
              textShadow: "1px 1px 3px #000, -1px -1px 3px #000, 1px -1px 3px #000, -1px 1px 3px #000",
              whiteSpace: "pre-line", fontWeight: 500,
              pointerEvents: "none",
            }}>{icon.label}</div>
          </div>
        );
      })}
    </>
  );
}
