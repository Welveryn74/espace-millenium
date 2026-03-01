import { useState, useEffect, useRef, useId } from "react";
import Win from "../Win";
import NostalImg from "../NostalImg";
import { CHANNELS, PUBS_2000 } from "../../data/channels";
import { tvBtnBase } from "../../styles/windowStyles";
import { playTVStatic } from "../../utils/uiSounds";
import { loadState, saveState } from "../../utils/storage";
import { createVideoPlayer } from "../../utils/videoPlayer";

function BtnTV({ onClick, children }) {
  return <button onClick={onClick} style={tvBtnBase}>{children}</button>;
}

// --- Sub-components per channel type ---

function MinikeumsContent({ content, tick }) {
  const d = content.dialogues[tick % content.dialogues.length];
  const prev = content.dialogues[(tick - 1 + content.dialogues.length) % content.dialogues.length];
  return (
    <div style={{ textAlign: "center", width: "100%" }}>
      <div style={{ color: "#666", fontSize: 9, marginBottom: 8, fontStyle: "italic", opacity: 0.6, transition: "opacity 0.3s" }}>
        {prev.speaker} : {prev.text}
      </div>
      <div style={{ animation: "slideUp 0.4s ease-out", key: tick }}>
        <span style={{ color: "#FFD700", fontSize: 11, fontWeight: "bold" }}>{d.speaker}</span>
        <div style={{ color: "#fff", fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>{d.text}</div>
      </div>
    </div>
  );
}

function KD2AContent({ content, tick }) {
  const offset = tick % content.programme.length;
  const visible = content.programme.slice(offset, offset + 4).concat(
    content.programme.slice(0, Math.max(0, offset + 4 - content.programme.length))
  );
  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      <div style={{ color: "#FF69B4", fontSize: 10, textAlign: "center", marginBottom: 6, fontWeight: "bold", animation: "pulse 2s infinite" }}>
        PROGRAMME DU JOUR
      </div>
      {visible.map((p, i) => (
        <div key={p.time} style={{
          display: "flex", gap: 8, padding: "3px 10px", fontSize: 11,
          color: i === 0 ? "#FF69B4" : "#aaa",
          background: i === 0 ? "rgba(255,105,180,0.1)" : "transparent",
          borderRadius: 3, transition: "all 0.4s", animation: `slideUp 0.3s ease-out ${i * 0.08}s both`,
        }}>
          <span style={{ fontFamily: "monospace", minWidth: 40 }}>{p.time}</span>
          <span>{p.show}</span>
          {i === 0 && <span style={{ marginLeft: "auto", animation: "blink 1s infinite", color: "#F44" }}>EN COURS</span>}
        </div>
      ))}
    </div>
  );
}

function StarAcContent({ content, tick }) {
  const lyric = content.lyrics[tick % content.lyrics.length];
  const nominee = content.nominees[tick % content.nominees.length];
  return (
    <div style={{ textAlign: "center", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: 10 }}>
        <span style={{ color: "#F44", fontSize: 9, animation: "blink 1s infinite", fontWeight: "bold" }}>EN DIRECT</span>
        <span style={{ color: "#F44", fontSize: 9 }}>PRIME N\u00b0{7 + (tick % 5)}</span>
      </div>
      <div key={tick} style={{ color: "#FF4", fontSize: 14, fontStyle: "italic", animation: "fadeIn 0.5s ease-out", marginBottom: 12, textShadow: "0 0 10px rgba(255,255,0,0.3)" }}>
        {lyric}
      </div>
      <div style={{ color: "#F88", fontSize: 10, borderTop: "1px solid #333", paddingTop: 6 }}>
        Nomin\u00e9(e) : <span style={{ fontWeight: "bold", color: "#FF4444" }}>{nominee}</span> \u2014 Votez au 3672 !
      </div>
    </div>
  );
}

function LoftContent({ content, tick }) {
  const event = content.events[tick % content.events.length];
  const isConfessionnal = event.includes("confessionnal");
  return (
    <div style={{ textAlign: "center", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: 8 }}>
        <span style={{ color: "#F44", fontSize: 9, animation: "blink 1s infinite" }}>
          {isConfessionnal ? "CONFESSIONNAL" : "REC"}
        </span>
        <span style={{ color: "#44AAFF", fontSize: 10, fontWeight: "bold" }}>JOUR {content.day + (tick % 3)}</span>
      </div>
      <div key={tick} style={{ color: "#ddd", fontSize: 12, animation: "fadeIn 0.5s ease-out", lineHeight: 1.6, fontStyle: "italic" }}>
        {event}
      </div>
      <div style={{ marginTop: 10, display: "flex", gap: 8, justifyContent: "center" }}>
        {["Cam 1", "Cam 2", "Cam 3"].map((c, i) => (
          <span key={c} style={{
            fontSize: 8, padding: "2px 6px", borderRadius: 2,
            background: tick % 3 === i ? "rgba(68,170,255,0.3)" : "rgba(255,255,255,0.05)",
            color: tick % 3 === i ? "#44AAFF" : "#666",
            border: `1px solid ${tick % 3 === i ? "#44AAFF" : "#333"}`,
          }}>{c}</span>
        ))}
      </div>
    </div>
  );
}

function MangaContent({ content, tick }) {
  const panel = content.panels[tick % content.panels.length];
  const styles = {
    action: { color: "#FF4444", fontSize: 15, fontWeight: "bold", fontStyle: "italic", textShadow: "0 0 10px rgba(255,0,0,0.4)", letterSpacing: 1 },
    dialogue: { color: "#ddd", fontSize: 12, fontStyle: "italic", borderLeft: "3px solid #44FF88", paddingLeft: 10 },
    impact: { color: "#FFD700", fontSize: 20, fontWeight: "bold", textShadow: "0 0 15px rgba(255,215,0,0.5), 2px 2px 0 #000", letterSpacing: 3 },
    narrator: { color: "#999", fontSize: 11, fontStyle: "italic", borderTop: "1px solid #333", borderBottom: "1px solid #333", padding: "6px 0" },
  };
  return (
    <div style={{ textAlign: "center", width: "100%" }}>
      <div style={{ color: "#44FF88", fontSize: 9, marginBottom: 8, fontWeight: "bold" }}>
        CANAL J \u2014 CLUB MANGA
      </div>
      <div key={tick} style={{ ...styles[panel.style], animation: panel.style === "impact" ? "pulse 0.5s ease-out" : "fadeIn 0.4s ease-out" }}>
        {panel.text}
      </div>
      <div style={{ marginTop: 10, display: "flex", justifyContent: "center", gap: 4 }}>
        {content.panels.map((_, i) => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: "50%",
            background: i === tick % content.panels.length ? "#44FF88" : "#333",
            transition: "background 0.3s",
          }} />
        ))}
      </div>
    </div>
  );
}

function PokemonContent({ content, tick }) {
  const scene = content.scenes[tick % content.scenes.length];
  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      {scene.type === "narrator" && (
        <div key={tick} style={{ color: "#FFAA00", fontSize: 12, fontStyle: "italic", animation: "fadeIn 0.5s ease-out", lineHeight: 1.6 }}>
          {scene.text}
        </div>
      )}
      {scene.type === "attack" && (
        <div key={tick} style={{ animation: "fadeIn 0.3s ease-out" }}>
          <div style={{ color: "#FF4", fontSize: 13, fontWeight: "bold", marginBottom: 4 }}>
            {scene.text}
          </div>
          <div style={{
            width: 60, height: 4, margin: "0 auto", borderRadius: 2,
            background: "linear-gradient(90deg, #FF4, #F80)",
            animation: "pulse 0.3s ease-out 3",
          }} />
        </div>
      )}
      {scene.type === "hp" && (
        <div key={tick} style={{ animation: "fadeIn 0.3s ease-out" }}>
          <div style={{ color: "#aaa", fontSize: 10, marginBottom: 4 }}>{scene.target}</div>
          <div style={{ width: 140, height: 8, background: "#333", borderRadius: 4, margin: "0 auto", overflow: "hidden", border: "1px solid #555" }}>
            <div style={{
              width: `${scene.pct}%`, height: "100%",
              background: scene.pct > 50 ? "#4F4" : scene.pct > 20 ? "#FF0" : "#F44",
              transition: "width 0.8s",
              borderRadius: 3,
            }} />
          </div>
          <div style={{ color: "#888", fontSize: 9, marginTop: 2 }}>PV : {scene.pct}%</div>
        </div>
      )}
      {scene.type === "dialogue" && (
        <div key={tick} style={{ color: "#fff", fontSize: 12, fontStyle: "italic", animation: "slideUp 0.4s ease-out", lineHeight: 1.6 }}>
          {scene.text}
        </div>
      )}
    </div>
  );
}

function ChannelContent({ channel, tick }) {
  const { type, content } = channel;
  switch (type) {
    case "minikeums": return <MinikeumsContent content={content} tick={tick} />;
    case "kd2a": return <KD2AContent content={content} tick={tick} />;
    case "starac": return <StarAcContent content={content} tick={tick} />;
    case "loft": return <LoftContent content={content} tick={tick} />;
    case "manga": return <MangaContent content={content} tick={tick} />;
    case "pokemon": return <PokemonContent content={content} tick={tick} />;
    default: return <div style={{ color: "#bbb", fontSize: 11, textAlign: "center", fontStyle: "italic" }}>{channel.desc || "Pas de signal"}</div>;
  }
}

// --- Main TVWindow ---

export default function TVWindow({ onClose, onMinimize, zIndex, onFocus }) {
  const [channel, setChannel] = useState(() => loadState("tv_channel", 0));
  const [staticEffect, setStaticEffect] = useState(false);
  const [power, setPower] = useState(true);
  const [volume, setVolume] = useState(() => loadState("tv_volume", 75));
  const [tick, setTick] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const playerRef = useRef(null);
  const containerId = useId().replace(/:/g, "_") + "_tv_video";
  const pubCountRef = useRef(0);

  // Pick a random video from the channel's list (or a pub every 3rd video)
  const pickVideo = (ch) => {
    const videos = CHANNELS[ch]?.videos;
    if (!videos || videos.length === 0) return null;
    pubCountRef.current++;
    // Every 3rd video switch, play a pub instead
    if (pubCountRef.current % 3 === 0 && PUBS_2000.length > 0) {
      return PUBS_2000[Math.floor(Math.random() * PUBS_2000.length)];
    }
    return videos[Math.floor(Math.random() * videos.length)];
  };

  // Destroy current player and restore the inner container div
  const destroyPlayer = () => {
    playerRef.current?.destroy?.();
    playerRef.current = null;
    // YT.Player.destroy() removes the iframe+div — recreate the container
    const existing = document.getElementById(containerId);
    if (!existing) {
      const wrapper = document.querySelector(`[data-video-wrapper]`);
      if (wrapper) {
        wrapper.innerHTML = "";
        const div = document.createElement("div");
        div.id = containerId;
        div.style.cssText = "width:100%;height:100%";
        wrapper.appendChild(div);
      }
    }
  };

  // Start a video for the current channel
  const startVideo = (ch) => {
    destroyPlayer();
    setVideoReady(false);
    setVideoError(false);
    const video = pickVideo(ch);
    if (!video) { setVideoError(true); return; }
    // Small delay to ensure DOM container is rendered
    requestAnimationFrame(() => {
      const container = document.getElementById(containerId);
      if (!container) { setVideoError(true); return; }
      playerRef.current = createVideoPlayer(containerId, {
        platform: video.platform,
        videoId: video.id,
        start: video.start || 0,
        onReady: () => {
          setVideoReady(true);
          // Sync volume on ready (muted by default, user unmutes via Vol+)
          playerRef.current?.setVolume?.(volume);
        },
        onError: () => { setVideoError(true); },
        onEnded: () => {
          // Play next video (random from same channel, or a pub)
          startVideo(ch);
        },
      });
    });
  };

  // Tick every 2s (for fallback text content), reset on channel change
  useEffect(() => {
    if (!power) return;
    setTick(0);
    const iv = setInterval(() => setTick(t => t + 1), 2000);
    return () => clearInterval(iv);
  }, [channel, power]);

  // Init video on channel change
  useEffect(() => {
    if (!power || staticEffect) return;
    startVideo(channel);
    return () => destroyPlayer();
  }, [channel, power]);

  // Sync volume to player
  useEffect(() => {
    playerRef.current?.setVolume?.(volume);
  }, [volume]);

  // Power on/off
  useEffect(() => {
    if (power) {
      playerRef.current?.play?.();
    } else {
      playerRef.current?.pause?.();
    }
  }, [power]);

  // Cleanup on unmount
  useEffect(() => {
    return () => destroyPlayer();
  }, []);

  const changeChannel = (dir) => {
    setStaticEffect(true);
    destroyPlayer();
    setVideoReady(false);
    setVideoError(false);
    playTVStatic();
    setTimeout(() => {
      setChannel(prev => {
        const next = (prev + dir + CHANNELS.length) % CHANNELS.length;
        saveState("tv_channel", next);
        return next;
      });
      setStaticEffect(false);
    }, 350);
  };

  const hasVideo = CHANNELS[channel]?.videos?.length > 0;
  const showFallbackText = !hasVideo || videoError || !videoReady;

  return (
    <Win title="Ma T\u00e9l\u00e9vision Cathodique \u2014 Thomson 36cm" onClose={onClose} onMinimize={onMinimize} width={640} height={560} zIndex={zIndex} onFocus={onFocus} initialPos={{ x: 180, y: 40 }} color="#444">
      <div style={{ padding: 16, background: "#1a1a1a", height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* TV Frame */}
        <div className="tv-screen" style={{
          width: 460, height: 310, background: "#0a0a0a", borderRadius: "20px",
          border: "14px solid #4a4a4a",
          borderImage: "linear-gradient(145deg, #666 0%, #3a3a3a 30%, #555 70%, #444 100%) 14",
          boxShadow: "inset 0 0 50px rgba(0,0,0,0.9), 0 6px 24px rgba(0,0,0,0.6), inset 0 0 2px 1px rgba(255,255,255,0.05)",
          position: "relative", overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {!power ? (
            <div style={{ width: 3, height: 3, background: "#333", borderRadius: "50%", boxShadow: "0 0 8px 2px rgba(255,255,255,0.05)" }} />
          ) : staticEffect ? (
            <div style={{
              width: "100%", height: "100%",
              background: `
                repeating-radial-gradient(circle at ${Math.random()*100}% ${Math.random()*100}%, rgba(255,255,255,0.15) 0px, transparent 1px, transparent 2px),
                linear-gradient(rgba(255,255,255,0.08), rgba(0,0,0,0.08))
              `,
              backgroundSize: "3px 3px, 100% 4px",
              animation: "tvStatic 0.08s steps(4) infinite",
              position: "relative",
            }}>
              <div style={{
                position: "absolute", inset: 0,
                background: "white",
                animation: "fadeOut 0.3s ease-out forwards",
              }} />
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.7'/%3E%3C/svg%3E")`,
                backgroundSize: "128px",
                animation: "tvStatic 0.1s steps(8) infinite",
                mixBlendMode: "overlay",
              }} />
            </div>
          ) : (
            <div style={{
              width: "100%", height: "100%",
              background: `radial-gradient(ellipse at center, ${CHANNELS[channel].bg} 0%, #000 120%)`,
              display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
              position: "relative", animation: "crtFlicker 4s infinite",
            }}>
              {/* z-0: Video layer — wrapper keeps styles when YT replaces the inner div */}
              {hasVideo && (
                <div data-video-wrapper="" style={{
                  position: "absolute", inset: 0, zIndex: 0,
                  pointerEvents: "none",
                  transform: "scale(1.15)",
                  transformOrigin: "center",
                  opacity: videoReady && !videoError ? 1 : 0,
                  transition: "opacity 0.6s ease-in",
                  overflow: "hidden",
                }}>
                  <div id={containerId} style={{ width: "100%", height: "100%" }} />
                </div>
              )}
              {/* z-1: Fallback text content */}
              <div style={{
                position: "relative", zIndex: 1,
                width: "100%", height: "100%", padding: 20,
                display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                opacity: showFallbackText ? 1 : 0,
                transition: "opacity 0.4s",
                pointerEvents: showFallbackText ? "auto" : "none",
              }}>
                {/* Channel logo */}
                <div style={{ marginBottom: 6, textShadow: "0 0 20px rgba(255,255,255,0.2)" }}>
                  <NostalImg src={CHANNELS[channel].img} fallback={CHANNELS[channel].emoji} size={36} />
                </div>
                <div style={{ color: CHANNELS[channel].color, fontSize: 12, fontWeight: "bold", textAlign: "center", textShadow: `0 0 12px ${CHANNELS[channel].color}50`, marginBottom: 8 }}>
                  {CHANNELS[channel].name}
                </div>
                {/* Animated content */}
                <div style={{ width: "100%", maxWidth: 360, flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0 }}>
                  <ChannelContent channel={CHANNELS[channel]} tick={tick} />
                </div>
              </div>
              {/* z-10: Scanlines overlay */}
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10,
                background: "repeating-linear-gradient(transparent 0px, transparent 1px, rgba(0,0,0,0.18) 1px, rgba(0,0,0,0.18) 2px)",
              }} />
              {/* z-11: Screen curvature/vignette */}
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none", zIndex: 11,
                boxShadow: "inset 0 0 80px 20px rgba(0,0,0,0.4)",
                borderRadius: 8,
              }} />
              {/* z-12: Channel indicator */}
              <div style={{
                position: "absolute", top: 10, right: 14, zIndex: 12,
                color: CHANNELS[channel].color, fontSize: 20, fontFamily: "monospace", fontWeight: "bold",
                textShadow: `0 0 8px ${CHANNELS[channel].color}80`,
              }}>CH {channel + 1}</div>
              {/* z-12: Volume indicator */}
              <div style={{ position: "absolute", top: 10, left: 14, display: "flex", gap: 2, alignItems: "center", zIndex: 12 }}>
                <NostalImg src="/images/ui/volume.svg" fallback="\u{1F50A}" size={10} />
                <div style={{ width: 50, height: 4, background: "#333", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${volume}%`, height: "100%", background: CHANNELS[channel].color, transition: "width 0.2s" }} />
                </div>
              </div>
            </div>
          )}
          {/* Power LED */}
          <div style={{
            position: "absolute", bottom: -10, right: 20,
            width: 6, height: 6, borderRadius: "50%",
            background: power ? "#0F0" : "#300",
            boxShadow: power ? "0 0 6px #0F0" : "none",
          }} />
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 10, marginTop: 14, alignItems: "center" }}>
          <BtnTV onClick={() => changeChannel(-1)}>{"\u25C0"} CH-</BtnTV>
          <BtnTV onClick={() => setVolume(v => { const nv = Math.max(0, v - 15); saveState("tv_volume", nv); return nv; })}>{"\u{1F509}"} Vol-</BtnTV>
          <button onClick={() => setPower(!power)} style={{
            ...tvBtnBase, width: 50, background: power ? "linear-gradient(180deg, #F77 0%, #C33 100%)" : "linear-gradient(180deg, #7F7 0%, #3C3 100%)",
          }}>{"\u23FB"}</button>
          <BtnTV onClick={() => setVolume(v => { const nv = Math.min(100, v + 15); saveState("tv_volume", nv); return nv; })}>{"\u{1F50A}"} Vol+</BtnTV>
          <BtnTV onClick={() => changeChannel(1)}>CH+ {"\u25B6"}</BtnTV>
        </div>
      </div>
    </Win>
  );
}
