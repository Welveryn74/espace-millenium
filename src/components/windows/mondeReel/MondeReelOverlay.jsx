import { useState, useEffect, useRef } from "react";

const OVERLAY_STYLE = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  zIndex: 10,
  fontFamily: "'Courier New', Courier, monospace",
};

// "● REC" indicator — top left, blinking
function RecIndicator() {
  return (
    <div style={{ position: "absolute", top: 12, left: 14, display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{
        width: 10, height: 10, borderRadius: "50%", background: "#e00",
        animation: "vhs-blink 1s infinite",
      }} />
      <span style={{ color: "#fff", fontSize: 13, fontWeight: "bold", textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}>
        REC
      </span>
      <style>{`@keyframes vhs-blink { 0%,49% { opacity: 1; } 50%,100% { opacity: 0.2; } }`}</style>
    </div>
  );
}

// Battery icon — top right
function BatteryIndicator() {
  return (
    <div style={{ position: "absolute", top: 12, right: 14, display: "flex", alignItems: "center", gap: 4 }}>
      <div style={{
        width: 24, height: 12, border: "1.5px solid rgba(255,255,255,0.7)",
        borderRadius: 2, position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", left: 1, top: 1, bottom: 1, width: "70%",
          background: "rgba(255,255,255,0.7)", borderRadius: 1,
        }} />
      </div>
      <div style={{
        width: 3, height: 6, background: "rgba(255,255,255,0.7)",
        borderRadius: "0 1px 1px 0",
      }} />
    </div>
  );
}

// Datestamp — bottom right, incrementing minutes
function Datestamp() {
  const [minutes, setMinutes] = useState(32);

  useEffect(() => {
    const iv = setInterval(() => setMinutes((m) => (m + 1) % 60), 8000);
    return () => clearInterval(iv);
  }, []);

  const h = String(14).padStart(2, "0");
  const m = String(minutes).padStart(2, "0");

  return (
    <div style={{
      position: "absolute", bottom: 10, right: 14,
      color: "#F5A623", fontSize: 11, textShadow: "1px 1px 2px rgba(0,0,0,0.9)",
      letterSpacing: "0.5px",
    }}>
      12.08.2004 &nbsp;{h}:{m}
    </div>
  );
}

// Crosshair — central dot
function Crosshair() {
  return (
    <div style={{
      position: "absolute", top: "50%", left: "50%",
      transform: "translate(-50%, -50%)",
      width: 6, height: 6, borderRadius: "50%",
      background: "rgba(200,176,232,0.45)",
    }} />
  );
}

// Subtitle bar — bottom center, appears on hover
function SubtitleBar({ text }) {
  if (!text) return null;
  return (
    <div style={{
      position: "absolute", bottom: 32, left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(0,0,0,0.55)",
      color: "#fff", fontSize: 12, padding: "4px 14px",
      borderRadius: 2, whiteSpace: "nowrap", maxWidth: "80%",
      overflow: "hidden", textOverflow: "ellipsis",
      textShadow: "1px 1px 2px rgba(0,0,0,0.9)",
    }}>
      {text}
    </div>
  );
}

// Scanline overlay — full-screen subtle horizontal lines (CSS only)
function ScanlineOverlay() {
  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
    }} />
  );
}

export default function MondeReelOverlay({ subtitle }) {
  return (
    <div style={OVERLAY_STYLE}>
      <RecIndicator />
      <BatteryIndicator />
      <Datestamp />
      <Crosshair />
      <SubtitleBar text={subtitle} />
      <ScanlineOverlay />
    </div>
  );
}
