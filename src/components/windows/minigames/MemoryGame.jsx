import { useState, useEffect, useRef } from "react";
import { loadState, saveState } from "../../../utils/storage";
import { playPop, playMatchSound, playMismatch, playVictorySound } from "../../../utils/uiSounds";

const POKEMON = ["Pikachu", "Dracaufeu", "Tortank", "Florizarre", "Mewtwo", "Ronflex", "Évoli", "Salamèche"];
const ICONS = ["⚡", "🔥", "🐢", "🌿", "🔮", "😴", "🦊", "🔥"];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createBoard() {
  const pairs = POKEMON.map((name, i) => ({ name, icon: ICONS[i] }));
  const cards = [...pairs, ...pairs].map((p, i) => ({ id: i, ...p, flipped: false, matched: false }));
  return shuffle(cards);
}

export default function MemoryGame({ screenBg, screenText, color }) {
  const [cards, setCards] = useState(createBoard);
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [won, setWon] = useState(false);
  const [started, setStarted] = useState(false);
  const [bestMoves, setBestMoves] = useState(() => loadState("memory_bestMoves", null));
  const timerRef = useRef(null);

  // Timer
  useEffect(() => {
    if (started && !won) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started, won]);

  // Check match
  useEffect(() => {
    if (flipped.length !== 2) return;
    const [a, b] = flipped;
    setMoves(m => m + 1);

    if (cards[a].name === cards[b].name) {
      playMatchSound();
      setTimeout(() => {
        setCards(prev => {
          const next = prev.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c));
          if (next.every(c => c.matched)) {
            playVictorySound();
            setWon(true);
            const finalMoves = moves + 1;
            const best = loadState("memory_bestMoves", null);
            if (best === null || finalMoves < best) {
              saveState("memory_bestMoves", finalMoves);
              setBestMoves(finalMoves);
            }
          }
          return next;
        });
        setFlipped([]);
      }, 400);
    } else {
      playMismatch();
      setTimeout(() => {
        setCards(prev => prev.map((c, i) => (i === a || i === b ? { ...c, flipped: false } : c)));
        setFlipped([]);
      }, 800);
    }
  }, [flipped]);

  const handleFlip = (idx) => {
    if (flipped.length >= 2 || cards[idx].flipped || cards[idx].matched) return;
    playPop();
    if (!started) setStarted(true);
    setCards(prev => prev.map((c, i) => (i === idx ? { ...c, flipped: true } : c)));
    setFlipped(prev => [...prev, idx]);
  };

  const restart = () => {
    setCards(createBoard());
    setFlipped([]);
    setMoves(0);
    setTimer(0);
    setWon(false);
    setStarted(false);
  };

  const bgColor = screenBg || "#E8E8E8";
  const txtColor = screenText || "#333";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", fontSize: 10, fontFamily: "monospace", padding: "0 4px" }}>
        <span style={{ color: txtColor }}>Coups : {moves}</span>
        {bestMoves !== null && <span style={{ color: `${txtColor}80` }}>Record : {bestMoves}</span>}
        <span style={{ color: txtColor }}>Temps : {timer}s</span>
      </div>

      {/* Grid 4x4 */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6,
        width: 260, perspective: "600px",
      }}>
        {cards.map((card, i) => (
          <div key={card.id} onClick={() => handleFlip(i)} style={{
            width: 58, height: 64, cursor: "pointer",
            perspective: "400px",
          }}>
            <div style={{
              width: "100%", height: "100%", position: "relative",
              transformStyle: "preserve-3d",
              transform: card.flipped || card.matched ? "rotateY(180deg)" : "rotateY(0deg)",
              transition: "transform 0.4s",
            }}>
              {/* Back (face cachée) */}
              <div style={{
                position: "absolute", inset: 0, backfaceVisibility: "hidden",
                background: `linear-gradient(135deg, ${color || "#4A90D9"}, ${color || "#4A90D9"}CC)`,
                borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid rgba(255,255,255,0.2)",
                fontSize: 20, color: "#fff",
              }}>?</div>
              {/* Front (face visible) */}
              <div style={{
                position: "absolute", inset: 0, backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                background: card.matched ? "rgba(100,255,100,0.15)" : "rgba(255,255,255,0.1)",
                borderRadius: 6, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                border: card.matched ? "2px solid rgba(100,255,100,0.4)" : `2px solid ${color || "#4A90D9"}50`,
              }}>
                <span style={{ fontSize: 22 }}>{card.icon}</span>
                <span style={{ color: txtColor, fontSize: 7, fontFamily: "monospace", marginTop: 2 }}>{card.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Win message */}
      {won && (
        <div style={{ textAlign: "center", animation: "fadeIn 0.5s ease-out" }}>
          <div style={{ color: txtColor, fontSize: 14, fontWeight: "bold", fontFamily: "monospace" }}>
            Bravo ! {moves} coups en {timer}s
          </div>
          <button onClick={restart} style={{
            marginTop: 6, background: `${color || "#4A90D9"}30`, color: txtColor,
            border: `1px solid ${color || "#4A90D9"}50`, padding: "4px 14px",
            borderRadius: 3, cursor: "pointer", fontFamily: "monospace", fontSize: 11,
          }}>Rejouer</button>
        </div>
      )}

      {!started && !won && (
        <div style={{ color: `${txtColor}99`, fontSize: 9, fontFamily: "monospace" }}>
          Clique sur une carte pour commencer
        </div>
      )}
    </div>
  );
}
