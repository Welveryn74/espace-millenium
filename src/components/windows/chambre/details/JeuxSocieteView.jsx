import { useState } from "react";
import NostalImg from "../../../NostalImg";
import { JEUX_SOCIETE } from "../../../../data/chambreItems";
import PetitsChevauxGame from "../../minigames/PetitsChevauxGame";
import MilleBornesGame from "../../minigames/MilleBornesGame";
import MonopolySpeedGame from "../../minigames/MonopolySpeedGame";
import { viewTitle, viewSubtitle, viewFlavor, C } from "../../../../styles/chambreStyles";

const PLAYABLE = {
  petitsChevaux: { label: "Jouer !", component: PetitsChevauxGame },
  unMille: { label: "Jouer !", component: MilleBornesGame },
  monopoly: { label: "Jouer !", component: MonopolySpeedGame },
};

export default function JeuxSocieteView() {
  const [open, setOpen] = useState(null);
  const [playing, setPlaying] = useState(null); // game id
  const [hovered, setHovered] = useState(null);

  if (playing && PLAYABLE[playing]) {
    const GameComp = PLAYABLE[playing].component;
    return (
      <div style={{ animation: "fadeIn 0.3s ease-out" }}>
        <button onClick={() => setPlaying(null)} style={{
          background: "none", border: `1px solid ${C.primary}60`,
          color: C.primary, padding: "4px 12px", borderRadius: 4, cursor: "pointer",
          fontSize: 11, fontFamily: "'Tahoma', sans-serif", marginBottom: 10,
        }}>Retour aux jeux</button>
        <GameComp onBack={() => setPlaying(null)} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <NostalImg fallback="🎲" size={36} />
        <div style={{ ...viewTitle, marginTop: 4 }}>Jeux de Société</div>
        <div style={viewSubtitle}>La pile de boîtes dans le placard. Dimanche après-midi, c'est jeu de société.</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {JEUX_SOCIETE.map((g) => {
          const isOpen = open === g.id;
          const isHovered = hovered === g.id;
          const playable = PLAYABLE[g.id];
          return (
            <div
              key={g.id}
              onClick={() => setOpen(isOpen ? null : g.id)}
              onMouseEnter={() => setHovered(g.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: isOpen ? `${g.color}20` : isHovered ? C.bgHover : C.bg,
                border: isOpen ? `2px solid ${g.color}60` : `1px solid ${C.border}`,
                borderRadius: 8, overflow: "hidden", cursor: "pointer",
                transition: "all 0.25s ease",
              }}
            >
              <div style={{
                padding: "10px 14px",
                background: isOpen
                  ? `linear-gradient(135deg, ${g.color}30, ${g.color}10)`
                  : "none",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{
                  transition: "transform 0.25s ease",
                  transform: isHovered && !isOpen ? "translateX(-4px)" : "translateX(0)",
                }}>
                  <NostalImg src={g.img} fallback={g.emoji} size={isOpen ? 36 : 26} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: C.text, fontSize: 13, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
                    {g.name}
                    {playable && <span style={{ fontSize: 8, padding: "1px 4px", borderRadius: 3, background: "#4CAF5030", color: "#4CAF50" }}>JOUABLE</span>}
                  </div>
                  <span style={{
                    fontSize: 9, padding: "1px 6px", borderRadius: 4,
                    background: `${g.color}25`, color: g.color, fontWeight: "bold",
                    display: "inline-block", marginTop: 2,
                  }}>
                    {g.players} joueurs
                  </span>
                </div>
                <span style={{
                  color: C.textMuted, fontSize: 10,
                  transition: "transform 0.2s",
                  transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                }}>▶</span>
              </div>
              {isOpen && (
                <div style={{ animation: "fadeIn 0.2s ease-out" }}>
                  <div style={{
                    padding: "0 14px 12px 14px", display: "flex", gap: 12,
                    backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}>
                    <NostalImg src={g.img} fallback={g.emoji} size={80} style={{ borderRadius: 6, flexShrink: 0 }} />
                    <div style={{ color: C.textDim, fontSize: 11, lineHeight: 1.6 }}>{g.desc}</div>
                  </div>
                  {playable && (
                    <div style={{ padding: "0 14px 12px 14px" }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setPlaying(g.id); }}
                        style={{
                          width: "100%", background: `${g.color}25`, color: C.text,
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

      <div style={viewFlavor}>
        "C'est pas du jeu !" "Si c'est du jeu, c'est la règle !" "Non c'est PAS la règle !"
      </div>
    </div>
  );
}
