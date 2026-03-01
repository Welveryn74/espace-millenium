import NostalImg from "../../../NostalImg";
import { COUETTES } from "../../../../data/chambreItems";

export default function CouetteSelector({ couette, setCouette }) {
  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <NostalImg src="/images/desktop/chambre.png" fallback="🛏️" size={36} />
        <div style={{ color: "#C8B0E8", fontSize: 15, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif", marginTop: 4 }}>
          Choisis ta housse de couette !
        </div>
        <div style={{ color: "#8B6BAE", fontSize: 11, marginTop: 4, fontStyle: "italic" }}>
          Celle qui disait tout sur ta personnalité...
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {COUETTES.map((c) => {
          const selected = couette === c.id;
          return (
            <div
              key={c.id}
              onClick={() => setCouette(c.id)}
              style={{
                background: selected ? `${c.color}30` : "rgba(255,255,255,0.05)",
                border: selected ? `2px solid ${c.color}90` : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8, padding: 14, cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: selected ? `0 0 20px ${c.color}30` : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <NostalImg src={c.img} fallback={c.emoji} size={selected ? 80 : 28} style={selected ? { borderRadius: 6 } : undefined} />
                <div style={{ color: "#E0E0E0", fontSize: 13, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif" }}>
                  {c.label}
                </div>
              </div>
              <div style={{ color: "#999", fontSize: 11, marginTop: 8, lineHeight: 1.5 }}>
                {c.desc}
              </div>
              {selected && (
                <div style={{ color: c.color, fontSize: 10, marginTop: 6, fontWeight: "bold" }}>
                  ✓ Sur ton lit !
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
