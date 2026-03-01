import { useState } from "react";
import IELink from "../IELink";
import { getUsername } from "../../../../utils/storage";
import { JVC_POSTS } from "../../../../data/webPages";

export default function PageJVC({ navigateTo }) {
  const [userPosts, setUserPosts] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [replyPseudo, setReplyPseudo] = useState(() => getUsername() || "Joueur_du_77");

  const allPosts = [...JVC_POSTS, ...userPosts];

  const handlePost = () => {
    if (!replyText.trim() || userPosts.length >= 3) return;
    setUserPosts(prev => [...prev, {
      pseudo: replyPseudo || "Anonyme",
      icon: "🎮",
      date: "aujourd'hui",
      content: replyText,
    }]);
    setReplyText("");
  };

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
          <IELink url="gamefaqs.com" navigateTo={navigateTo} style={{ color: "#FFF", fontSize: 10, textDecoration: "none" }}>💾 GameFAQs</IELink>
          <IELink url="ign.com" navigateTo={navigateTo} style={{ color: "#FFF", fontSize: 10, textDecoration: "none" }}>📰 IGN</IELink>
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
            {allPosts.map((post, i) => (
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
          Page 1 sur 47
        </div>

        {/* Reply form */}
        {userPosts.length < 3 ? (
          <div style={{
            marginTop: 16, padding: 12, background: "#FFF8E1",
            border: "1px solid #E0D090", borderRadius: 4,
          }}>
            <div style={{ fontWeight: "bold", fontSize: 12, color: "#CC0000", marginBottom: 8 }}>
              Répondre à ce sujet
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
              <span style={{ fontSize: 10, color: "#555" }}>Pseudo :</span>
              <input
                value={replyPseudo}
                onChange={e => setReplyPseudo(e.target.value)}
                style={{
                  padding: "3px 8px", border: "1px solid #ccc", borderRadius: 2,
                  fontSize: 11, width: 150, fontFamily: "Verdana, sans-serif",
                }}
              />
            </div>
            <textarea
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Votre message..."
              style={{
                width: "100%", height: 60, padding: 8, border: "1px solid #ccc",
                borderRadius: 2, fontSize: 11, fontFamily: "Verdana, sans-serif",
                resize: "vertical", boxSizing: "border-box",
              }}
            />
            <button onClick={handlePost} style={{
              marginTop: 6, padding: "4px 16px",
              background: "linear-gradient(180deg, #CC0000 0%, #990000 100%)",
              border: "1px solid #880000", borderRadius: 3, color: "#fff",
              fontSize: 11, cursor: "pointer", fontWeight: "bold",
            }}>Poster</button>
          </div>
        ) : (
          <div style={{ marginTop: 12, fontSize: 10, color: "#888", textAlign: "center" }}>
            Vous avez atteint la limite de 3 messages. Revenez plus tard.
          </div>
        )}
      </div>
    </div>
  );
}
