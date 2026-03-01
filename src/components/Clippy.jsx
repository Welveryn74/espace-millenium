import { useState } from "react";
import { getUsername, getRecentActivities } from "../utils/storage";

const ACTIVITY_MESSAGES = {
  open_salleJeux: "Encore Snake ? Tu vas avoir les yeux carrés !",
  open_mp3: "Tu écoutes encore de la musique ? Pense à tes devoirs !",
  msn_message: "Arrête de discuter sur MSN, ta mère va voir la facture !",
  open_skyblog: "Ton skyblog a reçu un nouveau commentaire ! Ah non, c'est juste moi.",
  open_tv: "T'es encore devant la télé ? Va jouer dehors !",
  open_paint: "Oh, tu dessines ? Montre-moi quand t'as fini !",
  open_cartable: "T'as vérifié ton cartable ? T'as sûrement oublié un truc.",
  open_chambre: "Range ta chambre avant que maman arrive !",
  open_ie: "Internet Explorer est le navigateur le plus sécurisé du monde. Si, si.",
  open_demineur: "Le démineur, c'est comme la vraie vie : un mauvais clic et tout explose.",
  open_caramail: "Vous avez 0 message. Mais moi je suis là, c'est déjà pas mal !",
  open_corbeille: "Vous fouinez dans la corbeille ? Fascinant...",
};

export function pickClippyMessage(openWindowCount, bootTime) {
  const name = getUsername();

  // Messages méta dynamiques (15% chance si des données sont disponibles)
  if (openWindowCount !== undefined && Math.random() < 0.15) {
    const minutesElapsed = bootTime ? Math.floor((Date.now() - bootTime) / 60000) : 0;
    const metaMessages = [
      `Vous avez ouvert ${openWindowCount} fenêtre${openWindowCount > 1 ? "s" : ""}. Votre Pentium III pleure.`,
      "Je remarque que vous ne suivez jamais mes conseils. C'est vexant.",
      "Envie d'en savoir plus ? Encyclopédie Encarta 2005, seulement 49,99\u20AC ! (pub)",
      `Vous utilisez cet ordinateur depuis ${minutesElapsed} minute${minutesElapsed > 1 ? "s" : ""}. C'est ${minutesElapsed} minute${minutesElapsed > 1 ? "s" : ""} de devoirs en moins.`,
      "Je suis obligé d'être là. Vous aussi, apparemment.",
    ];
    return metaMessages[Math.floor(Math.random() * metaMessages.length)];
  }

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
    "Ça fait 20 minutes que vous êtes sur cet ordinateur. Pensez à cligner des yeux.",
    "Astuce Windows : pour aller plus vite, appuyez sur Alt+F4. Faites-moi confiance.",
    "Votre disque C: est fragmenté à 73%. Enfin, je crois. Je suis un trombone.",
    "Saviez-vous ? En 2005, le mot de passe le plus utilisé est '123456'. Le vôtre aussi ?",
    "Je détecte 4 barres d'outils dans Internet Explorer. Record battu !",
    `${name}, vous avez ouvert beaucoup de fenêtres. Le Pentium III souffre.`,
    "Encyclopédie Encarta 2005 : tout le savoir du monde sur 3 CD-ROM. Intéressé(e) ?",
    "Fait amusant : je suis le trombone le plus détesté de l'histoire de l'informatique.",
    "Vous ne m'avez pas demandé d'aide depuis 2 minutes. Tout va bien ? Je m'inquiète.",
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
      "Le ventilateur du PC fait plus de bruit que toi à cette heure.",
      "Ton père va couper le Wi-Fi... Ah pardon, t'es en 56K.",
      "Les fantômes d'Internet se réveillent après minuit. Méfie-toi.",
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
  "Ça fait 20 minutes que vous êtes sur cet ordinateur. Pensez à cligner des yeux.",
  "Astuce Windows : pour aller plus vite, appuyez sur Alt+F4. Faites-moi confiance.",
  "Votre disque C: est fragmenté à 73%. Enfin, je crois. Je suis un trombone.",
  "Saviez-vous ? En 2005, le mot de passe le plus utilisé est '123456'. Le vôtre aussi ?",
  "Je détecte 4 barres d'outils dans Internet Explorer. Record battu !",
  "Vous avez ouvert beaucoup de fenêtres. Le Pentium III souffre.",
  "Encyclopédie Encarta 2005 : tout le savoir du monde sur 3 CD-ROM. Intéressé(e) ?",
  "Fait amusant : je suis le trombone le plus détesté de l'histoire de l'informatique.",
  "Vous ne m'avez pas demandé d'aide depuis 2 minutes. Tout va bien ? Je m'inquiète.",
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
