import { useState } from "react";
import { getUsername, getRecentActivities } from "../utils/storage";

const ACTIVITY_MESSAGES = {
  open_salleJeux: "Encore Snake ? Tu vas avoir les yeux carrés !",
  open_mp3: "Tu écoutes encore de la musique ? Pense à tes devoirs !",
  msn_message: "Arrête de discuter sur MSN, ta mère va voir la facture !",
  open_skyblog: "Ton skyblog a reçu un nouveau commentaire ! Ah non, c'est juste moi.",
  open_tv: "T'es encore devant la télé ? Va jouer dehors !",
  open_paint: "Oh, tu dessines ? Montre-moi quand t'as fini !",
  open_dressing: "Tu changes de tenue ? T'es déjà très bien comme ça.",
  open_cartable: "T'as vérifié ton cartable ? T'as sûrement oublié un truc.",
  open_chambre: "Range ta chambre avant que maman arrive !",
};

export function pickClippyMessage() {
  const name = getUsername();
  const baseMessages = [
    "Il semblerait que vous essayez d'écrire une lettre. Puis-je vous aider ?",
    "Conseil : appuyez sur Ctrl+S pour sauvegarder. Ah non, c'est un site web.",
    "Saviez-vous que ce PC tourne sous un Pentium III à 800 MHz ? Impressionnant.",
    "N'oubliez pas de vider votre corbeille de temps en temps !",
    "Astuce : ne téléchargez JAMAIS kazaa_setup_definitive_final_v2.exe",
    "Votre connexion 56K est optimale. Comptez 45 min pour une chanson MP3.",
    "Je vois que vous ne faites rien. Moi non plus. On est pareils finalement.",
    `Conseil : changez votre mot de passe MSN. '${name.toLowerCase()}2005' c'est pas sécurisé.`,
    "Vous avez 0 nouveau message sur Caramail. Comme d'habitude.",
    "Rappel : votre exposé sur les volcans est à rendre lundi.",
    `Tiens ${name}, t'as pas cours demain ? Il est 23h quand même...`,
    "Psst... tu veux voir un truc cool ? Tape 'about:blank' dans Internet Explorer.",
  ];

  // Messages nocturnes (22h-6h)
  const hour = new Date().getHours();
  if (hour >= 22 || hour < 6) {
    const nightMessages = [
      "Il est tard ! Éteins cet ordinateur !",
      `${name}, tu devrais dormir... t'as école demain !`,
      "Ta mère va te gronder si elle voit que t'es encore debout.",
      "Les yeux rivés sur l'écran à cette heure... classique.",
      "Psst... tu sais quelle heure il est ? Moi oui, et c'est TARD.",
    ];
    if (Math.random() < 0.4) {
      return nightMessages[Math.floor(Math.random() * nightMessages.length)];
    }
  }

  // 30% chance de réagir à une activité récente
  if (Math.random() < 0.3) {
    const activities = getRecentActivities(5);
    for (let i = activities.length - 1; i >= 0; i--) {
      const msg = ACTIVITY_MESSAGES[activities[i].action];
      if (msg) return msg;
    }
  }

  return baseMessages[Math.floor(Math.random() * baseMessages.length)];
}

// Compatibility: export CLIPPY_MESSAGES for EspaceMillenium's used count system
const MESSAGES = [
  "Il semblerait que vous essayez d'écrire une lettre. Puis-je vous aider ?",
  "Conseil : appuyez sur Ctrl+S pour sauvegarder. Ah non, c'est un site web.",
  "Saviez-vous que ce PC tourne sous un Pentium III à 800 MHz ? Impressionnant.",
  "N'oubliez pas de vider votre corbeille de temps en temps !",
  "Astuce : ne téléchargez JAMAIS kazaa_setup_definitive_final_v2.exe",
  "Votre connexion 56K est optimale. Comptez 45 min pour une chanson MP3.",
  "Je vois que vous ne faites rien. Moi non plus. On est pareils finalement.",
  "Conseil : changez votre mot de passe MSN. C'est pas sécurisé.",
  "Vous avez 0 nouveau message sur Caramail. Comme d'habitude.",
  "Rappel : votre exposé sur les volcans est à rendre lundi.",
  "Tiens, t'as pas cours demain ? Il est 23h quand même...",
  "Psst... tu veux voir un truc cool ? Tape 'about:blank' dans Internet Explorer.",
];

export { MESSAGES as CLIPPY_MESSAGES };

export default function Clippy({ message, onClose }) {
  const [hoverClose, setHoverClose] = useState(false);

  return (
    <div style={{
      position: "fixed", bottom: 50, right: 20, zIndex: 100,
      display: "flex", flexDirection: "column", alignItems: "flex-end",
      animation: "clippyPopIn 0.3s ease-out",
      pointerEvents: "auto",
    }}>
      {/* Speech bubble */}
      <div style={{
        background: "#FFFFCC",
        border: "2px solid #333",
        borderRadius: 12,
        padding: "10px 14px",
        maxWidth: 240,
        fontSize: 11,
        fontFamily: "'Tahoma', sans-serif",
        color: "#333",
        lineHeight: 1.5,
        position: "relative",
        marginBottom: 6,
        boxShadow: "2px 2px 8px rgba(0,0,0,0.2)",
      }}>
        {/* Close button */}
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          onMouseEnter={() => setHoverClose(true)}
          onMouseLeave={() => setHoverClose(false)}
          style={{
            position: "absolute", top: 3, right: 5,
            background: hoverClose ? "#E86" : "transparent",
            border: "none", cursor: "pointer",
            fontSize: 12, color: hoverClose ? "#fff" : "#888",
            fontWeight: "bold", borderRadius: 2,
            width: 16, height: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 0,
          }}
        >✕</button>
        <div style={{ paddingRight: 14 }}>{message}</div>
        {/* Bubble tail */}
        <div style={{
          position: "absolute", bottom: -8, right: 24,
          width: 0, height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderTop: "8px solid #333",
        }} />
        <div style={{
          position: "absolute", bottom: -5, right: 26,
          width: 0, height: 0,
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: "6px solid #FFFFCC",
        }} />
      </div>

      {/* Paperclip character */}
      <div style={{
        width: 50, height: 80, position: "relative",
        animation: "clippyBounce 2s ease-in-out infinite",
      }}>
        {/* Main body — curved paperclip shape */}
        <div style={{
          position: "absolute", left: 10, top: 0,
          width: 28, height: 70,
          border: "4px solid #7B7B7B",
          borderRadius: "14px 14px 14px 14px",
          background: "transparent",
        }} />
        {/* Inner curve */}
        <div style={{
          position: "absolute", left: 16, top: 16,
          width: 16, height: 42,
          border: "3px solid #9B9B9B",
          borderRadius: "8px 8px 10px 10px",
          background: "transparent",
        }} />
        {/* Left eye */}
        <div style={{
          position: "absolute", left: 15, top: 22,
          width: 7, height: 9,
          background: "#fff",
          borderRadius: "50%",
          border: "1.5px solid #555",
        }}>
          <div style={{
            position: "absolute", left: 2, top: 2,
            width: 3, height: 3, borderRadius: "50%",
            background: "#222",
          }} />
        </div>
        {/* Right eye (raised — classic Clippy) */}
        <div style={{
          position: "absolute", left: 28, top: 18,
          width: 7, height: 9,
          background: "#fff",
          borderRadius: "50%",
          border: "1.5px solid #555",
        }}>
          <div style={{
            position: "absolute", left: 2, top: 2,
            width: 3, height: 3, borderRadius: "50%",
            background: "#222",
          }} />
        </div>
      </div>

      <style>{`
        @keyframes clippyPopIn {
          0% { transform: scale(0) translateY(20px); opacity: 0; }
          60% { transform: scale(1.1) translateY(-4px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes clippyBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
