// Unified video player for YouTube + Dailymotion (no npm deps)

// --- YouTube IFrame API loader ---
let ytApiPromise = null;

function loadYouTubeAPI() {
  if (ytApiPromise) return ytApiPromise;
  if (window.YT && window.YT.Player) return Promise.resolve();
  ytApiPromise = new Promise((resolve, reject) => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.onerror = () => { ytApiPromise = null; reject(new Error("Failed to load YouTube API")); };
    window.onYouTubeIframeAPIReady = () => resolve();
    document.head.appendChild(tag);
    setTimeout(() => { ytApiPromise = null; reject(new Error("YouTube API timeout")); }, 10000);
  });
  return ytApiPromise;
}

// --- YouTube player ---
function createYouTubePlayer(containerId, { videoId, start, onReady, onError, onEnded }) {
  let player = null;
  let destroyed = false;

  loadYouTubeAPI()
    .then(() => {
      if (destroyed) return;
      player = new window.YT.Player(containerId, {
        width: "100%",
        height: "100%",
        videoId,
        playerVars: {
          controls: 0, autoplay: 1, mute: 1, rel: 0, fs: 0,
          disablekb: 1, iv_load_policy: 3, modestbranding: 1,
          start: start || 0, playsinline: 1,
        },
        events: {
          onReady: () => { if (!destroyed) onReady?.(); },
          onError: (e) => { if (!destroyed) onError?.(e); },
          onStateChange: (e) => {
            if (!destroyed && e.data === window.YT.PlayerState.ENDED) onEnded?.();
          },
        },
      });
    })
    .catch((err) => onError?.(err));

  return {
    setVolume(v) { player?.setVolume?.(v); if (v > 0) player?.unMute?.(); else player?.mute?.(); },
    play() { player?.playVideo?.(); },
    pause() { player?.pauseVideo?.(); },
    loadVideo(id, s) { player?.loadVideoById?.({ videoId: id, startSeconds: s || 0 }); },
    destroy() { destroyed = true; try { player?.destroy?.(); } catch {} },
  };
}

// --- Dailymotion player ---
function createDailymotionPlayer(containerId, { videoId, onReady, onError, onEnded }) {
  const container = document.getElementById(containerId);
  if (!container) { onError?.(new Error("Container not found")); return null; }

  const iframe = document.createElement("iframe");
  iframe.src = `https://geo.dailymotion.com/player.html?video=${videoId}&mute=true&controls=false&queue-enable=false&sharing-enable=false&ui-logo=false&autoplay=true`;
  iframe.style.cssText = "width:100%;height:100%;border:none;pointer-events:none;";
  iframe.allow = "autoplay; encrypted-media";
  iframe.setAttribute("allowfullscreen", "false");
  container.innerHTML = "";
  container.appendChild(iframe);

  let destroyed = false;

  // Listen for Dailymotion postMessage events
  function onMessage(e) {
    if (destroyed) return;
    try {
      const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      if (data.event === "video_end" || data.event === "ended") onEnded?.();
      if (data.event === "playback_ready" || data.event === "video_start") onReady?.();
      if (data.event === "error") onError?.(data);
    } catch {}
  }
  window.addEventListener("message", onMessage);

  // Assume ready after short delay (Dailymotion doesn't always send ready event)
  const readyTimer = setTimeout(() => { if (!destroyed) onReady?.(); }, 2000);

  function postCmd(method, value) {
    try { iframe.contentWindow?.postMessage(JSON.stringify({ command: method, parameters: value != null ? [value] : [] }), "*"); } catch {}
  }

  return {
    setVolume(v) { postCmd("muted", v === 0); postCmd("volume", v / 100); },
    play() { postCmd("play"); },
    pause() { postCmd("pause"); },
    loadVideo(id) {
      iframe.src = `https://geo.dailymotion.com/player.html?video=${id}&mute=true&controls=false&queue-enable=false&sharing-enable=false&ui-logo=false&autoplay=true`;
    },
    destroy() { destroyed = true; clearTimeout(readyTimer); window.removeEventListener("message", onMessage); container.innerHTML = ""; },
  };
}

// --- Unified interface ---
export function createVideoPlayer(containerId, { platform, videoId, start, onReady, onError, onEnded }) {
  if (platform === "youtube") {
    return createYouTubePlayer(containerId, { videoId, start, onReady, onError, onEnded });
  }
  if (platform === "dailymotion") {
    return createDailymotionPlayer(containerId, { videoId, onReady, onError, onEnded });
  }
  onError?.(new Error(`Unknown platform: ${platform}`));
  return null;
}
