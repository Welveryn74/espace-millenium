import { useState } from "react";
import Win from "../Win";
import { CHANNELS } from "../../data/channels";
import { tvBtnBase } from "../../styles/windowStyles";

function BtnTV({ onClick, children }) {
  return <button onClick={onClick} style={tvBtnBase}>{children}</button>;
}

export default function TVWindow({ onClose, zIndex, onFocus }) {
  const [channel, setChannel] = useState(0);
  const [staticEffect, setStaticEffect] = useState(false);
  const [power, setPower] = useState(true);
  const [volume, setVolume] = useState(75);

  const changeChannel = (dir) => {
    setStaticEffect(true);
    setTimeout(() => {
      setChannel(prev => (prev + dir + CHANNELS.length) % CHANNELS.length);
      setStaticEffect(false);
    }, 350);
  };

  return (
    <Win title="Ma Télévision Cathodique — Thomson 36cm" onClose={onClose} width={520} height={470} zIndex={zIndex} onFocus={onFocus} initialPos={{ x: 180, y: 40 }} color="#444">
      <div style={{ padding: 16, background: "#1a1a1a", height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* TV Frame */}
        <div style={{
          width: 460, height: 310, background: "#0a0a0a", borderRadius: "20px",
          border: "14px solid #4a4a4a",
          borderImage: "linear-gradient(145deg, #666 0%, #3a3a3a 30%, #555 70%, #444 100%) 14",
          boxShadow: "inset 0 0 50px rgba(0,0,0,0.9), 0 6px 24px rgba(0,0,0,0.6), inset 0 0 2px 1px rgba(255,255,255,0.05)",
          position: "relative", overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {!power ? (
            <div style={{ width: 3, height: 3, background: "#333", borderRadius: "50%", boxShadow: "0 0 8px 2px rgba(255,255,255,0.05)" }} />
          ) : staticEffect ? (
            <div style={{
              width: "100%", height: "100%",
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.6'/%3E%3C/svg%3E")`,
              backgroundSize: "200px",
              animation: "tvStatic 0.15s infinite",
            }} />
          ) : (
            <div style={{
              width: "100%", height: "100%", padding: 20,
              background: `radial-gradient(ellipse at center, ${CHANNELS[channel].bg} 0%, #000 120%)`,
              display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
              position: "relative", animation: "crtFlicker 4s infinite",
            }}>
              {/* Scanlines overlay */}
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "repeating-linear-gradient(transparent 0px, transparent 1px, rgba(0,0,0,0.12) 1px, rgba(0,0,0,0.12) 3px)",
              }} />
              {/* Screen curvature effect */}
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                boxShadow: "inset 0 0 80px 20px rgba(0,0,0,0.4)",
                borderRadius: 8,
              }} />
              {/* Channel indicator */}
              <div style={{
                position: "absolute", top: 10, right: 14,
                color: CHANNELS[channel].color, fontSize: 16, fontFamily: "monospace", fontWeight: "bold",
                textShadow: `0 0 8px ${CHANNELS[channel].color}80`,
              }}>CH {channel + 1}</div>
              {/* Volume indicator */}
              <div style={{ position: "absolute", top: 10, left: 14, display: "flex", gap: 2, alignItems: "center" }}>
                <span style={{ color: "#888", fontSize: 10 }}>🔊</span>
                <div style={{ width: 50, height: 4, background: "#333", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${volume}%`, height: "100%", background: CHANNELS[channel].color, transition: "width 0.2s" }} />
                </div>
              </div>
              {/* Content */}
              <div style={{ fontSize: 42, marginBottom: 10, textShadow: "0 0 20px rgba(255,255,255,0.2)" }}>{CHANNELS[channel].emoji}</div>
              <div style={{ color: CHANNELS[channel].color, fontSize: 15, fontWeight: "bold", textAlign: "center", textShadow: `0 0 12px ${CHANNELS[channel].color}50`, marginBottom: 10 }}>
                {CHANNELS[channel].name}
              </div>
              <div style={{ color: "#bbb", fontSize: 11, textAlign: "center", maxWidth: 360, lineHeight: 1.7, fontStyle: "italic" }}>
                {CHANNELS[channel].desc}
              </div>
            </div>
          )}
          {/* Power LED */}
          <div style={{
            position: "absolute", bottom: -10, right: 20,
            width: 6, height: 6, borderRadius: "50%",
            background: power ? "#0F0" : "#300",
            boxShadow: power ? "0 0 6px #0F0" : "none",
          }} />
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 10, marginTop: 14, alignItems: "center" }}>
          <BtnTV onClick={() => changeChannel(-1)}>◀ CH-</BtnTV>
          <BtnTV onClick={() => setVolume(v => Math.max(0, v - 15))}>🔉 Vol-</BtnTV>
          <button onClick={() => setPower(!power)} style={{
            ...tvBtnBase, width: 50, background: power ? "linear-gradient(180deg, #F77 0%, #C33 100%)" : "linear-gradient(180deg, #7F7 0%, #3C3 100%)",
          }}>{power ? "⏻" : "⏻"}</button>
          <BtnTV onClick={() => setVolume(v => Math.min(100, v + 15))}>🔊 Vol+</BtnTV>
          <BtnTV onClick={() => changeChannel(1)}>CH+ ▶</BtnTV>
        </div>
      </div>
    </Win>
  );
}
