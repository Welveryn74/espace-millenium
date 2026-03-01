import IELink from "../IELink";
import { ENCARTA_ARTICLES } from "../../../../data/webPages";

const ARTICLE_LINKS = {
  volcan: [
    { label: "📖 Wikipedia", url: "wikipedia.org" },
    { label: "🔍 Rechercher sur Google", url: "google.fr" },
  ],
  internet: [
    { label: "📖 Wikipedia", url: "wikipedia.org" },
    { label: "💾 Download.com", url: "download.com" },
  ],
  dinosaure: [
    { label: "📖 Wikipedia", url: "wikipedia.org" },
  ],
  lune: [
    { label: "🚀 NASA", url: "nasa.gov" },
    { label: "📖 Wikipedia", url: "wikipedia.org" },
  ],
};

export default function PageEncarta({ navigateTo, selectedArticle, setSelectedArticle }) {
  const article = ENCARTA_ARTICLES.find(a => a.id === selectedArticle) || null;
  const links = article ? ARTICLE_LINKS[article.id] || [] : [];

  return (
    <div style={{ display: "flex", minHeight: "100%", fontFamily: "Tahoma, sans-serif", fontSize: 12 }}>
      {/* Sidebar */}
      <div style={{
        width: 160, background: "linear-gradient(180deg, #003399 0%, #0055CC 100%)",
        padding: "12px 0", flexShrink: 0,
      }}>
        <div style={{ color: "#fff", fontWeight: "bold", fontSize: 14, padding: "0 12px 10px", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
          📚 Encarta
        </div>
        <div style={{ padding: "8px 0" }}>
          {ENCARTA_ARTICLES.map(a => (
            <div
              key={a.id}
              onClick={() => setSelectedArticle(a.id)}
              style={{
                padding: "6px 12px", cursor: "pointer", fontSize: 11,
                color: selectedArticle === a.id ? "#FFD700" : "#fff",
                background: selectedArticle === a.id ? "rgba(255,255,255,0.15)" : "transparent",
              }}
            >
              {a.title}
            </div>
          ))}
        </div>
        <div style={{ padding: "10px 12px", borderTop: "1px solid rgba(255,255,255,0.2)", marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
          <IELink url="wanadoo.fr" navigateTo={navigateTo} style={{ color: "#AED6FF", fontSize: 10 }}>← Retour Wanadoo</IELink>
          <IELink url="wikipedia.org" navigateTo={navigateTo} style={{ color: "#AED6FF", fontSize: 10 }}>📖 Wikipedia</IELink>
          <IELink url="google.fr" navigateTo={navigateTo} style={{ color: "#AED6FF", fontSize: 10 }}>🔍 Rechercher sur Google</IELink>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ flex: 1, padding: 20, background: "#fff" }}>
        {article ? (
          <>
            <div style={{ fontSize: 10, color: "#666", marginBottom: 4 }}>{article.category}</div>
            <h2 style={{ fontSize: 20, color: "#003399", margin: "0 0 12px", fontWeight: "bold" }}>{article.title}</h2>
            <div style={{ lineHeight: 1.8, whiteSpace: "pre-line", color: "#333" }}>{article.content}</div>
            {links.length > 0 && (
              <div style={{
                marginTop: 16, paddingTop: 12, borderTop: "1px solid #ddd",
              }}>
                <div style={{ fontSize: 11, fontWeight: "bold", color: "#003399", marginBottom: 6 }}>Voir aussi :</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {links.map((l, i) => (
                    <IELink key={i} url={l.url} navigateTo={navigateTo} style={{ fontSize: 11 }}>{l.label}</IELink>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div>
            <h2 style={{ fontSize: 20, color: "#003399", marginBottom: 12 }}>Bienvenue sur Encarta</h2>
            <p style={{ color: "#555", lineHeight: 1.7 }}>
              L'encyclopédie multimédia de référence. Sélectionnez un article dans le menu de gauche pour commencer votre recherche.
            </p>
            <p style={{ color: "#888", fontSize: 11, marginTop: 16 }}>
              Astuce : Encarta est aussi disponible sur CD-ROM (12 disques) au prix de 49,99€.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
