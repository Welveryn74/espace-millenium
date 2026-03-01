import { useState, useEffect } from "react";
import { viewTitle, viewSubtitle, viewFlavor } from "../../../../styles/chambreStyles";
import { loadState, saveState } from "../../../../utils/storage";

export default function PateAProut({ playing, onPress }) {
  const [proutCount, setProutCount] = useState(() => loadState("em_prout_count", 0));
  const [showText, setShowText] = useState(false);
  const [clouds, setClouds] = useState([]);

  useEffect(() => {
    if (playing) {
      const count = proutCount + 1;
      setProutCount(count);
      saveState("em_prout_count", count);
      setShowText(true);
      setClouds([Date.now(), Date.now() + 1, Date.now() + 2]);
      const t = setTimeout(() => { setShowText(false); setClouds([]); }, 1200);
      return () => clearTimeout(t);
    }
  }, [playing]);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={viewTitle}>La Pâte à Prout</div>
        <div style={viewSubtitle}>Le jouet le plus stupide. Et le plus génial.</div>
      </div>

      {/* Le pot */}
      <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
        {/* Texte PROUUUT */}
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

        {/* Nuages */}
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

        {/* Le pot physique */}
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
          {/* Couvercle */}
          <div style={{
            position: "absolute", top: -6, left: -4, right: -4, height: 12,
            background: "linear-gradient(180deg, #E1BEE7, #CE93D8)",
            borderRadius: "6px 6px 0 0",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }} />
          {/* Blob interieur */}
          <div style={{
            position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
            width: 50, height: 30,
            background: "radial-gradient(ellipse, #E040FB, #AB47BC)",
            borderRadius: playing ? "60% 40% 55% 45% / 50% 60% 40% 50%" : "50%",
            animation: playing ? "none" : "pulse 3s ease-in-out infinite",
            opacity: 0.7,
            transition: "border-radius 0.2s ease",
          }} />
        </div>

        {/* Etiquette */}
        <div style={{
          marginTop: 6, fontSize: 8, color: "#CE93D8", fontWeight: "bold",
          fontFamily: "'Tahoma', sans-serif", letterSpacing: 1,
        }}>
          PÂTE À PROUT
        </div>
      </div>

      {/* Bouton */}
      <div style={{ marginTop: 8 }}>
        <div
          onClick={onPress}
          style={{
            display: "inline-block",
            background: playing
              ? "linear-gradient(135deg, #7B1FA2, #6A1B9A)"
              : "linear-gradient(135deg, #AB47BC, #8E24AA)",
            color: "white", fontWeight: "bold", fontSize: 13,
            padding: "10px 28px", borderRadius: 20, cursor: "pointer",
            fontFamily: "'Tahoma', sans-serif",
            boxShadow: playing
              ? "0 2px 8px rgba(123,31,162,0.3)"
              : "0 4px 15px rgba(155,89,182,0.4)",
            transition: "all 0.15s",
            transform: playing ? "scale(0.95)" : "scale(1)",
          }}
        >
          {playing ? "💨 PROUUUT !" : "APPUYER 👇"}
        </div>
      </div>

      {/* Compteur */}
      <div style={{ marginTop: 16, color: "#CE93D8", fontSize: 11, fontWeight: "bold" }}>
        Prouts : {proutCount}
      </div>

      <div style={viewFlavor}>
        Vendu 2,50 euros en magasin de jouets. Valeur sentimentale : inestimable.
      </div>
    </div>
  );
}
