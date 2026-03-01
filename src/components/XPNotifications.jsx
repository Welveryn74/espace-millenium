import { useState, useEffect, useRef } from "react";
import { playClick } from "../utils/uiSounds";

const NOTIFICATIONS = [
  { icon: "🛡️", text: "Windows a bloqué un pop-up sur wanadoo.fr" },
  { icon: "🔄", text: "Des mises à jour sont disponibles pour votre ordinateur" },
  { icon: "⚠️", text: "Votre PC n'est peut-être pas protégé — cliquez ici" },
  { icon: "🦠", text: "Norton AntiVirus — Analyse planifiée terminée. 0 virus trouvé." },
  { icon: "🔌", text: "Nouveau matériel détecté — Périphérique USB" },
  { icon: "💾", text: "Espace disque faible sur C: (247 Mo restants)" },
  { icon: "📧", text: "Vous avez 3 messages non lus sur Caramail" },
  { icon: "🔔", text: "Windows Messenger — ~*~xX_DaRk_AnGeL_Xx~*~ est en ligne" },
  { icon: "🖨️", text: "Imprimante HP DeskJet — Niveau d'encre bas" },
  { icon: "📡", text: "Connexion Wanadoo 56K — Débit : 4.8 Ko/s" },
];

export default function XPNotifications({ muted }) {
  const [notif, setNotif] = useState(null);
  const [fading, setFading] = useState(false);
  const timeoutRef = useRef(null);
  const dismissRef = useRef(null);
  const usedRef = useRef([]);

  const pickNotif = () => {
    if (usedRef.current.length >= NOTIFICATIONS.length) usedRef.current = [];
    const available = NOTIFICATIONS.filter((_, i) => !usedRef.current.includes(i));
    const idx = NOTIFICATIONS.indexOf(available[Math.floor(Math.random() * available.length)]);
    usedRef.current.push(idx);
    return NOTIFICATIONS[idx];
  };

  const showNotif = () => {
    const n = pickNotif();
    setNotif(n);
    setFading(false);
    // Auto-dismiss after 6s
    dismissRef.current = setTimeout(() => {
      setFading(true);
      setTimeout(() => setNotif(null), 400);
    }, 6000);
  };

  const dismiss = () => {
    if (!muted) playClick();
    if (dismissRef.current) clearTimeout(dismissRef.current);
    setFading(true);
    setTimeout(() => setNotif(null), 200);
  };

  useEffect(() => {
    // First notification after 30s, then 60-120s
    const schedule = (delay) => {
      timeoutRef.current = setTimeout(() => {
        showNotif();
        schedule(60000 + Math.random() * 60000);
      }, delay);
    };
    schedule(30000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (dismissRef.current) clearTimeout(dismissRef.current);
    };
  }, []);

  if (!notif) return null;

  return (
    <div
      onClick={dismiss}
      style={{
        position: "fixed",
        bottom: 42,
        right: 8,
        zIndex: 9990,
        background: "#FFFFCC",
        border: "1px solid #CCC",
        borderRadius: 4,
        padding: "8px 12px",
        maxWidth: 280,
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        boxShadow: "2px 2px 8px rgba(0,0,0,0.15)",
        fontFamily: "'Tahoma', sans-serif",
        fontSize: 11,
        color: "#333",
        cursor: "pointer",
        animation: fading ? "fadeOut 0.4s ease-out forwards" : "slideInRight 0.3s ease-out",
        lineHeight: 1.4,
      }}
    >
      <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{notif.icon}</span>
      <div>
        <div style={{ fontWeight: "bold", fontSize: 10, color: "#666", marginBottom: 2 }}>
          Système Windows
        </div>
        {notif.text}
      </div>
      <style>{`
        @keyframes fadeOut {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(20px); }
        }
      `}</style>
    </div>
  );
}
