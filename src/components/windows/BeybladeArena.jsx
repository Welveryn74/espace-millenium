import { useState, useEffect, useRef, useCallback } from "react";
import { BEYBLADE_TOUPIES } from "../../data/chambreItems";

const ARENA_SIZE = 220;
const ARENA_CENTER = ARENA_SIZE / 2;
const TOUPIE_R = 16;
const ARENA_BOUND = ARENA_SIZE / 2 - TOUPIE_R - 8;
const BATTLE_DURATION = 6000; // ms

// --- Web Audio helpers ---
function playLaunchSound() {
  if (localStorage.getItem('em_muted') === 'true') return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (_) {}
}

function playCollisionSound() {
  if (localStorage.getItem('em_muted') === 'true') return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (_) {}
}

function playWinSound() {
  if (localStorage.getItem('em_muted') === 'true') return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [400, 500, 600, 800].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.2);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.2);
    });
  } catch (_) {}
}

// --- Phase constants ---
const PHASE_SELECT = "select";
const PHASE_COUNTDOWN = "countdown";
const PHASE_BATTLE = "battle";
const PHASE_RESULT = "result";

export default function BeybladeArena() {
  const [phase, setPhase] = useState(PHASE_SELECT);
  const [selected, setSelected] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [winner, setWinner] = useState(null);
  const [countdown, setCountdown] = useState(3);

  // Battle state
  const [p1, setP1] = useState({ x: 0, y: 0 });
  const [p2, setP2] = useState({ x: 0, y: 0 });
  const [spin1, setSpin1] = useState(1);
  const [spin2, setSpin2] = useState(1);
  const animRef = useRef(null);
  const battleStartRef = useRef(0);
  const stateRef = useRef({});
  const collisionCooldown = useRef(0);

  const pickOpponent = useCallback((sel) => {
    const others = BEYBLADE_TOUPIES.filter(t => t.id !== sel.id);
    return others[Math.floor(Math.random() * others.length)];
  }, []);

  const startBattle = useCallback((sel) => {
    const opp = pickOpponent(sel);
    setSelected(sel);
    setOpponent(opp);
    setCountdown(3);
    setPhase(PHASE_COUNTDOWN);

    // Countdown 3..2..1..GO
    let c = 3;
    const iv = setInterval(() => {
      c--;
      if (c > 0) {
        setCountdown(c);
      } else {
        clearInterval(iv);
        setCountdown(0);
        launchBattle(sel, opp);
      }
    }, 700);
  }, [pickOpponent]);

  const launchBattle = useCallback((sel, opp) => {
    playLaunchSound();
    setPhase(PHASE_BATTLE);
    battleStartRef.current = Date.now();
    collisionCooldown.current = 0;

    // Initial positions — opposite sides
    const angle1 = Math.random() * Math.PI * 2;
    const angle2 = angle1 + Math.PI;
    const r = ARENA_BOUND * 0.6;

    const initState = {
      x1: ARENA_CENTER + Math.cos(angle1) * r,
      y1: ARENA_CENTER + Math.sin(angle1) * r,
      x2: ARENA_CENTER + Math.cos(angle2) * r,
      y2: ARENA_CENTER + Math.sin(angle2) * r,
      vx1: (Math.random() - 0.5) * 3,
      vy1: (Math.random() - 0.5) * 3,
      vx2: (Math.random() - 0.5) * 3,
      vy2: (Math.random() - 0.5) * 3,
      spin1: 1,
      spin2: 1,
      sel,
      opp,
    };
    stateRef.current = initState;
    setP1({ x: initState.x1, y: initState.y1 });
    setP2({ x: initState.x2, y: initState.y2 });
    setSpin1(1);
    setSpin2(1);

    // Determine winner: weighted random based on stats
    const total = sel.stat + opp.stat;
    const winnerIsPlayer = Math.random() < (sel.stat / total) * 0.65 + 0.2; // slight bias toward player
    const loserDecayStart = BATTLE_DURATION * 0.5;

    const tick = () => {
      const s = stateRef.current;
      const elapsed = Date.now() - battleStartRef.current;

      // Spiral movement with random perturbation
      const t = elapsed / 1000;
      s.vx1 += (Math.random() - 0.5) * 0.8 - (s.x1 - ARENA_CENTER) * 0.003;
      s.vy1 += (Math.random() - 0.5) * 0.8 - (s.y1 - ARENA_CENTER) * 0.003;
      s.vx2 += (Math.random() - 0.5) * 0.8 - (s.x2 - ARENA_CENTER) * 0.003;
      s.vy2 += (Math.random() - 0.5) * 0.8 - (s.y2 - ARENA_CENTER) * 0.003;

      // Damping
      const damp = 0.96;
      s.vx1 *= damp; s.vy1 *= damp;
      s.vx2 *= damp; s.vy2 *= damp;

      // Update positions
      s.x1 += s.vx1; s.y1 += s.vy1;
      s.x2 += s.vx2; s.y2 += s.vy2;

      // Arena boundary bounce
      const clampToArena = (x, y, vx, vy) => {
        const dx = x - ARENA_CENTER;
        const dy = y - ARENA_CENTER;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > ARENA_BOUND) {
          const nx = dx / dist;
          const ny = dy / dist;
          x = ARENA_CENTER + nx * ARENA_BOUND;
          y = ARENA_CENTER + ny * ARENA_BOUND;
          // Reflect velocity
          const dot = vx * nx + vy * ny;
          vx -= 2 * dot * nx;
          vy -= 2 * dot * ny;
          vx *= 0.7; vy *= 0.7;
        }
        return { x, y, vx, vy };
      };

      const c1 = clampToArena(s.x1, s.y1, s.vx1, s.vy1);
      s.x1 = c1.x; s.y1 = c1.y; s.vx1 = c1.vx; s.vy1 = c1.vy;
      const c2 = clampToArena(s.x2, s.y2, s.vx2, s.vy2);
      s.x2 = c2.x; s.y2 = c2.y; s.vx2 = c2.vx; s.vy2 = c2.vy;

      // Collision detection
      const cdx = s.x2 - s.x1;
      const cdy = s.y2 - s.y1;
      const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
      if (cdist < TOUPIE_R * 2 && elapsed - collisionCooldown.current > 300) {
        collisionCooldown.current = elapsed;
        playCollisionSound();
        const nx = cdx / cdist;
        const ny = cdy / cdist;
        const pushForce = 3;
        s.vx1 -= nx * pushForce; s.vy1 -= ny * pushForce;
        s.vx2 += nx * pushForce; s.vy2 += ny * pushForce;
        // Separate
        const overlap = TOUPIE_R * 2 - cdist;
        s.x1 -= nx * overlap / 2; s.y1 -= ny * overlap / 2;
        s.x2 += nx * overlap / 2; s.y2 += ny * overlap / 2;
      }

      // Spin decay — loser decays after midpoint
      if (elapsed > loserDecayStart) {
        const decayProgress = (elapsed - loserDecayStart) / (BATTLE_DURATION - loserDecayStart);
        if (winnerIsPlayer) {
          s.spin2 = Math.max(0, 1 - decayProgress * 1.2);
          s.spin1 = Math.max(0.3, 1 - decayProgress * 0.2);
        } else {
          s.spin1 = Math.max(0, 1 - decayProgress * 1.2);
          s.spin2 = Math.max(0.3, 1 - decayProgress * 0.2);
        }
      }

      setP1({ x: s.x1, y: s.y1 });
      setP2({ x: s.x2, y: s.y2 });
      setSpin1(s.spin1);
      setSpin2(s.spin2);

      if (elapsed < BATTLE_DURATION) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        // Battle over
        const w = winnerIsPlayer ? s.sel : s.opp;
        setWinner(w);
        setSpin1(winnerIsPlayer ? 0.5 : 0);
        setSpin2(winnerIsPlayer ? 0 : 0.5);
        setPhase(PHASE_RESULT);
        playWinSound();
      }
    };

    animRef.current = requestAnimationFrame(tick);
  }, []);

  // Cleanup rAF on unmount
  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const handleReplay = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setWinner(null);
    setPhase(PHASE_SELECT);
  };

  // --- RENDER ---
  if (phase === PHASE_SELECT) {
    return (
      <div style={{ animation: "fadeIn 0.3s ease-out" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 36 }}>🌀</span>
          <div style={{ color: "#C8B0E8", fontSize: 15, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif", marginTop: 4 }}>
            Beyblade Arena
          </div>
          <div style={{ color: "#8B6BAE", fontSize: 11, marginTop: 4, fontStyle: "italic" }}>
            Choisis ta toupie et affronte un adversaire !
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {BEYBLADE_TOUPIES.map((t) => (
            <div
              key={t.id}
              onClick={() => startBattle(t)}
              style={{
                background: `${t.color}18`,
                border: `2px solid ${t.color}60`,
                borderRadius: 10,
                padding: 14,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = `${t.color}30`; e.currentTarget.style.transform = "scale(1.03)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = `${t.color}18`; e.currentTarget.style.transform = "scale(1)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: `radial-gradient(circle at 35% 35%, ${t.accent}, ${t.color})`,
                  border: `2px solid ${t.color}`,
                  animation: "beybladeRotate 1s linear infinite",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, color: "#fff", fontWeight: "bold",
                }} />
                <div style={{ color: "#E0E0E0", fontSize: 13, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif" }}>
                  {t.name}
                </div>
              </div>
              <div style={{ color: "#999", fontSize: 10, marginTop: 8, lineHeight: 1.5 }}>
                {t.desc}
              </div>
              <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: "#888", fontSize: 9 }}>Puissance:</span>
                <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${(t.stat / 10) * 100}%`, height: "100%", background: t.color, borderRadius: 2 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (phase === PHASE_COUNTDOWN) {
    return (
      <div style={{ animation: "fadeIn 0.2s ease-out", textAlign: "center", paddingTop: 40 }}>
        <div style={{ color: "#C8B0E8", fontSize: 13, marginBottom: 12, fontFamily: "'Tahoma', sans-serif" }}>
          <span style={{ fontWeight: "bold", color: selected.color }}>{selected.name}</span>
          {" vs "}
          <span style={{ fontWeight: "bold", color: opponent.color }}>{opponent.name}</span>
        </div>
        <div style={{
          fontSize: 72, fontWeight: "bold", color: "#FFD700",
          textShadow: "0 0 20px rgba(255,215,0,0.5)",
          animation: "pulse 0.7s ease-in-out infinite",
          fontFamily: "'Tahoma', sans-serif",
        }}>
          {countdown > 0 ? countdown : "GO !"}
        </div>
        <div style={{ color: "#8B6BAE", fontSize: 12, marginTop: 16, fontStyle: "italic" }}>
          3... 2... 1... LET IT RIP !
        </div>
      </div>
    );
  }

  // --- Arena view (battle + result) ---
  const toupieEl = (toupie, pos, spin, isPlayer) => (
    <div style={{
      position: "absolute",
      left: pos.x - TOUPIE_R,
      top: pos.y - TOUPIE_R,
      width: TOUPIE_R * 2,
      height: TOUPIE_R * 2,
      borderRadius: "50%",
      background: `radial-gradient(circle at 35% 35%, ${toupie.accent}, ${toupie.color})`,
      border: `2px solid ${toupie.color}`,
      boxShadow: spin > 0.1 ? `0 0 ${8 * spin}px ${toupie.color}80` : "none",
      animation: spin > 0.05 ? `beybladeRotate ${0.15 / spin}s linear infinite` : "none",
      opacity: spin > 0.05 ? 1 : 0.4,
      transition: "opacity 0.5s",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 8, color: "#fff", fontWeight: "bold",
    }}>
      {spin > 0.05 ? "" : "X"}
    </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out", textAlign: "center" }}>
      {/* VS header */}
      <div style={{ color: "#C8B0E8", fontSize: 12, marginBottom: 8, fontFamily: "'Tahoma', sans-serif" }}>
        <span style={{ fontWeight: "bold", color: selected.color }}>{selected.name}</span>
        {" vs "}
        <span style={{ fontWeight: "bold", color: opponent.color }}>{opponent.name}</span>
      </div>

      {/* Arena */}
      <div style={{
        position: "relative",
        width: ARENA_SIZE, height: ARENA_SIZE,
        margin: "0 auto",
        borderRadius: "50%",
        background: "radial-gradient(circle, #2a2040 0%, #1a1030 60%, #0f0a20 100%)",
        border: "3px solid #4a3a6a",
        boxShadow: "inset 0 0 30px rgba(100,60,160,0.3), 0 0 20px rgba(100,60,160,0.2)",
        overflow: "hidden",
      }}>
        {/* Arena rings */}
        {[0.8, 0.55, 0.3].map((r, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${50 - r * 50}%`, top: `${50 - r * 50}%`,
            width: `${r * 100}%`, height: `${r * 100}%`,
            borderRadius: "50%",
            border: "1px solid rgba(139,107,174,0.15)",
          }} />
        ))}

        {/* Toupies */}
        {selected && toupieEl(selected, p1, spin1, true)}
        {opponent && toupieEl(opponent, p2, spin2, false)}
      </div>

      {/* Result overlay */}
      {phase === PHASE_RESULT && winner && (
        <div style={{ marginTop: 16, animation: "fadeIn 0.3s ease-out" }}>
          <div style={{
            fontSize: 20, fontWeight: "bold",
            color: winner.id === selected.id ? "#FFD700" : "#EF4444",
            fontFamily: "'Tahoma', sans-serif",
            textShadow: winner.id === selected.id ? "0 0 10px rgba(255,215,0,0.5)" : "none",
          }}>
            {winner.id === selected.id ? "VICTOIRE !" : "DÉFAITE..."}
          </div>
          <div style={{ color: "#C8B0E8", fontSize: 12, marginTop: 4 }}>
            {winner.name} remporte le combat !
          </div>
          <button
            onClick={handleReplay}
            style={{
              marginTop: 12,
              background: "linear-gradient(135deg, #8B6BAE, #6B4B8E)",
              border: "2px solid #5a3d7a",
              borderRadius: 8,
              padding: "8px 20px",
              cursor: "pointer",
              fontSize: 12,
              color: "#fff",
              fontWeight: "bold",
              fontFamily: "'Tahoma', sans-serif",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "linear-gradient(135deg, #A080C0, #8B6BAE)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "linear-gradient(135deg, #8B6BAE, #6B4B8E)")}
          >
            🌀 Rejouer ?
          </button>
        </div>
      )}

      {/* Battle flavor text */}
      {phase === PHASE_BATTLE && (
        <div style={{ color: "#8B6BAE", fontSize: 10, marginTop: 12, fontStyle: "italic" }}>
          Les toupies s'affrontent dans l'arène !
        </div>
      )}
    </div>
  );
}
