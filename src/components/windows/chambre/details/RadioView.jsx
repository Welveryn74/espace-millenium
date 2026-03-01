import { getStationList } from "../../../../utils/radioMelodies";
import { viewTitle, viewSubtitle, viewFlavor, C } from "../../../../styles/chambreStyles";

const STATION_ICONS = { nrj: "♪", rtl2: "♫", fun: "♬", inter: "📰" };

export default function RadioView({ radioOn, toggleRadio, station, changeStation }) {
  const stations = getStationList();
  const stationIndex = stations.findIndex((s) => s.id === station);
  const cursorPos = stations.length > 1 ? (stationIndex / (stations.length - 1)) * 100 : 50;

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={viewTitle}>Poste Radio</div>
        <div style={viewSubtitle}>
          Le petit poste gris-marron de la table de nuit. Tu t'endormais en écoutant la musique le soir.
        </div>
      </div>

      <div style={{
        display: "inline-block", padding: "20px 30px", borderRadius: 12,
        background: "linear-gradient(180deg, #8B7355, #6B5335, #5C4528)",
        border: "2px solid #4A3328",
        boxShadow: "inset 0 2px 8px rgba(255,255,255,0.08), 0 4px 15px rgba(0,0,0,0.4)",
        position: "relative",
      }}>
        {/* LED indicator */}
        <div style={{
          position: "absolute", top: 10, right: 10,
          width: 6, height: 6, borderRadius: "50%",
          background: radioOn ? "#44FF44" : "#FF4444",
          boxShadow: radioOn ? "0 0 6px #44FF44, 0 0 12px #44FF4480" : "none",
          animation: radioOn ? "pulse 1.5s ease-in-out infinite" : "none",
        }} />

        {/* Grille tuning avec curseur */}
        <div style={{
          width: 120, height: 40, borderRadius: 4, marginBottom: 14,
          background: "repeating-linear-gradient(0deg, #5C4528 0px, #5C4528 2px, #4A3328 2px, #4A3328 4px)",
          border: "1px solid #4A3328",
          boxShadow: "inset 0 1px 4px rgba(0,0,0,0.3)",
          position: "relative", overflow: "hidden",
        }}>
          {/* Curseur tuning */}
          <div style={{
            position: "absolute", top: 2, bottom: 2,
            left: `${cursorPos}%`, width: 2,
            background: "#FFD700", borderRadius: 1,
            boxShadow: "0 0 4px #FFD70080",
            transition: "left 0.3s ease",
          }} />
        </div>

        {/* Equalizer */}
        <div style={{
          display: "flex", justifyContent: "center", gap: 3, marginBottom: 12, height: 20,
          alignItems: "flex-end",
        }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{
              width: 4, borderRadius: 1,
              background: radioOn ? "#88FF88" : "#666",
              height: radioOn ? undefined : 4,
              animation: radioOn ? `equalizerBar 0.${4 + i * 2}s ease-in-out ${i * 0.1}s infinite` : "none",
              transition: "background 0.3s",
            }} />
          ))}
        </div>

        <button
          onClick={toggleRadio}
          style={{
            width: "100%", padding: "8px 0", borderRadius: 6,
            background: radioOn ? "rgba(100,255,100,0.2)" : "rgba(255,100,100,0.15)",
            color: radioOn ? "#88FF88" : "#FF8888",
            border: radioOn ? "1px solid rgba(100,255,100,0.4)" : "1px solid rgba(255,100,100,0.3)",
            fontFamily: "'Tahoma', sans-serif", fontSize: 13, fontWeight: "bold",
            cursor: "pointer", transition: "all 0.15s",
          }}
        >
          {radioOn ? "🔊 ON — Éteindre" : "🔇 OFF — Allumer"}
        </button>

        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
          {stations.map((s) => {
            const active = station === s.id;
            const icon = STATION_ICONS[s.id] || "♪";
            return (
              <button
                key={s.id}
                onClick={() => changeStation(s.id)}
                style={{
                  background: active ? "rgba(200,176,232,0.2)" : "rgba(255,255,255,0.05)",
                  border: active ? "1px solid rgba(200,176,232,0.5)" : "1px solid rgba(255,255,255,0.1)",
                  color: active ? C.primary : C.textDim,
                  padding: "5px 10px", borderRadius: 4, cursor: "pointer",
                  fontFamily: "'Tahoma', sans-serif", fontSize: 11,
                  fontWeight: active ? "bold" : "normal",
                  transition: "all 0.2s ease", textAlign: "left",
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                <span style={{ fontSize: 12 }}>{icon}</span>
                <span style={{ flex: 1 }}>
                  {active && radioOn ? "▶ " : "○ "}{s.name}
                </span>
                {active && radioOn && (
                  <span style={{
                    fontSize: 9, color: "#88FF88",
                    animation: "marquee 4s linear infinite",
                    display: "inline-block", maxWidth: 50, overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}>
                    ♪ En cours...
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div style={viewFlavor}>
        Volume non réglable. Les voisins adorent.
      </div>
    </div>
  );
}
