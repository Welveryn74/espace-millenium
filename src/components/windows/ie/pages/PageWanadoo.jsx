import IELink from "../IELink";
import { ieBtnStyle } from "../../../../styles/windowStyles";
import { WANADOO_NEWS, WANADOO_HOROSCOPE } from "../../../../data/webPages";

export default function PageWanadoo({ navigateTo }) {
  return (
    <div style={{ fontFamily: "Tahoma, sans-serif", fontSize: 12, color: "#333" }}>
      {/* Bandeau orange */}
      <div style={{
        background: "linear-gradient(180deg, #FF8C00 0%, #FF6600 100%)",
        padding: "12px 16px", color: "#fff",
      }}>
        <div style={{ fontSize: 22, fontWeight: "bold", letterSpacing: 1 }}>🌐 Wanadoo</div>
        <div style={{ fontSize: 10, opacity: 0.9 }}>Votre portail Internet — Bienvenue !</div>
      </div>

      {/* Barre de recherche Voila */}
      <div style={{ background: "#FFF3E0", padding: "8px 16px", borderBottom: "1px solid #ddd", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 11, fontWeight: "bold", color: "#E65100" }}>Voila.fr</span>
        <input
          type="text" placeholder="Rechercher sur le Web..."
          style={{ flex: 1, padding: "3px 8px", border: "1px solid #ccc", borderRadius: 2, fontSize: 11 }}
          readOnly
        />
        <button style={{ ...ieBtnStyle, background: "#FF8C00", color: "#fff", border: "1px solid #E65100" }}>OK</button>
      </div>

      <div style={{ display: "flex", gap: 12, padding: 16 }}>
        {/* Colonne gauche — Actus */}
        <div style={{ flex: 2 }}>
          <div style={{ fontWeight: "bold", fontSize: 14, color: "#E65100", marginBottom: 8, borderBottom: "2px solid #FF8C00", paddingBottom: 4 }}>
            Actualités
          </div>
          {WANADOO_NEWS.map((n, i) => (
            <div key={i} style={{ marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid #eee" }}>
              <div style={{ fontWeight: "bold", fontSize: 12, color: "#1a0dab" }}>{n.title}</div>
              <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{n.desc}</div>
            </div>
          ))}

          {/* Horoscope */}
          <div style={{ fontWeight: "bold", fontSize: 14, color: "#E65100", margin: "14px 0 8px", borderBottom: "2px solid #FF8C00", paddingBottom: 4 }}>
            Horoscope du jour
          </div>
          {WANADOO_HOROSCOPE.map((h, i) => (
            <div key={i} style={{ marginBottom: 6, fontSize: 11 }}>
              <strong>♈ {h.signe} :</strong> {h.texte}
            </div>
          ))}
        </div>

        {/* Colonne droite — Liens & Météo */}
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ background: "#FFF8E1", border: "1px solid #FFE082", borderRadius: 4, padding: 10, marginBottom: 12 }}>
            <div style={{ fontWeight: "bold", fontSize: 12, color: "#E65100", marginBottom: 6 }}>☀️ Météo</div>
            <div style={{ fontSize: 11 }}>Paris : 12°C, nuageux.</div>
            <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>Comme d'habitude.</div>
          </div>

          <div style={{ background: "#f5f5f5", border: "1px solid #ddd", borderRadius: 4, padding: 10 }}>
            <div style={{ fontWeight: "bold", fontSize: 12, color: "#E65100", marginBottom: 6 }}>Liens utiles</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <IELink url="google.fr" navigateTo={navigateTo}>🔍 Google</IELink>
              <IELink url="encarta.msn.com" navigateTo={navigateTo}>📚 Encarta</IELink>
              <IELink url="forum.jeuxvideo.com" navigateTo={navigateTo}>🎮 JeuxVideo.com</IELink>
              <IELink url="kazaa.com" navigateTo={navigateTo}>💾 Kazaa</IELink>
              <IELink url="perso.wanadoo.fr/~darkangel" navigateTo={navigateTo}>🌙 Ma page perso</IELink>
              <IELink url="dollz.fr" navigateTo={navigateTo}>👧 Dollz.fr</IELink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
