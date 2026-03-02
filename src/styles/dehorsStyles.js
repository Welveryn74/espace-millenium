// Palette partagée dehors — couleurs chaudes d'été / extérieur
export const D = {
  primary: "#66DD66",
  secondary: "#44AA44",
  text: "#E8E8E0",
  textDim: "#BBB",
  textMuted: "#777",
  sky: "#87CEEB",
  grass: "#44BB44",
  road: "#666",
  bg: "rgba(255,255,255,0.05)",
  bgHover: "rgba(255,255,255,0.10)",
  border: "rgba(255,255,255,0.10)",
};

export const viewTitle = { color: D.primary, fontSize: 15, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif" };
export const viewSubtitle = { color: D.secondary, fontSize: 11, fontStyle: "italic", marginTop: 4 };
export const viewFlavor = { color: D.textMuted, fontSize: 10, fontStyle: "italic", marginTop: 16, textAlign: "center" };

export const card = (selected, color) => ({
  background: selected ? `${color}20` : D.bg,
  border: selected ? `2px solid ${color}60` : `1px solid ${D.border}`,
  borderRadius: 10,
  padding: 14,
  cursor: "pointer",
  transition: "all 0.25s ease",
});
