import { useState } from "react";
import { LIEUX } from "../../../../data/dehorsItems";
import { viewTitle, viewSubtitle, viewFlavor, card, D } from "../../../../styles/dehorsStyles";

const lieu = LIEUX.find((l) => l.id === "courRecre");

export default function CourRecreView() {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [phraseIndex, setPhraseIndex] = useState(0);

  const nextPhrase = () => setPhraseIndex((i) => (i + 1) % lieu.phrases.length);
  const current = lieu.activities.find((a) => a.id === selectedActivity);

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 36 }}>🏫</div>
        <div style={{ ...viewTitle, color: lieu.color, marginTop: 4 }}>{lieu.label}</div>
        <div style={viewSubtitle}>{lieu.desc}</div>
      </div>

      {/* Phrase culte */}
      <div
        onClick={nextPhrase}
        style={{
          textAlign: "center", padding: "10px 16px", margin: "0 auto 16px",
          background: `${lieu.color}15`, borderRadius: 8, cursor: "pointer",
          border: `1px solid ${lieu.color}30`, maxWidth: 400,
        }}
      >
        <div style={{ color: D.textDim, fontSize: 10, marginBottom: 4 }}>💬 Phrase culte (clique pour changer)</div>
        <div style={{ color: lieu.color, fontSize: 13, fontStyle: "italic", fontWeight: "bold" }}>
          « {lieu.phrases[phraseIndex]} »
        </div>
      </div>

      {/* Sonnerie */}
      <div style={{
        textAlign: "center", marginBottom: 14, padding: "6px 12px",
        background: "#4488FF10", borderRadius: 6, border: "1px solid #4488FF20",
      }}>
        <div style={{ color: "#4488FF", fontSize: 10, fontWeight: "bold" }}>
          🔔 DRIIIIING ! C'est la récré !
        </div>
      </div>

      {/* Jeux de cour */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
        {lieu.activities.map((act) => (
          <div
            key={act.id}
            onClick={() => setSelectedActivity(selectedActivity === act.id ? null : act.id)}
            style={card(selectedActivity === act.id, lieu.color)}
          >
            <div style={{ fontSize: 22, textAlign: "center" }}>{act.emoji}</div>
            <div style={{ color: D.text, fontSize: 11, fontWeight: "bold", textAlign: "center", marginTop: 4 }}>
              {act.name}
            </div>
          </div>
        ))}
      </div>

      {current && (
        <div style={{
          marginTop: 14, padding: 14, borderRadius: 10,
          background: `${lieu.color}10`, border: `1px solid ${lieu.color}30`,
          animation: "fadeIn 0.2s ease-out",
        }}>
          <div style={{ color: D.text, fontSize: 12 }}>
            <span style={{ fontSize: 18, marginRight: 6 }}>{current.emoji}</span>
            <strong>{current.name}</strong>
          </div>
          <div style={{ color: D.textDim, fontSize: 11, marginTop: 6, lineHeight: 1.5 }}>{current.desc}</div>
        </div>
      )}

      {/* Règles non-écrites */}
      <div style={{
        marginTop: 14, padding: 12, borderRadius: 8,
        background: D.bg, border: `1px dashed ${D.border}`,
      }}>
        <div style={{ color: lieu.color, fontSize: 11, fontWeight: "bold", marginBottom: 6 }}>
          📜 Règles non-écrites de la cour :
        </div>
        <div style={{ color: D.textDim, fontSize: 10, lineHeight: 1.7 }}>
          • "Pouce" = invincibilité temporaire (max 10 secondes, après on discute)<br />
          • Celui qui a le ballon décide du jeu<br />
          • Le dernier arrivé est le chat<br />
          • Si y a dispute, on fait "pierre-feuille-ciseaux"<br />
          • On se réconcilie TOUJOURS avant la fin de la récré<br />
          • Le banc du fond c'est réservé aux CM2
        </div>
      </div>

      <div style={viewFlavor}>{lieu.ambiance}</div>
    </div>
  );
}
