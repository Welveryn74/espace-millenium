// Palette partagée chambre
export const C = {
  primary: "#C8B0E8",
  secondary: "#8B6BAE",
  text: "#E0E0E0",
  textDim: "#AAA",
  textMuted: "#666",
  gold: "#FFD700",
  bg: "rgba(255,255,255,0.04)",
  bgHover: "rgba(255,255,255,0.08)",
  border: "rgba(255,255,255,0.08)",
};

// Typographie
export const viewTitle = { color: C.primary, fontSize: 15, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif" };
export const viewSubtitle = { color: C.secondary, fontSize: 11, fontStyle: "italic", marginTop: 4 };
export const viewFlavor = { color: C.textMuted, fontSize: 10, fontStyle: "italic", marginTop: 16, textAlign: "center" };

// Cards
export const card = (selected, color) => ({
  background: selected ? `${color}20` : C.bg,
  border: selected ? `2px solid ${color}60` : `1px solid ${C.border}`,
  borderRadius: 10,
  padding: 14,
  cursor: "pointer",
  transition: "all 0.25s ease",
});
