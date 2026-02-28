import { useState, useRef, useEffect } from "react";
import Win from "../Win";
import { ieBtnStyle } from "../../styles/windowStyles";
import {
  IE_FAVORITES, WANADOO_NEWS, WANADOO_HOROSCOPE,
  ENCARTA_ARTICLES, JVC_POSTS, KAZAA_DOWNLOADS,
  PERSO_GUESTBOOK, GOOGLE_DEFAULT_RESULTS, GOOGLE_SEARCH_RESULTS,
  DOLLZ_GALLERY,
} from "../../data/webPages";

// ─── URL → page mapper ──────────────────────────────────
const KNOWN_URLS = [
  "wanadoo.fr", "google.fr", "perso.wanadoo.fr/~darkangel",
  "encarta.msn.com", "forum.jeuxvideo.com", "kazaa.com", "dollz.fr",
];

function resolveUrl(raw) {
  const u = raw.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/+$/, "");
  return KNOWN_URLS.includes(u) ? u : null;
}

// ─── Link component ─────────────────────────────────────
function IELink({ url, children, navigateTo, style }) {
  return (
    <span
      onClick={() => navigateTo(url)}
      style={{ color: "#0000EE", textDecoration: "underline", cursor: "pointer", ...style }}
    >
      {children}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════
//  PAGE : WANADOO (portail d'accueil)
// ═══════════════════════════════════════════════════════════
function PageWanadoo({ navigateTo }) {
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

// ═══════════════════════════════════════════════════════════
//  PAGE : GOOGLE
// ═══════════════════════════════════════════════════════════
function PageGoogle({ navigateTo, searchQuery, setSearchQuery }) {
  const [results, setResults] = useState(null);
  const inputRef = useRef(null);

  const doSearch = () => {
    const q = (inputRef.current?.value || "").trim().toLowerCase();
    setSearchQuery(q);
    if (!q) {
      setResults(null);
      return;
    }
    const key = Object.keys(GOOGLE_SEARCH_RESULTS).find(k => q.includes(k));
    setResults(GOOGLE_SEARCH_RESULTS[key] || GOOGLE_SEARCH_RESULTS._default);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100%", background: "#fff" }}>
      <div style={{ textAlign: "center", paddingTop: results ? 20 : 120, transition: "padding 0.3s" }}>
        {/* Logo Google en texte coloré */}
        <div style={{ fontSize: results ? 28 : 52, fontWeight: "bold", marginBottom: results ? 10 : 20, letterSpacing: -1 }}>
          <span style={{ color: "#4285F4" }}>G</span>
          <span style={{ color: "#EA4335" }}>o</span>
          <span style={{ color: "#FBBC05" }}>o</span>
          <span style={{ color: "#4285F4" }}>g</span>
          <span style={{ color: "#34A853" }}>l</span>
          <span style={{ color: "#EA4335" }}>e</span>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 12 }}>
          <input
            ref={inputRef}
            type="text"
            defaultValue={searchQuery}
            onKeyDown={e => e.key === "Enter" && doSearch()}
            style={{
              width: results ? 340 : 380, padding: "6px 12px",
              border: "1px solid #bbb", borderRadius: 20, fontSize: 13,
              outline: "none",
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
          <button onClick={doSearch} style={{ ...ieBtnStyle, padding: "4px 14px", fontSize: 11 }}>Recherche Google</button>
          <button style={{ ...ieBtnStyle, padding: "4px 14px", fontSize: 11 }}>J'ai de la chance</button>
        </div>
      </div>

      {/* Résultats */}
      {results ? (
        <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ fontSize: 11, color: "#666", marginBottom: 12 }}>
            Environ 1 340 000 résultats (0,28 s)
          </div>
          {results.map((r, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              {r.url ? (
                <IELink url={r.url} navigateTo={navigateTo} style={{ fontSize: 14, fontWeight: "bold" }}>
                  {r.title}
                </IELink>
              ) : (
                <div style={{ fontSize: 14, fontWeight: "bold", color: "#1a0dab" }}>{r.title}</div>
              )}
              {r.url && <div style={{ fontSize: 11, color: "#006621" }}>http://{r.url}</div>}
              <div style={{ fontSize: 12, color: "#545454", marginTop: 2 }}>{r.desc}</div>
            </div>
          ))}
        </div>
      ) : (
        /* Liens par défaut */
        <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 20px" }}>
          {GOOGLE_DEFAULT_RESULTS.map((r, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <IELink url={r.url} navigateTo={navigateTo} style={{ fontSize: 13, fontWeight: "bold" }}>
                {r.title}
              </IELink>
              <div style={{ fontSize: 11, color: "#006621" }}>http://{r.url}</div>
              <div style={{ fontSize: 12, color: "#545454", marginTop: 2 }}>{r.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  PAGE : PERSO (page sous construction)
// ═══════════════════════════════════════════════════════════
function PagePerso({ navigateTo }) {
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
            <div style={{ fontSize: 11, color: "#0F0", marginTop: 4 }}>{msg.message}</div>
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

// ═══════════════════════════════════════════════════════════
//  PAGE : ENCARTA
// ═══════════════════════════════════════════════════════════
function PageEncarta({ navigateTo, selectedArticle, setSelectedArticle }) {
  const article = ENCARTA_ARTICLES.find(a => a.id === selectedArticle) || null;

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
        <div style={{ padding: "10px 12px", borderTop: "1px solid rgba(255,255,255,0.2)", marginTop: 8 }}>
          <IELink url="wanadoo.fr" navigateTo={navigateTo} style={{ color: "#AED6FF", fontSize: 10 }}>← Retour Wanadoo</IELink>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ flex: 1, padding: 20, background: "#fff" }}>
        {article ? (
          <>
            <div style={{ fontSize: 10, color: "#666", marginBottom: 4 }}>{article.category}</div>
            <h2 style={{ fontSize: 20, color: "#003399", margin: "0 0 12px", fontWeight: "bold" }}>{article.title}</h2>
            <div style={{ lineHeight: 1.8, whiteSpace: "pre-line", color: "#333" }}>{article.content}</div>
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

// ═══════════════════════════════════════════════════════════
//  PAGE : FORUM JVC
// ═══════════════════════════════════════════════════════════
function PageJVC({ navigateTo }) {
  return (
    <div style={{ fontFamily: "Verdana, sans-serif", fontSize: 11, background: "#fff", minHeight: "100%" }}>
      {/* Header JVC */}
      <div style={{
        background: "linear-gradient(180deg, #CC0000 0%, #990000 100%)",
        padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ color: "#FFD700", fontWeight: "bold", fontSize: 16 }}>
          JeuxVideo.com
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <IELink url="wanadoo.fr" navigateTo={navigateTo} style={{ color: "#FFF", fontSize: 10, textDecoration: "none" }}>Accueil</IELink>
          <IELink url="google.fr" navigateTo={navigateTo} style={{ color: "#FFF", fontSize: 10, textDecoration: "none" }}>Recherche</IELink>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ background: "#FFE082", padding: "4px 16px", fontSize: 10, color: "#333" }}>
        Forum &gt; Consoles &gt; Débats &gt; <strong>VOUS PREFEREZ QUOI : PS2 ou XBOX ou GAMECUBE ???</strong>
      </div>

      {/* Topic */}
      <div style={{ padding: 16 }}>
        <h3 style={{ fontSize: 14, color: "#CC0000", marginBottom: 12 }}>
          VOUS PREFEREZ QUOI : PS2 ou XBOX ou GAMECUBE ???
        </h3>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {JVC_POSTS.map((post, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #ddd", background: i % 2 === 0 ? "#f9f9f9" : "#fff" }}>
                <td style={{
                  width: 110, padding: 10, verticalAlign: "top",
                  borderRight: "1px solid #ddd", textAlign: "center",
                }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{post.icon}</div>
                  <div style={{
                    fontWeight: "bold", fontSize: 10,
                    color: post.pseudo === "Moderateur" ? "#CC0000" : "#333",
                  }}>
                    {post.pseudo}
                  </div>
                </td>
                <td style={{ padding: 10, verticalAlign: "top" }}>
                  <div style={{ fontSize: 9, color: "#888", marginBottom: 4 }}>Posté le {post.date}</div>
                  <div style={{ lineHeight: 1.6 }}>{post.content}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 12, textAlign: "center", fontSize: 10, color: "#888" }}>
          Page 1 sur 47 — <span style={{ color: "#CC0000" }}>Répondre à ce sujet</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  PAGE : KAZAA
// ═══════════════════════════════════════════════════════════
function PageKazaa() {
  return (
    <div style={{
      fontFamily: "Tahoma, sans-serif", fontSize: 12,
      background: "linear-gradient(180deg, #001133 0%, #002266 50%, #001133 100%)",
      color: "#fff", minHeight: "100%", padding: 20,
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 28, fontWeight: "bold", color: "#00BFFF", letterSpacing: 2 }}>
          ♪ KaZaA ♪
        </div>
        <div style={{ fontSize: 10, color: "#77AADD" }}>Peer-to-Peer File Sharing — v3.2.7</div>
      </div>

      {/* Connection info */}
      <div style={{
        background: "rgba(0,100,200,0.15)", border: "1px solid #0066AA",
        borderRadius: 4, padding: 8, marginBottom: 16, fontSize: 11, textAlign: "center",
      }}>
        🔌 Votre connexion : <strong>4.8 Ko/s</strong> (Wanadoo 56K) — Utilisateurs connectés : 3 247 891
      </div>

      {/* Downloads */}
      <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 4, overflow: "hidden" }}>
        {/* Table header */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 70px 120px 60px",
          padding: "6px 10px", background: "rgba(0,100,200,0.3)", fontSize: 10,
          fontWeight: "bold", color: "#88CCFF",
        }}>
          <span>Fichier</span><span>Taille</span><span>Progression</span><span>État</span>
        </div>

        {KAZAA_DOWNLOADS.map((dl, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "1fr 70px 120px 60px",
            padding: "8px 10px", borderBottom: "1px solid rgba(255,255,255,0.05)",
            alignItems: "center",
          }}>
            <span style={{
              fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              color: dl.status === "danger" ? "#FF4444" : "#fff",
            }}>
              {dl.status === "danger" ? "⚠️ " : "📄 "}{dl.name}
            </span>
            <span style={{ fontSize: 10, color: "#aaa" }}>{dl.size}</span>
            <div>
              <div style={{
                height: 10, background: "rgba(255,255,255,0.1)",
                borderRadius: 5, overflow: "hidden", marginBottom: 2,
              }}>
                <div style={{
                  height: "100%", borderRadius: 5,
                  width: `${dl.progress}%`,
                  background: dl.status === "danger" ? "#FF4444"
                    : dl.progress >= 90 ? "#00CC00"
                    : "linear-gradient(90deg, #0066FF, #00AAFF)",
                }} />
              </div>
              <div style={{ fontSize: 9, color: "#888" }}>
                {dl.progress}%{dl.eta ? ` — ${dl.eta}` : ""}
              </div>
            </div>
            <span style={{ fontSize: 12, textAlign: "center" }}>
              {dl.status === "ok" && dl.progress >= 97 ? "✅" : dl.status === "danger" ? "⚠️" : "⏳"}
            </span>
          </div>
        ))}
      </div>

      {/* Warning */}
      <div style={{
        marginTop: 16, padding: 8, background: "rgba(255,68,68,0.1)",
        border: "1px solid rgba(255,68,68,0.3)", borderRadius: 4,
        fontSize: 10, color: "#FF8888", textAlign: "center",
      }}>
        ⚠️ Attention : "photo_vacances_2004.jpg.exe" — Fichier suspect détecté. Téléchargement non recommandé.
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  PAGE : DOLLZ
// ═══════════════════════════════════════════════════════════
function PageDollz({ navigateTo }) {
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
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  PAGE : 404
// ═══════════════════════════════════════════════════════════
function Page404({ url }) {
  return (
    <div style={{
      fontFamily: "Tahoma, sans-serif", fontSize: 12, padding: 40,
      background: "#fff", minHeight: "100%",
    }}>
      <div style={{ maxWidth: 450, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
          <span style={{ fontSize: 40 }}>⚠️</span>
          <div>
            <h2 style={{ fontSize: 16, color: "#333", margin: "0 0 8px" }}>
              Impossible d'afficher la page
            </h2>
            <p style={{ color: "#555", lineHeight: 1.6 }}>
              La page <strong>http://{url || "..."}</strong> est introuvable. Le serveur est introuvable ou votre connexion 56K a planté.
            </p>
          </div>
        </div>

        <div style={{ background: "#F5F5F5", border: "1px solid #ddd", borderRadius: 4, padding: 16 }}>
          <div style={{ fontWeight: "bold", marginBottom: 8 }}>Essayez ceci :</div>
          <ul style={{ paddingLeft: 20, lineHeight: 1.8, color: "#555" }}>
            <li>Vérifiez que vous avez tapé la bonne adresse</li>
            <li>Demandez à votre grand frère de vérifier la connexion</li>
            <li>Vérifiez que personne n'utilise le téléphone</li>
            <li>Débranchez et rebranchez le modem</li>
          </ul>
        </div>

        <div style={{ marginTop: 16, fontSize: 10, color: "#888" }}>
          HTTP 404 — Fichier non trouvé<br />
          Internet Explorer 6.0
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  COMPOSANT PRINCIPAL : IEWindow
// ═══════════════════════════════════════════════════════════
export default function IEWindow({ onClose, onMinimize, zIndex, onFocus }) {
  const [currentUrl, setCurrentUrl] = useState("wanadoo.fr");
  const [history, setHistory] = useState(["wanadoo.fr"]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addressInput, setAddressInput] = useState("wanadoo.fr");
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [statusText, setStatusText] = useState("Terminé.");
  const contentRef = useRef(null);

  const navigateTo = (url) => {
    const clean = url.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/+$/, "");
    setLoading(true);
    setAddressInput(clean);
    setStatusText(`Ouverture de la page http://${clean}...`);
    setShowFavorites(false);
    setTimeout(() => {
      const newHistory = [...history.slice(0, historyIdx + 1), clean];
      setHistory(newHistory);
      setHistoryIdx(newHistory.length - 1);
      setCurrentUrl(clean);
      setLoading(false);
      setStatusText("Terminé.");
      if (contentRef.current) contentRef.current.scrollTop = 0;
    }, 300 + Math.random() * 500);
  };

  const goBack = () => {
    if (historyIdx > 0) {
      const idx = historyIdx - 1;
      setHistoryIdx(idx);
      const url = history[idx];
      setCurrentUrl(url);
      setAddressInput(url);
      if (contentRef.current) contentRef.current.scrollTop = 0;
    }
  };

  const goForward = () => {
    if (historyIdx < history.length - 1) {
      const idx = historyIdx + 1;
      setHistoryIdx(idx);
      const url = history[idx];
      setCurrentUrl(url);
      setAddressInput(url);
      if (contentRef.current) contentRef.current.scrollTop = 0;
    }
  };

  const handleAddressSubmit = () => {
    const clean = addressInput.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/+$/, "");
    if (clean && clean !== currentUrl) {
      navigateTo(clean);
    }
  };

  // Rendu de la page courante
  const renderPage = () => {
    if (loading) {
      return (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          height: "100%", background: "#fff", fontFamily: "Tahoma, sans-serif",
          fontSize: 12, color: "#888",
        }}>
          Chargement...
        </div>
      );
    }

    const resolved = resolveUrl(currentUrl);
    switch (resolved) {
      case "wanadoo.fr":
        return <PageWanadoo navigateTo={navigateTo} />;
      case "google.fr":
        return <PageGoogle navigateTo={navigateTo} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />;
      case "perso.wanadoo.fr/~darkangel":
        return <PagePerso navigateTo={navigateTo} />;
      case "encarta.msn.com":
        return <PageEncarta navigateTo={navigateTo} selectedArticle={selectedArticle} setSelectedArticle={setSelectedArticle} />;
      case "forum.jeuxvideo.com":
        return <PageJVC navigateTo={navigateTo} />;
      case "kazaa.com":
        return <PageKazaa />;
      case "dollz.fr":
        return <PageDollz navigateTo={navigateTo} />;
      default:
        return <Page404 url={currentUrl} />;
    }
  };

  return (
    <Win
      title={`Internet Explorer — ${currentUrl}`}
      onClose={onClose} onMinimize={onMinimize}
      width={720} height={560} zIndex={zIndex} onFocus={onFocus}
      initialPos={{ x: 60, y: 20 }} color="#0055E5"
    >
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* ── IE Toolbar ── */}
        <div style={{ background: "#ECE9D8", borderBottom: "1px solid #bbb", flexShrink: 0 }}>
          {/* Navigation buttons */}
          <div style={{ padding: "3px 8px", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid #d0d0d0" }}>
            <button style={{ ...ieBtnStyle, opacity: historyIdx <= 0 ? 0.4 : 1 }} disabled={historyIdx <= 0} onClick={goBack}>← Préc.</button>
            <button style={{ ...ieBtnStyle, opacity: historyIdx >= history.length - 1 ? 0.4 : 1 }} disabled={historyIdx >= history.length - 1} onClick={goForward}>→ Suiv.</button>
            <button style={ieBtnStyle} onClick={() => navigateTo(currentUrl)}>🔄 Actualiser</button>
            <button style={ieBtnStyle} onClick={() => navigateTo("wanadoo.fr")}>🏠 Accueil</button>
          </div>

          {/* Address bar */}
          <div style={{ padding: "3px 8px", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid #d0d0d0" }}>
            <span style={{ fontSize: 11, color: "#444" }}>Adresse</span>
            <div style={{
              flex: 1, background: "#fff", border: "1px solid #7A96DF",
              borderRadius: 2, display: "flex", alignItems: "center",
            }}>
              <span style={{ padding: "3px 4px 3px 8px", fontSize: 11, color: "#888" }}>🔒</span>
              <span style={{ fontSize: 11, color: "#888" }}>http://</span>
              <input
                type="text"
                value={addressInput}
                onChange={e => setAddressInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAddressSubmit()}
                style={{
                  flex: 1, border: "none", outline: "none", padding: "3px 4px",
                  fontSize: 11, color: "#333", fontFamily: "Tahoma, sans-serif",
                }}
              />
            </div>
            <button style={ieBtnStyle} onClick={handleAddressSubmit}>▶ OK</button>
          </div>

          {/* Favorites bar */}
          <div style={{ padding: "2px 8px", display: "flex", alignItems: "center", gap: 6, position: "relative" }}>
            <button
              style={{ ...ieBtnStyle, fontWeight: "bold" }}
              onClick={() => setShowFavorites(f => !f)}
            >
              ⭐ Favoris ▾
            </button>

            {/* Favorites dropdown */}
            {showFavorites && (
              <div style={{
                position: "absolute", top: "100%", left: 8, zIndex: 100,
                background: "#fff", border: "1px solid #aaa", borderRadius: 4,
                boxShadow: "2px 2px 8px rgba(0,0,0,0.2)", minWidth: 200, padding: "4px 0",
              }}>
                {IE_FAVORITES.map((fav, i) => (
                  <div
                    key={i}
                    onClick={() => navigateTo(fav.url)}
                    style={{
                      padding: "5px 14px", fontSize: 11, cursor: "pointer",
                      color: "#333", fontFamily: "Tahoma, sans-serif",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#316AC5"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    onMouseOver={e => e.currentTarget.style.color = "#fff"}
                    onMouseOut={e => e.currentTarget.style.color = "#333"}
                  >
                    ⭐ {fav.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Page content ── */}
        <div ref={contentRef} style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
          {renderPage()}
        </div>

        {/* ── Status bar ── */}
        <div style={{
          background: "#ECE9D8", borderTop: "1px solid #bbb",
          padding: "2px 10px", fontSize: 10, color: "#555",
          fontFamily: "Tahoma, sans-serif", flexShrink: 0,
        }}>
          {statusText}
        </div>
      </div>
    </Win>
  );
}
