import { useState } from "react";
import NostalImg from "../../../NostalImg";
import { COUETTES } from "../../../../data/chambreItems";
import { viewTitle, viewSubtitle, viewFlavor, C } from "../../../../styles/chambreStyles";

export default function CouetteSelector({ couette, setCouette }) {
  const [hovered, setHovered] = useState(null);
  const current = COUETTES.find((c) => c.id === couette);

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <NostalImg src="/images/desktop/chambre.png" fallback="🛏️" size={36} />
        <div style={{ ...viewTitle, marginTop: 4 }}>Choisis ta housse de couette !</div>
        <div style={viewSubtitle}>Celle qui disait tout sur ta personnalité...</div>
      </div>

      {/* Mini preview lit */}
      <div style={{
        margin: "0 auto 16px", width: 80, height: 30, borderRadius: "4px 4px 0 0",
        background: current
          ? `linear-gradient(135deg, ${current.color}60, ${current.color}30)`
          : "rgba(255,255,255,0.06)",
        border: `1px solid ${current ? current.color + "50" : C.border}`,
        position: "relative", transition: "all 0.4s ease",
        boxShadow: current ? `0 0 12px ${current.color}20` : "none",
      }}>
        {/* Oreiller */}
        <div style={{
          position: "absolute", top: 2, left: 6, width: 18, height: 10,
          background: "rgba(255,255,255,0.15)", borderRadius: 3,
        }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {COUETTES.map((c) => {
          const selected = couette === c.id;
          const isHovered = hovered === c.id;
          return (
            <div
              key={c.id}
              onClick={() => setCouette(c.id)}
              onMouseEnter={() => setHovered(c.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: selected
                  ? `linear-gradient(135deg, ${c.color}25, ${c.color}10)`
                  : isHovered ? C.bgHover : C.bg,
                border: selected ? `2px solid ${c.color}90` : `1px solid ${C.border}`,
                borderRadius: 10, padding: 14, cursor: "pointer",
                transition: "all 0.25s ease",
                transform: isHovered && !selected ? "translateY(-2px)" : "translateY(0)",
                boxShadow: selected
                  ? `0 0 20px ${c.color}30`
                  : isHovered ? "0 4px 12px rgba(0,0,0,0.2)" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <NostalImg src={c.img} fallback={c.emoji} size={56}
                  style={{ borderRadius: 6, transition: "all 0.25s ease" }} />
                <div style={{ color: C.text, fontSize: 13, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif" }}>
                  {c.label}
                </div>
              </div>
              <div style={{ color: "#999", fontSize: 11, marginTop: 8, lineHeight: 1.5 }}>
                {c.desc}
              </div>
              {selected && (
                <div style={{
                  color: c.color, fontSize: 10, marginTop: 6, fontWeight: "bold",
                  animation: "popIn 0.3s ease-out",
                }}>
                  ✨ Sur ton lit !
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={viewFlavor}>
        Maman la lavait le dimanche. Tu dormais avec la couette de rechange, la moche.
      </div>
    </div>
  );
}
