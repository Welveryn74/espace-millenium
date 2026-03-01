import { useState, useEffect } from "react";

export default function ChambreDoorAnimation({ onComplete }) {
  const [phase, setPhase] = useState("closed"); // closed → opening → entering → done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("opening"), 300);
    const t2 = setTimeout(() => setPhase("entering"), 900);
    const t3 = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  // Play door creak sound
  useEffect(() => {
    if (phase !== "opening") return;
    if (localStorage.getItem('em_muted') === 'true') return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      // Creaky door: filtered noise sweep
      const bufferSize = ctx.sampleRate * 0.6;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(300, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.3);
      filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.6);
      filter.Q.value = 8;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      noise.connect(filter).connect(gain).connect(ctx.destination);
      noise.start();
      noise.stop(ctx.currentTime + 0.6);
    } catch (_) { /* silent fallback */ }
  }, [phase]);

  const skip = () => {
    setPhase("done");
    onComplete();
  };

  if (phase === "done") return null;

  return (
    <div
      onClick={skip}
      style={{
        position: "absolute", inset: 0, zIndex: 100,
        background: "#0a0612",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", overflow: "hidden",
      }}
    >
      {/* Door frame */}
      <div style={{
        width: 220, height: 340, position: "relative",
        perspective: "800px",
      }}>
        {/* Frame border */}
        <div style={{
          position: "absolute", inset: -8,
          background: "linear-gradient(180deg, #6B4830, #5C3D2A, #4A3328)",
          borderRadius: 4,
          boxShadow: "0 0 30px rgba(0,0,0,0.8), inset 0 0 10px rgba(0,0,0,0.3)",
        }} />

        {/* Light spilling through (visible when door opens) */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at center, rgba(255,200,80,0.15) 0%, rgba(30,20,50,0.8) 70%)",
          opacity: phase === "opening" || phase === "entering" ? 1 : 0,
          transition: "opacity 0.4s ease",
        }} />

        {/* The door panel */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, #F5F0E8, #E8E0D0, #DDD5C5)",
          transformOrigin: "left center",
          transform: phase === "closed" ? "rotateY(0deg)"
                   : phase === "opening" ? "rotateY(-75deg)"
                   : "rotateY(-75deg)",
          transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: phase === "closed"
            ? "inset 0 0 20px rgba(0,0,0,0.1)"
            : "5px 0 30px rgba(0,0,0,0.5)",
        }}>
          {/* Door panel details */}
          <div style={{
            position: "absolute", top: 20, left: 20, right: 20, height: 100,
            border: "2px solid rgba(0,0,0,0.06)", borderRadius: 2,
            background: "linear-gradient(180deg, rgba(255,255,255,0.3), rgba(0,0,0,0.02))",
          }} />
          <div style={{
            position: "absolute", top: 140, left: 20, right: 20, bottom: 20,
            border: "2px solid rgba(0,0,0,0.06)", borderRadius: 2,
            background: "linear-gradient(180deg, rgba(255,255,255,0.2), rgba(0,0,0,0.03))",
          }} />

          {/* Door handle */}
          <div style={{
            position: "absolute", top: "50%", right: 16, transform: "translateY(-50%)",
            width: 12, height: 28, borderRadius: 6,
            background: "linear-gradient(180deg, #DAA520, #B8860B, #996515)",
            boxShadow: "1px 1px 4px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.3)",
          }} />

          {/* Keyhole */}
          <div style={{
            position: "absolute", top: "50%", right: 20, transform: "translateY(22px)",
            width: 6, height: 10, borderRadius: "50% 50% 30% 30%",
            background: "#333",
            boxShadow: "inset 0 0 2px rgba(0,0,0,0.8)",
          }} />

          {/* Stickers on door */}
          <div style={{
            position: "absolute", top: 28, right: 26,
            fontSize: 16, transform: "rotate(-8deg)",
            opacity: 0.8,
          }}>⭐</div>
          <div style={{
            position: "absolute", top: 60, left: 30,
            fontSize: 12, transform: "rotate(5deg)",
            opacity: 0.7,
          }}>🦖</div>
        </div>
      </div>

      {/* Zoom/enter overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(10,6,18,0.95)",
        opacity: phase === "entering" ? 1 : 0,
        transition: "opacity 0.4s ease",
        pointerEvents: "none",
      }} />

      {/* Skip hint */}
      <div style={{
        position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)",
        color: "rgba(200,176,232,0.4)", fontSize: 10,
        fontFamily: "'Tahoma', sans-serif",
      }}>
        Clic pour passer
      </div>
    </div>
  );
}
