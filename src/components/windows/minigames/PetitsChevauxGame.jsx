import { useState, useCallback, useEffect, useRef } from "react";

const BOARD_SIZE = 20;
const COLORS = {
  human: { bg: "#2196F3", light: "#64B5F6", name: "Bleu" },
  cpu: { bg: "#F44336", light: "#E57373", name: "Rouge" },
};

function initHorses() {
  return {
    human: [{ pos: -1, finished: false }, { pos: -1, finished: false }],
    cpu: [{ pos: -1, finished: false }, { pos: -1, finished: false }],
  };
}

export default function PetitsChevauxGame({ onBack }) {
  const [horses, setHorses] = useState(initHorses);
  const [turn, setTurn] = useState("human"); // human | cpu
  const [phase, setPhase] = useState("ROLL"); // ROLL | CHOOSE | CPU_TURN | WON
  const [dice, setDice] = useState(null);
  const [diceRolling, setDiceRolling] = useState(false);
  const [message, setMessage] = useState("Lance le dé !");
  const [winner, setWinner] = useState(null);
  const cpuTimerRef = useRef(null);

  const checkWin = useCallback((h) => {
    if (h.human.every(p => p.finished)) return "human";
    if (h.cpu.every(p => p.finished)) return "cpu";
    return null;
  }, []);

  const getValidMoves = useCallback((player, diceVal, h) => {
    const playerHorses = h[player];
    const opponentHorses = h[player === "human" ? "cpu" : "human"];
    const moves = [];

    playerHorses.forEach((horse, idx) => {
      if (horse.finished) return;
      if (horse.pos === -1) {
        // Need 6 to leave stable
        if (diceVal === 6) moves.push({ idx, action: "enter" });
      } else {
        const newPos = horse.pos + diceVal;
        if (newPos >= BOARD_SIZE) {
          // Exact finish
          if (newPos === BOARD_SIZE) moves.push({ idx, action: "finish" });
          // Otherwise overshoot, can't move
        } else {
          // Check not landing on own horse
          const ownBlock = playerHorses.some((h, i) => i !== idx && h.pos === newPos && !h.finished);
          if (!ownBlock) moves.push({ idx, action: "move", to: newPos });
        }
      }
    });
    return moves;
  }, []);

  const applyMove = useCallback((player, move, diceVal, h) => {
    const newH = {
      human: h.human.map(p => ({ ...p })),
      cpu: h.cpu.map(p => ({ ...p })),
    };
    const opponent = player === "human" ? "cpu" : "human";

    if (move.action === "enter") {
      newH[player][move.idx].pos = 0;
      // Check if opponent is on pos 0 — send back
      newH[opponent].forEach(oh => {
        if (oh.pos === 0 && !oh.finished) oh.pos = -1;
      });
    } else if (move.action === "finish") {
      newH[player][move.idx].finished = true;
      newH[player][move.idx].pos = BOARD_SIZE;
    } else if (move.action === "move") {
      newH[player][move.idx].pos = move.to;
      // Check capture
      newH[opponent].forEach(oh => {
        if (oh.pos === move.to && !oh.finished) oh.pos = -1;
      });
    }
    return newH;
  }, []);

  const rollDice = useCallback(() => {
    if (phase !== "ROLL" || turn !== "human") return;
    setDiceRolling(true);
    let count = 0;
    const iv = setInterval(() => {
      setDice(1 + Math.floor(Math.random() * 6));
      count++;
      if (count >= 8) {
        clearInterval(iv);
        const val = 1 + Math.floor(Math.random() * 6);
        setDice(val);
        setDiceRolling(false);

        const moves = getValidMoves("human", val, horses);
        if (moves.length === 0) {
          setMessage(`Pas de coup possible avec ${val} !`);
          setTimeout(() => {
            setTurn("cpu");
            setPhase("CPU_TURN");
            setMessage("Tour de l'adversaire...");
          }, 800);
        } else if (moves.length === 1) {
          // Auto-play
          const newH = applyMove("human", moves[0], val, horses);
          setHorses(newH);
          const w = checkWin(newH);
          if (w) { setWinner(w); setPhase("WON"); setMessage("Tu as gagné !"); return; }
          setMessage(moves[0].action === "enter" ? "Cheval sorti !" : moves[0].action === "finish" ? "Cheval arrivé !" : `Avance de ${val}`);
          setTimeout(() => { setTurn("cpu"); setPhase("CPU_TURN"); setMessage("Tour de l'adversaire..."); }, 600);
        } else {
          setPhase("CHOOSE");
          setMessage(`${val} ! Choisis un cheval`);
        }
      }
    }, 80);
  }, [phase, turn, horses, getValidMoves, applyMove, checkWin]);

  const chooseHorse = useCallback((idx) => {
    if (phase !== "CHOOSE") return;
    const moves = getValidMoves("human", dice, horses);
    const move = moves.find(m => m.idx === idx);
    if (!move) return;
    const newH = applyMove("human", move, dice, horses);
    setHorses(newH);
    const w = checkWin(newH);
    if (w) { setWinner(w); setPhase("WON"); setMessage("Tu as gagné !"); return; }
    setPhase("CPU_TURN");
    setTurn("cpu");
    setMessage("Tour de l'adversaire...");
  }, [phase, dice, horses, getValidMoves, applyMove, checkWin]);

  // CPU turn
  useEffect(() => {
    if (phase !== "CPU_TURN") return;
    cpuTimerRef.current = setTimeout(() => {
      const val = 1 + Math.floor(Math.random() * 6);
      setDice(val);
      const moves = getValidMoves("cpu", val, horses);

      if (moves.length === 0) {
        setMessage(`CPU lance ${val} — pas de coup !`);
        setTimeout(() => { setTurn("human"); setPhase("ROLL"); setMessage("Lance le dé !"); }, 800);
        return;
      }

      // CPU strategy: prefer finish > capture > enter > move furthest
      const opponent = "human";
      let best = moves[0];
      for (const m of moves) {
        if (m.action === "finish") { best = m; break; }
        if (m.action === "move" && horses[opponent].some(oh => oh.pos === m.to && !oh.finished)) { best = m; break; }
        if (m.action === "enter") { best = m; }
      }

      const newH = applyMove("cpu", best, val, horses);
      setHorses(newH);
      const w = checkWin(newH);
      if (w) { setWinner(w); setPhase("WON"); setMessage("L'ordinateur a gagné !"); return; }
      setMessage(`CPU lance ${val}`);
      setTimeout(() => { setTurn("human"); setPhase("ROLL"); setMessage("Lance le dé !"); }, 800);
    }, 700);
    return () => { if (cpuTimerRef.current) clearTimeout(cpuTimerRef.current); };
  }, [phase, horses, getValidMoves, applyMove, checkWin]);

  const restart = () => {
    setHorses(initHorses());
    setTurn("human");
    setPhase("ROLL");
    setDice(null);
    setMessage("Lance le dé !");
    setWinner(null);
  };

  const humanMoves = phase === "CHOOSE" ? getValidMoves("human", dice, horses) : [];

  // Render board as linear track
  const cellSize = 22;
  const boardWidth = BOARD_SIZE * cellSize + cellSize * 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, animation: "fadeIn 0.3s ease-out" }}>
      {/* Header */}
      <div style={{ display: "flex", gap: 20, fontSize: 10, fontFamily: "'Tahoma', sans-serif" }}>
        <span style={{ color: COLORS.human.light }}>Toi (Bleu)</span>
        <span style={{ color: "#888" }}>vs</span>
        <span style={{ color: COLORS.cpu.light }}>CPU (Rouge)</span>
      </div>

      {/* Board */}
      <div style={{ position: "relative", width: boardWidth, padding: "0 10px" }}>
        {/* Track */}
        <div style={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
          {/* Stables */}
          <div style={{ display: "flex", gap: 4, marginBottom: 8, width: "100%", justifyContent: "space-between" }}>
            {/* Human stable */}
            <div style={{
              display: "flex", gap: 4, padding: "4px 8px", borderRadius: 4,
              background: "rgba(33,150,243,0.1)", border: "1px solid rgba(33,150,243,0.3)",
            }}>
              <span style={{ color: COLORS.human.light, fontSize: 9, marginRight: 4, alignSelf: "center" }}>Écurie</span>
              {horses.human.map((h, i) => h.pos === -1 && !h.finished && (
                <div key={i} onClick={() => phase === "CHOOSE" && humanMoves.some(m => m.idx === i && m.action === "enter") && chooseHorse(i)}
                  style={{
                    width: 18, height: 18, borderRadius: "50%", background: COLORS.human.bg,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10,
                    cursor: humanMoves.some(m => m.idx === i) ? "pointer" : "default",
                    boxShadow: humanMoves.some(m => m.idx === i) ? `0 0 8px ${COLORS.human.bg}` : "none",
                    border: humanMoves.some(m => m.idx === i) ? "2px solid #fff" : "1px solid rgba(255,255,255,0.2)",
                  }}>♞</div>
              ))}
            </div>
            {/* CPU stable */}
            <div style={{
              display: "flex", gap: 4, padding: "4px 8px", borderRadius: 4,
              background: "rgba(244,67,54,0.1)", border: "1px solid rgba(244,67,54,0.3)",
            }}>
              <span style={{ color: COLORS.cpu.light, fontSize: 9, marginRight: 4, alignSelf: "center" }}>Écurie</span>
              {horses.cpu.map((h, i) => h.pos === -1 && !h.finished && (
                <div key={i} style={{
                  width: 18, height: 18, borderRadius: "50%", background: COLORS.cpu.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10,
                  border: "1px solid rgba(255,255,255,0.2)",
                }}>♞</div>
              ))}
            </div>
          </div>

          {/* Linear track */}
          <div style={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
            {Array.from({ length: BOARD_SIZE }).map((_, i) => {
              const humanOnCell = horses.human.filter((h, hi) => h.pos === i && !h.finished);
              const cpuOnCell = horses.cpu.filter((h, ci) => h.pos === i && !h.finished);
              const isStart = i === 0;
              const isEnd = i === BOARD_SIZE - 1;

              return (
                <div key={i} style={{
                  width: cellSize, height: cellSize, borderRadius: 3,
                  background: isStart ? "rgba(255,255,255,0.15)" : isEnd ? "rgba(255,215,0,0.15)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${isEnd ? "rgba(255,215,0,0.4)" : "rgba(255,255,255,0.1)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative", fontSize: 8, color: "#555",
                }}>
                  {i + 1}
                  {humanOnCell.map((h, hi) => {
                    const idx = horses.human.indexOf(h);
                    const canChoose = humanMoves.some(m => m.idx === idx);
                    return (
                      <div key={`h${hi}`} onClick={() => canChoose && chooseHorse(idx)} style={{
                        position: "absolute", top: -2, left: hi * 6,
                        width: 14, height: 14, borderRadius: "50%", background: COLORS.human.bg,
                        fontSize: 8, display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: canChoose ? "pointer" : "default",
                        boxShadow: canChoose ? `0 0 6px ${COLORS.human.bg}` : "0 1px 2px rgba(0,0,0,0.3)",
                        border: canChoose ? "2px solid #fff" : "none",
                        zIndex: 5,
                      }}>♞</div>
                    );
                  })}
                  {cpuOnCell.map((h, ci) => (
                    <div key={`c${ci}`} style={{
                      position: "absolute", bottom: -2, right: ci * 6,
                      width: 14, height: 14, borderRadius: "50%", background: COLORS.cpu.bg,
                      fontSize: 8, display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.3)", zIndex: 5,
                    }}>♞</div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Finish zone */}
          <div style={{ display: "flex", gap: 8, marginTop: 8, width: "100%", justifyContent: "center" }}>
            <div style={{ padding: "4px 12px", borderRadius: 4, background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.3)", display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ color: "#FFD700", fontSize: 9 }}>Arrivée :</span>
              {horses.human.filter(h => h.finished).map((_, i) => (
                <span key={i} style={{ fontSize: 12, color: COLORS.human.light }}>♞</span>
              ))}
              {horses.cpu.filter(h => h.finished).map((_, i) => (
                <span key={i} style={{ fontSize: 12, color: COLORS.cpu.light }}>♞</span>
              ))}
              {horses.human.every(h => !h.finished) && horses.cpu.every(h => !h.finished) && (
                <span style={{ color: "#666", fontSize: 9 }}>vide</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dice + message */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          onClick={rollDice}
          style={{
            width: 44, height: 44, borderRadius: 8,
            background: turn === "human" && phase === "ROLL" ? "linear-gradient(135deg, #fff, #ddd)" : "linear-gradient(135deg, #888, #666)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: "bold", cursor: turn === "human" && phase === "ROLL" ? "pointer" : "default",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            color: "#333", fontFamily: "monospace",
            animation: diceRolling ? "pulse 0.15s infinite" : "none",
            transition: "transform 0.1s",
          }}
        >
          {dice || "?"}
        </div>
        <div style={{ color: "#C8B0E8", fontSize: 11, fontFamily: "'Tahoma', sans-serif", maxWidth: 180 }}>
          {message}
        </div>
      </div>

      {/* Win / restart */}
      {winner && (
        <div style={{ textAlign: "center", animation: "fadeIn 0.3s ease-out" }}>
          <div style={{
            color: winner === "human" ? COLORS.human.light : COLORS.cpu.light,
            fontSize: 14, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif",
          }}>
            {winner === "human" ? "Tu as gagné !" : "L'ordinateur a gagné !"}
          </div>
          <button onClick={restart} style={{
            marginTop: 6, background: "rgba(200,176,232,0.2)", color: "#C8B0E8",
            border: "1px solid rgba(200,176,232,0.4)", padding: "4px 14px",
            borderRadius: 4, cursor: "pointer", fontFamily: "'Tahoma', sans-serif", fontSize: 11,
          }}>Rejouer</button>
        </div>
      )}

      <div style={{ color: "#8B6BAE", fontSize: 8, fontFamily: "'Tahoma', sans-serif", textAlign: "center" }}>
        6 pour sortir de l'écurie — Rattrape l'adversaire pour le renvoyer !
      </div>
    </div>
  );
}
