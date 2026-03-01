import { useState, useEffect, useRef } from "react";
import { loadState, saveState } from "../../../../utils/storage";
import { ALL_STICKER_NAMES } from "../../../../data/paniniAlbum";

export default function usePanini(activeItem) {
  const [paniniPage, setPaniniPage] = useState(0);
  const [collectedStickers, setCollectedStickers] = useState(() => loadState('panini_collected', []));
  const [newStickers, setNewStickers] = useState([]);
  const paniniDiscovered = useRef(false);

  useEffect(() => {
    if (activeItem !== "panini" || paniniDiscovered.current) return;
    paniniDiscovered.current = true;
    const missing = ALL_STICKER_NAMES.filter(n => !collectedStickers.includes(n));
    if (missing.length === 0) return;
    const count = Math.min(missing.length, 1 + Math.floor(Math.random() * 3));
    const shuffled = [...missing].sort(() => Math.random() - 0.5);
    const discovered = shuffled.slice(0, count);
    const updated = [...collectedStickers, ...discovered];
    setCollectedStickers(updated);
    setNewStickers(discovered);
    saveState('panini_collected', updated);
  }, [activeItem, collectedStickers]);

  return { paniniPage, setPaniniPage, collectedStickers, newStickers };
}
