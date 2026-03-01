// AABB collision data for room furniture (XZ plane)
// Each collider: { minX, maxX, minZ, maxZ }
// Derived from FURNITURE positions/sizes in roomLayout.js + padding

export const ROOM_BOUNDS = {
  minX: -2.75, // -ROOM.width/2 + player radius (0.25)
  maxX: 2.75,
  minZ: -2.25, // -ROOM.depth/2 + player radius
  maxZ: 2.25,
};

export const FURNITURE_COLLIDERS = [
  // Lit — frame [1.8 x 2.2] centré sur (0.6, -1.3) + padding 0.1
  {
    minX: 0.6 - 1.8 / 2 - 0.1,  // -0.4
    maxX: 0.6 + 1.8 / 2 + 0.1,  //  1.6
    minZ: -1.3 - 2.2 / 2 - 0.1, // -2.5
    maxZ: -1.3 + 2.2 / 2 + 0.1, // -0.1
  },
  // Table de nuit — [0.5 x 0.4] centré sur (-0.7, -1.8) + padding 0.05
  {
    minX: -0.7 - 0.5 / 2 - 0.05, // -1.0
    maxX: -0.7 + 0.5 / 2 + 0.05, // -0.4
    minZ: -1.8 - 0.4 / 2 - 0.05, // -2.05
    maxZ: -1.8 + 0.4 / 2 + 0.05, // -1.55
  },
  // Étagère — bande le long du mur arrière droit
  {
    minX: 1.15,
    maxX: 2.85,
    minZ: -2.55,
    maxZ: -2.05,
  },
];
