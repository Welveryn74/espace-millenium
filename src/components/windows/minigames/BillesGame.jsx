import { useState, useRef, useEffect, useCallback } from "react";

const ARENA_SIZE = 300;
const ARENA_R = ARENA_SIZE / 2;
const FRICTION = 0.97;
const MIN_VEL = 0.2;
const CALOT_R = 12;
const TARGET_R = 8;
const MAX_SHOTS = 3;

function dist(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function randomTargets(count) {
  const targets = [];
  for (let i = 0; i < count; i++) {
    let t;
    let tries = 0;
    do {
      const angle = Math.random() * Math.PI * 2;
      const r = 30 + Math.random() * (ARENA_R - 60);
      t = { x: ARENA_R + Math.cos(angle) * r, y: ARENA_R + Math.sin(angle) * r, vx: 0, vy: 0, alive: true };
      tries++;
    } while (tries < 50 && targets.some(o => dist(t, o) < TARGET_R * 3));
    targets.push(t);
  }
  return targets;
}

export default function BillesGame({ onBack, billes, onScore }) {
  const [phase, setPhase] = useState("AIM"); // AIM, ROLLING, DONE
  const [calot, setCalot] = useState({ x: ARENA_R, y: ARENA_SIZE - 30, vx: 0, vy: 0 });
  const [targets, setTargets] = useState(() => randomTargets(6));
  const [score, setScore] = useState(0);
  const [shotsLeft, setShotsLeft] = useState(MAX_SHOTS);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);

  const calotRef = useRef({ x: ARENA_R, y: ARENA_SIZE - 30, vx: 0, vy: 0 });
  const targetsRef = useRef(targets);
  const scoreRef = useRef(0);
  const animRef = useRef(null);
  const arenaRef = useRef(null);

  // Sync refs
  useEffect(() => { targetsRef.current = targets; }, [targets]);

  // Colors from billes data
  const billeColors = billes ? billes.map(b => b.colors) : [
    ["#1E90FF","#87CEFA","#1E90FF"], ["#FF6347","#FFD700","#FF4500"],
    ["#191970","#9370DB","#000080"], ["#32CD32","#ADFF2F","#228B22"],
    ["#E0E0E0","#FFFFFF","#C0C0C0"], ["#FF1493","#FF69B4","#FF1493"],
  ];

  const getArenaPos = useCallback((e) => {
    if (!arenaRef.current) return { x: 0, y: 0 };
    const rect = arenaRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const handlePointerDown = useCallback((e) => {
    if (phase !== "AIM") return;
    const pos = getArenaPos(e);
    const c = calotRef.current;
    if (dist(pos, c) < CALOT_R * 2) {
      setDragging(true);
      setDragStart(pos);
      setDragEnd(pos);
    }
  }, [phase, getArenaPos]);

  const handlePointerMove = useCallback((e) => {
    if (!dragging) return;
    setDragEnd(getArenaPos(e));
  }, [dragging, getArenaPos]);

  const handlePointerUp = useCallback(() => {
    if (!dragging || !dragStart || !dragEnd) { setDragging(false); return; }
    const dx = dragStart.x - dragEnd.x;
    const dy = dragStart.y - dragEnd.y;
    const power = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.15, 12);

    if (power < 0.5) { setDragging(false); return; }

    const angle = Math.atan2(dy, dx);
    calotRef.current.vx = Math.cos(angle) * power;
    calotRef.current.vy = Math.sin(angle) * power;

    setShotsLeft(s => s - 1);
    setDragging(false);
    setDragStart(null);
    setDragEnd(null);
    setPhase("ROLLING");
    startPhysics();
  }, [dragging, dragStart, dragEnd]);

  const startPhysics = useCallback(() => {
    const tick = () => {
      const c = calotRef.current;
      const t = targetsRef.current;

      // Move calot
      c.x += c.vx;
      c.y += c.vy;
      c.vx *= FRICTION;
      c.vy *= FRICTION;

      // Arena bounds for calot
      const dCenter = dist(c, { x: ARENA_R, y: ARENA_R });
      if (dCenter + CALOT_R > ARENA_R) {
        const angle = Math.atan2(c.y - ARENA_R, c.x - ARENA_R);
        c.x = ARENA_R + Math.cos(angle) * (ARENA_R - CALOT_R);
        c.y = ARENA_R + Math.sin(angle) * (ARENA_R - CALOT_R);
        // Bounce off wall
        const nx = Math.cos(angle);
        const ny = Math.sin(angle);
        const dot = c.vx * nx + c.vy * ny;
        c.vx -= 2 * dot * nx * 0.5;
        c.vy -= 2 * dot * ny * 0.5;
      }

      // Collisions with targets
      let updated = false;
      const newTargets = t.map((tgt, i) => {
        if (!tgt.alive) return tgt;
        let tx = tgt.x + tgt.vx;
        let ty = tgt.y + tgt.vy;
        tgt.vx *= FRICTION;
        tgt.vy *= FRICTION;

        // Calot -> target collision
        const d = dist(c, { x: tx, y: ty });
        if (d < CALOT_R + TARGET_R) {
          const angle = Math.atan2(ty - c.y, tx - c.x);
          const overlap = CALOT_R + TARGET_R - d;
          tx += Math.cos(angle) * overlap * 0.5;
          ty += Math.sin(angle) * overlap * 0.5;
          // Transfer momentum
          const relVx = c.vx - tgt.vx;
          const relVy = c.vy - tgt.vy;
          tgt.vx = relVx * 0.6;
          tgt.vy = relVy * 0.6;
          c.vx *= 0.4;
          c.vy *= 0.4;
          updated = true;
        }

        // Target arena bounds — out = eliminated
        const tDist = dist({ x: tx, y: ty }, { x: ARENA_R, y: ARENA_R });
        if (tDist + TARGET_R > ARENA_R + 5) {
          scoreRef.current++;
          return { ...tgt, x: tx, y: ty, alive: false };
        }

        // Bounce target off wall
        if (tDist + TARGET_R > ARENA_R) {
          const angle = Math.atan2(ty - ARENA_R, tx - ARENA_R);
          tx = ARENA_R + Math.cos(angle) * (ARENA_R - TARGET_R);
          ty = ARENA_R + Math.sin(angle) * (ARENA_R - TARGET_R);
          const nx = Math.cos(angle);
          const ny = Math.sin(angle);
          const dot = tgt.vx * nx + tgt.vy * ny;
          tgt.vx -= 2 * dot * nx * 0.5;
          tgt.vy -= 2 * dot * ny * 0.5;
        }

        return { ...tgt, x: tx, y: ty };
      });

      if (updated) targetsRef.current = newTargets;

      // Check if everything stopped
      const allStopped = Math.abs(c.vx) < MIN_VEL && Math.abs(c.vy) < MIN_VEL &&
        newTargets.every(t => !t.alive || (Math.abs(t.vx) < MIN_VEL && Math.abs(t.vy) < MIN_VEL));

      setCalot({ ...c });
      setTargets([...newTargets]);
      setScore(scoreRef.current);

      if (allStopped) {
        c.vx = 0;
        c.vy = 0;
        newTargets.forEach(t => { t.vx = 0; t.vy = 0; });
        // Check end conditions
        const alive = newTargets.filter(t => t.alive).length;
        if (alive === 0 || shotsLeft <= 1) {
          setPhase("DONE");
          if (onScore) onScore(scoreRef.current);
        } else {
          setPhase("AIM");
        }
        return;
      }

      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
  }, [shotsLeft]);

  useEffect(() => {
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const restart = () => {
    const newTargets = randomTargets(6);
    setTargets(newTargets);
    targetsRef.current = newTargets;
    const c = { x: ARENA_R, y: ARENA_SIZE - 30, vx: 0, vy: 0 };
    setCalot(c);
    calotRef.current = c;
    setScore(0);
    scoreRef.current = 0;
    setShotsLeft(MAX_SHOTS);
    setPhase("AIM");
  };

  const aliveCount = targets.filter(t => t.alive).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ display: "flex", justifyContent: "space-between", width: ARENA_SIZE, fontSize: 11, fontFamily: "'Tahoma', sans-serif" }}>
        <span style={{ color: "#C8B0E8" }}>Éliminées : {score}/{targets.length}</span>
        <span style={{ color: "#8B6BAE" }}>Tirs restants : {shotsLeft}</span>
      </div>

      {/* Arena */}
      <div
        ref={arenaRef}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={() => { if (dragging) { setDragging(false); setDragStart(null); setDragEnd(null); } }}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        style={{
          width: ARENA_SIZE, height: ARENA_SIZE, borderRadius: "50%",
          background: "radial-gradient(circle, #D2B48C 0%, #C4A67C 60%, #A0845C 100%)",
          border: "4px solid #8B7355",
          position: "relative", overflow: "hidden", cursor: phase === "AIM" ? "crosshair" : "default",
          boxShadow: "inset 0 0 40px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.4)",
        }}
      >
        {/* Aiming line */}
        {dragging && dragStart && dragEnd && (
          <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={ARENA_SIZE} height={ARENA_SIZE}>
            <line x1={calotRef.current.x} y1={calotRef.current.y}
              x2={calotRef.current.x + (dragStart.x - dragEnd.x) * 0.8}
              y2={calotRef.current.y + (dragStart.y - dragEnd.y) * 0.8}
              stroke="rgba(255,255,255,0.5)" strokeWidth={2} strokeDasharray="4,4" />
          </svg>
        )}

        {/* Target billes */}
        {targets.map((t, i) => t.alive && (
          <div key={i} style={{
            position: "absolute",
            left: t.x - TARGET_R, top: t.y - TARGET_R,
            width: TARGET_R * 2, height: TARGET_R * 2,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%, ${(billeColors[i % billeColors.length])[1]}, ${(billeColors[i % billeColors.length])[0]} 50%, ${(billeColors[i % billeColors.length])[2]} 100%)`,
            boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.4)",
          }} />
        ))}

        {/* Calot (player) */}
        <div style={{
          position: "absolute",
          left: calot.x - CALOT_R, top: calot.y - CALOT_R,
          width: CALOT_R * 2, height: CALOT_R * 2,
          borderRadius: "50%",
          background: "radial-gradient(circle at 30% 30%, #87CEFA, #1E90FF 50%, #1E90FF)",
          boxShadow: "inset 0 -3px 6px rgba(0,0,0,0.3), inset 0 3px 6px rgba(255,255,255,0.5), 0 2px 6px rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.3)",
        }} />

        {/* Done overlay */}
        {phase === "DONE" && (
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.6)", borderRadius: "50%",
          }}>
            <div style={{ color: "#FFD700", fontSize: 18, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif", marginBottom: 4 }}>
              {aliveCount === 0 ? "Parfait !" : "Partie terminée !"}
            </div>
            <div style={{ color: "#E0E0E0", fontSize: 13, marginBottom: 8 }}>
              {score} bille{score > 1 ? "s" : ""} éliminée{score > 1 ? "s" : ""}
            </div>
            <button onClick={restart} style={{
              background: "rgba(200,176,232,0.2)", color: "#C8B0E8",
              border: "1px solid rgba(200,176,232,0.4)", padding: "6px 16px",
              borderRadius: 4, cursor: "pointer", fontFamily: "'Tahoma', sans-serif", fontSize: 12,
            }}>Rejouer</button>
          </div>
        )}
      </div>

      <div style={{ color: "#8B6BAE", fontSize: 9, fontFamily: "'Tahoma', sans-serif", textAlign: "center" }}>
        {phase === "AIM" ? "Clique et glisse sur le calot bleu pour viser, relâche pour tirer !" : phase === "ROLLING" ? "La bille roule..." : ""}
      </div>
    </div>
  );
}
