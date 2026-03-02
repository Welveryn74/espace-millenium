import { useState } from "react";
import { viewTitle, viewSubtitle, viewFlavor, C } from "../../../../styles/chambreStyles";
import { loadState, saveState } from "../../../../utils/storage";

const FEUILLES = [
  { id: "fraise", parfum: "Fraise", color: "#FF6B6B", emoji: "🍓", bgPattern: "radial-gradient(circle at 30% 40%, #FFB3B3 20%, #FF9999 40%, #FF8080)" },
  { id: "vanille", parfum: "Vanille", color: "#FFE082", emoji: "🍦", bgPattern: "radial-gradient(circle at 60% 30%, #FFF8E1 20%, #FFE082 40%, #FFD54F)" },
  { id: "pomme", parfum: "Pomme Verte", color: "#81C784", emoji: "🍏", bgPattern: "radial-gradient(circle at 40% 50%, #C8E6C9 20%, #A5D6A7 40%, #81C784)" },
  { id: "chocolat", parfum: "Chocolat", color: "#A1887F", emoji: "🍫", bgPattern: "radial-gradient(circle at 50% 40%, #D7CCC8 20%, #BCAAA4 40%, #A1887F)" },
  { id: "cerise", parfum: "Cerise", color: "#E91E63", emoji: "🍒", bgPattern: "radial-gradient(circle at 35% 45%, #F8BBD0 20%, #F48FB1 40%, #EC407A)" },
  { id: "orange", parfum: "Orange", color: "#FF9800", emoji: "🍊", bgPattern: "radial-gradient(circle at 45% 35%, #FFE0B2 20%, #FFCC80 40%, #FFB74D)" },
  { id: "menthe", parfum: "Menthe", color: "#80CBC4", emoji: "🌿", bgPattern: "radial-gradient(circle at 55% 45%, #E0F2F1 20%, #B2DFDB 40%, #80CBC4)" },
  { id: "mure", parfum: "Mûre", color: "#9C27B0", emoji: "🫐", bgPattern: "radial-gradient(circle at 40% 40%, #E1BEE7 20%, #CE93D8 40%, #AB47BC)" },
  { id: "banane", parfum: "Banane", color: "#FDD835", emoji: "🍌", bgPattern: "radial-gradient(circle at 50% 30%, #FFF9C4 20%, #FFF176 40%, #FFEE58)" },
  { id: "peche", parfum: "Pêche", color: "#FFAB91", emoji: "🍑", bgPattern: "radial-gradient(circle at 45% 40%, #FFCCBC 20%, #FFAB91 40%, #FF8A65)" },
  { id: "citron", parfum: "Citron", color: "#FFEB3B", emoji: "🍋", bgPattern: "radial-gradient(circle at 50% 50%, #FFFDE7 20%, #FFF59D 40%, #FFF176)" },
  { id: "cola", parfum: "Cola", color: "#5D4037", emoji: "🥤", bgPattern: "radial-gradient(circle at 40% 35%, #8D6E63 20%, #795548 40%, #5D4037)" },
];

export default function DiddlView() {
  const [scratched, setScratched] = useState(() => loadState("diddl_scratched", []));
  const [scratchAnim, setScratchAnim] = useState(null);
  const [letterMode, setLetterMode] = useState(false);
  const [letterText, setLetterText] = useState(() => loadState("diddl_letter", ""));
  const [selectedPaper, setSelectedPaper] = useState(0);

  const scratchFeuille = (id) => {
    if (scratched.includes(id)) return;
    setScratchAnim(id);
    setTimeout(() => {
      const updated = [...scratched, id];
      setScratched(updated);
      saveState("diddl_scratched", updated);
      setScratchAnim(null);
    }, 800);
  };

  if (letterMode) {
    const paper = FEUILLES[selectedPaper];
    return (
      <div style={{ animation: "fadeIn 0.3s ease-out" }}>
        <button
          onClick={() => setLetterMode(false)}
          style={{
            background: "none", border: `1px solid ${C.primary}50`, color: C.primary,
            padding: "4px 12px", borderRadius: 4, cursor: "pointer",
            fontSize: 11, fontFamily: "'Tahoma', sans-serif", marginBottom: 10,
          }}
        >
          Retour aux feuilles
        </button>

        {/* Paper selector */}
        <div style={{ display: "flex", gap: 4, marginBottom: 8, justifyContent: "center" }}>
          {FEUILLES.slice(0, 6).map((f, i) => (
            <div
              key={f.id}
              onClick={() => setSelectedPaper(i)}
              style={{
                width: 20, height: 20, borderRadius: "50%",
                background: f.color, cursor: "pointer",
                border: selectedPaper === i ? "2px solid white" : "2px solid transparent",
              }}
            />
          ))}
        </div>

        {/* Letter paper */}
        <div style={{
          padding: 16, borderRadius: 8, minHeight: 200,
          background: paper.bgPattern,
          border: `3px solid ${paper.color}60`,
          position: "relative",
        }}>
          {/* Diddl border decoration */}
          <div style={{
            position: "absolute", top: 4, left: 4, right: 4,
            height: 20, borderRadius: "4px 4px 0 0",
            background: `${paper.color}40`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: "bold", color: "rgba(0,0,0,0.4)",
          }}>
            Mon papier Diddl {paper.emoji}
          </div>
          <textarea
            value={letterText}
            onChange={(e) => {
              setLetterText(e.target.value);
              saveState("diddl_letter", e.target.value);
            }}
            placeholder="Cher(e) ami(e)..."
            style={{
              width: "100%", minHeight: 160, marginTop: 24,
              background: "transparent", border: "none", outline: "none",
              fontFamily: "'Comic Sans MS', cursive", fontSize: 13,
              color: "rgba(0,0,0,0.7)", lineHeight: 1.8, resize: "none",
              backgroundImage: "repeating-linear-gradient(transparent, transparent 23px, rgba(0,0,0,0.08) 24px)",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={viewTitle}>Collection Diddl</div>
        <div style={viewSubtitle}>
          Les feuilles parfumées ! Gratte pour révéler l'illustration et sentir le parfum.
        </div>
        <div style={{ color: "#FFD700", fontSize: 10, marginTop: 4 }}>
          {scratched.length}/{FEUILLES.length} feuilles grattées
        </div>
      </div>

      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <button
          onClick={() => setLetterMode(true)}
          style={{
            background: "rgba(255,192,203,0.15)", color: "#FF69B4",
            border: "1px solid rgba(255,105,180,0.3)", padding: "6px 16px",
            borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: "bold",
            fontFamily: "'Comic Sans MS', cursive",
          }}
        >
          Écrire une lettre sur papier Diddl
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {FEUILLES.map((f) => {
          const isScratched = scratched.includes(f.id);
          const isScratchingNow = scratchAnim === f.id;
          return (
            <div
              key={f.id}
              onClick={() => scratchFeuille(f.id)}
              style={{
                height: 90, borderRadius: 8, cursor: isScratched ? "default" : "pointer",
                position: "relative", overflow: "hidden",
                border: `2px solid ${f.color}50`,
                transition: "all 0.3s",
              }}
            >
              {/* Background — always there */}
              <div style={{
                position: "absolute", inset: 0,
                background: f.bgPattern,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ fontSize: 24 }}>{f.emoji}</div>
                <div style={{
                  fontSize: 10, fontWeight: "bold",
                  color: "rgba(0,0,0,0.5)", fontFamily: "'Comic Sans MS', cursive",
                  marginTop: 2,
                }}>
                  {f.parfum}
                </div>
              </div>

              {/* Scratch overlay */}
              {!isScratched && (
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(135deg, #C0C0C0, #A0A0A0, #B0B0B0)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: isScratchingNow ? 0 : 1,
                  transition: "opacity 0.8s ease-out",
                }}>
                  {isScratchingNow ? null : (
                    <div style={{ color: "rgba(0,0,0,0.3)", fontSize: 9, textAlign: "center" }}>
                      Gratte !
                    </div>
                  )}
                </div>
              )}

              {/* Sparkles when revealed */}
              {isScratched && (
                <>
                  {[0, 1, 2, 3, 4].map((s) => (
                    <div key={s} style={{
                      position: "absolute",
                      top: `${15 + Math.random() * 60}%`,
                      left: `${10 + Math.random() * 80}%`,
                      width: 4, height: 4, borderRadius: "50%",
                      background: "white",
                      animation: `sparkle ${1 + Math.random()}s ease-in-out infinite`,
                      animationDelay: `${Math.random() * 2}s`,
                      opacity: 0,
                    }} />
                  ))}
                </>
              )}
            </div>
          );
        })}
      </div>

      <div style={viewFlavor}>
        Tu les rangeais dans une pochette plastique. Les sentir c'était un rituel sacré.
      </div>

      <style>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 0.8; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
}
