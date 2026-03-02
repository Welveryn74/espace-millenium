import { useState, useRef, useEffect, useCallback } from "react";
import NostalImg from "../../NostalImg";

/* ── Agenda — Feuilleter les pages ── */
function AgendaInteraction({ item }) {
  const [page, setPage] = useState(0);
  const pages = item.pages;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{
        background: "#FFFDE8", border: "1px solid #E0D8B0", borderRadius: 6,
        padding: 12, minHeight: 80, position: "relative",
        fontFamily: "'Comic Sans MS', cursive", fontSize: 12,
        lineHeight: 1.6, color: "#444",
        boxShadow: "inset 0 0 10px rgba(0,0,0,0.05)",
      }}>
        <div style={{ fontSize: 10, fontWeight: "bold", color: "#8B7355", marginBottom: 6 }}>
          {pages[page].title}
        </div>
        <div>{pages[page].content}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
          style={navBtn(page === 0)}>← Précédent</button>
        <span style={{ fontSize: 9, color: "#999" }}>{page + 1}/{pages.length}</span>
        <button onClick={() => setPage(p => Math.min(pages.length - 1, p + 1))} disabled={page === pages.length - 1}
          style={navBtn(page === pages.length - 1)}>Suivant →</button>
      </div>
    </div>
  );
}

/* ── Trousse — Fermeture éclair ── */
function ZipperInteraction({ item }) {
  const [zipOpen, setZipOpen] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

  useEffect(() => {
    if (zipOpen && zipProgress < 100) {
      const t = setTimeout(() => setZipProgress(p => Math.min(100, p + 12)), 30);
      return () => clearTimeout(t);
    }
    if (!zipOpen && zipProgress > 0) {
      const t = setTimeout(() => setZipProgress(p => Math.max(0, p - 12)), 30);
      return () => clearTimeout(t);
    }
  }, [zipOpen, zipProgress]);

  return (
    <div style={{ marginTop: 8 }}>
      <button onClick={() => setZipOpen(!zipOpen)} style={{
        background: zipOpen ? "#e74c3c20" : "#3498db20",
        border: `1px solid ${zipOpen ? "#e74c3c60" : "#3498db60"}`,
        borderRadius: 4, padding: "4px 14px", cursor: "pointer",
        fontSize: 11, fontWeight: "bold", color: "#555", width: "100%",
        fontFamily: "'Tahoma', sans-serif",
      }}>
        {zipOpen ? "Fermer la trousse 🔒" : "Ouvrir la fermeture éclair 🔓"}
      </button>
      {/* Zip track */}
      <div style={{
        margin: "8px 0", height: 6, background: "#ddd", borderRadius: 3,
        overflow: "hidden", position: "relative",
      }}>
        <div style={{
          height: "100%", background: "linear-gradient(90deg, #FFD700, #FFA500)",
          width: `${zipProgress}%`, transition: "width 0.05s linear", borderRadius: 3,
        }} />
      </div>
      {zipProgress > 80 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, animation: "slideUp 0.3s ease-out" }}>
          {item.zipContent.map((obj, i) => (
            <div key={i} style={{
              background: "#f8f8f8", border: "1px solid #e0e0e0", borderRadius: 4,
              padding: "4px 8px", fontSize: 10, color: "#555",
              animation: `slideUp 0.3s ease-out ${i * 0.05}s both`,
            }}>
              {obj.emoji} {obj.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Cahier de textes — Emploi du temps ── */
function TimetableInteraction({ item }) {
  const [day, setDay] = useState("lundi");
  const days = Object.keys(item.timetable);
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" }}>
        {days.map(d => (
          <button key={d} onClick={() => setDay(d)} style={{
            background: day === d ? "#3498db30" : "#f0f0f0",
            border: day === d ? "1px solid #3498db" : "1px solid #ddd",
            borderRadius: 4, padding: "3px 8px", cursor: "pointer",
            fontSize: 10, fontWeight: day === d ? "bold" : "normal",
            color: "#444", textTransform: "capitalize",
          }}>
            {d}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {item.timetable[day].map((slot, i) => (
          <div key={i} style={{
            background: i % 2 === 0 ? "#f9f9f9" : "#fff",
            border: "1px solid #eee", borderRadius: 3,
            padding: "4px 8px", fontSize: 10, color: "#555",
          }}>
            {slot}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Rapporteur interactif ── */
function ProtractorInteraction() {
  const [angle, setAngle] = useState(0);
  const [dragging, setDragging] = useState(false);
  const ref = useRef(null);

  const handleMove = useCallback((clientX, clientY) => {
    if (!dragging || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height;
    const a = Math.atan2(-(clientY - cy), clientX - cx) * 180 / Math.PI;
    setAngle(Math.max(0, Math.min(180, a)));
  }, [dragging]);

  useEffect(() => {
    const onMove = (e) => handleMove(e.clientX, e.clientY);
    const onUp = () => setDragging(false);
    if (dragging) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    }
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragging, handleMove]);

  return (
    <div style={{ marginTop: 8, textAlign: "center" }}>
      <div ref={ref} style={{
        width: 160, height: 85, margin: "0 auto", position: "relative",
        background: "linear-gradient(180deg, rgba(255,255,200,0.8), rgba(255,255,200,0.4))",
        borderRadius: "160px 160px 0 0", border: "2px solid #C8B060",
        borderBottom: "3px solid #8B7355",
      }}>
        {/* Angle marks */}
        {[0, 30, 45, 60, 90, 120, 135, 150, 180].map(a => {
          const rad = a * Math.PI / 180;
          const x = 80 + Math.cos(rad) * 70;
          const y = 82 - Math.sin(rad) * 70;
          return (
            <span key={a} style={{
              position: "absolute", left: x - 6, top: y - 5,
              fontSize: 7, color: "#8B7355", fontWeight: a % 90 === 0 ? "bold" : "normal",
            }}>
              {a}°
            </span>
          );
        })}
        {/* Needle */}
        <div style={{
          position: "absolute", bottom: 0, left: "50%",
          width: 2, height: 70, background: "#e74c3c",
          transformOrigin: "bottom center",
          transform: `translateX(-50%) rotate(${-(angle - 90)}deg)`,
          transition: dragging ? "none" : "transform 0.1s",
          borderRadius: 1,
        }} />
        {/* Drag handle */}
        <div
          onMouseDown={() => setDragging(true)}
          style={{
            position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%)",
            width: 12, height: 12, borderRadius: "50%",
            background: "#e74c3c", border: "2px solid #fff",
            cursor: "grab", boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
          }}
        />
      </div>
      <div style={{ fontSize: 14, fontWeight: "bold", color: "#5A3E1B", marginTop: 6 }}>
        {Math.round(angle)}°
      </div>
    </div>
  );
}

/* ── Pad de dessin ── */
function DrawInteraction({ item }) {
  const [color, setColor] = useState(item.colors[0]);
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPos = useRef(null);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e) => {
    drawing.current = true;
    lastPos.current = getPos(e);
  };

  const draw = (e) => {
    if (!drawing.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const pos = getPos(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDraw = () => { drawing.current = false; };

  const clear = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", gap: 3, marginBottom: 6, alignItems: "center" }}>
        {item.colors.map(c => (
          <div key={c} onClick={() => setColor(c)} style={{
            width: 18, height: 18, borderRadius: "50%", background: c,
            border: color === c ? "3px solid #333" : "2px solid #ccc",
            cursor: "pointer", transition: "all 0.15s",
            transform: color === c ? "scale(1.2)" : "scale(1)",
          }} />
        ))}
        <button onClick={clear} style={{
          marginLeft: 8, background: "#f0f0f0", border: "1px solid #ddd",
          borderRadius: 3, padding: "2px 8px", cursor: "pointer", fontSize: 9, color: "#888",
        }}>🗑️</button>
      </div>
      <canvas
        ref={canvasRef}
        width={280} height={120}
        onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
        onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
        style={{
          width: "100%", maxWidth: 280, height: 120, background: "#fff",
          borderRadius: 6, border: "2px solid #eee", cursor: "crosshair",
          touchAction: "none",
        }}
      />
    </div>
  );
}

/* ── Tracklist CD ── */
function TracklistInteraction({ item }) {
  const [playing, setPlaying] = useState(null);
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{
        textAlign: "center", marginBottom: 8,
        animation: "spin 4s linear infinite",
      }}>
        💿
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {item.tracks.map((t, i) => (
          <div key={i} onClick={() => setPlaying(playing === i ? null : i)} style={{
            display: "flex", alignItems: "center", gap: 6,
            background: playing === i ? "#3498db15" : (i % 2 === 0 ? "#f9f9f9" : "#fff"),
            border: playing === i ? "1px solid #3498db40" : "1px solid transparent",
            borderRadius: 3, padding: "3px 8px", cursor: "pointer", fontSize: 10, color: "#555",
          }}>
            <span style={{ fontSize: 8, color: "#999", width: 14, textAlign: "right" }}>{i + 1}.</span>
            <span style={{ flex: 1 }}>{t}</span>
            <span style={{ fontSize: 10 }}>{playing === i ? "🔊" : "▶"}</span>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 6, fontSize: 9, color: "#888", fontStyle: "italic",
        textAlign: "center",
      }}>
        💡 Ouvre le lecteur MP3 sur le bureau pour écouter la playlist !
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Goûter — Déballer ── */
function UnwrapInteraction({ item }) {
  const [unwrapped, setUnwrapped] = useState(null);
  const [unwrapping, setUnwrapping] = useState(false);

  const unwrap = (i) => {
    setUnwrapping(true);
    setTimeout(() => { setUnwrapped(i); setUnwrapping(false); }, 800);
  };

  return (
    <div style={{ marginTop: 8 }}>
      {unwrapped === null ? (
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          {item.snacks.map((s, i) => (
            <button key={i} onClick={() => unwrap(i)} disabled={unwrapping} style={{
              background: "#FFF8E0", border: "2px dashed #E6B800",
              borderRadius: 8, padding: "10px 14px", cursor: unwrapping ? "wait" : "pointer",
              fontSize: 11, color: "#5A3E1B", textAlign: "center",
              fontFamily: "'Tahoma', sans-serif",
              animation: unwrapping ? "shake 0.5s ease-in-out infinite" : "none",
            }}>
              <div style={{ fontSize: 20 }}>🎁</div>
              <div style={{ marginTop: 2, fontSize: 9 }}>{s.name}</div>
            </button>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: "center", animation: "slideUp 0.3s ease-out",
          padding: 12, background: "#FFF8E0", borderRadius: 8, border: "1px solid #E6B800",
        }}>
          <div style={{ fontSize: 36 }}>{item.snacks[unwrapped].emoji}</div>
          <div style={{ fontWeight: "bold", color: "#5A3E1B", marginTop: 4, fontSize: 12 }}>
            {item.snacks[unwrapped].name}
          </div>
          <div style={{ fontSize: 11, color: "#777", marginTop: 4, lineHeight: 1.5 }}>
            {item.snacks[unwrapped].desc}
          </div>
          <button onClick={() => setUnwrapped(null)} style={{
            marginTop: 8, background: "#E6B80020", border: "1px solid #E6B80060",
            borderRadius: 4, padding: "3px 12px", cursor: "pointer",
            fontSize: 10, color: "#5A3E1B",
          }}>
            Remballer 🎁
          </button>
        </div>
      )}
      <style>{`@keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-3px) rotate(-2deg); } 75% { transform: translateX(3px) rotate(2deg); } }`}</style>
    </div>
  );
}

/* ── Nokia — Mini Snake ── */
function NokiaInteraction() {
  return (
    <div style={{ marginTop: 8, textAlign: "center" }}>
      <div style={{
        background: "#2a2a3a", borderRadius: 12, padding: "12px 16px",
        display: "inline-block", border: "2px solid #444",
      }}>
        <div style={{
          background: "#9BBC0F", borderRadius: 4, padding: 8,
          color: "#0F380F", fontSize: 10, fontFamily: "monospace",
          textAlign: "center", minWidth: 120,
        }}>
          📱 Nokia 3310<br />
          Record Snake: 847<br />
          SMS: 2/3 restants<br />
          Batterie: ████░ 80%
        </div>
        <div style={{ fontSize: 8, color: "#888", marginTop: 6, fontStyle: "italic" }}>
          Le prof va le confisquer...
        </div>
      </div>
    </div>
  );
}

/* ── Chair de Poule — Jumpscare ── */
function JumpscareInteraction() {
  const [phase, setPhase] = useState("closed"); // closed | opening | scare | done

  const openBook = () => {
    setPhase("opening");
    setTimeout(() => setPhase("scare"), 1500);
    setTimeout(() => setPhase("done"), 2200);
  };

  return (
    <div style={{ marginTop: 8, textAlign: "center" }}>
      {phase === "closed" && (
        <button onClick={openBook} style={{
          background: "#1a0a2a", border: "2px solid #4A0080",
          borderRadius: 6, padding: "10px 20px", cursor: "pointer",
          color: "#00FF00", fontSize: 12, fontFamily: "monospace",
          fontWeight: "bold",
        }}>
          📖 Ouvrir le livre...
        </button>
      )}
      {phase === "opening" && (
        <div style={{
          fontSize: 12, color: "#666", fontStyle: "italic",
          animation: "fadeIn 0.5s ease-out",
        }}>
          Tu tournes les pages lentement...<br />
          <span style={{ fontSize: 10, color: "#999" }}>Page 66... 67... 68...</span>
        </div>
      )}
      {phase === "scare" && (
        <div style={{
          fontSize: 48, animation: "jumpScare 0.3s ease-out",
          textShadow: "0 0 20px #FF0000",
        }}>
          👹
        </div>
      )}
      {phase === "done" && (
        <div style={{ animation: "fadeIn 0.3s ease-out" }}>
          <div style={{ fontSize: 11, color: "#666", fontStyle: "italic", marginBottom: 8 }}>
            « Le pantin tourna lentement la tête et te fixa de ses yeux de verre... »
          </div>
          <button onClick={() => setPhase("closed")} style={{
            background: "#f0f0f0", border: "1px solid #ddd",
            borderRadius: 4, padding: "3px 12px", cursor: "pointer",
            fontSize: 10, color: "#666",
          }}>
            Refermer 😨
          </button>
        </div>
      )}
      <style>{`
        @keyframes jumpScare {
          0% { transform: scale(0.2); opacity: 0; }
          50% { transform: scale(1.5); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}

/* ── Carnet de correspondance ── */
function NotesInteraction({ item }) {
  const [flipped, setFlipped] = useState({});
  return (
    <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
      {item.notes.map((n, i) => (
        <div key={i} style={{
          background: n.note.includes("Félicitations") ? "#e8f5e920" : "#fff",
          border: "1px solid #ddd", borderRadius: 4, padding: "6px 10px",
          fontSize: 10, color: "#555",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
            <span style={{ fontWeight: "bold", color: "#333" }}>{n.date}</span>
            <span style={{ color: "#888", fontSize: 9 }}>{n.prof}</span>
          </div>
          <div style={{ fontStyle: "italic", marginBottom: 4 }}>{n.note}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 8, color: n.signed ? "#4CAF50" : "#e74c3c" }}>
              {n.signed ? "✅ Signé par les parents" : "❌ Pas encore signé..."}
            </span>
            {!n.signed && (
              <button onClick={() => setFlipped(f => ({ ...f, [i]: !f[i] }))} style={{
                background: flipped[i] ? "#4CAF5020" : "#FF980020",
                border: `1px solid ${flipped[i] ? "#4CAF5060" : "#FF980060"}`,
                borderRadius: 3, padding: "1px 6px", cursor: "pointer",
                fontSize: 8, color: "#555",
              }}>
                {flipped[i] ? "✅ Signé (imité)" : "Imiter la signature ? 🤫"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Photo de classe ── */
function ClassPhotoInteraction({ item }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{
        position: "relative", width: "100%", height: 140,
        background: "linear-gradient(180deg, #87CEEB 0%, #E8E8E8 40%, #D4C4A8 100%)",
        borderRadius: 6, border: "3px solid #8B7355", overflow: "hidden",
      }}>
        {item.students.map((s, i) => (
          <div
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: "absolute",
              left: `${s.pos[0]}%`, top: `${s.pos[1]}%`,
              transform: "translate(-50%, -50%)",
              fontSize: 18, cursor: "pointer",
              transition: "transform 0.2s",
              ...(hovered === i ? { transform: "translate(-50%, -50%) scale(1.4)", zIndex: 2 } : {}),
            }}
          >
            {s.name === "Mme Dupont" ? "👩‍🏫" : i % 2 === 0 ? "🧑" : "👧"}
          </div>
        ))}
        {hovered !== null && (
          <div style={{
            position: "absolute", bottom: 4, left: 4, right: 4,
            background: "rgba(255,255,255,0.95)", borderRadius: 4,
            padding: "4px 8px", fontSize: 10, color: "#333",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}>
            <strong>{item.students[hovered].name}</strong> — {item.students[hovered].desc}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Troll — Cheveux qui changent de couleur ── */
function TrollInteraction({ item }) {
  const [colorIdx, setColorIdx] = useState(0);
  const hairColor = item.hairColors[colorIdx];
  return (
    <div style={{ marginTop: 8, textAlign: "center" }}>
      <div
        onClick={() => setColorIdx((colorIdx + 1) % item.hairColors.length)}
        style={{ cursor: "pointer", display: "inline-block", transition: "transform 0.2s" }}
      >
        <div style={{
          width: 30, height: 40, background: hairColor,
          borderRadius: "8px 8px 2px 2px", margin: "0 auto",
          transition: "background 0.3s, transform 0.3s",
          transform: `scaleY(${1 + Math.random() * 0.2})`,
          boxShadow: `0 -5px 15px ${hairColor}80`,
        }} />
        <div style={{ fontSize: 32 }}>😜</div>
      </div>
      <div style={{ fontSize: 10, color: "#888", marginTop: 4 }}>
        Clique pour changer la couleur !
      </div>
    </div>
  );
}

/* ── Balle de tennis — Mini jeu de rebond ── */
function BounceInteraction() {
  const [bounces, setBounces] = useState(0);
  const [ballY, setBallY] = useState(0);
  const [animating, setAnimating] = useState(false);

  const bounce = () => {
    if (animating) return;
    setAnimating(true);
    setBounces(b => b + 1);
    setBallY(-40);
    setTimeout(() => setBallY(-20), 100);
    setTimeout(() => setBallY(-60), 200);
    setTimeout(() => setBallY(0), 400);
    setTimeout(() => setAnimating(false), 500);
  };

  return (
    <div style={{ marginTop: 8, textAlign: "center" }}>
      <div style={{ height: 80, position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
        <div
          onClick={bounce}
          style={{
            fontSize: 28, cursor: "pointer",
            transform: `translateY(${ballY}px)`,
            transition: "transform 0.15s ease-out",
            userSelect: "none",
          }}
        >
          🎾
        </div>
      </div>
      <div style={{ fontSize: 10, color: "#888", marginTop: 4 }}>
        Clique pour faire rebondir ! ({bounces} rebonds)
      </div>
    </div>
  );
}

/* ── Router d'interactions ── */
export default function CartableItemDetail({ item, onClose }) {
  const renderInteraction = () => {
    switch (item.interaction) {
      case "pages": return <AgendaInteraction item={item} />;
      case "zipper": return <ZipperInteraction item={item} />;
      case "timetable": return <TimetableInteraction item={item} />;
      case "protractor": return <ProtractorInteraction />;
      case "draw": return <DrawInteraction item={item} />;
      case "tracklist": return <TracklistInteraction item={item} />;
      case "unwrap": return <UnwrapInteraction item={item} />;
      case "nokia": return <NokiaInteraction />;
      case "jumpscare": return <JumpscareInteraction />;
      case "notes": return <NotesInteraction item={item} />;
      case "classPhoto": return <ClassPhotoInteraction item={item} />;
      case "troll": return <TrollInteraction item={item} />;
      case "bounce": return <BounceInteraction />;
      default: return null;
    }
  };

  return (
    <div style={{ animation: "slideUp 0.25s ease-out" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10, marginBottom: 8,
      }}>
        <NostalImg src={item.img} fallback={item.emoji} size={48} style={{ borderRadius: 6 }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: "bold", color: "#5A3E1B" }}>{item.name}</div>
          <div style={{ fontSize: 10, color: "#888", lineHeight: 1.5, marginTop: 2 }}>{item.desc}</div>
        </div>
      </div>
      {renderInteraction()}
      <button onClick={onClose} style={{
        marginTop: 10, background: "none", border: "1px solid #ddd",
        borderRadius: 4, padding: "3px 10px", cursor: "pointer",
        fontSize: 10, color: "#888", width: "100%",
      }}>
        Remettre dans le sac
      </button>
    </div>
  );
}

function navBtn(disabled) {
  return {
    background: disabled ? "#f0f0f0" : "#FFF5E0",
    border: `1px solid ${disabled ? "#ddd" : "#E6B800"}`,
    borderRadius: 4, padding: "3px 10px", cursor: disabled ? "default" : "pointer",
    fontSize: 10, color: disabled ? "#ccc" : "#5A3E1B",
    fontFamily: "'Tahoma', sans-serif",
    opacity: disabled ? 0.5 : 1,
  };
}
