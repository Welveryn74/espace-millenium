import { useState } from "react";
import IELink from "../IELink";
import { PERSO_GUESTBOOK } from "../../../../data/webPages";

function parseSkyblogLinks(text, navigateTo) {
  if (!text) return text;
  const parts = text.split(/([\w-]+\.skyblog\.com)/g);
  return parts.map((part, i) => {
    if (/^[\w-]+\.skyblog\.com$/.test(part)) {
      return (
        <span
          key={i}
          onClick={() => navigateTo(part)}
          style={{ color: "#0FF", textDecoration: "underline", cursor: "pointer" }}
        >
          {part}
        </span>
      );
    }
    return part;
  });
}

export default function PagePerso({ navigateTo }) {
  const [visitors] = useState(() => Math.floor(Math.random() * 30) + 47);

  return (
    <div style={{
      fontFamily: "'Comic Sans MS', cursive",
      background: "radial-gradient(ellipse at center, #111 0%, #000 70%)",
      backgroundImage: "radial-gradient(white 1px, transparent 1px)",
      backgroundSize: "40px 40px",
      color: "#00FF00", minHeight: "100%", cursor: "crosshair", padding: 20,
    }}>
      {/* Marquee titre */}
      <div style={{ overflow: "hidden", marginBottom: 16 }}>
        <div style={{
          animation: "marquee 10s linear infinite", whiteSpace: "nowrap",
          fontSize: 20, fontWeight: "bold", color: "#0F0",
          textShadow: "0 0 8px #0F0",
        }}>
          ~*~ BiEnVeNuE sUr Ma PaGe PeRsO ~*~ BiEnVeNuE sUr Ma PaGe PeRsO ~*~
        </div>
      </div>

      {/* Compteur */}
      <div style={{
        textAlign: "center", padding: 10, marginBottom: 16,
        border: "1px dashed #0F0", display: "inline-block",
      }}>
        <div style={{ fontSize: 11, color: "#0F0" }}>📊 Compteur de visiteurs</div>
        <div style={{ fontSize: 24, fontFamily: "monospace", letterSpacing: 3, color: "#0F0" }}>
          {String(visitors).padStart(5, "0")}
        </div>
        <div style={{ fontSize: 10, color: "#0a0" }}>Vous êtes le {visitors}ème visiteur !</div>
      </div>

      {/* Présentation */}
      <div style={{ marginBottom: 20, lineHeight: 1.8 }}>
        <div style={{ fontSize: 16, color: "#FF0", marginBottom: 8, textDecoration: "underline" }}>Qui suis-je ?</div>
        <div style={{ fontSize: 12 }}>
          Salu moa c DarkAngel jé 13 an et jadore le rock, les manga et les jeux vidéo !!<br />
          Mon groupe préféré c Evanescence et Linkin Park tro bien !! 🎸<br />
          Mon jeu préféré c Kingdom Hearts sur PS2 💖
        </div>
      </div>

      {/* Liens */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 16, color: "#FF0", marginBottom: 8, textDecoration: "underline" }}>Mes liens</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <IELink url="wanadoo.fr" navigateTo={navigateTo} style={{ color: "#0FF" }}>🏠 Wanadoo (ma page d'accueil)</IELink>
          <IELink url="google.fr" navigateTo={navigateTo} style={{ color: "#0FF" }}>🔍 Google</IELink>
          <IELink url="kazaa.com" navigateTo={navigateTo} style={{ color: "#0FF" }}>💾 Kazaa (tro bien pour la music)</IELink>
          <IELink url="forum.jeuxvideo.com" navigateTo={navigateTo} style={{ color: "#0FF" }}>🎮 Forum JeuxVideo.com</IELink>
          <IELink url="dollz.fr" navigateTo={navigateTo} style={{ color: "#0FF" }}>👧 Dollz.fr</IELink>
          <IELink url="encarta.msn.com" navigateTo={navigateTo} style={{ color: "#0FF" }}>📚 Encarta (pour les exposés)</IELink>
        </div>
      </div>

      {/* Livre d'or */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 16, color: "#FF0", marginBottom: 8, textDecoration: "underline" }}>📖 Livre d'or</div>
        {PERSO_GUESTBOOK.map((msg, i) => (
          <div key={i} style={{
            background: "rgba(0,255,0,0.05)", border: "1px solid #0a0",
            padding: 8, marginBottom: 6, borderRadius: 4,
          }}>
            <div style={{ fontSize: 11, color: "#0FF" }}>
              <strong>{msg.pseudo}</strong> — {msg.date}
            </div>
            <div style={{ fontSize: 11, color: "#0F0", marginTop: 4 }}>
              {parseSkyblogLinks(msg.message, navigateTo)}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", fontSize: 12, padding: "16px 0", borderTop: "1px dashed #0a0" }}>
        🚧 Page en construction 🚧<br />
        <span style={{ fontSize: 10, color: "#0a0" }}>Dernière mise à jour : 15/03/2005 — Optimisé pour Internet Explorer 6</span>
      </div>
    </div>
  );
}
