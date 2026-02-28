import { useState, useEffect, useRef, useCallback } from "react";

const W = 260;
const H = 300;
const COLS = 8;
const BRICK_ROWS = 5;
const BRICK_W = W / COLS - 2;
const BRICK_H = 14;
const PADDLE_W = 44;
const PADDLE_H = 8;
const BALL_R = 4;
const BASE_SPEED = 3;

export default function CasseBriquesGame({ screenBg, screenText, color }) {
  const [phase, setPhase] = useState("START");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const animRef = useRef(null);
  const keysRef = useRef({});
  const mouseXRef = useRef(W / 2);

  const makeBricks = useCallback((lvl) => {
    const bricks = [];
    for (let r = 0; r < BRICK_ROWS; r++)
      for (let c = 0; c < COLS; c++)
        bricks.push({
          x: c * (BRICK_W + 2) + 1,
          y: r * (BRICK_H + 2) + 30,
          alive: true,
          row: r,
          points: (BRICK_ROWS - r) * 10,
        });
    return bricks;
  }, []);

  const initState = useCallback((lvl = 1, sc = 0, lv = 3) => ({
    paddleX: W / 2 - PADDLE_W / 2,
    ballX: W / 2, ballY: H - 40,
    ballVX: (Math.random() > 0.5 ? 1 : -1) * 1.5,
    ballVY: -(BASE_SPEED + (lvl - 1) * 0.3),
    speed: BASE_SPEED + (lvl - 1) * 0.3,
    bricks: makeBricks(lvl),
    score: sc, lives: lv, level: lvl,
    launched: false,
  }), [makeBricks]);

  const startGame = useCallback(() => {
    stateRef.current = initState();
    setScore(0);
    setLives(3);
    setLevel(1);
    setPhase("PLAYING");
  }, [initState]);

  // Keys
  useEffect(() => {
    const down = (e) => { keysRef.current[e.key] = true; };
    const up = (e) => { keysRef.current[e.key] = false; };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  // Mouse
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const move = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseXRef.current = e.clientX - rect.left;
    };
    const click = () => {
      if (stateRef.current && !stateRef.current.launched) stateRef.current.launched = true;
    };
    canvas.addEventListener("mousemove", move);
    canvas.addEventListener("click", click);
    return () => { canvas.removeEventListener("mousemove", move); canvas.removeEventListener("click", click); };
  }, []);

  // Game loop
  useEffect(() => {
    if (phase !== "PLAYING") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const palette = color || "#7B68EE";
    const bg = screenBg || "#1a1030";
    const text = screenText || "#C8B8FF";

    // Row colors
    const rowColors = ["#FF4444", "#FF8844", "#FFCC44", "#44CC44", "#4488FF"];

    const loop = () => {
      const s = stateRef.current;
      if (!s) return;

      // Paddle movement — keyboard
      if (keysRef.current["ArrowLeft"]) s.paddleX = Math.max(0, s.paddleX - 5);
      if (keysRef.current["ArrowRight"]) s.paddleX = Math.min(W - PADDLE_W, s.paddleX + 5);

      // Paddle movement — mouse
      const mx = mouseXRef.current;
      if (mx !== null) {
        const target = mx - PADDLE_W / 2;
        s.paddleX += (target - s.paddleX) * 0.3;
        s.paddleX = Math.max(0, Math.min(W - PADDLE_W, s.paddleX));
      }

      if (!s.launched) {
        // Ball follows paddle before launch
        s.ballX = s.paddleX + PADDLE_W / 2;
        s.ballY = H - 40;

        // Launch on space or click
        if (keysRef.current[" "]) s.launched = true;
      } else {
        // Ball movement
        s.ballX += s.ballVX;
        s.ballY += s.ballVY;

        // Wall bounce
        if (s.ballX - BALL_R <= 0) { s.ballX = BALL_R; s.ballVX = Math.abs(s.ballVX); }
        if (s.ballX + BALL_R >= W) { s.ballX = W - BALL_R; s.ballVX = -Math.abs(s.ballVX); }
        if (s.ballY - BALL_R <= 0) { s.ballY = BALL_R; s.ballVY = Math.abs(s.ballVY); }

        // Paddle bounce
        if (s.ballY + BALL_R >= H - 20 - PADDLE_H && s.ballY + BALL_R <= H - 20 && s.ballVY > 0) {
          if (s.ballX >= s.paddleX && s.ballX <= s.paddleX + PADDLE_W) {
            s.ballVY = -Math.abs(s.ballVY);
            const hit = (s.ballX - s.paddleX) / PADDLE_W - 0.5;
            s.ballVX = hit * s.speed * 2;
            s.ballY = H - 20 - PADDLE_H - BALL_R;
          }
        }

        // Brick collision
        for (const b of s.bricks) {
          if (!b.alive) continue;
          if (s.ballX + BALL_R > b.x && s.ballX - BALL_R < b.x + BRICK_W &&
              s.ballY + BALL_R > b.y && s.ballY - BALL_R < b.y + BRICK_H) {
            b.alive = false;
            s.score += b.points;
            setScore(s.score);

            // Determine bounce direction
            const overlapLeft = (s.ballX + BALL_R) - b.x;
            const overlapRight = (b.x + BRICK_W) - (s.ballX - BALL_R);
            const overlapTop = (s.ballY + BALL_R) - b.y;
            const overlapBottom = (b.y + BRICK_H) - (s.ballY - BALL_R);
            const minOverlapX = Math.min(overlapLeft, overlapRight);
            const minOverlapY = Math.min(overlapTop, overlapBottom);
            if (minOverlapX < minOverlapY) s.ballVX = -s.ballVX;
            else s.ballVY = -s.ballVY;
            break;
          }
        }

        // All bricks cleared → level up
        if (s.bricks.every(b => !b.alive)) {
          s.level++;
          setLevel(s.level);
          s.bricks = makeBricks(s.level);
          s.speed += 0.3;
          s.ballVY = -s.speed;
          s.ballVX = (Math.random() > 0.5 ? 1 : -1) * 1.5;
          s.launched = false;
        }

        // Ball falls
        if (s.ballY > H + 10) {
          s.lives--;
          setLives(s.lives);
          if (s.lives <= 0) { setPhase("GAMEOVER"); return; }
          s.launched = false;
          s.ballVY = -s.speed;
          s.ballVX = (Math.random() > 0.5 ? 1 : -1) * 1.5;
        }
      }

      // DRAW
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Bricks
      for (const b of s.bricks) {
        if (!b.alive) continue;
        ctx.fillStyle = rowColors[b.row % rowColors.length];
        ctx.fillRect(b.x, b.y, BRICK_W, BRICK_H);
        ctx.strokeStyle = bg;
        ctx.lineWidth = 1;
        ctx.strokeRect(b.x, b.y, BRICK_W, BRICK_H);
      }

      // Paddle
      ctx.fillStyle = text;
      ctx.fillRect(s.paddleX, H - 20 - PADDLE_H, PADDLE_W, PADDLE_H);

      // Ball
      ctx.fillStyle = text;
      ctx.beginPath();
      ctx.arc(s.ballX, s.ballY, BALL_R, 0, Math.PI * 2);
      ctx.fill();

      // HUD
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = text + "80";
      ctx.textAlign = "left";
      ctx.fillText(`Score: ${s.score}`, 4, 14);
      ctx.textAlign = "center";
      ctx.fillText(`Lvl ${s.level}`, W / 2, 14);
      ctx.textAlign = "right";
      ctx.fillText("❤".repeat(s.lives), W - 4, 14);

      if (!s.launched) {
        ctx.fillStyle = text + "60";
        ctx.textAlign = "center";
        ctx.font = "10px monospace";
        ctx.fillText("Clic ou Espace pour lancer", W / 2, H / 2);
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [phase, screenBg, screenText, color, makeBricks]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", width: W, fontSize: 10, fontFamily: "monospace" }}>
        <span style={{ color: screenText || "#C8B8FF" }}>SCORE: {score}</span>
        <span style={{ color: (screenText || "#C8B8FF") + "80" }}>{"❤".repeat(lives)}</span>
      </div>

      <div style={{ position: "relative", border: `2px solid ${(screenText || "#C8B8FF")}40`, borderRadius: 2 }}>
        <canvas ref={canvasRef} width={W} height={H} style={{ display: "block", cursor: "none" }} />

        {phase === "START" && (
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            background: (screenBg || "#1a1030") + "E0",
          }}>
            <div style={{ color: screenText || "#C8B8FF", fontSize: 18, fontFamily: "monospace", fontWeight: "bold", marginBottom: 4 }}>CASSE-BRIQUES</div>
            <div style={{ color: (screenText || "#C8B8FF") + "AA", fontSize: 10, fontFamily: "monospace", marginBottom: 2 }}>Souris ou ← → pour bouger</div>
            <div style={{ color: (screenText || "#C8B8FF") + "AA", fontSize: 10, fontFamily: "monospace", marginBottom: 8 }}>Clic ou Espace pour lancer</div>
            <button onClick={startGame} style={{
              background: (color || "#7B68EE") + "30", color: screenText || "#C8B8FF",
              border: `1px solid ${(color || "#7B68EE")}60`,
              padding: "6px 18px", borderRadius: 3, cursor: "pointer", fontFamily: "monospace", fontSize: 12,
            }}>START</button>
          </div>
        )}

        {phase === "GAMEOVER" && (
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            background: (screenBg || "#1a1030") + "E0",
          }}>
            <div style={{ color: screenText || "#C8B8FF", fontSize: 16, fontFamily: "monospace", fontWeight: "bold", marginBottom: 4 }}>GAME OVER</div>
            <div style={{ color: (screenText || "#C8B8FF") + "AA", fontSize: 11, fontFamily: "monospace", marginBottom: 2 }}>Score: {score}</div>
            <div style={{ color: (screenText || "#C8B8FF") + "AA", fontSize: 10, fontFamily: "monospace", marginBottom: 8 }}>Level: {level}</div>
            <button onClick={startGame} style={{
              background: (color || "#7B68EE") + "30", color: screenText || "#C8B8FF",
              border: `1px solid ${(color || "#7B68EE")}60`,
              padding: "6px 18px", borderRadius: 3, cursor: "pointer", fontFamily: "monospace", fontSize: 12,
            }}>REJOUER</button>
          </div>
        )}
      </div>

      <div style={{ color: (screenText || "#C8B8FF") + "80", fontSize: 9, fontFamily: "monospace" }}>
        Souris / ← → pour bouger • Clic / Espace pour lancer
      </div>
    </div>
  );
}
