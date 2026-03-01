import { useState, useRef } from "react";
import { playClick } from "../../../../utils/uiSounds";

const KNOWN_URLS = [
  "wanadoo.fr", "google.fr", "perso.wanadoo.fr/~darkangel",
  "encarta.msn.com", "forum.jeuxvideo.com", "kazaa.com", "dollz.fr",
  "about:blank",
];

export function resolveUrl(raw) {
  const u = raw.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/+$/, "");
  return KNOWN_URLS.includes(u) ? u : null;
}

function cleanUrl(raw) {
  return raw.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/+$/, "");
}

export function useIENavigation(initialUrl = "wanadoo.fr") {
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [history, setHistory] = useState([initialUrl]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addressInput, setAddressInput] = useState(initialUrl);
  const [statusText, setStatusText] = useState("Terminé.");
  const [showFavorites, setShowFavorites] = useState(false);
  const contentRef = useRef(null);

  const navigateTo = (url) => {
    const clean = cleanUrl(url);
    playClick();
    setLoading(true);
    setAddressInput(clean);
    setStatusText(`Ouverture de la page http://${clean}...`);
    setShowFavorites(false);
    setTimeout(() => {
      const newHistory = [...history.slice(0, historyIdx + 1), clean];
      setHistory(newHistory);
      setHistoryIdx(newHistory.length - 1);
      setCurrentUrl(clean);
      setLoading(false);
      if (resolveUrl(clean)) {
        setStatusText("Terminé.");
      }
      if (contentRef.current) contentRef.current.scrollTop = 0;
    }, 300 + Math.random() * 500);
  };

  const goBack = () => {
    if (historyIdx > 0) {
      const idx = historyIdx - 1;
      setHistoryIdx(idx);
      const url = history[idx];
      setCurrentUrl(url);
      setAddressInput(url);
      if (contentRef.current) contentRef.current.scrollTop = 0;
    }
  };

  const goForward = () => {
    if (historyIdx < history.length - 1) {
      const idx = historyIdx + 1;
      setHistoryIdx(idx);
      const url = history[idx];
      setCurrentUrl(url);
      setAddressInput(url);
      if (contentRef.current) contentRef.current.scrollTop = 0;
    }
  };

  const handleAddressSubmit = () => {
    const clean = cleanUrl(addressInput);
    if (clean && clean !== currentUrl) {
      navigateTo(clean);
    }
  };

  return {
    currentUrl,
    history,
    historyIdx,
    loading,
    addressInput,
    setAddressInput,
    statusText,
    setStatusText,
    showFavorites,
    setShowFavorites,
    contentRef,
    navigateTo,
    goBack,
    goForward,
    handleAddressSubmit,
  };
}
