import { useState, useEffect, useCallback } from "react";
import { loadState, saveState, clearState } from "../../../../utils/storage";

const TAMA_TICK_MS = 10_000;
const TAMA_MAX = 5;
const TAMA_OFFLINE_DECAY_MS = 2 * 60 * 60 * 1000;
const TAMA_MAX_OFFLINE_MS = 24 * 60 * 60 * 1000;

function loadTamaState() {
  const saved = loadState("tamagotchi", null);
  if (!saved || !saved.lastSaved) return { faim: 4, bonheur: 4, proprete: 4 };
  const elapsed = Math.min(Date.now() - saved.lastSaved, TAMA_MAX_OFFLINE_MS);
  const decay = Math.floor(elapsed / TAMA_OFFLINE_DECAY_MS);
  return {
    faim: Math.max(0, (saved.faim ?? 4) - decay),
    bonheur: Math.max(0, (saved.bonheur ?? 4) - decay),
    proprete: Math.max(0, (saved.proprete ?? 4) - decay),
  };
}

export default function useTamagotchi() {
  const [tama, setTama] = useState(loadTamaState);
  const [tamaAction, setTamaAction] = useState(null);

  useEffect(() => {
    saveState('tamagotchi', { ...tama, lastSaved: Date.now() });
  }, [tama]);

  useEffect(() => {
    const id = setInterval(() => {
      setTama((t) => ({
        faim: Math.max(0, t.faim - 1),
        bonheur: Math.max(0, t.bonheur - 1),
        proprete: Math.max(0, t.proprete - 1),
      }));
    }, TAMA_TICK_MS);
    return () => clearInterval(id);
  }, []);

  const tamaDo = useCallback((action) => {
    setTama((t) => {
      if (action === "nourrir") return { ...t, faim: Math.min(TAMA_MAX, t.faim + 2) };
      if (action === "jouer") return { ...t, bonheur: Math.min(TAMA_MAX, t.bonheur + 2) };
      if (action === "nettoyer") return { ...t, proprete: Math.min(TAMA_MAX, t.proprete + 2) };
      return t;
    });
    setTamaAction(action);
    setTimeout(() => setTamaAction(null), 800);
  }, []);

  const tamaReset = useCallback(() => {
    clearState('tamagotchi');
    setTama({ faim: 4, bonheur: 4, proprete: 4 });
  }, []);

  const tamaTotal = tama.faim + tama.bonheur + tama.proprete;
  const tamaNeglected = tamaTotal === 0;
  const tamaMood = tamaNeglected ? "💀" : tamaTotal >= 12 ? "😊" : tamaTotal >= 6 ? "😐" : "😢";

  return { tama, tamaDo, tamaReset, tamaAction, tamaTotal, tamaNeglected, tamaMood, TAMA_MAX };
}
