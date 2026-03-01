import { useState, useEffect, useCallback, useRef } from "react";
import { loadState, saveState } from "../../../utils/storage";
import { playPop, playGameOver } from "../../../utils/uiSounds";

const COLS = 20;
const ROWS = 18;
const TICK = 120;

// Game Boy 4-shade palette
const GB = { bg: "#0F380F", light: "#9BBC0F", mid: "#8BAC0F", dark: "#306230", darkest: "#0F380F" };

function randomFood(snake) {
  let pos;
  do {
    pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  return pos;
}

export default function SnakeGame({ screenBg, screenText, color }) {
  const [phase, setPhase] = useState("START"); // START, PLAYING, GAMEOVER
  const [snake, setSnake] = useState([{ x: 10, y: 9 }]);
  const [food, setFood] = useState({ x: 15, y: 9 });
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => loadState("snake_highscore", 0));
  const dirRef = useRef({ x: 1, y: 0 });
  const snakeRef = useRef([{ x: 10, y: 9 }]);
  const foodRef = useRef({ x: 15, y: 9 });
  const scoreRef = useRef(0);

  const startGame = useCallback(() => {
    const initial = [{ x: 10, y: 9 }];
    setSnake(initial);
    snakeRef.current = initial;
    const f = randomFood(initial);
    setFood(f);
    foodRef.current = f;
    setDir({ x: 1, y: 0 });
    dirRef.current = { x: 1, y: 0 };
    setScore(0);
    scoreRef.current = 0;
    setPhase("PLAYING");
  }, []);

  // Keyboard input
  useEffect(() => {
    const handler = (e) => {
      const d = dirRef.current;
      if (e.key === "ArrowUp" && d.y !== 1) { dirRef.current = { x: 0, y: -1 }; setDir({ x: 0, y: -1 }); }
      else if (e.key === "ArrowDown" && d.y !== -1) { dirRef.current = { x: 0, y: 1 }; setDir({ x: 0, y: 1 }); }
      else if (e.key === "ArrowLeft" && d.x !== 1) { dirRef.current = { x: -1, y: 0 }; setDir({ x: -1, y: 0 }); }
      else if (e.key === "ArrowRight" && d.x !== -1) { dirRef.current = { x: 1, y: 0 }; setDir({ x: 1, y: 0 }); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Game loop
  useEffect(() => {
    if (phase !== "PLAYING") return;
    const iv = setInterval(() => {
      const s = snakeRef.current;
      const d = dirRef.current;
      const head = { x: s[0].x + d.x, y: s[0].y + d.y };

      // Wall collision
      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
        const sc = scoreRef.current;
        if (sc > loadState("snake_highscore", 0)) {
          saveState("snake_highscore", sc);
          setHighScore(sc);
        }
        playGameOver();
        setPhase("GAMEOVER");
        return;
      }
      // Self collision
      if (s.some(seg => seg.x === head.x && seg.y === head.y)) {
        const sc = scoreRef.current;
        if (sc > loadState("snake_highscore", 0)) {
          saveState("snake_highscore", sc);
          setHighScore(sc);
        }
        playGameOver();
        setPhase("GAMEOVER");
        return;
      }

      const newSnake = [head, ...s];
      // Eat food?
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        playPop();
        scoreRef.current += 10;
        setScore(scoreRef.current);
        const f = randomFood(newSnake);
        foodRef.current = f;
        setFood(f);
      } else {
        newSnake.pop();
      }
      snakeRef.current = newSnake;
      setSnake([...newSnake]);
    }, TICK);
    return () => clearInterval(iv);
  }, [phase]);

  const cellSize = Math.min(14, Math.floor(260 / COLS));

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%" }}>
      {/* Score bar */}
      <div style={{ display: "flex", justifyContent: "space-between", width: cellSize * COLS, fontSize: 10, fontFamily: "monospace" }}>
        <span style={{ color: GB.light }}>SCORE: {score}</span>
        <span style={{ color: GB.dark }}>HI: {highScore}</span>
      </div>

      {/* Game grid */}
      <div style={{
        width: cellSize * COLS, height: cellSize * ROWS,
        background: GB.bg, border: `2px solid ${GB.dark}`,
        position: "relative", borderRadius: 2,
        imageRendering: "pixelated",
      }}>
        {/* Scanlines */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "repeating-linear-gradient(transparent 0px, transparent 1px, rgba(0,0,0,0.12) 1px, rgba(0,0,0,0.12) 3px)",
        }} />

        {phase === "START" && (
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", zIndex: 2,
          }}>
            <div style={{ color: GB.light, fontSize: 18, fontFamily: "monospace", fontWeight: "bold", marginBottom: 8 }}>SNAKE</div>
            <div style={{ color: GB.mid, fontSize: 10, fontFamily: "monospace", marginBottom: 4 }}>Flèches pour diriger</div>
            <button onClick={startGame} style={{
              background: GB.dark, color: GB.light, border: `1px solid ${GB.mid}`,
              padding: "6px 16px", borderRadius: 3, cursor: "pointer", fontFamily: "monospace",
              fontSize: 12, marginTop: 8,
            }}>START</button>
          </div>
        )}

        {phase === "GAMEOVER" && (
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", zIndex: 2,
            background: "rgba(15,56,15,0.85)",
          }}>
            <div style={{ color: GB.light, fontSize: 16, fontFamily: "monospace", fontWeight: "bold", marginBottom: 4 }}>GAME OVER</div>
            <div style={{ color: GB.mid, fontSize: 11, fontFamily: "monospace", marginBottom: 8 }}>Score : {score}</div>
            <button onClick={startGame} style={{
              background: GB.dark, color: GB.light, border: `1px solid ${GB.mid}`,
              padding: "6px 16px", borderRadius: 3, cursor: "pointer", fontFamily: "monospace", fontSize: 12,
            }}>REJOUER</button>
          </div>
        )}

        {/* Food */}
        <div style={{
          position: "absolute",
          left: food.x * cellSize, top: food.y * cellSize,
          width: cellSize - 1, height: cellSize - 1,
          background: GB.light, borderRadius: "50%",
        }} />

        {/* Snake */}
        {snake.map((seg, i) => (
          <div key={i} style={{
            position: "absolute",
            left: seg.x * cellSize, top: seg.y * cellSize,
            width: cellSize - 1, height: cellSize - 1,
            background: i === 0 ? GB.light : GB.mid,
            borderRadius: i === 0 ? 2 : 1,
          }} />
        ))}
      </div>

      {/* D-pad hint */}
      <div style={{ color: GB.dark, fontSize: 9, fontFamily: "monospace", textAlign: "center" }}>
        ← ↑ ↓ → pour se déplacer
      </div>
    </div>
  );
}
