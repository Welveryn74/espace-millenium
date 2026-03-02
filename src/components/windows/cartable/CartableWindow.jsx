import { useState, useEffect } from "react";
import Win from "../../Win";
import NostalImg from "../../NostalImg";
import CartableExplorer from "./CartableExplorer";
import CartableItemDetail from "./CartableItemDetail";
import { playZipSound } from "../../../utils/uiSounds";
import { logActivity } from "../../../utils/storage";

export default function CartableWindow({ onClose, onMinimize, zIndex, onFocus }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [shaking, setShaking] = useState(false);
  const [weight, setWeight] = useState(null);
  const [shakeCount, setShakeCount] = useState(0);

  const handleWeight = () => {
    playZipSound();
    setWeight(0);
    let w = 0;
    const iv = setInterval(() => {
      w += 0.3;
      if (w >= 7.2) { clearInterval(iv); setWeight(7.2); }
      else setWeight(w);
    }, 50);
  };

  const handleShake = () => {
    if (shaking) return;
    setShaking(true);
    setShakeCount(c => c + 1);
    setSelectedItem(null);
    logActivity("cartable_shake");
    setTimeout(() => setShaking(false), 1200);
  };

  // Log item views
  useEffect(() => {
    if (selectedItem) logActivity(`cartable_view_${selectedItem.id}`);
  }, [selectedItem]);

  return (
    <Win
      title="Mon Cartable — Année scolaire 2004-2005"
      onClose={onClose} onMinimize={onMinimize}
      width={620} height={560} zIndex={zIndex} onFocus={onFocus}
      initialPos={{ x: 160, y: 45 }} color="#8B4513"
    >
      <div style={{
        height: "100%",
        background: "linear-gradient(180deg, #FFF8F0 0%, #F0E8D8 100%)",
        overflowY: "auto",
        animation: shaking ? "cartableShake 0.4s ease-in-out 3" : "none",
      }}>
        {/* Header */}
        <div style={{ padding: "12px 16px 8px", textAlign: "center" }}>
          <NostalImg
            src="/images/desktop/cartable.svg" fallback="🎒" size={42}
            style={{ transition: "transform 0.3s", transform: shaking ? "rotate(-10deg)" : "rotate(0deg)" }}
          />
          <div style={{
            fontSize: 14, fontWeight: "bold", color: "#5A3E1B", marginTop: 4,
            fontFamily: "'Tahoma', sans-serif",
          }}>
            {selectedItem ? selectedItem.name : "Qu'est-ce qu'il y a dans le sac ?"}
          </div>
          <div style={{ fontSize: 10, color: "#999", marginTop: 2 }}>
            {selectedItem
              ? "Clique pour interagir"
              : "Fouille couche par couche — ou secoue tout !"}
          </div>

          {/* Action buttons */}
          {!selectedItem && (
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
              <button onClick={handleShake} disabled={shaking} style={{
                padding: "5px 14px",
                background: shaking ? "#ccc" : "linear-gradient(180deg, #FF6B6B 0%, #E05555 100%)",
                border: "1px solid #C04040", borderRadius: 4, cursor: shaking ? "wait" : "pointer",
                fontSize: 11, fontWeight: "bold", color: "#fff",
                fontFamily: "'Tahoma', sans-serif",
              }}>
                {shaking ? "💫 Ça tombe !" : "🫨 Secouer le cartable"}
              </button>
              <button onClick={handleWeight} style={{
                padding: "5px 14px",
                background: "linear-gradient(180deg, #F4D03F 0%, #E6B800 100%)",
                border: "1px solid #C9A800", borderRadius: 4, cursor: "pointer",
                fontSize: 11, fontWeight: "bold", color: "#333",
                fontFamily: "'Tahoma', sans-serif",
              }}>
                ⚖️ Peser
              </button>
            </div>
          )}

          {weight !== null && !selectedItem && (
            <div style={{
              marginTop: 6, fontSize: 16, fontWeight: "bold",
              color: weight >= 7 ? "#C00" : "#666",
              transition: "color 0.3s",
            }}>
              {weight.toFixed(1)} kg {weight >= 7 ? "😰" : ""}
              {weight >= 7 && (
                <div style={{ fontSize: 9, color: "#888", marginTop: 2, fontWeight: "normal" }}>
                  Recommandation OMS : max 10% du poids de l'enfant...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "0 16px 16px" }}>
          {selectedItem ? (
            <div>
              <button
                onClick={() => setSelectedItem(null)}
                style={{
                  background: "none", border: "1px solid #C8A06040",
                  color: "#8B7355", padding: "3px 10px", borderRadius: 4,
                  cursor: "pointer", fontSize: 10, marginBottom: 8,
                  fontFamily: "'Tahoma', sans-serif",
                }}
              >
                ← Retour au cartable
              </button>
              <CartableItemDetail item={selectedItem} onClose={() => setSelectedItem(null)} />
            </div>
          ) : (
            <CartableExplorer
              onSelectItem={setSelectedItem}
              shaking={shaking}
            />
          )}
        </div>
      </div>

      <style>{`
        @keyframes cartableShake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-6px) rotate(-2deg); }
          75% { transform: translateX(6px) rotate(2deg); }
        }
        @keyframes slideUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </Win>
  );
}
