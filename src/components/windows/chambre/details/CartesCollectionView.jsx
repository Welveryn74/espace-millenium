import { useState } from "react";
import { FRANCHISES, CARDS, RARITY_COLORS, RARITY_LABELS } from "../../../../data/cardsCollection";
import { viewTitle, viewSubtitle, viewFlavor, C } from "../../../../styles/chambreStyles";
import useCards from "../hooks/useCards";

export default function CartesCollectionView() {
  const [tab, setTab] = useState("pokemon");
  const [viewMode, setViewMode] = useState("classeur"); // classeur, booster
  const cards = useCards();
  const franchise = FRANCHISES.find((f) => f.id === tab);
  const stats = cards.getCollectionStats(tab);

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={viewTitle}>Cartes à collectionner</div>
        <div style={viewSubtitle}>Le classeur qui ne quittait jamais le cartable. Chaque récré, c'était "T'as des doubles ?"</div>
      </div>

      {/* Tabs franchise */}
      <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 12 }}>
        {FRANCHISES.map((f) => (
          <button
            key={f.id}
            onClick={() => setTab(f.id)}
            style={{
              padding: "5px 12px", borderRadius: 4, fontSize: 11, fontWeight: "bold",
              fontFamily: "'Tahoma', sans-serif", cursor: "pointer",
              background: tab === f.id ? `${f.color}30` : C.bg,
              border: tab === f.id ? `2px solid ${f.color}60` : `1px solid ${C.border}`,
              color: tab === f.id ? f.color : C.textDim, transition: "all 0.15s",
            }}
          >
            {f.emoji} {f.name}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 11, color: franchise.color, fontWeight: "bold" }}>
          {stats.owned}/{stats.total} cartes
        </span>
        <div style={{
          height: 4, borderRadius: 2, background: "rgba(255,255,255,0.1)",
          maxWidth: 200, margin: "4px auto", overflow: "hidden",
        }}>
          <div style={{
            height: "100%", borderRadius: 2, transition: "width 0.3s",
            width: `${(stats.owned / stats.total) * 100}%`,
            background: franchise.color,
          }} />
        </div>
      </div>

      {/* View toggle */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 12 }}>
        <button onClick={() => setViewMode("classeur")} style={toggleBtn(viewMode === "classeur", franchise.color)}>
          Classeur
        </button>
        <button onClick={() => setViewMode("booster")} style={toggleBtn(viewMode === "booster", franchise.color)}>
          Ouvrir un booster
        </button>
        <button onClick={() => { const c = cards.tradeDoublon(tab); }} style={toggleBtn(false, "#FF9800")}>
          Échanger un doublon
        </button>
      </div>

      {/* Booster opening */}
      {cards.boosterOpen && (
        <div style={{
          padding: 16, borderRadius: 8, marginBottom: 12,
          background: "rgba(0,0,0,0.4)", border: `1px solid ${franchise.color}40`,
          textAlign: "center", animation: "fadeIn 0.3s ease-out",
        }}>
          <div style={{ color: franchise.color, fontSize: 13, fontWeight: "bold", marginBottom: 12 }}>
            Booster {franchise.name} !
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 12 }}>
            {cards.boosterCards.map((card, i) => {
              const revealed = i <= cards.revealIdx;
              const rarityColor = RARITY_COLORS[card.rarity];
              return (
                <div
                  key={i}
                  onClick={!revealed && i === cards.revealIdx + 1 ? cards.revealNext : undefined}
                  style={{
                    width: 56, height: 78, borderRadius: 6, cursor: !revealed ? "pointer" : "default",
                    background: revealed ? `${card.color}30` : `${franchise.color}15`,
                    border: `2px solid ${revealed ? rarityColor : franchise.color + "40"}`,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    transition: "all 0.3s",
                    transform: revealed ? "rotateY(0deg)" : "rotateY(180deg)",
                    boxShadow: revealed && card.rarity === "UR" ? `0 0 15px ${rarityColor}, 0 0 30px ${rarityColor}40` : "none",
                    animation: revealed && card.rarity === "UR" ? "holoShine 2s ease-in-out infinite" : "none",
                  }}
                >
                  {revealed ? (
                    <>
                      <div style={{ fontSize: 7, color: rarityColor, fontWeight: "bold" }}>
                        {RARITY_LABELS[card.rarity]}
                      </div>
                      <div style={{ fontSize: 10, color: C.text, fontWeight: "bold", textAlign: "center", marginTop: 2 }}>
                        {card.name}
                      </div>
                      {card.pv && <div style={{ fontSize: 8, color: C.dim }}>PV {card.pv}</div>}
                      {card.atk !== undefined && typeof card.atk === "number" && (
                        <div style={{ fontSize: 8, color: C.dim }}>ATK {card.atk}</div>
                      )}
                    </>
                  ) : (
                    <div style={{ fontSize: 20 }}>{franchise.emoji}</div>
                  )}
                </div>
              );
            })}
          </div>
          {cards.revealIdx < cards.boosterCards.length - 1 ? (
            <button onClick={cards.revealNext} style={actionBtn(franchise.color)}>
              Révéler ({cards.revealIdx + 2}/5)
            </button>
          ) : (
            <button onClick={cards.closeBooster} style={actionBtn("#4CAF50")}>
              Fermer
            </button>
          )}
        </div>
      )}

      {/* Booster button or classeur */}
      {viewMode === "booster" && !cards.boosterOpen && (
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <div
            onClick={() => cards.openBooster(tab)}
            style={{
              display: "inline-block", padding: "16px 32px", borderRadius: 10,
              background: `linear-gradient(135deg, ${franchise.color}30, ${franchise.color}10)`,
              border: `2px solid ${franchise.color}50`,
              cursor: "pointer", transition: "all 0.2s",
            }}
          >
            <div style={{ fontSize: 30 }}>{franchise.emoji}</div>
            <div style={{ color: franchise.color, fontSize: 13, fontWeight: "bold", marginTop: 4 }}>
              Ouvrir un Booster
            </div>
            <div style={{ color: C.textMuted, fontSize: 9, marginTop: 2 }}>5 cartes aléatoires</div>
          </div>
        </div>
      )}

      {/* Classeur grid */}
      {viewMode === "classeur" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4 }}>
          {CARDS[tab].map((card) => {
            const key = `${tab}_${card.id}`;
            const count = cards.collected[key] || 0;
            const owned = count > 0;
            const rarityColor = RARITY_COLORS[card.rarity];
            return (
              <div
                key={card.id}
                style={{
                  height: 64, borderRadius: 4, position: "relative",
                  background: owned ? `${card.color}20` : "rgba(0,0,0,0.3)",
                  border: `1px solid ${owned ? rarityColor + "60" : "rgba(255,255,255,0.05)"}`,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  opacity: owned ? 1 : 0.35,
                  boxShadow: owned && card.rarity === "UR" ? `0 0 8px ${rarityColor}40` : "none",
                }}
                title={owned ? `${card.name} (x${count})` : "???"}
              >
                {owned ? (
                  <>
                    <div style={{ fontSize: 8, color: rarityColor, fontWeight: "bold" }}>
                      {card.rarity}
                    </div>
                    <div style={{ fontSize: 8, color: C.text, fontWeight: "bold", textAlign: "center", padding: "0 2px" }}>
                      {card.name}
                    </div>
                    {count > 1 && (
                      <div style={{
                        position: "absolute", top: 1, right: 2, fontSize: 7,
                        color: "#FFD700", fontWeight: "bold",
                      }}>
                        x{count}
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ fontSize: 16, opacity: 0.3 }}>?</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={viewFlavor}>
        "T'échanges ton Dracaufeu contre mon Ronflex + 3 communes ?" "JAMAIS."
      </div>

      <style>{`
        @keyframes holoShine {
          0%, 100% { filter: brightness(1) hue-rotate(0deg); }
          50% { filter: brightness(1.3) hue-rotate(20deg); }
        }
      `}</style>
    </div>
  );
}

function toggleBtn(active, color) {
  return {
    padding: "4px 10px", borderRadius: 4, fontSize: 10, fontWeight: "bold",
    fontFamily: "'Tahoma', sans-serif", cursor: "pointer",
    background: active ? `${color}25` : "rgba(255,255,255,0.04)",
    border: `1px solid ${active ? color + "50" : "rgba(255,255,255,0.08)"}`,
    color: active ? color : "#AAA", transition: "all 0.15s",
  };
}

function actionBtn(color) {
  return {
    background: `${color}20`, color: color,
    border: `1px solid ${color}50`, padding: "6px 16px",
    borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: "bold",
    fontFamily: "'Tahoma', sans-serif",
  };
}
