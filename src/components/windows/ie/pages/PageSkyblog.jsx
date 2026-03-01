export default function PageSkyblog({ url, navigateTo }) {
  const pseudo = url.replace(/\.skyblog\.com$/, "");

  return (
    <div style={{
      minHeight: "100%",
      background: "linear-gradient(180deg, #0a0014 0%, #1a0033 40%, #0a0014 100%)",
      fontFamily: "'Comic Sans MS', cursive",
      color: "#ddd",
      padding: "40px 24px",
      textAlign: "center",
    }}>
      {/* Header Skyblog */}
      <div style={{
        background: "rgba(0,0,0,0.5)",
        border: "1px solid rgba(150,0,255,0.3)",
        borderRadius: 8,
        padding: "24px 20px",
        maxWidth: 500,
        margin: "0 auto 24px",
        boxShadow: "0 4px 20px rgba(100,0,200,0.2)",
      }}>
        <div style={{ fontSize: 11, color: "#888", marginBottom: 8 }}>
          http://{url}
        </div>

        <h1 style={{
          fontSize: 22,
          margin: "0 0 6px",
          background: "linear-gradient(90deg, #F0F, #0FF, #FF0, #F0F)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundSize: "200% 100%",
          animation: "gradient 3s linear infinite",
          wordBreak: "break-all",
        }}>
          {pseudo}
        </h1>

        <div style={{ fontSize: 11, color: "#666" }}>
          SkYbLoG oFfIcIeL
        </div>
      </div>

      {/* Message principal */}
      <div style={{
        background: "rgba(0,0,0,0.4)",
        border: "1px solid rgba(150,0,255,0.25)",
        borderRadius: 6,
        padding: "28px 20px",
        maxWidth: 500,
        margin: "0 auto 20px",
      }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🚧</div>
        <div style={{
          fontSize: 15,
          color: "#F0F",
          fontWeight: "bold",
          marginBottom: 10,
        }}>
          Ce Skyblog n'est plus disponible
        </div>
        <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.6 }}>
          Ce blog a été supprimé par son auteur ou n'est plus
          accessible suite à la fermeture de Skyblog.
        </div>
      </div>

      {/* Dernière activité */}
      <div style={{
        background: "rgba(0,0,0,0.3)",
        border: "1px solid rgba(150,0,255,0.15)",
        borderRadius: 6,
        padding: "16px 20px",
        maxWidth: 500,
        margin: "0 auto 24px",
        fontSize: 11,
        color: "#888",
      }}>
        <div style={{ marginBottom: 6 }}>
          📅 Dernière activité connue : <span style={{ color: "#0CF" }}>2005</span>
        </div>
        <div>
          👥 Commentaires : <span style={{ color: "#0CF" }}>désactivés</span>
        </div>
        <div style={{ marginTop: 6 }}>
          🎵 Musique du profil : <span style={{ color: "#0CF" }}>Crazy Frog — Axel F</span>
        </div>
      </div>

      {/* Liens retour */}
      <div style={{
        display: "flex",
        gap: 12,
        justifyContent: "center",
        flexWrap: "wrap",
      }}>
        {[
          { label: "Retour Wanadoo", url: "wanadoo.fr" },
          { label: "Rechercher sur Google", url: "google.fr" },
        ].map((link) => (
          <button
            key={link.url}
            onClick={() => navigateTo(link.url)}
            style={{
              fontFamily: "'Comic Sans MS', cursive",
              fontSize: 11,
              background: "rgba(200,0,255,0.2)",
              color: "#0CF",
              border: "1px solid rgba(150,0,255,0.4)",
              borderRadius: 4,
              padding: "6px 14px",
              cursor: "pointer",
            }}
          >
            {link.label}
          </button>
        ))}
      </div>
    </div>
  );
}
