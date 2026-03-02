import { useState, useEffect, useRef } from "react";
import { playNotifBalloon } from "../utils/uiSounds";

// Première notification : toujours la connexion Internet
const FIRST_NOTIF = {
  icon: "🌐",
  title: "Connexion réseau établie",
  text: "Connecté à Internet via Wanadoo.\nDébit : 49.3 Kbps  ▲ 3.2 Ko/s  ▼ 1.1 Ko/s",
};

const NOTIFICATIONS = [
  { icon: "⚠️", title: "Centre de sécurité Windows", text: "Votre ordinateur est peut-être en danger.\nLa protection antivirus est désactivée." },
  { icon: "🔄", title: "Mises à jour Windows", text: "Des mises à jour sont disponibles pour votre ordinateur.\nCliquez ici pour les installer." },
  { icon: "🛡️", title: "Windows XP", text: "Wanadoo.fr a tenté d'ouvrir une fenêtre.\nWindows a bloqué ce pop-up pour vous protéger." },
  { icon: "💾", title: "Espace disque insuffisant", text: "Espace disque faible sur le disque C:\n(247 Mo disponibles). Libérez de l'espace disque." },
  { icon: "🔌", title: "Nouveau matériel détecté", text: "Votre périphérique USB est prêt à l'emploi." },
  { icon: "🦠", title: "Norton AntiVirus", text: "Analyse planifiée terminée.\n0 virus trouvé. Votre PC est protégé. ✓" },
  { icon: "📧", title: "Caramail", text: "Vous avez 3 nouveaux messages non lus.\nCliquez ici pour les consulter." },
  { icon: "🖨️", title: "Imprimante HP DeskJet 3550", text: "Niveau d'encre faible.\nCommandez de nouvelles cartouches d'encre." },
  { icon: "🔔", title: "Windows Messenger", text: "~*~xX_DaRk_AnGeL_Xx~*~ est désormais en ligne." },
  { icon: "📡", title: "Réseau Wanadoo", text: "Connexion Wanadoo 56K active.\nDurée de connexion : 14 mn  Coût estimé : 0,07 €" },
];

export default function XPNotifications() {
  const [notif, setNotif] = useState(null);
  const [fading, setFading] = useState(false);
  const timeoutRef = useRef(null);
  const dismissRef = useRef(null);
  const usedRef = useRef([]);

  const showNotif = (n) => {
    setNotif(n);
    setFading(false);
    playNotifBalloon();
    if (dismissRef.current) clearTimeout(dismissRef.current);
    dismissRef.current = setTimeout(() => {
      setFading(true);
      setTimeout(() => setNotif(null), 350);
    }, 7000);
  };

  const pickAndShow = () => {
    if (usedRef.current.length >= NOTIFICATIONS.length) usedRef.current = [];
    const available = NOTIFICATIONS.filter((_, i) => !usedRef.current.includes(i));
    const idx = NOTIFICATIONS.indexOf(available[Math.floor(Math.random() * available.length)]);
    usedRef.current.push(idx);
    showNotif(NOTIFICATIONS[idx]);
  };

  const dismiss = () => {
    if (dismissRef.current) clearTimeout(dismissRef.current);
    setFading(true);
    setTimeout(() => setNotif(null), 250);
  };

  useEffect(() => {
    // Connexion Internet après 3 secondes
    timeoutRef.current = setTimeout(() => {
      showNotif(FIRST_NOTIF);
      // Ensuite une notif aléatoire toutes les 90-150s
      const schedule = (delay) => {
        timeoutRef.current = setTimeout(() => {
          pickAndShow();
          schedule(90000 + Math.random() * 60000);
        }, delay);
      };
      schedule(90000 + Math.random() * 60000);
    }, 3000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (dismissRef.current) clearTimeout(dismissRef.current);
    };
  }, []);

  if (!notif) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 44,
        right: 0,
        zIndex: 9990,
        width: 310,
        fontFamily: "'Tahoma', sans-serif",
        filter: "drop-shadow(2px 4px 12px rgba(0,0,0,0.45))",
        animation: fading ? "slideOutRight 0.3s ease-in forwards" : "slideInRight 0.25s ease-out",
      }}
    >
      {/* Ballon principal */}
      <div style={{
        background: "#FFFFE1",
        border: "1px solid #7A7A7A",
        borderRadius: "6px 6px 6px 0",
        overflow: "hidden",
      }}>
        {/* Barre titre bleue style XP */}
        <div style={{
          background: "linear-gradient(180deg, #2057CC 0%, #2B68DE 45%, #2057CC 100%)",
          padding: "4px 6px 4px 8px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13 }}>{notif.icon}</span>
            <span style={{ color: "#fff", fontSize: 11, fontWeight: "bold", letterSpacing: 0.2 }}>
              {notif.title}
            </span>
          </div>
          <button
            onClick={dismiss}
            style={{
              width: 17, height: 17, border: "1px solid rgba(255,255,255,0.35)",
              borderRadius: 2, background: "rgba(255,255,255,0.12)", color: "#fff",
              fontSize: 9, cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", lineHeight: 1, padding: 0, fontWeight: "bold",
            }}
          >✕</button>
        </div>

        {/* Corps de la notification */}
        <div style={{
          padding: "8px 10px 10px 10px",
          fontSize: 11, color: "#000", lineHeight: 1.55, whiteSpace: "pre-line",
        }}>
          {notif.text}
        </div>
      </div>

      {/* Triangle pointant vers la barre des tâches (en bas à gauche du ballon) */}
      <svg width="18" height="11" style={{ display: "block", marginLeft: 14 }}>
        <path d="M0,0 L18,0 L9,11 Z" fill="#7A7A7A" />
        <path d="M1,0 L17,0 L9,9 Z" fill="#FFFFE1" />
      </svg>
    </div>
  );
}
