// Windows XP Paint — 28 colors (2 rows of 14)
export const XP_COLORS = [
  // Row 1
  "#000000","#808080","#800000","#808000","#008000","#008080","#000080","#800080",
  "#808040","#004040","#0080FF","#004080","#4000FF","#804000",
  // Row 2
  "#FFFFFF","#C0C0C0","#FF0000","#FFFF00","#00FF00","#00FFFF","#0000FF","#FF00FF",
  "#FFFF80","#00FF80","#80FFFF","#8080FF","#FF0080","#FF8040",
];

export const TOOLS = [
  { id: "pencil",      label: "Crayon",        emoji: "✏️" },
  { id: "brush",       label: "Pinceau",       emoji: "🖌️" },
  { id: "eraser",      label: "Gomme",         emoji: "🧽" },
  { id: "fill",        label: "Remplissage",   emoji: "🪣" },
  { id: "eyedropper",  label: "Pipette",       emoji: "💉" },
  { id: "line",        label: "Ligne",         emoji: "📏" },
];

export const BRUSH_SIZES = [1, 3, 5, 8];

export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 400;

export const DEFAULTS = {
  color: "#000000",
  bgColor: "#FFFFFF",
  tool: "pencil",
  brushSize: 3,
};
