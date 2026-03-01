import { useState, useEffect, useCallback, useRef } from "react";
import { loadState, saveState } from "../../../utils/storage";
import { playPieceLock, playLineClear, playGameOver } from "../../../utils/uiSounds";

const COLS = 10;
const ROWS = 20;
const CELL = 14;
const BASE_TICK = 500;

// Game Boy 4-shade palette
const GB = { bg: "#0F380F", light: "#9BBC0F", mid: "#8BAC0F", dark: "#306230", darkest: "#0F380F" };

const PIECES = [
  { shape: [[1,1,1,1]], color: GB.light },          // I
  { shape: [[1,1],[1,1]], color: GB.mid },           // O
  { shape: [[0,1,0],[1,1,1]], color: GB.light },     // T
  { shape: [[0,1,1],[1,1,0]], color: GB.mid },       // S
  { shape: [[1,1,0],[0,1,1]], color: GB.light },     // Z
  { shape: [[1,0,0],[1,1,1]], color: GB.mid },       // J
  { shape: [[0,0,1],[1,1,1]], color: GB.light },     // L
];

function randomPiece() {
  return PIECES[Math.floor(Math.random() * PIECES.length)];
}

function rotate(shape) {
  const rows = shape.length, cols = shape[0].length;
  const r = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++)
      r[x][rows - 1 - y] = shape[y][x];
  return r;
}

function collides(board, shape, px, py) {
  for (let y = 0; y < shape.length; y++)
    for (let x = 0; x < shape[y].length; x++)
      if (shape[y][x]) {
        const nx = px + x, ny = py + y;
        if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
        if (ny >= 0 && board[ny][nx]) return true;
      }
  return false;
}

function merge(board, shape, px, py, color) {
  const b = board.map(r => [...r]);
  for (let y = 0; y < shape.length; y++)
    for (let x = 0; x < shape[y].length; x++)
      if (shape[y][x] && py + y >= 0) b[py + y][px + x] = color;
  return b;
}

function clearLines(board) {
  const kept = board.filter(r => r.some(c => !c));
  const cleared = ROWS - kept.length;
  const empty = Array.from({ length: cleared }, () => Array(COLS).fill(0));
  return { board: [...empty, ...kept], cleared };
}

const SCORE_TABLE = [0, 100, 300, 500, 800];

export default function TetrisGame({ screenBg, screenText, color }) {
  const [phase, setPhase] = useState("START");
  const [board, setBoard] = useState(() => Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
  const [current, setCurrent] = useState(null);
  const [pos, setPos] = useState({ x: 3, y: -2 });
  const [next, setNext] = useState(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [highScore, setHighScore] = useState(() => loadState("tetris_highscore", 0));

  const boardRef = useRef(board);
  const currentRef = useRef(current);
  const posRef = useRef(pos);
  const scoreRef = useRef(0);
  const linesRef = useRef(0);
  const nextRef = useRef(next);
  const phaseRef = useRef(phase);

  boardRef.current = board;
  currentRef.current = current;
  posRef.current = pos;
  phaseRef.current = phase;

  const level = Math.floor(linesRef.current / 10);
  const tick = Math.max(80, BASE_TICK - level * 40);

  const spawnPiece = useCallback(() => {
    const piece = nextRef.current || randomPiece();
    const nx = randomPiece();
    nextRef.current = nx;
    setNext(nx);
    const startX = Math.floor((COLS - piece.shape[0].length) / 2);
    const startY = -piece.shape.length;
    if (collides(boardRef.current, piece.shape, startX, 0)) {
      // Game over
      const sc = scoreRef.current;
      if (sc > loadState("tetris_highscore", 0)) {
        saveState("tetris_highscore", sc);
        setHighScore(sc);
      }
      playGameOver();
      setPhase("GAMEOVER");
      phaseRef.current = "GAMEOVER";
      return;
    }
    setCurrent(piece);
    currentRef.current = piece;
    setPos({ x: startX, y: startY });
    posRef.current = { x: startX, y: startY };
  }, []);

  const lockPiece = useCallback(() => {
    const c = currentRef.current;
    const p = posRef.current;
    if (!c) return;
    playPieceLock();
    const merged = merge(boardRef.current, c.shape, p.x, p.y, c.color);
    const { board: newBoard, cleared } = clearLines(merged);
    boardRef.current = newBoard;
    setBoard(newBoard);
    if (cleared > 0) {
      playLineClear();
      scoreRef.current += SCORE_TABLE[cleared] || 0;
      linesRef.current += cleared;
      setScore(scoreRef.current);
      setLines(linesRef.current);
    }
    spawnPiece();
  }, [spawnPiece]);

  const moveDown = useCallback(() => {
    const c = currentRef.current;
    const p = posRef.current;
    if (!c) return;
    if (!collides(boardRef.current, c.shape, p.x, p.y + 1)) {
      posRef.current = { x: p.x, y: p.y + 1 };
      setPos(posRef.current);
    } else {
      lockPiece();
    }
  }, [lockPiece]);

  const startGame = useCallback(() => {
    const b = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    boardRef.current = b;
    setBoard(b);
    scoreRef.current = 0;
    linesRef.current = 0;
    setScore(0);
    setLines(0);
    nextRef.current = randomPiece();
    setNext(nextRef.current);
    setPhase("PLAYING");
    phaseRef.current = "PLAYING";
    spawnPiece();
  }, [spawnPiece]);

  // Keyboard
  useEffect(() => {
    const handler = (e) => {
      if (phaseRef.current !== "PLAYING") return;
      const c = currentRef.current;
      const p = posRef.current;
      if (!c) return;

      if (e.key === "ArrowLeft") {
        if (!collides(boardRef.current, c.shape, p.x - 1, p.y)) {
          posRef.current = { ...p, x: p.x - 1 };
          setPos(posRef.current);
        }
      } else if (e.key === "ArrowRight") {
        if (!collides(boardRef.current, c.shape, p.x + 1, p.y)) {
          posRef.current = { ...p, x: p.x + 1 };
          setPos(posRef.current);
        }
      } else if (e.key === "ArrowDown") {
        moveDown();
      } else if (e.key === "ArrowUp") {
        const rotated = rotate(c.shape);
        if (!collides(boardRef.current, rotated, p.x, p.y)) {
          const newC = { ...c, shape: rotated };
          currentRef.current = newC;
          setCurrent(newC);
        }
      } else if (e.key === " ") {
        // Hard drop
        let ny = p.y;
        while (!collides(boardRef.current, c.shape, p.x, ny + 1)) ny++;
        posRef.current = { x: p.x, y: ny };
        setPos(posRef.current);
        lockPiece();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [moveDown, lockPiece]);

  // Game loop
  useEffect(() => {
    if (phase !== "PLAYING") return;
    const iv = setInterval(() => {
      if (phaseRef.current === "PLAYING") moveDown();
    }, tick);
    return () => clearInterval(iv);
  }, [phase, tick, moveDown]);

  // Render merged board for display
  const displayBoard = board.map(r => [...r]);
  if (current) {
    for (let y = 0; y < current.shape.length; y++)
      for (let x = 0; x < current.shape[y].length; x++)
        if (current.shape[y][x]) {
          const dy = pos.y + y, dx = pos.x + x;
          if (dy >= 0 && dy < ROWS && dx >= 0 && dx < COLS) displayBoard[dy][dx] = current.color;
        }
  }

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        {/* Score */}
        <div style={{ display: "flex", justifyContent: "space-between", width: CELL * COLS, fontSize: 10, fontFamily: "monospace" }}>
          <span style={{ color: GB.light }}>SCORE: {score}</span>
          <span style={{ color: GB.dark }}>HI: {highScore}</span>
        </div>

        {/* Grid */}
        <div style={{
          width: CELL * COLS, height: CELL * ROWS,
          background: GB.bg, border: `2px solid ${GB.dark}`,
          position: "relative", borderRadius: 2, imageRendering: "pixelated",
        }}>
          {/* Scanlines */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "repeating-linear-gradient(transparent 0px, transparent 1px, rgba(0,0,0,0.12) 1px, rgba(0,0,0,0.12) 3px)" }} />

          {phase === "START" && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
              <div style={{ color: GB.light, fontSize: 18, fontFamily: "monospace", fontWeight: "bold", marginBottom: 4 }}>TETRIS</div>
              <div style={{ color: GB.mid, fontSize: 9, fontFamily: "monospace", marginBottom: 2 }}>← → déplacer</div>
              <div style={{ color: GB.mid, fontSize: 9, fontFamily: "monospace", marginBottom: 2 }}>↑ tourner</div>
              <div style={{ color: GB.mid, fontSize: 9, fontFamily: "monospace", marginBottom: 2 }}>↓ descente douce</div>
              <div style={{ color: GB.mid, fontSize: 9, fontFamily: "monospace", marginBottom: 6 }}>Espace = hard drop</div>
              <button onClick={startGame} style={{
                background: GB.dark, color: GB.light, border: `1px solid ${GB.mid}`,
                padding: "6px 16px", borderRadius: 3, cursor: "pointer", fontFamily: "monospace", fontSize: 12,
              }}>START</button>
            </div>
          )}

          {phase === "GAMEOVER" && (
            <div style={{
              position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", zIndex: 2,
              background: "rgba(15,56,15,0.88)",
            }}>
              <div style={{ color: GB.light, fontSize: 16, fontFamily: "monospace", fontWeight: "bold", marginBottom: 4 }}>GAME OVER</div>
              <div style={{ color: GB.mid, fontSize: 11, fontFamily: "monospace" }}>Score: {score}</div>
              <div style={{ color: GB.mid, fontSize: 10, fontFamily: "monospace", marginBottom: 8 }}>Lignes: {lines}</div>
              <button onClick={startGame} style={{
                background: GB.dark, color: GB.light, border: `1px solid ${GB.mid}`,
                padding: "6px 16px", borderRadius: 3, cursor: "pointer", fontFamily: "monospace", fontSize: 12,
              }}>REJOUER</button>
            </div>
          )}

          {/* Cells */}
          {displayBoard.map((row, y) =>
            row.map((cell, x) =>
              cell ? (
                <div key={`${y}-${x}`} style={{
                  position: "absolute",
                  left: x * CELL, top: y * CELL,
                  width: CELL - 1, height: CELL - 1,
                  background: cell,
                  borderRadius: 1,
                  boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.15)",
                }} />
              ) : null
            )
          )}
        </div>

        {/* Lines + level */}
        <div style={{ display: "flex", justifyContent: "space-between", width: CELL * COLS, fontSize: 9, fontFamily: "monospace" }}>
          <span style={{ color: GB.dark }}>LIGNES: {lines}</span>
          <span style={{ color: GB.dark }}>LVL: {level}</span>
        </div>
      </div>

      {/* Side panel — next piece */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <div style={{ color: GB.dark, fontSize: 9, fontFamily: "monospace" }}>NEXT</div>
        <div style={{
          width: CELL * 4 + 4, height: CELL * 4 + 4,
          background: GB.bg, border: `1px solid ${GB.dark}`,
          borderRadius: 2, position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {next && next.shape.map((row, y) =>
            row.map((cell, x) =>
              cell ? (
                <div key={`n${y}-${x}`} style={{
                  position: "absolute",
                  left: 2 + x * CELL + (4 - next.shape[0].length) * CELL / 2,
                  top: 2 + y * CELL + (4 - next.shape.length) * CELL / 2,
                  width: CELL - 1, height: CELL - 1,
                  background: next.color, borderRadius: 1,
                }} />
              ) : null
            )
          )}
        </div>
        <div style={{ color: GB.dark, fontSize: 8, fontFamily: "monospace", textAlign: "center", marginTop: 8 }}>
          ← → ↑ ↓<br/>ESPACE
        </div>
      </div>
    </div>
  );
}
