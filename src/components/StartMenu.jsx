import { DESKTOP_ICONS } from "../data/desktopIcons";
import NostalImg from "./NostalImg";
import { playClick, playMenuHover } from "../utils/uiSounds";
import { getUsername } from "../utils/storage";

export default function StartMenu({ openWindow, onShutdown }) {
  return (
    <div data-startmenu="" style={{
      position: "absolute", bottom: 44, left: 2, width: 340,
      background: "#ECE9D8", border: "2px solid #0055E5",
      borderRadius: "8px 8px 0 0", boxShadow: "4px -4px 20px rgba(0,0,0,0.45)",
      zIndex: 101, overflow: "hidden", animation: "menuSlideUp 0.2s ease-out",
    }}>
      <div style={{
        background: "linear-gradient(180deg, #2A66D3 0%, #1941A5 100%)",
        padding: "12px 14px", display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: "linear-gradient(135deg, #6CF, #39F)",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "2px solid rgba(255,255,255,0.5)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)", overflow: "hidden",
        }}>
          <NostalImg src="/images/ui/user.svg" fallback="👤" size={24} />
        </div>
        <div>
          <div style={{ color: "#fff", fontWeight: "bold", fontSize: 15, textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>{getUsername()}</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>Connecté</div>
        </div>
      </div>
      <div style={{ padding: "6px 0", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
        {DESKTOP_ICONS.filter(i => i.id !== "poubelle").map(icon => (
          <div key={icon.id} onClick={() => { playClick(); openWindow(icon.id); }}
            style={{
              padding: "10px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
              fontSize: 13, color: "#333", transition: "all 0.1s",
            }}
            onMouseEnter={e => { playMenuHover(); e.currentTarget.style.background = "#316AC5"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#333"; }}
          >
            <NostalImg src={icon.img} fallback={icon.emoji} size={26} style={{ width: 30, textAlign: "center" }} />
            <span style={{ fontFamily: "'Tahoma', sans-serif" }}>{icon.label.replace("\n", " ")}</span>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "2px solid #ccc", padding: "8px 18px", display: "flex", justifyContent: "flex-end", background: "#D6D2C2" }}>
        <span style={{ fontSize: 11, color: "#333", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
          onClick={onShutdown}
          onMouseEnter={e => e.currentTarget.style.fontWeight = "bold"}
          onMouseLeave={e => e.currentTarget.style.fontWeight = "normal"}
        >
          <NostalImg src="/images/ui/shutdown.svg" fallback="🔴" size={12} /> Arrêter l'ordinateur...
        </span>
      </div>
    </div>
  );
}
