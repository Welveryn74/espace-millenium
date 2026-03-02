// VHS effect configuration — constants and presets

export const VHS_DEFAULTS = {
  trackingIntensity: 0.5,
  scanLineCount: 240,
  warmth: 0.12,
  bloomIntensity: 0.15,
  noiseOpacity: 0.3,
  vignetteOffset: 0.4,
  vignetteDarkness: 0.7,
  chromaticOffset: [0.002, 0.001],
};

export const VHS_PRESETS = {
  default: { ...VHS_DEFAULTS },
  intense: {
    ...VHS_DEFAULTS,
    trackingIntensity: 0.9,
    noiseOpacity: 0.5,
    warmth: 0.18,
  },
  subtle: {
    ...VHS_DEFAULTS,
    trackingIntensity: 0.25,
    noiseOpacity: 0.15,
    warmth: 0.08,
    bloomIntensity: 0.1,
  },
};
