import { useState, useEffect } from "react";
import { playError } from "../../../../utils/uiSounds";
import { KAZAA_DOWNLOADS } from "../../../../data/webPages";

function formatETA(remaining, speed) {
  if (speed <= 0 || remaining <= 0) return "";
  const secs = remaining / speed;
  if (secs > 3600) return `${Math.floor(secs / 3600)}h ${Math.floor((secs % 3600) / 60)}min restantes`;
  if (secs > 60) return `${Math.floor(secs / 60)}min ${Math.floor(secs % 60)}s restantes`;
  return `${Math.floor(secs)}s restantes`;
}

export default function PageKazaa({ onBSOD }) {
  const [downloads, setDownloads] = useState(() =>
    KAZAA_DOWNLOADS.map(dl => ({ ...dl }))
  );
  const [virusPopup, setVirusPopup] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => {
      setDownloads(prev => prev.map(dl => {
        if (dl.progress >= 100 || dl.speed <= 0) return dl;
        const increment = dl.speed * (0.7 + Math.random() * 0.6);
        const newProgress = Math.min(100, dl.progress + increment);
        return { ...dl, progress: newProgress };
      }));
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  // Detect virus file completion
  useEffect(() => {
    const virus = downloads.find(d => d.name === "photo_vacances_2004.jpg.exe");
    if (virus && virus.progress >= 100 && !virusPopup) {
      // Already at 100 from start — show popup after a short delay
    }
  }, [downloads, virusPopup]);

  const handleVirusOpen = () => {
    setVirusPopup(false);
    if (onBSOD) onBSOD();
  };

  return (
    <div style={{
      fontFamily: "Tahoma, sans-serif", fontSize: 12,
      background: "linear-gradient(180deg, #001133 0%, #002266 50%, #001133 100%)",
      color: "#fff", minHeight: "100%", padding: 20,
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 28, fontWeight: "bold", color: "#00BFFF", letterSpacing: 2 }}>
          ♪ KaZaA ♪
        </div>
        <div style={{ fontSize: 10, color: "#77AADD" }}>Peer-to-Peer File Sharing — v3.2.7</div>
      </div>

      {/* Connection info */}
      <div style={{
        background: "rgba(0,100,200,0.15)", border: "1px solid #0066AA",
        borderRadius: 4, padding: 8, marginBottom: 16, fontSize: 11, textAlign: "center",
      }}>
        🔌 Votre connexion : <strong>4.8 Ko/s</strong> (Wanadoo 56K) — Utilisateurs connectés : 3 247 891
      </div>

      {/* Downloads */}
      <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 4, overflow: "hidden" }}>
        {/* Table header */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 70px 140px 60px",
          padding: "6px 10px", background: "rgba(0,100,200,0.3)", fontSize: 10,
          fontWeight: "bold", color: "#88CCFF",
        }}>
          <span>Fichier</span><span>Taille</span><span>Progression</span><span>État</span>
        </div>

        {downloads.map((dl, i) => {
          const pct = Math.min(100, Math.floor(dl.progress));
          const done = pct >= 100;
          const isDanger = dl.status === "danger";
          return (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "1fr 70px 140px 60px",
              padding: "8px 10px", borderBottom: "1px solid rgba(255,255,255,0.05)",
              alignItems: "center",
            }}>
              <span style={{
                fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                color: isDanger ? "#FF4444" : "#fff",
              }}>
                {isDanger ? "⚠️ " : "📄 "}{dl.name}
              </span>
              <span style={{ fontSize: 10, color: "#aaa" }}>{dl.size}</span>
              <div>
                <div style={{
                  height: 10, background: "rgba(255,255,255,0.1)",
                  borderRadius: 5, overflow: "hidden", marginBottom: 2,
                }}>
                  <div style={{
                    height: "100%", borderRadius: 5,
                    width: `${pct}%`,
                    transition: "width 1s linear",
                    background: isDanger ? "#FF4444"
                      : done ? "#00CC00"
                      : pct >= 90 ? "#00CC00"
                      : "linear-gradient(90deg, #0066FF, #00AAFF)",
                  }} />
                </div>
                <div style={{ fontSize: 9, color: done ? "#0C0" : "#888" }}>
                  {done
                    ? (isDanger ? "100% — ⚠️ Suspect" : "Terminé ✓")
                    : `${pct}%${dl.speed > 0 ? ` — ${formatETA(100 - dl.progress, dl.speed)}` : ""}`
                  }
                </div>
              </div>
              <span style={{ fontSize: 12, textAlign: "center" }}>
                {done ? (isDanger ? (
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => { playError(); setVirusPopup(true); }}
                  >⚠️</span>
                ) : "✅") : "⏳"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Warning */}
      <div style={{
        marginTop: 16, padding: 8, background: "rgba(255,68,68,0.1)",
        border: "1px solid rgba(255,68,68,0.3)", borderRadius: 4,
        fontSize: 10, color: "#FF8888", textAlign: "center",
      }}>
        ⚠️ Attention : "photo_vacances_2004.jpg.exe" — Fichier suspect détecté. Téléchargement non recommandé.
      </div>

      {/* Virus Norton popup */}
      {virusPopup && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 99998,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.5)",
        }} onClick={() => setVirusPopup(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#ECE9D8", border: "2px solid #CC0000", borderRadius: "8px 8px 0 0",
            width: 380, boxShadow: "4px 4px 20px rgba(0,0,0,0.5)",
            fontFamily: "'Tahoma', sans-serif",
          }}>
            <div style={{
              background: "linear-gradient(180deg, #CC0000 0%, #990000 100%)",
              padding: "6px 10px", color: "#fff", fontWeight: "bold", fontSize: 12,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span>⚠️ Norton AntiVirus 2005</span>
              <button onClick={() => setVirusPopup(false)} style={{
                width: 20, height: 20, border: "1px solid rgba(0,0,0,0.3)", borderRadius: 3,
                background: "linear-gradient(180deg, #E97 0%, #C44 100%)", color: "#fff",
                fontWeight: "bold", fontSize: 11, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>✕</button>
            </div>
            <div style={{ padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>⚠️</div>
              <div style={{ fontWeight: "bold", fontSize: 13, color: "#CC0000", marginBottom: 8 }}>
                Menace détectée !
              </div>
              <div style={{ fontSize: 11, color: "#333", lineHeight: 1.6, marginBottom: 16 }}>
                Norton AntiVirus a détecté une menace dans le fichier :<br />
                <strong>photo_vacances_2004.jpg.exe</strong><br />
                Type : Trojan.Win32.FakeImage<br />
                Fichier mis en quarantaine.
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button onClick={() => setVirusPopup(false)} style={{
                  padding: "5px 20px", background: "linear-gradient(180deg, #E8E8E8 0%, #C8C8C8 100%)",
                  border: "1px solid #888", borderRadius: 3, cursor: "pointer", fontSize: 11,
                  fontFamily: "'Tahoma', sans-serif",
                }}>OK</button>
                <button onClick={handleVirusOpen} style={{
                  padding: "5px 20px", background: "linear-gradient(180deg, #FFE0E0 0%, #FFC0C0 100%)",
                  border: "1px solid #C88", borderRadius: 3, cursor: "pointer", fontSize: 11,
                  fontFamily: "'Tahoma', sans-serif", color: "#900",
                }}>Ouvrir quand même</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
