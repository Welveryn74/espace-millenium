export default function TamagotchiWidget({ tama, tamaDo, tamaMood, tamaAction, neglected, onReset, tamaTotal, TAMA_MAX }) {
  const statBar = (label, value, color) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <span style={{ color: "#AAA", fontSize: 11, width: 65, fontFamily: "'Tahoma', sans-serif" }}>{label}</span>
      <div style={{ flex: 1, height: 10, background: "rgba(255,255,255,0.08)", borderRadius: 5, overflow: "hidden" }}>
        <div style={{
          width: `${(value / TAMA_MAX) * 100}%`, height: "100%",
          background: value <= 1 ? "#e74c3c" : color,
          borderRadius: 5, transition: "width 0.5s ease",
        }} />
      </div>
      <span style={{ color: "#666", fontSize: 10, width: 20, textAlign: "right" }}>{value}/{TAMA_MAX}</span>
    </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div style={{
        background: "#C8D8A0", borderRadius: 16, padding: 20, maxWidth: 240, margin: "0 auto",
        border: "4px solid #A0B878", boxShadow: "inset 0 2px 8px rgba(0,0,0,0.15), 0 0 20px rgba(168,200,120,0.2)",
      }}>
        {neglected ? (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{ fontSize: 48, opacity: 0.6 }}>💀</div>
            <div style={{ fontSize: 11, color: "#8B6040", fontWeight: "bold", marginTop: 8 }}>
              Ton Tamagotchi s'est endormi...
            </div>
            <button
              onClick={onReset}
              style={{
                marginTop: 12, background: "#A0B878", border: "2px solid #6B8840",
                borderRadius: 8, padding: "8px 18px", cursor: "pointer",
                fontSize: 12, color: "#2D3B1A", fontWeight: "bold",
                fontFamily: "'Tahoma', sans-serif", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#B8D090")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#A0B878")}
            >
              🔄 Réveiller
            </button>
          </div>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <div style={{
                fontSize: 48, transition: "transform 0.3s",
                transform: tamaAction ? "scale(1.2)" : "scale(1)",
              }}>
                {tamaMood}
              </div>
              {tamaAction && (
                <div style={{ fontSize: 11, color: "#556B2F", fontWeight: "bold", marginTop: 4, animation: "fadeIn 0.2s" }}>
                  {tamaAction === "nourrir" && "Miam miam !"}
                  {tamaAction === "jouer" && "Youpi !"}
                  {tamaAction === "nettoyer" && "Tout propre !"}
                </div>
              )}
            </div>
            <div style={{ marginBottom: 12 }}>
              {statBar("Faim", tama.faim, "#E8A838")}
              {statBar("Bonheur", tama.bonheur, "#E86088")}
              {statBar("Propreté", tama.proprete, "#58A8D8")}
            </div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
              {[
                { action: "nourrir", emoji: "🍔", label: "Nourrir" },
                { action: "jouer", emoji: "⚽", label: "Jouer" },
                { action: "nettoyer", emoji: "🧼", label: "Nettoyer" },
              ].map((btn) => (
                <button
                  key={btn.action}
                  onClick={() => tamaDo(btn.action)}
                  style={{
                    background: "#8CA858", border: "2px solid #6B8840",
                    borderRadius: 8, padding: "6px 10px", cursor: "pointer",
                    fontSize: 11, color: "#2D3B1A", fontWeight: "bold",
                    fontFamily: "'Tahoma', sans-serif", transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#A0C060")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#8CA858")}
                >
                  {btn.emoji} {btn.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      <div style={{ textAlign: "center", marginTop: 16, color: "#8B6BAE", fontSize: 11, fontStyle: "italic" }}>
        {tamaTotal >= 12
          ? "Ton Tamagotchi est au top ! Des petits coeurs flottent autour de lui..."
          : tamaTotal >= 6
          ? "Il va bien, mais il aimerait un peu plus d'attention..."
          : "Il est triste ! Vite, occupe-toi de lui !"
        }
      </div>
    </div>
  );
}
