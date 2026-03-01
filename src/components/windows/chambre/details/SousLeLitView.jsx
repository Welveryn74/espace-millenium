import { useState } from "react";
import { SOUS_LE_LIT } from "../../../../data/chambreItems";
import { viewTitle, viewSubtitle, viewFlavor, C } from "../../../../styles/chambreStyles";

export default function SousLeLitView({ found, searching, lastFound, doSearch }) {
  const allFound = found.length >= SOUS_LE_LIT.length;
  const progress = SOUS_LE_LIT.length > 0 ? (found.length / SOUS_LE_LIT.length) * 100 : 0;
  const [dusting, setDusting] = useState(false);

  const handleSearch = () => {
    setDusting(true);
    doSearch();
    setTimeout(() => setDusting(false), 800);
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={viewTitle}>Sous le lit</div>
        <div style={viewSubtitle}>Tout un monde caché sous le sommier...</div>
      </div>

      {/* Progress bar */}
      <div style={{ margin: "0 auto 16px", maxWidth: 200 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 9, color: C.textDim }}>{found.length}/{SOUS_LE_LIT.length} trésors trouvés</span>
          <span style={{ fontSize: 9, color: C.secondary }}>{Math.round(progress)}%</span>
        </div>
        <div style={{
          height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden",
        }}>
          <div style={{
            height: "100%", borderRadius: 3,
            background: `linear-gradient(90deg, ${C.secondary}, ${C.primary})`,
            width: `${progress}%`, transition: "width 0.5s ease",
            boxShadow: `0 0 6px ${C.primary}40`,
          }} />
        </div>
      </div>

      {!allFound && (
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <button
            onClick={handleSearch}
            disabled={searching}
            style={{
              background: searching ? `${C.primary}30` : `${C.primary}15`,
              color: C.primary, border: `1px solid ${C.primary}60`,
              padding: "10px 28px", borderRadius: 8,
              cursor: searching ? "default" : "pointer",
              fontFamily: "'Tahoma', sans-serif", fontSize: 13, fontWeight: "bold",
              transition: "all 0.15s",
              animation: searching ? "searchAnim 0.5s ease-in-out infinite" : "none",
            }}
          >
            {searching ? "🔍 Fouille en cours..." : "🫳 Fouiller sous le lit"}
          </button>
        </div>
      )}

      {/* Dust cloud + discovered item */}
      {lastFound && (
        <div style={{ textAlign: "center", marginBottom: 16, position: "relative" }}>
          {/* Dust cloud */}
          {dusting && (
            <div style={{
              position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)",
              width: 60, height: 60, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(150,150,150,0.3), transparent)",
              animation: "dustCloud 0.8s ease-out forwards",
              pointerEvents: "none",
            }} />
          )}
          <div style={{
            padding: 16,
            background: `${C.primary}10`, border: `1px solid ${C.primary}30`,
            borderRadius: 10, animation: "popIn 0.4s ease-out",
          }}>
            <div style={{ fontSize: 40 }}>{lastFound.emoji}</div>
            <div style={{ color: C.text, fontSize: 14, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif", marginTop: 8 }}>
              {lastFound.name}
            </div>
            <div style={{ color: C.textDim, fontSize: 11, marginTop: 6, lineHeight: 1.6 }}>
              {lastFound.desc}
            </div>
            <div style={{ color: C.secondary, fontSize: 10, fontStyle: "italic", marginTop: 6 }}>
              {lastFound.flavor}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {SOUS_LE_LIT.map((item) => {
          const isFound = found.includes(item.id);
          return (
            <div key={item.id} style={{
              textAlign: "center", padding: 10, borderRadius: 8,
              background: isFound ? `${C.primary}08` : "rgba(100,100,100,0.06)",
              border: isFound ? `1px solid ${C.primary}25` : "1px dashed rgba(100,100,100,0.2)",
              transition: "all 0.25s ease",
            }}>
              <div style={{
                fontSize: 24, opacity: isFound ? 1 : 0.2,
                textShadow: isFound ? `0 0 8px ${C.primary}40` : "none",
                animation: isFound ? "none" : "none",
                transition: "all 0.3s ease",
              }}>
                {isFound ? item.emoji : "❓"}
              </div>
              <div style={{
                fontSize: 9, marginTop: 4, fontFamily: "'Tahoma', sans-serif",
                color: isFound ? C.primary : "#555",
              }}>
                {isFound ? item.name : "???"}
              </div>
            </div>
          );
        })}
      </div>

      {allFound && (
        <div style={{ textAlign: "center", marginTop: 14, color: C.primary, fontSize: 12, fontWeight: "bold" }}>
          🎉 Tu as tout retrouvé ! Le sous-lit n'a plus de secrets pour toi.
        </div>
      )}

      <div style={viewFlavor}>
        La poussière, les moutons, et des trésors oubliés depuis des années.
      </div>
    </div>
  );
}
