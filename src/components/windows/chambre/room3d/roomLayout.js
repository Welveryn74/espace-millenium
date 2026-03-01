// 3D room layout data — positions, sizes, textures for all furniture and objects
// Coordinates: X = left/right, Y = up/down, Z = front/back
// Room dimensions: 6 wide × 3.5 tall × 5 deep, camera at (0, 1.5, 2.0)

export const ROOM = {
  width: 6,
  height: 3.5,
  depth: 5,
  walls: "#362952",
  floor: "#6B4830",
  ceiling: "#2E2245",
  baseboard: "#3E2518",
};

// Sprites = 2D planes textured with existing PNG/SVG images
export const SPRITES = [
  {
    id: "fenetre",
    texDay: "/images/chambre/room/window-day.svg",
    texNight: "/images/chambre/room/window-night.svg",
    position: [-1.8, 2.0, -2.45],
    size: [1.2, 1.4],
    lampSwitch: true, // uses different texture based on lampOn
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
    glowOnDark: true, // visible mostly when lamp off
  },
  {
    id: "etagere",
    tex: "/images/chambre/room/shelf.png",
    position: [2.0, 1.8, -2.2],
    size: [1.8, 0.9],
  },
  {
    id: "lit",
    tex: "/images/chambre/room/bed.png",
    position: [0.8, 0.7, -1.5],
    size: [3.2, 2.2],
  },
  {
    id: "tableDenuit",
    tex: "/images/chambre/room/nightstand.png",
    position: [-1.0, 0.6, -1.3],
    size: [0.8, 0.8],
  },
  {
    id: "lampSprite",
    texOn: "/images/chambre/room/lamp-on.png",
    texOff: "/images/chambre/room/lamp-off.png",
    position: [-0.9, 1.1, -1.2],
    size: [0.35, 0.45],
    lampSwitch: true,
  },
  {
    id: "tapis",
    tex: "/images/chambre/room/rug.png",
    position: [-1.5, 0.01, 0.5],
    size: [2.0, 1.3],
    rotation: [-Math.PI / 2, 0, 0], // flat on floor
  },
];

// Interactive hitbox zones — match ROOM_ITEMS ids from chambreItems.js
export const HITBOXES = [
  { id: "fenetre",     position: [-1.8, 2.0, -2.40],  size: [1.2, 1.4] },
  { id: "lego",        position: [1.4, 2.1, -2.15],   size: [0.6, 0.35] },
  { id: "jeuxSociete", position: [2.2, 2.1, -2.15],   size: [0.5, 0.35] },
  { id: "scoubidous",  position: [1.8, 1.65, -2.15],  size: [0.5, 0.3] },
  { id: "couette",     position: [0.8, 0.55, -1.5],   size: [2.2, 0.9] },
  { id: "peluches",    position: [1.8, 1.05, -1.5],   size: [0.8, 0.4] },
  { id: "lampe",       position: [-0.9, 1.1, -1.15],  size: [0.35, 0.45] },
  { id: "tamagotchi",  position: [-0.7, 0.85, -1.15], size: [0.2, 0.25] },
  { id: "reveil",      position: [-1.15, 0.75, -1.15],size: [0.25, 0.18] },
  { id: "journal",     position: [-0.55, 0.85, -1.15],size: [0.2, 0.25] },
  { id: "radio",       position: [-0.9, 0.72, -1.15], size: [0.25, 0.18] },
  { id: "panini",      position: [-1.8, 0.01, 0.2],   size: [0.4, 0.3] },
  { id: "pateAProut",  position: [-1.0, 0.01, 0.7],   size: [0.3, 0.2] },
  { id: "billes",      position: [-1.4, 0.01, 0.5],   size: [0.5, 0.3] },
  { id: "beyblade",    position: [-2.0, 0.01, 0.8],   size: [0.5, 0.35] },
  { id: "sousLelit",   position: [0.8, 0.01, -0.3],   size: [0.7, 0.25] },
];

// Small 3D objects (real geometry, not sprites) — PS1 low-poly style
export const OBJECTS_3D = [
  // Billes — low-poly spheres
  { type: "sphere", radius: 0.06, segments: 6, color: "#1E90FF",
    position: [-1.5, 0.07, 0.55] },
  { type: "sphere", radius: 0.05, segments: 6, color: "#FF6347",
    position: [-1.35, 0.06, 0.5] },
  { type: "sphere", radius: 0.07, segments: 6, color: "#6A40B0",
    position: [-1.45, 0.08, 0.45] },
  { type: "sphere", radius: 0.035, segments: 6, color: "#228B22",
    position: [-1.3, 0.045, 0.6] },

  // Beyblades — flat cylinders
  { type: "cylinder", radius: 0.1, height: 0.04, segments: 8,
    color: "#3B82F6", position: [-2.1, 0.03, 0.75] },
  { type: "cylinder", radius: 0.08, height: 0.035, segments: 8,
    color: "#EF4444", position: [-1.9, 0.028, 0.85] },

  // Tamagotchi — small rounded box
  { type: "box", size: [0.08, 0.11, 0.03], color: "#42A5F5",
    position: [-0.7, 0.88, -1.25] },

  // Réveil — small dark box
  { type: "box", size: [0.12, 0.07, 0.04], color: "#1a1a1a",
    position: [-1.15, 0.78, -1.25] },

  // Radio — brown box
  { type: "box", size: [0.12, 0.07, 0.06], color: "#8B7355",
    position: [-0.9, 0.75, -1.25] },

  // Panini album — flat box on floor
  { type: "box", size: [0.2, 0.02, 0.15], color: "#DAA520",
    position: [-1.8, 0.02, 0.2], rotation: [0, 0.1, 0] },

  // Pâte à prout — squished sphere
  { type: "sphere", radius: 0.08, segments: 6, color: "#AB47BC",
    position: [-1.0, 0.05, 0.7], scale: [1, 0.5, 1] },

  // Journal — small book
  { type: "box", size: [0.07, 0.1, 0.02], color: "#8B4513",
    position: [-0.55, 0.88, -1.25] },
];

// Lighting presets
export const LIGHTING = {
  lampOn: {
    ambient: { intensity: 0.4, color: "#FFF5E6" },
    lamp: { intensity: 1.2, color: "#FFE082", position: [-0.9, 1.3, -1.2] },
    window: { intensity: 0.3, color: "#87CEEB", position: [-1.8, 2.5, -1.0] },
  },
  lampOff: {
    ambient: { intensity: 0.08, color: "#1a1050" },
    moon: { intensity: 0.2, color: "#6666AA", position: [-1.8, 2.5, -1.0] },
    stars: { intensity: 0.05, color: "#96FF96", position: [1.8, 3.0, -2.0] },
  },
};
