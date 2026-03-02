import { useState, useEffect, useRef } from "react";

const EMOJIS = ["😍", "😂", "😢", "😤", "🎵", "💕"];

const CPU_COMMENTS = [
  "tro bi1 ton artikle!! +5 🔥",
  "mdr tro vré !! lâche la suite !!",
  "jador !! continu comme sa !! 💕",
  "ptdr jme reconnais tro 😂",
  "tro cool !! +5 +5 +5 !!",
  "jkiffe ton sky il é tro bi1 !!",
];

function toAlternatingCaps(text) {
  let upper = true;
  return text.split("").map(c => {
    if (/[a-zA-Z]/.test(c)) {
      const result = upper ? c.toUpperCase() : c.toLowerCase();
      upper = !upper;
      return result;
    }
    return c;
  }).join("");
}

export default function SkyblogEditor({ theme, onPublish, onCancel }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [cpuComment, setCpuComment] = useState(null);
  const textareaRef = useRef(null);
  const accent = theme.accent;

  // Title auto-converts to alternating caps
  const handleTitleChange = (e) => {
    setTitle(toAlternatingCaps(e.target.value));
  };

  const insertEmoji = (emoji) => {
    setContent(c => c + emoji);
    textareaRef.current?.focus();
  };

  const handlePublish = () => {
    if (!title.trim() || !content.trim()) return;
    setPublishing(true);

    // Simulate publishing delay
    setTimeout(() => {
      const post = {
        title: title,
        date: new Date().toLocaleDateString("fr-FR"),
        month: "custom",
        content: content,
        comments: 0,
        emoji: "✨",
        img: "/images/skyblog/profil.png",
        isUserPost: true,
      };
      onPublish(post);
      setPublishing(false);

      // CPU auto-comment after 30s will be handled by parent
    }, 800);
  };

  return (
    <div style={{
      padding: 16, animation: "slideUp 0.3s ease-out",
    }}>
      <div style={{
        textAlign: "center", marginBottom: 12,
        fontFamily: "'Comic Sans MS', cursive",
        color: accent, fontSize: 16, fontWeight: "bold",
      }}>
        ✏️ Nouvel article
      </div>

      {/* Title */}
      <div style={{ marginBottom: 8 }}>
        <label style={{ fontSize: 10, color: theme.text, opacity: 0.6, display: "block", marginBottom: 2 }}>
          Titre (converti automatiquement en AlTeRnAtInG cApS) :
        </label>
        <input
          value={title}
          onChange={handleTitleChange}
          placeholder="Mon super article..."
          style={{
            width: "100%", padding: "6px 10px",
            background: "rgba(0,0,0,0.4)", color: accent,
            border: `1px solid ${accent}40`, borderRadius: 4,
            fontSize: 14, fontFamily: "'Comic Sans MS', cursive",
            fontWeight: "bold", boxSizing: "border-box",
          }}
        />
      </div>

      {/* Emoji picker */}
      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
        {EMOJIS.map(e => (
          <button key={e} onClick={() => insertEmoji(e)} style={{
            background: `${accent}10`, border: `1px solid ${accent}25`,
            borderRadius: 4, padding: "2px 6px", cursor: "pointer",
            fontSize: 14, transition: "all 0.15s",
          }}>
            {e}
          </button>
        ))}
      </div>

      {/* Content */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Écris ton article ici... LâChE tOuT !!"
        style={{
          width: "100%", height: 140, resize: "vertical",
          background: "rgba(50,0,80,0.3)", color: theme.text,
          border: `1px solid ${accent}30`, borderRadius: 6,
          padding: 10, fontSize: 12, fontFamily: "'Comic Sans MS', cursive",
          lineHeight: 1.6, boxSizing: "border-box",
        }}
      />

      {/* Preview */}
      {(title || content) && (
        <div style={{
          marginTop: 8, padding: 10, background: "rgba(0,0,0,0.3)",
          borderRadius: 6, border: `1px dashed ${accent}30`,
        }}>
          <div style={{ fontSize: 9, color: accent, opacity: 0.6, marginBottom: 4 }}>Aperçu :</div>
          <div style={{ fontFamily: "'Comic Sans MS', cursive", fontSize: 13, color: accent, fontWeight: "bold" }}>
            {title || "..."}
          </div>
          <div style={{
            fontFamily: "'Comic Sans MS', cursive", fontSize: 11,
            color: theme.text, opacity: 0.8, marginTop: 4, whiteSpace: "pre-line",
          }}>
            {content || "..."}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "center" }}>
        <button onClick={onCancel} style={{
          background: "rgba(100,100,100,0.2)", border: "1px solid #666",
          borderRadius: 4, padding: "6px 16px", cursor: "pointer",
          color: "#888", fontSize: 11, fontFamily: "'Comic Sans MS', cursive",
        }}>
          Annuler
        </button>
        <button
          onClick={handlePublish}
          disabled={!title.trim() || !content.trim() || publishing}
          style={{
            background: title.trim() && content.trim() ? `${accent}30` : "rgba(100,100,100,0.15)",
            border: `2px solid ${title.trim() && content.trim() ? accent : "#666"}`,
            borderRadius: 4, padding: "6px 20px", cursor: title.trim() && content.trim() ? "pointer" : "default",
            color: title.trim() && content.trim() ? accent : "#666",
            fontSize: 12, fontWeight: "bold", fontFamily: "'Comic Sans MS', cursive",
            transition: "all 0.15s",
          }}
        >
          {publishing ? "Publication..." : "🚀 Publier !!"}
        </button>
      </div>
    </div>
  );
}

export { CPU_COMMENTS };
