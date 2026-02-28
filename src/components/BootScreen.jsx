import { useState, useEffect, useRef } from "react";
import { playModemSound } from "../utils/playModemSound";

export default function BootScreen({ onComplete }) {
  const [phase, setPhase] = useState(0);
  const [modemLines, setModemLines] = useState([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const audioCtxRef = useRef(null);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 2200),
      setTimeout(() => setPhase(3), 6500),
      setTimeout(() => onComplete(), 8200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Play modem sound on phase 2
  useEffect(() => {
    if (phase === 2) {
      if (localStorage.getItem('em_muted') === 'true') return;
      try {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        playModemSound(audioCtxRef.current);
      } catch (e) { /* audio not supported */ }
    }
    return () => {
      if (audioCtxRef.current && phase === 3) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [phase]);

  // BIOS POST beep sounds on phase 1
  useEffect(() => {
    if (phase !== 1) return;
    if (localStorage.getItem('em_muted') === 'true') return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const now = ctx.currentTime;
      const beeps = [
        { start: 0.0,  dur: 0.08 },
        { start: 0.15, dur: 0.08 },
        { start: 0.30, dur: 0.08 },
        { start: 0.55, dur: 0.05 },
        { start: 0.65, dur: 0.05 },
        { start: 0.80, dur: 0.12 },
      ];
      beeps.forEach(({ start, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.value = 1000;
        gain.gain.setValueAtTime(0.06, now + start);
        gain.gain.setValueAtTime(0, now + start + dur);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + start);
        osc.stop(now + start + dur + 0.01);
      });
      setTimeout(() => ctx.close().catch(() => {}), 2000);
    } catch (e) { /* audio not supported */ }
  }, [phase]);

  // Modem text animation
  useEffect(() => {
    if (phase !== 2) return;
    const lines = [
      { text: "Initialisation du modem...", delay: 0 },
      { text: "ATDT 0860922000", delay: 400 },
      { text: "☎ Bip... bip... bip...", delay: 900 },
      { text: "📡 kshhhhHHHH BEEDOO BEEDOO krrrrr", delay: 1500 },
      { text: "📡 pshhhhCHHHH krrrrCHHHH", delay: 2300 },
      { text: "📡 CONNECT 56000 V.90", delay: 3200 },
      { text: "✅ Connexion établie — Bienvenue chez Wanadoo !", delay: 3800 },
    ];
    const timers = lines.map(l =>
      setTimeout(() => setModemLines(prev => [...prev, l.text]), l.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  // Loading bar animation
  useEffect(() => {
    if (phase !== 3) return;
    const iv = setInterval(() => setLoadProgress(p => Math.min(p + 4, 100)), 50);
    return () => clearInterval(iv);
  }, [phase]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      background: "#000", display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "monospace",
    }}>
      {phase === 0 && <div style={{ color: "#333", animation: "blink 1s infinite" }}>_</div>}

      {phase === 1 && (
        <div style={{ textAlign: "left", padding: 40, maxWidth: 600 }}>
          <div style={{ fontSize: 16, color: "#AAA", marginBottom: 12 }}>Award Modular BIOS v4.51PG, An Energy Star Ally</div>
          <div style={{ fontSize: 12, color: "#888" }}>Copyright (C) 1984-2003, Award Software, Inc.</div>
          <div style={{ fontSize: 12, color: "#0F0", marginTop: 12 }}>Intel Pentium III Processor 800 MHz</div>
          <div style={{ fontSize: 12, color: "#0F0" }}>Memory Test: 262144K OK</div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 8 }}>Detecting Primary Master... MAXTOR 6Y080L0</div>
          <div style={{ fontSize: 12, color: "#888" }}>Detecting Primary Slave... None</div>
          <div style={{ fontSize: 12, color: "#FF0", marginTop: 12, animation: "blink 1s infinite" }}>Press DEL to enter SETUP</div>
        </div>
      )}

      {phase === 2 && (
        <div style={{ textAlign: "left", maxWidth: 550, padding: 30, width: "100%" }}>
          <div style={{
            fontSize: 14, color: "#0CF", marginBottom: 14, fontWeight: "bold",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 20 }}>🌐</span>
            France Télécom — Connexion Internet
          </div>
          <div style={{ background: "rgba(0,50,100,0.2)", border: "1px solid #0CF4", borderRadius: 4, padding: 14 }}>
            {modemLines.map((line, i) => (
              <div key={i} style={{
                color: line.startsWith("✅") ? "#0F0" : line.startsWith("📡") ? "#FF0" : "#0F0",
                fontSize: 13, lineHeight: 2,
                animation: "slideUp 0.2s ease-out",
              }}>{line}</div>
            ))}
            {modemLines.length > 0 && modemLines.length < 7 && (
              <span style={{ color: "#0F0", animation: "blink 0.5s infinite" }}>▌</span>
            )}
          </div>
        </div>
      )}

      {phase === 3 && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🖥️</div>
          <div style={{ color: "#fff", fontSize: 18, fontFamily: "'Tahoma', sans-serif", marginBottom: 6 }}>
            L'Espace Millénium
          </div>
          <div style={{ color: "#888", fontSize: 12, fontFamily: "'Tahoma', sans-serif", marginBottom: 20 }}>
            Chargement de votre bureau...
          </div>
          <div style={{
            width: 260, height: 8, background: "#222", borderRadius: 4, overflow: "hidden", margin: "0 auto",
            border: "1px solid #444",
          }}>
            <div style={{
              width: `${loadProgress}%`, height: "100%",
              background: "linear-gradient(90deg, #06F, #0CF, #06F)",
              backgroundSize: "200% 100%",
              animation: "gradient 1s linear infinite",
              transition: "width 0.05s",
              borderRadius: 4,
            }} />
          </div>
        </div>
      )}
    </div>
  );
}
