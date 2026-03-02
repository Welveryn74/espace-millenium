import NostalImg from "../../NostalImg";
import GameDetail from "./GameDetail";

export default function ConsoleScreen({ console: c, selectedGame, setSelectedGame, onPlayMiniGame }) {
  return (
    <div style={{
      flex: 1, background: c.screenBg, padding: 16,
      overflowY: "auto", position: "relative",
    }}>
      {/* Scanlines overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "repeating-linear-gradient(transparent 0px, transparent 1px, rgba(0,0,0,0.1) 1px, rgba(0,0,0,0.1) 3px)",
      }} />

      {/* Console header */}
      <div style={{ textAlign: "center", marginBottom: 16, animation: "fadeIn 0.4s ease-out" }}>
        <NostalImg src={c.img} fallback={c.emoji} size={32} />
        <div style={{
          color: c.screenText, fontSize: 16, fontWeight: "bold",
          fontFamily: "'Tahoma', sans-serif",
          textShadow: `0 0 10px ${c.screenText}40`,
          marginTop: 4,
        }}>
          {c.name}
        </div>
        <div style={{ color: `${c.screenText}99`, fontSize: 10, marginTop: 2, fontStyle: "italic" }}>
          {c.description}
        </div>
      </div>

      {/* Game list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, position: "relative" }}>
        {c.games.map((game, i) => (
          <GameDetail
            key={i}
            game={game}
            index={i}
            isOpen={selectedGame === i}
            onToggle={() => setSelectedGame(selectedGame === i ? null : i)}
            screenText={c.screenText}
            color={c.color}
            onPlay={game.playable ? () => onPlayMiniGame(game.miniGame) : null}
          />
        ))}
      </div>
    </div>
  );
}
