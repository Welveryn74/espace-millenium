import { useState } from "react";
import NostalImg from "../../NostalImg";
import { CONSOLES } from "../../../data/consoles";

export default function ConsoleShelf({ onSelect }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div style={{ padding: 16, overflowY: "auto", height: "100%", position: "relative" }}>
      {/* Floating pixel particles */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: 2, height: 2, borderRadius: "50%",
            background: `hsl(${i * 30}, 60%, 70%)`,
            opacity: 0.3,
            left: `${5 + (i * 8) % 90}%`,
            animation: `particleFloat ${4 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }} />
        ))}
      </div>

      <div style={{ textAlign: "center", marginBottom: 16, position: "relative" }}>
        <NostalImg src="/images/desktop/sallejeux.png" fallback="🕹️" size={42} />
        <div style={{ fontSize: 15, fontWeight: "bold", color: "#E0E0E0", marginTop: 4, fontFamily: "'Tahoma', sans-serif" }}>
          Choisis ta console !
        </div>
        <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
          Replonge dans tes souvenirs d'enfance
        </div>
      </div>

      {/* 3D-perspective shelf */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10,
        perspective: 800, position: "relative",
      }}>
        {CONSOLES.map((console, i) => (
          <div
            key={console.id}
            onClick={() => onSelect(i)}
            onMouseEnter={() => setHoveredCard(i)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              background: hoveredCard === i ? `${console.color}20` : "rgba(255,255,255,0.05)",
              border: hoveredCard === i ? `1px solid ${console.color}60` : "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              padding: 14,
              cursor: "pointer",
              transition: "all 0.25s ease",
              animation: `slideUp 0.3s ease-out ${i * 0.05}s both`,
              boxShadow: hoveredCard === i
                ? `0 0 20px ${console.color}30, inset 0 0 20px ${console.color}08`
                : "none",
              transform: hoveredCard === i
                ? "translateY(-3px) rotateX(2deg)"
                : "translateY(0) rotateX(0deg)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                transition: "all 0.3s ease",
                transform: hoveredCard === i ? "scale(1.1)" : "scale(1)",
                filter: hoveredCard === i ? `drop-shadow(0 0 6px ${console.color})` : "none",
              }}>
                <NostalImg src={console.img} fallback={console.emoji} size={36} />
              </div>
              <div>
                <div style={{ color: "#E0E0E0", fontSize: 13, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif" }}>
                  {console.name}
                </div>
                <div style={{ color: "#888", fontSize: 10, marginTop: 2 }}>{console.year}</div>
              </div>
            </div>
            <div style={{ color: "#777", fontSize: 10, marginTop: 8, lineHeight: 1.5 }}>
              {console.description}
            </div>
            {/* Game count badge */}
            <div style={{
              marginTop: 6, fontSize: 9, color: console.color, fontWeight: "bold",
              display: "flex", alignItems: "center", gap: 4,
            }}>
              <span style={{
                display: "inline-block", padding: "1px 6px", borderRadius: 3,
                background: `${console.color}20`,
              }}>
                {console.games.length} jeux
              </span>
              {console.games.some(g => g.playable) && (
                <span style={{
                  padding: "1px 6px", borderRadius: 3,
                  background: "rgba(76,175,80,0.2)", color: "#4CAF50",
                }}>
                  JOUABLE
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes particleFloat {
          0%, 100% { transform: translateY(100vh); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-20px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
