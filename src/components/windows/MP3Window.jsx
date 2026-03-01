import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [bars, setBars] = useState(() => new Array(16).fill(15));
  const [displayDuration, setDisplayDuration] = useState(TRACKS[0]?.duration || "0:00");
  const [menuStack, setMenuStack] = useState([{ type: 'main' }]);
  const [volume, setVolumeState] = useState(0.1);
  const rafRef = useRef(null);
  const frameCount = useRef(0);

  // ── Navigation iPod ──────────────────────────────
  const currentView = menuStack[menuStack.length - 1];
  const pushView = (view) => setMenuStack(prev => [...prev, view]);
  const popView = () => setMenuStack(prev =>
    prev.length > 1 ? prev.slice(0, -1) : prev
  );

  const artists = useMemo(() =>
    [...new Set(TRACKS.map(t => t.title.split(' — ')[0]))].sort()
  , []);
  const genres = useMemo(() =>
    [...new Set(TRACKS.map(t => t.genre))].sort()
  , []);
  const tracksByArtist = (artist) =>
    TRACKS.map((t, i) => ({ ...t, idx: i })).filter(t => t.title.startsWith(artist + ' — '));
  const tracksByGenre = (genre) =>
    TRACKS.map((t, i) => ({ ...t, idx: i })).filter(t => t.genre === genre);

  // ── Callback quand un preview se termine ─────────
  const endedCbRef = useRef(null);
  endedCbRef.current = () => {
    if (repeat) {
      setProgress(0);
      setElapsed("0:00");
      chiptune.play(TRACKS[track], () => endedCbRef.current?.());
    } else {
      const next = shuffle
        ? Math.floor(Math.random() * TRACKS.length)
        : (track + 1) % TRACKS.length;
      setTrack(next);
      setProgress(0);
      setElapsed("0:00");
      chiptune.play(TRACKS[next], () => endedCbRef.current?.());
    }
  };
  const fireEnded = useCallback(() => endedCbRef.current?.(), []);

  const formatSecs = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  // ── Animation loop ───────────────────────────────
  const animate = useCallback(() => {
    frameCount.current++;
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
      setElapsed(formatSecs(chiptune.getElapsedTime()));
      const dur = chiptune.getTotalDuration();
      if (chiptune.getPlaybackMode() === 'preview' && dur > 0) {
        setDisplayDuration(formatSecs(dur));
      }
    }
    rafRef.current = requestAnimationFrame(animate);
  }, []);

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

  useEffect(() => {
    saveState('mp3_track', track);
    setDisplayDuration(TRACKS[track].duration);
  }, [track]);

  const endedRef = useRef(false);
  useEffect(() => {
    if (chiptune.getPlaybackMode() === 'chiptune' && playing && progress >= 99 && !endedRef.current) {
      endedRef.current = true;
      endedCbRef.current?.();
    }
    if (progress < 50) endedRef.current = false;
  }, [progress, playing]);

  useEffect(() => () => chiptune.destroy(), []);

  // ── Actions ──────────────────────────────────────
  const togglePlay = () => {
    if (!playing) {
      chiptune.play(TRACKS[track], fireEnded);
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
    if (playing) chiptune.play(TRACKS[next], fireEnded);
  };

  const prevTrack = () => {
    const prev = (track - 1 + TRACKS.length) % TRACKS.length;
    setTrack(prev);
    setProgress(0);
    setElapsed("0:00");
    if (playing) chiptune.play(TRACKS[prev], fireEnded);
  };

  const selectTrack = (i) => {
    setTrack(i);
    setProgress(0);
    setElapsed("0:00");
    chiptune.play(TRACKS[i], fireEnded);
    setPlaying(true);
  };

  const handleVolume = (e) => {
    const v = parseFloat(e.target.value);
    setVolumeState(v);
    chiptune.setVolume(v);
  };

  // ── Rendu menu (panneau gauche) ────────────────
  const menuItemStyle = (isActive) => ({
    padding: '6px 8px', cursor: 'pointer', borderRadius: 2, fontSize: 10,
    color: isActive ? '#0FF' : '#ccc', fontFamily: 'monospace',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    transition: 'background 0.1s',
  });

  const hoverOn = (e) => { e.currentTarget.style.background = 'rgba(0,255,255,0.12)'; };
  const hoverOff = (e, active) => { e.currentTarget.style.background = active ? 'rgba(0,255,255,0.06)' : 'transparent'; };

  const renderMenuItem = (label, onClick, { arrow, active, icon } = {}) => (
    <div key={label} onClick={onClick} style={menuItemStyle(active)}
      onMouseEnter={hoverOn} onMouseLeave={e => hoverOff(e, active)}>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
        {icon || ''}{label}
      </span>
      {arrow && <span style={{ color: '#555', marginLeft: 4, fontSize: 12 }}>›</span>}
    </div>
  );

  const renderTrackRow = (label, idx, duration) => {
    const active = idx === track;
    const icon = active && playing ? '♪ ' : '';
    return (
      <div key={idx} onClick={() => selectTrack(idx)} style={menuItemStyle(active)}
        onMouseEnter={hoverOn} onMouseLeave={e => hoverOff(e, active)}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
          {icon}{label}
        </span>
        <span style={{ color: '#555', fontSize: 8, marginLeft: 4, flexShrink: 0 }}>{duration}</span>
      </div>
    );
  };

  const listWrap = { flex: 1, overflowY: 'auto', overflowX: 'hidden' };

  const renderMenu = () => {
    const v = currentView;
    switch (v.type) {
      case 'main':
        return (<>
          <div style={listWrap}>
            {renderMenuItem('Artistes', () => pushView({ type: 'artists' }), { arrow: true })}
            {renderMenuItem('Genres', () => pushView({ type: 'genres' }), { arrow: true })}
            {renderMenuItem(`Pistes (${TRACKS.length})`, () => pushView({ type: 'songs' }), { arrow: true })}
            {renderMenuItem('Aléatoire', () => { const i = Math.floor(Math.random() * TRACKS.length); selectTrack(i); setShuffle(true); })}
          </div>
        </>);

      case 'artists':
        return (<div style={listWrap}>
          {artists.map(a => renderMenuItem(a, () => pushView({ type: 'artist', artist: a }), {
            arrow: true, active: TRACKS[track]?.title.startsWith(a + ' — '),
          }))}
        </div>);

      case 'artist':
        return (<div style={listWrap}>
          {tracksByArtist(v.artist).map(t =>
            renderTrackRow(t.title.split(' — ')[1] || t.title, t.idx, t.duration)
          )}
        </div>);

      case 'genres':
        return (<div style={listWrap}>
          {genres.map(g => renderMenuItem(`${g} (${tracksByGenre(g).length})`, () => pushView({ type: 'genre', genre: g }), {
            arrow: true, active: TRACKS[track]?.genre === g,
          }))}
        </div>);

      case 'genre':
        return (<div style={listWrap}>
          {tracksByGenre(v.genre).map(t => renderTrackRow(t.title, t.idx, t.duration))}
        </div>);

      case 'songs':
        return (<div style={listWrap}>
          {TRACKS.map((t, i) => renderTrackRow(t.title, i, t.duration))}
        </div>);

      default:
        return null;
    }
  };

  // Titre du menu courant pour la barre de navigation
  const menuTitle = (() => {
    switch (currentView.type) {
      case 'main': return 'Musiques';
      case 'artists': return 'Artistes';
      case 'artist': return currentView.artist;
      case 'genres': return 'Genres';
      case 'genre': return currentView.genre;
      case 'songs': return 'Pistes';
      default: return 'iPod';
    }
  })();

  // ── Rendu ────────────────────────────────────────
  const ipodColor = "#F0F0F0";

  return (
    <Win title="iPod — Lecteur Musical" onClose={() => { chiptune.destroy(); onClose(); }} onMinimize={onMinimize} width={460} height={530} zIndex={zIndex} onFocus={onFocus} initialPos={{ x: 280, y: 40 }} color="#555">
      <div style={{ background: `linear-gradient(180deg, ${ipodColor} 0%, #D8D8D8 100%)`, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 14px" }}>

        {/* ── iPod Screen (split) ─────────────── */}
        <div style={{
          width: '100%', flex: 1, minHeight: 160, background: "#1a1a2e", borderRadius: 6,
          border: "2px solid #888", display: "flex", overflow: 'hidden',
          boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5), 0 1px 2px rgba(255,255,255,0.5)",
        }}>
          {/* Panneau gauche — Menu */}
          <div style={{ flex: '0 0 40%', minWidth: 130, maxWidth: 200, display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(0,255,255,0.1)', padding: '6px 4px' }}>
            {/* Barre navigation */}
            <div style={{
              display: 'flex', alignItems: 'center', marginBottom: 3,
              padding: '2px 4px', background: 'linear-gradient(180deg, rgba(0,255,255,0.12) 0%, rgba(0,255,255,0.04) 100%)',
              borderRadius: 2, borderBottom: '1px solid rgba(0,255,255,0.1)',
            }}>
              {menuStack.length > 1 && (
                <span onClick={popView} style={{ color: '#0FF', fontSize: 10, cursor: 'pointer', marginRight: 4, fontFamily: 'monospace' }}>‹</span>
              )}
              <span style={{ color: '#0FF', fontSize: 9, fontFamily: 'monospace', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                {menuTitle}
              </span>
            </div>
            {renderMenu()}
          </div>

          {/* Panneau droit — En lecture */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '6px 8px' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 3, padding: '2px 4px',
              background: 'linear-gradient(180deg, rgba(0,255,255,0.12) 0%, rgba(0,255,255,0.04) 100%)',
              borderRadius: 2, borderBottom: '1px solid rgba(0,255,255,0.1)',
            }}>
              <span style={{ color: '#0FF', fontSize: 9, fontFamily: 'monospace', fontWeight: 'bold' }}>
                {playing ? '♪ ' : ''}En lecture
              </span>
              <span style={{ color: '#555', fontSize: 8, fontFamily: 'monospace' }}>🔋</span>
            </div>
            <div style={{ textAlign: "center", marginBottom: 2, flex: '1 1 0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0, overflow: 'hidden' }}>
              <NostalImg src={TRACKS[track].cover} fallback="🎵" size={68} style={{ borderRadius: 4, maxHeight: '100%' }} />
            </div>
            <div style={{ color: "#fff", fontSize: 11, fontWeight: "bold", textAlign: "center", marginBottom: 1, fontFamily: "monospace", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 2px' }}>
              {TRACKS[track].title}
            </div>
            <div style={{ color: "#777", fontSize: 8, textAlign: "center", marginBottom: 4, fontFamily: "monospace" }}>
              {TRACKS[track].genre} — {TRACKS[track].duration}
            </div>
            {/* Visualizer */}
            <div style={{ display: "flex", gap: 1, justifyContent: "center", marginBottom: 4, height: 18, alignItems: "flex-end" }}>
              {bars.map((h, i) => (
                <div key={i} style={{
                  width: 6, background: `hsl(${180 + i * 8}, 100%, 50%)`,
                  height: `${h}%`, borderRadius: 1, transition: "height 0.08s",
                  opacity: playing ? 0.9 : 0.3,
                }} />
              ))}
            </div>
            {/* Progress */}
            <div style={{ width: "100%", height: 3, background: "#333", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #0FF, #0AF)", transition: "width 0.1s" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
              <span style={{ color: "#555", fontSize: 7, fontFamily: "monospace" }}>{elapsed}</span>
              <span style={{ color: "#555", fontSize: 7, fontFamily: "monospace" }}>{displayDuration}</span>
            </div>
          </div>
        </div>

        {/* ── Click Wheel ────────────────────── */}
        <div style={{
          width: 170, height: 170, borderRadius: "50%", marginTop: 20,
          background: "linear-gradient(145deg, #eee, #ccc)",
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
          <div onClick={popView} style={{ position: "absolute", top: 10, cursor: "pointer", fontSize: 10, color: "#555", fontWeight: "bold" }}>MENU</div>
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
