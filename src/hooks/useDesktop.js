import { useState, useEffect, useCallback } from "react";
import { playWindowOpen, playWindowClose, playMinimize } from "../utils/uiSounds";
import { logActivity } from "../utils/storage";
import { getVolume, saveVolume } from "../utils/volumeManager";

export function useDesktop() {
  const [windows, setWindows] = useState({});
  const [zStack, setZStack] = useState([]);
  const [minimized, setMinimized] = useState({});
  const [closing, setClosing] = useState({}); // {id: 'close'|'minimize'}
  const [restoring, setRestoring] = useState({}); // {id: true}
  const [shaking, setShaking] = useState(false);
  const [startMenu, setStartMenu] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [muted, setMuted] = useState(() => {
    try { return localStorage.getItem('em_muted') === 'true'; } catch { return false; }
  });
  const [volume, setVolumeState] = useState(getVolume);

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const next = !prev;
      try { localStorage.setItem('em_muted', String(next)); } catch {}
      return next;
    });
  }, []);

  const setVolume = useCallback((v) => {
    const clamped = Math.max(0, Math.min(100, v));
    setVolumeState(clamped);
    saveVolume(clamped);
    // Désactiver mute si on monte le volume
    if (clamped > 0 && localStorage.getItem('em_muted') === 'true') {
      setMuted(false);
      try { localStorage.setItem('em_muted', 'false'); } catch {}
    }
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
      playWindowOpen();
      logActivity(`open_${id}`);
      return { ...prev, [id]: true };
    });
    setZStack(prev => [...prev.filter(z => z !== id), id]);
    setStartMenu(false);
  }, []);

  const closeWindow = useCallback((id) => {
    playWindowClose();
    setClosing(prev => ({ ...prev, [id]: 'close' }));
    setTimeout(() => {
      setClosing(prev => { const n = { ...prev }; delete n[id]; return n; });
      setWindows(prev => ({ ...prev, [id]: false }));
      setMinimized(prev => ({ ...prev, [id]: false }));
    }, 200);
  }, []);

  const toggleMinimize = useCallback((id) => {
    playMinimize();
    setMinimized(prev => {
      const wasMinimized = prev[id];
      if (wasMinimized) {
        // Restoring — bring to front with animation
        setZStack(s => [...s.filter(z => z !== id), id]);
        setRestoring(r => ({ ...r, [id]: true }));
        setTimeout(() => {
          setRestoring(r => { const n = { ...r }; delete n[id]; return n; });
        }, 200);
        return { ...prev, [id]: false };
      }
      // Minimizing — animate then hide
      setClosing(c => ({ ...c, [id]: 'minimize' }));
      setTimeout(() => {
        setClosing(c => { const n = { ...c }; delete n[id]; return n; });
        setMinimized(m => ({ ...m, [id]: true }));
      }, 200);
      return prev;
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
    closing,
    restoring,
    muted,
    toggleMute,
    volume,
    setVolume,
  };
}
