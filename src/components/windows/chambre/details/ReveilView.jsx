import { useState, useEffect, useCallback } from "react";
import { viewTitle, viewSubtitle, viewFlavor, C } from "../../../../styles/chambreStyles";
import { loadState, saveState } from "../../../../utils/storage";

const FLASHBACKS = [
  { heure: "6h30", texte: "Le radio-réveil crépite... France Info en fond. Papa est déjà parti au travail.", type: "ecole" },
  { heure: "6h45", texte: "\"DEBOUUUT !\" Maman crie depuis la cuisine. L'odeur du Nesquik monte jusqu'à la chambre.", type: "ecole" },
  { heure: "7h00", texte: "Le bol de céréales devant les dessins animés. Tu manges trop lentement, comme d'habitude.", type: "ecole" },
  { heure: "7h15", texte: "\"Tu as mis ton manteau ?\" \"Oui maman...\" (Tu l'avais pas mis.)", type: "ecole" },
  { heure: "7h30", texte: "Le bus scolaire klaxonne en bas. Tu cours avec le cartable ouvert.", type: "ecole" },
  { heure: "8h00", texte: "La sonnerie. La cour se vide. L'instit ferme la porte. Lundi matin.", type: "ecole" },
  { heure: "10h00", texte: "RÉCRÉ ! Tu cours vers les billes. Kevin a ramené un boulard. Ça va être la guerre.", type: "ecole" },
  { heure: "12h00", texte: "Cantine. Steak haché-purée. Le meilleur jour de la semaine.", type: "ecole" },
  { heure: "16h30", texte: "Sortie des classes ! Le goûter t'attend : BN et jus de pomme devant les Minikeums.", type: "ecole" },
  { heure: "18h00", texte: "\"Fais tes devoirs avant la télé !\" Tu triches un peu sur les multiplications.", type: "ecole" },
  { heure: "19h00", texte: "Le générique du Journal de 20h. Papa zappe sur TF1. Toi tu veux Les Simpson.", type: "ecole" },
  { heure: "20h30", texte: "\"Au lit !\" Tu emportes ta Game Boy sous la couette. Maman le sait mais elle fait semblant.", type: "ecole" },
  { heure: "22h00", texte: "Tu fixes les étoiles phosphorescentes au plafond. Le réveil brille rouge dans le noir. Tu penses à demain.", type: "ecole" },
  { heure: "9h30", texte: "VACANCES ! Tu te réveilles tout seul. Personne pour crier. Le soleil entre par la fenêtre. La belle vie.", type: "vacances" },
  { heure: "10h30", texte: "Encore en pyjama devant les dessins animés. Maman dit rien. C'est les vacances après tout.", type: "vacances" },
  { heure: "14h00", texte: "\"On va à la piscine !\" Tu as déjà enfilé ton maillot avant qu'elle finisse la phrase.", type: "vacances" },
  { heure: "15h30", texte: "Chez mamie. Elle a fait un gâteau au chocolat. Tu en reprends trois fois.", type: "vacances" },
  { heure: "17h00", texte: "Les copains sonnent en bas. \"On fait du vélo ?\" Tu files sans demander la permission.", type: "vacances" },
  { heure: "21h00", texte: "Soirée film en famille. Pop-corn dans le canapé. Tu t'endors avant la fin, comme toujours.", type: "vacances" },
];

const SNOOZE_TEXTS = [
  "\"Allez, debout mon chou...\" (voix douce)",
  "\"C'est l'heure hein ! Ton bol refroidit !\"",
  "\"J'ai dit DEBOUT. Je plaisante plus.\"",
  "\"Je compte jusqu'à trois. UN...\"",
  "\"CETTE FOIS C'EST FINI. J'ENLÈVE LA COUETTE.\"",
];

const JOURS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

function randomDate2003_2005() {
  const year = 2003 + Math.floor(Math.random() * 3);
  const month = Math.floor(Math.random() * 12);
  const day = 1 + Math.floor(Math.random() * 28);
  const d = new Date(year, month, day);
  const isVacances = (month === 6 || month === 7) || (month === 11 && day > 20) || (month === 3 && day > 10 && day < 25);
  return {
    label: `${JOURS[d.getDay()]} ${day} ${MOIS[month]} ${year}`,
    isVacances,
  };
}

export default function ReveilView() {
  const [time, setTime] = useState(new Date());
  const [alarmPlaying, setAlarmPlaying] = useState(false);
  const [snoozeCount, setSnoozeCount] = useState(0);
  const [snoozeRecord] = useState(() => loadState("reveil_snooze_record", 0));
  const [shaking, setShaking] = useState(false);
  const [flashback, setFlashback] = useState(null);
  const [retroDate, setRetroDate] = useState(() => randomDate2003_2005());
  const [selectedHour, setSelectedHour] = useState(null);

  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const playAlarmSound = useCallback(() => {
    if (localStorage.getItem("em_muted") === "true") return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      for (let i = 0; i < 8; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.value = i % 2 === 0 ? 880 : 660;
        const t = ctx.currentTime + i * 0.25;
        gain.gain.setValueAtTime(0.06, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.22);
      }
    } catch (_) {}
  }, []);

  const triggerAlarm = () => {
    if (alarmPlaying) return;
    setAlarmPlaying(true);
    setSnoozeCount(0);
    playAlarmSound();
  };

  const hitSnooze = () => {
    if (snoozeCount >= 5) return;
    const next = snoozeCount + 1;
    setSnoozeCount(next);
    if (next >= 4) {
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
    }
    if (next >= 5) {
      setTimeout(() => setAlarmPlaying(false), 2000);
      if (next > snoozeRecord) {
        saveState("reveil_snooze_record", next);
      }
    }
  };

  const stopAlarm = () => {
    setAlarmPlaying(false);
    setSnoozeCount(0);
  };

  const pickFlashback = (heure) => {
    setSelectedHour(heure);
    const matches = FLASHBACKS.filter(
      (f) => f.heure === heure && (retroDate.isVacances ? f.type === "vacances" : f.type === "ecole")
    );
    if (matches.length === 0) {
      const all = FLASHBACKS.filter((f) => f.heure === heure);
      setFlashback(all.length > 0 ? all[Math.floor(Math.random() * all.length)] : null);
    } else {
      setFlashback(matches[Math.floor(Math.random() * matches.length)]);
    }
  };

  const changeDate = () => {
    const d = randomDate2003_2005();
    setRetroDate(d);
    setFlashback(null);
    setSelectedHour(null);
  };

  const hh = time.getHours().toString().padStart(2, "0");
  const mm = time.getMinutes().toString().padStart(2, "0");
  const ss = time.getSeconds().toString().padStart(2, "0");

  const hours = [...new Set(FLASHBACKS.map((f) => f.heure))];

  return (
    <div style={{ textAlign: "center", animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={viewTitle}>Radio-Réveil</div>
        <div style={viewSubtitle}>Le petit rectangle rouge qui brillait dans le noir. Tu le regardais quand tu n'arrivais pas à dormir.</div>
      </div>

      {/* Réveil physique */}
      <div
        style={{
          display: "inline-block", padding: "20px 36px", borderRadius: 8,
          background: "#1a1a1a", border: "2px solid #333",
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.5), 0 0 15px rgba(255,50,50,0.1)",
          animation: shaking ? "shake 0.15s ease-in-out 4" : "none",
        }}
      >
        <div style={{
          fontFamily: "monospace", fontSize: 44, fontWeight: "bold",
          color: "#FF3333",
          textShadow: "0 0 10px rgba(255,50,50,0.6), 0 0 30px rgba(255,50,50,0.3)",
          letterSpacing: 4,
        }}>
          {hh}:{mm}
        </div>
        <div style={{
          fontFamily: "monospace", fontSize: 13, color: "#FF333380",
          textShadow: "0 0 4px rgba(255,50,50,0.3)", marginTop: 2,
        }}>
          :{ss}
        </div>
      </div>

      {/* Boutons alarme / snooze */}
      <div style={{ marginTop: 14, display: "flex", justifyContent: "center", gap: 8 }}>
        {!alarmPlaying ? (
          <button onClick={triggerAlarm} style={btnStyle("#FF5555", "#FF333320")}>
            Tester l'alarme
          </button>
        ) : (
          <>
            <button
              onClick={hitSnooze}
              disabled={snoozeCount >= 5}
              style={btnStyle("#FFA500", snoozeCount >= 5 ? "#55330020" : "#FFA50020")}
            >
              SNOOZE ({5 - snoozeCount})
            </button>
            <button onClick={stopAlarm} style={btnStyle("#4CAF50", "#4CAF5020")}>
              Éteindre
            </button>
          </>
        )}
      </div>

      {/* Texte maman snooze */}
      {alarmPlaying && snoozeCount > 0 && (
        <div style={{
          marginTop: 10, padding: "8px 16px", borderRadius: 6,
          background: snoozeCount >= 4 ? "rgba(255,80,80,0.15)" : "rgba(255,165,0,0.1)",
          border: `1px solid ${snoozeCount >= 4 ? "rgba(255,80,80,0.3)" : "rgba(255,165,0,0.2)"}`,
          animation: snoozeCount >= 4 ? "shake 0.15s ease-in-out 2" : "fadeIn 0.3s ease-out",
        }}>
          <div style={{
            color: snoozeCount >= 4 ? "#FF6666" : "#FFA500",
            fontSize: 12, fontFamily: "'Tahoma', sans-serif",
            fontWeight: snoozeCount >= 4 ? "bold" : "normal",
          }}>
            {SNOOZE_TEXTS[snoozeCount - 1]}
          </div>
        </div>
      )}

      {/* Séparation */}
      <div style={{ margin: "18px 0", borderTop: `1px solid ${C.border}` }} />

      {/* Date rétro */}
      <div style={{ marginBottom: 12 }}>
        <div onClick={changeDate} style={{
          cursor: "pointer", display: "inline-block",
          background: retroDate.isVacances ? "rgba(255,165,0,0.1)" : "rgba(100,150,255,0.1)",
          border: `1px solid ${retroDate.isVacances ? "rgba(255,165,0,0.3)" : "rgba(100,150,255,0.3)"}`,
          padding: "6px 16px", borderRadius: 6, transition: "all 0.2s",
        }}>
          <div style={{
            fontSize: 13, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif",
            color: retroDate.isVacances ? "#FFA500" : "#6495ED",
          }}>
            {retroDate.label}
          </div>
          <div style={{ fontSize: 9, color: C.textMuted, marginTop: 2 }}>
            {retroDate.isVacances ? "VACANCES" : "Jour d'école"} - clic pour changer
          </div>
        </div>
      </div>

      {/* Sélecteur d'heure → flashback */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ color: C.textDim, fontSize: 10, marginBottom: 8, fontFamily: "'Tahoma', sans-serif" }}>
          Choisis une heure pour un flashback :
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 4 }}>
          {hours.map((h) => (
            <div
              key={h}
              onClick={() => pickFlashback(h)}
              style={{
                padding: "4px 8px", borderRadius: 4, cursor: "pointer",
                fontSize: 11, fontFamily: "monospace", fontWeight: "bold",
                background: selectedHour === h ? "rgba(255,50,50,0.2)" : C.bg,
                border: selectedHour === h ? "1px solid rgba(255,50,50,0.4)" : `1px solid ${C.border}`,
                color: selectedHour === h ? "#FF6666" : C.textDim,
                transition: "all 0.15s",
              }}
            >
              {h}
            </div>
          ))}
        </div>
      </div>

      {/* Flashback affiché */}
      {flashback && (
        <div style={{
          padding: "12px 16px", borderRadius: 8, animation: "fadeIn 0.4s ease-out",
          background: flashback.type === "vacances" ? "rgba(255,165,0,0.08)" : "rgba(100,150,255,0.08)",
          border: `1px solid ${flashback.type === "vacances" ? "rgba(255,165,0,0.2)" : "rgba(100,150,255,0.2)"}`,
        }}>
          <div style={{
            fontSize: 13, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif",
            color: flashback.type === "vacances" ? "#FFA500" : "#6495ED", marginBottom: 4,
          }}>
            {flashback.heure}
          </div>
          <div style={{
            color: C.text, fontSize: 12, lineHeight: 1.7,
            fontFamily: "'Tahoma', sans-serif", fontStyle: "italic",
          }}>
            {flashback.texte}
          </div>
        </div>
      )}

      {/* Record snooze */}
      <div style={{ ...viewFlavor, marginTop: 16 }}>
        Record de snooze : {Math.max(snoozeRecord, snoozeCount)} fois
        {snoozeRecord >= 5 && " (Maman a gagné.)"}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}

function btnStyle(color, bg) {
  return {
    background: bg,
    color: color,
    border: `1px solid ${color}60`,
    padding: "6px 16px",
    borderRadius: 6,
    cursor: "pointer",
    fontFamily: "'Tahoma', sans-serif",
    fontSize: 11,
    fontWeight: "bold",
    transition: "all 0.15s",
  };
}
