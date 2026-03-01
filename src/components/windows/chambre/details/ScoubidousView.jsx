import { useState } from "react";
import NostalImg from "../../../NostalImg";
import { SCOUBIDOUS } from "../../../../data/chambreItems";
import { loadState, saveState } from "../../../../utils/storage";
import { viewTitle, viewSubtitle, viewFlavor } from "../../../../styles/chambreStyles";

const SCOUBIE_COLORS = ["#FF4444", "#FFDD44", "#4488FF", "#44FF88", "#FF44FF", "#FF8844"];

export default function ScoubidousView() {
  const [selected, setSelected] = useState(null);
  const [color1, setColor1] = useState(0);
  const [color2, setColor2] = useState(1);
  const [weaving, setWeaving] = useState(false);
  const [weaveDone, setWeaveDone] = useState(false);
  const [collection, setCollection] = useState(() => loadState('scoubidous_made', []));
  const current = selected ? SCOUBIDOUS.find(s => s.id === selected) : null;

  const startWeave = () => {
    if (weaving) return;
    setWeaving(true);
    setWeaveDone(false);
    setTimeout(() => {
      const newScoubie = {
        colors: [SCOUBIE_COLORS[color1], SCOUBIE_COLORS[color2]],
        date: new Date().toLocaleDateString('fr-FR'),
      };
      const updated = [...collection, newScoubie];
      setCollection(updated);
      saveState('scoubidous_made', updated);
      setWeaving(false);
      setWeaveDone(true);
      setTimeout(() => setWeaveDone(false), 2000);
    }, 2000);
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <NostalImg fallback="🪢" size={36} />
        <div style={{ ...viewTitle, marginTop: 4 }}>Mes Scoubidous</div>
        <div style={viewSubtitle}>Dessus, dessous, tirer, recommencer...</div>
        <div style={{ color: "#FFD700", fontSize: 11, marginTop: 4 }}>
          🪢 {collection.length} scoubidou{collection.length > 1 ? "s" : ""} tressé{collection.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* Weaving workshop */}
      <div style={{
        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(200,176,232,0.3)",
        borderRadius: 8, padding: 14, marginBottom: 16,
      }}>
        <div style={{ color: "#C8B0E8", fontSize: 12, fontWeight: "bold", marginBottom: 10, textAlign: "center" }}>
          ✂️ Atelier Scoubidou
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 12 }}>
          <div>
            <div style={{ color: "#AAA", fontSize: 10, marginBottom: 4, textAlign: "center" }}>Fil 1</div>
            <div style={{ display: "flex", gap: 4 }}>
              {SCOUBIE_COLORS.map((c, i) => (
                <div key={i} onClick={() => { if (!weaving && i !== color2) setColor1(i); }} style={{
                  width: 20, height: 20, borderRadius: "50%", background: c, cursor: weaving || i === color2 ? "default" : "pointer",
                  border: color1 === i ? "2px solid #fff" : "2px solid transparent",
                  opacity: i === color2 ? 0.3 : 1, transition: "all 0.15s",
                }} />
              ))}
            </div>
          </div>
          <div>
            <div style={{ color: "#AAA", fontSize: 10, marginBottom: 4, textAlign: "center" }}>Fil 2</div>
            <div style={{ display: "flex", gap: 4 }}>
              {SCOUBIE_COLORS.map((c, i) => (
                <div key={i} onClick={() => { if (!weaving && i !== color1) setColor2(i); }} style={{
                  width: 20, height: 20, borderRadius: "50%", background: c, cursor: weaving || i === color1 ? "default" : "pointer",
                  border: color2 === i ? "2px solid #fff" : "2px solid transparent",
                  opacity: i === color1 ? 0.3 : 1, transition: "all 0.15s",
                }} />
              ))}
            </div>
          </div>
        </div>
        {/* Preview */}
        <div style={{ display: "flex", justifyContent: "center", gap: 3, height: 50, alignItems: "center", marginBottom: 10 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{
              width: 7, height: 42, borderRadius: 3,
              background: `linear-gradient(180deg, ${SCOUBIE_COLORS[i % 2 === 0 ? color1 : color2]}, ${SCOUBIE_COLORS[i % 2 === 0 ? color1 : color2]}88, ${SCOUBIE_COLORS[i % 2 === 0 ? color1 : color2]})`,
              transform: i % 2 === 0 ? "rotate(8deg)" : "rotate(-8deg)",
              boxShadow: `0 0 6px ${SCOUBIE_COLORS[i % 2 === 0 ? color1 : color2]}40`,
              animation: weaving ? `pulse 0.3s ease-in-out ${i * 0.1}s infinite` : "none",
            }} />
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          {weaving ? (
            <div style={{ color: "#C8B0E8", fontSize: 11, fontWeight: "bold", animation: "pulse 0.5s ease-in-out infinite" }}>
              🪢 Dessus... dessous... tirer...
            </div>
          ) : weaveDone ? (
            <div style={{ color: "#4CAF50", fontSize: 12, fontWeight: "bold", animation: "fadeIn 0.3s ease-out" }}>
              ✅ Scoubidou terminé ! Ajouté à ta collection !
            </div>
          ) : (
            <button onClick={startWeave} style={{
              background: "rgba(200,176,232,0.2)", color: "#C8B0E8",
              border: "1px solid rgba(200,176,232,0.4)", padding: "6px 20px",
              borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: "bold",
              fontFamily: "'Tahoma', sans-serif",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(200,176,232,0.35)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(200,176,232,0.2)"; }}
            >🪢 Tresser !</button>
          )}
        </div>
      </div>

      {/* My collection */}
      {collection.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: "#C8B0E8", fontSize: 11, fontWeight: "bold", marginBottom: 8 }}>Ma collection :</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {collection.map((s, i) => (
              <div key={i} style={{
                display: "flex", gap: 1, padding: "4px 6px",
                background: "rgba(255,255,255,0.04)", borderRadius: 4,
                border: "1px solid rgba(255,255,255,0.08)",
              }} title={`Tressé le ${s.date}`}>
                {[0,1,2,3].map(j => (
                  <div key={j} style={{
                    width: 4, height: 20, borderRadius: 2,
                    background: s.colors[j % 2],
                    transform: j % 2 === 0 ? "rotate(6deg)" : "rotate(-6deg)",
                  }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing scoubidou catalog */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {SCOUBIDOUS.map((s) => {
          const isSelected = selected === s.id;
          return (
            <div
              key={s.id}
              onClick={() => setSelected(isSelected ? null : s.id)}
              style={{
                textAlign: "center", cursor: "pointer",
                background: isSelected ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                border: isSelected ? `2px solid ${s.colors[0]}60` : "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10, padding: 12, transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              <div style={{ display: "flex", justifyContent: "center", gap: 2, height: 48, alignItems: "center" }}>
                {s.colors.map((c, i) => (
                  <div key={i} style={{
                    width: 6, height: 40, borderRadius: 3,
                    background: `linear-gradient(180deg, ${c}, ${c}88, ${c})`,
                    transform: i % 2 === 0 ? "rotate(8deg)" : "rotate(-8deg)",
                    boxShadow: `0 0 4px ${c}40`,
                  }} />
                ))}
              </div>
              <div style={{
                color: isSelected ? "#E0E0E0" : "#AAA",
                fontSize: 11, fontWeight: "bold", marginTop: 8,
                fontFamily: "'Tahoma', sans-serif",
              }}>
                {s.name}
              </div>
            </div>
          );
        })}
      </div>

      {current && (
        <div style={{
          marginTop: 16, padding: 14,
          background: `${current.colors[0]}12`,
          border: `1px solid ${current.colors[0]}30`,
          borderRadius: 8, animation: "fadeIn 0.2s ease-out",
          display: "flex", gap: 12,
        }}>
          <NostalImg src={current.img} fallback="🪢" size={80} style={{ borderRadius: 6, flexShrink: 0 }} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              {current.colors.map((c, i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
              ))}
              <span style={{ color: "#E0E0E0", fontSize: 13, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif" }}>
                {current.name}
              </span>
            </div>
            <div style={{ color: "#AAA", fontSize: 11, lineHeight: 1.6 }}>
              {current.desc}
            </div>
          </div>
        </div>
      )}

      <div style={viewFlavor}>
        Fils en plastique achetés 50 centimes à la papeterie. Bonheur : gratuit.
      </div>
    </div>
  );
}
