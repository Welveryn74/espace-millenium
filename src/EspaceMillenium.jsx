import { useState, useEffect, useRef, useCallback } from "react";
import { useDesktop } from "./hooks/useDesktop";
import { WINDOW_REGISTRY } from "./data/windowRegistry";
import BootScreen from "./components/BootScreen";
import ShutdownScreen from "./components/ShutdownScreen";
import Y2KPopup from "./components/Y2KPopup";
import Clippy, { pickClippyMessage } from "./components/Clippy";
import DesktopIcons from "./components/DesktopIcons";
import Taskbar from "./components/Taskbar";
import StartMenu from "./components/StartMenu";
import Screensaver from "./components/Screensaver";
import MSNNotification from "./components/MSNNotification";
import XPNotifications from "./components/XPNotifications";
import { startAmbient, stopAmbient, setAmbientMuted } from "./utils/ambientSounds";
import { playClick } from "./utils/uiSounds";
import { loadState, saveState } from "./utils/storage";

const WALLPAPERS = {
  colline: `
    radial-gradient(ellipse at 30% 20%, rgba(0,80,180,0.4) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 80%, rgba(0,40,120,0.3) 0%, transparent 50%),
    linear-gradient(135deg, #004E92 0%, #000428 50%, #003366 100%)
  `,
  espace: `
    radial-gradient(ellipse at 20% 50%, rgba(80,0,160,0.3) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(0,40,120,0.3) 0%, transparent 50%),
    linear-gradient(135deg, #0D0221 0%, #150734 40%, #0A001A 100%)
  `,
  matrix: `
    radial-gradient(ellipse at 50% 50%, rgba(0,60,0,0.3) 0%, transparent 60%),
    linear-gradient(180deg, #000800 0%, #001200 50%, #000400 100%)
  `,
  aquarium: `
    radial-gradient(ellipse at 30% 60%, rgba(0,100,180,0.4) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 30%, rgba(0,180,200,0.2) 0%, transparent 50%),
    linear-gradient(180deg, #006994 0%, #003D5B 50%, #001B2E 100%)
  `,
};

const SCREENSAVER_DELAY = 120000; // 2 minutes

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
  const [showScreensaver, setShowScreensaver] = useState(false);
  const [wallpaper, setWallpaper] = useState(() => loadState('wallpaper', 'colline'));
  const [msnNotification, setMsnNotification] = useState(false);
  const [konamiActive, setKonamiActive] = useState(false);
  const [showBSOD, setShowBSOD] = useState(false);
  const idleTimerRef = useRef(null);
  const konamiRef = useRef([]);

  const pickClippyMsg = useCallback(() => {
    return pickClippyMessage();
  }, []);

  const {
    windows, shaking, startMenu, setStartMenu,
    selectedIcon, setSelectedIcon,
    bringToFront, openWindow, closeWindow, getZ,
    doWizz, isTopWindow, openWindowIds,
    toggleMinimize, isMinimized,
    closing, restoring,
    muted, toggleMute,
  } = useDesktop();

  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  // Start ambient PC sounds when booted
  useEffect(() => {
    if (booted) startAmbient();
    return () => stopAmbient();
  }, [booted]);

  // Sync ambient mute with muted state
  useEffect(() => {
    setAmbientMuted(muted);
  }, [muted]);

  // Idle detection — screensaver after 2 min
  useEffect(() => {
    if (!booted) return;
    const resetIdle = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => setShowScreensaver(true), SCREENSAVER_DELAY);
    };
    resetIdle();
    window.addEventListener("mousemove", resetIdle);
    window.addEventListener("keydown", resetIdle);
    window.addEventListener("mousedown", resetIdle);
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener("mousemove", resetIdle);
      window.removeEventListener("keydown", resetIdle);
      window.removeEventListener("mousedown", resetIdle);
    };
  }, [booted]);

  // Konami code: ↑↑↓↓←→←→BA
  useEffect(() => {
    if (!booted) return;
    const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    const handler = (e) => {
      konamiRef.current.push(e.key);
      if (konamiRef.current.length > KONAMI.length) konamiRef.current.shift();
      if (konamiRef.current.length === KONAMI.length && konamiRef.current.every((k, i) => k.toLowerCase() === KONAMI[i].toLowerCase())) {
        konamiRef.current = [];
        setKonamiActive(true);
        setTimeout(() => setKonamiActive(false), 3000);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [booted]);

  // Clippy timer: first at 15s, then every 40-80s
  useEffect(() => {
    if (!booted) return;
    const mounted = { current: true };
    let timeout;
    const scheduleClippy = (delay) => {
      timeout = setTimeout(() => {
        if (!mounted.current) return;
        setClippyMsg(pickClippyMsg());
        setShowClippy(true);
        scheduleClippy(40000 + Math.random() * 40000);
      }, delay);
    };
    scheduleClippy(15000);
    return () => { mounted.current = false; clearTimeout(timeout); };
  }, [booted, pickClippyMsg]);

  if (!booted) return <BootScreen onComplete={() => setBooted(true)} />;

  return (
    <div
      style={{
        width: "100vw", height: "100vh", overflow: "hidden", position: "relative",
        background: WALLPAPERS[wallpaper] || WALLPAPERS.colline,
        transition: "background 0.5s ease",
        fontFamily: "'Tahoma', 'Segoe UI', sans-serif",
        animation: shaking ? "wizz 0.06s 7 alternate" : "none",
        cursor: "default",
      }}
      onClick={() => { setSelectedIcon(null); setCtxMenu(null); }}
      onContextMenu={(e) => {
        if (e.target.closest("[data-nocontext]")) return;
        e.preventDefault();
        setCtxMenu({ x: e.clientX, y: e.clientY });
        playClick();
      }}
    >
      <div style={{ opacity: refreshAnim ? 0 : 1, transition: "opacity 0.15s" }}>
        <DesktopIcons selectedIcon={selectedIcon} setSelectedIcon={setSelectedIcon} openWindow={openWindow} konamiActive={konamiActive} />
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
        const anim = closing[id] === 'close' ? 'windowClose 0.2s ease-in forwards'
                   : closing[id] === 'minimize' ? 'windowMinimize 0.2s ease-in forwards'
                   : restoring[id] ? 'windowRestore 0.2s ease-out forwards'
                   : undefined;
        return (
          <div key={id} style={{ display: isMinimized(id) && !closing[id] ? 'none' : undefined, animation: anim }}>
            <Comp
              onClose={() => closeWindow(id)}
              onMinimize={() => toggleMinimize(id)}
              zIndex={getZ(id)}
              onFocus={() => bringToFront(id)}
              {...(entry.needsDesktopActions ? { onWizz: doWizz, openWindowIds } : {})}
              {...(id === 'msn' ? { isMinimized: isMinimized('msn'), onNotification: () => setMsnNotification(true) } : {})}
            />
          </div>
        );
      })}

      {showY2K && <Y2KPopup onClose={() => setShowY2K(false)} onBSOD={() => { setShowBSOD(true); setTimeout(() => setShowBSOD(false), 3000); }} />}

      {showClippy && <Clippy message={clippyMsg} onClose={() => setShowClippy(false)} />}

      <XPNotifications muted={muted} />

      {msnNotification && (
        <MSNNotification
          botName="~*~xX_DaRk_AnGeL_Xx~*~"
          onOpen={() => { setMsnNotification(false); toggleMinimize('msn'); bringToFront('msn'); }}
          onDismiss={() => setMsnNotification(false)}
        />
      )}

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
            animation: "fadeIn 0.15s ease-out",
          }}
        >
          {[
            { label: "Actualiser", action: () => { setRefreshAnim(true); setTimeout(() => setRefreshAnim(false), 400); setCtxMenu(null); } },
            { label: "Réorganiser les icônes", action: () => setCtxMenu(null) },
            { sep: true },
            { label: "Fond d'écran ▸", action: () => setCtxMenu(prev => ({ ...prev, showWp: !prev?.showWp })) },
            ...(ctxMenu?.showWp ? [
              { label: `  ${wallpaper === 'colline' ? "●" : "○"} Colline verte`, action: () => { setWallpaper('colline'); saveState('wallpaper', 'colline'); setCtxMenu(null); }, wp: true },
              { label: `  ${wallpaper === 'espace' ? "●" : "○"} Espace`, action: () => { setWallpaper('espace'); saveState('wallpaper', 'espace'); setCtxMenu(null); }, wp: true },
              { label: `  ${wallpaper === 'matrix' ? "●" : "○"} Matrix`, action: () => { setWallpaper('matrix'); saveState('wallpaper', 'matrix'); setCtxMenu(null); }, wp: true },
              { label: `  ${wallpaper === 'aquarium' ? "●" : "○"} Aquarium`, action: () => { setWallpaper('aquarium'); saveState('wallpaper', 'aquarium'); setCtxMenu(null); }, wp: true },
            ] : []),
            { sep: true },
            { label: "Propriétés", action: () => { setCtxMenu(null); setShowAbout(true); } },
          ].map((item, i) =>
            item.sep ? (
              <div key={i} style={{ height: 1, background: "#ccc", margin: "3px 4px" }} />
            ) : (
              <div
                key={i}
                onClick={item.action}
                style={{ padding: "5px 28px", cursor: "pointer", color: "#000", ...(item.wp ? { animation: "fadeIn 0.12s ease-out" } : {}) }}
                onMouseEnter={e => { e.currentTarget.style.background = "#316AC5"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "#000"; }}
              >
                {item.label}
              </div>
            )
          )}
        </div>
      )}

      {/* Konami code overlay */}
      {konamiActive && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 99997,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.6)", pointerEvents: "none",
        }}>
          <div style={{
            fontSize: 48, fontWeight: "bold", color: "#0F0",
            fontFamily: "'Courier New', monospace",
            textShadow: "0 0 20px #0F0, 0 0 40px #0F0",
            animation: "pulse 0.5s infinite",
            textAlign: "center",
          }}>
            MODE TRICHE ACTIVÉ !<br />
            <span style={{ fontSize: 20 }}>↑↑↓↓←→←→BA</span>
          </div>
        </div>
      )}

      {/* BSOD comedy */}
      {showBSOD && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 99999,
            background: "#0000AA", color: "#fff",
            fontFamily: "'Courier New', monospace", fontSize: 14,
            padding: "15vh 10vw", lineHeight: 1.8,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 20 }}>Windows</div>
          <div>
            *** STOP: 0x000000Y2K (0xDEADBEEF, 0xCAFEBABE)<br />
            MILLENNIUM_BUG_EXCEPTION<br /><br />
            Si c'est la première fois que vous voyez cet écran,<br />
            redémarrez votre ordinateur. Si le problème persiste,<br />
            demandez à votre grand frère.<br /><br />
            <span style={{ color: "#AAA" }}>Informations techniques :</span><br />
            *** STOP: 0x0000Y2K (le bug c'était pas vrai en fait)
          </div>
        </div>
      )}

      {/* Overlay vespéral — assombrissement selon l'heure */}
      {(() => {
        const h = time.getHours();
        let opacity = 0;
        if (h >= 18 && h < 21) opacity = 0.03 + (h - 18) * 0.03;
        else if (h >= 21 || h < 6) opacity = 0.15;
        return opacity > 0 ? (
          <div style={{
            position: "fixed", inset: 0, pointerEvents: "none", zIndex: 98,
            background: `rgba(0,0,30,${opacity})`,
            transition: "background 60s linear",
          }} />
        ) : null;
      })()}

      {showScreensaver && <Screensaver onDismiss={() => setShowScreensaver(false)} />}

      {showShutdown && (
        <ShutdownScreen
          onCancel={() => setShowShutdown(false)}
          onRestart={() => { setShowShutdown(false); setBooted(false); }}
        />
      )}
    </div>
  );
}
