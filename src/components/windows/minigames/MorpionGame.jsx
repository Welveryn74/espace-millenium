import { useState, useCallback } from "react";
import { loadState, saveState } from "../../../utils/storage";
import { playPop, playPieceLock, playVictorySound, playGameOver } from "../../../utils/uiSounds";

const EMPTY = null;

function checkWinner(board) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6],         // diags
  ];
  for (const [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a,b,c] };
    }
  }
  if (board.every(c => c !== EMPTY)) return { winner: "draw", line: null };
  return null;
}

function cpuMove(board) {
  const avail = board.map((c, i) => c === EMPTY ? i : -1).filter(i => i >= 0);
  if (avail.length === 0) return -1;

  // 1) Win
  for (const i of avail) {
    const b = [...board]; b[i] = "O";
    if (checkWinner(b)?.winner === "O") return i;
  }
  // 2) Block
  for (const i of avail) {
    const b = [...board]; b[i] = "X";
    if (checkWinner(b)?.winner === "X") return i;
  }
  // 3) Center
  if (avail.includes(4)) return 4;
  // 4) Random
  return avail[Math.floor(Math.random() * avail.length)];
}

export default function MorpionGame({ screenBg, screenText, color }) {
  const [board, setBoard] = useState(Array(9).fill(EMPTY));
  const [result, setResult] = useState(null); // { winner, line }
  const [scores, setScores] = useState(() => loadState("morpion_scores", { x: 0, o: 0, draw: 0 }));
  const [thinking, setThinking] = useState(false);

  const txtColor = screenText || "#88BBEE";
  const accentColor = color || "#4A90D9";

  const handleClick = useCallback((idx) => {
    if (board[idx] !== EMPTY || result || thinking) return;
    playPop();
    const newBoard = [...board];
    newBoard[idx] = "X";

    const res = checkWinner(newBoard);
    if (res) {
      setBoard(newBoard);
      setResult(res);
      if (res.winner === "X") { updateScores("x"); playVictorySound(); }
      else if (res.winner === "draw") { updateScores("draw"); playGameOver(); }
      return;
    }

    setBoard(newBoard);
    setThinking(true);

    // CPU plays after short delay
    setTimeout(() => {
      const ci = cpuMove(newBoard);
      if (ci >= 0) {
        playPieceLock();
        newBoard[ci] = "O";
        setBoard([...newBoard]);
        const res2 = checkWinner(newBoard);
        if (res2) {
          setResult(res2);
          if (res2.winner === "O") { updateScores("o"); playGameOver(); }
          else if (res2.winner === "draw") { updateScores("draw"); playGameOver(); }
        }
      }
      setThinking(false);
    }, 400);
  }, [board, result, thinking]);

  const updateScores = (key) => {
    setScores(prev => {
      const next = { ...prev, [key]: prev[key] + 1 };
      saveState("morpion_scores", next);
      return next;
    });
  };

  const restart = () => {
    setBoard(Array(9).fill(EMPTY));
    setResult(null);
    setThinking(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%" }}>
      {/* Scores */}
      <div style={{ display: "flex", gap: 16, fontSize: 10, fontFamily: "monospace" }}>
        <span style={{ color: "#4F4" }}>Toi (X) : {scores.x}</span>
        <span style={{ color: "#888" }}>Nul : {scores.draw}</span>
        <span style={{ color: "#F44" }}>CPU (O) : {scores.o}</span>
      </div>

      {/* Grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4,
        width: 180, height: 180,
      }}>
        {board.map((cell, i) => {
          const isWinCell = result?.line?.includes(i);
          return (
            <div key={i} onClick={() => handleClick(i)} style={{
              width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center",
              background: isWinCell ? `${accentColor}30` : "rgba(255,255,255,0.05)",
              border: `1px solid ${accentColor}40`,
              borderRadius: 4, cursor: cell === EMPTY && !result ? "pointer" : "default",
              transition: "all 0.15s",
              fontSize: 26, fontWeight: "bold", fontFamily: "monospace",
              color: cell === "X" ? "#4F4" : cell === "O" ? "#F44" : "transparent",
            }}>
              {cell || "."}
            </div>
          );
        })}
      </div>

      {/* Status */}
      <div style={{ textAlign: "center", minHeight: 40 }}>
        {result ? (
          <div style={{ animation: "fadeIn 0.3s ease-out" }}>
            <div style={{
              color: result.winner === "X" ? "#4F4" : result.winner === "O" ? "#F44" : "#888",
              fontSize: 13, fontFamily: "monospace", fontWeight: "bold", marginBottom: 6,
            }}>
              {result.winner === "X" ? "Tu as gagné !" : result.winner === "O" ? "L'ordinateur gagne !" : "Match nul !"}
            </div>
            <button onClick={restart} style={{
              background: `${accentColor}30`, color: txtColor,
              border: `1px solid ${accentColor}50`, padding: "4px 14px",
              borderRadius: 3, cursor: "pointer", fontFamily: "monospace", fontSize: 11,
            }}>Rejouer</button>
          </div>
        ) : (
          <div style={{ color: `${txtColor}99`, fontSize: 10, fontFamily: "monospace" }}>
            {thinking ? "L'ordinateur réfléchit..." : "À toi de jouer (X)"}
          </div>
        )}
      </div>
    </div>
  );
}
