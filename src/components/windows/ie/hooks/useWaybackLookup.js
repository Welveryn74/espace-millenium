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

export function useWaybackLookup() {
  const [state, setState] = useState("idle"); // idle | checking | found | not_found
  const [archiveUrl, setArchiveUrl] = useState(null);
  const cacheRef = useRef({});

  const checkWayback = useCallback(async (url) => {
    // Pre-cached favorites — instant, no API call needed
    if (isPrecached(url)) {
      const iframeUrl = buildTheOldNetUrl(url);
      setArchiveUrl(iframeUrl);
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
        setState("found");
      } else {
        setArchiveUrl(null);
        setState("not_found");
      }
      return;
    }

    setState("checking");
    setArchiveUrl(null);

    try {
      const res = await fetch(
        `${WAYBACK_API}?url=${encodeURIComponent(url)}&timestamp=20050101`
      );
      const data = await res.json();
      const snapshot = data?.archived_snapshots?.closest;

      if (snapshot?.available) {
        // Use TheOldNet for cleaner, faster rendering (strips broken JS)
        const iframeUrl = buildTheOldNetUrl(url);
        const entry = { available: true, archiveUrl: iframeUrl };
        cacheRef.current[cacheKey] = entry;
        try { sessionStorage.setItem(cacheKey, JSON.stringify(entry)); } catch {}
        setArchiveUrl(iframeUrl);
        setState("found");
      } else {
        const entry = { available: false };
        cacheRef.current[cacheKey] = entry;
        try { sessionStorage.setItem(cacheKey, JSON.stringify(entry)); } catch {}
        setArchiveUrl(null);
        setState("not_found");
      }
    } catch {
      setArchiveUrl(null);
      setState("not_found");
    }
  }, []);

  const reset = useCallback(() => {
    setState("idle");
    setArchiveUrl(null);
  }, []);

  return { state, archiveUrl, checkWayback, reset };
}
