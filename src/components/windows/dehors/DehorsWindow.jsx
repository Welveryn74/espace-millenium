import { useState, useCallback } from "react";
import Win from "../../Win";
import { LIEUX } from "../../../data/dehorsItems";
import DehorsQuartierSVG from "./DehorsQuartierSVG";
import DehorsDetailRouter from "./DehorsDetailRouter";

export default function DehorsWindow({ onClose, onMinimize, zIndex, onFocus }) {
  const [activeLieu, setActiveLieu] = useState(null);
  const [hoveredLieu, setHoveredLieu] = useState(null);

  const goBack = useCallback(() => setActiveLieu(null), []);

  const titleText = activeLieu
    ? `Dehors — ${LIEUX.find((l) => l.id === activeLieu)?.label || ""}`
    : "Dehors !";

  return (
    <Win
      title={titleText}
      onClose={onClose}
      onMinimize={onMinimize}
      width={680}
      height={540}
      zIndex={zIndex}
      onFocus={onFocus}
      initialPos={{ x: 140, y: 50 }}
      color="#44AA44"
    >
      <div style={{
        height: "100%",
        background: "linear-gradient(180deg, #87CEEB 0%, #E0F0FF 40%, #90EE90 60%, #228B22 100%)",
        overflow: "hidden",
        position: "relative",
      }}>
        {activeLieu === null ? (
          <DehorsQuartierSVG
            setActiveLieu={setActiveLieu}
            hoveredLieu={hoveredLieu}
            setHoveredLieu={setHoveredLieu}
          />
        ) : (
          <DehorsDetailRouter
            activeLieu={activeLieu}
            goBack={goBack}
          />
        )}
      </div>
    </Win>
  );
}
