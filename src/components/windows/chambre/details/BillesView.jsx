import { useState } from "react";
import NostalImg from "../../../NostalImg";
import { BILLES_COLLECTION } from "../../../../data/chambreItems";
import { loadState, saveState } from "../../../../utils/storage";
import BillesGame from "../../minigames/BillesGame";
import { viewTitle, viewSubtitle, viewFlavor, C } from "../../../../styles/chambreStyles";

export default function BillesView() {
  const [selected, setSelected] = useState(null);
  const [playingBilles, setPlayingBilles] = useState(false);
  const [billesWon, setBillesWon] = useState(() => loadState('billes_collection', 0));
  const current = selected ? BILLES_COLLECTION.find(b => b.id === selected) : null;

  const handleGameEnd = (score) => {
    if (score > 0) {
      const updated = billesWon + score;
      setBillesWon(updated);
      saveState('billes_collection', updated);
    }
  };

  if (playingBilles) {
    return (
      <div style={{ animation: "fadeIn 0.3s ease-out" }}>
        <button onClick={() => setPlayingBilles(false)} style={{
          background: "none", border: "1px solid rgba(200,176,232,0.4)",
          color: "#C8B0E8", padding: "4px 12px", borderRadius: 4, cursor: "pointer",
          fontSize: 11, fontFamily: "'Tahoma', sans-serif", marginBottom: 10,
        }}>← Retour à la collection</button>
        <BillesGame onBack={() => setPlayingBilles(false)} billes={BILLES_COLLECTION} onScore={handleGameEnd} />
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <NostalImg fallback="🔮" size={36} />
        <div style={{ ...viewTitle, marginTop: 4 }}>Ma Pochette de Billes</div>
        <div style={viewSubtitle}>"Tu joues pour de vrai ou pour de faux ?"</div>
        <div style={{ color: "#FFD700", fontSize: 12, marginTop: 6, fontWeight: "bold" }}>
          🏆 Billes gagnées : {billesWon}
        </div>
        <button onClick={() => setPlayingBilles(true)} style={{
          marginTop: 8, background: "rgba(200,176,232,0.15)", color: "#C8B0E8",
          border: "1px solid rgba(200,176,232,0.4)", padding: "6px 18px",
          borderRadius: 4, cursor: "pointer", fontFamily: "'Tahoma', sans-serif",
          fontSize: 12, fontWeight: "bold", transition: "all 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(200,176,232,0.3)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(200,176,232,0.15)"; }}
        >▶ Tir de billes !</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, justifyItems: "center" }}>
        {BILLES_COLLECTION.map((b) => {
          const isSelected = selected === b.id;
          return (
            <div
              key={b.id}
              onClick={() => setSelected(isSelected ? null : b.id)}
              style={{ textAlign: "center", cursor: "pointer", transition: "all 0.25s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              <div style={{
                width: b.size, height: b.size, borderRadius: "50%", margin: "0 auto",
                background: `radial-gradient(circle at 30% 30%, ${b.colors[1]}, ${b.colors[0]} 50%, ${b.colors[2]} 100%)`,
                boxShadow: isSelected
                  ? `0 0 16px ${b.colors[0]}80, inset 0 -3px 6px rgba(0,0,0,0.3), inset 0 3px 6px rgba(255,255,255,0.4)`
                  : `inset 0 -3px 6px rgba(0,0,0,0.3), inset 0 3px 6px rgba(255,255,255,0.4)`,
                border: isSelected ? `2px solid ${b.colors[0]}` : "2px solid transparent",
                transition: "box-shadow 0.2s, border 0.2s",
              }} />
              <div style={{
                color: isSelected ? "#E0E0E0" : "#999",
                fontSize: 9, marginTop: 6, fontWeight: isSelected ? "bold" : "normal",
                fontFamily: "'Tahoma', sans-serif",
              }}>
                {b.name}
              </div>
            </div>
          );
        })}
      </div>

      {current && (
        <div style={{
          marginTop: 16, padding: 14,
          background: `rgba(${parseInt(current.colors[0].slice(1,3),16)},${parseInt(current.colors[0].slice(3,5),16)},${parseInt(current.colors[0].slice(5,7),16)},0.08)`,
          border: `1px solid ${current.colors[0]}40`,
          borderRadius: 8, animation: "fadeIn 0.2s ease-out",
          display: "flex", gap: 12,
        }}>
          <NostalImg src={current.img} fallback="🔮" size={80} style={{ borderRadius: 6, flexShrink: 0 }} />
          <div>
            <div style={{ color: "#E0E0E0", fontSize: 13, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif", marginBottom: 6 }}>
              {current.name}
            </div>
            <div style={{ color: "#AAA", fontSize: 11, lineHeight: 1.6 }}>
              {current.desc}
            </div>
          </div>
        </div>
      )}

      <div style={viewFlavor}>
        La pochette en filet avec le cordon. Le trésor de la récré.
      </div>
    </div>
  );
}
