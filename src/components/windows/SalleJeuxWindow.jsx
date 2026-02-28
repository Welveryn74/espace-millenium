import { useState, useEffect } from "react";
import Win from "../Win";
import NostalImg from "../NostalImg";
import { CONSOLES } from "../../data/consoles";

export default function SalleJeuxWindow({ onClose, onMinimize, zIndex, onFocus }) {
  const [activeConsole, setActiveConsole] = useState(null);
  const [booting, setBooting] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const current = activeConsole !== null ? CONSOLES[activeConsole] : null;

  const openConsole = (index) => {
    setActiveConsole(index);
    setBooting(true);
    setSelectedGame(null);
  };

  useEffect(() => {
    if (!booting) return;
    const t = setTimeout(() => setBooting(false), 1200);
    return () => clearTimeout(t);
  }, [booting]);

  const goBack = () => {
    setActiveConsole(null);
    setSelectedGame(null);
    setBooting(false);
  };

  const titleColor = current ? current.color : "#444";
  const titleText = current
    ? `Salle de Jeux — ${current.name} (${current.year})`
    : "Salle de Jeux — Choisis ta console !";

  return (
    <Win title={titleText} onClose={onClose} onMinimize={onMinimize} width={540} height={500} zIndex={zIndex} onFocus={onFocus} initialPos={{ x: 200, y: 50 }} color={titleColor}>
      <div style={{ height: "100%", background: "linear-gradient(135deg, #1a1a2e, #16213e)", overflow: "hidden" }}>
        {activeConsole === null ? (
          /* ============ SHELF VIEW ============ */
          <div style={{ padding: 16, overflowY: "auto", height: "100%" }}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <NostalImg src="/images/desktop/sallejeux.png" fallback="🕹️" size={42} />
              <div style={{ fontSize: 15, fontWeight: "bold", color: "#E0E0E0", marginTop: 4, fontFamily: "'Tahoma', sans-serif" }}>
                Choisis ta console !
              </div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
                Replonge dans tes souvenirs d'enfance
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {CONSOLES.map((console, i) => (
                <div
                  key={console.id}
                  onClick={() => openConsole(i)}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    background: hoveredCard === i ? `${console.color}20` : "rgba(255,255,255,0.05)",
                    border: hoveredCard === i ? `1px solid ${console.color}60` : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 8,
                    padding: 14,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    animation: `slideUp 0.3s ease-out ${i * 0.05}s both`,
                    boxShadow: hoveredCard === i ? `0 0 16px ${console.color}30` : "none",
                    transform: hoveredCard === i ? "translateY(-2px)" : "translateY(0)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <NostalImg src={console.img} fallback={console.emoji} size={28} />
                    <div>
                      <div style={{ color: "#E0E0E0", fontSize: 13, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif" }}>
                        {console.name}
                      </div>
                      <div style={{ color: "#888", fontSize: 10, marginTop: 2 }}>{console.year}</div>
                    </div>
                  </div>
                  <div style={{ color: "#777", fontSize: 10, marginTop: 8, lineHeight: 1.5 }}>
                    {console.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : booting ? (
          /* ============ BOOT SEQUENCE ============ */
          <div style={{
            height: "100%",
            background: current.screenBg,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
          }}>
            {/* Scanlines */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "repeating-linear-gradient(transparent 0px, transparent 1px, rgba(0,0,0,0.12) 1px, rgba(0,0,0,0.12) 3px)",
            }} />
            <div style={{
              color: current.screenText,
              fontSize: 16,
              fontFamily: "monospace",
              textAlign: "center",
              whiteSpace: "pre-line",
              textShadow: `0 0 10px ${current.screenText}60`,
              animation: "bootFlicker 1.2s ease-out",
            }}>
              {current.bootText}
            </div>
          </div>
        ) : (
          /* ============ CONSOLE VIEW ============ */
          <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Back button */}
            <div style={{ padding: "8px 12px", borderBottom: `1px solid ${current.color}30` }}>
              <button
                onClick={goBack}
                style={{
                  background: "none",
                  border: `1px solid ${current.color}50`,
                  color: current.color,
                  padding: "4px 12px",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: "bold",
                  fontFamily: "'Tahoma', sans-serif",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${current.color}20`; }}
                onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
              >
                ← Retour
              </button>
            </div>

            {/* Screen area */}
            <div style={{
              flex: 1,
              background: current.screenBg,
              padding: 16,
              overflowY: "auto",
              position: "relative",
            }}>
              {/* Scanlines overlay */}
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "repeating-linear-gradient(transparent 0px, transparent 1px, rgba(0,0,0,0.1) 1px, rgba(0,0,0,0.1) 3px)",
              }} />

              {/* Console header */}
              <div style={{
                textAlign: "center", marginBottom: 16,
                animation: "fadeIn 0.4s ease-out",
              }}>
                <NostalImg src={current.img} fallback={current.emoji} size={32} />
                <div style={{
                  color: current.screenText,
                  fontSize: 16, fontWeight: "bold",
                  fontFamily: "'Tahoma', sans-serif",
                  textShadow: `0 0 10px ${current.screenText}40`,
                  marginTop: 4,
                }}>
                  {current.name}
                </div>
                <div style={{ color: `${current.screenText}99`, fontSize: 10, marginTop: 2, fontStyle: "italic" }}>
                  {current.description}
                </div>
              </div>

              {/* Game list */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, position: "relative" }}>
                {current.games.map((game, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedGame(selectedGame === i ? null : i)}
                    style={{
                      background: selectedGame === i ? `${current.screenText}15` : `${current.screenText}08`,
                      border: selectedGame === i ? `1px solid ${current.screenText}40` : `1px solid ${current.screenText}18`,
                      borderRadius: 6,
                      padding: 10,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      animation: `slideUp 0.3s ease-out ${i * 0.06}s both`,
                    }}
                    onMouseEnter={e => {
                      if (selectedGame !== i) e.currentTarget.style.background = `${current.screenText}12`;
                    }}
                    onMouseLeave={e => {
                      if (selectedGame !== i) e.currentTarget.style.background = `${current.screenText}08`;
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 20 }}>{game.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <span style={{
                          color: current.screenText,
                          fontSize: 12, fontWeight: "bold",
                          fontFamily: "'Tahoma', sans-serif",
                        }}>
                          {game.name}
                        </span>
                        <span style={{ color: `${current.screenText}60`, fontSize: 10, marginLeft: 6 }}>
                          ({game.year})
                        </span>
                      </div>
                      <span style={{ color: `${current.screenText}60`, fontSize: 10 }}>
                        {selectedGame === i ? "▼" : "▶"}
                      </span>
                    </div>

                    {selectedGame === i && (
                      <div style={{
                        marginTop: 8,
                        paddingTop: 8,
                        borderTop: `1px solid ${current.screenText}20`,
                        color: `${current.screenText}CC`,
                        fontSize: 11,
                        lineHeight: 1.7,
                        fontStyle: "italic",
                        animation: "slideUp 0.2s ease-out",
                      }}>
                        {game.desc}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Win>
  );
}
