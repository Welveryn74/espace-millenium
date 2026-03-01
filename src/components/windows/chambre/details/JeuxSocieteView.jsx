import { useState } from "react";
import NostalImg from "../../../NostalImg";
import { JEUX_SOCIETE } from "../../../../data/chambreItems";
import PetitsChevauxGame from "../../minigames/PetitsChevauxGame";

export default function JeuxSocieteView() {
  const [open, setOpen] = useState(null);
  const [playingChevaux, setPlayingChevaux] = useState(false);

  if (playingChevaux) {
    return (
      <div style={{ animation: "fadeIn 0.3s ease-out" }}>
        <button onClick={() => setPlayingChevaux(false)} style={{
          background: "none", border: "1px solid rgba(200,176,232,0.4)",
          color: "#C8B0E8", padding: "4px 12px", borderRadius: 4, cursor: "pointer",
          fontSize: 11, fontFamily: "'Tahoma', sans-serif", marginBottom: 10,
        }}>← Retour aux jeux</button>
        <PetitsChevauxGame onBack={() => setPlayingChevaux(false)} />
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <NostalImg fallback="🎲" size={36} />
        <div style={{ color: "#C8B0E8", fontSize: 15, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif", marginTop: 4 }}>
          Jeux de Société
        </div>
        <div style={{ color: "#8B6BAE", fontSize: 11, marginTop: 4, fontStyle: "italic" }}>
          La pile de boîtes dans le placard. Dimanche après-midi, c'est jeu de société.
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {JEUX_SOCIETE.map((g) => {
          const isOpen = open === g.id;
          return (
            <div
              key={g.id}
              onClick={() => setOpen(isOpen ? null : g.id)}
              style={{
                background: isOpen ? `${g.color}20` : "rgba(255,255,255,0.04)",
                border: isOpen ? `2px solid ${g.color}60` : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8, overflow: "hidden", cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { if (!isOpen) e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
              onMouseLeave={(e) => { if (!isOpen) e.currentTarget.style.background = isOpen ? `${g.color}20` : "rgba(255,255,255,0.04)"; }}
            >
              <div style={{
                padding: "10px 14px",
                background: isOpen ? `linear-gradient(135deg, ${g.color}30, ${g.color}10)` : "none",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <NostalImg src={g.img} fallback={g.emoji} size={26} />
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#E0E0E0", fontSize: 13, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif" }}>
                    {g.name}
                  </div>
                  <span style={{ fontSize: 9, color: "#888" }}>{g.players} joueurs</span>
                </div>
                <span style={{ color: "#666", fontSize: 10, transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
              </div>
              {isOpen && (
                <div style={{ animation: "fadeIn 0.2s ease-out" }}>
                  <div style={{ padding: "0 14px 12px 14px", display: "flex", gap: 12 }}>
                    <NostalImg src={g.img} fallback={g.emoji} size={100} style={{ borderRadius: 6, flexShrink: 0 }} />
                    <div style={{ color: "#AAA", fontSize: 11, lineHeight: 1.6 }}>{g.desc}</div>
                  </div>
                  {g.id === "petitsChevaux" && (
                    <div style={{ padding: "0 14px 12px 14px" }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setPlayingChevaux(true); }}
                        style={{
                          width: "100%", background: `${g.color}25`, color: "#E0E0E0",
                          border: `1px solid ${g.color}50`, padding: "6px 0",
                          borderRadius: 4, cursor: "pointer", fontFamily: "'Tahoma', sans-serif",
                          fontSize: 12, fontWeight: "bold", transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = `${g.color}45`; }}
                        onMouseLeave={e => { e.currentTarget.style.background = `${g.color}25`; }}
                      >▶ Jouer !</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginTop: 14, color: "#8B6BAE", fontSize: 10, fontStyle: "italic" }}>
        "C'est pas du jeu !" "Si c'est du jeu, c'est la règle !" "Non c'est PAS la règle !"
      </div>
    </div>
  );
}
