import { useState, useCallback } from "react";
import { LIEUX } from "../../../../data/dehorsItems";
import { viewTitle, viewSubtitle, viewFlavor, D } from "../../../../styles/dehorsStyles";

const lieu = LIEUX.find((l) => l.id === "laserGame");

const TARGETS = [
  { id: 1, x: 20, y: 30, label: "Ennemi gauche" },
  { id: 2, x: 55, y: 15, label: "Base ennemie" },
  { id: 3, x: 80, y: 45, label: "Ennemi droite" },
  { id: 4, x: 40, y: 55, label: "Tourelle" },
  { id: 5, x: 70, y: 25, label: "Sniper" },
];

export default function LaserGameView() {
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState([]);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [flash, setFlash] = useState(null);

  const nextPhrase = () => setPhraseIndex((i) => (i + 1) % lieu.phrases.length);

  const shootTarget = useCallback((target) => {
    if (hits.includes(target.id)) return;
    setHits((h) => [...h, target.id]);
    setScore((s) => s + 100);
    setFlash(target.id);
    setTimeout(() => setFlash(null), 300);
  }, [hits]);

  const reset = () => { setScore(0); setHits([]); };

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 36 }}>🔫</div>
        <div style={{ ...viewTitle, color: lieu.color, marginTop: 4 }}>{lieu.label}</div>
        <div style={viewSubtitle}>{lieu.desc}</div>
      </div>

      {/* Mini-jeu de tir */}
      <div style={{
        position: "relative", width: "100%", height: 180, borderRadius: 10,
        background: "linear-gradient(180deg, #0a0a1e 0%, #1a1a3e 100%)",
        border: "1px solid #00FF8840", overflow: "hidden", marginBottom: 14,
      }}>
        {/* Brouillard */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.15,
          background: "radial-gradient(ellipse at 50% 80%, #00FF88 0%, transparent 70%)",
        }} />
        {/* Score */}
        <div style={{
          position: "absolute", top: 6, right: 10,
          color: "#00FF88", fontSize: 14, fontWeight: "bold", fontFamily: "'Courier New', monospace",
        }}>
          SCORE: {score}
        </div>
        {/* Cibles */}
        {TARGETS.map((t) => {
          const isHit = hits.includes(t.id);
          const isFlashing = flash === t.id;
          return (
            <div
              key={t.id}
              onClick={() => shootTarget(t)}
              style={{
                position: "absolute",
                left: `${t.x}%`, top: `${t.y}%`,
                width: 30, height: 30, borderRadius: "50%",
                background: isHit ? "#333" : isFlashing ? "#FF0000" : "#00FF8830",
                border: `2px solid ${isHit ? "#555" : "#00FF88"}`,
                cursor: isHit ? "default" : "crosshair",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.15s ease",
                boxShadow: isHit ? "none" : "0 0 12px #00FF8840",
              }}
            >
              <div style={{ color: isHit ? "#555" : "#00FF88", fontSize: 10, fontWeight: "bold" }}>
                {isHit ? "✕" : "◎"}
              </div>
            </div>
          );
        })}
        {/* Message fin */}
        {hits.length === TARGETS.length && (
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.7)", animation: "fadeIn 0.3s ease-out",
          }}>
            <div style={{ color: "#00FF88", fontSize: 18, fontWeight: "bold" }}>MISSION COMPLETE !</div>
            <div style={{ color: "#fff", fontSize: 12, marginTop: 4 }}>Score final : {score}</div>
            <button onClick={reset} style={{
              marginTop: 10, padding: "4px 16px", background: "#00FF8830",
              border: "1px solid #00FF88", borderRadius: 4, color: "#00FF88",
              cursor: "pointer", fontSize: 11, fontWeight: "bold",
            }}>Rejouer</button>
          </div>
        )}
      </div>

      {/* Phrase culte */}
      <div
        onClick={nextPhrase}
        style={{
          textAlign: "center", padding: "10px 16px", margin: "0 auto 16px",
          background: `${lieu.color}15`, borderRadius: 8, cursor: "pointer",
          border: `1px solid ${lieu.color}30`, maxWidth: 400,
        }}
      >
        <div style={{ color: D.textDim, fontSize: 10, marginBottom: 4 }}>💬 Phrase culte (clique pour changer)</div>
        <div style={{ color: lieu.color, fontSize: 13, fontStyle: "italic", fontWeight: "bold" }}>
          « {lieu.phrases[phraseIndex]} »
        </div>
      </div>

      {/* Étapes de la partie */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {lieu.activities.map((act) => (
          <div key={act.id} style={{
            background: D.bg, border: `1px solid ${D.border}`, borderRadius: 10, padding: 12,
          }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{act.emoji}</div>
            <div style={{ color: D.text, fontSize: 11, fontWeight: "bold" }}>{act.name}</div>
            <div style={{ color: D.textDim, fontSize: 10, marginTop: 4, lineHeight: 1.4 }}>{act.desc}</div>
          </div>
        ))}
      </div>

      <div style={viewFlavor}>{lieu.ambiance}</div>
    </div>
  );
}
