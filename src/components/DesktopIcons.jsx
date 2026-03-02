import { useState, useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from "react";
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

const DesktopIcons = forwardRef(function DesktopIcons({ openWindow, konamiActive }, ref) {
  const [positions, setPositions] = useState(() => {
    const saved = loadState('icon_grid_v2', null);
    return saved || getDefaultPositions();
  });
  const [selectedIcons, setSelectedIcons] = useState(new Set());
  const [rubberBand, setRubberBand] = useState(null);

  // Refs pour accéder aux valeurs courantes dans les closures d'événements
  const isDraggingRef = useRef(false);
  const positionsRef = useRef(positions);
  const selectedIconsRef = useRef(selectedIcons);
  positionsRef.current = positions;
  selectedIconsRef.current = selectedIcons;

  useImperativeHandle(ref, () => ({
    clearSelection: () => setSelectedIcons(new Set()),
    startRubberBand: (e) => handleOverlayMouseDown(e),
  }));

  useEffect(() => {
    saveState('icon_grid_v2', positions);
  }, [positions]);

  const handleIconMouseDown = useCallback((e, iconId) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation(); // empêche l'overlay rubber-band de se déclencher

    const startX = e.clientX;
    const startY = e.clientY;
    const currentPositions = positionsRef.current;
    const currentSelected = selectedIconsRef.current;

    // Si l'icône cliquée est dans la sélection, déplacer tout le groupe, sinon juste elle
    const willDragSet = currentSelected.has(iconId)
      ? new Set(currentSelected)
      : new Set([iconId]);

    const startPositions = {};
    willDragSet.forEach(id => {
      startPositions[id] = { ...currentPositions[id] };
    });

    let dragging = false;

    const onMouseMove = (ev) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (!dragging && Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
      dragging = true;
      isDraggingRef.current = true;

      const maxX = window.innerWidth - ICON_W;
      const maxY = window.innerHeight - ICON_H - 36;

      setPositions(prev => {
        const next = { ...prev };
        willDragSet.forEach(id => {
          const sp = startPositions[id] || { x: PAD_X, y: PAD_Y };
          next[id] = {
            x: Math.max(0, Math.min(maxX, Math.round(sp.x + dx))),
            y: Math.max(0, Math.min(maxY, Math.round(sp.y + dy))),
          };
        });
        return next;
      });
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      setTimeout(() => { isDraggingRef.current = false; }, 50);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, []);

  const handleIconClick = useCallback((e, iconId) => {
    e.stopPropagation();
    if (isDraggingRef.current) return;
    playIconSelect();
    if (e.ctrlKey || e.metaKey) {
      // Ctrl+clic : ajouter/retirer de la sélection
      setSelectedIcons(prev => {
        const next = new Set(prev);
        if (next.has(iconId)) next.delete(iconId);
        else next.add(iconId);
        return next;
      });
    } else {
      setSelectedIcons(new Set([iconId]));
    }
  }, []);

  const handleIconDoubleClick = useCallback((iconId) => {
    if (isDraggingRef.current) return;
    openWindow(iconId);
  }, [openWindow]);

  // Rubber-band : dessiner un rectangle de sélection sur le bureau vide
  const handleOverlayMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    const startX = e.clientX;
    const startY = e.clientY;
    let rb = null;

    const onMouseMove = (ev) => {
      const x = Math.min(startX, ev.clientX);
      const y = Math.min(startY, ev.clientY);
      const w = Math.abs(ev.clientX - startX);
      const h = Math.abs(ev.clientY - startY);
      rb = { x, y, w, h };
      setRubberBand({ x, y, w, h });
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);

      if (rb && (rb.w > DRAG_THRESHOLD || rb.h > DRAG_THRESHOLD)) {
        // Sélectionner toutes les icônes qui intersectent le rectangle
        const currentPositions = positionsRef.current;
        const selected = new Set();
        DESKTOP_ICONS.forEach(icon => {
          const pos = currentPositions[icon.id];
          if (!pos) return;
          const rbRight = rb.x + rb.w;
          const rbBottom = rb.y + rb.h;
          if (pos.x < rbRight && pos.x + ICON_W > rb.x && pos.y < rbBottom && pos.y + ICON_H > rb.y) {
            selected.add(icon.id);
          }
        });
        setSelectedIcons(selected);
      } else {
        // Simple clic sur zone vide : désélectionner tout
        setSelectedIcons(new Set());
      }
      setRubberBand(null);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, []);

  return (
    <>
      {DESKTOP_ICONS.map((icon) => {
        const pos = positions[icon.id] || { x: PAD_X, y: PAD_Y };
        const isSelected = selectedIcons.has(icon.id);
        return (
          <div
            key={icon.id}
            onMouseDown={(e) => handleIconMouseDown(e, icon.id)}
            onClick={(e) => handleIconClick(e, icon.id)}
            onDoubleClick={() => handleIconDoubleClick(icon.id)}
            style={{
              position: "absolute",
              left: pos.x, top: pos.y,
              width: ICON_W, padding: "10px 6px", borderRadius: 3, cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              background: isSelected ? "rgba(80,130,255,0.35)" : "transparent",
              border: isSelected ? "1px dotted rgba(150,200,255,0.6)" : "1px solid transparent",
              transition: "background 0.1s",
              zIndex: 2,
              userSelect: "none",
              boxSizing: "border-box",
            }}
            onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "rgba(80,130,255,0.15)"; }}
            onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
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

      {/* Rectangle rubber-band */}
      {rubberBand && (
        <div
          style={{
            position: "fixed",
            left: rubberBand.x,
            top: rubberBand.y,
            width: rubberBand.w,
            height: rubberBand.h,
            border: "1px dotted #5594E0",
            background: "rgba(85,148,224,0.15)",
            zIndex: 9998,
            pointerEvents: "none",
          }}
        />
      )}
    </>
  );
});

export default DesktopIcons;
