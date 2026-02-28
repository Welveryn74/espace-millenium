export const GRID = { rows: 9, cols: 9, mines: 10 };

export const NUMBER_COLORS = {
  1: "#0000FF", // blue
  2: "#008000", // green
  3: "#FF0000", // red
  4: "#000080", // navy
  5: "#800000", // maroon
  6: "#008080", // teal
  7: "#000000", // black
  8: "#808080", // gray
};

export const CELL_STATES = {
  HIDDEN: "hidden",
  REVEALED: "revealed",
  FLAGGED: "flagged",
};

export const SMILEY_STATES = {
  playing: "\u{1F642}",
  clicking: "\u{1F62E}",
  dead: "\u{1F480}",
  win: "\u{1F60E}",
};
