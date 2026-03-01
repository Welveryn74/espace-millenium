// 3D room layout data — positions, sizes, textures for all furniture and objects
// Coordinates: X = left/right, Y = up/down, Z = front/back
// Room: camera looks into the room from z=2 toward z=-2.5

export const ROOM = {
  width: 6,
  height: 3.5,
  depth: 5,
  walls: "#4E3972",
  floor: "#8B6840",
  ceiling: "#3E3260",
  baseboard: "#5E3828",
};

// Wall sprites — flat items that belong on walls (posters, window, stars)
export const WALL_SPRITES = [
  {
    id: "fenetre",
    texDay: "/images/chambre/room/window-day.svg",
    texNight: "/images/chambre/room/window-night.svg",
    position: [-1.8, 2.0, -2.45],
    size: [1.2, 1.4],
  },
  {
    id: "posterDbz",
    tex: "/images/chambre/room/poster-dbz.png",
    position: [-0.2, 2.3, -2.45],
    size: [0.9, 0.7],
  },
  {
    id: "posterYgo",
    tex: "/images/chambre/room/poster-yugioh.png",
    position: [0.6, 2.1, -2.45],
    size: [0.6, 0.8],
  },
  {
    id: "glowStars",
    tex: "/images/chambre/room/glow-stars.png",
    position: [1.8, 2.8, -2.45],
    size: [2.0, 1.2],
  },
];

// 3D Furniture — real box geometry with depth
export const FURNITURE = {
  bed: {
    // Bed frame (wooden)
    frame: { size: [1.8, 0.35, 2.2], position: [0.6, 0.175, -1.3], color: "#5C3D2A" },
    // Mattress on top of frame
    mattress: { size: [1.7, 0.15, 2.1], position: [0.6, 0.425, -1.3], color: "#E8E0D0" },
    // Headboard against back wall
    headboard: { size: [1.8, 0.6, 0.08], position: [0.6, 0.65, -2.35], color: "#4A3020" },
    // Pillows
    pillows: [
      { size: [0.4, 0.1, 0.25], position: [0.25, 0.55, -2.05], color: "#FFFEF8" },
      { size: [0.35, 0.1, 0.22], position: [0.8, 0.56, -2.1], color: "#FFFEF8" },
    ],
    tex: "/images/chambre/room/bed.png",
  },
  nightstand: {
    // Main body
    body: { size: [0.5, 0.55, 0.4], position: [-0.7, 0.275, -1.8], color: "#6B4830" },
    // Top surface (slightly lighter)
    top: { size: [0.54, 0.03, 0.44], position: [-0.7, 0.565, -1.8], color: "#7B5638" },
    // Drawer front
    drawer: { size: [0.42, 0.15, 0.01], position: [-0.7, 0.32, -1.58], color: "#5C3D2A" },
    // Drawer handle
    handle: { size: [0.12, 0.02, 0.02], position: [-0.7, 0.32, -1.565], color: "#C0A070" },
    tex: "/images/chambre/room/nightstand.png",
  },
  shelf: {
    // Back panel
    back: { size: [1.6, 1.0, 0.04], position: [2.0, 1.8, -2.45], color: "#5C3D2A" },
    // Top shelf board
    shelfTop: { size: [1.6, 0.04, 0.35], position: [2.0, 2.15, -2.28], color: "#6B4830" },
    // Middle shelf board
    shelfMid: { size: [1.6, 0.04, 0.35], position: [2.0, 1.75, -2.28], color: "#6B4830" },
    // Bottom shelf board
    shelfBot: { size: [1.6, 0.04, 0.35], position: [2.0, 1.35, -2.28], color: "#6B4830" },
    // Side panels
    sideL: { size: [0.04, 1.0, 0.35], position: [1.22, 1.8, -2.28], color: "#5C3D2A" },
    sideR: { size: [0.04, 1.0, 0.35], position: [2.78, 1.8, -2.28], color: "#5C3D2A" },
    tex: "/images/chambre/room/shelf.png",
  },
  rug: {
    tex: "/images/chambre/room/rug.png",
    position: [-1.5, 0.005, 0.5],
    size: [2.0, 1.3],
  },
};

// Lamp — 3D cone + cylinder
export const LAMP = {
  base: { radius: 0.08, height: 0.04, position: [-0.7, 0.59, -1.8], color: "#8B7355" },
  stem: { radius: 0.025, height: 0.2, position: [-0.7, 0.7, -1.8], color: "#C8A050" },
  shade: { radiusTop: 0.04, radiusBot: 0.14, height: 0.15,
           position: [-0.7, 0.87, -1.8], colorOn: "#FFE082", colorOff: "#8B7355" },
};

// Objects ON the nightstand (sitting on top surface y=0.58)
export const NIGHTSTAND_ITEMS = [
  // Tamagotchi — rounded egg shape
  { type: "box", size: [0.06, 0.09, 0.03], color: "#42A5F5",
    position: [-0.52, 0.625, -1.75] },
  // Réveil digital
  { type: "box", size: [0.1, 0.06, 0.04], color: "#1a1a1a",
    position: [-0.88, 0.61, -1.72] },
  // Radio
  { type: "box", size: [0.12, 0.06, 0.06], color: "#8B7355",
    position: [-0.7, 0.61, -1.68] },
  // Journal intime
  { type: "box", size: [0.06, 0.08, 0.015], color: "#8B4513",
    position: [-0.55, 0.62, -1.85], rotation: [0, 0.2, 0] },
];

// Objects on shelves
export const SHELF_ITEMS = [
  // Top shelf — LEGO boxes
  { type: "box", size: [0.25, 0.15, 0.2], color: "#E53935",
    position: [1.5, 2.24, -2.25] },
  { type: "box", size: [0.1, 0.18, 0.15], color: "#FF5722",
    position: [1.72, 2.26, -2.3] },
  // Top shelf — board games stacked
  { type: "box", size: [0.35, 0.06, 0.25], color: "#2E7D32",
    position: [2.3, 2.2, -2.25] },
  { type: "box", size: [0.35, 0.06, 0.25], color: "#1565C0",
    position: [2.3, 2.26, -2.25] },
  { type: "box", size: [0.35, 0.06, 0.25], color: "#C62828",
    position: [2.3, 2.32, -2.25] },
  // Top shelf — scoubidous (thin cylinders)
  { type: "cylinder", radius: 0.01, height: 0.18, segments: 5,
    color: "#FF4444", position: [1.9, 2.26, -2.2], rotation: [0, 0, 0.2] },
  { type: "cylinder", radius: 0.01, height: 0.16, segments: 5,
    color: "#44FF44", position: [1.95, 2.25, -2.2], rotation: [0, 0, -0.15] },
  { type: "cylinder", radius: 0.01, height: 0.2, segments: 5,
    color: "#4488FF", position: [2.0, 2.27, -2.2], rotation: [0, 0, 0.1] },
  // Middle shelf — books
  { type: "box", size: [0.06, 0.15, 0.12], color: "#C62828",
    position: [1.5, 1.85, -2.3] },
  { type: "box", size: [0.05, 0.13, 0.1], color: "#1565C0",
    position: [1.56, 1.84, -2.3] },
  { type: "box", size: [0.07, 0.16, 0.12], color: "#F57C00",
    position: [1.63, 1.85, -2.3] },
  { type: "box", size: [0.04, 0.12, 0.1], color: "#7B1FA2",
    position: [1.7, 1.83, -2.3] },
  { type: "box", size: [0.06, 0.14, 0.11], color: "#2E7D32",
    position: [1.76, 1.84, -2.3] },
];

// Floor objects — real 3D low-poly items
export const FLOOR_OBJECTS = [
  // Billes — low-poly spheres scattered on rug
  { type: "sphere", radius: 0.055, segments: 6, color: "#1E90FF",
    position: [-1.5, 0.055, 0.55] },
  { type: "sphere", radius: 0.045, segments: 6, color: "#FF6347",
    position: [-1.35, 0.045, 0.48] },
  { type: "sphere", radius: 0.065, segments: 6, color: "#6A40B0",
    position: [-1.45, 0.065, 0.4] },
  { type: "sphere", radius: 0.035, segments: 6, color: "#228B22",
    position: [-1.3, 0.035, 0.6] },
  { type: "sphere", radius: 0.04, segments: 6, color: "#FFD700",
    position: [-1.55, 0.04, 0.62] },

  // Beyblades — flat cylinders with accent ring
  { type: "cylinder", radius: 0.1, height: 0.04, segments: 8,
    color: "#3B82F6", position: [-2.1, 0.02, 0.75] },
  { type: "cylinder", radius: 0.04, height: 0.05, segments: 8,
    color: "#1D4ED8", position: [-2.1, 0.025, 0.75] },
  { type: "cylinder", radius: 0.08, height: 0.035, segments: 8,
    color: "#EF4444", position: [-1.9, 0.018, 0.88] },
  { type: "cylinder", radius: 0.03, height: 0.045, segments: 8,
    color: "#B91C1C", position: [-1.9, 0.023, 0.88] },

  // Panini album — flat box angled on floor
  { type: "box", size: [0.22, 0.02, 0.16], color: "#DAA520",
    position: [-1.8, 0.01, 0.2], rotation: [0, 0.15, 0] },

  // Pâte à prout — squished blob
  { type: "sphere", radius: 0.08, segments: 6, color: "#AB47BC",
    position: [-1.0, 0.04, 0.7], scale: [1, 0.45, 1] },

  // Sous le lit indicator — small dark zone
  { type: "box", size: [0.6, 0.005, 0.2], color: "#0a0612",
    position: [0.6, 0.005, -0.2] },
];

// Interactive hitbox zones — match ROOM_ITEMS ids from chambreItems.js
export const HITBOXES = [
  { id: "fenetre",     position: [-1.8, 2.0, -2.40],  size: [1.2, 1.4] },
  { id: "lego",        position: [1.55, 2.26, -2.1],  size: [0.45, 0.25] },
  { id: "jeuxSociete", position: [2.3, 2.26, -2.1],   size: [0.45, 0.25] },
  { id: "scoubidous",  position: [1.95, 2.26, -2.1],  size: [0.3, 0.25] },
  { id: "couette",     position: [0.6, 0.55, -1.3],   size: [1.6, 0.8], isFloor: true },
  { id: "peluches",    position: [1.3, 0.65, -2.0],   size: [0.6, 0.3] },
  { id: "lampe",       position: [-0.7, 0.87, -1.7],  size: [0.25, 0.35] },
  { id: "tamagotchi",  position: [-0.52, 0.63, -1.7],size: [0.12, 0.15] },
  { id: "reveil",      position: [-0.88, 0.61, -1.65],size: [0.15, 0.1] },
  { id: "journal",     position: [-0.55, 0.62, -1.78],size: [0.12, 0.13] },
  { id: "radio",       position: [-0.7, 0.61, -1.6], size: [0.18, 0.12] },
  { id: "panini",      position: [-1.8, 0.02, 0.2],   size: [0.35, 0.25], isFloor: true },
  { id: "pateAProut",  position: [-1.0, 0.05, 0.7],   size: [0.25, 0.2], isFloor: true },
  { id: "billes",      position: [-1.42, 0.06, 0.5],  size: [0.45, 0.35], isFloor: true },
  { id: "beyblade",    position: [-2.0, 0.03, 0.82],  size: [0.45, 0.35], isFloor: true },
  { id: "sousLelit",   position: [0.6, 0.01, -0.2],   size: [0.65, 0.25], isFloor: true },
];

// Lighting presets
export const LIGHTING = {
  lampOn: {
    ambient: { intensity: 0.7, color: "#FFF5E6" },
    lamp: { intensity: 1.5, color: "#FFE082", position: [-0.7, 1.3, -1.8] },
    window: { intensity: 0.6, color: "#87CEEB", position: [-1.8, 2.5, -1.0] },
  },
  lampOff: {
    ambient: { intensity: 0.18, color: "#1a1050" },
    moon: { intensity: 0.4, color: "#6666AA", position: [-1.8, 2.5, -1.0] },
    stars: { intensity: 0.12, color: "#96FF96", position: [1.8, 3.0, -2.0] },
  },
};
