import { useState, useCallback } from "react";
import { loadState, saveState } from "../../../../utils/storage";
import { CARDS, RARITY_WEIGHTS } from "../../../../data/cardsCollection";

function pickRarity() {
  const r = Math.random() * 100;
  if (r < RARITY_WEIGHTS.UR) return "UR";
  if (r < RARITY_WEIGHTS.UR + RARITY_WEIGHTS.R) return "R";
  if (r < RARITY_WEIGHTS.UR + RARITY_WEIGHTS.R + RARITY_WEIGHTS.U) return "U";
  return "C";
}

function pickCard(franchise) {
  const rarity = pickRarity();
  const pool = CARDS[franchise].filter((c) => c.rarity === rarity);
  if (pool.length === 0) return CARDS[franchise][Math.floor(Math.random() * CARDS[franchise].length)];
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function useCards() {
  const [collected, setCollected] = useState(() => loadState("cards_collected", {}));
  const [boosterOpen, setBoosterOpen] = useState(false);
  const [boosterCards, setBoosterCards] = useState([]);
  const [revealIdx, setRevealIdx] = useState(-1);

  const openBooster = useCallback((franchise) => {
    const cards = Array.from({ length: 5 }, () => pickCard(franchise));
    setBoosterCards(cards.map((c) => ({ ...c, franchise, revealed: false })));
    setBoosterOpen(true);
    setRevealIdx(-1);
  }, []);

  const revealNext = useCallback(() => {
    setRevealIdx((idx) => {
      const next = idx + 1;
      if (next < boosterCards.length) {
        const card = boosterCards[next];
        const key = `${card.franchise}_${card.id}`;
        setCollected((prev) => {
          const updated = { ...prev, [key]: (prev[key] || 0) + 1 };
          saveState("cards_collected", updated);
          return updated;
        });
      }
      return next;
    });
  }, [boosterCards]);

  const closeBooster = useCallback(() => {
    setBoosterOpen(false);
    setBoosterCards([]);
    setRevealIdx(-1);
  }, []);

  const tradeDoublon = useCallback((franchise) => {
    // Find a doublon to trade
    const doublons = Object.entries(collected).filter(
      ([key, count]) => key.startsWith(franchise) && count > 1
    );
    if (doublons.length === 0) return null;

    const [doublonKey] = doublons[Math.floor(Math.random() * doublons.length)];
    const newCard = pickCard(franchise);
    const newKey = `${franchise}_${newCard.id}`;

    setCollected((prev) => {
      const updated = { ...prev };
      updated[doublonKey] = Math.max(0, (updated[doublonKey] || 0) - 1);
      if (updated[doublonKey] === 0) delete updated[doublonKey];
      updated[newKey] = (updated[newKey] || 0) + 1;
      saveState("cards_collected", updated);
      return updated;
    });

    return newCard;
  }, [collected]);

  const getCollectionStats = useCallback((franchise) => {
    const total = CARDS[franchise].length;
    const owned = CARDS[franchise].filter(
      (c) => (collected[`${franchise}_${c.id}`] || 0) > 0
    ).length;
    return { total, owned };
  }, [collected]);

  return {
    collected,
    boosterOpen,
    boosterCards,
    revealIdx,
    openBooster,
    revealNext,
    closeBooster,
    tradeDoublon,
    getCollectionStats,
  };
}
