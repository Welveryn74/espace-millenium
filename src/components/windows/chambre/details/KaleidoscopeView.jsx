import { useState } from "react";
import { viewTitle, viewSubtitle, viewFlavor, C } from "../../../../styles/chambreStyles";

const PALETTES = [
  { id: "classique", label: "Classique", colors: ["#FF3333", "#FFD700", "#3388FF", "#33CC66", "#FF66AA", "#FF8800"] },
  { id: "ocean", label: "Océan", colors: ["#0077BE", "#00BFFF", "#20B2AA", "#48D1CC", "#7FFFD4", "#40E0D0"] },
  { id: "foret", label: "Forêt", colors: ["#228B22", "#32CD32", "#9ACD32", "#6B8E23", "#556B2F", "#8FBC8F"] },
  { id: "bonbon", label: "Bonbon", colors: ["#FF69B4", "#FF1493", "#DA70D6", "#FF6EB4", "#FFB6C1", "#FF82AB"] },
  { id: "cosmos", label: "Cosmos", colors: ["#9966FF", "#6633CC", "#FF44FF", "#4488FF", "#CC33FF", "#3366FF"] },
];

const PATTERNS = [
  { id: "triangles", label: "Triangles", segments: 6 },
  { id: "etoile", label: "Étoile", segments: 8 },
  { id: "fleur", label: "Fleur", segments: 12 },
  { id: "diamant", label: "Diamant", segments: 4 },
];

const FUN_FACTS = [
  "Inventé en 1816 par David Brewster, un physicien écossais.",
  "Le mot vient du grec : kalos (beau), eidos (forme), scopein (regarder).",
  "Chaque combinaison est unique. Tu ne verras jamais deux fois la même image.",
  "Brewster l'avait inventé pour étudier la lumière, pas comme jouet.",
  "Il en existe avec des billes, des perles, de l'huile, même des insectes.",
  "Les kaléidoscopes de luxe peuvent coûter plus de 1000 euros.",
];

export default function KaleidoscopeView() {
  const [palette, setPalette] = useState(0);
  const [pattern, setPattern] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [factIdx, setFactIdx] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  const pal = PALETTES[palette];
  const pat = PATTERNS[pattern];

  const turn = () => setRotation((r) => r + 30);
  const nextFact = () => setFactIdx((i) => (i + 1) % FUN_FACTS.length);

  const segments = [];
  const angleStep = 360 / pat.segments;
  for (let i = 0; i < pat.segments; i++) {
    segments.push(
      <div
        key={i}
        style={{
          position: "absolute",
          width: "50%",
          height: "50%",
          top: "25%",
          left: "25%",
          transformOrigin: "50% 50%",
          transform: `rotate(${i * angleStep}deg)`,
        }}
      >
        <div style={{
          width: "100%",
          height: "100%",
          clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.tan((Math.PI * angleStep) / 360)}% 0%)`,
          background: `linear-gradient(${i * angleStep + rotation}deg, ${pal.colors[i % pal.colors.length]}, ${pal.colors[(i + 2) % pal.colors.length]}88)`,
        }} />
        <div style={{
          position: "absolute",
          top: "15%",
          left: "48%",
          width: 6 + (i % 3) * 2,
          height: 6 + (i % 3) * 2,
          borderRadius: i % 2 === 0 ? "50%" : "2px",
          background: pal.colors[(i + 3) % pal.colors.length],
          opacity: 0.7,
          transform: `rotate(${rotation * 2}deg)`,
        }} />
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ marginBottom: 12 }}>
        <div style={viewTitle}>Kaléidoscope</div>
        <div style={viewSubtitle}>
          Tu fermais un oeil et tu tournais... Le monde devenait magique.
        </div>
      </div>

      {/* Viewer */}
      <div
        onClick={turn}
        style={{
          width: 180,
          height: 180,
          margin: "0 auto 16px",
          borderRadius: "50%",
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
          background: "#0a0a15",
          border: `3px solid ${pal.colors[0]}40`,
          boxShadow: `0 0 20px ${pal.colors[0]}20, inset 0 0 30px rgba(0,0,0,0.5)`,
          transform: `rotate(${rotation}deg)`,
          transition: autoRotate ? "none" : "transform 0.5s ease-out",
          animation: autoRotate ? "kaleidoSpin 12s linear infinite" : "none",
        }}
      >
        {segments}
        {/* Centre miroir */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: `radial-gradient(circle, white, ${pal.colors[0]}88)`,
          boxShadow: `0 0 8px ${pal.colors[0]}`,
          zIndex: 2,
        }} />
      </div>

      <div style={{ color: C.textMuted, fontSize: 9, marginBottom: 12 }}>
        Clique pour tourner
      </div>

      {/* Auto-rotate toggle */}
      <button
        onClick={() => setAutoRotate(!autoRotate)}
        style={{
          ...btnStyle,
          background: autoRotate ? `${pal.colors[0]}20` : C.bg,
          color: autoRotate ? pal.colors[0] : C.textDim,
          border: `1px solid ${autoRotate ? pal.colors[0] + "40" : C.border}`,
          marginBottom: 12,
        }}
      >
        {autoRotate ? "Rotation auto" : "Rotation manuelle"}
      </button>

      {/* Palettes */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ color: C.textMuted, fontSize: 9, marginBottom: 6 }}>Couleurs</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
          {PALETTES.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setPalette(i)}
              style={{
                ...btnStyle,
                fontSize: 9,
                padding: "3px 10px",
                background: palette === i ? `${p.colors[0]}20` : C.bg,
                color: palette === i ? p.colors[0] : C.textDim,
                border: `1px solid ${palette === i ? p.colors[0] + "50" : C.border}`,
              }}
            >
              <span style={{
                display: "inline-block",
                width: 8, height: 8, borderRadius: "50%",
                background: `linear-gradient(135deg, ${p.colors[0]}, ${p.colors[2]})`,
                marginRight: 4, verticalAlign: "middle",
              }} />
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Motifs */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ color: C.textMuted, fontSize: 9, marginBottom: 6 }}>Motifs</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
          {PATTERNS.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setPattern(i)}
              style={{
                ...btnStyle,
                fontSize: 9,
                padding: "3px 10px",
                background: pattern === i ? `${pal.colors[0]}20` : C.bg,
                color: pattern === i ? pal.colors[0] : C.textDim,
                border: `1px solid ${pattern === i ? pal.colors[0] + "50" : C.border}`,
              }}
            >
              {p.label} ({p.segments})
            </button>
          ))}
        </div>
      </div>

      {/* Fun fact */}
      <div
        onClick={nextFact}
        style={{
          padding: "10px 16px", borderRadius: 8, cursor: "pointer",
          background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`,
        }}
      >
        <div style={{ color: C.textMuted, fontSize: 9, marginBottom: 4 }}>Le savais-tu ?</div>
        <div style={{ color: C.textDim, fontSize: 11, lineHeight: 1.5, fontStyle: "italic" }}>
          {FUN_FACTS[factIdx]}
        </div>
        <div style={{ color: C.textMuted, fontSize: 8, marginTop: 4 }}>Clic pour un autre</div>
      </div>

      <div style={viewFlavor}>
        "Maman regarde ! C'est trop beau !" — Toi, le nez collé au tube, 1 oeil fermé.
      </div>

      <style>{`
        @keyframes kaleidoSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
