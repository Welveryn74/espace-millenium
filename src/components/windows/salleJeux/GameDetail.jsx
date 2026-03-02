import NostalImg from "../../NostalImg";

export default function GameDetail({ game, index, isOpen, onToggle, screenText, color, onPlay }) {
  return (
    <div
      onClick={onToggle}
      style={{
        background: isOpen ? `${screenText}15` : `${screenText}08`,
        border: isOpen ? `1px solid ${screenText}40` : `1px solid ${screenText}18`,
        borderRadius: 6, padding: 10, cursor: "pointer",
        transition: "all 0.2s",
        animation: `slideUp 0.3s ease-out ${index * 0.06}s both`,
      }}
      onMouseEnter={e => {
        if (!isOpen) e.currentTarget.style.background = `${screenText}12`;
      }}
      onMouseLeave={e => {
        if (!isOpen) e.currentTarget.style.background = `${screenText}08`;
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <NostalImg src={game.img} fallback={game.emoji} size={32} />
        <div style={{ flex: 1 }}>
          <span style={{
            color: screenText, fontSize: 12, fontWeight: "bold",
            fontFamily: "'Tahoma', sans-serif",
          }}>
            {game.name}
          </span>
          <span style={{ color: `${screenText}60`, fontSize: 10, marginLeft: 6 }}>
            ({game.year})
          </span>
          {game.playable && (
            <span style={{
              marginLeft: 6, fontSize: 8, padding: "1px 4px", borderRadius: 3,
              background: "rgba(76,175,80,0.2)", color: "#4CAF50",
            }}>JOUABLE</span>
          )}
        </div>
        <span style={{ color: `${screenText}60`, fontSize: 10 }}>
          {isOpen ? "▼" : "▶"}
        </span>
      </div>

      {isOpen && (
        <div style={{
          marginTop: 8, paddingTop: 8,
          borderTop: `1px solid ${screenText}20`,
          animation: "slideUp 0.2s ease-out",
        }}>
          <div style={{ display: "flex", gap: 12 }}>
            <NostalImg src={game.img} fallback={game.emoji} size={140} style={{ borderRadius: 6, flexShrink: 0 }} />
            <div style={{
              color: `${screenText}CC`, fontSize: 11,
              lineHeight: 1.7, fontStyle: "italic",
            }}>
              {game.desc}
            </div>
          </div>
          {onPlay && (
            <button
              onClick={(e) => { e.stopPropagation(); onPlay(); }}
              style={{
                marginTop: 8, width: "100%",
                background: `${color}30`, color: screenText,
                border: `1px solid ${color}60`, padding: "6px 0",
                borderRadius: 4, cursor: "pointer", fontFamily: "'Tahoma', sans-serif",
                fontSize: 12, fontWeight: "bold", transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${color}50`; }}
              onMouseLeave={e => { e.currentTarget.style.background = `${color}30`; }}
            >
              ▶ Jouer !
            </button>
          )}
        </div>
      )}
    </div>
  );
}
