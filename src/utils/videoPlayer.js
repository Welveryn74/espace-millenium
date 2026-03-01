// Dailymotion video player (no npm deps, no ads, no suggestions)

function buildDMUrl(videoId) {
  return `https://geo.dailymotion.com/player.html?video=${videoId}&mute=true&controls=false&queue-enable=false&sharing-enable=false&ui-logo=false&autoplay=true`;
}

export function createVideoPlayer(containerId, { videoId, onReady, onError, onEnded }) {
  const container = document.getElementById(containerId);
  if (!container) { onError?.(new Error("Container not found")); return null; }

  const iframe = document.createElement("iframe");
  iframe.src = buildDMUrl(videoId);
  iframe.style.cssText = "width:100%;height:100%;border:none;pointer-events:none;";
  iframe.allow = "autoplay; encrypted-media";
  iframe.setAttribute("allowfullscreen", "false");
  container.innerHTML = "";
  container.appendChild(iframe);

  let destroyed = false;
  let readyFired = false;

  function fireReady() {
    if (!readyFired && !destroyed) { readyFired = true; onReady?.(); }
  }

  // Listen for Dailymotion postMessage events
  function onMessage(e) {
    if (destroyed) return;
    try {
      const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      if (data.event === "video_end" || data.event === "ended") onEnded?.();
      if (data.event === "playback_ready" || data.event === "video_start") fireReady();
      if (data.event === "error") onError?.(data);
    } catch {}
  }
  window.addEventListener("message", onMessage);

  // Fallback: assume ready after short delay (DM doesn't always fire events)
  const readyTimer = setTimeout(fireReady, 2500);

  function postCmd(method, value) {
    try { iframe.contentWindow?.postMessage(JSON.stringify({ command: method, parameters: value != null ? [value] : [] }), "*"); } catch {}
  }

  return {
    setVolume(v) { postCmd("muted", v === 0); postCmd("volume", v / 100); },
    play() { postCmd("play"); },
    pause() { postCmd("pause"); },
    loadVideo(id) { iframe.src = buildDMUrl(id); readyFired = false; },
    destroy() { destroyed = true; clearTimeout(readyTimer); window.removeEventListener("message", onMessage); container.innerHTML = ""; },
  };
}
