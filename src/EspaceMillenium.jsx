import { useState, useEffect, useRef, useCallback } from "react";
import { useDesktop } from "./hooks/useDesktop";
import { WINDOW_REGISTRY } from "./data/windowRegistry";
import BootScreen from "./components/BootScreen";
import ShutdownScreen from "./components/ShutdownScreen";
import Y2KPopup from "./components/Y2KPopup";
import Clippy, { CLIPPY_MESSAGES } from "./components/Clippy";
import DesktopIcons from "./components/DesktopIcons";
import Taskbar from "./components/Taskbar";
import StartMenu from "./components/StartMenu";

export default function EspaceMillenium() {
  const [booted, setBooted] = useState(false);
  const [showShutdown, setShowShutdown] = useState(false);
  const [showY2K, setShowY2K] = useState(false);
  const [ctxMenu, setCtxMenu] = useState(null);
  const [refreshAnim, setRefreshAnim] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showClippy, setShowClippy] = useState(false);
  const [clippyMsg, setClippyMsg] = useState("");
  const clippyUsed = useRef([]);

  const pickClippyMessage = useCallback(() => {
    if (clippyUsed.current.length >= CLIPPY_MESSAGES.length) clippyUsed.current = [];
    const available = CLIPPY_MESSAGES.filter((_, i) => !clippyUsed.current.includes(i));
    const idx = CLIPPY_MESSAGES.indexOf(available[Math.floor(Math.random() * available.length)]);
    clippyUsed.current.push(idx);
    return CLIPPY_MESSAGES[idx];
  }, []);

  const {
    windows, shaking, startMenu, setStartMenu,
    selectedIcon, setSelectedIcon,
    bringToFront, openWindow, closeWindow, getZ,
    doWizz, isTopWindow, openWindowIds,
    toggleMinimize, isMinimized,
    muted, toggleMute,
  } = useDesktop();

  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  // Clippy timer: first at 15s, then every 40-80s
  useEffect(() => {
    if (!booted) return;
    let timeout;
    const scheduleClippy = (delay) => {
      timeout = setTimeout(() => {
        setClippyMsg(pickClippyMessage());
        setShowClippy(true);
        scheduleClippy(40000 + Math.random() * 40000);
      }, delay);
    };
    scheduleClippy(15000);
    return () => clearTimeout(timeout);
  }, [booted, pickClippyMessage]);

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
      onClick={() => { setSelectedIcon(null); setCtxMenu(null); }}
      onContextMenu={(e) => {
        if (e.target.closest("[data-nocontext]")) return;
        e.preventDefault();
        setCtxMenu({ x: e.clientX, y: e.clientY });
      }}
    >
      <div style={{ opacity: refreshAnim ? 0 : 1, transition: "opacity 0.15s" }}>
        <DesktopIcons selectedIcon={selectedIcon} setSelectedIcon={setSelectedIcon} openWindow={openWindow} />
      </div>

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
          <div key={id} style={{ display: isMinimized(id) ? 'none' : undefined }}>
            <Comp
              onClose={() => closeWindow(id)}
              onMinimize={() => toggleMinimize(id)}
              zIndex={getZ(id)}
              onFocus={() => bringToFront(id)}
              {...(entry.needsDesktopActions ? { onWizz: doWizz } : {})}
            />
          </div>
        );
      })}

      {showY2K && <Y2KPopup onClose={() => setShowY2K(false)} />}

      {showClippy && <Clippy message={clippyMsg} onClose={() => setShowClippy(false)} />}

      <Taskbar
        startMenu={startMenu}
        setStartMenu={setStartMenu}
        openWindowIds={openWindowIds}
        isTopWindow={isTopWindow}
        isMinimized={isMinimized}
        toggleMinimize={toggleMinimize}
        bringToFront={bringToFront}
        time={time}
        muted={muted}
        toggleMute={toggleMute}
      />

      {startMenu && <StartMenu openWindow={openWindow} onShutdown={() => { setStartMenu(false); setShowShutdown(true); }} />}

      {/* About / Propriétés */}
      {showAbout && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 99998,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.3)",
        }} onClick={() => setShowAbout(false)}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#ECE9D8", border: "2px solid #0055E5", borderRadius: "8px 8px 0 0",
              width: 360, boxShadow: "4px 4px 20px rgba(0,0,50,0.4)",
              fontFamily: "'Tahoma', sans-serif",
            }}
          >
            <div style={{
              background: "linear-gradient(180deg, #0055E5 0%, #0055E5BB 40%, #0055E599 60%, #0055E5 100%)",
              padding: "6px 10px", color: "#fff", fontWeight: "bold", fontSize: 12,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span>Propriétés système</span>
              <button onClick={() => setShowAbout(false)} style={{
                width: 20, height: 20, border: "1px solid rgba(0,0,0,0.3)", borderRadius: 3,
                background: "linear-gradient(180deg, #E97 0%, #C44 100%)", color: "#fff",
                fontWeight: "bold", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}>✕</button>
            </div>
            <div style={{ padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 38, marginBottom: 8 }}>🖥️</div>
              <div style={{ fontWeight: "bold", fontSize: 14, marginBottom: 4 }}>L'Espace Millénium</div>
              <div style={{ fontSize: 11, color: "#555", marginBottom: 12 }}>Version 1.0 — 2005 Edition</div>
              <div style={{ fontSize: 10, color: "#888", lineHeight: 1.8, borderTop: "1px solid #ccc", paddingTop: 10 }}>
                Processeur : Intel Pentium III 800 MHz<br />
                Mémoire : 256 Mo de RAM<br />
                Connexion : Wanadoo 56K V.90<br />
                Système : Windows XP Édition Familiale
              </div>
              <button onClick={() => setShowAbout(false)} style={{
                marginTop: 16, padding: "5px 28px",
                background: "linear-gradient(180deg, #E8E8E8 0%, #C8C8C8 100%)",
                border: "1px solid #888", borderRadius: 3, cursor: "pointer",
                fontFamily: "'Tahoma', sans-serif", fontSize: 11,
              }}>OK</button>
            </div>
          </div>
        </div>
      )}

      {/* Context menu */}
      {ctxMenu && (
        <div
          style={{
            position: "absolute", left: ctxMenu.x, top: ctxMenu.y, zIndex: 9999,
            background: "#fff", border: "1px solid #888", boxShadow: "2px 2px 6px rgba(0,0,0,0.25)",
            padding: "2px 0", minWidth: 180, fontFamily: "'Tahoma', sans-serif", fontSize: 11,
          }}
        >
          {[
            { label: "Actualiser", action: () => { setRefreshAnim(true); setTimeout(() => setRefreshAnim(false), 400); setCtxMenu(null); } },
            { label: "Réorganiser les icônes", action: () => setCtxMenu(null) },
            { sep: true },
            { label: "Propriétés", action: () => { setCtxMenu(null); setShowAbout(true); } },
          ].map((item, i) =>
            item.sep ? (
              <div key={i} style={{ height: 1, background: "#ccc", margin: "3px 4px" }} />
            ) : (
              <div
                key={i}
                onClick={item.action}
                style={{ padding: "5px 28px", cursor: "pointer", color: "#000" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#316AC5"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "#000"; }}
              >
                {item.label}
              </div>
            )
          )}
        </div>
      )}

      {showShutdown && (
        <ShutdownScreen
          onCancel={() => setShowShutdown(false)}
          onRestart={() => { setShowShutdown(false); setBooted(false); }}
        />
      )}
    </div>
  );
}
