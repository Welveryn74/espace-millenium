import { useState, useRef } from "react";
import IELink from "../IELink";
import { ieBtnStyle } from "../../../../styles/windowStyles";
import { GOOGLE_DEFAULT_RESULTS, GOOGLE_SEARCH_RESULTS } from "../../../../data/webPages";

export default function PageGoogle({ navigateTo, searchQuery, setSearchQuery }) {
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
