import { SOUS_LE_LIT } from "../../../../data/chambreItems";

export default function SousLeLitView({ found, searching, lastFound, doSearch }) {
  const allFound = found.length >= SOUS_LE_LIT.length;

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ color: "#C8B0E8", fontSize: 15, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif" }}>
          Sous le lit
        </div>
        <div style={{ color: "#8B6BAE", fontSize: 11, marginTop: 4, fontStyle: "italic" }}>
          Tout un monde caché sous le sommier... {found.length}/{SOUS_LE_LIT.length} objets trouvés
        </div>
      </div>

      {!allFound && (
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <button
            onClick={doSearch}
            disabled={searching}
            style={{
              background: searching ? "rgba(200,176,232,0.3)" : "rgba(200,176,232,0.15)",
              color: "#C8B0E8", border: "1px solid rgba(200,176,232,0.4)",
              padding: "10px 28px", borderRadius: 8, cursor: searching ? "default" : "pointer",
              fontFamily: "'Tahoma', sans-serif", fontSize: 13, fontWeight: "bold",
              transition: "all 0.15s",
              animation: searching ? "searchAnim 0.5s ease-in-out infinite" : "none",
            }}
          >
            {searching ? "🔍 Fouille en cours..." : "🔦 Fouiller sous le lit"}
          </button>
        </div>
      )}

      {lastFound && (
        <div style={{
          textAlign: "center", marginBottom: 16, padding: 16,
          background: "rgba(200,176,232,0.1)", border: "1px solid rgba(200,176,232,0.3)",
          borderRadius: 10, animation: "popIn 0.4s ease-out",
        }}>
          <div style={{ fontSize: 40 }}>{lastFound.emoji}</div>
          <div style={{ color: "#E0E0E0", fontSize: 14, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif", marginTop: 8 }}>
            {lastFound.name}
          </div>
          <div style={{ color: "#AAA", fontSize: 11, marginTop: 6, lineHeight: 1.6 }}>
            {lastFound.desc}
          </div>
          <div style={{ color: "#8B6BAE", fontSize: 10, fontStyle: "italic", marginTop: 6 }}>
            {lastFound.flavor}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {SOUS_LE_LIT.map((item) => {
          const isFound = found.includes(item.id);
          return (
            <div key={item.id} style={{
              textAlign: "center", padding: 10, borderRadius: 8,
              background: isFound ? "rgba(200,176,232,0.08)" : "rgba(100,100,100,0.06)",
              border: isFound ? "1px solid rgba(200,176,232,0.25)" : "1px dashed rgba(100,100,100,0.2)",
            }}>
              <div style={{ fontSize: 24, opacity: isFound ? 1 : 0.2 }}>
                {isFound ? item.emoji : "❓"}
              </div>
              <div style={{
                fontSize: 9, marginTop: 4, fontFamily: "'Tahoma', sans-serif",
                color: isFound ? "#C8B0E8" : "#555",
              }}>
                {isFound ? item.name : "???"}
              </div>
            </div>
          );
        })}
      </div>

      {allFound && (
        <div style={{ textAlign: "center", marginTop: 14, color: "#C8B0E8", fontSize: 12, fontWeight: "bold" }}>
          🎉 Tu as tout retrouvé ! Le sous-lit n'a plus de secrets pour toi.
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 14, color: "#8B6BAE", fontSize: 10, fontStyle: "italic" }}>
        La poussière, les moutons, et des trésors oubliés depuis des années.
      </div>
    </div>
  );
}
