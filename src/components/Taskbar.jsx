import { DESKTOP_ICONS } from "../data/desktopIcons";
import NostalImg from "./NostalImg";
import { playClick } from "../utils/uiSounds";

export default function Taskbar({ startMenu, setStartMenu, openWindowIds, isTopWindow, isMinimized, toggleMinimize, bringToFront, time, muted, toggleMute }) {
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0, height: 42,
      background: "linear-gradient(180deg, #3168D5 0%, #1941A5 40%, #1D4BC5 60%, #245BDB 100%)",
      borderTop: "2px solid #5B9BFF", display: "flex", alignItems: "center",
      padding: "0 3px", zIndex: 100,
    }}>
      {/* Start button */}
      <button
        data-startbtn=""
        onClick={(e) => { e.stopPropagation(); playClick(); setStartMenu(!startMenu); }}
        style={{
          height: 34, padding: "0 14px", display: "flex", alignItems: "center", gap: 5,
          background: startMenu
            ? "linear-gradient(180deg, #2A6F2A 0%, #1A4F1A 100%)"
            : "linear-gradient(180deg, #3C9F3C 0%, #2A7F2A 50%, #1A5F1A 100%)",
          border: "1px solid #1A5F1A", borderRadius: "0 8px 8px 0", cursor: "pointer",
          color: "#fff", fontWeight: "bold", fontSize: 13, fontFamily: "'Tahoma', sans-serif",
          textShadow: "1px 1px 1px rgba(0,0,0,0.5)",
          boxShadow: startMenu ? "inset 1px 1px 3px rgba(0,0,0,0.3)" : "inset 0 1px 0 rgba(255,255,255,0.4), 1px 1px 3px rgba(0,0,0,0.2)",
          letterSpacing: 0.5,
        }}
      >
        <NostalImg src="/images/ui/start.png" fallback="🪟" size={20} /> démarrer
      </button>

      {/* Separator */}
      <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.15)", margin: "0 4px" }} />

      {/* Open window tabs */}
      <div style={{ flex: 1, display: "flex", gap: 2, overflow: "hidden" }}>
        {openWindowIds.map((id) => {
          const icon = DESKTOP_ICONS.find(i => i.id === id);
          const minimizedState = isMinimized(id);
          const isTop = !minimizedState && isTopWindow(id);
          const handleTabClick = () => {
            if (minimizedState) {
              toggleMinimize(id);
            } else if (isTop) {
              toggleMinimize(id);
            } else {
              bringToFront(id);
            }
          };
          return icon ? (
            <button key={id} onClick={() => { playClick(); handleTabClick(); }} style={{
              height: 30, padding: "0 10px", maxWidth: 160,
              background: isTop ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)",
              border: isTop ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.1)",
              borderRadius: 3, color: "#fff", fontSize: 12, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 4, overflow: "hidden",
              textOverflow: "ellipsis", whiteSpace: "nowrap", flexShrink: 1,
              opacity: minimizedState ? 0.6 : 1,
            }}>
              <NostalImg src={icon.img} fallback={icon.emoji} size={16} style={{ flexShrink: 0 }} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{icon.label.split("\n")[0]}</span>
            </button>
          ) : null;
        })}
      </div>

      {/* System tray */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6, padding: "0 10px", height: 28,
        background: "linear-gradient(180deg, rgba(0,40,120,0.4) 0%, rgba(0,20,80,0.4) 100%)",
        borderLeft: "1px solid rgba(255,255,255,0.12)", borderRadius: 2,
      }}>
        <span style={{ cursor: "pointer", display: "flex", alignItems: "center" }} title={muted ? "Son coupé" : "Volume"} onClick={toggleMute}>
          <NostalImg src={muted ? "/images/ui/volume-mute.png" : "/images/ui/volume.png"} fallback={muted ? "🔇" : "🔊"} size={15} />
        </span>
        <span style={{ cursor: "pointer", display: "flex", alignItems: "center" }} title="Réseau">
          <NostalImg src="/images/ui/network.png" fallback="🌐" size={15} />
        </span>
        <span style={{ cursor: "pointer", display: "flex", alignItems: "center" }} title="MSN">
          <NostalImg src="/images/ui/chat.png" fallback="💬" size={15} />
        </span>
        <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.1)" }} />
        <span style={{ color: "#fff", fontSize: 12, fontFamily: "'Tahoma', sans-serif", fontWeight: 500, letterSpacing: 0.3 }}>
          {time.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}
