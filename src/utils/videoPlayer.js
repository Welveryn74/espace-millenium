// Dailymotion video player (no npm deps, no ads, no suggestions)
//
// L'API postMessage legacy a été supprimée en fév. 2025.
// Le nouveau format ne supporte aucun contrôle programmatique.
// Le son est géré par le player DM lui-même : l'utilisateur clique
// sur le bouton unmute du player (visible au survol à travers les
// effets CRT qui ont pointer-events: none).

function buildDMUrl(videoId) {
  // autoplay=1 : DM essaie avec son, sinon fallback muet + bouton unmute
  // Pas de mute=1 : laisse DM gérer intelligemment selon le navigateur
  return `https://www.dailymotion.com/embed/video/${videoId}?autoplay=1`;
}

export function createVideoPlayer(containerId, { videoId, onReady, onError }) {
  const container = document.getElementById(containerId);
  if (!container) { onError?.(new Error("Container not found")); return null; }

  let currentVideoId = videoId;
  let destroyed = false;

  const iframe = document.createElement("iframe");
  iframe.src = buildDMUrl(videoId);
  // PAS de pointer-events:none — l'utilisateur doit pouvoir cliquer
  // sur les contrôles DM (unmute, volume) qui apparaissent au survol
  iframe.style.cssText = "width:100%;height:100%;border:none;";
  iframe.allow = "autoplay; encrypted-media";
  iframe.setAttribute("allowfullscreen", "false");
  container.innerHTML = "";
  container.appendChild(iframe);

  iframe.onload = () => { if (!destroyed) onReady?.(); };
  iframe.onerror = () => { if (!destroyed) onError?.(); };

  return {
    loadVideo(id) {
      currentVideoId = id;
      iframe.src = buildDMUrl(id);
    },
    pause() {
      iframe.src = "about:blank";
    },
    destroy() {
      destroyed = true;
      iframe.onload = null;
      iframe.onerror = null;
      container.innerHTML = "";
    },
  };
}
