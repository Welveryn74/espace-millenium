import { useState, useEffect, useCallback, useRef } from "react";
import Win from "../Win";
import { DIFFICULTIES, NUMBER_COLORS, SMILEY_STATES } from "../../data/demineurConfig";
import { playVictorySound, playExplosionSound } from "../../utils/uiSounds";
import { loadState, saveState } from "../../utils/storage";

function createEmptyGrid(rows, cols) {
  const grid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push({ mine: false, revealed: false, flagged: false, adjacent: 0 });
    }
    grid.push(row);
  }
  return grid;
}

function placeMines(grid, safeRow, safeCol, rows, cols, mines) {
  const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
  const forbidden = new Set();
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      forbidden.add(`${safeRow + dr},${safeCol + dc}`);
    }
  }

  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (newGrid[r][c].mine || forbidden.has(`${r},${c}`)) continue;
    newGrid[r][c].mine = true;
    placed++;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (newGrid[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newGrid[nr][nc].mine) {
            count++;
          }
        }
      }
      newGrid[r][c].adjacent = count;
    }
  }
  return newGrid;
}

function revealCell(grid, row, col, rows, cols) {
  const newGrid = grid.map((r) => r.map((c) => ({ ...c })));
  if (newGrid[row][col].mine) {
    newGrid[row][col].revealed = true;
    return { grid: newGrid, hitMine: true };
  }

  const queue = [[row, col]];
  newGrid[row][col].revealed = true;

  while (queue.length > 0) {
    const [r, c] = queue.shift();
    if (newGrid[r][c].adjacent === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (
            nr >= 0 && nr < rows &&
            nc >= 0 && nc < cols &&
            !newGrid[nr][nc].revealed &&
            !newGrid[nr][nc].flagged
          ) {
            newGrid[nr][nc].revealed = true;
            if (!newGrid[nr][nc].mine) {
              queue.push([nr, nc]);
            }
          }
        }
      }
    }
  }
  return { grid: newGrid, hitMine: false };
}

function checkWin(grid, rows, cols) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!grid[r][c].mine && !grid[r][c].revealed) return false;
    }
  }
  return true;
}

function revealAllMines(grid) {
  return grid.map((row) =>
    row.map((cell) => (cell.mine ? { ...cell, revealed: true } : { ...cell }))
  );
}

function countFlags(grid) {
  let count = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell.flagged) count++;
    }
  }
  return count;
}

export default function DemineurWindow({ onClose, onMinimize, zIndex, onFocus }) {
  const [difficulty, setDifficulty] = useState(() => loadState("demineur_difficulty", "debutant"));
  const [showMenu, setShowMenu] = useState(false);
  const level = DIFFICULTIES[difficulty];

  const [grid, setGrid] = useState(() => createEmptyGrid(level.rows, level.cols));
  const [gameState, setGameState] = useState("ready");
  const [timer, setTimer] = useState(0);
  const [firstClick, setFirstClick] = useState(true);
  const [clicking, setClicking] = useState(false);
  const [clickedMine, setClickedMine] = useState(null);
  const [scores, setScores] = useState(() => loadState('em_demineur_scores', {}));
  const [showScores, setShowScores] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (gameState === "playing") {
      timerRef.current = setInterval(() => {
        setTimer((t) => (t < 999 ? t + 1 : t));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  const resetGame = useCallback((newDifficulty) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const d = newDifficulty || difficulty;
    const lv = DIFFICULTIES[d];
    if (newDifficulty) {
      setDifficulty(newDifficulty);
      saveState("demineur_difficulty", newDifficulty);
    }
    setGrid(createEmptyGrid(lv.rows, lv.cols));
    setGameState("ready");
    setTimer(0);
    setFirstClick(true);
    setClicking(false);
    setClickedMine(null);
    setShowMenu(false);
    setShowScores(false);
  }, [difficulty]);

  const handleReveal = useCallback(
    (row, col) => {
      if (gameState === "won" || gameState === "lost") return;
      if (grid[row][col].revealed || grid[row][col].flagged) return;

      let currentGrid = grid;

      if (firstClick) {
        currentGrid = placeMines(grid, row, col, level.rows, level.cols, level.mines);
        setFirstClick(false);
        setGameState("playing");
      }

      const result = revealCell(currentGrid, row, col, level.rows, level.cols);

      if (result.hitMine) {
        const finalGrid = revealAllMines(result.grid);
        setGrid(finalGrid);
        setGameState("lost");
        setClickedMine(`${row},${col}`);
        playExplosionSound();
      } else if (checkWin(result.grid, level.rows, level.cols)) {
        setGrid(result.grid);
        setGameState("won");
        playVictorySound();
        // Save score
        const currentScores = loadState('em_demineur_scores', {});
        const diffScores = currentScores[difficulty] || [];
        const newScores = [...diffScores, timer + 1].sort((a, b) => a - b).slice(0, 3);
        const updated = { ...currentScores, [difficulty]: newScores };
        saveState('em_demineur_scores', updated);
        setScores(updated);
        setShowScores(true);
      } else {
        setGrid(result.grid);
      }
    },
    [grid, gameState, firstClick, level]
  );

  const handleFlag = useCallback(
    (e, row, col) => {
      e.preventDefault();
      if (gameState === "won" || gameState === "lost") return;
      if (grid[row][col].revealed) return;

      setGrid((prev) => {
        const newGrid = prev.map((r) => r.map((c) => ({ ...c })));
        newGrid[row][col].flagged = !newGrid[row][col].flagged;
        return newGrid;
      });
    },
    [gameState, grid]
  );

  const minesLeft = level.mines - countFlags(grid);
  const smiley =
    gameState === "lost"
      ? SMILEY_STATES.dead
      : gameState === "won"
        ? SMILEY_STATES.win
        : clicking
          ? SMILEY_STATES.clicking
          : SMILEY_STATES.playing;

  const pad3 = (n) => String(Math.max(0, n)).padStart(3, "0");

  return (
    <Win
      title="Démineur"
      onClose={onClose}
      onMinimize={onMinimize}
      width={level.width}
      height={level.height}
      zIndex={zIndex}
      onFocus={onFocus}
      color="#808080"
    >
      <div
        style={{
          height: "100%",
          background: "#C0C0C0",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'Tahoma', sans-serif",
          userSelect: "none",
          position: "relative",
        }}
      >
        {/* Menu bar */}
        <div style={{
          display: "flex", alignItems: "center", padding: "2px 4px",
          background: "#ECE9D8", borderBottom: "1px solid #ACA899",
          fontSize: 11, position: "relative",
        }}>
          <span
            onClick={() => setShowMenu(!showMenu)}
            style={{
              padding: "2px 8px", cursor: "pointer",
              background: showMenu ? "#316AC5" : "transparent",
              color: showMenu ? "#fff" : "#000",
              borderRadius: 2,
            }}
          >Jeu</span>
          {showMenu && (
            <div style={{
              position: "absolute", top: 20, left: 0, background: "#fff",
              border: "1px solid #888", boxShadow: "2px 2px 6px rgba(0,0,0,0.2)",
              zIndex: 999, minWidth: 160,
            }}>
              <div
                onClick={() => resetGame(difficulty)}
                style={{ padding: "4px 20px", cursor: "pointer", fontSize: 11 }}
                onMouseEnter={e => { e.currentTarget.style.background = "#316AC5"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "#000"; }}
              >Nouvelle partie</div>
              <div style={{ height: 1, background: "#ccc", margin: "2px 4px" }} />
              {Object.entries(DIFFICULTIES).map(([key, val]) => (
                <div
                  key={key}
                  onClick={() => resetGame(key)}
                  style={{ padding: "4px 20px", cursor: "pointer", fontSize: 11 }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#316AC5"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "#000"; }}
                >{difficulty === key ? "● " : "○ "}{val.label} ({val.rows}×{val.cols}, {val.mines} mines)</div>
              ))}
            </div>
          )}
        </div>

        {/* Header: mine counter, smiley, timer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "6px 8px",
            border: "2px inset #fff",
            margin: 6,
            marginBottom: 0,
            background: "#C0C0C0",
          }}
        >
          <div
            style={{
              background: "#000", color: "#FF0000",
              fontFamily: "'Courier New', monospace", fontSize: 22,
              fontWeight: "bold", padding: "2px 6px", minWidth: 46,
              textAlign: "center", letterSpacing: 2, border: "1px inset #808080",
            }}
          >{pad3(minesLeft)}</div>

          <button
            onClick={() => resetGame()}
            style={{
              fontSize: 22, width: 36, height: 36, cursor: "pointer",
              border: "2px outset #fff", background: "#C0C0C0",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 0, lineHeight: 1,
            }}
          >{smiley}</button>

          <div
            style={{
              background: "#000", color: "#FF0000",
              fontFamily: "'Courier New', monospace", fontSize: 22,
              fontWeight: "bold", padding: "2px 6px", minWidth: 46,
              textAlign: "center", letterSpacing: 2, border: "1px inset #808080",
            }}
          >{pad3(timer)}</div>
        </div>

        {/* Grid */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 6,
            overflow: "auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${level.cols}, ${level.cellSize}px)`,
              gridTemplateRows: `repeat(${level.rows}, ${level.cellSize}px)`,
              border: "2px inset #fff",
              background: "#C0C0C0",
            }}
          >
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const isClickedMine = clickedMine === `${r},${c}`;
                let content = "";
                let bg = "#C0C0C0";
                let borderStyle = "2px outset #ccc";
                let color = "#000";
                let fontWeight = "bold";

                if (cell.revealed) {
                  borderStyle = "1px solid #ccc";
                  bg = "#D0D0D0";
                  if (cell.mine) {
                    content = "\u{1F4A3}";
                    if (isClickedMine) bg = "#FF0000";
                  } else if (cell.adjacent > 0) {
                    content = cell.adjacent;
                    color = NUMBER_COLORS[cell.adjacent] || "#000";
                  }
                } else if (cell.flagged) {
                  content = "\u{1F6A9}";
                }

                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => handleReveal(r, c)}
                    onContextMenu={(e) => handleFlag(e, r, c)}
                    onMouseDown={() => {
                      if (!cell.revealed && !cell.flagged && gameState !== "won" && gameState !== "lost") {
                        setClicking(true);
                      }
                    }}
                    onMouseUp={() => setClicking(false)}
                    onMouseLeave={() => setClicking(false)}
                    style={{
                      width: level.cellSize,
                      height: level.cellSize,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: borderStyle,
                      background: bg,
                      cursor: "pointer",
                      fontSize: cell.revealed && cell.adjacent > 0 ? (level.cellSize > 24 ? 14 : 11) : (level.cellSize > 24 ? 13 : 10),
                      fontWeight,
                      color,
                      boxSizing: "border-box",
                    }}
                  >
                    {content}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Victory scores overlay */}
        {showScores && gameState === "won" && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 999,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.3)",
          }} onClick={() => setShowScores(false)}>
            <div onClick={e => e.stopPropagation()} style={{
              background: "#ECE9D8", border: "2px solid #0055E5",
              borderRadius: "8px 8px 0 0", width: 250,
              boxShadow: "4px 4px 16px rgba(0,0,50,0.4)",
              animation: "popIn 0.2s ease-out",
            }}>
              <div style={{
                background: "linear-gradient(180deg, #0055E5 0%, #0033AA 100%)",
                padding: "4px 8px", color: "#fff", fontWeight: "bold", fontSize: 11,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span>Victoire ! 🎉</span>
                <button onClick={() => setShowScores(false)} style={{
                  width: 18, height: 18, border: "1px solid rgba(0,0,0,0.3)", borderRadius: 3,
                  background: "linear-gradient(180deg, #E97 0%, #C44 100%)", color: "#fff",
                  fontWeight: "bold", fontSize: 10, cursor: "pointer", display: "flex",
                  alignItems: "center", justifyContent: "center",
                }}>✕</button>
              </div>
              <div style={{ padding: 16, fontSize: 11, fontFamily: "'Tahoma', sans-serif" }}>
                <div style={{ textAlign: "center", marginBottom: 10 }}>
                  <div style={{ fontSize: 14, fontWeight: "bold", color: "#333" }}>Temps : {timer}s</div>
                  <div style={{ color: "#666", fontSize: 10 }}>{DIFFICULTIES[difficulty].label}</div>
                </div>
                <div style={{ fontWeight: "bold", marginBottom: 6, color: "#333" }}>Meilleurs temps :</div>
                {(scores[difficulty] || []).map((s, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "3px 8px", fontSize: 11,
                    background: s === timer + 1 && i === (scores[difficulty] || []).indexOf(timer + 1) ? "#FFE082" : (i % 2 === 0 ? "#F5F5F0" : "#fff"),
                    borderRadius: 2,
                  }}>
                    <span>{["🥇", "🥈", "🥉"][i]} #{i + 1}</span>
                    <span style={{ fontWeight: "bold" }}>{s}s</span>
                  </div>
                ))}
                {(!scores[difficulty] || scores[difficulty].length === 0) && (
                  <div style={{ color: "#888", fontStyle: "italic", textAlign: "center" }}>Premier score enregistré !</div>
                )}
              </div>
              <div style={{ padding: "8px 16px 12px", textAlign: "center" }}>
                <button onClick={() => { setShowScores(false); resetGame(); }} style={{
                  padding: "4px 28px", background: "linear-gradient(180deg, #F0F0F0 0%, #D0D0D0 100%)",
                  border: "1px solid #888", borderRadius: 3, cursor: "pointer", fontSize: 11,
                  fontFamily: "'Tahoma', sans-serif",
                }}>Rejouer</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Win>
  );
}
