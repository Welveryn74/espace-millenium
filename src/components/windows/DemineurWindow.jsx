import { useState, useEffect, useCallback, useRef } from "react";
import Win from "../Win";
import { GRID, NUMBER_COLORS, CELL_STATES, SMILEY_STATES } from "../../data/demineurConfig";

function createEmptyGrid() {
  const grid = [];
  for (let r = 0; r < GRID.rows; r++) {
    const row = [];
    for (let c = 0; c < GRID.cols; c++) {
      row.push({ mine: false, revealed: false, flagged: false, adjacent: 0 });
    }
    grid.push(row);
  }
  return grid;
}

function placeMines(grid, safeRow, safeCol) {
  const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
  const forbidden = new Set();
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      forbidden.add(`${safeRow + dr},${safeCol + dc}`);
    }
  }

  let placed = 0;
  while (placed < GRID.mines) {
    const r = Math.floor(Math.random() * GRID.rows);
    const c = Math.floor(Math.random() * GRID.cols);
    if (newGrid[r][c].mine || forbidden.has(`${r},${c}`)) continue;
    newGrid[r][c].mine = true;
    placed++;
  }

  // Compute adjacency
  for (let r = 0; r < GRID.rows; r++) {
    for (let c = 0; c < GRID.cols; c++) {
      if (newGrid[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < GRID.rows && nc >= 0 && nc < GRID.cols && newGrid[nr][nc].mine) {
            count++;
          }
        }
      }
      newGrid[r][c].adjacent = count;
    }
  }
  return newGrid;
}

function revealCell(grid, row, col) {
  const newGrid = grid.map((r) => r.map((c) => ({ ...c })));
  if (newGrid[row][col].mine) {
    newGrid[row][col].revealed = true;
    return { grid: newGrid, hitMine: true };
  }

  // BFS flood-fill
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
            nr >= 0 && nr < GRID.rows &&
            nc >= 0 && nc < GRID.cols &&
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

function checkWin(grid) {
  for (let r = 0; r < GRID.rows; r++) {
    for (let c = 0; c < GRID.cols; c++) {
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
  const [grid, setGrid] = useState(createEmptyGrid);
  const [gameState, setGameState] = useState("ready"); // ready | playing | won | lost
  const [timer, setTimer] = useState(0);
  const [firstClick, setFirstClick] = useState(true);
  const [clicking, setClicking] = useState(false);
  const [clickedMine, setClickedMine] = useState(null);
  const timerRef = useRef(null);

  // Timer effect
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

  const resetGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGrid(createEmptyGrid());
    setGameState("ready");
    setTimer(0);
    setFirstClick(true);
    setClicking(false);
    setClickedMine(null);
  }, []);

  const handleReveal = useCallback(
    (row, col) => {
      if (gameState === "won" || gameState === "lost") return;
      if (grid[row][col].revealed || grid[row][col].flagged) return;

      let currentGrid = grid;

      if (firstClick) {
        currentGrid = placeMines(grid, row, col);
        setFirstClick(false);
        setGameState("playing");
      }

      const result = revealCell(currentGrid, row, col);

      if (result.hitMine) {
        const finalGrid = revealAllMines(result.grid);
        setGrid(finalGrid);
        setGameState("lost");
        setClickedMine(`${row},${col}`);
      } else if (checkWin(result.grid)) {
        setGrid(result.grid);
        setGameState("won");
      } else {
        setGrid(result.grid);
      }
    },
    [grid, gameState, firstClick]
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

  const minesLeft = GRID.mines - countFlags(grid);
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
      width={320}
      height={420}
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
        }}
      >
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
          {/* Mine counter */}
          <div
            style={{
              background: "#000",
              color: "#FF0000",
              fontFamily: "'Courier New', monospace",
              fontSize: 22,
              fontWeight: "bold",
              padding: "2px 6px",
              minWidth: 46,
              textAlign: "center",
              letterSpacing: 2,
              border: "1px inset #808080",
            }}
          >
            {pad3(minesLeft)}
          </div>

          {/* Smiley button */}
          <button
            onClick={resetGame}
            style={{
              fontSize: 22,
              width: 36,
              height: 36,
              cursor: "pointer",
              border: "2px outset #fff",
              background: "#C0C0C0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              lineHeight: 1,
            }}
          >
            {smiley}
          </button>

          {/* Timer */}
          <div
            style={{
              background: "#000",
              color: "#FF0000",
              fontFamily: "'Courier New', monospace",
              fontSize: 22,
              fontWeight: "bold",
              padding: "2px 6px",
              minWidth: 46,
              textAlign: "center",
              letterSpacing: 2,
              border: "1px inset #808080",
            }}
          >
            {pad3(timer)}
          </div>
        </div>

        {/* Grid */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 6,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${GRID.cols}, 28px)`,
              gridTemplateRows: `repeat(${GRID.rows}, 28px)`,
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
                } else {
                  // Unrevealed cell
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
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: borderStyle,
                      background: bg,
                      cursor: "pointer",
                      fontSize: cell.revealed && cell.adjacent > 0 ? 14 : 13,
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
      </div>
    </Win>
  );
}
