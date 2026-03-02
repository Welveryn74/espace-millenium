import { useState, useEffect, useRef, useCallback } from "react";

const PHASE_TIMING = { play: 400, static: 800, tracking: 1200 };

// Static noise canvas — random pixels at ~15fps
function StaticNoise({ width = 320, height = 240 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = ctx.createImageData(width, height);
    let raf;

    let lastFrame = 0;
    const draw = (t) => {
      if (t - lastFrame > 66) { // ~15fps
        const d = img.data;
        for (let i = 0; i < d.length; i += 4) {
          const v = Math.random() * 255;
          d[i] = d[i + 1] = d[i + 2] = v;
          d[i + 3] = 255;
        }
        ctx.putImageData(img, 0, 0);
        lastFrame = t;
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", imageRendering: "pixelated" }}
    />
  );
}

export default function VHSTapeTransition({ onComplete }) {
  const [phase, setPhase] = useState("play"); // play → static → tracking → done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("static"), PHASE_TIMING.play);
    const t2 = setTimeout(() => setPhase("tracking"), PHASE_TIMING.static);
    const t3 = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, PHASE_TIMING.tracking);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  // Play VHS noise sound
  useEffect(() => {
    if (phase !== "static") return;
    if (localStorage.getItem("em_muted") === "true") return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.2;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 600;
      filter.Q.value = 1;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      noise.connect(filter).connect(gain).connect(ctx.destination);
      noise.start();
      noise.stop(ctx.currentTime + 0.4);
    } catch (_) { /* silent fallback */ }
  }, [phase]);

  const skip = useCallback(() => {
    setPhase("done");
    onComplete();
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <div
      onClick={skip}
      style={{
        position: "absolute", inset: 0, zIndex: 100,
        background: "#000", cursor: "pointer", overflow: "hidden",
      }}
    >
      {/* Phase 1: PLAY ▶ */}
      {phase === "play" && (
        <div style={{
          position: "absolute", bottom: 24, left: 20,
          color: "#fff", fontFamily: "'Courier New', monospace",
          fontSize: 16, textShadow: "1px 1px 3px rgba(0,0,0,0.8)",
        }}>
          PLAY ▶
        </div>
      )}

      {/* Phase 2: TV static */}
      {phase === "static" && <StaticNoise />}

      {/* Phase 3: Blue tracking bars + fade */}
      {phase === "tracking" && (
        <div style={{
          position: "absolute", inset: 0,
          background: "repeating-linear-gradient(0deg, #000a1a 0px, #001133 4px, #000a1a 8px, transparent 12px)",
          animation: "vhs-scroll 0.3s linear infinite",
          opacity: 0.85,
        }}>
          <style>{`@keyframes vhs-scroll { from { transform: translateY(0); } to { transform: translateY(12px); } }`}</style>
        </div>
      )}

      {/* Fade-out overlay for tracking phase */}
      {phase === "tracking" && (
        <div style={{
          position: "absolute", inset: 0,
          background: "#000",
          animation: "vhs-fadeout 0.4s ease forwards",
        }}>
          <style>{`@keyframes vhs-fadeout { from { opacity: 0.9; } to { opacity: 0; } }`}</style>
        </div>
      )}

      {/* Skip hint */}
      <div style={{
        position: "absolute", bottom: 8, right: 12,
        color: "rgba(255,255,255,0.3)", fontSize: 10,
        fontFamily: "'Courier New', monospace",
      }}>
        Clic pour passer
      </div>
    </div>
  );
}
