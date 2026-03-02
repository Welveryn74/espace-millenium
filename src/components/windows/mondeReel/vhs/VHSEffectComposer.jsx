import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";
import { useMemo } from "react";
import VHSTrackingPass from "./VHSTrackingPass";
import VHSColorGradingPass from "./VHSColorGradingPass";
import { VHS_DEFAULTS } from "./vhsConfig";

export default function VHSEffectComposer({ preset = VHS_DEFAULTS }) {
  const chromaticOffset = useMemo(
    () => new Vector2(preset.chromaticOffset[0], preset.chromaticOffset[1]),
    [preset.chromaticOffset],
  );

  return (
    <EffectComposer multisampling={0}>
      {/* 1. Soft bloom glow — simulates tube TV light bleed */}
      <Bloom
        intensity={preset.bloomIntensity}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.4}
        mipmapBlur
      />

      {/* 2. Chromatic aberration — RGB fringing */}
      <ChromaticAberration
        offset={chromaticOffset}
        radialModulation={false}
        modulationOffset={0}
      />

      {/* 3. Custom VHS tracking: scan lines + tracking bar + jitter */}
      <VHSTrackingPass
        trackingIntensity={preset.trackingIntensity}
        scanLineCount={preset.scanLineCount}
      />

      {/* 4. Custom VHS color grading: warm tones, sepia, black crush */}
      <VHSColorGradingPass warmth={preset.warmth} />

      {/* 5. Film grain noise */}
      <Noise
        premultiply
        blendFunction={BlendFunction.SOFT_LIGHT}
        opacity={preset.noiseOpacity}
      />

      {/* 6. Vignette — dark edges, classic camcorder look */}
      <Vignette
        offset={preset.vignetteOffset}
        darkness={preset.vignetteDarkness}
      />
    </EffectComposer>
  );
}
