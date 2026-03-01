import { useState } from "react";
import { loadState, saveState } from "../../../../utils/storage";
import { SOUS_LE_LIT } from "../../../../data/chambreItems";

export default function useSousLeLit() {
  const [sousLeLitFound, setSousLeLitFound] = useState(() => loadState('sous_le_lit', []));
  const [sousLeLitSearching, setSousLeLitSearching] = useState(false);
  const [sousLeLitLast, setSousLeLitLast] = useState(null);

  const doSearch = () => {
    if (sousLeLitSearching) return;
    const remaining = SOUS_LE_LIT.filter(o => !sousLeLitFound.includes(o.id));
    if (remaining.length === 0) return;
    setSousLeLitSearching(true);
    setSousLeLitLast(null);
    setTimeout(() => {
      const item = remaining[Math.floor(Math.random() * remaining.length)];
      const updated = [...sousLeLitFound, item.id];
      setSousLeLitFound(updated);
      saveState('sous_le_lit', updated);
      setSousLeLitLast(item);
      setSousLeLitSearching(false);
    }, 500);
  };

  return { sousLeLitFound, setSousLeLitFound, sousLeLitSearching, sousLeLitLast, doSearch };
}
