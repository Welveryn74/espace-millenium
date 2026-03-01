// Dailymotion video player (no npm deps, no ads, no suggestions)
// Uses the OLD embed URL format which supports postMessage API

const DM_ORIGIN = "https://www.dailymotion.com";

function buildDMUrl(videoId) {
  return `${DM_ORIGIN}/embed/video/${videoId}?api=postMessage&autoplay=1&mute=1&controls=0&queue-enable=0&sharing-enable=0&ui-logo=0&ui-start-screen-info=0`;
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
  let apiReady = false;
  let pendingCmds = [];

  function postCmd(method, value) {
    const msg = { command: method };
    if (value !== undefined) msg.parameters = [value];
    if (!apiReady) { pendingCmds.push(msg); return; }
    try { iframe.contentWindow?.postMessage(JSON.stringify(msg), DM_ORIGIN); } catch {}
  }

  function flushCmds() {
    apiReady = true;
    for (const msg of pendingCmds) {
      try { iframe.contentWindow?.postMessage(JSON.stringify(msg), DM_ORIGIN); } catch {}
    }
    pendingCmds = [];
  }

  function onMessage(e) {
    if (destroyed || e.origin !== DM_ORIGIN) return;
    try {
      const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      if (data.event === "apiready") { flushCmds(); onReady?.(); }
      if (data.event === "video_end" || data.event === "ended") onEnded?.();
      if (data.event === "error") onError?.(data);
    } catch {}
  }
  window.addEventListener("message", onMessage);

  // Fallback if apiready never fires
  const readyTimer = setTimeout(() => {
    if (!destroyed && !apiReady) { flushCmds(); onReady?.(); }
  }, 5000);

  return {
    setVolume(v) {
      if (v === 0) {
        postCmd("mute");
      } else {
        postCmd("unmute");
        postCmd("volume", v / 100);
      }
    },
    play() { postCmd("play"); },
    pause() { postCmd("pause"); },
    loadVideo(id) {
      apiReady = false;
      pendingCmds = [];
      iframe.src = buildDMUrl(id);
    },
    destroy() {
      destroyed = true;
      clearTimeout(readyTimer);
      window.removeEventListener("message", onMessage);
      container.innerHTML = "";
    },
  };
}
