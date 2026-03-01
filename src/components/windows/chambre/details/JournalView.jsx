import { saveState } from "../../../../utils/storage";
import { viewTitle, viewSubtitle, viewFlavor } from "../../../../styles/chambreStyles";

export default function JournalView({ entries, setEntries, text, setText, addEntry }) {
  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={viewTitle}>Mon Journal Intime 🔒</div>
        <div style={viewSubtitle}>"Cher journal, aujourd'hui..."</div>
      </div>

      <div style={{
        background: "#FFFEF5",
        backgroundImage: `
          repeating-linear-gradient(transparent, transparent 23px, #D4C9B8 23px, #D4C9B8 24px),
          linear-gradient(90deg, transparent 39px, #E8A0A0 39px, #E8A0A0 40px, transparent 40px)
        `,
        borderRadius: 6, padding: "12px 12px 12px 46px", minHeight: 100,
        border: "1px solid #D0C8B0",
        boxShadow: "inset 2px 2px 6px rgba(0,0,0,0.05)",
      }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 500))}
          placeholder="Écris ici..."
          style={{
            width: "100%", minHeight: 70, background: "transparent", border: "none", outline: "none",
            fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive",
            fontSize: 12, color: "#333", lineHeight: "24px", resize: "vertical",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
          <span style={{ fontSize: 9, color: "#999" }}>{text.length}/500</span>
          <button
            onClick={addEntry}
            disabled={!text.trim()}
            style={{
              background: text.trim() ? "#8B6BAE" : "#CCC", color: "#FFF",
              border: "none", padding: "4px 14px", borderRadius: 4, cursor: text.trim() ? "pointer" : "default",
              fontFamily: "'Tahoma', sans-serif", fontSize: 11, fontWeight: "bold",
            }}
          >
            ✏️ Écrire
          </button>
        </div>
      </div>

      {entries.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ color: "#C8B0E8", fontSize: 11, fontWeight: "bold", marginBottom: 8, fontFamily: "'Tahoma', sans-serif" }}>
            Mes entrées ({entries.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 200, overflowY: "auto" }}>
            {entries.map((e, i) => (
              <div key={i} style={{
                background: "rgba(255,254,245,0.08)", borderRadius: 6, padding: 10,
                border: "1px solid rgba(200,176,232,0.15)",
                backgroundImage: "repeating-linear-gradient(transparent, transparent 19px, rgba(200,180,150,0.1) 19px, rgba(200,180,150,0.1) 20px)",
              }}>
                <div style={{ fontSize: 9, color: "#8B6BAE", fontWeight: "bold", marginBottom: 4 }}>
                  📅 {e.date}
                </div>
                <div style={{
                  fontSize: 11, color: "#DDD", lineHeight: 1.6,
                  fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive",
                }}>
                  {e.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={viewFlavor}>
        Cadenas en plastique inclus. Sécurité maximale contre les petits frères.
      </div>
    </div>
  );
}
