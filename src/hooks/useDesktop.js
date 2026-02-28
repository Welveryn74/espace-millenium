import { useState, useEffect, useCallback } from "react";

export function useDesktop() {
  const [windows, setWindows] = useState({});
  const [zStack, setZStack] = useState([]);
  const [minimized, setMinimized] = useState({});
  const [shaking, setShaking] = useState(false);
  const [startMenu, setStartMenu] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [muted, setMuted] = useState(() => {
    try { return localStorage.getItem('em_muted') === 'true'; } catch { return false; }
  });

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const next = !prev;
      try { localStorage.setItem('em_muted', String(next)); } catch {}
      return next;
    });
  }, []);

  const bringToFront = useCallback((id) => {
    setZStack(prev => [...prev.filter(z => z !== id), id]);
  }, []);

  const openWindow = useCallback((id) => {
    setWindows(prev => {
      if (prev[id]) {
        // Already open — restore if minimized and bring to front
        setMinimized(m => ({ ...m, [id]: false }));
        setZStack(s => [...s.filter(z => z !== id), id]);
        setStartMenu(false);
        return prev;
      }
      return { ...prev, [id]: true };
    });
    setZStack(prev => [...prev.filter(z => z !== id), id]);
    setStartMenu(false);
  }, []);

  const closeWindow = useCallback((id) => {
    setWindows(prev => ({ ...prev, [id]: false }));
    setMinimized(prev => ({ ...prev, [id]: false }));
  }, []);

  const toggleMinimize = useCallback((id) => {
    setMinimized(prev => {
      const wasMinimized = prev[id];
      if (wasMinimized) {
        // Restoring — bring to front
        setZStack(s => [...s.filter(z => z !== id), id]);
      }
      return { ...prev, [id]: !wasMinimized };
    });
  }, []);

  const isMinimized = useCallback((id) => {
    return !!minimized[id];
  }, [minimized]);

  const getZ = useCallback((id) => {
    return 10 + (zStack.indexOf(id) === -1 ? 0 : zStack.indexOf(id));
  }, [zStack]);

  const doWizz = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }, []);

  const isTopWindow = useCallback((id) => {
    return zStack[zStack.length - 1] === id;
  }, [zStack]);

  const openWindowIds = Object.entries(windows)
    .filter(([, open]) => open)
    .map(([id]) => id);

  // Close start menu on click outside
  useEffect(() => {
    if (!startMenu) return;
    const handler = (e) => {
      if (!e.target.closest("[data-startmenu]") && !e.target.closest("[data-startbtn]")) {
        setStartMenu(false);
      }
    };
    setTimeout(() => document.addEventListener("click", handler), 0);
    return () => document.removeEventListener("click", handler);
  }, [startMenu]);

  return {
    windows,
    shaking,
    startMenu,
    setStartMenu,
    selectedIcon,
    setSelectedIcon,
    bringToFront,
    openWindow,
    closeWindow,
    getZ,
    doWizz,
    isTopWindow,
    openWindowIds,
    toggleMinimize,
    isMinimized,
    muted,
    toggleMute,
  };
}
