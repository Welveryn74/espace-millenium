import { useState } from "react";
import { viewTitle, viewSubtitle, viewFlavor, C } from "../../../../styles/chambreStyles";

const LIGHT_COLORS = ["#FF3333", "#33FF33", "#3333FF", "#FFFF33", "#FF33FF", "#33FFFF", "#FF8800", "#FF69B4"];

const PHRASES = [
  "T'allumais la boule disco et t'éteignais la lumière...",
  "Soirée dansante dans la chambre, invités : tes peluches.",
  "Le DJ c'était le lecteur CD avec le best of de Star Academy.",
  "Tu mettais des lunettes de soleil dans le noir. Le style.",
  "Maman criait \"BAISSE LA MUSIQUE\" mais t'entendais pas.",
  "Chorégraphie répétée 47 fois devant le miroir.",
  "L'ambiance fête c'était un samedi soir à 17h.",
  "Les voisins ont jamais su qu'il y avait un club au 3ème étage.",
];

export default function BouleDiscoView() {
  const [partyMode, setPartyMode] = useState(false);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [speed, setSpeed] = useState(1);

  const nextPhrase = () => setPhraseIdx((i) => (i + 1) % PHRASES.length);

  if (partyMode) {
    return (
      <div
        style={{
          position: "absolute", inset: 0, zIndex: 10,
          background: "#000",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          animation: "fadeIn 0.5s ease-out",
          overflow: "hidden",
        }}
      >
        {/* Rayons de lumière */}
        {LIGHT_COLORS.map((color, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 3,
              height: "120%",
              background: `linear-gradient(transparent, ${color}66, transparent)`,
              transformOrigin: "50% 50%",
              animation: `discoRay ${2 + i * 0.3}s linear infinite`,
              animationDelay: `${i * 0.2}s`,
              left: "50%",
              top: "-10%",
            }}
          />
        ))}

        {/* Boule */}
        <DiscoBall size={120} speed={speed} />

        <div style={{
          color: "#fff",
          fontSize: 14,
          fontWeight: "bold",
          marginTop: 20,
          textShadow: "0 0 10px #FF69B4",
          animation: "discoPulse 1s ease-in-out infinite",
          zIndex: 2,
        }}>
          PARTY MODE
        </div>

        {/* Speed controls */}
        <div style={{ display: "flex", gap: 8, marginTop: 12, zIndex: 2 }}>
          {[1, 2, 3].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              style={{
                ...btnStyle,
                background: speed === s ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
                color: speed === s ? "#fff" : "#888",
                border: `1px solid ${speed === s ? "#fff4" : "#fff2"}`,
                fontSize: 9,
                padding: "3px 10px",
              }}
            >
              {"x" + s}
            </button>
          ))}
        </div>

        <button
          onClick={() => setPartyMode(false)}
          style={{
            ...btnStyle,
            marginTop: 16,
            color: "#888",
            border: "1px solid #444",
            background: "rgba(255,255,255,0.05)",
            zIndex: 2,
          }}
        >
          Rallumer la lumière
        </button>

        <style>{`
          @keyframes discoRay {
            from { transform: translateX(-50%) rotate(0deg); }
            to { transform: translateX(-50%) rotate(360deg); }
          }
          @keyframes discoPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ marginBottom: 12 }}>
        <div style={viewTitle}>Boule Disco</div>
        <div style={viewSubtitle}>
          La mini boule à facettes posée sur l'étagère. Prête à transformer la chambre en piste de danse.
        </div>
      </div>

      {/* Boule */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <DiscoBall size={140} speed={1} />
      </div>

      {/* Ambiance fête */}
      <button
        onClick={() => setPartyMode(true)}
        style={{
          ...btnStyle,
          background: "rgba(255,105,180,0.15)",
          color: "#FF69B4",
          border: "1px solid rgba(255,105,180,0.3)",
          fontSize: 12,
          padding: "8px 24px",
          marginBottom: 16,
        }}
      >
        Ambiance fête !
      </button>

      {/* Phrases */}
      <div
        onClick={nextPhrase}
        style={{
          padding: "10px 16px", borderRadius: 8, cursor: "pointer",
          background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`,
          marginBottom: 12,
        }}
      >
        <div style={{ color: C.textDim, fontSize: 11, lineHeight: 1.5, fontStyle: "italic" }}>
          {PHRASES[phraseIdx]}
        </div>
        <div style={{ color: C.textMuted, fontSize: 8, marginTop: 4 }}>Clic pour une autre</div>
      </div>

      {/* Playlist */}
      <div style={{
        padding: 10, borderRadius: 8,
        background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`,
      }}>
        <div style={{ color: C.textMuted, fontSize: 9, marginBottom: 6 }}>Playlist de la soirée :</div>
        {[
          "Star Academy — La musique",
          "Lorie — Près de moi",
          "K-Maro — Femme like U",
          "Tragédie — Hey Oh",
          "Ilona Mitrecey — Un monde parfait",
        ].map((song, i) => (
          <div key={i} style={{
            fontSize: 10, color: C.textDim, padding: "2px 0",
            borderBottom: i < 4 ? `1px solid ${C.border}` : "none",
          }}>
            {i + 1}. {song}
          </div>
        ))}
      </div>

      <div style={viewFlavor}>
        "Je peux avoir une VRAIE boule disco ?" — "T'as déjà celle-là." — Maman, pragmatique.
      </div>
    </div>
  );
}

function DiscoBall({ size, speed }) {
  const facetRows = 6;
  const facetCols = 8;
  const facets = [];

  for (let r = 0; r < facetRows; r++) {
    for (let c = 0; c < facetCols; c++) {
      const theta = (r / facetRows) * Math.PI;
      const phi = (c / facetCols) * 2 * Math.PI;
      const x = Math.sin(theta) * Math.cos(phi);
      const y = Math.cos(theta);
      const z = Math.sin(theta) * Math.sin(phi);

      if (z < -0.1) continue; // cacher l'arrière

      const px = 50 + x * 40;
      const py = 50 - y * 40;
      const brightness = 0.4 + z * 0.6;
      const shimmer = ((r + c) % 3 === 0) ? 1 : 0.6;

      facets.push(
        <div
          key={`${r}-${c}`}
          style={{
            position: "absolute",
            left: `${px}%`,
            top: `${py}%`,
            width: size * 0.06,
            height: size * 0.05,
            borderRadius: 1,
            background: `rgba(255,255,255,${brightness * shimmer})`,
            transform: "translate(-50%, -50%)",
            boxShadow: shimmer > 0.8 ? `0 0 ${size * 0.02}px rgba(255,255,255,0.4)` : "none",
          }}
        />
      );
    }
  }

  return (
    <div style={{
      width: size, height: size,
      position: "relative",
    }}>
      {/* Fil */}
      <div style={{
        position: "absolute",
        top: 0,
        left: "50%",
        width: 2,
        height: size * 0.15,
        background: "linear-gradient(#666, #888)",
        transform: "translateX(-50%)",
        zIndex: 2,
      }} />
      {/* Boule */}
      <div style={{
        position: "absolute",
        top: size * 0.12,
        left: "50%",
        transform: "translateX(-50%)",
        width: size * 0.65,
        height: size * 0.65,
        borderRadius: "50%",
        background: "radial-gradient(circle at 35% 30%, #ddd, #888, #555)",
        boxShadow: `0 0 ${size * 0.1}px rgba(255,255,255,0.2), inset 0 0 ${size * 0.1}px rgba(0,0,0,0.3)`,
        animation: `discoSpin ${3 / speed}s linear infinite`,
        overflow: "hidden",
      }}>
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          {facets}
        </div>
      </div>

      <style>{`
        @keyframes discoSpin {
          from { transform: translateX(-50%) rotateY(0deg); }
          to { transform: translateX(-50%) rotateY(360deg); }
        }
      `}</style>
    </div>
  );
}

const btnStyle = {
  background: C.bg, color: C.primary, border: `1px solid ${C.border}`,
  padding: "6px 14px", borderRadius: 6, cursor: "pointer",
  fontSize: 11, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif",
};
