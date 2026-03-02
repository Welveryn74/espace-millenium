import { useState } from "react";
import { viewTitle, viewSubtitle, viewFlavor, C } from "../../../../styles/chambreStyles";

const VOITURES = [
  {
    id: "4x4",
    name: "Le 4x4 tout-terrain",
    emoji: "🚙",
    color: "#2E7D32",
    desc: "La voiture qui passait PARTOUT. Dans le jardin, sur le gravier, dans les flaques d'eau. Les pneus étaient énormes et ça faisait un bruit de dingue.",
    vitesse: 7,
    robustesse: 10,
    style: 5,
    phrase: "\"Elle monte sur le canapé !\"",
  },
  {
    id: "f1",
    name: "La Formule 1",
    emoji: "🏎️",
    color: "#C62828",
    desc: "La rouge. Celle qui allait tellement vite qu'elle se crashait dans les murs au bout de 3 secondes. L'aileron arrière tenait avec du scotch.",
    vitesse: 10,
    robustesse: 3,
    style: 9,
    phrase: "\"VROOOOM ! Michael Schumacher est en tête !\"",
  },
  {
    id: "pompier",
    name: "Le camion de pompiers",
    emoji: "🚒",
    color: "#D32F2F",
    desc: "Avec la vraie sirène et la vraie échelle qui montait. Tu le faisais tourner dans la cuisine en criant PIN-PON PIN-PON. Le chat s'enfuyait à chaque fois.",
    vitesse: 5,
    robustesse: 9,
    style: 7,
    phrase: "\"PIN-PON PIN-PON ! Poussez-vous !\"",
  },
  {
    id: "monster",
    name: "Le Monster Truck",
    emoji: "🛻",
    color: "#FF6F00",
    desc: "Les roues faisaient 3 fois la taille de la voiture. Ça roulait sur tout : les Lego, les chaussettes, le chat (presque). Le roi du salon.",
    vitesse: 6,
    robustesse: 10,
    style: 8,
    phrase: "\"GRAAAVE ! Elle a roulé sur mon cahier !\"",
  },
  {
    id: "police",
    name: "La voiture de police",
    emoji: "🚓",
    color: "#1565C0",
    desc: "Blanche et bleue avec des gyrophares qui clignotent. Tu faisais des poursuites dans le couloir contre la F1. La loi c'est toi.",
    vitesse: 8,
    robustesse: 7,
    style: 8,
    phrase: "\"Arrêtez-vous ! C'est la police !\"",
  },
];

const STATS = ["vitesse", "robustesse", "style"];
const STAT_LABELS = { vitesse: "Vitesse", robustesse: "Robustesse", style: "Style" };
const STAT_EMOJIS = { vitesse: "💨", robustesse: "🛡️", style: "✨" };

export default function VoitureRCView() {
  const [selected, setSelected] = useState(null);
  const [piles, setPiles] = useState(100);

  const drainPiles = () => {
    if (piles <= 0) return;
    setPiles((p) => Math.max(0, p - 15));
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={viewTitle}>Voitures Télécommandées</div>
        <div style={viewSubtitle}>
          La collection au pied du lit. Prêtes à démarrer... si y'a des piles.
        </div>
      </div>

      {/* Jauge de piles */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "6px 12px", borderRadius: 6,
        background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`,
        marginBottom: 12,
      }}>
        <span style={{ fontSize: 14 }}>🔋</span>
        <div style={{ flex: 1, height: 10, borderRadius: 5, background: "#1a1a1a", overflow: "hidden" }}>
          <div style={{
            width: `${piles}%`,
            height: "100%",
            borderRadius: 5,
            background: piles > 50 ? "#4CAF50" : piles > 20 ? "#FF9800" : "#F44336",
            transition: "width 0.3s, background 0.3s",
          }} />
        </div>
        <span style={{ fontSize: 9, color: piles > 0 ? C.textDim : "#F44336", minWidth: 30 }}>
          {piles > 0 ? `${piles}%` : "VIDE"}
        </span>
        {piles <= 0 && (
          <button
            onClick={() => setPiles(100)}
            style={{
              ...btnStyle, fontSize: 8, padding: "2px 8px",
              color: "#4CAF50", border: "1px solid #4CAF5040",
            }}
          >
            Nouvelles piles !
          </button>
        )}
      </div>

      {piles <= 0 && (
        <div style={{
          textAlign: "center", padding: 8, marginBottom: 12,
          color: "#FF9800", fontSize: 11, fontStyle: "italic",
        }}>
          "Les piles c'est TOI qui les achètes !" — Maman
        </div>
      )}

      {/* Collection */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {VOITURES.map((v) => {
          const isSelected = selected === v.id;
          return (
            <div
              key={v.id}
              onClick={() => setSelected(isSelected ? null : v.id)}
              style={{
                padding: 10, borderRadius: 8, cursor: "pointer",
                background: isSelected ? `${v.color}15` : C.bg,
                border: isSelected ? `2px solid ${v.color}40` : `1px solid ${C.border}`,
                transition: "all 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  fontSize: 28,
                  animation: piles > 0 ? "carVroom 0.8s ease-in-out infinite" : "none",
                  opacity: piles > 0 ? 1 : 0.4,
                }}>
                  {v.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: v.color, fontWeight: "bold" }}>
                    {v.name}
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 3 }}>
                    {STATS.map((s) => (
                      <span key={s} style={{
                        fontSize: 8, padding: "1px 4px", borderRadius: 3,
                        background: `${v.color}15`, color: v.color,
                      }}>
                        {STAT_EMOJIS[s]} {v[s]}
                      </span>
                    ))}
                  </div>
                </div>
                {piles > 0 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); drainPiles(); }}
                    style={{
                      ...btnStyle, fontSize: 9, padding: "4px 10px",
                      background: `${v.color}15`, color: v.color,
                      border: `1px solid ${v.color}30`,
                    }}
                  >
                    VROOOM !
                  </button>
                )}
              </div>
              {isSelected && (
                <div style={{ marginTop: 8, animation: "fadeIn 0.2s ease-out" }}>
                  <div style={{ fontSize: 10, color: C.textDim, lineHeight: 1.5 }}>
                    {v.desc}
                  </div>
                  <div style={{
                    fontSize: 11, color: v.color, fontStyle: "italic",
                    marginTop: 6, fontWeight: "bold",
                  }}>
                    {v.phrase}
                  </div>
                  {/* Stats bars */}
                  <div style={{ marginTop: 8 }}>
                    {STATS.map((s) => (
                      <div key={s} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                        <span style={{ fontSize: 8, color: C.textMuted, width: 60 }}>
                          {STAT_EMOJIS[s]} {STAT_LABELS[s]}
                        </span>
                        <div style={{
                          flex: 1, height: 6, borderRadius: 3,
                          background: "rgba(255,255,255,0.06)",
                        }}>
                          <div style={{
                            width: `${v[s] * 10}%`, height: "100%",
                            borderRadius: 3, background: v.color,
                            transition: "width 0.3s",
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={viewFlavor}>
        "Elle va plus vite que le chat !" — La fierté de chaque enfant, avant que le chat ne la rattrape.
      </div>

      <style>{`
        @keyframes carVroom {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(2px); }
          75% { transform: translateX(-2px); }
        }
      `}</style>
    </div>
  );
}

const btnStyle = {
  background: C.bg, color: C.primary, border: `1px solid ${C.border}`,
  padding: "6px 14px", borderRadius: 6, cursor: "pointer",
  fontSize: 11, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif",
};
