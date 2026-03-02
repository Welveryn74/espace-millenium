import { useState, useEffect } from "react";
import NostalImg from "../../NostalImg";
import { CARTABLE_LAYERS } from "../../../data/cartableItems";

export default function CartableExplorer({ onSelectItem, shaking }) {
  const [revealedLayers, setRevealedLayers] = useState(["dessus"]);
  const [hoveredItem, setHoveredItem] = useState(null);

  // Reveal next layer when clicking "deeper"
  const revealNext = () => {
    const allIds = CARTABLE_LAYERS.map(l => l.id);
    const nextIdx = revealedLayers.length;
    if (nextIdx < allIds.length) {
      setRevealedLayers([...revealedLayers, allIds[nextIdx]]);
    }
  };

  // Shaking reveals all layers
  useEffect(() => {
    if (shaking) {
      setRevealedLayers(CARTABLE_LAYERS.map(l => l.id));
    }
  }, [shaking]);

  const allRevealed = revealedLayers.length >= CARTABLE_LAYERS.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {CARTABLE_LAYERS.map((layer, layerIdx) => {
        const isRevealed = revealedLayers.includes(layer.id);
        if (!isRevealed) return null;

        return (
          <div key={layer.id} style={{
            animation: `slideUp 0.4s ease-out ${layerIdx * 0.1}s both`,
          }}>
            {/* Layer header */}
            <div style={{
              display: "flex", alignItems: "center", gap: 6, marginBottom: 6,
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: "50%", fontSize: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: layerIdx === 0 ? "#F4D03F30" : layerIdx === 1 ? "#3498db20" : "#8B735530",
                color: layerIdx === 0 ? "#B8860B" : layerIdx === 1 ? "#2980b9" : "#8B7355",
                fontWeight: "bold", border: `1px solid ${layerIdx === 0 ? "#F4D03F" : layerIdx === 1 ? "#3498db60" : "#8B735580"}`,
              }}>
                {layerIdx + 1}
              </div>
              <span style={{
                fontSize: 11, fontWeight: "bold", color: "#5A3E1B",
                fontFamily: "'Tahoma', sans-serif",
              }}>
                {layer.label}
              </span>
              <span style={{ fontSize: 9, color: "#999", fontStyle: "italic" }}>
                — {layer.hint}
              </span>
            </div>

            {/* Items grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: layer.items.length <= 3 ? "repeat(auto-fit, minmax(140px, 1fr))" : "1fr 1fr",
              gap: 8,
            }}>
              {layer.items.map((item, i) => (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    background: hoveredItem === item.id ? "#FFF5E0" : "#fff",
                    border: hoveredItem === item.id ? "2px solid #E6B800" : "1px solid #E8E0D0",
                    borderRadius: 8, padding: 10, cursor: "pointer",
                    transition: "all 0.2s ease",
                    transform: hoveredItem === item.id ? "translateY(-2px)" : "translateY(0)",
                    boxShadow: hoveredItem === item.id
                      ? "0 4px 12px rgba(200,150,0,0.15)"
                      : "0 1px 3px rgba(0,0,0,0.04)",
                    animation: shaking
                      ? `fallItem 0.5s ease-out ${(layerIdx * 3 + i) * 0.08}s both`
                      : `slideUp 0.3s ease-out ${i * 0.05}s both`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <NostalImg src={item.img} fallback={item.emoji} size={28} />
                    <div>
                      <div style={{ fontSize: 11, fontWeight: "bold", color: "#5A3E1B" }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: 9, color: "#999", marginTop: 1 }}>
                        {interactionHint(item.interaction)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Dig deeper button */}
      {!allRevealed && (
        <button
          onClick={revealNext}
          style={{
            background: "linear-gradient(180deg, #DEB887 0%, #C8A060 100%)",
            border: "2px dashed #8B7355",
            borderRadius: 8, padding: "10px 16px",
            cursor: "pointer", fontSize: 11, fontWeight: "bold",
            color: "#5A3E1B", fontFamily: "'Tahoma', sans-serif",
            animation: "slideUp 0.3s ease-out",
            textAlign: "center",
          }}
        >
          🔍 Fouiller plus profond...
        </button>
      )}

      <style>{`
        @keyframes fallItem {
          0% { transform: translateY(-80px) rotate(${Math.random() > 0.5 ? '' : '-'}${5 + Math.random() * 10}deg); opacity: 0; }
          60% { transform: translateY(5px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(0) rotate(0deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function interactionHint(type) {
  switch (type) {
    case "pages": return "📖 Feuilleter";
    case "zipper": return "🔓 Ouvrir";
    case "timetable": return "📅 Emploi du temps";
    case "protractor": return "📐 Mesurer";
    case "draw": return "🎨 Dessiner";
    case "tracklist": return "🎵 Écouter";
    case "unwrap": return "🎁 Déballer";
    case "nokia": return "📱 Allumer";
    case "jumpscare": return "👻 Ouvrir si tu oses...";
    case "notes": return "📝 Consulter";
    case "classPhoto": return "📸 Zoomer";
    case "troll": return "🌈 Cliquer";
    case "bounce": return "🎾 Jouer";
    default: return "👆 Examiner";
  }
}
