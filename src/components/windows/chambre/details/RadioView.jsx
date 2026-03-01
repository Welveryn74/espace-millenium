import { getStationList } from "../../../../utils/radioMelodies";

export default function RadioView({ radioOn, toggleRadio, station, changeStation }) {
  const stations = getStationList();

  return (
    <div style={{ textAlign: "center", animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ color: "#C8B0E8", fontSize: 15, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif" }}>
          Poste Radio
        </div>
        <div style={{ color: "#8B6BAE", fontSize: 11, marginTop: 4, fontStyle: "italic" }}>
          Le petit poste gris-marron de la table de nuit. Tu t'endormais en écoutant la musique le soir.
        </div>
      </div>

      <div style={{
        display: "inline-block", padding: "20px 30px", borderRadius: 12,
        background: "linear-gradient(180deg, #8B7355, #6B5335, #5C4528)",
        border: "2px solid #4A3328",
        boxShadow: "inset 0 2px 8px rgba(255,255,255,0.08), 0 4px 15px rgba(0,0,0,0.4)",
      }}>
        <div style={{
          width: 120, height: 40, borderRadius: 4, marginBottom: 14,
          background: "repeating-linear-gradient(0deg, #5C4528 0px, #5C4528 2px, #4A3328 2px, #4A3328 4px)",
          border: "1px solid #4A3328",
          boxShadow: "inset 0 1px 4px rgba(0,0,0,0.3)",
        }} />

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
          {stations.map((s) => (
            <button
              key={s.id}
              onClick={() => changeStation(s.id)}
              style={{
                background: station === s.id ? "rgba(200,176,232,0.2)" : "rgba(255,255,255,0.05)",
                border: station === s.id ? "1px solid rgba(200,176,232,0.5)" : "1px solid rgba(255,255,255,0.1)",
                color: station === s.id ? "#C8B0E8" : "#AAA",
                padding: "5px 10px", borderRadius: 4, cursor: "pointer",
                fontFamily: "'Tahoma', sans-serif", fontSize: 11, fontWeight: station === s.id ? "bold" : "normal",
                transition: "all 0.15s", textAlign: "left",
              }}
            >
              {station === s.id && radioOn ? "▶ " : "○ "}{s.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 20, color: "#666", fontSize: 10 }}>
        Volume non réglable. Les voisins adorent.
      </div>
    </div>
  );
}
