import { useState } from "react";
import NostalImg from "../../NostalImg";
import { playClick } from "../../../utils/uiSounds";

function parseSkyblogLinks(text, onOpenUrl) {
  if (!onOpenUrl || !text) return text;
  const parts = text.split(/([\w-]+\.skyblog\.com)/g);
  return parts.map((part, i) => {
    if (/^[\w-]+\.skyblog\.com$/.test(part)) {
      return (
        <span
          key={i}
          onClick={(e) => { e.stopPropagation(); onOpenUrl(part); }}
          style={{ color: "#0CF", textDecoration: "underline", cursor: "pointer" }}
        >
          {part}
        </span>
      );
    }
    return part;
  });
}

export default function SkyblogPost({
  post, index, theme, likeCount, postComments,
  onLike, onComment, onOpenUrl, username,
}) {
  const [commentText, setCommentText] = useState("");
  const [showCommentForm, setShowCommentForm] = useState(false);
  const accent = theme.accent;

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    playClick();
    onComment(index, { pseudo: username, text: commentText.trim(), date: new Date().toLocaleDateString("fr-FR") });
    setCommentText("");
    setShowCommentForm(false);
  };

  return (
    <div style={{
      background: "rgba(0,0,0,0.5)", border: `1px solid ${accent}30`,
      borderRadius: 6, padding: 14, marginBottom: 12,
      boxShadow: `0 2px 8px ${accent}08`,
      animation: "slideUp 0.3s ease-out",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'Comic Sans MS', cursive", fontSize: 15,
            color: accent, fontWeight: "bold",
          }}>
            {post.title}
          </div>
          <div style={{ color: "#888", fontSize: 9, marginTop: 2 }}>
            Posté le {post.date} à 18h42
          </div>
        </div>
        <NostalImg src={post.img} fallback={post.emoji} size={80} style={{ borderRadius: 6, flexShrink: 0 }} />
      </div>

      <div style={{
        color: theme.text, fontSize: 11, lineHeight: 1.7,
        fontFamily: "'Comic Sans MS', cursive", marginBottom: 10,
        whiteSpace: "pre-line",
      }}>
        {parseSkyblogLinks(post.content, onOpenUrl)}
      </div>

      {/* Like & comment bar */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderTop: `1px solid ${accent}20`, paddingTop: 8,
      }}>
        <span
          onClick={() => setShowCommentForm(!showCommentForm)}
          style={{ color: "#0CF", fontSize: 10, cursor: "pointer" }}
        >
          💬 {post.comments + postComments.length} commentaires
        </span>
        <span
          onClick={() => { playClick(); onLike(index); }}
          style={{
            fontSize: 11, cursor: "pointer",
            color: likeCount > 0 ? "#F00" : "#888",
            transition: "all 0.2s",
          }}
        >
          {likeCount > 0 ? `❤️ Kiffé ! (${likeCount})` : "♡ Kiff cet article"}
        </span>
      </div>

      {/* Comments list */}
      {postComments.length > 0 && (
        <div style={{ marginTop: 8, borderTop: `1px solid ${accent}15`, paddingTop: 6 }}>
          {postComments.map((c, ci) => (
            <div key={ci} style={{
              background: `${accent}08`, borderRadius: 4, padding: "5px 8px", marginBottom: 3,
              fontSize: 10, fontFamily: "'Comic Sans MS', cursive",
            }}>
              <span style={{ color: accent, fontWeight: "bold" }}>{c.pseudo}</span>
              <span style={{ color: "#666", fontSize: 8, marginLeft: 6 }}>{c.date}</span>
              <div style={{ color: theme.text, opacity: 0.9, marginTop: 1 }}>{c.text}</div>
            </div>
          ))}
        </div>
      )}

      {/* Comment form */}
      {showCommentForm && (
        <div style={{
          marginTop: 8, padding: 8, background: `${accent}06`,
          borderRadius: 4, animation: "fadeIn 0.2s ease-out",
        }}>
          <div style={{ fontSize: 9, color: accent, marginBottom: 4, fontFamily: "'Comic Sans MS', cursive" }}>
            Pseudo : <strong>{username}</strong>
          </div>
          <textarea
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder="Lâche ton com' ici..."
            style={{
              width: "100%", height: 40, resize: "none",
              background: "rgba(0,0,0,0.4)", color: theme.text,
              border: `1px solid ${accent}30`, borderRadius: 3,
              padding: 6, fontSize: 10, fontFamily: "'Comic Sans MS', cursive",
              boxSizing: "border-box",
            }}
          />
          <button
            onClick={handleSubmitComment}
            disabled={!commentText.trim()}
            style={{
              marginTop: 4, padding: "3px 12px",
              background: commentText.trim() ? `${accent}30` : "rgba(100,100,100,0.2)",
              color: commentText.trim() ? accent : "#666",
              border: `1px solid ${accent}40`, borderRadius: 3,
              cursor: commentText.trim() ? "pointer" : "default",
              fontSize: 10, fontFamily: "'Comic Sans MS', cursive", fontWeight: "bold",
            }}
          >
            Lâcher un com'
          </button>
        </div>
      )}
    </div>
  );
}
