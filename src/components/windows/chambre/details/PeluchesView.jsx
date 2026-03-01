import { useState } from "react";
import NostalImg from "../../../NostalImg";
import { PELUCHES } from "../../../../data/chambreItems";
import { playHugSound } from "../../../../utils/chambreSounds";
import { viewTitle, viewSubtitle, viewFlavor, C } from "../../../../styles/chambreStyles";

export default function PeluchesView() {
  const [hugged, setHugged] = useState(null);
  const [lastHugged, setLastHugged] = useState(null);
  const [hugCount, setHugCount] = useState(0);
  const [hearts, setHearts] = useState([]);
  const [hovered, setHovered] = useState(null);

  const doHug = (id) => {
    setHugged(id);
    setLastHugged(id);
    setHugCount((c) => c + 1);
    playHugSound();
    // Spawn hearts
    const newHearts = Array.from({ length: 3 }, (_, i) => ({
      id: Date.now() + i,
      left: 30 + Math.random() * 40,
      delay: i * 0.15,
    }));
    setHearts(newHearts);
    setTimeout(() => { setHugged(null); setHearts([]); }, 1500);
  };

  const headerEmoji = lastHugged
    ? PELUCHES.find((p) => p.id === lastHugged)?.emoji || "🧸"
    : "🧸";

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 36 }}>{headerEmoji}</span>
        <div style={{ ...viewTitle, marginTop: 4 }}>Mes Peluches</div>
        <div style={viewSubtitle}>Clique pour leur faire un câlin !</div>
        {hugCount > 0 && (
          <div style={{ color: "#E8607088", fontSize: 10, marginTop: 6 }}>
            {hugCount} câlin{hugCount > 1 ? "s" : ""} distribué{hugCount > 1 ? "s" : ""}
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {PELUCHES.map((p) => {
          const isHugged = hugged === p.id;
          const isHovered = hovered === p.id;
          return (
            <div
              key={p.id}
              onClick={() => !hugged && doHug(p.id)}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: isHugged ? `${p.color}25` : isHovered ? C.bgHover : C.bg,
                border: isHugged ? `2px solid ${p.color}60` : `1px solid ${C.border}`,
                borderRadius: 10, padding: 14, cursor: hugged ? "default" : "pointer",
                transition: "all 0.25s ease", textAlign: "center",
                position: "relative", overflow: "visible",
              }}
            >
              {/* Hearts */}
              {isHugged && hearts.map((h) => (
                <span key={h.id} style={{
                  position: "absolute", top: "10%", left: `${h.left}%`,
                  fontSize: 14, pointerEvents: "none",
                  animation: `heartFloat 0.8s ease-out forwards`,
                  animationDelay: `${h.delay}s`, opacity: 0,
                }}>❤️</span>
              ))}

              <div style={{
                transition: "transform 0.3s ease",
                transform: isHugged
                  ? "scale(1.2)"
                  : isHovered ? "rotate(-3deg)" : "rotate(0deg)",
              }}>
                <NostalImg src={p.img} fallback={p.emoji} size={isHugged ? 72 : 56} />
              </div>
              <div style={{ color: C.text, fontSize: 12, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif", marginTop: 6 }}>
                {p.name}
              </div>
              {isHugged ? (
                <div style={{
                  background: `${p.color}20`, border: `1px solid ${p.color}40`,
                  borderRadius: 8, padding: "6px 10px", marginTop: 8,
                  position: "relative",
                  animation: "popIn 0.3s ease-out",
                }}>
                  {/* Triangle bulle */}
                  <div style={{
                    position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)",
                    width: 0, height: 0,
                    borderLeft: "6px solid transparent", borderRight: "6px solid transparent",
                    borderBottom: `6px solid ${p.color}40`,
                  }} />
                  <div style={{ color: p.color, fontSize: 11, fontWeight: "bold" }}>
                    {p.reaction}
                  </div>
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

      <div style={viewFlavor}>
        Tu les as toujours. Ils sont dans un carton au grenier. Ils t'attendent.
      </div>
    </div>
  );
}
