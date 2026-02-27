import { useState } from "react";
import Win from "../Win";
import { CARTABLE_ITEMS } from "../../data/cartableItems";

export default function CartableWindow({ onClose, zIndex, onFocus }) {
  const [opened, setOpened] = useState(null);
  const [weight, setWeight] = useState(null);

  const handleWeight = () => {
    setWeight(0);
    let w = 0;
    const iv = setInterval(() => {
      w += 0.3;
      if (w >= 7.2) { clearInterval(iv); setWeight(7.2); }
      else setWeight(w);
    }, 50);
  };

  return (
    <Win title="Mon Cartable — Année scolaire 2004-2005" onClose={onClose} width={500} height={460} zIndex={zIndex} onFocus={onFocus} initialPos={{ x: 160, y: 45 }} color="#8B4513">
      <div style={{ height: "100%", background: "linear-gradient(180deg, #FFF8F0 0%, #F0E8D8 100%)", padding: 16, overflowY: "auto" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 42 }}>🎒</span>
          <div style={{ fontSize: 14, fontWeight: "bold", color: "#5A3E1B", marginTop: 4 }}>
            Qu'est-ce qu'il y a dans le sac ?
          </div>
          <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>Cliquez sur un objet pour l'examiner</div>
          {/* Weight button */}
          <button onClick={handleWeight} style={{
            marginTop: 8, padding: "6px 16px", background: "linear-gradient(180deg, #F4D03F 0%, #E6B800 100%)",
            border: "1px solid #C9A800", borderRadius: 4, cursor: "pointer", fontSize: 11, fontWeight: "bold", color: "#333",
          }}>⚖️ Peser le cartable</button>
          {weight !== null && (
            <div style={{
              marginTop: 6, fontSize: 18, fontWeight: "bold",
              color: weight >= 7 ? "#C00" : "#666",
              transition: "color 0.3s",
            }}>
              {weight.toFixed(1)} kg {weight >= 7 ? "😰" : ""}
              {weight >= 7 && <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>Recommandation OMS : max 10% du poids de l'enfant...</div>}
            </div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {CARTABLE_ITEMS.map((item, i) => (
            <div key={i}
              onClick={() => setOpened(opened === i ? null : i)}
              style={{
                background: opened === i ? "#FFF5E0" : "#fff",
                border: opened === i ? "2px solid #E6B800" : "1px solid #ddd",
                borderRadius: 8, padding: 10, cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: opened === i ? "0 2px 8px rgba(200,150,0,0.2)" : "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: opened === i ? 8 : 0 }}>
                <span style={{ fontSize: 26 }}>{item.emoji}</span>
                <span style={{ fontSize: 12, fontWeight: "bold", color: "#5A3E1B" }}>{item.name}</span>
              </div>
              {opened === i && (
                <div style={{ fontSize: 11, color: "#666", lineHeight: 1.6, animation: "slideUp 0.2s ease-out", borderTop: "1px solid #E8E0D0", paddingTop: 8 }}>
                  {item.desc}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Win>
  );
}
