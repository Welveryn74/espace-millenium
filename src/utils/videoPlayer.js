// Dailymotion video player (no npm deps, no ads, no suggestions)
//
// L'ancien embed postMessage a été déprécié en fév. 2025.
// Le nouveau format ne supporte que les paramètres: mute, startTime, loop.
// On contrôle le mute/unmute en rechargeant l'iframe (le clic Vol+
// est un geste utilisateur → le navigateur autorise le son).

function buildDMUrl(videoId, muted) {
  return `https://www.dailymotion.com/embed/video/${videoId}?autoplay=1&mute=${muted ? 1 : 0}&loop=0`;
}

export function createVideoPlayer(containerId, { videoId, onReady, onError, onEnded }) {
  const container = document.getElementById(containerId);
  if (!container) { onError?.(new Error("Container not found")); return null; }

  let currentVideoId = videoId;
  let muted = true; // start muted for reliable autoplay
  let destroyed = false;

  const iframe = document.createElement("iframe");
  iframe.src = buildDMUrl(videoId, true);
  iframe.style.cssText = "width:100%;height:100%;border:none;pointer-events:none;";
  iframe.allow = "autoplay; encrypted-media";
  iframe.setAttribute("allowfullscreen", "false");
  container.innerHTML = "";
  container.appendChild(iframe);

  // Detect iframe loaded → video ready
  iframe.onload = () => { if (!destroyed) onReady?.(); };
  iframe.onerror = () => { if (!destroyed) onError?.(); };

  // Dailymotion embeds loop or end — listen for navigation away as "ended"
  // (no reliable ended event without SDK, so we don't auto-chain for now)

  return {
    setVolume(v) {
      const shouldMute = v === 0;
      if (shouldMute !== muted) {
        muted = shouldMute;
        // Reload iframe with new mute state
        // This is triggered by a user click (Vol+/Vol-) so browser allows sound
        iframe.src = buildDMUrl(currentVideoId, muted);
      }
    },
    play() {
      // Can't control via API — reload to restart
      iframe.src = buildDMUrl(currentVideoId, muted);
    },
    pause() {
      // Only reliable way to stop: blank the src
      iframe.src = "about:blank";
    },
    loadVideo(id) {
      currentVideoId = id;
      muted = true; // reset to muted for autoplay
      iframe.src = buildDMUrl(id, true);
    },
    destroy() {
      destroyed = true;
      iframe.onload = null;
      iframe.onerror = null;
      container.innerHTML = "";
    },
  };
}
