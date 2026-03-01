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
  const [menuStack, setMenuStack] = useState([{ type: 'now_playing' }]);
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

  const playRandom = () => {
    const i = Math.floor(Math.random() * TRACKS.length);
    selectTrack(i);
    setShuffle(true);
    pushView({ type: 'now_playing' });
  };

  // ── Rendu écran iPod ─────────────────────────────
  const headerStyle = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '3px 6px', background: 'linear-gradient(180deg, rgba(0,255,255,0.15) 0%, rgba(0,255,255,0.05) 100%)',
    borderRadius: 3, marginBottom: 4, borderBottom: '1px solid rgba(0,255,255,0.15)',
  };

  const menuItemStyle = (isActive) => ({
    padding: '5px 8px', cursor: 'pointer', borderRadius: 2, fontSize: 11,
    color: isActive ? '#0FF' : '#ddd', fontFamily: 'monospace',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    transition: 'background 0.1s',
  });

  const renderHeader = (title) => (
    <div style={headerStyle}>
      <span style={{ color: '#0FF', fontSize: 10, fontFamily: 'monospace', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {title}
      </span>
      <span style={{ color: '#555', fontSize: 9, fontFamily: 'monospace', flexShrink: 0, marginLeft: 6 }}>
        {playing ? '♪' : ''} 🔋
      </span>
    </div>
  );

  const renderMenuItem = (label, onClick, { arrow, active, icon } = {}) => (
    <div
      key={label}
      onClick={onClick}
      style={menuItemStyle(active)}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,255,255,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
    >
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
        {icon || ''}{label}
      </span>
      {arrow && <span style={{ color: '#555', marginLeft: 4, fontSize: 13 }}>›</span>}
    </div>
  );

  const renderTrackItem = (t, idx) => {
    const isPlaying = idx === track && playing;
    const isCurrent = idx === track;
    return (
      <div
        key={idx}
        onClick={() => { selectTrack(idx); pushView({ type: 'now_playing' }); }}
        style={menuItemStyle(isCurrent)}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,255,255,0.12)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
          {isPlaying ? '♪ ' : ''}{t.title}
        </span>
        <span style={{ color: '#555', fontSize: 9, marginLeft: 6, flexShrink: 0 }}>{t.duration}</span>
      </div>
    );
  };

  const listWrapStyle = { flex: 1, overflowY: 'auto', overflowX: 'hidden' };

  const renderScreen = () => {
    const v = currentView;
    switch (v.type) {
      case 'main':
        return (<>
          {renderHeader('iPod')}
          <div style={listWrapStyle}>
            {renderMenuItem('Musiques', () => pushView({ type: 'music' }), { arrow: true })}
            {playing && renderMenuItem('En lecture', () => pushView({ type: 'now_playing' }), { arrow: true, icon: '♪ ' })}
            {renderMenuItem('Lecture aléatoire', playRandom)}
          </div>
        </>);

      case 'music':
        return (<>
          {renderHeader('Musiques')}
          <div style={listWrapStyle}>
            {renderMenuItem('Artistes', () => pushView({ type: 'artists' }), { arrow: true })}
            {renderMenuItem('Genres', () => pushView({ type: 'genres' }), { arrow: true })}
            {renderMenuItem(`Toutes les pistes (${TRACKS.length})`, () => pushView({ type: 'songs' }), { arrow: true })}
          </div>
        </>);

      case 'artists':
        return (<>
          {renderHeader('Artistes')}
          <div style={listWrapStyle}>
            {artists.map(a => renderMenuItem(a, () => pushView({ type: 'artist', artist: a }), {
              arrow: true,
              active: TRACKS[track]?.title.startsWith(a + ' — '),
            }))}
          </div>
        </>);

      case 'artist': {
        const list = tracksByArtist(v.artist);
        return (<>
          {renderHeader(v.artist)}
          <div style={listWrapStyle}>
            {list.map(t => {
              const songName = t.title.split(' — ')[1] || t.title;
              const isPlaying = t.idx === track && playing;
              const isCurrent = t.idx === track;
              return (
                <div key={t.idx}
                  onClick={() => { selectTrack(t.idx); pushView({ type: 'now_playing' }); }}
                  style={menuItemStyle(isCurrent)}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,255,255,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {isPlaying ? '♪ ' : ''}{songName}
                  </span>
                  <span style={{ color: '#555', fontSize: 9, marginLeft: 6, flexShrink: 0 }}>{t.duration}</span>
                </div>
              );
            })}
          </div>
        </>);
      }

      case 'genres':
        return (<>
          {renderHeader('Genres')}
          <div style={listWrapStyle}>
            {genres.map(g => {
              const count = tracksByGenre(g).length;
              return renderMenuItem(`${g} (${count})`, () => pushView({ type: 'genre', genre: g }), {
                arrow: true,
                active: TRACKS[track]?.genre === g,
              });
            })}
          </div>
        </>);

      case 'genre': {
        const list = tracksByGenre(v.genre);
        return (<>
          {renderHeader(v.genre)}
          <div style={listWrapStyle}>
            {list.map(t => renderTrackItem(t, t.idx))}
          </div>
        </>);
      }

      case 'songs':
        return (<>
          {renderHeader(`Pistes (${TRACKS.length})`)}
          <div style={listWrapStyle}>
            {TRACKS.map((t, i) => renderTrackItem(t, i))}
          </div>
        </>);

      case 'now_playing':
      default:
        return (<>
          {renderHeader('En lecture')}
          <div style={{ textAlign: "center", marginBottom: 2 }}>
            <NostalImg src={TRACKS[track].cover} fallback="🎵" size={72} style={{ borderRadius: 4 }} />
          </div>
          <div style={{ color: "#fff", fontSize: 12, fontWeight: "bold", textAlign: "center", marginBottom: 2, fontFamily: "monospace", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 4px' }}>
            {TRACKS[track].title}
          </div>
          <div style={{ color: "#888", fontSize: 9, textAlign: "center", marginBottom: 6, fontFamily: "monospace" }}>
            {TRACKS[track].genre} — {TRACKS[track].duration}
          </div>
          <div style={{ display: "flex", gap: 2, justifyContent: "center", marginBottom: 6, height: 22, alignItems: "flex-end" }}>
            {bars.map((h, i) => (
              <div key={i} style={{
                width: 8, background: `hsl(${180 + i * 8}, 100%, 50%)`,
                height: `${h}%`, borderRadius: 1, transition: "height 0.08s",
                opacity: playing ? 0.9 : 0.3,
              }} />
            ))}
          </div>
          <div style={{ width: "100%", height: 3, background: "#333", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #0FF, #0AF)", transition: "width 0.1s" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
            <span style={{ color: "#666", fontSize: 8, fontFamily: "monospace" }}>{elapsed}</span>
            <span style={{ color: "#666", fontSize: 8, fontFamily: "monospace" }}>{displayDuration}</span>
          </div>
        </>);
    }
  };

  // ── Rendu ────────────────────────────────────────
  const ipodColor = "#F0F0F0";

  return (
    <Win title="iPod — Lecteur Musical" onClose={() => { chiptune.destroy(); onClose(); }} onMinimize={onMinimize} width={360} height={520} zIndex={zIndex} onFocus={onFocus} initialPos={{ x: 320, y: 50 }} color="#555">
      <div style={{ background: `linear-gradient(180deg, ${ipodColor} 0%, #D8D8D8 100%)`, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "14px 12px" }}>
        {/* iPod Screen */}
        <div style={{
          width: 230, height: 210, background: "#1a1a2e", borderRadius: 6,
          border: "2px solid #888", padding: 10, display: "flex", flexDirection: "column",
          boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5), 0 1px 2px rgba(255,255,255,0.5)",
        }}>
          {renderScreen()}
        </div>

        {/* Click Wheel */}
        <div style={{
          width: 170, height: 170, borderRadius: "50%", marginTop: 14,
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
