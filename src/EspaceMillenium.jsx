import { useState, useEffect } from "react";
import { useDesktop } from "./hooks/useDesktop";
import { WINDOW_REGISTRY } from "./data/windowRegistry";
import BootScreen from "./components/BootScreen";
import Y2KPopup from "./components/Y2KPopup";
import DesktopIcons from "./components/DesktopIcons";
import Taskbar from "./components/Taskbar";
import StartMenu from "./components/StartMenu";

export default function EspaceMillenium() {
  const [booted, setBooted] = useState(false);
  const [showY2K, setShowY2K] = useState(false);
  const [time, setTime] = useState(new Date());

  const {
    windows, shaking, startMenu, setStartMenu,
    selectedIcon, setSelectedIcon,
    bringToFront, openWindow, closeWindow, getZ,
    doWizz, isTopWindow, openWindowIds,
  } = useDesktop();

  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  if (!booted) return <BootScreen onComplete={() => setBooted(true)} />;

  return (
    <div
      style={{
        width: "100vw", height: "100vh", overflow: "hidden", position: "relative",
        background: `
          radial-gradient(ellipse at 30% 20%, rgba(0,80,180,0.4) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, rgba(0,40,120,0.3) 0%, transparent 50%),
          linear-gradient(135deg, #004E92 0%, #000428 50%, #003366 100%)
        `,
        fontFamily: "'Tahoma', 'Segoe UI', sans-serif",
        animation: shaking ? "wizz 0.06s 7 alternate" : "none",
        cursor: "default",
      }}
      onClick={() => { setSelectedIcon(null); }}
    >
      <DesktopIcons selectedIcon={selectedIcon} setSelectedIcon={setSelectedIcon} openWindow={openWindow} />

      {/* Y2K Bug button */}
      <div
        onClick={() => setShowY2K(true)}
        style={{
          position: "absolute", bottom: 48, right: 12, cursor: "pointer", zIndex: 5,
          padding: "5px 10px", background: "rgba(255,0,0,0.08)", border: "1px solid rgba(255,0,0,0.2)",
          borderRadius: 3, fontSize: 10, color: "rgba(255,100,100,0.5)",
          fontFamily: "monospace", transition: "all 0.3s",
          animation: "glowPulse 3s infinite",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,0,0,0.2)"; e.currentTarget.style.color = "#F88"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,0,0,0.08)"; e.currentTarget.style.color = "rgba(255,100,100,0.5)"; }}
      >⚠ Y2K_BUG.exe</div>

      {/* Windows — rendered via registry */}
      {Object.entries(WINDOW_REGISTRY).map(([id, entry]) => {
        if (!windows[id]) return null;
        const Comp = entry.component;
        return (
          <Comp
            key={id}
            onClose={() => closeWindow(id)}
            zIndex={getZ(id)}
            onFocus={() => bringToFront(id)}
            {...(entry.needsDesktopActions ? { onWizz: doWizz } : {})}
          />
        );
      })}

      {showY2K && <Y2KPopup onClose={() => setShowY2K(false)} />}

      <Taskbar
        startMenu={startMenu}
        setStartMenu={setStartMenu}
        openWindowIds={openWindowIds}
        isTopWindow={isTopWindow}
        bringToFront={bringToFront}
        time={time}
      />

      {startMenu && <StartMenu openWindow={openWindow} />}
    </div>
  );
}
