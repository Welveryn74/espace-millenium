import { useState, useCallback } from "react";
import { loadState, saveState } from "../../../utils/storage";

const C = { primary: "#C8B0E8", text: "#E0E0E0", dim: "#AAA", muted: "#666", bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)" };

// Cartes
const DISTANCE = [25, 25, 25, 50, 50, 50, 75, 75, 100, 100, 200];
const ATTACKS = ["crevaison", "panneEssence", "accident", "limiteVitesse", "feuRouge"];
const PARADES = { crevaison: "roueSecours", panneEssence: "pompeEssence", accident: "reparation", limiteVitesse: "finLimite", feuRouge: "feuVert" };

const CARD_LABELS = {
  25: "25 km", 50: "50 km", 75: "75 km", 100: "100 km", 200: "200 km",
  crevaison: "Crevaison", panneEssence: "Panne", accident: "Accident", limiteVitesse: "Limite", feuRouge: "Feu Rouge",
  roueSecours: "Roue", pompeEssence: "Essence", reparation: "Réparation", finLimite: "Fin Limite", feuVert: "Feu Vert",
};

const CARD_EMOJIS = {
  25: "🛣️", 50: "🛣️", 75: "🛣️", 100: "🛣️", 200: "🚀",
  crevaison: "💥", panneEssence: "⛽", accident: "🚧", limiteVitesse: "🐌", feuRouge: "🔴",
  roueSecours: "🔧", pompeEssence: "⛽", reparation: "🔩", finLimite: "🏎️", feuVert: "🟢",
};

const CARD_COLORS = {
  25: "#4CAF50", 50: "#4CAF50", 75: "#66BB6A", 100: "#81C784", 200: "#FFD700",
  crevaison: "#FF5252", panneEssence: "#FF5252", accident: "#FF5252", limiteVitesse: "#FF9800", feuRouge: "#FF5252",
  roueSecours: "#2196F3", pompeEssence: "#2196F3", reparation: "#2196F3", finLimite: "#2196F3", feuVert: "#2196F3",
};

function createDeck() {
  const deck = [];
  // Distance cards
  DISTANCE.forEach((d) => { deck.push({ type: "distance", value: d }); deck.push({ type: "distance", value: d }); });
  // Attack cards (2 each)
  ATTACKS.forEach((a) => { deck.push({ type: "attack", value: a }); deck.push({ type: "attack", value: a }); });
  // Parade cards (2 each)
  Object.values(PARADES).forEach((p) => { deck.push({ type: "parade", value: p }); deck.push({ type: "parade", value: p }); });
  // Extra feu vert (needed more often)
  deck.push({ type: "parade", value: "feuVert" });
  deck.push({ type: "parade", value: "feuVert" });
  // Shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function drawCards(deck, n) {
  return deck.splice(0, Math.min(n, deck.length));
}

export default function MilleBornesGame({ onBack }) {
  const [deck, setDeck] = useState(() => { const d = createDeck(); return d; });
  const [playerHand, setPlayerHand] = useState(() => drawCards(deck, 5));
  const [cpuHand, setCpuHand] = useState(() => drawCards(deck, 5));
  const [playerKm, setPlayerKm] = useState(0);
  const [cpuKm, setCpuKm] = useState(0);
  const [playerStatus, setPlayerStatus] = useState("ok"); // ok, crevaison, panneEssence, accident, limiteVitesse, feuRouge
  const [cpuStatus, setCpuStatus] = useState("ok");
  const [playerCanGo, setPlayerCanGo] = useState(true);
  const [cpuCanGo, setCpuCanGo] = useState(true);
  const [message, setMessage] = useState("C'est ton tour ! Joue une carte.");
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [wins] = useState(() => loadState("mille_bornes_wins", 0));

  const getCardKey = (card) => card.value;

  const canPlayCard = useCallback((card) => {
    if (card.type === "distance") {
      if (playerStatus !== "ok") return false;
      if (!playerCanGo) return false;
      if (playerKm + card.value > 700) return false;
      if (playerStatus === "limiteVitesse" && card.value > 50) return false;
      return true;
    }
    if (card.type === "attack") return true; // attack always playable on CPU
    if (card.type === "parade") {
      if (card.value === "feuVert") return !playerCanGo;
      return playerStatus === Object.keys(PARADES).find((k) => PARADES[k] === card.value);
    }
    return false;
  }, [playerStatus, playerCanGo, playerKm]);

  const playCard = (idx) => {
    if (gameOver) return;
    const card = playerHand[idx];
    if (!card) return;

    let msg = "";
    if (card.type === "distance") {
      if (!canPlayCard(card)) return;
      const newKm = playerKm + card.value;
      setPlayerKm(newKm);
      msg = `Tu avances de ${card.value} km ! (${newKm}/700)`;
      if (newKm >= 700) {
        setGameOver(true);
        setWinner("player");
        saveState("mille_bornes_wins", wins + 1);
        msg = "Tu as atteint 700 km ! VICTOIRE !";
      }
    } else if (card.type === "attack") {
      if (cpuStatus !== "ok" && card.value !== "limiteVitesse" && card.value !== "feuRouge") {
        msg = "Le CPU a déjà un problème !";
        return;
      }
      if (card.value === "feuRouge") {
        setCpuCanGo(false);
        msg = `Tu poses un Feu Rouge au CPU !`;
      } else {
        setCpuStatus(card.value);
        msg = `Tu infliges ${CARD_LABELS[card.value]} au CPU !`;
      }
    } else if (card.type === "parade") {
      if (!canPlayCard(card)) return;
      if (card.value === "feuVert") {
        setPlayerCanGo(true);
        msg = "Feu Vert ! Tu peux rouler !";
      } else {
        setPlayerStatus("ok");
        msg = `${CARD_LABELS[card.value]} ! Problème réparé !`;
      }
    }

    // Remove card and draw
    const newHand = [...playerHand];
    newHand.splice(idx, 1);
    if (deck.length > 0) newHand.push(deck.shift());
    setPlayerHand(newHand);
    setMessage(msg);

    // CPU turn after short delay
    if (!gameOver) setTimeout(() => cpuTurn(), 800);
  };

  const discardCard = (idx) => {
    if (gameOver) return;
    const newHand = [...playerHand];
    newHand.splice(idx, 1);
    if (deck.length > 0) newHand.push(deck.shift());
    setPlayerHand(newHand);
    setMessage("Tu défausses une carte.");
    if (!gameOver) setTimeout(() => cpuTurn(), 600);
  };

  const cpuTurn = useCallback(() => {
    if (gameOver) return;
    let played = false;
    const hand = [...cpuHand];

    // Try to fix status first
    if (cpuStatus !== "ok") {
      const paradeNeeded = PARADES[cpuStatus];
      const idx = hand.findIndex((c) => c.type === "parade" && c.value === paradeNeeded);
      if (idx !== -1) {
        setCpuStatus("ok");
        setMessage(`CPU joue ${CARD_LABELS[hand[idx].value]} !`);
        hand.splice(idx, 1);
        played = true;
      }
    }

    // Try feu vert if stopped
    if (!played && !cpuCanGo) {
      const idx = hand.findIndex((c) => c.value === "feuVert");
      if (idx !== -1) {
        setCpuCanGo(true);
        setMessage("CPU joue Feu Vert !");
        hand.splice(idx, 1);
        played = true;
      }
    }

    // Try to play distance
    if (!played && cpuStatus === "ok" && cpuCanGo) {
      const distCards = hand
        .map((c, i) => ({ ...c, idx: i }))
        .filter((c) => c.type === "distance" && cpuKm + c.value <= 700)
        .sort((a, b) => b.value - a.value);
      if (distCards.length > 0) {
        const card = distCards[0];
        const newKm = cpuKm + card.value;
        setCpuKm(newKm);
        setMessage(`CPU avance de ${card.value} km ! (${newKm}/700)`);
        hand.splice(card.idx, 1);
        played = true;
        if (newKm >= 700) {
          setGameOver(true);
          setWinner("cpu");
          setMessage("Le CPU atteint 700 km... Tu as perdu !");
        }
      }
    }

    // Try attack
    if (!played) {
      const attacks = hand.filter((c) => c.type === "attack");
      if (attacks.length > 0 && playerStatus === "ok" && Math.random() > 0.3) {
        const card = attacks[0];
        const idx = hand.indexOf(card);
        if (card.value === "feuRouge") {
          setPlayerCanGo(false);
          setMessage(`CPU pose Feu Rouge !`);
        } else {
          setPlayerStatus(card.value);
          setMessage(`CPU inflige ${CARD_LABELS[card.value]} !`);
        }
        hand.splice(idx, 1);
        played = true;
      }
    }

    // Discard worst card
    if (!played && hand.length > 0) {
      hand.splice(0, 1);
      setMessage("CPU défausse une carte.");
    }

    // Draw
    if (deck.length > 0) hand.push(deck.shift());
    setCpuHand(hand);

    if (deck.length === 0 && !gameOver) {
      setGameOver(true);
      setWinner(playerKm >= cpuKm ? "player" : "cpu");
      setMessage(playerKm >= cpuKm ? "Plus de cartes. Tu gagnes aux km !" : "Plus de cartes. Le CPU gagne aux km...");
    }
  }, [cpuHand, cpuStatus, cpuCanGo, cpuKm, playerStatus, deck, gameOver, playerKm]);

  const restart = () => {
    const d = createDeck();
    setDeck(d);
    setPlayerHand(drawCards(d, 5));
    setCpuHand(drawCards(d, 5));
    setPlayerKm(0);
    setCpuKm(0);
    setPlayerStatus("ok");
    setCpuStatus("ok");
    setPlayerCanGo(true);
    setCpuCanGo(true);
    setMessage("C'est ton tour !");
    setGameOver(false);
    setWinner(null);
  };

  return (
    <div style={{ fontFamily: "'Tahoma', sans-serif", animation: "fadeIn 0.3s ease-out" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <button onClick={onBack} style={backBtn}>Retour</button>
        <div style={{ color: C.primary, fontSize: 14, fontWeight: "bold" }}>1000 Bornes</div>
        <div style={{ color: C.muted, fontSize: 9 }}>{deck.length} cartes</div>
      </div>

      {/* Scores */}
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 10 }}>
        <ScoreBar label="Toi" km={playerKm} max={700} color="#4CAF50" status={playerStatus} canGo={playerCanGo} />
        <ScoreBar label="CPU" km={cpuKm} max={700} color="#FF5252" status={cpuStatus} canGo={cpuCanGo} />
      </div>

      {/* Message */}
      <div style={{
        textAlign: "center", padding: "6px 12px", borderRadius: 6,
        background: "rgba(200,176,232,0.1)", border: "1px solid rgba(200,176,232,0.2)",
        color: C.text, fontSize: 11, marginBottom: 10, minHeight: 20,
      }}>
        {message}
      </div>

      {/* Main */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 4, marginBottom: 8 }}>
        {playerHand.map((card, i) => {
          const key = getCardKey(card);
          const playable = canPlayCard(card);
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div
                onClick={() => playCard(i)}
                style={{
                  width: 56, height: 78, borderRadius: 6, cursor: playable ? "pointer" : "default",
                  background: playable ? `${CARD_COLORS[key]}20` : "rgba(0,0,0,0.3)",
                  border: `2px solid ${playable ? CARD_COLORS[key] : "#333"}`,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  opacity: playable ? 1 : 0.5, transition: "all 0.15s",
                  fontSize: 10, color: CARD_COLORS[key] || C.text,
                }}
              >
                <span style={{ fontSize: 18 }}>{CARD_EMOJIS[key]}</span>
                <span style={{ fontWeight: "bold", marginTop: 2 }}>{CARD_LABELS[key]}</span>
              </div>
              <button
                onClick={() => discardCard(i)}
                style={{ fontSize: 8, color: C.muted, background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                Jeter
              </button>
            </div>
          );
        })}
      </div>

      {gameOver && (
        <div style={{ textAlign: "center", padding: 12, animation: "fadeIn 0.3s ease-out" }}>
          <div style={{
            fontSize: 16, fontWeight: "bold",
            color: winner === "player" ? "#FFD700" : "#FF5252", marginBottom: 8,
          }}>
            {winner === "player" ? "VICTOIRE !" : "Défaite..."}
          </div>
          <button onClick={restart} style={backBtn}>Rejouer</button>
        </div>
      )}
    </div>
  );
}

function ScoreBar({ label, km, max, color, status, canGo }) {
  return (
    <div style={{ flex: 1, maxWidth: 140, textAlign: "center" }}>
      <div style={{ fontSize: 10, color: C.dim, marginBottom: 2 }}>{label}</div>
      <div style={{
        height: 10, borderRadius: 5, background: "rgba(255,255,255,0.1)",
        overflow: "hidden", marginBottom: 2,
      }}>
        <div style={{
          height: "100%", borderRadius: 5, transition: "width 0.3s",
          width: `${(km / max) * 100}%`, background: color,
        }} />
      </div>
      <div style={{ fontSize: 12, fontWeight: "bold", color }}>{km}/{max} km</div>
      {status !== "ok" && <div style={{ fontSize: 9, color: "#FF5252" }}>{CARD_LABELS[status]}</div>}
      {!canGo && <div style={{ fontSize: 9, color: "#FF9800" }}>Feu Rouge</div>}
    </div>
  );
}

const backBtn = {
  background: "none", border: "1px solid rgba(200,176,232,0.4)", color: "#C8B0E8",
  padding: "4px 12px", borderRadius: 4, cursor: "pointer", fontSize: 11,
  fontFamily: "'Tahoma', sans-serif",
};
