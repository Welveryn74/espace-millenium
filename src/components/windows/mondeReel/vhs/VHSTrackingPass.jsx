import { forwardRef, useMemo } from "react";
import VHSTrackingEffect from "./VHSTrackingEffect";

const VHSTrackingPass = forwardRef(function VHSTrackingPass(
  { trackingIntensity, scanLineCount },
  ref,
) {
  const effect = useMemo(
    () => new VHSTrackingEffect({ trackingIntensity, scanLineCount }),
    [trackingIntensity, scanLineCount],
  );
  return <primitive ref={ref} object={effect} dispose={null} />;
});

export default VHSTrackingPass;
