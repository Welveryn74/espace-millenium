import { useState, useEffect, useRef } from "react";
import { playModemSound } from "../utils/playModemSound";
import { loadState, saveState } from "../utils/storage";

const PLACEHOLDERS = ["Kévin", "Cassandra", "Titouan", "Mathilde", "Jérémy"];

export default function BootScreen({ onComplete }) {
  const [phase, setPhase] = useState(0);
  const [modemLines, setModemLines] = useState([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [username, setUsername] = useState("");
  const [placeholder] = useState(() => PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]);
  const audioCtxRef = useRef(null);

  // Check if username already exists (skip login phase)
  const hasUsername = !!loadState('username', null);

  // Skip boot sequence (Escape key or button)
  const skipBoot = () => {
    if (phase >= 2.5) return; // already past the boring parts
    // Stop modem audio
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    if (hasUsername) {
      onComplete();
    } else {
      setPhase(2.5);
    }
  };

  // Escape key listener
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") skipBoot();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [phase, hasUsername]);

  // Phase 0: cursor, 1: BIOS, 2: modem, 2.5: login (if no username), 3: XP logo, 4: loading
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 2200),
    ];
    if (hasUsername) {
      // Skip login, go straight to XP logo then loading
      timers.push(setTimeout(() => setPhase(3), 6500));
      timers.push(setTimeout(() => setPhase(4), 8500));
      timers.push(setTimeout(() => onComplete(), 10200));
    } else {
      // After modem, show login screen — user must submit manually
      timers.push(setTimeout(() => setPhase(2.5), 6500));
    }
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

  // XP boot chime on phase 3 — accord harmonique multi-couches avec reverb simulé
  useEffect(() => {
    if (phase !== 3) return;
    if (localStorage.getItem('em_muted') === 'true') return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const now = ctx.currentTime;

      // Reverb simulé : delay avec feedback
      const delay = ctx.createDelay(0.5);
      delay.delayTime.value = 0.065;
      const fbGain = ctx.createGain();
      fbGain.gain.value = 0.32;
      const wetGain = ctx.createGain();
      wetGain.gain.value = 0.18;
      delay.connect(fbGain);
      fbGain.connect(delay);
      delay.connect(wetGain);
      wetGain.connect(ctx.destination);

      // Accord XP : arpège montant E4→Ab4→B4→E5→Ab5→B5
      // Chaque note entre progressivement, se chevauche avec les suivantes
      const notes = [
        { freq: 330, start: 0.00, attack: 0.55, hold: 2.0, release: 1.6, vol: 0.055 }, // E4
        { freq: 415, start: 0.38, attack: 0.45, hold: 1.8, release: 1.5, vol: 0.055 }, // Ab4
        { freq: 494, start: 0.72, attack: 0.40, hold: 1.6, release: 1.5, vol: 0.060 }, // B4
        { freq: 660, start: 1.08, attack: 0.32, hold: 1.4, release: 1.2, vol: 0.055 }, // E5
        { freq: 831, start: 1.44, attack: 0.28, hold: 1.0, release: 1.2, vol: 0.045 }, // Ab5
        { freq: 988, start: 1.80, attack: 0.35, hold: 0.8, release: 1.0, vol: 0.035 }, // B5
      ];

      notes.forEach(({ freq, start, attack, hold, release, vol }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const t = now + start;
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(vol, t + attack);
        gain.gain.setValueAtTime(vol, t + attack + hold);
        gain.gain.exponentialRampToValueAtTime(0.001, t + attack + hold + release);
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.connect(delay);
        osc.start(t);
        osc.stop(t + attack + hold + release + 0.1);
      });

      setTimeout(() => ctx.close().catch(() => {}), 6000);
    } catch (e) { /* audio not supported */ }
  }, [phase]);

  // Loading bar animation
  useEffect(() => {
    if (phase !== 4) return;
    const iv = setInterval(() => setLoadProgress(p => Math.min(p + 4, 100)), 50);
    return () => clearInterval(iv);
  }, [phase]);

  const handleLogin = () => {
    const name = username.trim() || placeholder;
    saveState('username', name);
    setPhase(3);
    setTimeout(() => setPhase(4), 2000);
    setTimeout(() => onComplete(), 3700);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      background: "#000", display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "monospace",
    }}>
      {phase < 2.5 && (
        <button
          onClick={skipBoot}
          title="Passer (Échap)"
          style={{
            position: "absolute", top: 16, right: 16, zIndex: 1,
            background: "transparent", border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 4, color: "rgba(255,255,255,0.4)", fontSize: 12,
            fontFamily: "monospace", padding: "4px 10px", cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.target.style.color = "#fff"; e.target.style.borderColor = "rgba(255,255,255,0.6)"; }}
          onMouseLeave={e => { e.target.style.color = "rgba(255,255,255,0.4)"; e.target.style.borderColor = "rgba(255,255,255,0.2)"; }}
        >Passer ⏭</button>
      )}

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

      {/* Login screen — XP welcome style */}
      {phase === 2.5 && (
        <div style={{
          textAlign: "center",
          background: "linear-gradient(180deg, #1A5BC4 0%, #2A7FEE 30%, #1A5BC4 100%)",
          position: "fixed", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          fontFamily: "'Tahoma', 'Segoe UI', sans-serif",
          animation: "fadeIn 0.5s ease-out",
        }}>
          <div style={{
            fontSize: 28, color: "#fff", fontWeight: "bold", marginBottom: 8,
            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}>Bienvenue !</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 30 }}>
            L'Espace Millénium — Ton PC de 2005
          </div>

          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "linear-gradient(135deg, #6CF, #39F)",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "3px solid rgba(255,255,255,0.6)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
            fontSize: 28, marginBottom: 20,
          }}>👤</div>

          <div style={{ color: "#fff", fontSize: 15, marginBottom: 12 }}>
            Comment tu t'appelles ?
          </div>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder={placeholder}
            autoFocus
            style={{
              width: 220, padding: "10px 14px", border: "2px solid rgba(255,255,255,0.5)",
              borderRadius: 6, fontSize: 15, fontFamily: "'Tahoma', sans-serif",
              textAlign: "center", outline: "none", background: "rgba(255,255,255,0.95)",
              color: "#333",
            }}
          />
          <button
            onClick={handleLogin}
            style={{
              marginTop: 16, padding: "8px 32px",
              background: "linear-gradient(180deg, #3C9F3C 0%, #2A7F2A 50%, #1A5F1A 100%)",
              border: "1px solid #1A5F1A", borderRadius: 6,
              color: "#fff", fontWeight: "bold", fontSize: 14,
              fontFamily: "'Tahoma', sans-serif", cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)",
              letterSpacing: 0.5,
            }}
          >Connexion</button>
        </div>
      )}

      {/* XP Logo screen */}
      {phase === 3 && (
        <div style={{
          textAlign: "center",
          background: "linear-gradient(180deg, #1A5BC4 0%, #2A7FEE 30%, #1A5BC4 100%)",
          position: "fixed", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          fontFamily: "'Tahoma', 'Segoe UI', sans-serif",
          animation: "fadeIn 0.4s ease-out",
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🖥️</div>
          <div style={{
            color: "#fff", fontSize: 22, fontWeight: "bold",
            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
            marginBottom: 8,
          }}>L'Espace Millénium</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, letterSpacing: 2 }}>
            ÉDITION 2005
          </div>
        </div>
      )}

      {phase === 4 && (
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
