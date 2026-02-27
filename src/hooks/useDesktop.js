import { useState, useEffect, useCallback } from "react";

export function useDesktop() {
  const [windows, setWindows] = useState({});
  const [zStack, setZStack] = useState([]);
  const [shaking, setShaking] = useState(false);
  const [startMenu, setStartMenu] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);

  const bringToFront = useCallback((id) => {
    setZStack(prev => [...prev.filter(z => z !== id), id]);
  }, []);

  const openWindow = useCallback((id) => {
    setWindows(prev => ({ ...prev, [id]: true }));
    setZStack(prev => [...prev.filter(z => z !== id), id]);
    setStartMenu(false);
  }, []);

  const closeWindow = useCallback((id) => {
    setWindows(prev => ({ ...prev, [id]: false }));
  }, []);

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
  };
}
