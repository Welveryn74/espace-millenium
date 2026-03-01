import { useState, useRef, useCallback } from "react";
import { ROOM_ITEMS } from "../../../data/chambreItems";

// Frontal view — point-and-click style
const VB_W = 560;
const VB_H = 488;

// Hotspot positions (viewBox coords) — aligned to visual elements
const HOTSPOTS = {
  fenetre:     { x: 22, y: 24, w: 95, h: 110 },
  lego:        { x: 388, y: 88, w: 70, h: 30 },
  jeuxSociete: { x: 470, y: 82, w: 55, h: 36 },
  scoubidous:  { x: 458, y: 118, w: 40, h: 30 },
  couette:     { x: 265, y: 290, w: 250, h: 100 },
  peluches:    { x: 430, y: 225, w: 80, h: 35 },
  lampe:       { x: 30, y: 214, w: 30, h: 40 },
  tamagotchi:  { x: 56, y: 262, w: 24, h: 30 },
  reveil:      { x: 24, y: 276, w: 28, h: 18 },
  journal:     { x: 72, y: 268, w: 20, h: 26 },
  radio:       { x: 46, y: 282, w: 26, h: 18 },
  panini:      { x: 50, y: 368, w: 50, h: 36 },
  pateAProut:  { x: 136, y: 408, w: 38, h: 28 },
  billes:      { x: 105, y: 366, w: 60, h: 36 },
  beyblade:    { x: 200, y: 400, w: 66, h: 40 },
  sousLelit:   { x: 295, y: 390, w: 62, h: 26 },
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
        {/* Wall gradient */}
        <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2E2245" />
          <stop offset="40%" stopColor="#362952" />
          <stop offset="100%" stopColor="#3D2F5C" />
        </linearGradient>
        {/* Floor gradient */}
        <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A3328" />
          <stop offset="100%" stopColor="#7B5638" />
        </linearGradient>
        {/* Floor parquet pattern */}
        <pattern id="parquet" width="40" height="20" patternUnits="userSpaceOnUse">
          <rect width="40" height="20" fill="#6B4830" />
          <rect x="0" y="0" width="19" height="9" fill="#7B5638" rx="1" />
          <rect x="20" y="0" width="19" height="9" fill="#5C3D2A" rx="1" />
          <rect x="10" y="10" width="19" height="9" fill="#7B5638" rx="1" />
          <rect x="30" y="10" width="10" height="9" fill="#5C3D2A" rx="1" />
          <rect x="0" y="10" width="9" height="9" fill="#5C3D2A" rx="1" />
        </pattern>
        {/* Plinthe gradient */}
        <linearGradient id="plGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5C3D2A" />
          <stop offset="100%" stopColor="#3E2518" />
        </linearGradient>
        {/* Rug pattern */}
        <pattern id="rugPattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#6A1B4D" />
          <rect x="4" y="4" width="12" height="12" fill="none" stroke="rgba(255,200,100,0.12)" strokeWidth="1" />
          <circle cx="10" cy="10" r="3" fill="none" stroke="rgba(255,200,100,0.08)" strokeWidth="0.5" />
        </pattern>
        {/* Couette losange pattern */}
        <pattern id="losanges" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M10 0 L20 10 L10 20 L0 10 Z" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
        </pattern>
        {/* Lamp glow */}
        <radialGradient id="lampGlow" cx="12%" cy="55%" r="40%">
          <stop offset="0%" stopColor="rgba(255,220,80,0.18)" />
          <stop offset="50%" stopColor="rgba(255,200,60,0.06)" />
          <stop offset="100%" stopColor="rgba(255,200,60,0)" />
        </radialGradient>
        {/* Night overlay */}
        <radialGradient id="nightDark" cx="12%" cy="50%" r="80%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.35)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.72)" />
        </radialGradient>
        {/* Hover glow */}
        <filter id="hoverGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#C8B0E8" floodOpacity="0.7" />
        </filter>
        {/* Star glow (for night) */}
        <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ===== LAYER 0 — FOND ===== */}
      {/* Mur */}
      <rect x="0" y="0" width={VB_W} height="276" fill="url(#wallGrad)" />
      {/* Sol / parquet */}
      <rect x="0" y="276" width={VB_W} height="212" fill="url(#floorGrad)" />
      <rect x="0" y="276" width={VB_W} height="212" fill="url(#parquet)" opacity="0.6" />
      {/* Plinthe */}
      <rect x="0" y="269" width={VB_W} height="7" fill="url(#plGrad)" />

      {/* ===== LAYER 1 — DÉCORATIONS MURALES ===== */}

      {/* Fenêtre */}
      <g transform="translate(22, 24)">
        <rect x="-4" y="-4" width="103" height="118" rx="2" fill="#6B4830" />
        <rect x="0" y="0" width="95" height="110" rx="1" fill={lampOn ? "#1a1050" : "#020210"} />
        <image
          href={lampOn ? "/images/chambre/room/window-day.svg" : "/images/chambre/room/window-night.svg"}
          x="0" y="0" width="95" height="110"
          preserveAspectRatio="xMidYMid slice"
        />
        {/* Moon */}
        <circle cx="72" cy="18" r="8" fill="#FFFDE8"
                opacity={lampOn ? 0.5 : 0.9}
                style={{ filter: lampOn ? "none" : "url(#starGlow)" }} />
        {/* Stars */}
        {[{x:14,y:10,r:1.2},{x:32,y:16,r:1},{x:50,y:8,r:1.5},{x:20,y:35,r:0.8},{x:60,y:30,r:1},{x:40,y:25,r:0.7},{x:10,y:50,r:1},{x:55,y:48,r:0.8}].map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={lampOn ? 0.15 : 0.7}>
            <animate attributeName="opacity"
                     values={lampOn ? "0.1;0.2;0.1" : "0.5;0.9;0.5"}
                     dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        ))}
        {/* Daylight warm glow at bottom */}
        {lampOn && <rect x="0" y="70" width="95" height="40" rx="1" fill="rgba(255,180,100,0.15)" />}
        {/* Window cross */}
        <line x1="47.5" y1="0" x2="47.5" y2="110" stroke="#6B4830" strokeWidth="3" />
        <line x1="0" y1="55" x2="95" y2="55" stroke="#6B4830" strokeWidth="3" />
        {/* Curtains */}
        <rect x="-3" y="-2" width="18" height="114" rx="2" fill="#7B2050" opacity="0.85" />
        <line x1="4" y1="0" x2="4" y2="112" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
        <line x1="10" y1="0" x2="10" y2="112" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
        <rect x="80" y="-2" width="18" height="114" rx="2" fill="#7B2050" opacity="0.85" />
        {/* Curtain rod */}
        <rect x="-7" y="-5" width="109" height="3" rx="1" fill="#8B7355" />
      </g>

      {/* Poster DBZ */}
      <g transform="translate(134, 15)">
        <rect x="-2" y="-2" width="80" height="60" rx="1" fill="#222" />
        <image href="/images/chambre/room/poster-dbz.png"
               x="0" y="0" width="76" height="56"
               preserveAspectRatio="xMidYMid slice" />
      </g>

      {/* Poster Yu-Gi-Oh */}
      <g transform="translate(224, 59)">
        <rect x="-2" y="-2" width="52" height="66" rx="1" fill="#222" />
        <image href="/images/chambre/room/poster-yugioh.png"
               x="0" y="0" width="48" height="62"
               preserveAspectRatio="xMidYMid slice" />
      </g>

      {/* Glow-in-the-dark stars */}
      <g opacity={lampOn ? 0.06 : 0.85}
         style={{ transition: "opacity 0.8s ease", filter: lampOn ? "none" : "url(#starGlow)" }}>
        <image href="/images/chambre/room/glow-stars.png"
               x="258" y="5" width="200" height="130"
               preserveAspectRatio="xMidYMid meet" opacity="0.9" />
        {/* Fallback phospho stars */}
        {[{x:270,y:18},{x:310,y:35},{x:350,y:14},{x:390,y:40},{x:290,y:55},{x:360,y:60},{x:330,y:22},{x:400,y:20}].map((s, i) => (
          <text key={i} x={s.x} y={s.y} fill="#96FF96" fontSize="8" opacity={0.7 + Math.sin(i) * 0.3}>
            ✦
            {!lampOn && (
              <animate attributeName="opacity" values="0.5;1;0.5" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
            )}
          </text>
        ))}
      </g>

      {/* ===== LAYER 2 — ÉTAGÈRE ===== */}
      <g transform="translate(378, 78)">
        {/* SVG fallback shelf structure */}
        <rect x="0" y="0" width="160" height="4" rx="1" fill="#8B6B4A" />
        <rect x="0" y="4" width="160" height="3" fill="#6B4830" />
        <rect x="8" y="7" width="4" height="12" fill="#5C3D2A" />
        <rect x="148" y="7" width="4" height="12" fill="#5C3D2A" />
        {/* Second shelf */}
        <rect x="0" y="46" width="160" height="4" rx="1" fill="#7B5B3A" />
        <rect x="0" y="50" width="160" height="3" fill="#5C4033" />
        <rect x="10" y="53" width="4" height="10" fill="#4A3328" />
        <rect x="146" y="53" width="4" height="10" fill="#4A3328" />
        {/* Real image overlay */}
        <image href="/images/chambre/room/shelf.png"
               x="-5" y="-8" width="170" height="80"
               preserveAspectRatio="xMidYMid meet" />

        {/* Top shelf items */}
        {/* Lego box */}
        <rect x="10" y="-18" width="30" height="18" rx="1" fill="#E53935" stroke="#B71C1C" strokeWidth="0.5" />
        <text x="25" y="-6" textAnchor="middle" fill="#FFF" fontSize="6" fontWeight="bold">LEGO</text>
        {/* Bionicle */}
        <rect x="48" y="-22" width="11" height="22" rx="2" fill="#FF5722" stroke="#BF360C" strokeWidth="0.5" />
        {/* Board games stacked */}
        <rect x="90" y="-8" width="42" height="8" rx="1" fill="#2E7D32" stroke="#1B5E20" strokeWidth="0.5" />
        <rect x="90" y="-16" width="42" height="8" rx="1" fill="#1565C0" stroke="#0D47A1" strokeWidth="0.5" />
        <rect x="90" y="-24" width="42" height="8" rx="1" fill="#C62828" stroke="#B71C1C" strokeWidth="0.5" />
        {/* Scoubidous hanging */}
        {["#FF4444","#44FF44","#4488FF","#FFDD44","#FF44FF"].map((c, i) => (
          <line key={i} x1={68 + i * 6} y1={0} x2={66 + i * 6} y2={-18 + (i % 2) * 5}
                stroke={c} strokeWidth="2.5" strokeLinecap="round" />
        ))}

        {/* Bottom shelf items — books */}
        <rect x="18" y="30" width="9" height="15" fill="#C62828" />
        <rect x="28" y="32" width="8" height="13" fill="#1565C0" />
        <rect x="37" y="29" width="10" height="16" fill="#F57C00" />
        <rect x="48" y="31" width="7" height="14" fill="#7B1FA2" />
        <text x="90" y="43" textAnchor="middle" fill="#888" fontSize="9">📚</text>
      </g>

      {/* ===== LAYER 3 — LIT ===== */}
      <g transform="translate(241, 215)">
        {/* SVG fallback bed frame */}
        <rect x="0" y="30" width="302" height="165" rx="2" fill="#5C3D2A" />
        <rect x="0" y="0" width="12" height="195" rx="2" fill="#6B4830" />
        <rect x="290" y="0" width="12" height="195" rx="2" fill="#6B4830" />
        {/* Mattress */}
        <rect x="12" y="30" width="278" height="20" rx="1" fill="#F5F0E8" />
        {/* Real image overlay */}
        <image href="/images/chambre/room/bed.png"
               x="0" y="0" width="302" height="205"
               preserveAspectRatio="xMidYMid meet" />

        {/* Pillows */}
        <ellipse cx="80" cy="40" rx="35" ry="10" fill="#FFFEF8" stroke="#E8E0C8" strokeWidth="0.5" opacity="0.7" />
        <ellipse cx="155" cy="42" rx="30" ry="9" fill="#FFFEF8" stroke="#E8E0C8" strokeWidth="0.5" opacity="0.7" />

        {/* Couette */}
        <rect x="14" y="55" width="274" height="115" rx="2" fill={couetteColor} opacity="0.82" />
        {/* Losange pattern overlay */}
        <rect x="14" y="55" width="274" height="115" rx="2" fill="url(#losanges)" />
        {/* Couette fold at top */}
        <rect x="14" y="52" width="274" height="6" rx="1" fill={couetteColor} opacity="0.65" />
        {/* Diamond stitching lines */}
        <g opacity="0.10">
          {[0,1,2,3,4,5].map(i => (
            <line key={i} x1={14 + i * 46} y1="55" x2={14 + i * 46 + 30} y2="170"
                  stroke="#fff" strokeWidth="0.5" />
          ))}
          {[0,1,2,3,4,5].map(i => (
            <line key={`r${i}`} x1={288 - i * 46} y1="55" x2={288 - i * 46 - 30} y2="170"
                  stroke="#fff" strokeWidth="0.5" />
          ))}
        </g>

        {/* Peluches on bed */}
        <text x="220" y="46" fontSize="18">🧸</text>
        <text x="248" y="50" fontSize="12">🐰</text>
        <text x="195" y="48" fontSize="10">🐶</text>
      </g>

      {/* ===== LAYER 4 — TABLE DE NUIT + LAMPE ===== */}
      <g transform="translate(22, 254)">
        {/* SVG fallback nightstand */}
        <rect x="0" y="0" width="72" height="65" rx="1" fill="#6B4830" stroke="#5C3D2A" strokeWidth="1" />
        <rect x="0" y="0" width="72" height="4" fill="#8B6B4A" rx="1" />
        <rect x="8" y="14" width="56" height="22" rx="1" fill="#5C3D2A" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        <rect x="28" y="22" width="16" height="5" rx="2" fill="#9B8060" />
        <rect x="6" y="65" width="5" height="6" fill="#4A3328" />
        <rect x="61" y="65" width="5" height="6" fill="#4A3328" />
        {/* Real image */}
        <image href="/images/chambre/room/nightstand.png"
               x="-4" y="-6" width="80" height="78"
               preserveAspectRatio="xMidYMid meet" />
      </g>

      {/* Lampe */}
      <g transform="translate(30, 214)">
        {/* SVG fallback */}
        <polygon points="4,0 26,0 30,18 0,18"
                 fill={lampOn ? "#FFE082" : "#8B7355"} />
        {lampOn && <polygon points="4,0 26,0 30,18 0,18" fill="rgba(255,220,0,0.2)" />}
        <rect x="11" y="18" width="8" height="12" fill={lampOn ? "#C8A050" : "#7B6040"} />
        <rect x="6" y="30" width="18" height="5" rx="2" fill={lampOn ? "#B8903A" : "#6B5335"} />
        {/* Real image */}
        <image
          href={lampOn ? "/images/chambre/room/lamp-on.png" : "/images/chambre/room/lamp-off.png"}
          x="-2" y="-4" width="34" height="44"
          preserveAspectRatio="xMidYMid meet" />
        {lampOn && (
          <circle cx="15" cy="10" r="28" fill="rgba(255,220,80,0.08)" style={{ pointerEvents: "none" }} />
        )}
      </g>

      {/* Nightstand small items */}
      {/* Tamagotchi */}
      <g transform="translate(58, 264)">
        <rect x="0" y="0" width="20" height="26" rx="9" fill="#42A5F5" stroke="#1565C0" strokeWidth="1" />
        <rect x="4" y="6" width="12" height="9" rx="1" fill="#D0E0A8" stroke="#90B060" strokeWidth="0.5" />
        <text x="10" y="13" textAnchor="middle" fontSize="5">😊</text>
      </g>
      {/* Alarm clock */}
      <g transform="translate(26, 278)">
        <rect x="0" y="0" width="24" height="14" rx="1" fill="#1a1a1a" stroke="#333" strokeWidth="0.5" />
        <text x="12" y="11" textAnchor="middle" fill="#FF3333" fontSize="7" fontFamily="monospace">
          {new Date().getHours().toString().padStart(2,'0')}:{new Date().getMinutes().toString().padStart(2,'0')}
        </text>
      </g>
      {/* Journal */}
      <g transform="translate(74, 270)">
        <rect x="0" y="0" width="16" height="22" rx="1" fill="#8B4513" stroke="#6B3410" strokeWidth="0.5" />
        <text x="8" y="15" textAnchor="middle" fontSize="7">📓</text>
      </g>
      {/* Radio */}
      <g transform="translate(48, 284)">
        <rect x="0" y="0" width="22" height="15" rx="2" fill="#8B7355" stroke="#5C4528" strokeWidth="0.5" />
        <text x="11" y="11" textAnchor="middle" fontSize="7">📻</text>
      </g>

      {/* ===== LAYER 5 — SOL / PREMIER PLAN ===== */}

      {/* Rug */}
      <g>
        <rect x="34" y="336" width="235" height="137" rx="3" fill="url(#rugPattern)" />
        <rect x="40" y="342" width="223" height="125" rx="2" fill="none"
              stroke="rgba(255,200,100,0.08)" strokeWidth="0.5" />
        <image href="/images/chambre/room/rug.png"
               x="34" y="336" width="235" height="137"
               preserveAspectRatio="xMidYMid meet" opacity="0.85" />
      </g>

      {/* Panini album */}
      <g transform="translate(54, 370)">
        <rect x="0" y="0" width="42" height="30" rx="2" fill="#DAA520" stroke="#8B6914" strokeWidth="1"
              transform="rotate(-5)" />
        <text x="17" y="16" fontSize="10" transform="rotate(-5)">⚽</text>
        <text x="10" y="26" fontSize="4" fill="#4A3000" fontWeight="bold" transform="rotate(-5)">PANINI</text>
      </g>

      {/* Billes */}
      <g transform="translate(120, 376)">
        <circle cx="0" cy="0" r="9">
          <animate attributeName="fill" values="#1E90FF" dur="1s" repeatCount="1" fill="freeze" />
        </circle>
        <circle cx="0" cy="0" r="9" fill="#1E90FF" />
        <circle cx="-2" cy="-3" r="3.5" fill="#87CEFA" opacity="0.5" />
        <circle cx="18" cy="4" r="7" fill="#FF6347" />
        <circle cx="16" cy="2" r="2.8" fill="#FFD700" opacity="0.4" />
        <circle cx="-14" cy="8" r="11" fill="#6A40B0" />
        <circle cx="-16" cy="5" r="4.5" fill="#B8A0E0" opacity="0.4" />
        <circle cx="30" cy="10" r="5" fill="#228B22" />
        <circle cx="29" cy="8" r="2.2" fill="#90EE90" opacity="0.4" />
      </g>

      {/* Pâte à prout */}
      <g transform="translate(140, 412)">
        <ellipse cx="18" cy="12" rx="18" ry="12" fill="#AB47BC" stroke="#7B1FA2" strokeWidth="0.5" />
        <text x="18" y="16" textAnchor="middle" fontSize="10">💩</text>
      </g>

      {/* Beyblades */}
      <g transform="translate(205, 404)">
        {/* Arena circle (faint) */}
        <ellipse cx="30" cy="18" rx="36" ry="22" fill="none" stroke="rgba(100,100,100,0.12)" strokeWidth="1" />
        {/* Dragoon (blue) */}
        <circle cx="16" cy="14" r="14" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
        <circle cx="16" cy="14" r="5" fill="#1D4ED8" stroke="#93C5FD" strokeWidth="0.5" />
        <line x1="8" y1="6" x2="24" y2="22" stroke="#93C5FD" strokeWidth="0.3" opacity="0.6" />
        <line x1="24" y1="6" x2="8" y2="22" stroke="#93C5FD" strokeWidth="0.3" opacity="0.6" />
        {/* Dranzer (red) */}
        <circle cx="44" cy="20" r="11" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.2" />
        <circle cx="44" cy="20" r="4" fill="#B91C1C" stroke="#FCA5A5" strokeWidth="0.5" />
        <line x1="37" y1="13" x2="51" y2="27" stroke="#FCA5A5" strokeWidth="0.3" opacity="0.6" />
        <line x1="51" y1="13" x2="37" y2="27" stroke="#FCA5A5" strokeWidth="0.3" opacity="0.6" />
      </g>

      {/* Sous le lit */}
      <g transform="translate(298, 393)">
        <rect x="0" y="0" width="58" height="22" rx="3" fill="rgba(0,0,0,0.45)"
              stroke="rgba(200,176,232,0.25)" strokeWidth="0.5" strokeDasharray="3 2" />
        <text x="7" y="15" fill="#C8B0E8" fontSize="7.5" fontFamily="Tahoma, sans-serif">👀 Sous le lit</text>
      </g>

      {/* ===== LAYER 6 — EFFETS D'ÉCLAIRAGE ===== */}
      {/* Lamp ambient glow */}
      {lampOn && (
        <rect x="0" y="0" width={VB_W} height={VB_H}
              fill="url(#lampGlow)" style={{ pointerEvents: "none" }} />
      )}
      {/* Night dark overlay */}
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
      {/* Tooltip */}
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

      {/* Hint text */}
      <text x={VB_W / 2} y={VB_H - 8} textAnchor="middle"
            fill="rgba(139,107,174,0.35)" fontSize="9"
            fontFamily="Tahoma, sans-serif"
            style={{ pointerEvents: "none" }}>
        Clique sur les objets pour les explorer
      </text>
    </svg>
  );
}
