import { useState, useEffect, useRef, useCallback } from "react";
import { loadState, saveState } from "../../../utils/storage";

const C = { primary: "#C8B0E8", text: "#E0E0E0", dim: "#AAA", muted: "#666" };

const CASES = [
  { id: 0, name: "Départ", type: "depart", color: "#FFD700", emoji: "🏁" },
  { id: 1, name: "Rue Victor Hugo", type: "terrain", color: "#8B4513", prix: 60, loyer: 10, emoji: "🏠" },
  { id: 2, name: "Caisse", type: "caisse", color: "#FFD700", emoji: "📦" },
  { id: 3, name: "Bd de Belleville", type: "terrain", color: "#8B4513", prix: 60, loyer: 10, emoji: "🏠" },
  { id: 4, name: "Gare du Nord", type: "gare", color: "#333", prix: 100, loyer: 25, emoji: "🚂" },
  { id: 5, name: "Rue de Vaugirard", type: "terrain", color: "#42A5F5", prix: 100, loyer: 20, emoji: "🏡" },
  { id: 6, name: "Chance", type: "chance", color: "#FF9800", emoji: "❓" },
  { id: 7, name: "Rue de Courcelles", type: "terrain", color: "#42A5F5", prix: 100, loyer: 20, emoji: "🏡" },
  { id: 8, name: "Prison (visite)", type: "prison", color: "#666", emoji: "🔒" },
  { id: 9, name: "Av. Henri Martin", type: "terrain", color: "#66BB6A", prix: 140, loyer: 30, emoji: "🏘️" },
  { id: 10, name: "Compagnie d'Eau", type: "service", color: "#29B6F6", prix: 75, loyer: 15, emoji: "💧" },
  { id: 11, name: "Faubourg St-Honoré", type: "terrain", color: "#66BB6A", prix: 140, loyer: 30, emoji: "🏘️" },
  { id: 12, name: "Parking", type: "parking", color: "#999", emoji: "🅿️" },
  { id: 13, name: "Av. des Champs", type: "terrain", color: "#E53935", prix: 200, loyer: 50, emoji: "🏰" },
  { id: 14, name: "Taxe", type: "taxe", color: "#FF5252", emoji: "💸", montant: 75 },
  { id: 15, name: "Rue de la Paix", type: "terrain", color: "#1A237E", prix: 250, loyer: 60, emoji: "👑" },
];

const CHANCE_CARDS = [
  { text: "La banque te verse 50€ !", effect: 50 },
  { text: "Amende pour excès de vitesse : -30€", effect: -30 },
  { text: "Tu gagnes le concours de beauté : +40€", effect: 40 },
  { text: "Réparation de ta voiture : -50€", effect: -50 },
  { text: "Héritage de tonton : +80€", effect: 80 },
  { text: "Tu fais un don : -20€", effect: -20 },
];

const CAISSE_CARDS = [
  { text: "Anniversaire ! Chaque joueur te donne 25€", effect: 50 },
  { text: "Frais de scolarité : -50€", effect: -50 },
  { text: "Remboursement d'impôts : +30€", effect: 30 },
  { text: "Visite chez le dentiste : -40€", effect: -40 },
  { text: "Dividendes : +60€", effect: 60 },
];

const GAME_DURATION = 120; // 2 minutes

export default function MonopolySpeedGame({ onBack }) {
  const [playerPos, setPlayerPos] = useState(0);
  const [cpuPos, setCpuPos] = useState(0);
  const [playerMoney, setPlayerMoney] = useState(500);
  const [cpuMoney, setCpuMoney] = useState(500);
  const [playerProps, setPlayerProps] = useState([]);
  const [cpuProps, setCpuProps] = useState([]);
  const [dice, setDice] = useState(null);
  const [turn, setTurn] = useState("player"); // player, cpu, rolling
  const [message, setMessage] = useState("Lance les dés !");
  const [timer, setTimer] = useState(GAME_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (timer === 0 && !gameOver) endGame();
  }, [timer]);

  const endGame = () => {
    setGameOver(true);
    clearInterval(timerRef.current);
    const pTotal = playerMoney + playerProps.reduce((s, id) => s + (CASES[id].prix || 0), 0);
    const cTotal = cpuMoney + cpuProps.reduce((s, id) => s + (CASES[id].prix || 0), 0);
    if (pTotal > cTotal) {
      setMessage(`VICTOIRE ! Toi: ${pTotal}€ vs CPU: ${cTotal}€`);
      saveState("monopoly_wins", loadState("monopoly_wins", 0) + 1);
    } else if (cTotal > pTotal) {
      setMessage(`Défaite... CPU: ${cTotal}€ vs Toi: ${pTotal}€`);
    } else {
      setMessage(`Égalité ! ${pTotal}€ chacun`);
    }
  };

  const rollDice = () => {
    if (turn !== "player" || gameOver) return;
    setTurn("rolling");
    const d1 = 1 + Math.floor(Math.random() * 6);
    const d2 = 1 + Math.floor(Math.random() * 6);
    setDice([d1, d2]);
    const total = d1 + d2;
    const newPos = (playerPos + total) % CASES.length;

    // Pass départ bonus
    if (newPos < playerPos) setPlayerMoney((m) => m + 100);

    setTimeout(() => {
      setPlayerPos(newPos);
      handleLanding(newPos, "player");
    }, 400);
  };

  const handleLanding = useCallback((pos, who) => {
    const c = CASES[pos];
    const isPlayer = who === "player";

    if (c.type === "terrain" || c.type === "gare" || c.type === "service") {
      const ownedByPlayer = playerProps.includes(c.id);
      const ownedByCpu = cpuProps.includes(c.id);

      if (isPlayer) {
        if (ownedByCpu) {
          setPlayerMoney((m) => m - c.loyer);
          setCpuMoney((m) => m + c.loyer);
          setMessage(`Tu paies ${c.loyer}€ de loyer au CPU pour ${c.name} !`);
        } else if (!ownedByPlayer && playerMoney >= c.prix) {
          setPlayerProps((p) => [...p, c.id]);
          setPlayerMoney((m) => m - c.prix);
          setMessage(`Tu achètes ${c.name} pour ${c.prix}€ !`);
        } else if (!ownedByPlayer) {
          setMessage(`Pas assez pour acheter ${c.name} (${c.prix}€).`);
        } else {
          setMessage(`Tu es chez toi à ${c.name}.`);
        }
      } else {
        if (ownedByPlayer) {
          setCpuMoney((m) => m - c.loyer);
          setPlayerMoney((m) => m + c.loyer);
          setMessage(`CPU paie ${c.loyer}€ de loyer pour ${c.name} !`);
        } else if (!ownedByCpu && cpuMoney >= c.prix) {
          setCpuProps((p) => [...p, c.id]);
          setCpuMoney((m) => m - c.prix);
          setMessage(`CPU achète ${c.name} pour ${c.prix}€.`);
        } else {
          setMessage(`CPU passe sur ${c.name}.`);
        }
      }
    } else if (c.type === "chance") {
      const card = CHANCE_CARDS[Math.floor(Math.random() * CHANCE_CARDS.length)];
      if (isPlayer) setPlayerMoney((m) => m + card.effect);
      else setCpuMoney((m) => m + card.effect);
      setMessage(`${isPlayer ? "" : "CPU: "}${card.text}`);
    } else if (c.type === "caisse") {
      const card = CAISSE_CARDS[Math.floor(Math.random() * CAISSE_CARDS.length)];
      if (isPlayer) setPlayerMoney((m) => m + card.effect);
      else setCpuMoney((m) => m + card.effect);
      setMessage(`${isPlayer ? "" : "CPU: "}${card.text}`);
    } else if (c.type === "taxe") {
      if (isPlayer) setPlayerMoney((m) => m - c.montant);
      else setCpuMoney((m) => m - c.montant);
      setMessage(`${isPlayer ? "Tu paies" : "CPU paie"} ${c.montant}€ de taxe !`);
    } else {
      setMessage(`${isPlayer ? "Tu" : "CPU"} arrive sur ${c.name}.`);
    }

    if (isPlayer) {
      setTimeout(() => cpuPlay(), 600);
    } else {
      setTurn("player");
    }
  }, [playerProps, cpuProps, playerMoney, cpuMoney]);

  const cpuPlay = useCallback(() => {
    if (gameOver) { setTurn("player"); return; }
    const d1 = 1 + Math.floor(Math.random() * 6);
    const d2 = 1 + Math.floor(Math.random() * 6);
    const total = d1 + d2;
    const newPos = (cpuPos + total) % CASES.length;
    if (newPos < cpuPos) setCpuMoney((m) => m + 100);
    setCpuPos(newPos);
    setTimeout(() => handleLanding(newPos, "cpu"), 300);
  }, [cpuPos, gameOver, handleLanding]);

  const restart = () => {
    setPlayerPos(0); setCpuPos(0);
    setPlayerMoney(500); setCpuMoney(500);
    setPlayerProps([]); setCpuProps([]);
    setDice(null); setTurn("player");
    setMessage("Lance les dés !"); setTimer(GAME_DURATION);
    setGameOver(false);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const mm = Math.floor(timer / 60);
  const ss = timer % 60;

  return (
    <div style={{ fontFamily: "'Tahoma', sans-serif", animation: "fadeIn 0.3s ease-out" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <button onClick={onBack} style={backBtn}>Retour</button>
        <div style={{ color: "#E53935", fontSize: 14, fontWeight: "bold" }}>Monopoly Speed</div>
        <div style={{
          color: timer < 30 ? "#FF5252" : C.dim, fontSize: 14, fontWeight: "bold", fontFamily: "monospace",
        }}>
          {mm}:{ss.toString().padStart(2, "0")}
        </div>
      </div>

      {/* Scores */}
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 8 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, color: C.dim }}>Toi</div>
          <div style={{ fontSize: 16, fontWeight: "bold", color: "#4CAF50" }}>{playerMoney}€</div>
          <div style={{ fontSize: 9, color: C.muted }}>{playerProps.length} propriétés</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, color: C.dim }}>CPU</div>
          <div style={{ fontSize: 16, fontWeight: "bold", color: "#FF5252" }}>{cpuMoney}€</div>
          <div style={{ fontSize: 9, color: C.muted }}>{cpuProps.length} propriétés</div>
        </div>
      </div>

      {/* Board - mini circular representation */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 2,
        marginBottom: 8,
      }}>
        {CASES.map((c) => {
          const pHere = playerPos === c.id;
          const cHere = cpuPos === c.id;
          const pOwns = playerProps.includes(c.id);
          const cOwns = cpuProps.includes(c.id);
          return (
            <div key={c.id} style={{
              height: 28, borderRadius: 3, fontSize: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: pOwns ? "rgba(76,175,80,0.3)" : cOwns ? "rgba(255,82,82,0.3)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${pHere ? "#4CAF50" : cHere ? "#FF5252" : "rgba(255,255,255,0.1)"}`,
              position: "relative",
            }} title={c.name}>
              <span>{c.emoji}</span>
              {pHere && <span style={{ position: "absolute", top: -2, left: 1, fontSize: 7 }}>🟢</span>}
              {cHere && <span style={{ position: "absolute", top: -2, right: 1, fontSize: 7 }}>🔴</span>}
            </div>
          );
        })}
      </div>

      {/* Message */}
      <div style={{
        textAlign: "center", padding: "6px 12px", borderRadius: 6,
        background: "rgba(200,176,232,0.1)", border: "1px solid rgba(200,176,232,0.2)",
        color: C.text, fontSize: 11, marginBottom: 8, minHeight: 18,
      }}>
        {message}
      </div>

      {/* Actions */}
      <div style={{ textAlign: "center" }}>
        {!gameOver && (
          <button
            onClick={rollDice}
            disabled={turn !== "player"}
            style={{
              background: turn === "player" ? "rgba(76,175,80,0.2)" : "rgba(100,100,100,0.2)",
              color: turn === "player" ? "#4CAF50" : C.muted,
              border: `1px solid ${turn === "player" ? "#4CAF5060" : "#33333360"}`,
              padding: "8px 24px", borderRadius: 6, cursor: turn === "player" ? "pointer" : "default",
              fontSize: 13, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif",
            }}
          >
            {dice ? `🎲 ${dice[0]} + ${dice[1]}` : "🎲 Lancer !"}
          </button>
        )}
        {gameOver && (
          <div>
            <div style={{
              fontSize: 16, fontWeight: "bold", margin: "8px 0",
              color: message.includes("VICTOIRE") ? "#FFD700" : message.includes("Défaite") ? "#FF5252" : C.primary,
            }}>
              {message.includes("VICTOIRE") ? "VICTOIRE !" : message.includes("Défaite") ? "Défaite..." : "Égalité !"}
            </div>
            <button onClick={restart} style={backBtn}>Rejouer</button>
          </div>
        )}
      </div>
    </div>
  );
}

const backBtn = {
  background: "none", border: "1px solid rgba(200,176,232,0.4)", color: "#C8B0E8",
  padding: "4px 12px", borderRadius: 4, cursor: "pointer", fontSize: 11,
  fontFamily: "'Tahoma', sans-serif",
};
