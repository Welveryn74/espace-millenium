export default function Y2KPopup({ onClose, onBSOD }) {
  const handleClose = () => {
    onClose();
    // 10% chance de faux BSOD
    if (Math.random() < 0.1 && onBSOD) {
      setTimeout(() => onBSOD(), 300);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,50,0.7)", backdropFilter: "blur(4px)",
    }}>
      <div style={{
        width: 440, background: "#ECE9D8", border: "2px solid #0055E5",
        borderRadius: "8px 8px 0 0", boxShadow: "6px 10px 30px rgba(0,0,0,0.6)",
        animation: "popIn 0.3s ease-out",
      }}>
        <div style={{
          background: "linear-gradient(180deg, #0055E5 0%, #0033AA 100%)",
          padding: "5px 8px", display: "flex", alignItems: "center",
        }}>
          <span style={{ color: "#fff", fontWeight: "bold", fontSize: 12, textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>⚠️ Erreur Système Y2K — FATAL ERROR</span>
        </div>
        <div style={{ padding: 22 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ fontSize: 44, flexShrink: 0 }}>⚠️</div>
            <div style={{ fontSize: 12, lineHeight: 1.8, color: "#333", fontFamily: "'Tahoma', sans-serif" }}>
              <p style={{ margin: "0 0 10px 0", fontWeight: "bold", color: "#C00", fontSize: 13 }}>
                ERREUR CRITIQUE — BUG DE L'AN 2000 DÉTECTÉ
              </p>
              <p style={{ margin: "0 0 8px 0" }}>
                Le bug de l'an 2000 n'a jamais eu lieu. Les avions ne sont pas tombés. Les centrales n'ont pas explosé. Les distributeurs ont continué à fonctionner.
              </p>
              <p style={{ margin: "0 0 8px 0" }}>
                Mais cette décennie a bien connu son propre « bug » : celui d'une génération prise entre l'utopie numérique d'Internet, les sonneries polyphoniques, MSN Messenger, les feuilles Diddl et le gel pailleté...
              </p>
              <p style={{ margin: "0 0 8px 0" }}>
                ...et un mardi de septembre 2001 qui a changé le monde pour toujours.
              </p>
              <p style={{ margin: "0 0 8px 0" }}>
                Une jeunesse connectée et désillusionnée. Optimiste et nostalgique. Analogique et digitale.
              </p>
              <p style={{ margin: 0, fontStyle: "italic", color: "#666", borderTop: "1px solid #ddd", paddingTop: 8 }}>
                Bienvenue dans L'Espace Millénium. Vous venez de revisiter les années 2000. ✨
              </p>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 18 }}>
            <button onClick={handleClose} style={{
              padding: "7px 44px", background: "linear-gradient(180deg, #F0F0F0 0%, #D0D0D0 100%)",
              border: "1px solid #888", borderRadius: 3, cursor: "pointer", fontWeight: "bold",
              fontSize: 12, fontFamily: "'Tahoma', sans-serif",
            }}>OK</button>
          </div>
        </div>
      </div>
    </div>
  );
}
