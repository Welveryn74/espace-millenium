import { useState } from "react";

export default function WaybackFrame({ url, onLoad }) {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
    if (onLoad) onLoad();
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {!loaded && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "#fff", fontFamily: "Tahoma, sans-serif",
          fontSize: 12, color: "#888", flexDirection: "column", gap: 8,
        }}>
          <div style={{ fontSize: 24 }}>🌐</div>
          Chargement de l'archive...
          <div style={{
            width: 200, height: 3, background: "#ddd",
            borderRadius: 2, overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              background: "linear-gradient(90deg, #0055E5, #00AAFF)",
              animation: "loadbar 1.5s ease-in-out infinite",
            }} />
          </div>
        </div>
      )}
      <iframe
        src={url}
        sandbox="allow-scripts allow-same-origin"
        style={{
          width: "100%", height: "100%", border: "none",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s ease-in",
        }}
        onLoad={handleLoad}
        onError={handleLoad}
      />
    </div>
  );
}
