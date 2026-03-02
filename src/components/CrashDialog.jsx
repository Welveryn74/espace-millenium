import { useState } from "react";
import { playClick } from "../utils/uiSounds";

const PROGRAMS = [
  { name: "Internet Explorer", icon: "🌐" },
  { name: "Kazaa", icon: "🎵" },
  { name: "RealPlayer", icon: "▶️" },
  { name: "MSN Messenger", icon: "💬" },
  { name: "Windows Media Player", icon: "🎬" },
  { name: "Norton AntiVirus", icon: "🛡️" },
];

const BTN = {
  padding: "4px 14px",
  background: "linear-gradient(180deg, #F4F4F4 0%, #E4E4E4 50%, #D4D4D4 100%)",
  border: "1px solid #888",
  borderRadius: 3,
  cursor: "pointer",
  fontFamily: "'Tahoma', sans-serif",
  fontSize: 11,
  color: "#000",
  minWidth: 80,
};

export default function CrashDialog({ onClose }) {
  const [program] = useState(() => PROGRAMS[Math.floor(Math.random() * PROGRAMS.length)]);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    playClick();
    setSent(true);
    setTimeout(onClose, 2200);
  };

  const handleDontSend = () => {
    playClick();
    onClose();
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99995,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "#ECE9D8",
        border: "2px solid #0055E5",
        borderRadius: "8px 8px 0 0",
        width: 420,
        fontFamily: "'Tahoma', sans-serif",
        boxShadow: "4px 8px 28px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.18)",
        animation: "popIn 0.2s ease-out",
      }}>
        {/* Barre titre XP */}
        <div style={{
          background: "linear-gradient(180deg, #0055E5 0%, #0055E5CC 40%, #0055E599 60%, #0055E5 100%)",
          padding: "5px 6px 5px 10px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderRadius: "6px 6px 0 0",
        }}>
          <div style={{ color: "#fff", fontWeight: "bold", fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 15 }}>{program.icon}</span>
            {program.name}
          </div>
          <button
            onClick={handleDontSend}
            style={{
              width: 22, height: 22,
              background: "linear-gradient(180deg, #E97755 0%, #C43322 100%)",
              border: "1px solid rgba(0,0,0,0.3)", borderRadius: 3,
              color: "#fff", fontWeight: "bold", fontSize: 11,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              lineHeight: 1, padding: 0,
            }}
          >✕</button>
        </div>

        {/* Contenu */}
        <div style={{ padding: "18px 20px 20px" }}>
          {!sent ? (
            <>
              <div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
                <div style={{ fontSize: 44, flexShrink: 0, lineHeight: 1 }}>⚠️</div>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: 13, marginBottom: 8, color: "#000" }}>
                    {program.name} ne répond plus.
                  </div>
                  <div style={{ fontSize: 11, color: "#333", lineHeight: 1.65, marginBottom: 8 }}>
                    Si vous fermez ce programme, vous risquez de perdre les informations non enregistrées.
                  </div>
                  <div style={{ fontSize: 11, color: "#555", lineHeight: 1.6, borderLeft: "3px solid #ccc", paddingLeft: 8 }}>
                    Microsoft souhaite en savoir plus sur ce problème.<br />
                    Si vous envoyez un rapport, des informations techniques seront transmises à Microsoft.
                  </div>
                </div>
              </div>

              {/* Séparateur */}
              <div style={{ height: 1, background: "#C8C5B8", margin: "0 -4px 14px" }} />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button onClick={handleSend} style={BTN}>
                  Envoyer le rapport d'erreur
                </button>
                <button onClick={handleDontSend} style={BTN}>
                  Ne pas envoyer
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "12px 0 6px" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>📤</div>
              <div style={{ fontSize: 12, color: "#333", lineHeight: 1.6 }}>
                Rapport d'erreur envoyé à Microsoft.<br />
                <span style={{ fontSize: 10, color: "#888" }}>Merci pour votre aide à l'amélioration de Windows XP.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
