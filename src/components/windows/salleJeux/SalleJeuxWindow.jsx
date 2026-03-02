import { useState, useEffect } from "react";
import Win from "../../Win";
import { CONSOLES } from "../../../data/consoles";
import { logActivity } from "../../../utils/storage";
import ConsoleShelf from "./ConsoleShelf";
import ConsoleScreen from "./ConsoleScreen";
import SnakeGame from "../minigames/SnakeGame";
import MemoryGame from "../minigames/MemoryGame";
import MorpionGame from "../minigames/MorpionGame";
import TetrisGame from "../minigames/TetrisGame";
import PongGame from "../minigames/PongGame";
import CasseBriquesGame from "../minigames/CasseBriquesGame";
import AdibouGardenGame from "../minigames/AdibouGardenGame";

const MINIGAME_COMPONENTS = {
  snake: SnakeGame,
  memory: MemoryGame,
  morpion: MorpionGame,
  tetris: TetrisGame,
  pong: PongGame,
  cassebriques: CasseBriquesGame,
  adibou: AdibouGardenGame,
};

export default function SalleJeuxWindow({ onClose, onMinimize, zIndex, onFocus }) {
  const [activeConsole, setActiveConsole] = useState(null);
  const [booting, setBooting] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [playingMiniGame, setPlayingMiniGame] = useState(null);

  const current = activeConsole !== null ? CONSOLES[activeConsole] : null;

  const openConsole = (index) => {
    setActiveConsole(index);
    setBooting(true);
    setSelectedGame(null);
    logActivity(`sallejeux_boot_${CONSOLES[index].id}`);
  };

  useEffect(() => {
    if (!booting) return;
    const t = setTimeout(() => setBooting(false), 1200);
    return () => clearTimeout(t);
  }, [booting]);

  const goBack = () => {
    if (playingMiniGame) {
      setPlayingMiniGame(null);
      return;
    }
    setActiveConsole(null);
    setSelectedGame(null);
    setBooting(false);
  };

  const titleColor = current ? current.color : "#444";
  const titleText = current
    ? `Salle de Jeux — ${current.name} (${current.year})`
    : "Salle de Jeux — Choisis ta console !";

  return (
    <Win title={titleText} onClose={onClose} onMinimize={onMinimize} width={660} height={580} zIndex={zIndex} onFocus={onFocus} initialPos={{ x: 200, y: 50 }} color={titleColor}>
      <div style={{ height: "100%", background: "linear-gradient(135deg, #1a1a2e, #16213e)", overflow: "hidden" }}>
        {activeConsole === null ? (
          <ConsoleShelf onSelect={openConsole} />
        ) : booting ? (
          /* ============ BOOT SEQUENCE ============ */
          <div style={{
            height: "100%",
            background: current.screenBg,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
          }}>
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "repeating-linear-gradient(transparent 0px, transparent 1px, rgba(0,0,0,0.12) 1px, rgba(0,0,0,0.12) 3px)",
            }} />
            <div style={{
              color: current.screenText,
              fontSize: 16, fontFamily: "monospace",
              textAlign: "center", whiteSpace: "pre-line",
              textShadow: `0 0 10px ${current.screenText}60`,
              animation: "bootFlicker 1.2s ease-out",
            }}>
              {current.bootText}
            </div>
          </div>
        ) : (
          /* ============ CONSOLE VIEW ============ */
          <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "8px 12px", borderBottom: `1px solid ${current.color}30` }}>
              <button
                onClick={goBack}
                style={{
                  background: "none",
                  border: `1px solid ${current.color}50`,
                  color: current.color,
                  padding: "4px 12px",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: "bold",
                  fontFamily: "'Tahoma', sans-serif",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${current.color}20`; }}
                onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
              >
                {playingMiniGame ? "← Retour aux jeux" : "← Retour"}
              </button>
            </div>

            {playingMiniGame ? (
              <div style={{
                flex: 1, background: current.screenBg,
                position: "relative", display: "flex", justifyContent: "center", paddingTop: 8,
                overflowY: "auto",
              }}>
                <div style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  background: "repeating-linear-gradient(transparent 0px, transparent 1px, rgba(0,0,0,0.1) 1px, rgba(0,0,0,0.1) 3px)",
                }} />
                {(() => {
                  const MiniGameComp = MINIGAME_COMPONENTS[playingMiniGame];
                  return MiniGameComp ? (
                    <MiniGameComp screenBg={current.screenBg} screenText={current.screenText} color={current.color} />
                  ) : null;
                })()}
              </div>
            ) : (
              <ConsoleScreen
                console={current}
                selectedGame={selectedGame}
                setSelectedGame={setSelectedGame}
                onPlayMiniGame={(game) => { setPlayingMiniGame(game); logActivity(`sallejeux_play_${game}`); }}
              />
            )}
          </div>
        )}
      </div>
    </Win>
  );
}
