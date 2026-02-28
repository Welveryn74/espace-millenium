import { DESKTOP_ICONS } from "../data/desktopIcons";
import NostalImg from "./NostalImg";
import { playIconSelect } from "../utils/uiSounds";

export default function DesktopIcons({ selectedIcon, setSelectedIcon, openWindow, konamiActive }) {
  return (
    <div style={{ position: "absolute", top: 18, left: 18, display: "flex", flexDirection: "column", gap: 10, zIndex: 1 }}>
      {DESKTOP_ICONS.map((icon) => (
        <div
          key={icon.id}
          onClick={(e) => { e.stopPropagation(); playIconSelect(); setSelectedIcon(icon.id); }}
          onDoubleClick={() => openWindow(icon.id)}
          style={{
            width: 90, padding: "10px 6px", borderRadius: 3, cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            background: selectedIcon === icon.id ? "rgba(80,130,255,0.35)" : "transparent",
            border: selectedIcon === icon.id ? "1px dotted rgba(150,200,255,0.6)" : "1px solid transparent",
            transition: "background 0.1s",
          }}
          onMouseEnter={e => { if (selectedIcon !== icon.id) e.currentTarget.style.background = "rgba(80,130,255,0.15)"; }}
          onMouseLeave={e => { if (selectedIcon !== icon.id) e.currentTarget.style.background = "transparent"; }}
        >
          <div style={{
            filter: "drop-shadow(1px 2px 3px rgba(0,0,0,0.5))",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: konamiActive ? "konamiSpin 0.5s linear infinite" : "none",
          }}>
            <NostalImg src={icon.img} fallback={icon.emoji} size={52} alt={icon.label} />
          </div>
          <div style={{
            color: "#fff", fontSize: 12, textAlign: "center", lineHeight: 1.3,
            textShadow: "1px 1px 3px #000, -1px -1px 3px #000, 1px -1px 3px #000, -1px 1px 3px #000",
            whiteSpace: "pre-line", fontWeight: 500,
          }}>{icon.label}</div>
        </div>
      ))}
    </div>
  );
}
