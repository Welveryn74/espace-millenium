import { useState, useEffect, useRef } from "react";

export default function Win({ title, onClose, children, width = 480, height = 380, initialPos, zIndex, onFocus, color = "#0055E5" }) {
  const [pos, setPos] = useState(initialPos || { x: 80 + Math.random() * 120, y: 30 + Math.random() * 50 });
  const [dragging, setDragging] = useState(false);
  const [isOpening, setIsOpening] = useState(true);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const t = setTimeout(() => setIsOpening(false), 200);
    return () => clearTimeout(t);
  }, []);

  const onMouseDown = (e) => {
    if (e.target.closest("button")) return;
    setDragging(true);
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    onFocus?.();
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => setPos({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragging]);

  return (
    <div
      onClick={onFocus}
      style={{
        position: "absolute", left: pos.x, top: pos.y, width, zIndex,
        border: "2px solid #0055E5", borderRadius: "8px 8px 0 0",
        boxShadow: "3px 5px 20px rgba(0,0,50,0.5), inset 0 0 0 1px rgba(255,255,255,0.12)",
        background: "#ECE9D8", fontFamily: "'Tahoma', 'Segoe UI', sans-serif",
        overflow: "hidden", userSelect: dragging ? "none" : "auto",
        animation: isOpening ? "popIn 0.2s ease-out" : "none",
      }}
    >
      {/* Title bar */}
      <div
        onMouseDown={onMouseDown}
        style={{
          background: `linear-gradient(180deg, ${color} 0%, ${color}BB 40%, ${color}99 60%, ${color} 100%)`,
          padding: "4px 4px 4px 8px", display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: dragging ? "grabbing" : "grab", borderBottom: "1px solid #003399",
        }}
      >
        <span style={{ color: "white", fontWeight: "bold", fontSize: 12, textShadow: "1px 1px 2px rgba(0,0,0,0.5)", letterSpacing: 0.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{title}</span>
        <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
          {["─", "□", "✕"].map((sym, i) => (
            <button key={i} onClick={i === 2 ? onClose : undefined} style={{
              width: 22, height: 22, border: "1px solid rgba(0,0,0,0.3)", borderRadius: 3,
              background: i === 2 ? "linear-gradient(180deg, #E97 0%, #C44 100%)" : "linear-gradient(180deg, #D8D8D8 0%, #B8B8B8 100%)",
              color: i === 2 ? "#fff" : "#333", fontWeight: "bold", fontSize: i === 1 ? 8 : 12,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1,
            }}>{sym}</button>
          ))}
        </div>
      </div>
      <div style={{ height: height - 32, overflow: "auto" }}>{children}</div>
    </div>
  );
}
