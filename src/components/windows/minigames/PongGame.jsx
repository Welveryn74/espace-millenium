import { useState, useEffect, useRef, useCallback } from "react";

const W = 280;
const H = 200;
const PADDLE_H = 36;
const PADDLE_W = 6;
const BALL_SIZE = 6;
const WIN_SCORE = 5;
const BASE_SPEED = 2.5;

export default function PongGame({ screenBg, screenText, color }) {
  const [phase, setPhase] = useState("START");
  const [pScore, setPScore] = useState(0);
  const [cScore, setCScore] = useState(0);
  const [winner, setWinner] = useState(null);
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const keysRef = useRef({});
  const animRef = useRef(null);

  const initState = useCallback(() => ({
    playerY: H / 2 - PADDLE_H / 2,
    cpuY: H / 2 - PADDLE_H / 2,
    ballX: W / 2, ballY: H / 2,
    ballVX: (Math.random() > 0.5 ? 1 : -1) * BASE_SPEED,
    ballVY: (Math.random() - 0.5) * 3,
    speed: BASE_SPEED,
    pScore: 0, cScore: 0,
  }), []);

  const startGame = useCallback(() => {
    stateRef.current = initState();
    setPScore(0);
    setCScore(0);
    setWinner(null);
    setPhase("PLAYING");
  }, [initState]);

  const resetBall = useCallback((s, direction) => {
    s.ballX = W / 2;
    s.ballY = H / 2;
    s.speed = Math.min(5, s.speed + 0.15);
    s.ballVX = direction * s.speed;
    s.ballVY = (Math.random() - 0.5) * 3;
  }, []);

  // Keys
  useEffect(() => {
    const down = (e) => { keysRef.current[e.key] = true; };
    const up = (e) => { keysRef.current[e.key] = false; };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  // Game loop
  useEffect(() => {
    if (phase !== "PLAYING") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const loop = () => {
      const s = stateRef.current;
      if (!s) return;

      // Player movement
      if (keysRef.current["ArrowUp"]) s.playerY = Math.max(0, s.playerY - 4);
      if (keysRef.current["ArrowDown"]) s.playerY = Math.min(H - PADDLE_H, s.playerY + 4);

      // CPU: follows ball with slight lag
      const cpuTarget = s.ballY - PADDLE_H / 2;
      const cpuSpeed = 2.5;
      if (s.cpuY < cpuTarget - 4) s.cpuY += cpuSpeed;
      else if (s.cpuY > cpuTarget + 4) s.cpuY -= cpuSpeed;
      s.cpuY = Math.max(0, Math.min(H - PADDLE_H, s.cpuY));

      // Ball movement
      s.ballX += s.ballVX;
      s.ballY += s.ballVY;

      // Top/bottom bounce
      if (s.ballY <= 0) { s.ballY = 0; s.ballVY = -s.ballVY; }
      if (s.ballY >= H - BALL_SIZE) { s.ballY = H - BALL_SIZE; s.ballVY = -s.ballVY; }

      // Player paddle collision (left)
      if (s.ballX <= 14 + PADDLE_W && s.ballX >= 14 && s.ballVX < 0) {
        if (s.ballY + BALL_SIZE >= s.playerY && s.ballY <= s.playerY + PADDLE_H) {
          s.ballVX = -s.ballVX;
          const hit = (s.ballY + BALL_SIZE / 2 - s.playerY) / PADDLE_H - 0.5;
          s.ballVY = hit * 5;
          s.ballX = 14 + PADDLE_W + 1;
        }
      }

      // CPU paddle collision (right)
      if (s.ballX + BALL_SIZE >= W - 14 - PADDLE_W && s.ballX + BALL_SIZE <= W - 14 && s.ballVX > 0) {
        if (s.ballY + BALL_SIZE >= s.cpuY && s.ballY <= s.cpuY + PADDLE_H) {
          s.ballVX = -s.ballVX;
          const hit = (s.ballY + BALL_SIZE / 2 - s.cpuY) / PADDLE_H - 0.5;
          s.ballVY = hit * 5;
          s.ballX = W - 14 - PADDLE_W - BALL_SIZE - 1;
        }
      }

      // Scoring
      if (s.ballX < 0) {
        s.cScore++;
        setCScore(s.cScore);
        if (s.cScore >= WIN_SCORE) { setWinner("CPU"); setPhase("GAMEOVER"); return; }
        resetBall(s, 1);
      }
      if (s.ballX > W) {
        s.pScore++;
        setPScore(s.pScore);
        if (s.pScore >= WIN_SCORE) { setWinner("Toi"); setPhase("GAMEOVER"); return; }
        resetBall(s, -1);
      }

      // Draw
      ctx.fillStyle = screenBg || "#0a1628";
      ctx.fillRect(0, 0, W, H);

      // Center line
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = (screenText || "#88BBEE") + "40";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(W / 2, 0);
      ctx.lineTo(W / 2, H);
      ctx.stroke();
      ctx.setLineDash([]);

      // Paddles
      const pColor = screenText || "#88BBEE";
      ctx.fillStyle = pColor;
      ctx.fillRect(14, s.playerY, PADDLE_W, PADDLE_H);
      ctx.fillRect(W - 14 - PADDLE_W, s.cpuY, PADDLE_W, PADDLE_H);

      // Ball
      ctx.fillStyle = pColor;
      ctx.fillRect(s.ballX, s.ballY, BALL_SIZE, BALL_SIZE);

      // Score
      ctx.font = "bold 20px monospace";
      ctx.fillStyle = pColor + "60";
      ctx.textAlign = "center";
      ctx.fillText(s.pScore, W / 2 - 30, 28);
      ctx.fillText(s.cScore, W / 2 + 30, 28);

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [phase, screenBg, screenText, resetBall]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", width: W, fontSize: 10, fontFamily: "monospace" }}>
        <span style={{ color: screenText || "#88BBEE" }}>TOI: {pScore}</span>
        <span style={{ color: (screenText || "#88BBEE") + "80" }}>Premier à {WIN_SCORE}</span>
        <span style={{ color: screenText || "#88BBEE" }}>CPU: {cScore}</span>
      </div>

      <div style={{ position: "relative", border: `2px solid ${(screenText || "#88BBEE")}40`, borderRadius: 2 }}>
        <canvas ref={canvasRef} width={W} height={H} style={{ display: "block" }} />

        {phase === "START" && (
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            background: (screenBg || "#0a1628") + "E0",
          }}>
            <div style={{ color: screenText || "#88BBEE", fontSize: 20, fontFamily: "monospace", fontWeight: "bold", marginBottom: 6 }}>PONG</div>
            <div style={{ color: (screenText || "#88BBEE") + "AA", fontSize: 10, fontFamily: "monospace", marginBottom: 8 }}>↑/↓ pour déplacer ta raquette</div>
            <button onClick={startGame} style={{
              background: (color || "#4A90D9") + "30", color: screenText || "#88BBEE",
              border: `1px solid ${(color || "#4A90D9")}60`,
              padding: "6px 18px", borderRadius: 3, cursor: "pointer", fontFamily: "monospace", fontSize: 12,
            }}>START</button>
          </div>
        )}

        {phase === "GAMEOVER" && (
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            background: (screenBg || "#0a1628") + "E0",
          }}>
            <div style={{ color: screenText || "#88BBEE", fontSize: 16, fontFamily: "monospace", fontWeight: "bold", marginBottom: 4 }}>
              {winner === "Toi" ? "VICTOIRE !" : "DÉFAITE"}
            </div>
            <div style={{ color: (screenText || "#88BBEE") + "AA", fontSize: 11, fontFamily: "monospace", marginBottom: 8 }}>
              {pScore} - {cScore}
            </div>
            <button onClick={startGame} style={{
              background: (color || "#4A90D9") + "30", color: screenText || "#88BBEE",
              border: `1px solid ${(color || "#4A90D9")}60`,
              padding: "6px 18px", borderRadius: 3, cursor: "pointer", fontFamily: "monospace", fontSize: 12,
            }}>REJOUER</button>
          </div>
        )}
      </div>

      <div style={{ color: (screenText || "#88BBEE") + "80", fontSize: 9, fontFamily: "monospace" }}>
        ↑/↓ pour se déplacer
      </div>
    </div>
  );
}
