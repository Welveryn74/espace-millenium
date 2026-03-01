import { useState } from "react";
import NostalImg from "../../../NostalImg";
import { LEGO_SETS } from "../../../../data/chambreItems";
import { loadState, saveState } from "../../../../utils/storage";
import { viewTitle, viewSubtitle, viewFlavor, C } from "../../../../styles/chambreStyles";

export default function LegoGallery() {
  const [expanded, setExpanded] = useState(null);
  const [builtSets, setBuiltSets] = useState(() => loadState('lego_built', []));
  const [building, setBuilding] = useState(null);
  const [progress, setProgress] = useState(0);

  const startBuild = (setId, e) => {
    e.stopPropagation();
    if (builtSets.includes(setId) || building) return;
    setBuilding(setId);
    setProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += 2;
      setProgress(p);
      if (p >= 100) {
        clearInterval(iv);
        const updated = [...builtSets, setId];
        setBuiltSets(updated);
        saveState('lego_built', updated);
        setTimeout(() => setBuilding(null), 500);
      }
    }, 80);
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <NostalImg fallback="🧱" size={36} />
        <div style={{ ...viewTitle, marginTop: 4 }}>Ma Collection Lego</div>
        <div style={viewSubtitle}>Le catalogue de Noël, page cornée sur les Lego...</div>
        <div style={{ color: "#FFD700", fontSize: 11, marginTop: 4 }}>
          ⭐ {builtSets.length}/{LEGO_SETS.length} sets construits
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {LEGO_SETS.map((set) => {
          const isOpen = expanded === set.id;
          const isBuilt = builtSets.includes(set.id);
          const isBuilding = building === set.id;
          return (
            <div
              key={set.id}
              onClick={() => setExpanded(isOpen ? null : set.id)}
              style={{
                background: isOpen ? `${set.color}20` : "rgba(255,255,255,0.04)",
                border: isOpen ? `2px solid ${set.color}70` : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8, padding: 12, cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { if (!isOpen) e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
              onMouseLeave={(e) => { if (!isOpen) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <NostalImg src={set.img} fallback={set.emoji} size={24} />
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#E0E0E0", fontSize: 13, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
                    {set.name}
                    {isBuilt && <span style={{ color: "#FFD700", fontSize: 14 }}>⭐</span>}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 3 }}>
                    <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: `${set.color}30`, color: set.color, fontWeight: "bold" }}>
                      {set.theme}
                    </span>
                    <span style={{ fontSize: 9, color: "#888" }}>{set.year}</span>
                    <span style={{ fontSize: 9, color: "#888" }}>{set.pieces} pièces</span>
                    {isBuilt && <span style={{ fontSize: 9, color: "#4CAF50", fontWeight: "bold" }}>✓ Construit</span>}
                  </div>
                </div>
                <span style={{ color: "#666", fontSize: 10, transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
              </div>
              {isOpen && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${set.color}30`, animation: "fadeIn 0.2s ease-out" }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <NostalImg src={set.img} fallback={set.emoji} size={100} style={{ borderRadius: 6, flexShrink: 0 }} />
                    <div style={{ color: "#AAA", fontSize: 11, lineHeight: 1.6 }}>{set.desc}</div>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    {isBuilding ? (
                      <div>
                        <div style={{ fontSize: 11, color: set.color, marginBottom: 4, fontWeight: "bold" }}>
                          🔧 Construction en cours... {progress}%
                        </div>
                        <div style={{ height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{
                            height: "100%", background: `linear-gradient(90deg, ${set.color}, ${set.color}CC)`,
                            width: `${progress}%`, borderRadius: 4, transition: "width 0.08s linear",
                          }} />
                        </div>
                        {progress >= 100 && (
                          <div style={{ color: "#4CAF50", fontSize: 12, fontWeight: "bold", marginTop: 6, animation: "fadeIn 0.3s ease-out" }}>
                            ✅ Set terminé !
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={(e) => startBuild(set.id, e)}
                        disabled={isBuilt}
                        style={{
                          background: isBuilt ? "rgba(76,175,80,0.15)" : `${set.color}25`,
                          color: isBuilt ? "#4CAF50" : set.color,
                          border: `1px solid ${isBuilt ? "rgba(76,175,80,0.4)" : set.color + "50"}`,
                          padding: "5px 16px", borderRadius: 4,
                          cursor: isBuilt ? "default" : "pointer",
                          fontSize: 11, fontFamily: "'Tahoma', sans-serif", fontWeight: "bold",
                        }}
                      >
                        {isBuilt ? "⭐ Déjà construit !" : `🔧 Construire (${set.pieces} pièces)`}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={viewFlavor}>
        L'odeur des briques neuves quand tu ouvrais le sachet. Inoubliable.
      </div>
    </div>
  );
}
