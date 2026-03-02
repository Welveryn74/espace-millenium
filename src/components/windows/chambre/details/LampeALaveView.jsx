import { useState } from "react";
import { viewTitle, viewSubtitle, viewFlavor, C } from "../../../../styles/chambreStyles";

const COLORS = [
  { id: "rouge", label: "Rouge", bg: "#1a0505", blob: "#FF3333", glow: "rgba(255,50,50,0.3)" },
  { id: "bleu", label: "Bleu", bg: "#050510", blob: "#4488FF", glow: "rgba(68,136,255,0.3)" },
  { id: "violet", label: "Violet", bg: "#0a050f", blob: "#9966FF", glow: "rgba(153,102,255,0.3)" },
  { id: "vert", label: "Vert", bg: "#050f05", blob: "#44FF88", glow: "rgba(68,255,136,0.3)" },
  { id: "orange", label: "Orange", bg: "#0f0a05", blob: "#FF8800", glow: "rgba(255,136,0,0.3)" },
  { id: "rose", label: "Rose", bg: "#0f050a", blob: "#FF66AA", glow: "rgba(255,102,170,0.3)" },
];

const FUN_FACTS = [
  "Inventée en 1963 par Edward Craven Walker, un nudiste britannique.",
  "La cire à l'intérieur est un mélange de paraffine et de tétrachlorure de carbone.",
  "Il faut environ 45 minutes pour qu'elle atteigne sa température optimale.",
  "Les blobs ne forment jamais deux fois la même forme.",
  "Elle était dans Austin Powers. Deux fois.",
  "En 2004, un homme a essayé d'en chauffer une sur la cuisinière. Ne fais jamais ça.",
  "Le mouvement des blobs est dû à la convection thermique.",
  "Elle est devenue l'icône officielle des années 70... et des chambres 2000s.",
];

export default function LampeALaveView() {
  const [color, setColor] = useState(0);
  const [zenMode, setZenMode] = useState(false);
  const [factIdx, setFactIdx] = useState(0);
  const c = COLORS[color];

  const nextFact = () => setFactIdx((i) => (i + 1) % FUN_FACTS.length);

  if (zenMode) {
    return (
      <div
        onClick={() => setZenMode(false)}
        style={{
          position: "absolute", inset: 0, zIndex: 10,
          background: c.bg, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "fadeIn 0.5s ease-out",
        }}
      >
        <LavaLamp color={c} size={300} />
        <div style={{
          position: "absolute", bottom: 20, color: c.blob,
          fontSize: 10, opacity: 0.5,
        }}>
          Clic pour sortir du mode Zen
        </div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ marginBottom: 12 }}>
        <div style={viewTitle}>Lampe à Lave</div>
        <div style={viewSubtitle}>
          L'objet le plus hypnotisant de la chambre. Tu pouvais la regarder pendant des heures.
        </div>
      </div>

      {/* Lampe */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <LavaLamp color={c} size={180} />
      </div>

      {/* Couleurs */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
        {COLORS.map((col, i) => (
          <div
            key={col.id}
            onClick={() => setColor(i)}
            style={{
              width: 24, height: 24, borderRadius: "50%",
              background: col.blob, cursor: "pointer",
              border: color === i ? "2px solid white" : "2px solid transparent",
              boxShadow: color === i ? `0 0 10px ${col.glow}` : "none",
              transition: "all 0.2s",
            }}
            title={col.label}
          />
        ))}
      </div>

      {/* Mode Zen */}
      <button
        onClick={() => setZenMode(true)}
        style={{
          background: `${c.blob}20`, color: c.blob,
          border: `1px solid ${c.blob}40`, padding: "8px 24px",
          borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: "bold",
          fontFamily: "'Tahoma', sans-serif", marginBottom: 16,
        }}
      >
        Mode Zen
      </button>

      {/* Fun fact */}
      <div
        onClick={nextFact}
        style={{
          padding: "10px 16px", borderRadius: 8, cursor: "pointer",
          background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`,
        }}
      >
        <div style={{ color: C.textMuted, fontSize: 9, marginBottom: 4 }}>Le savais-tu ?</div>
        <div style={{ color: C.textDim, fontSize: 11, lineHeight: 1.5, fontStyle: "italic" }}>
          {FUN_FACTS[factIdx]}
        </div>
        <div style={{ color: C.textMuted, fontSize: 8, marginTop: 4 }}>Clic pour un autre</div>
      </div>

      <div style={viewFlavor}>
        Tu l'avais demandée pour Noël 2003. Maman trouvait ça moche. Tu l'aimais quand même.
      </div>
    </div>
  );
}

function LavaLamp({ color, size }) {
  const blobSize = size * 0.2;
  return (
    <div style={{
      position: "relative", width: size * 0.35, height: size,
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      {/* Cap top */}
      <div style={{
        width: size * 0.18, height: size * 0.06, borderRadius: "50% 50% 0 0",
        background: "linear-gradient(180deg, #888, #555)",
        zIndex: 2,
      }} />
      {/* Body glass */}
      <div style={{
        width: size * 0.25, height: size * 0.7,
        borderRadius: `${size * 0.08}px ${size * 0.08}px ${size * 0.12}px ${size * 0.12}px`,
        background: color.bg,
        boxShadow: `inset 0 0 ${size * 0.15}px ${color.glow}, 0 0 ${size * 0.1}px ${color.glow}`,
        position: "relative", overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
      }}>
        {/* Blobs */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: blobSize * (0.6 + i * 0.15),
              height: blobSize * (0.8 + i * 0.12),
              borderRadius: "50%",
              background: `radial-gradient(circle at 40% 35%, ${color.blob}CC, ${color.blob}88)`,
              left: `${20 + i * 12}%`,
              animation: `lavaBlob${i} ${3 + i * 1.2}s ease-in-out infinite`,
              filter: `blur(${size * 0.01}px)`,
              boxShadow: `0 0 ${size * 0.04}px ${color.blob}40`,
            }}
          />
        ))}
      </div>
      {/* Base */}
      <div style={{
        width: size * 0.3, height: size * 0.12,
        borderRadius: `0 0 ${size * 0.05}px ${size * 0.05}px`,
        background: "linear-gradient(180deg, #666, #444, #333)",
      }} />

      <style>{`
        @keyframes lavaBlob0 {
          0%, 100% { bottom: 10%; transform: scale(1) translateX(0); border-radius: 50%; }
          25% { bottom: 55%; transform: scale(0.8) translateX(10%); border-radius: 45% 55% 50% 50%; }
          50% { bottom: 80%; transform: scale(1.1) translateX(-5%); border-radius: 55% 45% 55% 45%; }
          75% { bottom: 40%; transform: scale(0.9) translateX(8%); border-radius: 50% 50% 45% 55%; }
        }
        @keyframes lavaBlob1 {
          0%, 100% { bottom: 65%; transform: scale(1.1) translateX(0); border-radius: 55% 45% 50% 50%; }
          33% { bottom: 15%; transform: scale(0.8) translateX(-10%); border-radius: 45% 55% 45% 55%; }
          66% { bottom: 50%; transform: scale(1) translateX(5%); border-radius: 50% 50% 55% 45%; }
        }
        @keyframes lavaBlob2 {
          0%, 100% { bottom: 30%; transform: scale(0.9) translateX(0); border-radius: 50%; }
          50% { bottom: 70%; transform: scale(1.2) translateX(-8%); border-radius: 45% 55% 55% 45%; }
        }
        @keyframes lavaBlob3 {
          0%, 100% { bottom: 50%; transform: scale(0.7) translateX(5%); border-radius: 55% 45% 50% 50%; }
          40% { bottom: 5%; transform: scale(1) translateX(-5%); border-radius: 50% 50% 45% 55%; }
          80% { bottom: 75%; transform: scale(0.85) translateX(0); border-radius: 45% 55% 50% 50%; }
        }
      `}</style>
    </div>
  );
}
