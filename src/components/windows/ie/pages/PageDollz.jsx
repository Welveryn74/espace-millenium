import IELink from "../IELink";
import { DOLLZ_GALLERY } from "../../../../data/webPages";

export default function PageDollz({ navigateTo }) {
  return (
    <div style={{
      fontFamily: "'Comic Sans MS', cursive", fontSize: 12,
      background: "linear-gradient(180deg, #FFB6C1 0%, #DDA0DD 50%, #FFB6C1 100%)",
      minHeight: "100%", padding: 20, textAlign: "center",
    }}>
      <div style={{ fontSize: 24, fontWeight: "bold", color: "#FF1493", marginBottom: 4 }}>
        ✨ Dollz.fr ✨
      </div>
      <div style={{ fontSize: 11, color: "#8B008B", marginBottom: 16 }}>
        Crée ta dollz, habille-la et partage-la avec tes copines !
      </div>

      {/* Galerie */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12,
        maxWidth: 400, margin: "0 auto 20px",
      }}>
        {DOLLZ_GALLERY.map((d, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.7)", borderRadius: 8,
            padding: 12, border: "2px solid #FF69B4",
            boxShadow: "0 2px 8px rgba(255,105,180,0.3)",
          }}>
            <div style={{ fontSize: 36, marginBottom: 6 }}>{d.emoji}</div>
            <div style={{ fontWeight: "bold", fontSize: 11, color: "#FF1493" }}>{d.name}</div>
            <div style={{ fontSize: 10, color: "#8B008B" }}>Style : {d.style}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 13, color: "#FF1493", fontWeight: "bold", marginBottom: 6 }}>
        💖 Adopte un mini-chat ! 🐱
      </div>
      <div style={{ fontSize: 11, color: "#8B008B", marginBottom: 16 }}>
        Choisis ton compagnon virtuel et prends-en soin tous les jours !
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
        <IELink url="wanadoo.fr" navigateTo={navigateTo} style={{ color: "#8B008B", fontSize: 11 }}>🏠 Wanadoo</IELink>
        <IELink url="perso.wanadoo.fr/~darkangel" navigateTo={navigateTo} style={{ color: "#8B008B", fontSize: 11 }}>🌙 Page perso</IELink>
        <IELink url="google.fr" navigateTo={navigateTo} style={{ color: "#8B008B", fontSize: 11 }}>🔍 Google</IELink>
        <IELink url="kazaa.com" navigateTo={navigateTo} style={{ color: "#8B008B", fontSize: 11 }}>💾 Télécharger des dollz</IELink>
        <IELink url="forum.jeuxvideo.com" navigateTo={navigateTo} style={{ color: "#8B008B", fontSize: 11 }}>🎮 Forum JVC</IELink>
      </div>
    </div>
  );
}
