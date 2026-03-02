import { useState } from "react";
import { SKYBLOG_FRIENDS, SKYBLOG_HOROSCOPES, SKYBLOG_ARCHIVES } from "../../../data/skyblogPosts";

const MOODS = [
  { emoji: "😊", label: "Tro bi1" },
  { emoji: "😢", label: "Deg" },
  { emoji: "😍", label: "In love" },
  { emoji: "😤", label: "Vénère" },
  { emoji: "😎", label: "Tro cool" },
  { emoji: "🤪", label: "Mdr" },
  { emoji: "😴", label: "Fatigué" },
  { emoji: "🤔", label: "Pensif" },
];

const AVATARS = ["🧑", "👩", "👦", "👧", "🧒", "🧔", "😎", "🤓"];

const SIGNS = Object.keys(SKYBLOG_HOROSCOPES);

export default function SkyblogSidebar({
  username, visitors, totalPosts, totalComments,
  theme, onFilterMonth, activeMonth, onOpenEditor,
}) {
  const [mood, setMood] = useState(MOODS[0]);
  const [avatar, setAvatar] = useState("🧑");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [friendAlert, setFriendAlert] = useState(null);
  const [sign, setSign] = useState("belier");

  const accent = theme.accent;

  return (
    <div style={{
      width: 170, flexShrink: 0, overflowY: "auto",
      borderRight: `1px solid ${accent}30`,
      background: "rgba(0,0,0,0.3)",
      padding: 10, fontSize: 10,
      fontFamily: "'Comic Sans MS', cursive",
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      {/* Profile */}
      <div style={{
        textAlign: "center", padding: 8,
        background: `${accent}10`, borderRadius: 6,
        border: `1px solid ${accent}25`,
      }}>
        <div
          onClick={() => setShowAvatarPicker(!showAvatarPicker)}
          style={{ fontSize: 32, cursor: "pointer", transition: "transform 0.2s" }}
        >
          {avatar}
        </div>
        {showAvatarPicker && (
          <div style={{ display: "flex", gap: 4, justifyContent: "center", flexWrap: "wrap", marginTop: 4 }}>
            {AVATARS.map(a => (
              <span key={a} onClick={() => { setAvatar(a); setShowAvatarPicker(false); }}
                style={{ cursor: "pointer", fontSize: 16, opacity: avatar === a ? 1 : 0.5 }}>
                {a}
              </span>
            ))}
          </div>
        )}
        <div style={{ color: accent, fontWeight: "bold", fontSize: 11, marginTop: 4 }}>
          xX-{username}-Xx
        </div>
        <div style={{ color: theme.text, opacity: 0.6, fontSize: 9 }}>13 ans — France</div>

        {/* Mood */}
        <div style={{ marginTop: 6 }}>
          <span style={{ color: theme.text, opacity: 0.5, fontSize: 8 }}>Humeur :</span>
          <div style={{
            display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap", marginTop: 2,
          }}>
            {MOODS.map(m => (
              <span key={m.label} onClick={() => setMood(m)}
                title={m.label}
                style={{
                  cursor: "pointer", fontSize: 12,
                  opacity: mood.label === m.label ? 1 : 0.4,
                  transition: "all 0.15s",
                }}>
                {m.emoji}
              </span>
            ))}
          </div>
          <div style={{ color: accent, fontSize: 9, marginTop: 2 }}>{mood.emoji} {mood.label}</div>
        </div>
      </div>

      {/* Visitor counter */}
      <div style={{
        textAlign: "center", padding: "4px 0",
        background: `${accent}10`, borderRadius: 4,
        border: `1px solid ${accent}15`,
      }}>
        <div style={{ fontSize: 8, color: theme.text, opacity: 0.5 }}>Visiteurs</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 1, marginTop: 2 }}>
          {String(visitors).padStart(6, "0").split("").map((d, i) => (
            <span key={i} style={{
              background: "#000", color: accent, padding: "1px 3px",
              borderRadius: 2, fontSize: 11, fontFamily: "monospace",
              fontWeight: "bold", border: `1px solid ${accent}40`,
            }}>
              {d}
            </span>
          ))}
        </div>
        <div style={{ fontSize: 8, color: theme.text, opacity: 0.4, marginTop: 2 }}>
          {totalPosts} articles | {totalComments} coms
        </div>
      </div>

      {/* Music player */}
      <div style={{
        padding: 6, background: `${accent}08`, borderRadius: 4,
        border: `1px solid ${accent}15`, textAlign: "center",
      }}>
        <div style={{ fontSize: 8, color: theme.text, opacity: 0.5, marginBottom: 2 }}>♫ En écoute ♫</div>
        <div style={{ color: accent, fontSize: 9, fontWeight: "bold" }}>Evanescence</div>
        <div style={{ color: theme.text, opacity: 0.7, fontSize: 8 }}>My Immortal</div>
        <div style={{ marginTop: 4, display: "flex", justifyContent: "center", gap: 6 }}>
          <span style={{ cursor: "pointer", fontSize: 10 }}>⏮</span>
          <span style={{ cursor: "pointer", fontSize: 12 }}>▶</span>
          <span style={{ cursor: "pointer", fontSize: 10 }}>⏭</span>
        </div>
        <div style={{
          height: 2, background: `${accent}30`, borderRadius: 1, marginTop: 4,
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%", background: accent, width: "35%",
            animation: "musicProgress 8s linear infinite",
          }} />
        </div>
      </div>

      {/* Write article button */}
      <button onClick={onOpenEditor} style={{
        background: `${accent}25`, border: `1px solid ${accent}60`,
        borderRadius: 4, padding: "6px 8px", cursor: "pointer",
        color: accent, fontWeight: "bold", fontSize: 10,
        fontFamily: "'Comic Sans MS', cursive",
        transition: "all 0.15s", width: "100%",
      }}>
        ✏️ Écrire un article
      </button>

      {/* Top 8 Friends */}
      <div>
        <div style={{ color: accent, fontWeight: "bold", fontSize: 10, marginBottom: 4 }}>
          ★ Mes Amis (Top 8)
        </div>
        {SKYBLOG_FRIENDS.map((f, i) => (
          <div key={i}
            onClick={() => { setFriendAlert(f.pseudo); setTimeout(() => setFriendAlert(null), 2000); }}
            style={{
              display: "flex", alignItems: "center", gap: 4, padding: "3px 4px",
              cursor: "pointer", borderRadius: 3,
              background: friendAlert === f.pseudo ? `${accent}20` : "transparent",
              transition: "background 0.2s",
            }}
          >
            <span style={{ fontSize: 12 }}>{f.avatar}</span>
            <div>
              <div style={{ color: accent, fontSize: 8, textDecoration: "underline" }}>{f.pseudo}</div>
              <div style={{ color: theme.text, opacity: 0.4, fontSize: 7 }}>{f.status}</div>
            </div>
          </div>
        ))}
        {friendAlert && (
          <div style={{
            marginTop: 4, padding: "4px 6px", background: "rgba(255,0,0,0.15)",
            borderRadius: 3, color: "#FF6666", fontSize: 8, textAlign: "center",
            animation: "slideUp 0.2s ease-out",
          }}>
            ⚠️ Ce sky n'existe plus...
          </div>
        )}
      </div>

      {/* Archives */}
      <div>
        <div style={{ color: accent, fontWeight: "bold", fontSize: 10, marginBottom: 4 }}>
          📅 Archives
        </div>
        {SKYBLOG_ARCHIVES.map(a => (
          <div key={a.key}
            onClick={() => onFilterMonth(activeMonth === a.key ? null : a.key)}
            style={{
              padding: "2px 4px", cursor: "pointer", borderRadius: 2,
              color: activeMonth === a.key ? accent : theme.text,
              opacity: activeMonth === a.key ? 1 : 0.5,
              fontWeight: activeMonth === a.key ? "bold" : "normal",
              fontSize: 9, transition: "all 0.15s",
              background: activeMonth === a.key ? `${accent}15` : "transparent",
            }}
          >
            {activeMonth === a.key ? "▶ " : "  "}{a.label}
          </div>
        ))}
      </div>

      {/* Horoscope */}
      <div>
        <div style={{ color: accent, fontWeight: "bold", fontSize: 10, marginBottom: 4 }}>
          🔮 Horoscope du jour
        </div>
        <select
          value={sign}
          onChange={e => setSign(e.target.value)}
          style={{
            width: "100%", background: "rgba(0,0,0,0.4)", color: theme.text,
            border: `1px solid ${accent}30`, borderRadius: 3,
            padding: "2px 4px", fontSize: 9, marginBottom: 4,
            fontFamily: "'Comic Sans MS', cursive",
          }}
        >
          {SIGNS.map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        <div style={{
          color: theme.text, opacity: 0.8, fontSize: 9, lineHeight: 1.4,
          fontStyle: "italic", padding: "4px 0",
        }}>
          {SKYBLOG_HOROSCOPES[sign]}
        </div>
      </div>

      <style>{`
        @keyframes musicProgress {
          from { width: 0; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
