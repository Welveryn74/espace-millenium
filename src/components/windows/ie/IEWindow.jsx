import { useState, useEffect, useRef } from "react";
import Win from "../../Win";
import IEToolbar from "./IEToolbar";
import IEStatusBar from "./IEStatusBar";
import IEPageRouter from "./IEPageRouter";
import { useIENavigation, resolveUrl } from "./hooks/useIENavigation";
import { useWaybackLookup } from "./hooks/useWaybackLookup";
import { playModemSound } from "../../../utils/playModemSound";

export default function IEWindow({ onClose, onMinimize, zIndex, onFocus, onBSOD, initialUrl }) {
  const nav = useIENavigation(initialUrl || "wanadoo.fr");
  const wayback = useWaybackLookup();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const audioCtxRef = useRef(null);
  const lastInitialUrlRef = useRef(initialUrl);

  // Navigate to initialUrl when it changes (e.g. from Skyblog link)
  useEffect(() => {
    if (initialUrl && initialUrl !== lastInitialUrlRef.current) {
      lastInitialUrlRef.current = initialUrl;
      nav.navigateTo(initialUrl);
    }
  }, [initialUrl]);

  // Trigger wayback lookup for unknown URLs
  useEffect(() => {
    if (!nav.loading && nav.currentUrl && !resolveUrl(nav.currentUrl)) {
      wayback.checkWayback(nav.currentUrl);
      nav.setStatusText("Recherche dans les archives du Web...");
      // Play modem sound
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        playModemSound(audioCtxRef.current);
      } catch {}
    } else if (!nav.loading && nav.currentUrl && resolveUrl(nav.currentUrl)) {
      wayback.reset();
    }
  }, [nav.currentUrl, nav.loading]);

  // Update status based on wayback state
  useEffect(() => {
    if (wayback.state === "found") {
      nav.setStatusText("Chargement de l'archive...");
    } else if (wayback.state === "not_found") {
      nav.setStatusText("Page introuvable. Aucune archive disponible.");
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
          navigateTo={nav.navigateTo}
          currentUrl={nav.currentUrl}
          addressInput={nav.addressInput}
          setAddressInput={nav.setAddressInput}
          handleAddressSubmit={nav.handleAddressSubmit}
          showFavorites={nav.showFavorites}
          setShowFavorites={nav.setShowFavorites}
          loading={nav.loading}
        />

        <div ref={nav.contentRef} style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
          <IEPageRouter
            loading={nav.loading}
            currentUrl={nav.currentUrl}
            navigateTo={nav.navigateTo}
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
