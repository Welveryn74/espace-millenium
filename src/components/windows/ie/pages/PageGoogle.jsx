import { useRef } from "react";
import IELink from "../IELink";
import { ieBtnStyle } from "../../../../styles/windowStyles";
import { GOOGLE_DEFAULT_RESULTS } from "../../../../data/webPages";

export default function PageGoogle({ navigateTo, searchQuery }) {
  const inputRef = useRef(null);

  const doSearch = () => {
    const q = (inputRef.current?.value || "").trim();
    if (!q) return;
    // Vrai Google archivé de 2005 via TheOldNet
    navigateTo("google.fr/search?q=" + encodeURIComponent(q));
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100%", background: "#fff" }}>
      <div style={{ textAlign: "center", paddingTop: 120 }}>
        {/* Logo Google en texte coloré */}
        <div style={{ fontSize: 52, fontWeight: "bold", marginBottom: 20, letterSpacing: -1 }}>
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
              width: 380, padding: "6px 12px",
              border: "1px solid #bbb", borderRadius: 20, fontSize: 13,
              outline: "none",
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
          <button onClick={doSearch} style={{ ...ieBtnStyle, padding: "4px 14px", fontSize: 11 }}>Recherche Google</button>
          <button onClick={doSearch} style={{ ...ieBtnStyle, padding: "4px 14px", fontSize: 11 }}>J'ai de la chance</button>
        </div>
      </div>

      {/* Liens suggérés */}
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
    </div>
  );
}
