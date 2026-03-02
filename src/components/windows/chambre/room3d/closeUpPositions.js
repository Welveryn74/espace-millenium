// Close-up camera positions for each interactive object.
// cam = where the camera moves to, lookAt = what it points at.
// Calculated from HITBOXES positions: camera ~0.8u in front of object, at its height.

export const CLOSE_UPS = {
  fenetre:     { cam: [-1.8, 2.0, -1.5],  lookAt: [-1.8, 2.0, -2.45] },
  lego:        { cam: [1.55, 2.0, -1.2],  lookAt: [1.55, 2.26, -2.25] },
  jeuxSociete: { cam: [2.3, 2.0, -1.2],   lookAt: [2.3, 2.26, -2.25] },
  scoubidous:  { cam: [1.95, 2.0, -1.2],  lookAt: [1.95, 2.26, -2.25] },
  couette:     { cam: [0.6, 1.2, 0.0],    lookAt: [0.6, 0.5, -1.3] },
  peluches:    { cam: [1.3, 1.2, -1.0],   lookAt: [1.3, 0.65, -2.0] },
  tamagotchi:  { cam: [-0.52, 1.0, -0.8], lookAt: [-0.52, 0.63, -1.75] },
  reveil:      { cam: [-0.88, 1.0, -0.8], lookAt: [-0.88, 0.61, -1.65] },
  journal:     { cam: [-0.55, 1.0, -0.8], lookAt: [-0.55, 0.62, -1.78] },
  radio:       { cam: [-0.7, 1.0, -0.7],  lookAt: [-0.7, 0.61, -1.6] },
  panini:      { cam: [-1.8, 0.8, 1.0],   lookAt: [-1.8, 0.02, 0.2] },
  pateAProut:  { cam: [-1.0, 0.8, 1.4],   lookAt: [-1.0, 0.05, 0.7] },
  billes:      { cam: [-1.42, 0.8, 1.3],  lookAt: [-1.42, 0.06, 0.5] },
  beyblade:    { cam: [-2.0, 0.8, 1.6],   lookAt: [-2.0, 0.03, 0.82] },
  sousLelit:   { cam: [0.6, 0.8, 0.6],    lookAt: [0.6, 0.01, -0.2] },
  // New items
  cartes:      { cam: [1.55, 2.0, -1.2],  lookAt: [1.55, 1.85, -2.2] },
  lampeALave:  { cam: [-0.9, 1.0, -0.8],  lookAt: [-0.9, 0.75, -1.85] },
  telephone:   { cam: [-0.55, 1.0, -0.8], lookAt: [-0.55, 0.6, -1.68] },
  dinos:       { cam: [2.5, 2.0, -1.2],   lookAt: [2.5, 1.85, -2.2] },
  posters:     { cam: [0.2, 2.2, -1.2],   lookAt: [0.2, 2.2, -2.4] },
  diddl:       { cam: [-1.2, 0.8, 1.1],   lookAt: [-1.2, 0.01, 0.3] },
};
