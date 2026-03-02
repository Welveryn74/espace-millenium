// VHS effect configuration — constants and presets

export const VHS_DEFAULTS = {
  trackingIntensity: 0.2,
  scanLineCount: 240,
  warmth: 0.06,
  bloomIntensity: 0.08,
  noiseOpacity: 0.12,
  vignetteOffset: 0.35,
  vignetteDarkness: 0.5,
  chromaticOffset: [0.0008, 0.0004],
};

export const VHS_PRESETS = {
  default: { ...VHS_DEFAULTS },
  intense: {
    ...VHS_DEFAULTS,
    trackingIntensity: 0.5,
    noiseOpacity: 0.3,
    warmth: 0.12,
  },
  subtle: {
    ...VHS_DEFAULTS,
    trackingIntensity: 0.1,
    noiseOpacity: 0.06,
    warmth: 0.03,
    bloomIntensity: 0.05,
  },
};
