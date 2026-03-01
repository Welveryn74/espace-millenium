import { useState, useEffect, useRef, useCallback } from "react";
import { playWindowClose, playMinimize, playClick } from "../utils/uiSounds";

const TASKBAR_H = 44;
const MIN_W = 320;
const MIN_H = 240;
const HANDLE = 6;

const CURSORS = {
  n: "ns-resize", s: "ns-resize", e: "ew-resize", w: "ew-resize",
  ne: "nesw-resize", sw: "nesw-resize", nw: "nwse-resize", se: "nwse-resize",
};

export default function Win({ title, onClose, onMinimize, children, width = 480, height = 380, initialPos, zIndex, onFocus, color = "#0055E5" }) {
  const [pos, setPos] = useState(initialPos || { x: 80 + Math.random() * 120, y: 30 + Math.random() * 50 });
  const [size, setSize] = useState({ w: width, h: height });
  const [dragging, setDragging] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [isOpening, setIsOpening] = useState(true);
  const [justFocused, setJustFocused] = useState(false);
  const [resizeDir, setResizeDir] = useState(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const prevPos = useRef(null);
  const prevSize = useRef(null);
  const resizeStart = useRef({ mx: 0, my: 0, w: 0, h: 0, px: 0, py: 0 });

  useEffect(() => {
    const t = setTimeout(() => setIsOpening(false), 200);
    return () => clearTimeout(t);
  }, []);

  const onMouseDown = (e) => {
    if (e.target.closest("button")) return;
    if (maximized) return;
    setDragging(true);
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    onFocus?.();
  };

  const handleMaximize = () => {
    if (maximized) {
      if (prevPos.current) setPos(prevPos.current);
      if (prevSize.current) setSize(prevSize.current);
      setMaximized(false);
    } else {
      prevPos.current = { ...pos };
      prevSize.current = { ...size };
      setMaximized(true);
    }
  };

  // Drag
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => setPos({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragging]);

  // Resize
  const startResize = useCallback((dir, e) => {
    e.preventDefault();
    e.stopPropagation();
    setResizeDir(dir);
    resizeStart.current = { mx: e.clientX, my: e.clientY, w: size.w, h: size.h, px: pos.x, py: pos.y };
    onFocus?.();
  }, [size, pos, onFocus]);

  useEffect(() => {
    if (!resizeDir) return;
    const { mx, my, w, h, px, py } = resizeStart.current;

    const onMove = (e) => {
      const dx = e.clientX - mx;
      const dy = e.clientY - my;
      let nw = w, nh = h, nx = px, ny = py;

      if (resizeDir.includes("e")) nw = Math.max(MIN_W, w + dx);
      if (resizeDir.includes("s")) nh = Math.max(MIN_H, h + dy);
      if (resizeDir.includes("w")) { nw = Math.max(MIN_W, w - dx); nx = px + (w - nw); }
      if (resizeDir.includes("n")) { nh = Math.max(MIN_H, h - dy); ny = py + (h - nh); }

      setSize({ w: nw, h: nh });
      setPos({ x: nx, y: ny });
    };
    const onUp = () => setResizeDir(null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [resizeDir]);

  const handleFocus = () => {
    onFocus?.();
    setJustFocused(true);
    setTimeout(() => setJustFocused(false), 200);
  };

  const btnHandlers = [
    () => { playMinimize(); onMinimize(); },
    () => { playClick(); handleMaximize(); },
    () => { playWindowClose(); onClose(); },
  ];
  const btnTitles = ["Réduire", maximized ? "Restaurer" : "Agrandir", "Fermer"];
  const isInteracting = dragging || resizeDir;

  // Resize handle positions
  const handles = maximized ? [] : [
    { dir: "n",  style: { top: 0, left: HANDLE, right: HANDLE, height: HANDLE } },
    { dir: "s",  style: { bottom: 0, left: HANDLE, right: HANDLE, height: HANDLE } },
    { dir: "e",  style: { right: 0, top: HANDLE, bottom: HANDLE, width: HANDLE } },
    { dir: "w",  style: { left: 0, top: HANDLE, bottom: HANDLE, width: HANDLE } },
    { dir: "ne", style: { top: 0, right: 0, width: HANDLE * 2, height: HANDLE * 2 } },
    { dir: "nw", style: { top: 0, left: 0, width: HANDLE * 2, height: HANDLE * 2 } },
    { dir: "se", style: { bottom: 0, right: 0, width: HANDLE * 2, height: HANDLE * 2 } },
    { dir: "sw", style: { bottom: 0, left: 0, width: HANDLE * 2, height: HANDLE * 2 } },
  ];

  return (
    <div
      data-nocontext=""
      onClick={handleFocus}
      style={{
        position: "absolute",
        left: maximized ? 0 : pos.x,
        top: maximized ? 0 : pos.y,
        width: maximized ? "100vw" : size.w,
        zIndex,
        border: "3px solid #0055E5",
        borderRadius: maximized ? 0 : "8px 8px 0 0",
        boxShadow: justFocused
          ? "6px 8px 32px rgba(0,0,50,0.7), inset 0 0 0 1px rgba(255,255,255,0.15)"
          : "4px 6px 24px rgba(0,0,50,0.55), inset 0 0 0 1px rgba(255,255,255,0.15)",
        transition: "box-shadow 0.15s ease",
        background: "#ECE9D8", fontFamily: "'Tahoma', 'Segoe UI', sans-serif",
        overflow: "hidden", userSelect: isInteracting ? "none" : "auto",
        animation: isOpening ? "popIn 0.2s ease-out" : "none",
        ...(maximized ? { height: `calc(100vh - ${TASKBAR_H}px)`, display: "flex", flexDirection: "column" } : {}),
      }}
    >
      {/* Resize handles */}
      {handles.map(({ dir, style }) => (
        <div
          key={dir}
          onMouseDown={(e) => startResize(dir, e)}
          style={{ position: "absolute", ...style, cursor: CURSORS[dir], zIndex: 1 }}
        />
      ))}

      {/* Title bar */}
      <div
        onMouseDown={onMouseDown}
        style={{
          background: `linear-gradient(180deg, ${color} 0%, ${color}BB 40%, ${color}99 60%, ${color} 100%)`,
          padding: "4px 4px 4px 8px", display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: maximized ? "default" : dragging ? "grabbing" : "grab",
          borderBottom: "1px solid #003399", flexShrink: 0, position: "relative", zIndex: 2,
        }}
      >
        <span style={{ color: "white", fontWeight: "bold", fontSize: 13, textShadow: "1px 1px 2px rgba(0,0,0,0.5)", letterSpacing: 0.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{title}</span>
        <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
          {["─", maximized ? "❐" : "□", "✕"].map((sym, i) => (
            <button key={i} onClick={btnHandlers[i]} title={btnTitles[i]} style={{
              width: 24, height: 24, border: "1px solid rgba(0,0,0,0.3)", borderRadius: 3,
              background: i === 2 ? "linear-gradient(180deg, #E97 0%, #C44 100%)" : "linear-gradient(180deg, #D8D8D8 0%, #B8B8B8 100%)",
              color: i === 2 ? "#fff" : "#333", fontWeight: "bold", fontSize: i === 1 ? 8 : 12,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1,
            }}>{sym}</button>
          ))}
        </div>
      </div>
      <div style={{ width: "100%", ...(maximized ? { flex: 1 } : { height: size.h - 32 }), overflow: "auto", borderTop: "1px solid #fff", boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #8e8f8a" }}>{children}</div>
    </div>
  );
}
