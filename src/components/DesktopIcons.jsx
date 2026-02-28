import { DESKTOP_ICONS } from "../data/desktopIcons";
import NostalImg from "./NostalImg";

export default function DesktopIcons({ selectedIcon, setSelectedIcon, openWindow }) {
  return (
    <div style={{ position: "absolute", top: 14, left: 14, display: "flex", flexDirection: "column", gap: 6, zIndex: 1 }}>
      {DESKTOP_ICONS.map((icon) => (
        <div
          key={icon.id}
          onClick={(e) => { e.stopPropagation(); setSelectedIcon(icon.id); }}
          onDoubleClick={() => openWindow(icon.id)}
          style={{
            width: 76, padding: "8px 4px", borderRadius: 3, cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            background: selectedIcon === icon.id ? "rgba(80,130,255,0.35)" : "transparent",
            border: selectedIcon === icon.id ? "1px dotted rgba(150,200,255,0.6)" : "1px solid transparent",
            transition: "background 0.1s",
          }}
          onMouseEnter={e => { if (selectedIcon !== icon.id) e.currentTarget.style.background = "rgba(80,130,255,0.15)"; }}
          onMouseLeave={e => { if (selectedIcon !== icon.id) e.currentTarget.style.background = "transparent"; }}
        >
          <div style={{ filter: "drop-shadow(1px 2px 3px rgba(0,0,0,0.5))", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <NostalImg src={icon.img} fallback={icon.emoji} size={34} alt={icon.label} />
          </div>
          <div style={{
            color: "#fff", fontSize: 10, textAlign: "center", lineHeight: 1.3,
            textShadow: "1px 1px 3px #000, -1px -1px 3px #000, 1px -1px 3px #000, -1px 1px 3px #000",
            whiteSpace: "pre-line", fontWeight: 500,
          }}>{icon.label}</div>
        </div>
      ))}
    </div>
  );
}
