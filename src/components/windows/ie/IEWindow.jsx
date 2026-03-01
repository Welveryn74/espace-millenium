import { useState, useEffect, useRef, useCallback } from "react";
import Win from "../../Win";
import IEToolbar from "./IEToolbar";
import IEStatusBar from "./IEStatusBar";
import IEPageRouter from "./IEPageRouter";
import { useIENavigation, resolveUrl, cleanUrl } from "./hooks/useIENavigation";
import { useWaybackLookup, isPrecached } from "./hooks/useWaybackLookup";
import { playModemSound } from "../../../utils/playModemSound";

export default function IEWindow({ onClose, onMinimize, zIndex, onFocus, onBSOD, initialUrl }) {
  const nav = useIENavigation(initialUrl || "wanadoo.fr");
  const wayback = useWaybackLookup();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const audioCtxRef = useRef(null);
  const lastInitialUrlRef = useRef(initialUrl);

  const playModem = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      playModemSound(audioCtxRef.current);
    } catch {}
  }, []);

  // Wrap navigateTo to start wayback lookup IMMEDIATELY (parallel to simulated delay)
  const navigateTo = useCallback((url) => {
    const clean = url.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/+$/, "");
    if (!resolveUrl(clean)) {
      // Unknown URL — start wayback check NOW, don't wait for loading to finish
      wayback.checkWayback(clean);
      // Modem sound only for real lookups (not pre-cached favorites)
      if (!isPrecached(clean)) playModem();
    } else {
      wayback.reset();
    }
    nav.navigateTo(url);
  }, [nav.navigateTo, wayback.checkWayback, wayback.reset, playModem]);

  // Address bar submit — uses the wrapper navigateTo
  const handleAddressSubmit = useCallback(() => {
    const clean = cleanUrl(nav.addressInput);
    if (clean && clean !== nav.currentUrl) {
      navigateTo(clean);
    }
  }, [nav.addressInput, nav.currentUrl, navigateTo]);

  // Navigate to initialUrl when it changes (e.g. from Skyblog link)
  useEffect(() => {
    if (initialUrl && initialUrl !== lastInitialUrlRef.current) {
      lastInitialUrlRef.current = initialUrl;
      navigateTo(initialUrl);
    }
  }, [initialUrl]);

  // Handle back/forward to unknown URLs (these bypass navigateTo wrapper)
  useEffect(() => {
    if (!nav.loading && nav.currentUrl) {
      if (!resolveUrl(nav.currentUrl)) {
        // Only trigger if wayback isn't already checking/found for this URL
        if (wayback.state === "idle") {
          wayback.checkWayback(nav.currentUrl);
          if (!isPrecached(nav.currentUrl)) playModem();
        }
      } else {
        wayback.reset();
      }
    }
  }, [nav.currentUrl, nav.loading]);

  // Update status based on wayback state
  useEffect(() => {
    switch (wayback.state) {
      case "checking":
        nav.setStatusText("Recherche dans les archives du Web...");
        break;
      case "found":
        nav.setStatusText("Chargement de l'archive...");
        break;
      case "not_found":
        nav.setStatusText("Page introuvable. Aucune archive disponible.");
        break;
    }
  }, [wayback.state]);

  const handleWaybackLoad = () => {
    nav.setStatusText("Terminé.");
  };

  return (
    <Win
      title={`Internet Explorer — ${nav.currentUrl}`}
      onClose={onClose} onMinimize={onMinimize}
      width={720} height={560} zIndex={zIndex} onFocus={onFocus}
      initialPos={{ x: 60, y: 20 }} color="#0055E5"
    >
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <IEToolbar
          historyIdx={nav.historyIdx}
          historyLength={nav.history.length}
          goBack={nav.goBack}
          goForward={nav.goForward}
          navigateTo={navigateTo}
          currentUrl={nav.currentUrl}
          addressInput={nav.addressInput}
          setAddressInput={nav.setAddressInput}
          handleAddressSubmit={handleAddressSubmit}
          showFavorites={nav.showFavorites}
          setShowFavorites={nav.setShowFavorites}
          loading={nav.loading}
        />

        <div ref={nav.contentRef} style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
          <IEPageRouter
            loading={nav.loading}
            currentUrl={nav.currentUrl}
            navigateTo={navigateTo}
            onBSOD={onBSOD}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedArticle={selectedArticle}
            setSelectedArticle={setSelectedArticle}
            waybackState={wayback.state}
            waybackUrl={wayback.archiveUrl}
            onWaybackLoad={handleWaybackLoad}
          />
        </div>

        <IEStatusBar statusText={nav.statusText} />
      </div>
    </Win>
  );
}
