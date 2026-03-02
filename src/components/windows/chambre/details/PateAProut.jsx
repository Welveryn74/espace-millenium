import { useState, useEffect, useRef, useCallback } from "react";
import { viewTitle, viewSubtitle, viewFlavor, C } from "../../../../styles/chambreStyles";
import { loadState, saveState } from "../../../../utils/storage";

const UNLOCK_THRESHOLDS = [10, 25, 50, 100, 200, 500];
const UNLOCK_SOUNDS = [
  { name: "Le Classique", freq: [120, 60], type: "sawtooth", duration: 0.5 },
  { name: "Le Timide", freq: [200, 150], type: "sine", duration: 0.3 },
  { name: "Le Trompette", freq: [80, 40, 120], type: "square", duration: 0.6 },
  { name: "Le Sous-Marin", freq: [60, 30], type: "triangle", duration: 0.8 },
  { name: "L'Infernal", freq: [150, 80, 40, 200], type: "sawtooth", duration: 1.0 },
  { name: "Le Légendaire", freq: [200, 100, 60, 30, 300], type: "square", duration: 1.2 },
];

const MELODY_TONES = [
  { freq: 120, color: "#FF4444", label: "Do" },
  { freq: 90, color: "#44FF44", label: "Ré" },
  { freq: 150, color: "#4444FF", label: "Mi" },
  { freq: 70, color: "#FFD700", label: "Fa" },
];

function playProutSound(sound) {
  if (localStorage.getItem("em_muted") === "true") return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const freqs = sound.freq;
    const step = sound.duration / freqs.length;
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = sound.type;
      const t = ctx.currentTime + i * step;
      osc.frequency.setValueAtTime(f, t);
      osc.frequency.exponentialRampToValueAtTime(Math.max(f * 0.4, 20), t + step);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + step);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + step + 0.05);
    });
  } catch (_) {}
}

function playTone(freq) {
  if (localStorage.getItem("em_muted") === "true") return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (_) {}
}

export default function PateAProut({ playing, onPress }) {
  const [proutCount, setProutCount] = useState(() => loadState("prout_count", 0));
  const [unlocked, setUnlocked] = useState(() => loadState("prout_unlocks", []));
  const [selectedSound, setSelectedSound] = useState(0);
  const [showText, setShowText] = useState(false);
  const [clouds, setClouds] = useState([]);
  const [mode, setMode] = useState(null); // null, "rapide", "melodie", "concours"

  // Mode Rapide state
  const [rapideActive, setRapideActive] = useState(false);
  const [rapideTaps, setRapideTaps] = useState(0);
  const [rapideTimer, setRapideTimer] = useState(5);
  const [rapideRecord, setRapideRecord] = useState(() => loadState("prout_rapide_record", 0));
  const rapideRef = useRef(null);

  // Mode Mélodie state
  const [melodySeq, setMelodySeq] = useState([]);
  const [melodyInput, setMelodyInput] = useState([]);
  const [melodyShowing, setMelodyShowing] = useState(false);
  const [melodyShowIdx, setMelodyShowIdx] = useState(-1);
  const [melodyScore, setMelodyScore] = useState(0);
  const [melodyFail, setMelodyFail] = useState(false);

  // Mode Concours state
  const [concoursActive, setConcoursActive] = useState(false);
  const [concoursBar, setConcoursBar] = useState(0);
  const [concoursDirection, setConcoursDirection] = useState(1);
  const [concoursResult, setConcoursResult] = useState(null);
  const concoursRef = useRef(null);

  useEffect(() => {
    if (playing) {
      const count = proutCount + 1;
      setProutCount(count);
      saveState("prout_count", count);
      // Check unlocks
      const newUnlocks = [...unlocked];
      UNLOCK_THRESHOLDS.forEach((t, i) => {
        if (count >= t && !newUnlocks.includes(i)) newUnlocks.push(i);
      });
      if (newUnlocks.length !== unlocked.length) {
        setUnlocked(newUnlocks);
        saveState("prout_unlocks", newUnlocks);
      }
      playProutSound(UNLOCK_SOUNDS[selectedSound] || UNLOCK_SOUNDS[0]);
      setShowText(true);
      setClouds([Date.now(), Date.now() + 1, Date.now() + 2]);
      const t = setTimeout(() => { setShowText(false); setClouds([]); }, 1200);
      return () => clearTimeout(t);
    }
  }, [playing]);

  // --- Mode Rapide ---
  const startRapide = useCallback(() => {
    setRapideActive(true);
    setRapideTaps(0);
    setRapideTimer(5);
    const start = Date.now();
    rapideRef.current = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const remaining = Math.max(0, 5 - elapsed);
      setRapideTimer(Math.round(remaining * 10) / 10);
      if (remaining <= 0) {
        clearInterval(rapideRef.current);
        setRapideActive(false);
      }
    }, 100);
  }, []);

  const tapRapide = () => {
    if (!rapideActive) return;
    setRapideTaps((t) => {
      const next = t + 1;
      playTone(120 + next * 5);
      return next;
    });
  };

  useEffect(() => {
    if (!rapideActive && rapideTaps > 0) {
      if (rapideTaps > rapideRecord) {
        setRapideRecord(rapideTaps);
        saveState("prout_rapide_record", rapideTaps);
      }
      // Add to total count
      const total = proutCount + rapideTaps;
      setProutCount(total);
      saveState("prout_count", total);
    }
  }, [rapideActive]);

  useEffect(() => () => { if (rapideRef.current) clearInterval(rapideRef.current); }, []);

  // --- Mode Mélodie ---
  const startMelodie = useCallback(() => {
    const seq = Array.from({ length: 4 }, () => Math.floor(Math.random() * 4));
    setMelodySeq(seq);
    setMelodyInput([]);
    setMelodyFail(false);
    setMelodyShowing(true);
    setMelodyShowIdx(-1);
    // Show sequence one by one
    seq.forEach((tone, i) => {
      setTimeout(() => {
        setMelodyShowIdx(i);
        playTone(MELODY_TONES[tone].freq);
      }, (i + 1) * 600);
    });
    setTimeout(() => {
      setMelodyShowing(false);
      setMelodyShowIdx(-1);
    }, (seq.length + 1) * 600);
  }, []);

  const hitMelodyTone = (toneIdx) => {
    if (melodyShowing || melodyFail) return;
    playTone(MELODY_TONES[toneIdx].freq);
    const next = [...melodyInput, toneIdx];
    setMelodyInput(next);
    if (next[next.length - 1] !== melodySeq[next.length - 1]) {
      setMelodyFail(true);
      return;
    }
    if (next.length === melodySeq.length) {
      setMelodyScore((s) => s + 1);
      const total = proutCount + 4;
      setProutCount(total);
      saveState("prout_count", total);
      setTimeout(() => startMelodie(), 800);
    }
  };

  // --- Mode Concours ---
  const startConcours = useCallback(() => {
    setConcoursActive(true);
    setConcoursBar(0);
    setConcoursDirection(1);
    setConcoursResult(null);
    concoursRef.current = setInterval(() => {
      setConcoursBar((b) => {
        let next = b + 2;
        if (next > 100) next = 0;
        return next;
      });
    }, 30);
  }, []);

  const stopConcours = () => {
    clearInterval(concoursRef.current);
    setConcoursActive(false);
    const score = concoursBar > 50 ? 100 - concoursBar : concoursBar;
    const normalized = Math.round(((50 - Math.abs(concoursBar - 50)) / 50) * 100);
    setConcoursResult(normalized);
    const total = proutCount + 1;
    setProutCount(total);
    saveState("prout_count", total);
    if (normalized > 90) playProutSound(UNLOCK_SOUNDS[5] || UNLOCK_SOUNDS[0]);
    else playProutSound(UNLOCK_SOUNDS[0]);
  };

  useEffect(() => () => { if (concoursRef.current) clearInterval(concoursRef.current); }, []);

  // --- RENDER ---
  if (mode === "rapide") {
    return (
      <div style={{ textAlign: "center", animation: "fadeIn 0.3s ease-out" }}>
        <div style={viewTitle}>Mode Rapide</div>
        <div style={viewSubtitle}>Appuie le plus vite possible en 5 secondes !</div>
        <div style={{ margin: "20px 0" }}>
          <div style={{ fontSize: 40, fontWeight: "bold", color: rapideActive ? "#FF4444" : C.primary, fontFamily: "monospace" }}>
            {rapideActive ? rapideTimer.toFixed(1) : rapideTaps > 0 ? `${rapideTaps} prouts !` : "5.0"}
          </div>
          {rapideActive && (
            <div style={{ fontSize: 28, color: "#FFD700", fontWeight: "bold", marginTop: 8 }}>
              {rapideTaps}
            </div>
          )}
        </div>
        {!rapideActive && rapideTaps === 0 && (
          <button onClick={startRapide} style={modeBtnStyle("#FF4444")}>GO !</button>
        )}
        {rapideActive && (
          <div
            onClick={tapRapide}
            style={{
              width: 120, height: 120, borderRadius: "50%", margin: "0 auto",
              background: "linear-gradient(135deg, #AB47BC, #8E24AA)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 40, userSelect: "none",
              boxShadow: "0 4px 20px rgba(155,89,182,0.4)",
              transition: "transform 0.05s", transform: "scale(1)",
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.9)"; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            💨
          </div>
        )}
        {!rapideActive && rapideTaps > 0 && (
          <div>
            <div style={{ color: "#FFD700", fontSize: 14, fontWeight: "bold", margin: "12px 0" }}>
              {rapideTaps >= rapideRecord && rapideTaps > 0 ? "Nouveau record !" : `Record : ${rapideRecord}`}
            </div>
            <button onClick={() => { setRapideTaps(0); startRapide(); }} style={modeBtnStyle("#FF4444")}>Rejouer</button>
          </div>
        )}
        <button onClick={() => { setMode(null); setRapideTaps(0); }} style={{ ...modeBtnStyle(C.textMuted), marginTop: 12 }}>Retour</button>
      </div>
    );
  }

  if (mode === "melodie") {
    return (
      <div style={{ textAlign: "center", animation: "fadeIn 0.3s ease-out" }}>
        <div style={viewTitle}>Mode Mélodie</div>
        <div style={viewSubtitle}>Répète la séquence de 4 tons !</div>
        <div style={{ color: "#FFD700", fontSize: 12, margin: "8px 0" }}>Score : {melodyScore}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxWidth: 200, margin: "16px auto" }}>
          {MELODY_TONES.map((tone, i) => (
            <div
              key={i}
              onClick={() => hitMelodyTone(i)}
              style={{
                height: 60, borderRadius: 8, cursor: melodyShowing ? "default" : "pointer",
                background: melodyShowIdx === i ? tone.color : `${tone.color}40`,
                border: `2px solid ${tone.color}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: "bold", color: "#fff",
                transition: "all 0.15s",
                boxShadow: melodyShowIdx === i ? `0 0 20px ${tone.color}` : "none",
              }}
            >
              {tone.label}
            </div>
          ))}
        </div>
        {melodyShowing && <div style={{ color: C.textDim, fontSize: 11 }}>Écoute bien...</div>}
        {!melodyShowing && melodySeq.length > 0 && !melodyFail && (
          <div style={{ color: C.textDim, fontSize: 11 }}>
            {melodyInput.length}/{melodySeq.length} - À toi !
          </div>
        )}
        {melodyFail && (
          <div style={{ animation: "fadeIn 0.3s ease-out" }}>
            <div style={{ color: "#FF4444", fontSize: 13, fontWeight: "bold", margin: "8px 0" }}>Raté ! Score final : {melodyScore}</div>
            <button onClick={() => { setMelodyScore(0); startMelodie(); }} style={modeBtnStyle("#AB47BC")}>Rejouer</button>
          </div>
        )}
        {melodySeq.length === 0 && (
          <button onClick={startMelodie} style={modeBtnStyle("#AB47BC")}>Commencer</button>
        )}
        <button onClick={() => { setMode(null); setMelodyScore(0); setMelodySeq([]); }} style={{ ...modeBtnStyle(C.textMuted), marginTop: 12 }}>Retour</button>
      </div>
    );
  }

  if (mode === "concours") {
    return (
      <div style={{ textAlign: "center", animation: "fadeIn 0.3s ease-out" }}>
        <div style={viewTitle}>Mode Concours</div>
        <div style={viewSubtitle}>Arrête la jauge au bon moment pour le volume max !</div>
        <div style={{ margin: "20px auto", maxWidth: 250 }}>
          <div style={{
            height: 20, borderRadius: 10, background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)", overflow: "hidden", position: "relative",
          }}>
            <div style={{
              position: "absolute", left: "48%", width: "4%", height: "100%",
              background: "rgba(255,215,0,0.5)", zIndex: 1,
            }} />
            <div style={{
              height: "100%", borderRadius: 10, transition: "width 0.03s linear",
              width: `${concoursBar}%`,
              background: concoursBar > 45 && concoursBar < 55
                ? "linear-gradient(90deg, #4CAF50, #FFD700)"
                : "linear-gradient(90deg, #AB47BC, #8E24AA)",
            }} />
          </div>
          <div style={{ fontSize: 9, color: C.textMuted, marginTop: 4 }}>Zone dorée = Volume MAX</div>
        </div>
        {!concoursActive && concoursResult === null && (
          <button onClick={startConcours} style={modeBtnStyle("#AB47BC")}>GO !</button>
        )}
        {concoursActive && (
          <button onClick={stopConcours} style={modeBtnStyle("#FFD700")}>STOP !</button>
        )}
        {concoursResult !== null && (
          <div style={{ animation: "fadeIn 0.3s ease-out" }}>
            <div style={{
              fontSize: 28, fontWeight: "bold", marginTop: 12,
              color: concoursResult > 90 ? "#FFD700" : concoursResult > 60 ? "#4CAF50" : "#FF4444",
            }}>
              {concoursResult}% {concoursResult > 90 ? "PARFAIT !" : concoursResult > 60 ? "Pas mal !" : "Raté..."}
            </div>
            <button onClick={startConcours} style={{ ...modeBtnStyle("#AB47BC"), marginTop: 8 }}>Rejouer</button>
          </div>
        )}
        <button onClick={() => { setMode(null); setConcoursResult(null); }} style={{ ...modeBtnStyle(C.textMuted), marginTop: 12 }}>Retour</button>
      </div>
    );
  }

  // --- Main View ---
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={viewTitle}>La Pâte à Prout</div>
        <div style={viewSubtitle}>Le jouet le plus stupide. Et le plus génial.</div>
      </div>

      {/* Le pot */}
      <div style={{ position: "relative", display: "inline-block", marginBottom: 12 }}>
        {showText && (
          <div style={{
            position: "absolute", top: -30, left: "50%", transform: "translateX(-50%)",
            color: "#AB47BC", fontSize: 18, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif",
            animation: "popIn 0.3s ease-out", letterSpacing: 2, whiteSpace: "nowrap",
            textShadow: "0 0 10px rgba(171,71,188,0.5)",
          }}>
            PROUUUT !
          </div>
        )}
        {clouds.map((c, i) => (
          <div key={c} style={{
            position: "absolute", fontSize: 20,
            top: -10 - i * 8, left: i === 0 ? "20%" : i === 1 ? "70%" : "45%",
            animation: "heartFloat 1s ease-out forwards",
            animationDelay: `${i * 0.15}s`, opacity: 0,
          }}>
            💨
          </div>
        ))}
        <div
          onClick={onPress}
          style={{
            width: 100, height: 70, borderRadius: "0 0 40px 40px",
            background: "linear-gradient(180deg, #CE93D8, #AB47BC 40%, #7B1FA2)",
            boxShadow: "inset 0 -8px 16px rgba(0,0,0,0.25), inset 0 4px 8px rgba(255,255,255,0.2), 0 4px 12px rgba(123,31,162,0.3)",
            cursor: "pointer", position: "relative", overflow: "hidden",
            transition: "transform 0.15s ease",
            transform: playing ? "scaleY(0.7) scaleX(1.15)" : "scale(1)",
          }}
        >
          <div style={{
            position: "absolute", top: -6, left: -4, right: -4, height: 12,
            background: "linear-gradient(180deg, #E1BEE7, #CE93D8)",
            borderRadius: "6px 6px 0 0", boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }} />
          <div style={{
            position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
            width: 50, height: 30,
            background: "radial-gradient(ellipse, #E040FB, #AB47BC)",
            borderRadius: playing ? "60% 40% 55% 45% / 50% 60% 40% 50%" : "50%",
            animation: playing ? "none" : "pulse 3s ease-in-out infinite",
            opacity: 0.7, transition: "border-radius 0.2s ease",
          }} />
        </div>
        <div style={{ marginTop: 6, fontSize: 8, color: "#CE93D8", fontWeight: "bold", fontFamily: "'Tahoma', sans-serif", letterSpacing: 1 }}>
          PÂTE À PROUT
        </div>
      </div>

      {/* Bouton principal */}
      <div style={{ marginTop: 4 }}>
        <div onClick={onPress} style={{
          display: "inline-block",
          background: playing ? "linear-gradient(135deg, #7B1FA2, #6A1B9A)" : "linear-gradient(135deg, #AB47BC, #8E24AA)",
          color: "white", fontWeight: "bold", fontSize: 13,
          padding: "10px 28px", borderRadius: 20, cursor: "pointer",
          fontFamily: "'Tahoma', sans-serif",
          boxShadow: playing ? "0 2px 8px rgba(123,31,162,0.3)" : "0 4px 15px rgba(155,89,182,0.4)",
          transition: "all 0.15s", transform: playing ? "scale(0.95)" : "scale(1)",
        }}>
          {playing ? "💨 PROUUUT !" : "APPUYER"}
        </div>
      </div>

      {/* Compteur + unlocks */}
      <div style={{ marginTop: 12, color: "#CE93D8", fontSize: 11, fontWeight: "bold" }}>
        Prouts : {proutCount}
      </div>

      {/* Modes de jeu */}
      <div style={{ margin: "16px 0", borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
        <div style={{ color: C.textDim, fontSize: 10, marginBottom: 8 }}>Modes de jeu :</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
          <button onClick={() => setMode("rapide")} style={modeBtnStyle("#FF4444")}>Rapide</button>
          <button onClick={() => setMode("melodie")} style={modeBtnStyle("#AB47BC")}>Mélodie</button>
          <button onClick={() => setMode("concours")} style={modeBtnStyle("#FFD700")}>Concours</button>
        </div>
      </div>

      {/* Sons débloquables */}
      <div style={{ marginTop: 8 }}>
        <div style={{ color: C.textDim, fontSize: 10, marginBottom: 6 }}>Sons ({unlocked.length}/6) :</div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 4 }}>
          {UNLOCK_SOUNDS.map((s, i) => {
            const isUnlocked = unlocked.includes(i);
            const isSelected = selectedSound === i;
            return (
              <div
                key={i}
                onClick={() => isUnlocked && setSelectedSound(i)}
                style={{
                  padding: "3px 8px", borderRadius: 4, fontSize: 10,
                  fontFamily: "'Tahoma', sans-serif",
                  background: isSelected ? "rgba(171,71,188,0.3)" : isUnlocked ? C.bg : "rgba(0,0,0,0.3)",
                  border: isSelected ? "1px solid #AB47BC" : `1px solid ${C.border}`,
                  color: isUnlocked ? (isSelected ? "#CE93D8" : C.textDim) : "#444",
                  cursor: isUnlocked ? "pointer" : "default",
                }}
                title={isUnlocked ? s.name : `Débloqué à ${UNLOCK_THRESHOLDS[i]} prouts`}
              >
                {isUnlocked ? s.name : `${UNLOCK_THRESHOLDS[i]}`}
              </div>
            );
          })}
        </div>
      </div>

      <div style={viewFlavor}>
        Vendu 2,50 euros en magasin de jouets. Valeur sentimentale : inestimable.
      </div>
    </div>
  );
}

function modeBtnStyle(color) {
  return {
    background: `${color}20`,
    color: color,
    border: `1px solid ${color}50`,
    padding: "6px 16px",
    borderRadius: 6,
    cursor: "pointer",
    fontFamily: "'Tahoma', sans-serif",
    fontSize: 11,
    fontWeight: "bold",
    transition: "all 0.15s",
  };
}
