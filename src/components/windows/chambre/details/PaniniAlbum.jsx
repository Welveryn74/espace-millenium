import { ALBUM_PAGES, ALBUM_TITLE, TOTAL_STICKERS } from "../../../../data/paniniAlbum";
import { C, viewFlavor } from "../../../../styles/chambreStyles";

export default function PaniniAlbum({ page, setPage, collected, newStickers }) {
  const currentPage = ALBUM_PAGES[page];
  const ownedCount = collected.length;
  const progress = TOTAL_STICKERS > 0 ? (ownedCount / TOTAL_STICKERS) * 100 : 0;

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: "bold", color: C.gold, fontFamily: "'Tahoma', sans-serif" }}>
          {ALBUM_TITLE}
        </div>
        <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>
          {ownedCount}/{TOTAL_STICKERS} stickers collectés
          {ownedCount < TOTAL_STICKERS ? " — Il t'en manque toujours..." : " — Collection complète !!"}
        </div>
        {/* Jauge de progression gold */}
        <div style={{
          margin: "8px auto 0", width: "80%", height: 6,
          background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden",
        }}>
          <div style={{
            height: "100%", borderRadius: 3,
            background: `linear-gradient(90deg, ${C.gold}, #FFA000)`,
            width: `${progress}%`, transition: "width 0.5s ease",
            boxShadow: `0 0 6px ${C.gold}60`,
          }} />
        </div>
      </div>

      <div style={{
        background: C.bg, borderRadius: 8, padding: 12,
        border: `1px solid ${C.border}`,
      }}>
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <span style={{ color: C.gold, fontSize: 13, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif" }}>
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
                  transition: "all 0.25s ease",
                  boxShadow: owned ? "none" : "inset 0 0 8px rgba(0,0,0,0.1)",
                }}
                onMouseEnter={(e) => { if (owned) e.currentTarget.style.boxShadow = `0 0 8px ${C.gold}40`; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = owned ? "none" : "inset 0 0 8px rgba(0,0,0,0.1)"; }}
              >
                {owned ? (
                  <>
                    {isNew && (
                      <div style={{
                        position: "absolute", top: -4, right: -4,
                        background: "#FF4444", color: "#fff", fontSize: 7, fontWeight: "bold",
                        padding: "1px 4px", borderRadius: 6, animation: "blink 1s infinite",
                        boxShadow: "0 0 6px rgba(255,68,68,0.5)",
                      }}>
                        ✨ New!
                      </div>
                    )}
                    <div style={{ fontSize: 18 }}>⚽</div>
                    <div style={{ color: C.text, fontSize: 8, marginTop: 4, fontWeight: "bold", lineHeight: 1.2 }}>
                      {sticker.name}
                    </div>
                    <div style={{ color: "#888", fontSize: 7, marginTop: 1 }}>#{sticker.number}</div>
                  </>
                ) : (
                  <>
                    {/* Silhouette grisee au lieu de ❓ */}
                    <div style={{ fontSize: 18, filter: "grayscale(1) brightness(0.4)", opacity: 0.5 }}>⚽</div>
                    <div style={{ color: "#555", fontSize: 8, marginTop: 4 }}>???</div>
                    <div style={{ color: "#444", fontSize: 7, marginTop: 1 }}>#{sticker.number}</div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
        <button
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
          style={{
            background: page === 0 ? "none" : "rgba(224,200,112,0.1)",
            border: `1px solid ${page === 0 ? "rgba(100,100,100,0.2)" : "rgba(224,200,112,0.4)"}`,
            color: page === 0 ? "#555" : C.gold,
            width: 30, height: 30, borderRadius: "50%",
            cursor: page === 0 ? "default" : "pointer",
            fontSize: 12, fontWeight: "bold",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s ease",
          }}
        >
          ←
        </button>
        <span style={{ color: "#888", fontSize: 10 }}>
          Page {page + 1} / {ALBUM_PAGES.length}
        </span>
        <button
          onClick={() => setPage(Math.min(ALBUM_PAGES.length - 1, page + 1))}
          disabled={page === ALBUM_PAGES.length - 1}
          style={{
            background: page === ALBUM_PAGES.length - 1 ? "none" : "rgba(224,200,112,0.1)",
            border: `1px solid ${page === ALBUM_PAGES.length - 1 ? "rgba(100,100,100,0.2)" : "rgba(224,200,112,0.4)"}`,
            color: page === ALBUM_PAGES.length - 1 ? "#555" : C.gold,
            width: 30, height: 30, borderRadius: "50%",
            cursor: page === ALBUM_PAGES.length - 1 ? "default" : "pointer",
            fontSize: 12, fontWeight: "bold",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s ease",
          }}
        >
          →
        </button>
      </div>

      <div style={viewFlavor}>
        "T'as pas Zidane en double ? Je te l'échange contre deux Trezeguet !"
      </div>
    </div>
  );
}
