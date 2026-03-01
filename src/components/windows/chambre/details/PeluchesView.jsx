import { useState } from "react";
import NostalImg from "../../../NostalImg";
import { PELUCHES } from "../../../../data/chambreItems";
import { playHugSound } from "../../../../utils/chambreSounds";

export default function PeluchesView() {
  const [hugged, setHugged] = useState(null);

  const doHug = (id) => {
    setHugged(id);
    playHugSound();
    setTimeout(() => setHugged(null), 1500);
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <NostalImg src="/images/chambre/peluches/ours.svg" fallback="🧸" size={36} />
        <div style={{ color: "#C8B0E8", fontSize: 15, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif", marginTop: 4 }}>
          Mes Peluches
        </div>
        <div style={{ color: "#8B6BAE", fontSize: 11, marginTop: 4, fontStyle: "italic" }}>
          Clique pour leur faire un câlin !
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {PELUCHES.map((p) => {
          const isHugged = hugged === p.id;
          return (
            <div
              key={p.id}
              onClick={() => !hugged && doHug(p.id)}
              style={{
                background: isHugged ? `${p.color}25` : "rgba(255,255,255,0.04)",
                border: isHugged ? `2px solid ${p.color}60` : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10, padding: 14, cursor: hugged ? "default" : "pointer",
                transition: "all 0.2s", textAlign: "center",
              }}
              onMouseEnter={(e) => { if (!hugged) e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
              onMouseLeave={(e) => { if (!isHugged) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
            >
              <div style={{
                transition: "transform 0.3s ease",
                transform: isHugged ? "scale(1.3)" : "scale(1)",
                animation: isHugged ? "pulse 0.4s ease-in-out 3" : "none",
              }}>
                <NostalImg src={p.img} fallback={p.emoji} size={isHugged ? 80 : 40} />
              </div>
              <div style={{ color: "#E0E0E0", fontSize: 12, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif", marginTop: 6 }}>
                {p.name}
              </div>
              {isHugged ? (
                <div style={{ color: p.color, fontSize: 11, marginTop: 6, fontWeight: "bold", animation: "fadeIn 0.2s ease-out" }}>
                  {p.reaction}
                </div>
              ) : (
                <div style={{ color: "#888", fontSize: 10, marginTop: 6, lineHeight: 1.5 }}>
                  {p.desc}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginTop: 14, color: "#8B6BAE", fontSize: 10, fontStyle: "italic" }}>
        Tu les as toujours. Ils sont dans un carton au grenier. Ils t'attendent.
      </div>
    </div>
  );
}
