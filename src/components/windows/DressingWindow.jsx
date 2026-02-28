import { useState } from "react";
import Win from "../Win";
import NostalImg from "../NostalImg";
import { Y2K_ITEMS, MCBLING_ITEMS } from "../../data/dressingItems";

export default function DressingWindow({ onClose, onMinimize, zIndex, onFocus }) {
  const [era, setEra] = useState("y2k");
  const [selected, setSelected] = useState(null);

  const items = era === "y2k" ? Y2K_ITEMS : MCBLING_ITEMS;
  const accent = era === "y2k" ? "#0CF" : "#F8C";
  const bgGrad = era === "y2k"
    ? "linear-gradient(135deg, #001833 0%, #003366 50%, #001a33 100%)"
    : "linear-gradient(135deg, #330022 0%, #660044 50%, #330022 100%)";

  return (
    <Win title="Le Dressing Temporel — Mode des années 2000" onClose={onClose} onMinimize={onMinimize} width={640} height={540} zIndex={zIndex} onFocus={onFocus} initialPos={{ x: 140, y: 35 }} color={era === "y2k" ? "#0088CC" : "#CC0088"}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex" }}>
          {[
            { key: "y2k", label: "🔮 Y2K (1999-2002)", active: "#C0E8FF", activeBg: "linear-gradient(180deg, #C0E8FF 0%, #80C8FF 100%)" },
            { key: "mcbling", label: "💎 McBling (2003-2008)", active: "#FFD0E8", activeBg: "linear-gradient(180deg, #FFD0E8 0%, #FF80C0 100%)" },
          ].map(tab => (
            <button key={tab.key} onClick={() => { setEra(tab.key); setSelected(null); }} style={{
              flex: 1, padding: 12, border: "none", cursor: "pointer", fontWeight: "bold", fontSize: 13,
              background: era === tab.key ? tab.activeBg : "#E8E8E8",
              color: era === tab.key ? "#222" : "#888", fontFamily: "'Tahoma', sans-serif",
              borderBottom: era === tab.key ? `3px solid ${accent}` : "3px solid transparent",
              transition: "all 0.2s",
            }}>{tab.label}</button>
          ))}
        </div>

        <div style={{ flex: 1, padding: 18, background: bgGrad, overflowY: "auto", transition: "background 0.5s" }}>
          <h3 style={{ color: accent, fontSize: 15, marginBottom: 14, textShadow: `0 0 12px ${accent}40`, fontFamily: "'Tahoma', sans-serif" }}>
            ✦ {era === "y2k" ? "Esthétique Futuriste Y2K" : "Esthétique McBling / Bling-Bling"} ✦
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {items.map((item, i) => {
              const isSelected = selected === i;
              return (
                <div key={i}
                  onClick={() => setSelected(isSelected ? null : i)}
                  style={{
                    background: isSelected ? `${accent}25` : `${accent}10`,
                    border: isSelected ? `2px solid ${accent}70` : `1px solid ${accent}30`,
                    borderRadius: 8, padding: 12, cursor: "pointer",
                    transition: "all 0.2s", animation: `slideUp 0.3s ease-out ${i * 0.05}s both`,
                    gridColumn: isSelected ? "1 / -1" : "auto",
                  }}
                  onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.background = `${accent}20`; e.currentTarget.style.transform = "translateY(-2px)"; } }}
                  onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.background = `${accent}10`; e.currentTarget.style.transform = "translateY(0)"; } }}
                >
                  <div style={{ marginBottom: 6, display: "flex", alignItems: "center" }}>
                    <NostalImg src={item.img} fallback={item.emoji} size={38} />
                  </div>
                  <div style={{ color: accent, fontSize: 12, fontWeight: "bold", marginBottom: 2 }}>{item.name}</div>
                  {isSelected ? (
                    <div style={{ display: "flex", gap: 12, marginTop: 8, paddingTop: 8, borderTop: `1px solid ${accent}30`, animation: "fadeIn 0.2s ease-out" }}>
                      <NostalImg src={item.img} fallback={item.emoji} size={140} style={{ borderRadius: 6, flexShrink: 0 }} />
                      <div style={{ color: `${accent}DD`, fontSize: 11, lineHeight: 1.6 }}>{item.desc}</div>
                    </div>
                  ) : (
                    <div style={{ color: `${accent}BB`, fontSize: 10, lineHeight: 1.5 }}>{item.desc}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Win>
  );
}
