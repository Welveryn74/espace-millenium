import { useState } from "react";
import { viewTitle, viewSubtitle, viewFlavor, C } from "../../../../styles/chambreStyles";
import { loadState, saveState } from "../../../../utils/storage";

const DINOS = [
  { id: "trex", name: "T-Rex", emoji: "🦖", color: "#4CAF50", stat: { morsure: 10, charge: 7, vol: 0 }, fact: "Le T-Rex avait des bras ridicules. Genre, il pouvait même pas se gratter le nez.", idle: "headBob" },
  { id: "tricera", name: "Tricératops", emoji: "🦏", color: "#FF9800", stat: { morsure: 5, charge: 10, vol: 0 }, fact: "Sa collerette servait probablement à frimer devant les autres tricératops.", idle: "stomp" },
  { id: "raptor", name: "Vélociraptor", emoji: "🦎", color: "#F44336", stat: { morsure: 8, charge: 8, vol: 0 }, fact: "En vrai il faisait la taille d'une dinde. Merci Jurassic Park pour le marketing.", idle: "headBob" },
  { id: "stego", name: "Stégosaure", emoji: "🐊", color: "#2196F3", stat: { morsure: 3, charge: 6, vol: 0 }, fact: "Son cerveau faisait la taille d'une noix. Genre VRAIMENT une noix.", idle: "tailWag" },
  { id: "ptero", name: "Ptéranodon", emoji: "🦅", color: "#9C27B0", stat: { morsure: 6, charge: 3, vol: 10 }, fact: "Techniquement c'est pas un dinosaure. Mais bon, qui va vérifier ?", idle: "wingFlap" },
  { id: "bronto", name: "Brachiosaure", emoji: "🦕", color: "#00BCD4", stat: { morsure: 2, charge: 9, vol: 0 }, fact: "Il pesait 80 tonnes. C'est 10 éléphants. OU 800 000 hamsters.", idle: "neckSway" },
  { id: "ankylo", name: "Ankylosaure", emoji: "🐢", color: "#795548", stat: { morsure: 4, charge: 10, vol: 0 }, fact: "Une armure naturelle ET une massue au bout de la queue. Le tank ultime.", idle: "stomp" },
  { id: "spinosaurus", name: "Spinosaure", emoji: "🐉", color: "#E91E63", stat: { morsure: 9, charge: 6, vol: 0 }, fact: "Plus grand que le T-Rex. Il mangeait du poisson. Un géant pescétarien.", idle: "headBob" },
];

const ATTACKS = ["morsure", "charge", "vol"];
const ATTACK_LABELS = { morsure: "Morsure", charge: "Charge", vol: "Vol" };
const ATTACK_EMOJIS = { morsure: "🦷", charge: "💥", vol: "🦅" };
// Pierre-feuille-ciseaux : Morsure > Charge > Vol > Morsure
const BEATS = { morsure: "charge", charge: "vol", vol: "morsure" };

export default function DinosView() {
  const [selected, setSelected] = useState(null);
  const [combatMode, setCombatMode] = useState(false);
  const [fighter1, setFighter1] = useState(null);
  const [fighter2, setFighter2] = useState(null);
  const [combatPhase, setCombatPhase] = useState("pick"); // pick, pick2, fight, result
  const [playerAttack, setPlayerAttack] = useState(null);
  const [cpuAttack, setCpuAttack] = useState(null);
  const [result, setResult] = useState(null);
  const [wins, setWins] = useState(() => loadState("dino_wins", 0));

  const startCombat = () => {
    setCombatMode(true);
    setCombatPhase("pick");
    setFighter1(null);
    setFighter2(null);
    setResult(null);
  };

  const pickFighter = (dino) => {
    if (combatPhase === "pick") {
      setFighter1(dino);
      // CPU picks random opponent
      const others = DINOS.filter((d) => d.id !== dino.id);
      setFighter2(others[Math.floor(Math.random() * others.length)]);
      setCombatPhase("fight");
    }
  };

  const fight = (attack) => {
    const cpuAtk = ATTACKS.filter((a) => fighter2.stat[a] > 0)[
      Math.floor(Math.random() * ATTACKS.filter((a) => fighter2.stat[a] > 0).length)
    ];
    setPlayerAttack(attack);
    setCpuAttack(cpuAtk);

    let res;
    if (attack === cpuAtk) {
      // Tie — compare stats
      res = fighter1.stat[attack] >= fighter2.stat[cpuAtk] ? "win" : "lose";
    } else if (BEATS[attack] === cpuAtk) {
      res = "win";
    } else {
      res = "lose";
    }
    setResult(res);
    setCombatPhase("result");
    if (res === "win") {
      const w = wins + 1;
      setWins(w);
      saveState("dino_wins", w);
    }
  };

  if (combatMode) {
    return (
      <div style={{ textAlign: "center", animation: "fadeIn 0.3s ease-out" }}>
        <div style={viewTitle}>Combat de Dinos !</div>
        <div style={{ color: C.textMuted, fontSize: 9, marginBottom: 12 }}>
          Morsure &gt; Charge &gt; Vol &gt; Morsure (comme pierre-feuille-ciseaux)
        </div>

        {combatPhase === "pick" && (
          <>
            <div style={{ color: C.textDim, fontSize: 11, marginBottom: 8 }}>Choisis ton combattant :</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
              {DINOS.map((d) => (
                <div
                  key={d.id}
                  onClick={() => pickFighter(d)}
                  style={{
                    padding: 8, borderRadius: 6, cursor: "pointer",
                    background: `${d.color}15`, border: `1px solid ${d.color}40`,
                    textAlign: "center", transition: "all 0.15s",
                  }}
                >
                  <div style={{ fontSize: 24, animation: `dinoIdle 2s ease-in-out infinite` }}>{d.emoji}</div>
                  <div style={{ fontSize: 9, color: d.color, fontWeight: "bold" }}>{d.name}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {combatPhase === "fight" && fighter1 && fighter2 && (
          <>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20, marginBottom: 16 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 36, animation: `dinoIdle 1s ease-in-out infinite` }}>{fighter1.emoji}</div>
                <div style={{ fontSize: 11, color: fighter1.color, fontWeight: "bold" }}>{fighter1.name}</div>
              </div>
              <div style={{ fontSize: 18, color: "#FF5252", fontWeight: "bold" }}>VS</div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 36, animation: `dinoIdle 1.3s ease-in-out infinite` }}>{fighter2.emoji}</div>
                <div style={{ fontSize: 11, color: fighter2.color, fontWeight: "bold" }}>{fighter2.name}</div>
              </div>
            </div>
            <div style={{ color: C.textDim, fontSize: 10, marginBottom: 8 }}>Choisis ton attaque :</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
              {ATTACKS.filter((a) => fighter1.stat[a] > 0).map((atk) => (
                <button
                  key={atk}
                  onClick={() => fight(atk)}
                  style={{
                    padding: "8px 14px", borderRadius: 6, cursor: "pointer",
                    background: "rgba(255,255,255,0.06)", border: `1px solid ${C.border}`,
                    color: C.text, fontSize: 11, fontWeight: "bold",
                    fontFamily: "'Tahoma', sans-serif",
                  }}
                >
                  {ATTACK_EMOJIS[atk]} {ATTACK_LABELS[atk]} ({fighter1.stat[atk]})
                </button>
              ))}
            </div>
          </>
        )}

        {combatPhase === "result" && (
          <div style={{ animation: "fadeIn 0.3s ease-out" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20, marginBottom: 12 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 30 }}>{fighter1.emoji}</div>
                <div style={{ fontSize: 10, color: fighter1.color }}>{ATTACK_LABELS[playerAttack]}</div>
              </div>
              <div style={{ fontSize: 14, color: C.textMuted }}>vs</div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 30 }}>{fighter2.emoji}</div>
                <div style={{ fontSize: 10, color: fighter2.color }}>{ATTACK_LABELS[cpuAttack]}</div>
              </div>
            </div>
            <div style={{
              fontSize: 16, fontWeight: "bold", marginBottom: 12,
              color: result === "win" ? "#FFD700" : "#FF5252",
            }}>
              {result === "win" ? "VICTOIRE !" : "Défaite..."}
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
              <button onClick={startCombat} style={btnStyle}>Revanche</button>
              <button onClick={() => setCombatMode(false)} style={btnStyle}>Collection</button>
            </div>
            <div style={{ color: C.textMuted, fontSize: 9, marginTop: 8 }}>Victoires : {wins}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={viewTitle}>Figurines Dinosaures</div>
        <div style={viewSubtitle}>La collection sur l'étagère. Tu connaissais plus de noms de dinos que de capitales.</div>
      </div>

      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <button onClick={startCombat} style={{
          ...btnStyle,
          background: "rgba(255,80,80,0.15)", color: "#FF5252",
          border: "1px solid rgba(255,80,80,0.3)",
        }}>
          Combat de Dinos !
        </button>
        <span style={{ fontSize: 9, color: C.textMuted, marginLeft: 8 }}>Victoires : {wins}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
        {DINOS.map((d) => {
          const isSelected = selected === d.id;
          return (
            <div
              key={d.id}
              onClick={() => setSelected(isSelected ? null : d.id)}
              style={{
                padding: 10, borderRadius: 8, cursor: "pointer",
                background: isSelected ? `${d.color}20` : C.bg,
                border: isSelected ? `2px solid ${d.color}50` : `1px solid ${C.border}`,
                transition: "all 0.2s",
              }}
            >
              <div style={{
                fontSize: 32, textAlign: "center",
                animation: `dinoIdle 2s ease-in-out infinite`,
              }}>
                {d.emoji}
              </div>
              <div style={{ textAlign: "center", fontSize: 11, color: d.color, fontWeight: "bold", marginTop: 4 }}>
                {d.name}
              </div>
              {isSelected && (
                <div style={{ marginTop: 6, animation: "fadeIn 0.2s ease-out" }}>
                  <div style={{ fontSize: 10, color: C.textDim, lineHeight: 1.5, fontStyle: "italic" }}>
                    {d.fact}
                  </div>
                  <div style={{ display: "flex", gap: 4, marginTop: 6, justifyContent: "center" }}>
                    {ATTACKS.map((a) => d.stat[a] > 0 && (
                      <span key={a} style={{
                        fontSize: 8, padding: "1px 4px", borderRadius: 3,
                        background: `${d.color}20`, color: d.color,
                      }}>
                        {ATTACK_EMOJIS[a]} {d.stat[a]}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={viewFlavor}>
        "Le Tricératops il est plus fort !" "Non c'est le T-Rex !" — Débat fondamental de la récré.
      </div>

      <style>{`
        @keyframes dinoIdle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
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
