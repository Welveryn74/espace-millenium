import { useState, useEffect, useRef } from "react";

const IFRAME_TIMEOUT = 15000; // 15s max before showing content anyway
const SLOW_HINT_DELAY = 10000; // 10s before suggesting fallback

export default function WaybackFrame({ url, fallbackUrl, onLoad }) {
  const [loaded, setLoaded] = useState(false);
  const [showSlowHint, setShowSlowHint] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const timerRef = useRef(null);
  const slowTimerRef = useRef(null);
  const activeUrl = usingFallback ? fallbackUrl : url;

  const handleLoad = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (slowTimerRef.current) clearTimeout(slowTimerRef.current);
    setLoaded(true);
    setShowSlowHint(false);
    if (onLoad) onLoad();
  };

  // Reset state when URL changes
  useEffect(() => {
    setLoaded(false);
    setShowSlowHint(false);
    setUsingFallback(false);
  }, [url]);

  // Timeout: force-show iframe after 15s even if onLoad hasn't fired
  useEffect(() => {
    setLoaded(false);
    setShowSlowHint(false);

    timerRef.current = setTimeout(handleLoad, IFRAME_TIMEOUT);

    // Show slow hint after 10s if fallbackUrl available
    if (fallbackUrl) {
      slowTimerRef.current = setTimeout(() => {
        setShowSlowHint(true);
      }, SLOW_HINT_DELAY);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (slowTimerRef.current) clearTimeout(slowTimerRef.current);
    };
  }, [activeUrl]);

  const toggleSource = () => {
    setUsingFallback(prev => !prev);
    setLoaded(false);
    setShowSlowHint(false);
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
          <div style={{ fontSize: 9, color: "#bbb", marginTop: 4 }}>
            Les archives peuvent prendre quelques secondes...
          </div>
        </div>
      )}
      <iframe
        src={activeUrl}
        sandbox="allow-scripts allow-same-origin"
        style={{
          width: "100%", height: "100%", border: "none",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s ease-in",
        }}
        onLoad={handleLoad}
        onError={handleLoad}
      />
      {/* Bandeau basculement de source */}
      {showSlowHint && fallbackUrl && !loaded && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "rgba(0,0,0,0.85)", padding: "8px 16px",
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 12, fontFamily: "Tahoma, sans-serif", fontSize: 11,
        }}>
          <span style={{ color: "#ccc" }}>
            {usingFallback ? "Chargement lent ?" : "⏳ Chargement lent ?"}
          </span>
          <button
            onClick={toggleSource}
            style={{
              background: "linear-gradient(180deg, #0066CC 0%, #004499 100%)",
              border: "1px solid #003366", borderRadius: 3,
              color: "#fff", padding: "3px 12px", fontSize: 11,
              cursor: "pointer", fontFamily: "Tahoma, sans-serif",
            }}
          >
            {usingFallback ? "Revenir à TheOldNet" : "Essayer via Wayback Machine"}
          </button>
        </div>
      )}
    </div>
  );
}
