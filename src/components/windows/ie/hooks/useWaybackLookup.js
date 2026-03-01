import { useState, useCallback, useRef } from "react";

const WAYBACK_API = "https://archive.org/wayback/available";

// Sites connus qui existent dans les archives ~2005 — pas besoin d'appel API
const PRECACHED_URLS = new Set([
  "yahoo.com",
  "lycos.com",
  "altavista.com",
  "multimania.lycos.fr",
  "neopets.com",
  "miniclip.com",
  "newgrounds.com",
  "google.fr",
  "google.com",
  // Médias & info FR
  "tf1.fr",
  "lequipe.fr",
  "lemonde.fr",
  "allocine.fr",
  "meteofrance.com",
  // Référence & encyclopédies
  "wikipedia.org",
  "nasa.gov",
  "imdb.com",
  // E-commerce
  "amazon.com",
  "ebay.com",
  "apple.com",
  // Gaming
  "gamefaqs.com",
  "ign.com",
  "gamespot.com",
  // Portails & services
  "mtv.com",
  "msn.com",
  "download.com",
  "caramail.com",
  // Dev
  "w3.org",
  "php.net",
  "mysql.com",
]);

export function isPrecached(url) {
  if (PRECACHED_URLS.has(url)) return true;
  // Match subpaths: google.fr/search?q=... → domain google.fr is precached
  const domain = url.split("/")[0];
  return PRECACHED_URLS.has(domain);
}

function buildTheOldNetUrl(url) {
  return `https://theoldnet.com/get?url=${encodeURIComponent(url)}&year=2005&scripts=false&decode=false`;
}

function buildWaybackDirectUrl(url) {
  // if_ supprime la toolbar Wayback — rendu propre en iframe
  return `https://web.archive.org/web/2005if_/http://${url}`;
}

export function useWaybackLookup() {
  const [state, setState] = useState("idle"); // idle | checking | found | not_found
  const [archiveUrl, setArchiveUrl] = useState(null);
  const [fallbackUrl, setFallbackUrl] = useState(null);
  const cacheRef = useRef({});

  const checkWayback = useCallback(async (url) => {
    // Pre-cached favorites — instant, no API call needed
    if (isPrecached(url)) {
      const iframeUrl = buildTheOldNetUrl(url);
      setArchiveUrl(iframeUrl);
      setFallbackUrl(buildWaybackDirectUrl(url));
      setState("found");
      return;
    }

    const cacheKey = `wayback_${url}`;

    // Check in-memory cache first, then sessionStorage
    let cached = cacheRef.current[cacheKey];
    if (!cached) {
      try {
        const stored = sessionStorage.getItem(cacheKey);
        if (stored) {
          cached = JSON.parse(stored);
          cacheRef.current[cacheKey] = cached;
        }
      } catch {}
    }

    if (cached) {
      if (cached.available) {
        setArchiveUrl(cached.archiveUrl);
        setFallbackUrl(cached.fallbackUrl);
        setState("found");
      } else {
        setArchiveUrl(null);
        setFallbackUrl(null);
        setState("not_found");
      }
      return;
    }

    setState("checking");
    setArchiveUrl(null);
    setFallbackUrl(null);

    try {
      const res = await fetch(
        `${WAYBACK_API}?url=${encodeURIComponent(url)}&timestamp=20050101`
      );
      const data = await res.json();
      const snapshot = data?.archived_snapshots?.closest;

      if (snapshot?.available) {
        // Use TheOldNet for cleaner, faster rendering (strips broken JS)
        const iframeUrl = buildTheOldNetUrl(url);
        const wbUrl = buildWaybackDirectUrl(url);
        const entry = { available: true, archiveUrl: iframeUrl, fallbackUrl: wbUrl };
        cacheRef.current[cacheKey] = entry;
        try { sessionStorage.setItem(cacheKey, JSON.stringify(entry)); } catch {}
        setArchiveUrl(iframeUrl);
        setFallbackUrl(wbUrl);
        setState("found");
      } else {
        const entry = { available: false };
        cacheRef.current[cacheKey] = entry;
        try { sessionStorage.setItem(cacheKey, JSON.stringify(entry)); } catch {}
        setArchiveUrl(null);
        setFallbackUrl(null);
        setState("not_found");
      }
    } catch {
      setArchiveUrl(null);
      setFallbackUrl(null);
      setState("not_found");
    }
  }, []);

  const reset = useCallback(() => {
    setState("idle");
    setArchiveUrl(null);
    setFallbackUrl(null);
  }, []);

  return { state, archiveUrl, fallbackUrl, checkWayback, reset };
}
