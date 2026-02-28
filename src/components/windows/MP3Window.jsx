import { useState, useEffect } from "react";
import Win from "../Win";
import NostalImg from "../NostalImg";
import { TRACKS } from "../../data/tracks";

export default function MP3Window({ onClose, onMinimize, zIndex, onFocus }) {
  const [track, setTrack] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const iv = setInterval(() => setProgress(p => {
      if (p >= 100) { setTrack(t => (t + 1) % TRACKS.length); return 0; }
      return p + 0.4;
    }), 100);
    return () => clearInterval(iv);
  }, [playing]);

  const ipodColor = "#F0F0F0";

  return (
    <Win title="iPod — Lecteur Musical" onClose={onClose} onMinimize={onMinimize} width={280} height={450} zIndex={zIndex} onFocus={onFocus} initialPos={{ x: 320, y: 50 }} color="#555">
      <div style={{ background: `linear-gradient(180deg, ${ipodColor} 0%, #D8D8D8 100%)`, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "14px 12px" }}>
        {/* iPod Screen */}
        <div style={{
          width: 230, height: showPlaylist ? 200 : 210, background: "#1a1a2e", borderRadius: 6,
          border: "2px solid #888", padding: 10, display: "flex", flexDirection: "column",
          boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5), 0 1px 2px rgba(255,255,255,0.5)",
          transition: "height 0.2s",
        }}>
          {showPlaylist ? (
            <div style={{ flex: 1, overflowY: "auto" }}>
              <div style={{ color: "#0FF", fontSize: 9, marginBottom: 6, fontFamily: "monospace", textAlign: "center" }}>♪ PLAYLIST ♪</div>
              {TRACKS.map((t, i) => (
                <div key={i} onClick={() => { setTrack(i); setProgress(0); setPlaying(true); setShowPlaylist(false); }}
                  style={{
                    padding: "4px 6px", cursor: "pointer", borderRadius: 3, fontSize: 10,
                    color: i === track ? "#0FF" : "#aaa", fontFamily: "monospace",
                    background: i === track ? "rgba(0,255,255,0.1)" : "transparent",
                    transition: "all 0.15s", marginBottom: 1,
                  }}
                  onMouseEnter={e => e.target.style.background = "rgba(0,255,255,0.08)"}
                  onMouseLeave={e => e.target.style.background = i === track ? "rgba(0,255,255,0.1)" : "transparent"}
                >
                  {i + 1}. {t.title}
                </div>
              ))}
            </div>
          ) : (
            <>
              <div style={{ color: "#0FF", fontSize: 9, marginBottom: 4, fontFamily: "monospace", textAlign: "center" }}>♪ NOW PLAYING ♪</div>
              <div style={{ textAlign: "center", marginBottom: 4 }}>
                <NostalImg src={TRACKS[track].cover} fallback="🎵" size={60} style={{ borderRadius: 4 }} />
              </div>
              <div style={{ color: "#fff", fontSize: 12, fontWeight: "bold", textAlign: "center", marginBottom: 2, fontFamily: "monospace" }}>
                {TRACKS[track].title}
              </div>
              <div style={{ color: "#888", fontSize: 9, textAlign: "center", marginBottom: 8, fontFamily: "monospace" }}>
                {TRACKS[track].genre} — {TRACKS[track].duration}
              </div>
              {/* Visualizer bars */}
              <div style={{ display: "flex", gap: 2, justifyContent: "center", marginBottom: 8, height: 24, alignItems: "flex-end" }}>
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} style={{
                    width: 8, background: `hsl(${180 + i * 8}, 100%, 50%)`,
                    height: playing ? `${15 + Math.random() * 85}%` : "15%",
                    borderRadius: 1, transition: playing ? "height 0.15s" : "height 0.5s",
                    opacity: playing ? 0.9 : 0.3,
                  }} />
                ))}
              </div>
              {/* Progress */}
              <div style={{ width: "100%", height: 3, background: "#333", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #0FF, #0AF)", transition: "width 0.1s" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                <span style={{ color: "#666", fontSize: 8, fontFamily: "monospace" }}>{Math.floor(progress * 0.042)}:{String(Math.floor(progress * 2.5) % 60).padStart(2, "0")}</span>
                <span style={{ color: "#666", fontSize: 8, fontFamily: "monospace" }}>{TRACKS[track].duration}</span>
              </div>
            </>
          )}
        </div>

        {/* Click Wheel */}
        <div style={{
          width: 170, height: 170, borderRadius: "50%", marginTop: 14,
          background: `linear-gradient(145deg, #eee, #ccc)`,
          boxShadow: "0 4px 14px rgba(0,0,0,0.3), inset 0 1px 3px rgba(255,255,255,0.8), inset 0 -1px 3px rgba(0,0,0,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
        }}>
          <button onClick={() => setPlaying(!playing)} style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "linear-gradient(145deg, #e0e0e0, #b8b8b8)",
            border: "1px solid #999", cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.6)", zIndex: 2,
            fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center",
          }}>{playing ? "⏸" : "▶️"}</button>
          {/* Wheel labels */}
          <div onClick={() => setShowPlaylist(!showPlaylist)} style={{ position: "absolute", top: 10, cursor: "pointer", fontSize: 10, color: "#555", fontWeight: "bold" }}>MENU</div>
          <div onClick={() => setTrack(t => (t + 1) % TRACKS.length)} style={{ position: "absolute", bottom: 10, cursor: "pointer", fontSize: 14, color: "#555" }}>⏭</div>
          <div onClick={() => { setTrack(t => (t - 1 + TRACKS.length) % TRACKS.length); setProgress(0); }} style={{ position: "absolute", left: 14, cursor: "pointer", fontSize: 14, color: "#555" }}>⏮</div>
          <div style={{ position: "absolute", right: 14, cursor: "pointer", fontSize: 14, color: "#555" }}>⏩</div>
        </div>
      </div>
    </Win>
  );
}
