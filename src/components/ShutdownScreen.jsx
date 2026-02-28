import { useState, useEffect, useRef } from "react";
import { playShutdownSound } from "../utils/playShutdownSound";

// Phase 0: XP confirmation dialog (overlay on desktop)
// Phase 1: "Windows enregistre vos paramètres..." + shutdown sound
// Phase 2: Black screen — "Appuyez sur une touche pour redémarrer..."

export default function ShutdownScreen({ onCancel, onRestart }) {
  const [phase, setPhase] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const audioCtxRef = useRef(null);

  // Phase 1 → Phase 2 auto-transition
  useEffect(() => {
    if (phase !== 1) return;
    if (localStorage.getItem('em_muted') !== 'true') {
      try {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        playShutdownSound(audioCtxRef.current);
      } catch (e) { /* audio not supported */ }
    }
    const timer = setTimeout(() => setPhase(2), 3000);
    return () => clearTimeout(timer);
  }, [phase]);

  // Phase 2: listen for any key or click → restart
  useEffect(() => {
    if (phase !== 2) return;
    const handler = () => onRestart();
    // Small delay so the user sees the screen before it becomes interactive
    const timer = setTimeout(() => {
      document.addEventListener("keydown", handler);
      document.addEventListener("click", handler);
    }, 500);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handler);
      document.removeEventListener("click", handler);
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
    };
  }, [phase, onRestart]);

  // Phase 1: fade text opacity
  useEffect(() => {
    if (phase !== 1) return;
    const timer = setTimeout(() => setOpacity(0), 2200);
    return () => clearTimeout(timer);
  }, [phase]);

  const handleShutdown = () => setPhase(1);

  /* ── Phase 0: XP Confirmation Dialog ── */
  if (phase === 0) {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "rgba(0,0,20,0.75)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          background: "linear-gradient(180deg, #2A56A8 0%, #1B3F8B 50%, #152F6B 100%)",
          borderRadius: 12, padding: "28px 36px", minWidth: 380,
          boxShadow: "0 8px 40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.1)",
          textAlign: "center", fontFamily: "'Tahoma', sans-serif",
        }}>
          <div style={{
            color: "#fff", fontSize: 15, fontWeight: "bold", marginBottom: 24,
            textShadow: "0 1px 3px rgba(0,0,0,0.5)",
          }}>
            Arrêter l'ordinateur
          </div>

          {/* 3 XP-style action buttons */}
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 24 }}>
            {[
              { id: "standby", emoji: "🌙", label: "Mettre en veille", bg: "linear-gradient(180deg, #4A8C3F 0%, #2D6B23 100%)" },
              { id: "shutdown", emoji: "🔴", label: "Arrêter",         bg: "linear-gradient(180deg, #D44040 0%, #A02020 100%)" },
              { id: "restart",  emoji: "🔄", label: "Redémarrer",      bg: "linear-gradient(180deg, #4A8C3F 0%, #2D6B23 100%)" },
            ].map((btn) => (
              <div key={btn.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <button
                  onClick={() => {
                    if (btn.id === "standby") { onCancel(); return; }
                    handleShutdown();
                  }}
                  style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: btn.bg, border: "2px solid rgba(255,255,255,0.25)",
                    cursor: "pointer", fontSize: 22,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 3px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
                    transition: "transform 0.1s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  {btn.emoji}
                </button>
                <span style={{ color: "#fff", fontSize: 10, textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
                  {btn.label}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={onCancel}
            style={{
              padding: "5px 24px", background: "linear-gradient(180deg, #E8E8E8 0%, #C8C8C8 100%)",
              border: "1px solid #888", borderRadius: 3, cursor: "pointer",
              fontFamily: "'Tahoma', sans-serif", fontSize: 11, color: "#222",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "linear-gradient(180deg, #F0F0F0 0%, #D8D8D8 100%)"}
            onMouseLeave={e => e.currentTarget.style.background = "linear-gradient(180deg, #E8E8E8 0%, #C8C8C8 100%)"}
          >
            Annuler
          </button>
        </div>
      </div>
    );
  }

  /* ── Phase 1: Shutting down message ── */
  if (phase === 1) {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "#000",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'Tahoma', sans-serif",
        opacity, transition: "opacity 0.8s ease-in",
      }}>
        <div style={{ fontSize: 42, marginBottom: 16 }}>🖥️</div>
        <div style={{ color: "#fff", fontSize: 16, marginBottom: 8 }}>
          Windows enregistre vos paramètres...
        </div>
        <div style={{ color: "#888", fontSize: 12, marginBottom: 20 }}>
          Veuillez patienter pendant l'arrêt du système.
        </div>
        <div style={{
          width: 200, height: 6, background: "#222", borderRadius: 3,
          overflow: "hidden", border: "1px solid #444",
        }}>
          <div style={{
            width: "100%", height: "100%",
            background: "linear-gradient(90deg, #06F, #0CF, #06F)",
            backgroundSize: "200% 100%",
            animation: "gradient 1s linear infinite",
            borderRadius: 3,
          }} />
        </div>
      </div>
    );
  }

  /* ── Phase 2: Off screen — press any key to restart ── */
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      background: "#000",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "monospace",
    }}>
      <div style={{ color: "#888", fontSize: 14, marginBottom: 20 }}>
        Vous pouvez maintenant éteindre votre ordinateur.
      </div>
      <div style={{ color: "#0F0", fontSize: 13, animation: "blink 1.2s infinite" }}>
        Appuyez sur une touche pour redémarrer...
      </div>
    </div>
  );
}
