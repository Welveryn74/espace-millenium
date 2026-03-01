import { useState, useEffect, useRef, useCallback } from "react";
import Win from "../Win";
import NostalImg from "../NostalImg";
import { TRACKS } from "../../data/tracks";
import * as chiptune from "../../utils/chiptunePlayer";
import { loadState, saveState } from "../../utils/storage";

export default function MP3Window({ onClose, onMinimize, zIndex, onFocus }) {
  const [track, setTrack] = useState(() => loadState('mp3_track', 0));
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState("0:00");
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [bars, setBars] = useState(() => new Array(16).fill(15));
  const rafRef = useRef(null);
  const frameCount = useRef(0);

  // Animation loop: read frequency data + update progress
  const animate = useCallback(() => {
    frameCount.current++;
    // Throttle React updates to ~15fps (1 frame sur 4 à 60fps)
    if (frameCount.current % 4 === 0) {
      const freq = chiptune.getFrequencyData();
      const newBars = [];
      for (let i = 0; i < 16; i++) {
        const val = freq[i] || 0;
        newBars.push(15 + (val / 255) * 85);
      }
      setBars(newBars);

      const p = chiptune.getProgress();
      setProgress(p);
      const el = chiptune.getElapsedTime();
      const mins = Math.floor(el / 60);
      const secs = Math.floor(el % 60);
      setElapsed(`${mins}:${String(secs).padStart(2, "0")}`);
    }
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  // Start/stop animation loop
  useEffect(() => {
    if (playing) {
      frameCount.current = 0;
      rafRef.current = requestAnimationFrame(animate);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setBars(new Array(16).fill(15));
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [playing, animate]);

  // Persist current track
  useEffect(() => {
    saveState('mp3_track', track);
  }, [track]);

  // Play track when track changes while playing
  useEffect(() => {
    if (playing && TRACKS[track].melody) {
      chiptune.play(TRACKS[track].melody);
    }
  }, [track, playing]);

  // Auto-next or repeat when track ends
  const endedRef = useRef(false);
  useEffect(() => {
    if (playing && progress >= 99 && !endedRef.current) {
      endedRef.current = true;
      if (repeat) {
        setProgress(0);
        setElapsed("0:00");
        if (TRACKS[track].melody) chiptune.play(TRACKS[track].melody);
      } else {
        nextTrack();
      }
    }
    if (progress < 50) endedRef.current = false;
  }, [progress, playing]);

  // Cleanup on unmount
  useEffect(() => () => chiptune.destroy(), []);

  const togglePlay = () => {
    if (!playing) {
      if (TRACKS[track].melody) chiptune.play(TRACKS[track].melody);
      setPlaying(true);
    } else {
      chiptune.stop();
      setPlaying(false);
      setProgress(0);
      setElapsed("0:00");
    }
  };

  const nextTrack = () => {
    const next = shuffle
      ? Math.floor(Math.random() * TRACKS.length)
      : (track + 1) % TRACKS.length;
    setTrack(next);
    setProgress(0);
    setElapsed("0:00");
  };

  const prevTrack = () => {
    const prev = (track - 1 + TRACKS.length) % TRACKS.length;
    setTrack(prev);
    setProgress(0);
    setElapsed("0:00");
  };

  const selectTrack = (i) => {
    setTrack(i);
    setProgress(0);
    setElapsed("0:00");
    if (TRACKS[i].melody) chiptune.play(TRACKS[i].melody);
    setPlaying(true);
    setShowPlaylist(false);
  };

  const ipodColor = "#F0F0F0";

  return (
    <Win title="iPod — Lecteur Musical" onClose={() => { chiptune.destroy(); onClose(); }} onMinimize={onMinimize} width={360} height={520} zIndex={zIndex} onFocus={onFocus} initialPos={{ x: 320, y: 50 }} color="#555">
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
                <div key={i} onClick={() => selectTrack(i)}
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
                <NostalImg src={TRACKS[track].cover} fallback="🎵" size={80} style={{ borderRadius: 4 }} />
              </div>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: "bold", textAlign: "center", marginBottom: 2, fontFamily: "monospace" }}>
                {TRACKS[track].title}
              </div>
              <div style={{ color: "#888", fontSize: 9, textAlign: "center", marginBottom: 8, fontFamily: "monospace" }}>
                {TRACKS[track].genre} — {TRACKS[track].duration}
              </div>
              {/* Visualizer bars — driven by real frequency data */}
              <div style={{ display: "flex", gap: 2, justifyContent: "center", marginBottom: 8, height: 24, alignItems: "flex-end" }}>
                {bars.map((h, i) => (
                  <div key={i} style={{
                    width: 8, background: `hsl(${180 + i * 8}, 100%, 50%)`,
                    height: `${h}%`,
                    borderRadius: 1, transition: "height 0.08s",
                    opacity: playing ? 0.9 : 0.3,
                  }} />
                ))}
              </div>
              {/* Progress */}
              <div style={{ width: "100%", height: 3, background: "#333", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #0FF, #0AF)", transition: "width 0.1s" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                <span style={{ color: "#666", fontSize: 8, fontFamily: "monospace" }}>{elapsed}</span>
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
          <button onClick={togglePlay} style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "linear-gradient(145deg, #e0e0e0, #b8b8b8)",
            border: "1px solid #999", cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.6)", zIndex: 2,
            fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center",
          }}>{playing ? "⏸" : "▶️"}</button>
          {/* Wheel labels */}
          <div onClick={() => setShowPlaylist(!showPlaylist)} style={{ position: "absolute", top: 10, cursor: "pointer", fontSize: 10, color: "#555", fontWeight: "bold" }}>MENU</div>
          <div style={{ position: "absolute", bottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
            <span onClick={() => setRepeat(r => !r)} style={{ cursor: "pointer", fontSize: 12, color: repeat ? "#0FF" : "#555" }} title={repeat ? "Repeat: ON" : "Repeat: OFF"}>🔁</span>
            <span onClick={nextTrack} style={{ cursor: "pointer", fontSize: 14, color: "#555" }}>⏭</span>
          </div>
          <div onClick={prevTrack} style={{ position: "absolute", left: 14, cursor: "pointer", fontSize: 14, color: "#555" }}>⏮</div>
          <div onClick={() => setShuffle(s => !s)} style={{ position: "absolute", right: 14, cursor: "pointer", fontSize: 14, color: shuffle ? "#0FF" : "#555" }} title={shuffle ? "Shuffle: ON" : "Shuffle: OFF"}>🔀</div>
        </div>
      </div>
    </Win>
  );
}
