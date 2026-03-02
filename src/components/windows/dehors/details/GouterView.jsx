import { useState } from "react";
import { LIEUX } from "../../../../data/dehorsItems";
import { viewTitle, viewSubtitle, viewFlavor, card, D } from "../../../../styles/dehorsStyles";

const lieu = LIEUX.find((l) => l.id === "gouter");

export default function GouterView() {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [phraseIndex, setPhraseIndex] = useState(0);

  const nextPhrase = () => setPhraseIndex((i) => (i + 1) % lieu.phrases.length);
  const current = lieu.activities.find((a) => a.id === selectedActivity);

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 36 }}>🍫</div>
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

      {/* Programme de l'après-midi */}
      <div style={{
        marginBottom: 14, padding: "8px 12px", borderRadius: 8,
        background: `${lieu.color}08`, border: `1px dashed ${lieu.color}30`,
      }}>
        <div style={{ color: lieu.color, fontSize: 11, fontWeight: "bold", marginBottom: 6 }}>
          📋 Programme de l'aprèm' :
        </div>
        <div style={{ color: D.textDim, fontSize: 10, lineHeight: 1.8 }}>
          14h00 — Arrivée, on enlève les chaussures<br />
          14h30 — Goûter devant la télé<br />
          15h00 — Console dans la chambre du grand frère<br />
          16h00 — Dehors dans le jardin<br />
          17h30 — Re-goûter (on a faim)<br />
          18h00 — "Maman est là !" 😭
        </div>
      </div>

      {/* Activités */}
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

      <div style={viewFlavor}>{lieu.ambiance}</div>
    </div>
  );
}
