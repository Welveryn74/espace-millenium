import { DESKTOP_ICONS } from "../data/desktopIcons";

export default function StartMenu({ openWindow, onShutdown }) {
  return (
    <div data-startmenu="" style={{
      position: "absolute", bottom: 38, left: 2, width: 280,
      background: "#ECE9D8", border: "2px solid #0055E5",
      borderRadius: "8px 8px 0 0", boxShadow: "4px -4px 20px rgba(0,0,0,0.45)",
      zIndex: 101, overflow: "hidden", animation: "fadeIn 0.15s ease-out",
    }}>
      <div style={{
        background: "linear-gradient(180deg, #2A66D3 0%, #1941A5 100%)",
        padding: "12px 14px", display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: "linear-gradient(135deg, #6CF, #39F)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
          border: "2px solid rgba(255,255,255,0.5)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}>👤</div>
        <div>
          <div style={{ color: "#fff", fontWeight: "bold", fontSize: 13, textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>Utilisateur_2005</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>Connecté</div>
        </div>
      </div>
      <div style={{ padding: "6px 0", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
        {DESKTOP_ICONS.filter(i => i.id !== "poubelle").map(icon => (
          <div key={icon.id} onClick={() => openWindow(icon.id)}
            style={{
              padding: "8px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
              fontSize: 12, color: "#333", transition: "all 0.1s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#316AC5"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#333"; }}
          >
            <span style={{ fontSize: 22, width: 26, textAlign: "center" }}>{icon.emoji}</span>
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
          🔴 Arrêter l'ordinateur...
        </span>
      </div>
    </div>
  );
}
