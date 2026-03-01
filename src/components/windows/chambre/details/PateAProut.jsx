export default function PateAProut({ playing, onPress }) {
  return (
    <div style={{ textAlign: "center", animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ color: "#C8B0E8", fontSize: 15, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif" }}>
          La Pâte à Prout
        </div>
        <div style={{ color: "#8B6BAE", fontSize: 11, marginTop: 4, fontStyle: "italic" }}>
          Le jouet le plus stupide. Et le plus génial.
        </div>
      </div>
      <div
        onClick={onPress}
        style={{
          display: "inline-block", fontSize: 80, cursor: "pointer",
          transition: "transform 0.15s ease",
          transform: playing ? "scale(1.3) rotate(10deg)" : "scale(1)",
          filter: playing ? "drop-shadow(0 0 20px rgba(200,100,255,0.5))" : "none",
          userSelect: "none",
        }}
      >
        🫠
      </div>
      {playing && (
        <div style={{ fontSize: 32, marginTop: 8, animation: "fadeIn 0.1s ease-out", color: "#C8B0E8" }}>
          💨 PROUUUT 💨
        </div>
      )}
      <div style={{ marginTop: 20 }}>
        <div
          onClick={onPress}
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #9B59B6, #8E44AD)",
            color: "white", fontWeight: "bold", fontSize: 14,
            padding: "12px 32px", borderRadius: 24, cursor: "pointer",
            fontFamily: "'Tahoma', sans-serif",
            boxShadow: "0 4px 15px rgba(155,89,182,0.4)",
            transition: "all 0.15s",
            transform: playing ? "scale(0.95)" : "scale(1)",
          }}
        >
          APPUYER 👇
        </div>
      </div>
      <div style={{ marginTop: 24, color: "#666", fontSize: 10 }}>
        Vendu 2,50 euros en magasin de jouets. Valeur sentimentale : inestimable.
      </div>
    </div>
  );
}
