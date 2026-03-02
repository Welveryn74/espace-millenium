import { forwardRef, useMemo } from "react";
import VHSColorGrading from "./VHSColorGrading";

const VHSColorGradingPass = forwardRef(function VHSColorGradingPass(
  { warmth },
  ref,
) {
  const effect = useMemo(
    () => new VHSColorGrading({ warmth }),
    [warmth],
  );
  return <primitive ref={ref} object={effect} dispose={null} />;
});

export default VHSColorGradingPass;
