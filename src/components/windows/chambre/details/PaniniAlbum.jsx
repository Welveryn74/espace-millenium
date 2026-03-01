import { ALBUM_PAGES, ALBUM_TITLE, TOTAL_STICKERS } from "../../../../data/paniniAlbum";

const pageBtnStyle = {
  background: "none",
  border: "1px solid rgba(224,200,112,0.4)",
  color: "#E0C870",
  padding: "4px 12px",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 10,
  fontWeight: "bold",
  fontFamily: "'Tahoma', sans-serif",
};

export default function PaniniAlbum({ page, setPage, collected, newStickers }) {
  const currentPage = ALBUM_PAGES[page];
  const ownedCount = collected.length;
  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: "bold", color: "#E0C870", fontFamily: "'Tahoma', sans-serif" }}>
          {ALBUM_TITLE}
        </div>
        <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>
          {ownedCount}/{TOTAL_STICKERS} stickers collectés{ownedCount < TOTAL_STICKERS ? " — Il t'en manque toujours..." : " — Collection complète !!"}
        </div>
      </div>
      <div style={{
        background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: 12,
        border: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <span style={{ color: "#E0C870", fontSize: 13, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif" }}>
            {currentPage.team}
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
          {currentPage.stickers.map((sticker, i) => {
            const owned = collected.includes(sticker.name);
            const isNew = newStickers.includes(sticker.name);
            return (
              <div
                key={i}
                style={{
                  background: owned ? "rgba(224,200,112,0.1)" : "rgba(100,100,100,0.1)",
                  border: owned ? "1px solid rgba(224,200,112,0.3)" : "1px dashed rgba(100,100,100,0.3)",
                  borderRadius: 6, padding: 8, textAlign: "center", position: "relative",
                  minHeight: 60, display: "flex", flexDirection: "column", justifyContent: "center",
                  animation: isNew ? "popIn 0.4s ease-out" : "none",
                }}
              >
                {owned ? (
                  <>
                    {isNew && (
                      <div style={{
                        position: "absolute", top: -4, right: -4,
                        background: "#FF4444", color: "#fff", fontSize: 7, fontWeight: "bold",
                        padding: "1px 4px", borderRadius: 6, animation: "blink 1s infinite",
                      }}>Nouveau!</div>
                    )}
                    <div style={{ fontSize: 18 }}>⚽</div>
                    <div style={{ color: "#E0E0E0", fontSize: 8, marginTop: 4, fontWeight: "bold", lineHeight: 1.2 }}>
                      {sticker.name}
                    </div>
                    <div style={{ color: "#888", fontSize: 7, marginTop: 1 }}>#{sticker.number}</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 18, opacity: 0.3 }}>👤</div>
                    <div style={{ color: "#555", fontSize: 8, marginTop: 4 }}>???</div>
                    <div style={{ color: "#444", fontSize: 7, marginTop: 1 }}>#{sticker.number}</div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
        <button
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
          style={{ ...pageBtnStyle, opacity: page === 0 ? 0.3 : 1 }}
        >
          ← Précédent
        </button>
        <span style={{ color: "#888", fontSize: 10 }}>
          Page {page + 1} / {ALBUM_PAGES.length}
        </span>
        <button
          onClick={() => setPage(Math.min(ALBUM_PAGES.length - 1, page + 1))}
          disabled={page === ALBUM_PAGES.length - 1}
          style={{ ...pageBtnStyle, opacity: page === ALBUM_PAGES.length - 1 ? 0.3 : 1 }}
        >
          Suivant →
        </button>
      </div>
      <div style={{ textAlign: "center", marginTop: 10, color: "#8B6BAE", fontSize: 10, fontStyle: "italic" }}>
        "T'as pas Zidane en double ? Je te l'échange contre deux Trezeguet !"
      </div>
    </div>
  );
}
