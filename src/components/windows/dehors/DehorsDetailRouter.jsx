import CityStadeView from "./details/CityStadeView";
import McDoAnnivView from "./details/McDoAnnivView";
import LaserGameView from "./details/LaserGameView";
import GouterView from "./details/GouterView";
import CourRecreView from "./details/CourRecreView";

const backBtnStyle = {
  background: "none",
  border: "1px solid rgba(68,170,68,0.5)",
  color: "#44AA44",
  padding: "4px 12px",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 11,
  fontWeight: "bold",
  fontFamily: "'Tahoma', sans-serif",
};

export default function DehorsDetailRouter({ activeLieu, goBack }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column",
      background: "linear-gradient(180deg, #1a2a1a 0%, #0d1a0d 100%)" }}>
      <div style={{ padding: "8px 12px", borderBottom: "1px solid rgba(68,170,68,0.3)" }}>
        <button
          onClick={goBack}
          style={backBtnStyle}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(68,170,68,0.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          ← Retour au quartier
        </button>
      </div>
      <div
        key={activeLieu}
        style={{ flex: 1, overflowY: "auto", padding: 16, animation: "slideUp 0.3s ease-out" }}
      >
        {activeLieu === "cityStade" && <CityStadeView />}
        {activeLieu === "mcdo" && <McDoAnnivView />}
        {activeLieu === "laserGame" && <LaserGameView />}
        {activeLieu === "gouter" && <GouterView />}
        {activeLieu === "courRecre" && <CourRecreView />}
      </div>
    </div>
  );
}
