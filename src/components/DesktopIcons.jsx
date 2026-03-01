import { useState, useRef, useCallback, useEffect } from "react";
import { DESKTOP_ICONS } from "../data/desktopIcons";
import NostalImg from "./NostalImg";
import { playIconSelect } from "../utils/uiSounds";
import { loadState, saveState } from "../utils/storage";

const GRID = 100;
const ICON_W = 80;
const ICON_H = 100;
const PAD_X = 12;
const PAD_Y = 10;
const ICONS_PER_COL = 7;
const DRAG_THRESHOLD = 5;

function getDefaultPositions() {
  const positions = {};
  DESKTOP_ICONS.forEach((icon, i) => {
    const col = Math.floor(i / ICONS_PER_COL);
    const row = i % ICONS_PER_COL;
    positions[icon.id] = { x: PAD_X + col * GRID, y: PAD_Y + row * GRID };
  });
  return positions;
}

export function resetIconPositions() {
  saveState('icon_grid_v2', null);
}

export default function DesktopIcons({ selectedIcon, setSelectedIcon, openWindow, konamiActive }) {
  const [positions, setPositions] = useState(() => {
    const saved = loadState('icon_grid_v2', null);
    return saved || getDefaultPositions();
  });
  const dragRef = useRef(null);

  // Persist positions
  useEffect(() => {
    saveState('icon_grid_v2', positions);
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

      // Snap to grid (offset-aware) + constrain to viewport
      const maxX = window.innerWidth - ICON_W;
      const maxY = window.innerHeight - ICON_H - 36; // taskbar
      const rawX = startPos.x + dx;
      const rawY = startPos.y + dy;
      const snapX = PAD_X + Math.round((rawX - PAD_X) / GRID) * GRID;
      const snapY = PAD_Y + Math.round((rawY - PAD_Y) / GRID) * GRID;
      const newX = Math.max(PAD_X, Math.min(maxX, snapX));
      const newY = Math.max(PAD_Y, Math.min(maxY, snapY));

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
        const pos = positions[icon.id] || { x: PAD_X, y: PAD_Y };
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
