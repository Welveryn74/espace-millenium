import { useState, useEffect, useCallback, useRef } from "react";
import { loadState, saveState } from "../../../utils/storage";

/* ── Constantes ── */
const GRID_COLS = 5;
const GRID_ROWS = 4;
const TOTAL_PLOTS = GRID_COLS * GRID_ROWS;

const CROPS = {
  tomate:    { name: "Tomate",    emoji: "🍅", growTime: 30, value: 3, stages: ["🌱", "🌿", "🪻", "🍅"] },
  fraise:    { name: "Fraise",    emoji: "🍓", growTime: 45, value: 5, stages: ["🌱", "🌿", "🌸", "🍓"] },
  tournesol: { name: "Tournesol", emoji: "🌻", growTime: 60, value: 8, stages: ["🌱", "🌿", "🌼", "🌻"] },
};

const WEATHERS = [
  { id: "soleil", label: "Soleil", emoji: "☀️", speedMult: 1, waterDrain: 1.5, desc: "Il fait beau !" },
  { id: "pluie",  label: "Pluie",  emoji: "🌧️", speedMult: 1.3, waterDrain: 0, desc: "Pas besoin d'arroser !" },
  { id: "orage",  label: "Orage",  emoji: "⛈️", speedMult: 0.5, waterDrain: 0, desc: "Ça pousse moins vite..." },
];

const ADIBOU_IDLE = [
  "Regarde comme c'est joli !",
  "On va avoir une super récolte !",
  "J'adore jardiner avec toi !",
  "N'oublie pas d'arroser !",
  "Les plantes ont soif !",
  "C'est bientôt prêt !",
  "Miam, j'ai déjà faim !",
  "Tu es un vrai jardinier !",
];

const ADIBOU_HARVEST = [
  "Super ! Bonne récolte !",
  "Miam miam miam !",
  "Bravo, c'est magnifique !",
  "On est les meilleurs !",
  "Encore, encore !",
];

const ADIBOU_PLANT = [
  "Hop, en terre !",
  "Ça va être trop bien !",
  "Bonne idée !",
  "J'adore les {crop} !",
];

const ADIBOU_WATER = [
  "Splatch ! Bien arrosé !",
  "Elle avait soif celle-là !",
  "L'eau c'est la vie !",
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createEmptyPlot() {
  return { crop: null, stage: 0, progress: 0, watered: false, waterLevel: 0 };
}

/* ── Composant principal ── */
export default function AdibouGardenGame({ screenBg, screenText, color }) {
  const [plots, setPlots] = useState(() => {
    const saved = loadState("em_adibou_garden", null);
    return saved || Array.from({ length: TOTAL_PLOTS }, createEmptyPlot);
  });
  const [weather, setWeather] = useState(() => randomFrom(WEATHERS));
  const [selectedCrop, setSelectedCrop] = useState("tomate");
  const [tool, setTool] = useState("plant"); // plant | water | harvest
  const [score, setScore] = useState(() => loadState("em_adibou_score", 0));
  const [totalHarvests, setTotalHarvests] = useState(() => loadState("em_adibou_harvests", 0));
  const [adibouMsg, setAdibouMsg] = useState("Bienvenue dans mon jardin !");
  const [adibouAnim, setAdibouAnim] = useState(false);
  const weatherTimer = useRef(null);
  const growTimer = useRef(null);

  // Persistence
  useEffect(() => { saveState("em_adibou_garden", plots); }, [plots]);
  useEffect(() => { saveState("em_adibou_score", score); }, [score]);
  useEffect(() => { saveState("em_adibou_harvests", totalHarvests); }, [totalHarvests]);

  // Adibou speech bubble
  const adibouSay = useCallback((msg) => {
    setAdibouMsg(msg);
    setAdibouAnim(true);
    setTimeout(() => setAdibouAnim(false), 300);
  }, []);

  // Idle Adibou comments
  useEffect(() => {
    const t = setInterval(() => {
      const hasThirsty = plots.some(p => p.crop && !p.watered && p.waterLevel < 30);
      if (hasThirsty && Math.random() > 0.5) {
        adibouSay("N'oublie pas d'arroser !");
      } else {
        adibouSay(randomFrom(ADIBOU_IDLE));
      }
    }, 12000);
    return () => clearInterval(t);
  }, [plots, adibouSay]);

  // Weather changes
  useEffect(() => {
    weatherTimer.current = setInterval(() => {
      setWeather(randomFrom(WEATHERS));
    }, 30000);
    return () => clearInterval(weatherTimer.current);
  }, []);

  // Growth tick (every second)
  useEffect(() => {
    growTimer.current = setInterval(() => {
      setPlots(prev => prev.map(plot => {
        if (!plot.crop) return plot;
        const cropData = CROPS[plot.crop];
        if (plot.stage >= 3) return plot; // fully grown

        // Water drains in sun
        let newWater = plot.waterLevel;
        if (weather.id === "soleil") {
          newWater = Math.max(0, newWater - weather.waterDrain);
        } else if (weather.id === "pluie") {
          newWater = Math.min(100, newWater + 2);
        }

        const isWatered = newWater > 10 || weather.id === "pluie";
        if (!isWatered) return { ...plot, waterLevel: newWater, watered: false };

        const progressInc = (100 / cropData.growTime) * weather.speedMult;
        const newProgress = plot.progress + progressInc;

        if (newProgress >= 100) {
          const newStage = Math.min(plot.stage + 1, 3);
          return { ...plot, stage: newStage, progress: newStage >= 3 ? 100 : 0, waterLevel: newWater, watered: isWatered };
        }
        return { ...plot, progress: newProgress, waterLevel: newWater, watered: isWatered };
      }));
    }, 1000);
    return () => clearInterval(growTimer.current);
  }, [weather]);

  // Actions
  const handlePlot = (index) => {
    const plot = plots[index];

    if (tool === "plant" && !plot.crop) {
      const newPlots = [...plots];
      newPlots[index] = { crop: selectedCrop, stage: 0, progress: 0, watered: false, waterLevel: 0 };
      setPlots(newPlots);
      const msg = randomFrom(ADIBOU_PLANT).replace("{crop}", CROPS[selectedCrop].name + "s");
      adibouSay(msg);
      return;
    }

    if (tool === "water" && plot.crop && plot.stage < 3) {
      const newPlots = [...plots];
      newPlots[index] = { ...plot, watered: true, waterLevel: Math.min(100, plot.waterLevel + 40) };
      setPlots(newPlots);
      adibouSay(randomFrom(ADIBOU_WATER));
      return;
    }

    if (tool === "harvest" && plot.crop && plot.stage >= 3) {
      const cropData = CROPS[plot.crop];
      const newPlots = [...plots];
      newPlots[index] = createEmptyPlot();
      setPlots(newPlots);
      setScore(s => s + cropData.value);
      setTotalHarvests(h => h + 1);
      adibouSay(randomFrom(ADIBOU_HARVEST));
      return;
    }
  };

  const badge = totalHarvests >= 50 ? "Maître Jardinier" : totalHarvests >= 25 ? "Jardinier Expert" : totalHarvests >= 10 ? "Bon Jardinier" : totalHarvests >= 3 ? "Apprenti" : null;

  const toolBtns = [
    { id: "plant", label: "Planter", emoji: "🌱" },
    { id: "water", label: "Arroser", emoji: "💧" },
    { id: "harvest", label: "Récolter", emoji: "🧺" },
  ];

  return (
    <div style={{
      width: "100%", maxWidth: 580, margin: "0 auto", padding: "8px 12px",
      fontFamily: "'Tahoma', sans-serif", color: screenText, position: "relative",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 8, padding: "6px 10px", borderRadius: 8,
        background: `${screenText}10`, border: `1px solid ${screenText}20`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>{weather.emoji}</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: "bold" }}>Météo : {weather.label}</div>
            <div style={{ fontSize: 9, opacity: 0.7 }}>{weather.desc}</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, fontWeight: "bold", color }}>
            {score} points
          </div>
          <div style={{ fontSize: 9, opacity: 0.7 }}>
            {totalHarvests} récoltes
          </div>
          {badge && (
            <div style={{
              fontSize: 8, marginTop: 2, padding: "1px 6px", borderRadius: 3,
              background: "rgba(255,215,0,0.2)", color: "#FFD700", display: "inline-block",
            }}>
              🏆 {badge}
            </div>
          )}
        </div>
      </div>

      {/* Adibou character */}
      <div style={{
        display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8,
      }}>
        <div style={{
          fontSize: 32, transition: "transform 0.3s",
          transform: adibouAnim ? "scale(1.2) rotate(-5deg)" : "scale(1)",
          flexShrink: 0,
        }}>
          🧒
        </div>
        <div style={{
          background: `${screenText}15`, border: `1px solid ${screenText}25`,
          borderRadius: "12px 12px 12px 2px", padding: "6px 10px",
          fontSize: 11, lineHeight: 1.4, fontStyle: "italic",
          maxWidth: 300, position: "relative",
        }}>
          {adibouMsg}
        </div>
      </div>

      {/* Toolbar */}
      <div style={{
        display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap", alignItems: "center",
      }}>
        {toolBtns.map(t => (
          <button
            key={t.id}
            onClick={() => setTool(t.id)}
            style={{
              background: tool === t.id ? `${color}40` : `${screenText}10`,
              border: tool === t.id ? `2px solid ${color}` : `1px solid ${screenText}25`,
              color: screenText, borderRadius: 6, padding: "4px 10px",
              cursor: "pointer", fontSize: 11, fontFamily: "'Tahoma', sans-serif",
              fontWeight: tool === t.id ? "bold" : "normal",
              transition: "all 0.15s",
            }}
          >
            {t.emoji} {t.label}
          </button>
        ))}

        {tool === "plant" && (
          <div style={{ display: "flex", gap: 4, marginLeft: 8 }}>
            {Object.entries(CROPS).map(([key, crop]) => (
              <button
                key={key}
                onClick={() => setSelectedCrop(key)}
                title={`${crop.name} — ${crop.growTime}s, ${crop.value} pts`}
                style={{
                  background: selectedCrop === key ? `${color}30` : `${screenText}08`,
                  border: selectedCrop === key ? `2px solid ${color}` : `1px solid ${screenText}20`,
                  borderRadius: 6, padding: "3px 8px", cursor: "pointer",
                  fontSize: 14, transition: "all 0.15s",
                }}
              >
                {crop.emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Garden grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
        gap: 4,
        padding: 8,
        borderRadius: 10,
        background: "linear-gradient(180deg, #3a2a1a 0%, #5a4a2a 100%)",
        border: `2px solid ${screenText}20`,
      }}>
        {plots.map((plot, i) => {
          const cropData = plot.crop ? CROPS[plot.crop] : null;
          const isReady = plot.stage >= 3;
          const canAct =
            (tool === "plant" && !plot.crop) ||
            (tool === "water" && plot.crop && plot.stage < 3) ||
            (tool === "harvest" && isReady);

          return (
            <div
              key={i}
              onClick={() => handlePlot(i)}
              style={{
                aspectRatio: "1", borderRadius: 6,
                background: plot.crop
                  ? `linear-gradient(180deg, #4a6a2a 0%, #3a5a1a 100%)`
                  : "linear-gradient(180deg, #6a5a3a 0%, #5a4a2a 100%)",
                border: canAct ? `2px solid ${color}80` : "1px solid rgba(255,255,255,0.1)",
                cursor: canAct ? "pointer" : "default",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                position: "relative", transition: "all 0.2s",
                transform: canAct ? "scale(1)" : "scale(1)",
                boxShadow: isReady ? `0 0 10px ${color}40` : "none",
              }}
              onMouseEnter={e => {
                if (canAct) e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {plot.crop ? (
                <>
                  <span style={{
                    fontSize: 22,
                    animation: isReady ? "plotBounce 0.8s ease-in-out infinite" : "none",
                    filter: plot.watered ? "none" : "brightness(0.7)",
                  }}>
                    {cropData.stages[plot.stage]}
                  </span>
                  {/* Progress bar */}
                  {plot.stage < 3 && (
                    <div style={{
                      position: "absolute", bottom: 3, left: 4, right: 4, height: 3,
                      borderRadius: 2, background: "rgba(0,0,0,0.4)",
                    }}>
                      <div style={{
                        height: "100%", borderRadius: 2,
                        background: plot.watered ? "#4CAF50" : "#FF9800",
                        width: `${plot.progress}%`,
                        transition: "width 1s linear",
                      }} />
                    </div>
                  )}
                  {/* Water indicator */}
                  {plot.stage < 3 && plot.waterLevel < 20 && weather.id !== "pluie" && (
                    <span style={{
                      position: "absolute", top: 1, right: 2, fontSize: 8,
                      animation: "plotBounce 1s ease-in-out infinite",
                    }}>
                      💧
                    </span>
                  )}
                </>
              ) : (
                <span style={{ fontSize: 10, opacity: 0.4 }}>
                  {tool === "plant" ? "+" : "·"}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{
        display: "flex", justifyContent: "center", gap: 12, marginTop: 8,
        fontSize: 9, opacity: 0.6,
      }}>
        {Object.entries(CROPS).map(([key, crop]) => (
          <span key={key}>
            {crop.emoji} {crop.name} — {crop.growTime}s, {crop.value}pts
          </span>
        ))}
      </div>

      {/* Reset button */}
      <div style={{ textAlign: "center", marginTop: 8 }}>
        <button
          onClick={() => {
            setPlots(Array.from({ length: TOTAL_PLOTS }, createEmptyPlot));
            adibouSay("Un nouveau jardin tout propre !");
          }}
          style={{
            background: "none", border: `1px solid ${screenText}30`,
            color: `${screenText}80`, borderRadius: 4, padding: "3px 12px",
            cursor: "pointer", fontSize: 9, fontFamily: "'Tahoma', sans-serif",
          }}
        >
          🔄 Nouveau jardin
        </button>
      </div>

      <style>{`
        @keyframes plotBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
}
