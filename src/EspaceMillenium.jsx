import { useState, useEffect, useRef, useCallback } from "react";
import { useDesktop } from "./hooks/useDesktop";
import { WINDOW_REGISTRY } from "./data/windowRegistry";
import BootScreen from "./components/BootScreen";
import ShutdownScreen from "./components/ShutdownScreen";
import Y2KPopup from "./components/Y2KPopup";
import Clippy, { pickClippyMessage } from "./components/Clippy";
import DesktopIcons, { resetIconPositions } from "./components/DesktopIcons";
import Taskbar from "./components/Taskbar";
import StartMenu from "./components/StartMenu";
import Screensaver from "./components/Screensaver";
import MSNNotification from "./components/MSNNotification";
import XPNotifications from "./components/XPNotifications";
import { syncGlobalVolume as syncChiptuneVolume } from "./utils/chiptunePlayer";
import { playClick, playError } from "./utils/uiSounds";
import CrashDialog from "./components/CrashDialog";
import { loadState, saveState } from "./utils/storage";

// ── Curseur Windows XP (flèche blanche, contour noir, ombre) ──
const _XP_ARROW = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="28"><path d="M4,3 L4,23 L9,18 L13,26 L16,25 L12,17 L19,17 Z" fill="rgba(0,0,0,0.22)"/><path d="M3,1 L3,21 L8,16 L12,24 L15,23 L11,15 L18,15 Z" fill="#000"/><path d="M4,2 L4,20 L8,16 L12,22 L14,21 L10,14 L16.5,14 Z" fill="#fff"/></svg>';
const XP_CURSOR = `url("data:image/svg+xml,${encodeURIComponent(_XP_ARROW)}") 3 1, default`;

// ── Wallpaper Bliss SVG ──
const _BLISS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#72AACC"/><stop offset="40%" stop-color="#98C6E0"/><stop offset="62%" stop-color="#BEDDEE"/></linearGradient><linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#5DB83C"/><stop offset="45%" stop-color="#44A028"/><stop offset="100%" stop-color="#2C7A14"/></linearGradient></defs><rect width="1600" height="900" fill="url(#sk)"/><ellipse cx="290" cy="208" rx="255" ry="78" fill="rgba(255,255,255,0.92)"/><ellipse cx="210" cy="232" rx="185" ry="60" fill="rgba(255,255,255,0.86)"/><ellipse cx="390" cy="190" rx="200" ry="65" fill="rgba(255,255,255,0.82)"/><ellipse cx="145" cy="252" rx="145" ry="46" fill="rgba(255,255,255,0.76)"/><ellipse cx="1230" cy="182" rx="235" ry="70" fill="rgba(255,255,255,0.88)"/><ellipse cx="1130" cy="206" rx="175" ry="56" fill="rgba(255,255,255,0.82)"/><ellipse cx="1370" cy="194" rx="175" ry="55" fill="rgba(255,255,255,0.74)"/><ellipse cx="1490" cy="218" rx="128" ry="42" fill="rgba(255,255,255,0.65)"/><ellipse cx="780" cy="142" rx="155" ry="47" fill="rgba(255,255,255,0.66)"/><ellipse cx="648" cy="166" rx="118" ry="37" fill="rgba(255,255,255,0.58)"/><ellipse cx="988" cy="158" rx="118" ry="37" fill="rgba(255,255,255,0.54)"/><path d="M-80,900 C50,480 150,555 300,595 C430,628 510,590 600,558 C672,530 744,524 840,506 C928,490 998,500 1080,528 C1168,558 1228,555 1328,525 C1428,495 1528,548 1680,572 L1680,900 Z" fill="url(#gr)"/><path d="M-80,900 C80,712 280,750 480,792 C680,834 880,798 1080,828 C1280,858 1480,818 1680,846 L1680,900 Z" fill="#3A8E20" opacity="0.52"/><path d="M-80,900 C160,862 420,872 720,882 C1020,892 1320,864 1680,878 L1680,900 Z" fill="#28700E" opacity="0.38"/></svg>`;
const _BLISS_URL = `url("data:image/svg+xml,${encodeURIComponent(_BLISS)}") center / cover no-repeat`;

const WALLPAPERS = {
  bliss: _BLISS_URL,
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
  const [customWallpaper, setCustomWallpaper] = useState(() => loadState('custom_wallpaper', null));
  const wallpaperInputRef = useRef(null);
  const iconsRef = useRef(null);
  const [msnNotification, setMsnNotification] = useState(false);
  const [konamiActive, setKonamiActive] = useState(false);
  const [showBSOD, setShowBSOD] = useState(false);
  const [showCrash, setShowCrash] = useState(false);
  const [iconKey, setIconKey] = useState(0);
  const idleTimerRef = useRef(null);
  const konamiRef = useRef([]);
  const bootTimeRef = useRef(Date.now());

  const handleWallpaperUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setCustomWallpaper(dataUrl);
      saveState('custom_wallpaper', dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, []);

  const {
    windows, shaking, startMenu, setStartMenu,
    bringToFront, openWindow, closeWindow, getZ,
    doWizz, isTopWindow, openWindowIds,
    toggleMinimize, isMinimized,
    closing, restoring,
    muted, toggleMute,
    volume, setVolume,
    ieInitialUrl, openIEWithUrl,
  } = useDesktop();

  const pickClippyMsg = useCallback(() => {
    return pickClippyMessage(openWindowIds.length, bootTimeRef.current);
  }, [openWindowIds.length]);

  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  // Sync all audio with muted/volume state
  useEffect(() => {
    syncChiptuneVolume();
  }, [muted, volume]);

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

  // Crash dialog : une fois par session, entre 5 et 10 minutes après le démarrage
  useEffect(() => {
    if (!booted) return;
    const delay = 300000 + Math.random() * 300000; // 5-10 min
    const t = setTimeout(() => { playError(); setShowCrash(true); }, delay);
    return () => clearTimeout(t);
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

  // Clippy timer: first at 30s, then every 2-4 min, auto-dismiss after 8s
  useEffect(() => {
    if (!booted) return;
    const mounted = { current: true };
    let timeout;
    let dismissTimeout;
    const scheduleClippy = (delay) => {
      timeout = setTimeout(() => {
        if (!mounted.current) return;
        setClippyMsg(pickClippyMsg());
        setShowClippy(true);
        // Auto-dismiss après 8 secondes
        dismissTimeout = setTimeout(() => {
          if (mounted.current) setShowClippy(false);
        }, 8000);
        scheduleClippy(120000 + Math.random() * 120000); // 2-4 min
      }, delay);
    };
    scheduleClippy(30000); // première apparition à 30s
    return () => { mounted.current = false; clearTimeout(timeout); clearTimeout(dismissTimeout); };
  }, [booted, pickClippyMsg]);

  if (!booted) return <BootScreen onComplete={() => setBooted(true)} />;

  return (
    <div
      style={{
        width: "100vw", height: "100vh", overflow: "hidden", position: "relative",
        background: customWallpaper
          ? `url(${customWallpaper}) center / cover no-repeat`
          : (WALLPAPERS[wallpaper] || WALLPAPERS.colline),
        transition: "background 0.5s ease",
        fontFamily: "'Tahoma', 'Segoe UI', sans-serif",
        animation: shaking ? "wizz 0.06s 7 alternate" : "none",
        cursor: XP_CURSOR,
      }}
      onClick={() => { iconsRef.current?.clearSelection(); setCtxMenu(null); }}
      onContextMenu={(e) => {
        if (e.target.closest("[data-nocontext]")) return;
        e.preventDefault();
        setCtxMenu({ x: e.clientX, y: e.clientY });
        playClick();
      }}
    >
      <div style={{ opacity: refreshAnim ? 0 : 1, transition: "opacity 0.15s" }}>
        <DesktopIcons key={iconKey} ref={iconsRef} openWindow={openWindow} konamiActive={konamiActive} />
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
              {...(id === 'ie' ? { onBSOD: () => { setShowBSOD(true); setTimeout(() => setShowBSOD(false), 3000); }, initialUrl: ieInitialUrl } : {})}
              {...(id === 'skyblog' ? { onOpenUrl: openIEWithUrl } : {})}
            />
          </div>
        );
      })}

      {showY2K && <Y2KPopup onClose={() => setShowY2K(false)} onBSOD={() => { setShowBSOD(true); setTimeout(() => setShowBSOD(false), 3000); }} />}

      {showClippy && <Clippy message={clippyMsg} onClose={() => setShowClippy(false)} />}

      <XPNotifications />

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
        volume={volume}
        setVolume={setVolume}
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
            { label: "Réorganiser les icônes", action: () => { resetIconPositions(); setIconKey(k => k + 1); setCtxMenu(null); } },
            { sep: true },
            { label: "Fond d'écran ▸", action: () => setCtxMenu(prev => ({ ...prev, showWp: !prev?.showWp })) },
            ...(ctxMenu?.showWp ? [
              { label: `  ${!customWallpaper && wallpaper === 'bliss' ? "●" : "○"} Bliss (XP classique)`, action: () => { setWallpaper('bliss'); setCustomWallpaper(null); saveState('wallpaper', 'bliss'); saveState('custom_wallpaper', null); setCtxMenu(null); }, wp: true },
              { label: `  ${!customWallpaper && wallpaper === 'colline' ? "●" : "○"} Colline verte`, action: () => { setWallpaper('colline'); setCustomWallpaper(null); saveState('wallpaper', 'colline'); saveState('custom_wallpaper', null); setCtxMenu(null); }, wp: true },
              { label: `  ${!customWallpaper && wallpaper === 'espace' ? "●" : "○"} Espace`, action: () => { setWallpaper('espace'); setCustomWallpaper(null); saveState('wallpaper', 'espace'); saveState('custom_wallpaper', null); setCtxMenu(null); }, wp: true },
              { label: `  ${!customWallpaper && wallpaper === 'matrix' ? "●" : "○"} Matrix`, action: () => { setWallpaper('matrix'); setCustomWallpaper(null); saveState('wallpaper', 'matrix'); saveState('custom_wallpaper', null); setCtxMenu(null); }, wp: true },
              { label: `  ${!customWallpaper && wallpaper === 'aquarium' ? "●" : "○"} Aquarium`, action: () => { setWallpaper('aquarium'); setCustomWallpaper(null); saveState('wallpaper', 'aquarium'); saveState('custom_wallpaper', null); setCtxMenu(null); }, wp: true },
              { label: `  ${customWallpaper ? "●" : "○"} Image personnalisée`, action: () => { wallpaperInputRef.current?.click(); setCtxMenu(null); }, wp: true },
              { label: "  📂 Parcourir...", action: () => { wallpaperInputRef.current?.click(); setCtxMenu(null); }, wp: true },
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

      {showCrash && <CrashDialog onClose={() => setShowCrash(false)} />}

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

      {/* Input caché pour l'upload de fond d'écran */}
      <input
        ref={wallpaperInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleWallpaperUpload}
      />

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
