import { useState, useRef, useCallback } from "react";
import { ROOM_ITEMS } from "../../../data/chambreItems";

const VB_W = 560;
const VB_H = 488;

// Layout: nightstand (135-207) then bed (210-520) — no gap
const HOTSPOTS = {
  fenetre:     { x: 20, y: 28,  w: 103, h: 118 },
  lego:        { x: 390, y: 58, w: 60, h: 24 },
  jeuxSociete: { x: 460, y: 52, w: 52, h: 32 },
  scoubidous:  { x: 448, y: 84, w: 38, h: 26 },
  couette:     { x: 224, y: 232, w: 274, h: 110 },
  peluches:    { x: 420, y: 185, w: 80, h: 32 },
  lampe:       { x: 143, y: 178, w: 30, h: 40 },
  tamagotchi:  { x: 170, y: 224, w: 22, h: 28 },
  reveil:      { x: 138, y: 240, w: 26, h: 16 },
  journal:     { x: 184, y: 228, w: 18, h: 24 },
  radio:       { x: 158, y: 244, w: 24, h: 17 },
  panini:      { x: 28, y: 318, w: 36, h: 26 },
  pateAProut:  { x: 108, y: 358, w: 28, h: 20 },
  billes:      { x: 68, y: 332, w: 42, h: 26 },
  beyblade:    { x: 18, y: 368, w: 48, h: 30 },
  sousLelit:   { x: 260, y: 358, w: 58, h: 22 },
};

export default function ChambreRoomSVG({ lampOn, couetteColor, onToggleLamp, setActiveItem, hoveredItem, setHoveredItem }) {
  const [tooltipPos, setTooltipPos] = useState(null);
  const svgRef = useRef(null);

  const handleItemClick = useCallback((id, e) => {
    e.stopPropagation();
    const item = ROOM_ITEMS.find(i => i.id === id);
    if (!item?.interactive) return;
    if (id === "lampe") { onToggleLamp(); return; }
    setActiveItem(id);
  }, [onToggleLamp, setActiveItem]);

  const handleHover = useCallback((id, entering) => {
    if (entering) {
      setHoveredItem(id);
      const pos = HOTSPOTS[id];
      if (pos) setTooltipPos({ x: pos.x + pos.w / 2, y: pos.y - 12 });
    } else {
      setHoveredItem(null);
      setTooltipPos(null);
    }
  }, [setHoveredItem]);

  const hoveredItemData = hoveredItem ? ROOM_ITEMS.find(i => i.id === hoveredItem) : null;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2E2245" />
          <stop offset="40%" stopColor="#362952" />
          <stop offset="100%" stopColor="#3D2F5C" />
        </linearGradient>
        <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A3328" />
          <stop offset="100%" stopColor="#7B5638" />
        </linearGradient>
        <pattern id="parquet" width="40" height="20" patternUnits="userSpaceOnUse">
          <rect width="40" height="20" fill="#6B4830" />
          <rect x="0" y="0" width="19" height="9" fill="#7B5638" rx="1" />
          <rect x="20" y="0" width="19" height="9" fill="#5C3D2A" rx="1" />
          <rect x="10" y="10" width="19" height="9" fill="#7B5638" rx="1" />
          <rect x="30" y="10" width="10" height="9" fill="#5C3D2A" rx="1" />
          <rect x="0" y="10" width="9" height="9" fill="#5C3D2A" rx="1" />
        </pattern>
        <linearGradient id="plGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5C3D2A" />
          <stop offset="100%" stopColor="#3E2518" />
        </linearGradient>
        <pattern id="rugPattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#6A1B4D" />
          <rect x="4" y="4" width="12" height="12" fill="none" stroke="rgba(255,200,100,0.12)" strokeWidth="1" />
          <circle cx="10" cy="10" r="3" fill="none" stroke="rgba(255,200,100,0.08)" strokeWidth="0.5" />
        </pattern>
        <pattern id="losanges" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M10 0 L20 10 L10 20 L0 10 Z" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
        </pattern>
        <radialGradient id="lampGlow" cx="30%" cy="50%" r="45%">
          <stop offset="0%" stopColor="rgba(255,220,80,0.18)" />
          <stop offset="50%" stopColor="rgba(255,200,60,0.06)" />
          <stop offset="100%" stopColor="rgba(255,200,60,0)" />
        </radialGradient>
        <radialGradient id="nightDark" cx="30%" cy="45%" r="80%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.35)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.72)" />
        </radialGradient>
        <filter id="hoverGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#C8B0E8" floodOpacity="0.7" />
        </filter>
        <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ===== LAYER 0 — FOND ===== */}
      <rect x="0" y="0" width={VB_W} height="276" fill="url(#wallGrad)" />
      <rect x="0" y="276" width={VB_W} height="212" fill="url(#floorGrad)" />
      <rect x="0" y="276" width={VB_W} height="212" fill="url(#parquet)" opacity="0.35" />
      <rect x="0" y="269" width={VB_W} height="7" fill="url(#plGrad)" />

      {/* ===== LAYER 1 — DÉCORATIONS MURALES ===== */}

      {/* Fenêtre */}
      <g transform="translate(20, 28)">
        <rect x="-4" y="-4" width="103" height="118" rx="2" fill="#6B4830" />
        <rect x="0" y="0" width="95" height="110" rx="1" fill={lampOn ? "#1a1050" : "#020210"} />
        <image
          href={lampOn ? "/images/chambre/room/window-day.svg" : "/images/chambre/room/window-night.svg"}
          x="0" y="0" width="95" height="110"
          preserveAspectRatio="xMidYMid slice"
        />
        <circle cx="72" cy="18" r="8" fill="#FFFDE8"
                opacity={lampOn ? 0.5 : 0.9}
                style={{ filter: lampOn ? "none" : "url(#starGlow)" }} />
        {[{x:14,y:10,r:1.2},{x:32,y:16,r:1},{x:50,y:8,r:1.5},{x:20,y:35,r:0.8},{x:60,y:30,r:1},{x:40,y:25,r:0.7},{x:10,y:50,r:1},{x:55,y:48,r:0.8}].map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={lampOn ? 0.15 : 0.7}>
            <animate attributeName="opacity"
                     values={lampOn ? "0.1;0.2;0.1" : "0.5;0.9;0.5"}
                     dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        ))}
        {lampOn && <rect x="0" y="70" width="95" height="40" rx="1" fill="rgba(255,180,100,0.15)" />}
        <line x1="47.5" y1="0" x2="47.5" y2="110" stroke="#6B4830" strokeWidth="3" />
        <line x1="0" y1="55" x2="95" y2="55" stroke="#6B4830" strokeWidth="3" />
        <rect x="-3" y="-2" width="18" height="114" rx="2" fill="#7B2050" opacity="0.85" />
        <line x1="4" y1="0" x2="4" y2="112" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
        <line x1="10" y1="0" x2="10" y2="112" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
        <rect x="80" y="-2" width="18" height="114" rx="2" fill="#7B2050" opacity="0.85" />
        <rect x="-7" y="-5" width="109" height="3" rx="1" fill="#8B7355" />
      </g>

      {/* Poster DBZ */}
      <g transform="translate(136, 16)">
        <rect x="-2" y="-2" width="80" height="60" rx="1" fill="#222" />
        <image href="/images/chambre/room/poster-dbz.png"
               x="0" y="0" width="76" height="56"
               preserveAspectRatio="xMidYMid slice" />
      </g>

      {/* Poster Yu-Gi-Oh */}
      <g transform="translate(226, 58)">
        <rect x="-2" y="-2" width="52" height="66" rx="1" fill="#222" />
        <image href="/images/chambre/room/poster-yugioh.png"
               x="0" y="0" width="48" height="62"
               preserveAspectRatio="xMidYMid slice" />
      </g>

      {/* Glow-in-the-dark stars */}
      <g opacity={lampOn ? 0.06 : 0.85}
         style={{ transition: "opacity 0.8s ease", filter: lampOn ? "none" : "url(#starGlow)" }}>
        <image href="/images/chambre/room/glow-stars.png"
               x="300" y="5" width="180" height="110"
               preserveAspectRatio="xMidYMid meet" opacity="0.9" />
        {[{x:310,y:18},{x:345,y:32},{x:380,y:12},{x:420,y:38},{x:325,y:50},{x:395,y:55},{x:360,y:20},{x:440,y:22}].map((s, i) => (
          <text key={i} x={s.x} y={s.y} fill="#96FF96" fontSize="7" opacity={0.7 + Math.sin(i) * 0.3}>
            ✦
            {!lampOn && (
              <animate attributeName="opacity" values="0.5;1;0.5" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
            )}
          </text>
        ))}
      </g>

      {/* ===== LAYER 2 — ÉTAGÈRE ===== */}
      <g transform="translate(380, 76)">
        {/* Real image first (as base) */}
        <image href="/images/chambre/room/shelf.png"
               x="-5" y="-6" width="170" height="78"
               preserveAspectRatio="xMidYMid meet" />

        {/* Items on top shelf (above y=0) */}
        <rect x="10" y="-18" width="28" height="17" rx="1" fill="#E53935" stroke="#B71C1C" strokeWidth="0.5" />
        <text x="24" y="-6" textAnchor="middle" fill="#FFF" fontSize="5.5" fontWeight="bold">LEGO</text>
        <rect x="45" y="-20" width="10" height="20" rx="2" fill="#FF5722" stroke="#BF360C" strokeWidth="0.5" />
        {/* Board games */}
        <rect x="80" y="-8" width="40" height="7" rx="1" fill="#2E7D32" stroke="#1B5E20" strokeWidth="0.5" />
        <rect x="80" y="-15" width="40" height="7" rx="1" fill="#1565C0" stroke="#0D47A1" strokeWidth="0.5" />
        <rect x="80" y="-22" width="40" height="7" rx="1" fill="#C62828" stroke="#B71C1C" strokeWidth="0.5" />
        {/* Scoubidous */}
        {["#FF4444","#44FF44","#4488FF","#FFDD44","#FF44FF"].map((c, i) => (
          <line key={i} x1={62 + i * 5} y1={0} x2={60 + i * 5} y2={-16 + (i % 2) * 4}
                stroke={c} strokeWidth="2" strokeLinecap="round" />
        ))}
        {/* Items on bottom shelf */}
        <rect x="16" y="30" width="8" height="13" fill="#C62828" />
        <rect x="25" y="32" width="7" height="11" fill="#1565C0" />
        <rect x="33" y="29" width="9" height="14" fill="#F57C00" />
        <rect x="43" y="31" width="6" height="12" fill="#7B1FA2" />
        <text x="85" y="42" textAnchor="middle" fill="#888" fontSize="8">📚</text>
      </g>

      {/* ===== LAYER 3 — LIT (centre-droit, dominant) ===== */}
      <g transform="translate(210, 175)">
        {/* Subtle shadow behind bed */}
        <rect x="2" y="8" width="310" height="208" rx="3" fill="rgba(0,0,0,0.2)" />
        {/* Real bed image — no SVG fallback frame */}
        <image href="/images/chambre/room/bed.png"
               x="0" y="0" width="310" height="210"
               preserveAspectRatio="xMidYMid meet" />

        {/* Pillows */}
        <ellipse cx="85" cy="38" rx="34" ry="9" fill="#FFFEF8" stroke="#E8E0C8" strokeWidth="0.5" opacity="0.65" />
        <ellipse cx="160" cy="40" rx="28" ry="8" fill="#FFFEF8" stroke="#E8E0C8" strokeWidth="0.5" opacity="0.65" />

        {/* Couette */}
        <rect x="16" y="55" width="278" height="120" rx="2" fill={couetteColor} opacity="0.78" />
        <rect x="16" y="55" width="278" height="120" rx="2" fill="url(#losanges)" />
        <rect x="16" y="52" width="278" height="6" rx="1" fill={couetteColor} opacity="0.6" />
        <g opacity="0.08">
          {[0,1,2,3,4,5].map(i => (
            <line key={i} x1={16 + i * 46} y1="55" x2={16 + i * 46 + 30} y2="175"
                  stroke="#fff" strokeWidth="0.5" />
          ))}
          {[0,1,2,3,4,5].map(i => (
            <line key={`r${i}`} x1={294 - i * 46} y1="55" x2={294 - i * 46 - 30} y2="175"
                  stroke="#fff" strokeWidth="0.5" />
          ))}
        </g>

        {/* Peluches */}
        <text x="225" y="42" fontSize="17">🧸</text>
        <text x="252" y="46" fontSize="11">🐰</text>
        <text x="200" y="44" fontSize="9">🐶</text>
      </g>

      {/* ===== LAYER 4 — TABLE DE NUIT + LAMPE (collée au lit) ===== */}
      {/* Nightstand at x=135, bed starts at x=210 → gap = 3px */}
      <g transform="translate(135, 218)">
        <image href="/images/chambre/room/nightstand.png"
               x="-4" y="-6" width="80" height="78"
               preserveAspectRatio="xMidYMid meet" />
        {/* Minimal fallback (behind image) */}
        <rect x="0" y="0" width="72" height="65" rx="1" fill="#6B4830" opacity="0.3" />
      </g>

      {/* Lampe — on top of nightstand */}
      <g transform="translate(143, 178)">
        <polygon points="4,0 26,0 30,18 0,18"
                 fill={lampOn ? "#FFE082" : "#8B7355"} />
        {lampOn && <polygon points="4,0 26,0 30,18 0,18" fill="rgba(255,220,0,0.2)" />}
        <rect x="11" y="18" width="8" height="12" fill={lampOn ? "#C8A050" : "#7B6040"} />
        <rect x="6" y="30" width="18" height="5" rx="2" fill={lampOn ? "#B8903A" : "#6B5335"} />
        <image
          href={lampOn ? "/images/chambre/room/lamp-on.png" : "/images/chambre/room/lamp-off.png"}
          x="-2" y="-4" width="34" height="44"
          preserveAspectRatio="xMidYMid meet" />
        {lampOn && (
          <circle cx="15" cy="10" r="28" fill="rgba(255,220,80,0.08)" style={{ pointerEvents: "none" }} />
        )}
      </g>

      {/* Nightstand small items */}
      <g transform="translate(172, 226)">
        {/* Tamagotchi */}
        <rect x="0" y="0" width="18" height="24" rx="8" fill="#42A5F5" stroke="#1565C0" strokeWidth="0.8" />
        <rect x="3" y="5" width="12" height="9" rx="1" fill="#D0E0A8" stroke="#90B060" strokeWidth="0.5" />
        <text x="9" y="12" textAnchor="middle" fontSize="5">😊</text>
      </g>
      <g transform="translate(140, 242)">
        {/* Alarm clock */}
        <rect x="0" y="0" width="22" height="13" rx="1" fill="#1a1a1a" stroke="#333" strokeWidth="0.5" />
        <text x="11" y="10" textAnchor="middle" fill="#FF3333" fontSize="6.5" fontFamily="monospace">
          {new Date().getHours().toString().padStart(2,'0')}:{new Date().getMinutes().toString().padStart(2,'0')}
        </text>
      </g>
      <g transform="translate(186, 230)">
        {/* Journal */}
        <rect x="0" y="0" width="14" height="20" rx="1" fill="#8B4513" stroke="#6B3410" strokeWidth="0.5" />
        <text x="7" y="14" textAnchor="middle" fontSize="6">📓</text>
      </g>
      <g transform="translate(160, 246)">
        {/* Radio */}
        <rect x="0" y="0" width="20" height="13" rx="2" fill="#8B7355" stroke="#5C4528" strokeWidth="0.5" />
        <text x="10" y="10" textAnchor="middle" fontSize="6">📻</text>
      </g>

      {/* ===== LAYER 5 — SOL / PREMIER PLAN ===== */}

      {/* Rug — left side of floor */}
      <g>
        <rect x="10" y="298" width="178" height="115" rx="3" fill="url(#rugPattern)" />
        <image href="/images/chambre/room/rug.png"
               x="10" y="298" width="178" height="115"
               preserveAspectRatio="xMidYMid meet" opacity="0.85" />
      </g>

      {/* Panini album — small */}
      <g transform="translate(30, 320)">
        <rect x="0" y="0" width="32" height="22" rx="1" fill="#DAA520" stroke="#8B6914" strokeWidth="0.8"
              transform="rotate(-5)" />
        <text x="12" y="12" fontSize="7" transform="rotate(-5)">⚽</text>
        <text x="7" y="19" fontSize="3.2" fill="#4A3000" fontWeight="bold" transform="rotate(-5)">PANINI</text>
      </g>

      {/* Billes — smaller */}
      <g transform="translate(78, 340)">
        <circle cx="0" cy="0" r="6" fill="#1E90FF" />
        <circle cx="-1" cy="-2" r="2.5" fill="#87CEFA" opacity="0.5" />
        <circle cx="12" cy="3" r="5" fill="#FF6347" />
        <circle cx="11" cy="1" r="2" fill="#FFD700" opacity="0.4" />
        <circle cx="-9" cy="5" r="7" fill="#6A40B0" />
        <circle cx="-10" cy="3" r="3" fill="#B8A0E0" opacity="0.4" />
        <circle cx="20" cy="7" r="3.5" fill="#228B22" />
        <circle cx="19" cy="5.5" r="1.5" fill="#90EE90" opacity="0.4" />
      </g>

      {/* Pâte à prout — smaller */}
      <g transform="translate(112, 362)">
        <ellipse cx="12" cy="8" rx="12" ry="8" fill="#AB47BC" stroke="#7B1FA2" strokeWidth="0.5" />
        <text x="12" y="12" textAnchor="middle" fontSize="7">💩</text>
      </g>

      {/* Beyblades — smaller */}
      <g transform="translate(22, 372)">
        <ellipse cx="22" cy="12" rx="26" ry="16" fill="none" stroke="rgba(100,100,100,0.1)" strokeWidth="0.8" />
        <circle cx="12" cy="10" r="9" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1" />
        <circle cx="12" cy="10" r="3.5" fill="#1D4ED8" stroke="#93C5FD" strokeWidth="0.4" />
        <circle cx="32" cy="14" r="7" fill="#EF4444" stroke="#B91C1C" strokeWidth="0.8" />
        <circle cx="32" cy="14" r="2.5" fill="#B91C1C" stroke="#FCA5A5" strokeWidth="0.4" />
      </g>

      {/* Sous le lit — at bottom of bed */}
      <g transform="translate(263, 360)">
        <rect x="0" y="0" width="55" height="20" rx="3" fill="rgba(0,0,0,0.45)"
              stroke="rgba(200,176,232,0.25)" strokeWidth="0.5" strokeDasharray="3 2" />
        <text x="6" y="14" fill="#C8B0E8" fontSize="7" fontFamily="Tahoma, sans-serif">👀 Sous le lit</text>
      </g>

      {/* ===== LAYER 6 — EFFETS D'ÉCLAIRAGE ===== */}
      {lampOn && (
        <rect x="0" y="0" width={VB_W} height={VB_H}
              fill="url(#lampGlow)" style={{ pointerEvents: "none" }} />
      )}
      <rect x="0" y="0" width={VB_W} height={VB_H}
            fill="url(#nightDark)"
            opacity={lampOn ? 0 : 1}
            style={{ pointerEvents: "none", transition: "opacity 0.8s ease" }} />

      {/* ===== LAYER 7 — HOTSPOTS INTERACTIFS ===== */}
      {Object.entries(HOTSPOTS).map(([id, pos]) => {
        const item = ROOM_ITEMS.find(i => i.id === id);
        if (!item?.interactive) return null;
        const isHovered = hoveredItem === id;
        return (
          <rect
            key={id}
            x={pos.x} y={pos.y} width={pos.w} height={pos.h}
            fill="transparent"
            stroke={isHovered ? "rgba(200,176,232,0.5)" : "none"}
            strokeWidth="1.5"
            strokeDasharray={isHovered ? "4 2" : "none"}
            rx="3"
            style={{
              cursor: "pointer",
              filter: isHovered ? "url(#hoverGlow)" : "none",
            }}
            onClick={(e) => handleItemClick(id, e)}
            onMouseEnter={() => handleHover(id, true)}
            onMouseLeave={() => handleHover(id, false)}
          />
        );
      })}

      {/* ===== LAYER 8 — UI ===== */}
      {hoveredItemData && hoveredItemData.interactive && tooltipPos && (
        <g transform={`translate(${tooltipPos.x}, ${tooltipPos.y})`} style={{ pointerEvents: "none" }}>
          <rect x="-55" y="-22" width="110" height="20" rx="4"
                fill="rgba(0,0,0,0.92)" stroke="rgba(139,107,174,0.5)" strokeWidth="0.5" />
          <text x="0" y="-8" textAnchor="middle" fill="#C8B0E8" fontSize="8.5"
                fontFamily="Tahoma, sans-serif">
            {hoveredItemData.hint}
          </text>
        </g>
      )}

      <text x={VB_W / 2} y={VB_H - 8} textAnchor="middle"
            fill="rgba(139,107,174,0.35)" fontSize="9"
            fontFamily="Tahoma, sans-serif"
            style={{ pointerEvents: "none" }}>
        Clique sur les objets pour les explorer
      </text>
    </svg>
  );
}
