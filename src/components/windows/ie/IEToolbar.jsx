import { ieBtnStyle } from "../../../styles/windowStyles";
import { IE_FAVORITES } from "../../../data/webPages";

export default function IEToolbar({
  historyIdx, historyLength, goBack, goForward,
  navigateTo, currentUrl,
  addressInput, setAddressInput, handleAddressSubmit,
  showFavorites, setShowFavorites,
  loading,
}) {
  return (
    <div style={{ background: "#ECE9D8", borderBottom: "1px solid #bbb", flexShrink: 0 }}>
      {/* Navigation buttons */}
      <div style={{ padding: "3px 8px", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid #d0d0d0" }}>
        <button style={{ ...ieBtnStyle, opacity: historyIdx <= 0 ? 0.4 : 1 }} disabled={historyIdx <= 0} onClick={goBack}>← Préc.</button>
        <button style={{ ...ieBtnStyle, opacity: historyIdx >= historyLength - 1 ? 0.4 : 1 }} disabled={historyIdx >= historyLength - 1} onClick={goForward}>→ Suiv.</button>
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
            {IE_FAVORITES.map((fav, i) =>
              fav.separator ? (
                <div key={i} style={{ height: 1, background: "#ccc", margin: "3px 6px" }} />
              ) : (
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
              )
            )}
          </div>
        )}
      </div>

      {/* Loading bar */}
      {loading && (
        <div style={{ height: 3, background: "#ddd", overflow: "hidden" }}>
          <div style={{ height: "100%", background: "linear-gradient(90deg, #0055E5, #00AAFF)", animation: "loadbar 0.8s ease-out" }} />
        </div>
      )}
    </div>
  );
}
