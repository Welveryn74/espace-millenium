import { useState, useRef, useEffect, useCallback } from "react";
import { DESKTOP_ICONS } from "../data/desktopIcons";
import NostalImg from "./NostalImg";
import { playClick } from "../utils/uiSounds";

/* ── Icônes system tray en SVG inline (style XP) ── */
const TrayVolume = ({ size = 15, muted, volume }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M2 6h2.5l3-2.5v9L4.5 10H2a1 1 0 01-1-1V7a1 1 0 011-1z" fill="#fff"/>
    {muted || volume === 0 ? (
      <>
        <line x1="10" y1="5" x2="15" y2="11" stroke="#F44" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="15" y1="5" x2="10" y2="11" stroke="#F44" strokeWidth="1.8" strokeLinecap="round"/>
      </>
    ) : volume < 40 ? (
      <path d="M10 5.5a3.5 3.5 0 010 5" stroke="#fff" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    ) : (
      <>
        <path d="M10 5.5a3.5 3.5 0 010 5" stroke="#fff" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M12 3.5a6 6 0 010 9" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      </>
    )}
  </svg>
);

/* ── Popup contrôle de volume (style Windows XP) ── */
function VolumePopup({ volume, setVolume, muted, toggleMute, onClose }) {
  const popupRef = useRef(null);
  const sliderRef = useRef(null);
  const dragging = useRef(false);

  // Fermer au clic extérieur
  useEffect(() => {
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const TRACK_HEIGHT = 120;
  const THUMB_H = 10;

  const volumeFromY = useCallback((clientY) => {
    if (!sliderRef.current) return volume;
    const rect = sliderRef.current.getBoundingClientRect();
    const y = clientY - rect.top;
    const ratio = 1 - Math.max(0, Math.min(1, y / TRACK_HEIGHT));
    return Math.round(ratio * 100);
  }, [volume]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    dragging.current = true;
    setVolume(volumeFromY(e.clientY));
    const onMove = (ev) => {
      if (dragging.current) setVolume(volumeFromY(ev.clientY));
    };
    const onUp = () => {
      dragging.current = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const thumbTop = TRACK_HEIGHT * (1 - volume / 100) - THUMB_H / 2;

  return (
    <div ref={popupRef} style={{
      position: "absolute", bottom: 44, right: 40, zIndex: 101,
      background: "#ECE9D8", border: "2px solid #0055E5",
      borderRadius: "8px 8px 0 0", boxShadow: "2px -2px 8px rgba(0,0,50,0.3)",
      fontFamily: "'Tahoma', sans-serif", width: 72,
    }}>
      {/* Titre */}
      <div style={{
        background: "linear-gradient(180deg, #0055E5 0%, #0055E5BB 100%)",
        padding: "3px 8px", color: "#fff", fontWeight: "bold", fontSize: 10,
        borderRadius: "6px 6px 0 0", textAlign: "center",
      }}>Volume</div>

      {/* Corps */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0 8px" }}>
        {/* Labels haut/bas */}
        <div style={{ fontSize: 9, color: "#555", marginBottom: 4 }}>+</div>

        {/* Slider vertical */}
        <div
          ref={sliderRef}
          style={{
            position: "relative", width: 28, height: TRACK_HEIGHT, cursor: "pointer",
            display: "flex", justifyContent: "center",
          }}
          onMouseDown={handleMouseDown}
        >
          {/* Piste */}
          <div style={{
            position: "absolute", left: "50%", top: 0, width: 4, height: TRACK_HEIGHT,
            transform: "translateX(-50%)",
            background: "linear-gradient(180deg, #888 0%, #bbb 100%)",
            border: "1px solid #666", borderRadius: 2,
          }} />
          {/* Graduations */}
          {[0, 25, 50, 75, 100].map(v => (
            <div key={v} style={{
              position: "absolute", top: TRACK_HEIGHT * (1 - v / 100),
              left: 2, right: 2, height: 1,
              background: v === 0 || v === 100 ? "transparent" : "rgba(0,0,0,0.15)",
            }} />
          ))}
          {/* Curseur */}
          <div style={{
            position: "absolute", left: 0, right: 0,
            top: Math.max(-THUMB_H / 2, Math.min(TRACK_HEIGHT - THUMB_H / 2, thumbTop)),
            height: THUMB_H, borderRadius: 2,
            background: "linear-gradient(180deg, #F8F8F8 0%, #C8C8C8 100%)",
            border: "1px solid #666",
            boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
          }} />
        </div>

        <div style={{ fontSize: 9, color: "#555", marginTop: 4 }}>-</div>

        {/* Pourcentage */}
        <div style={{ fontSize: 10, color: "#333", margin: "4px 0 2px", fontWeight: "bold" }}>{volume}%</div>

        {/* Checkbox mute */}
        <label style={{
          display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#333",
          cursor: "pointer", marginTop: 2, padding: "2px 0",
        }}>
          <input
            type="checkbox"
            checked={muted}
            onChange={toggleMute}
            style={{ width: 12, height: 12, cursor: "pointer" }}
          />
          Muet
        </label>
      </div>
    </div>
  );
}

const TrayNetwork = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="1" y="10" width="3" height="5" rx="0.5" fill="rgba(255,255,255,0.4)"/>
    <rect x="5" y="7" width="3" height="8" rx="0.5" fill="rgba(255,255,255,0.6)"/>
    <rect x="9" y="4" width="3" height="11" rx="0.5" fill="rgba(255,255,255,0.8)"/>
    <rect x="13" y="1" width="3" height="14" rx="0.5" fill="#fff"/>
  </svg>
);

const TrayMSN = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    {/* Papillon MSN stylisé */}
    <path d="M8 4C6 1 2 2 3 5c1 3 4 3 5 7" stroke="#fff" strokeWidth="1.3" fill="rgba(255,255,255,0.3)" strokeLinecap="round"/>
    <path d="M8 4c2-3 6-2 5 1-1 3-4 3-5 7" stroke="#fff" strokeWidth="1.3" fill="rgba(255,255,255,0.3)" strokeLinecap="round"/>
    <circle cx="8" cy="13" r="1" fill="#4CFF4C"/>
  </svg>
);

export default function Taskbar({ startMenu, setStartMenu, openWindowIds, isTopWindow, isMinimized, toggleMinimize, bringToFront, time, muted, toggleMute, volume, setVolume }) {
  const [showVolume, setShowVolume] = useState(false);

  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0, height: 42,
      background: "linear-gradient(180deg, #3168D5 0%, #1941A5 40%, #1D4BC5 60%, #245BDB 100%)",
      borderTop: "2px solid #5B9BFF", display: "flex", alignItems: "center",
      padding: "0 3px", zIndex: 100,
    }}>
      {/* Start button */}
      <button
        data-startbtn=""
        onClick={(e) => { e.stopPropagation(); playClick(); setStartMenu(!startMenu); }}
        style={{
          height: 34, padding: "0 14px", display: "flex", alignItems: "center", gap: 5,
          background: startMenu
            ? "linear-gradient(180deg, #2A6F2A 0%, #1A4F1A 100%)"
            : "linear-gradient(180deg, #3C9F3C 0%, #2A7F2A 50%, #1A5F1A 100%)",
          border: "1px solid #1A5F1A", borderRadius: "0 8px 8px 0", cursor: "pointer",
          color: "#fff", fontWeight: "bold", fontSize: 13, fontFamily: "'Tahoma', sans-serif",
          textShadow: "1px 1px 1px rgba(0,0,0,0.5)",
          boxShadow: startMenu ? "inset 1px 1px 3px rgba(0,0,0,0.3)" : "inset 0 1px 0 rgba(255,255,255,0.4), 1px 1px 3px rgba(0,0,0,0.2)",
          letterSpacing: 0.5,
        }}
      >
        <NostalImg src="/images/ui/start.svg" fallback="🪟" size={20} /> démarrer
      </button>

      {/* Separator */}
      <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.15)", margin: "0 4px" }} />

      {/* Open window tabs */}
      <div style={{ flex: 1, display: "flex", gap: 2, overflow: "hidden" }}>
        {openWindowIds.map((id) => {
          const icon = DESKTOP_ICONS.find(i => i.id === id);
          const minimizedState = isMinimized(id);
          const isTop = !minimizedState && isTopWindow(id);
          const handleTabClick = () => {
            if (minimizedState) {
              toggleMinimize(id);
            } else if (isTop) {
              toggleMinimize(id);
            } else {
              bringToFront(id);
            }
          };
          return icon ? (
            <button key={id} onClick={() => { playClick(); handleTabClick(); }} style={{
              height: 30, padding: "0 10px", maxWidth: 160,
              background: isTop ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)",
              border: isTop ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.1)",
              borderRadius: 3, color: "#fff", fontSize: 12, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 4, overflow: "hidden",
              textOverflow: "ellipsis", whiteSpace: "nowrap", flexShrink: 1,
              opacity: minimizedState ? 0.6 : 1,
            }}>
              <NostalImg src={icon.img} fallback={icon.emoji} size={16} style={{ flexShrink: 0 }} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{icon.label.split("\n")[0]}</span>
            </button>
          ) : null;
        })}
      </div>

      {/* System tray */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6, padding: "0 10px", height: 28,
        background: "linear-gradient(180deg, rgba(0,40,120,0.4) 0%, rgba(0,20,80,0.4) 100%)",
        borderLeft: "1px solid rgba(255,255,255,0.12)", borderRadius: 2,
      }}>
        <span
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          title={muted ? "Son coupé" : `Volume : ${volume}%`}
          onClick={(e) => { e.stopPropagation(); playClick(); setShowVolume(v => !v); }}
        >
          <TrayVolume size={15} muted={muted} volume={volume} />
        </span>
        {showVolume && (
          <VolumePopup
            volume={volume}
            setVolume={setVolume}
            muted={muted}
            toggleMute={toggleMute}
            onClose={() => setShowVolume(false)}
          />
        )}
        <span style={{ cursor: "pointer", display: "flex", alignItems: "center" }} title="Réseau">
          <TrayNetwork size={15} />
        </span>
        <span style={{ cursor: "pointer", display: "flex", alignItems: "center" }} title="MSN Messenger">
          <TrayMSN size={15} />
        </span>
        <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.1)" }} />
        <span
          style={{ color: "#fff", fontSize: 12, fontFamily: "'Tahoma', sans-serif", fontWeight: 500, letterSpacing: 0.3, cursor: "default" }}
          title={(() => {
            const jours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
            const mois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
            return `${jours[time.getDay()]} ${time.getDate()} ${mois[time.getMonth()]} 2005`;
          })()}
        >
          {time.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}
