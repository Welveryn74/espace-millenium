import { useState, useRef, useCallback } from "react";
import { ROOM_ITEMS } from "../../../data/chambreItems";

// Isometric room constants
const VB_W = 800;
const VB_H = 600;

// Room geometry — isometric projection 2:1
const FLOOR = {
  top:    { x: 400, y: 260 },
  right:  { x: 720, y: 420 },
  bottom: { x: 400, y: 580 },
  left:   { x: 80,  y: 420 },
};

const WALL_H = 260;
const BACK_WALL = {
  tl: { x: 80,  y: FLOOR.left.y - WALL_H },
  tr: { x: 720, y: FLOOR.right.y - WALL_H },
  bl: FLOOR.left,
  br: FLOOR.right,
};

// Hotspot positions — aligned exactly to visual elements
// These are in viewBox coordinates so they scale automatically with the SVG
const ISO_HOTSPOTS = {
  // Window elements
  fenetre:     { x: 116, y: 176, w: 88, h: 108 },
  // Shelf items
  lego:        { x: 465, y: 147, w: 55, h: 30 },
  jeuxSociete: { x: 555, y: 141, w: 48, h: 32 },
  scoubidous:  { x: 523, y: 164, w: 35, h: 24 },
  // Bed area
  couette:     { x: 400, y: 288, w: 220, h: 80 },
  peluches:    { x: 555, y: 276, w: 65, h: 28 },
  // Nightstand items
  lampe:       { x: 110, y: 252, w: 35, h: 45 },
  tamagotchi:  { x: 142, y: 268, w: 22, h: 28 },
  reveil:      { x: 102, y: 276, w: 26, h: 16 },
  journal:     { x: 155, y: 270, w: 18, h: 24 },
  radio:       { x: 128, y: 278, w: 24, h: 18 },
  // Floor items
  panini:      { x: 230, y: 430, w: 40, h: 30 },
  pateAProut:  { x: 148, y: 450, w: 35, h: 25 },
  billes:      { x: 305, y: 440, w: 55, h: 30 },
  beyblade:    { x: 540, y: 456, w: 60, h: 35 },
  sousLelit:   { x: 390, y: 405, w: 58, h: 24 },
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
      const pos = ISO_HOTSPOTS[id];
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
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      }}
      shapeRendering="crispEdges"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Wall gradient (back) */}
        <linearGradient id="wallBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2E2245" />
          <stop offset="40%" stopColor="#362952" />
          <stop offset="100%" stopColor="#3D2F5C" />
        </linearGradient>
        <linearGradient id="wallLeft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#352950" />
          <stop offset="100%" stopColor="#433466" />
        </linearGradient>
        <linearGradient id="wallRight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#261E3C" />
          <stop offset="100%" stopColor="#2E2548" />
        </linearGradient>

        {/* Floor parquet pattern */}
        <pattern id="parquet" width="40" height="20" patternUnits="userSpaceOnUse"
                 patternTransform="skewX(-26.57) scale(1.2)">
          <rect width="40" height="20" fill="#6B4830" />
          <rect x="0" y="0" width="19" height="9" fill="#7B5638" rx="1" />
          <rect x="20" y="0" width="19" height="9" fill="#5C3D2A" rx="1" />
          <rect x="10" y="10" width="19" height="9" fill="#7B5638" rx="1" />
          <rect x="30" y="10" width="10" height="9" fill="#5C3D2A" rx="1" />
          <rect x="0" y="10" width="9" height="9" fill="#5C3D2A" rx="1" />
        </pattern>

        <radialGradient id="lampGlow" cx="18%" cy="50%" r="40%">
          <stop offset="0%" stopColor="rgba(255,220,80,0.15)" />
          <stop offset="50%" stopColor="rgba(255,200,60,0.05)" />
          <stop offset="100%" stopColor="rgba(255,200,60,0)" />
        </radialGradient>
        <radialGradient id="nightDark" cx="15%" cy="45%" r="80%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.4)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.75)" />
        </radialGradient>

        <filter id="hoverGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#C8B0E8" floodOpacity="0.7" />
        </filter>

        <pattern id="rugPattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#6A1B4D" />
          <rect x="4" y="4" width="12" height="12" fill="none" stroke="rgba(255,200,100,0.12)" strokeWidth="1" />
          <circle cx="10" cy="10" r="3" fill="none" stroke="rgba(255,200,100,0.08)" strokeWidth="0.5" />
        </pattern>

        <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ===== BACKGROUND (fills any letterbox gaps) ===== */}
      <rect x="0" y="0" width={VB_W} height={VB_H} fill="#0a0612" />

      {/* ===== CEILING ===== */}
      <polygon
        points={`${BACK_WALL.tl.x},${BACK_WALL.tl.y - 15} ${BACK_WALL.tr.x},${BACK_WALL.tr.y - 15} ${BACK_WALL.tr.x},${BACK_WALL.tr.y} ${BACK_WALL.tl.x},${BACK_WALL.tl.y}`}
        fill="#1E1633"
      />

      {/* ===== BACK WALL ===== */}
      <polygon
        points={`${BACK_WALL.tl.x},${BACK_WALL.tl.y} ${BACK_WALL.tr.x},${BACK_WALL.tr.y} ${BACK_WALL.br.x},${BACK_WALL.br.y} ${BACK_WALL.bl.x},${BACK_WALL.bl.y}`}
        fill="url(#wallBack)"
      />

      {/* ===== LEFT WALL ===== */}
      <polygon
        points={`0,${BACK_WALL.tl.y - 40} ${BACK_WALL.tl.x},${BACK_WALL.tl.y} ${FLOOR.left.x},${FLOOR.left.y} 0,${FLOOR.bottom.y}`}
        fill="url(#wallLeft)"
      />

      {/* ===== RIGHT WALL ===== */}
      <polygon
        points={`${VB_W},${BACK_WALL.tr.y - 40} ${BACK_WALL.tr.x},${BACK_WALL.tr.y} ${FLOOR.right.x},${FLOOR.right.y} ${VB_W},${FLOOR.bottom.y}`}
        fill="url(#wallRight)"
      />

      {/* ===== PLINTHES ===== */}
      <line x1={BACK_WALL.bl.x} y1={BACK_WALL.bl.y} x2={BACK_WALL.br.x} y2={BACK_WALL.br.y}
            stroke="#6B4830" strokeWidth="5" />
      <line x1="0" y1={FLOOR.bottom.y} x2={FLOOR.left.x} y2={FLOOR.left.y}
            stroke="#5C3D2A" strokeWidth="4" />
      <line x1={VB_W} y1={FLOOR.bottom.y} x2={FLOOR.right.x} y2={FLOOR.right.y}
            stroke="#4A3328" strokeWidth="4" />

      {/* ===== FLOOR ===== */}
      <polygon
        points={`${FLOOR.top.x},${FLOOR.top.y} ${FLOOR.right.x},${FLOOR.right.y} ${FLOOR.bottom.x},${FLOOR.bottom.y} ${FLOOR.left.x},${FLOOR.left.y}`}
        fill="#4A3328"
      />
      <polygon
        points={`${FLOOR.top.x},${FLOOR.top.y} ${FLOOR.right.x},${FLOOR.right.y} ${FLOOR.bottom.x},${FLOOR.bottom.y} ${FLOOR.left.x},${FLOOR.left.y}`}
        fill="url(#parquet)"
      />

      {/* ===== WINDOW (with real image) ===== */}
      <g transform="translate(116, 176)">
        {/* Frame */}
        <rect x="-4" y="-4" width="96" height="116" rx="2" fill="#6B4830" />
        {/* CSS fallback glass */}
        <rect x="0" y="0" width="88" height="108" rx="1"
              fill={lampOn ? "#1a1050" : "#020210"} />
        {/* Real image on top */}
        <image
          href={lampOn ? "/images/chambre/room/window-day.svg" : "/images/chambre/room/window-night.svg"}
          x="0" y="0" width="88" height="108"
          preserveAspectRatio="xMidYMid slice"
        />
        {/* Moon */}
        <circle cx="66" cy="18" r="8" fill="#FFFDE8"
                opacity={lampOn ? 0.6 : 0.9}
                style={{ filter: lampOn ? "none" : "url(#starGlow)" }} />
        {/* Stars in window */}
        {[{x:12,y:8,r:1.2},{x:28,y:14,r:1},{x:45,y:6,r:1.5},{x:18,y:30,r:0.8},{x:55,y:28,r:1},{x:35,y:22,r:0.7},{x:8,y:42,r:1},{x:50,y:45,r:0.8}].map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={lampOn ? 0.15 : 0.7}>
            <animate attributeName="opacity"
                     values={lampOn ? "0.1;0.2;0.1" : "0.5;0.9;0.5"}
                     dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        ))}
        {lampOn && <rect x="0" y="68" width="88" height="40" rx="1" fill="rgba(255,180,100,0.15)" />}
        {/* Window cross */}
        <line x1="44" y1="0" x2="44" y2="108" stroke="#6B4830" strokeWidth="3" />
        <line x1="0" y1="54" x2="88" y2="54" stroke="#6B4830" strokeWidth="3" />
        {/* Curtains */}
        <rect x="-2" y="-2" width="18" height="112" rx="2" fill="#7B2050" opacity="0.85" />
        <line x1="5" y1="0" x2="5" y2="110" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
        <line x1="10" y1="0" x2="10" y2="110" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
        <rect x="72" y="-2" width="18" height="112" rx="2" fill="#7B2050" opacity="0.85" />
        <rect x="-6" y="-5" width="100" height="3" rx="1" fill="#8B7355" />
      </g>

      {/* ===== POSTERS (with real images) ===== */}
      <g transform="translate(255, 172)">
        <rect x="-2" y="-2" width="72" height="55" rx="1" fill="#222" />
        <image href="/images/chambre/room/poster-dbz.png"
               x="0" y="0" width="68" height="51"
               preserveAspectRatio="xMidYMid slice" />
      </g>
      <g transform="translate(350, 185)">
        <rect x="-2" y="-2" width="48" height="62" rx="1" fill="#222" />
        <image href="/images/chambre/room/poster-yugioh.png"
               x="0" y="0" width="44" height="58"
               preserveAspectRatio="xMidYMid slice" />
      </g>

      {/* ===== GLOW-IN-THE-DARK STARS (with real image) ===== */}
      <g opacity={lampOn ? 0.06 : 0.85}
         style={{ transition: "opacity 0.8s ease", filter: lampOn ? "none" : "url(#starGlow)" }}>
        <image href="/images/chambre/room/glow-stars.png"
               x="410" y="160" width="220" height="76"
               preserveAspectRatio="xMidYMid meet" opacity="0.9" />
        {/* Fallback stars if image missing */}
        {[{x:420,y:170},{x:460,y:185},{x:500,y:168},{x:540,y:190},{x:445,y:200},{x:510,y:205},{x:480,y:175},{x:530,y:172}].map((s, i) => (
          <text key={i} x={s.x} y={s.y} fill="#96FF96" fontSize="8" opacity={0.7 + Math.sin(i) * 0.3}>
            ✦
            {!lampOn && (
              <animate attributeName="opacity" values="0.5;1;0.5" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
            )}
          </text>
        ))}
      </g>

      {/* ===== SHELF (with real image + fallback) ===== */}
      <g transform="translate(440, 100)">
        {/* SVG fallback shelf structure */}
        <polygon points="0,60 200,60 215,70 15,70" fill="#8B6B4A" />
        <polygon points="15,70 215,70 215,76 15,76" fill="#6B4830" />
        <rect x="30" y="76" width="4" height="16" fill="#5C3D2A" />
        <rect x="175" y="76" width="4" height="16" fill="#5C3D2A" />
        <polygon points="10,110 200,110 212,118 18,118" fill="#7B5B3A" />
        <polygon points="18,118 212,118 212,122 18,122" fill="#5C4033" />
        <rect x="40" y="122" width="4" height="14" fill="#4A3328" />
        <rect x="168" y="122" width="4" height="14" fill="#4A3328" />
        {/* Real image overlay */}
        <image href="/images/chambre/room/shelf.png"
               x="-10" y="-10" width="230" height="155"
               preserveAspectRatio="xMidYMid meet" />
        {/* Items on top shelf (drawn on top of image) */}
        {/* Lego box */}
        <rect x="20" y="40" width="30" height="20" rx="1" fill="#E53935" stroke="#B71C1C" strokeWidth="0.5" />
        <text x="35" y="54" textAnchor="middle" fill="#FFF" fontSize="7" fontWeight="bold">LEGO</text>
        {/* Bionicle */}
        <rect x="58" y="34" width="11" height="26" rx="2" fill="#FF5722" stroke="#BF360C" strokeWidth="0.5" />
        {/* Board games stacked */}
        <rect x="120" y="52" width="42" height="8" rx="1" fill="#2E7D32" stroke="#1B5E20" strokeWidth="0.5" />
        <rect x="120" y="44" width="42" height="8" rx="1" fill="#1565C0" stroke="#0D47A1" strokeWidth="0.5" />
        <rect x="120" y="36" width="42" height="8" rx="1" fill="#C62828" stroke="#B71C1C" strokeWidth="0.5" />
        {/* Scoubidous hanging */}
        {["#FF4444","#44FF44","#4488FF","#FFDD44","#FF44FF"].map((c, i) => (
          <line key={i} x1={85 + i * 6} y1={58} x2={83 + i * 6} y2={36 + (i % 2) * 5}
                stroke={c} strokeWidth="2.5" strokeLinecap="round" />
        ))}
        {/* Books on second shelf */}
        <rect x="35" y="92" width="9" height="17" fill="#C62828" />
        <rect x="45" y="94" width="8" height="15" fill="#1565C0" />
        <rect x="54" y="91" width="10" height="18" fill="#F57C00" />
        <rect x="65" y="93" width="7" height="16" fill="#7B1FA2" />
        <text x="110" y="106" textAnchor="middle" fill="#888" fontSize="9">📚</text>
      </g>

      {/* ===== RUG (with real image) ===== */}
      <g>
        {/* SVG fallback */}
        <polygon
          points="300,400 440,460 300,520 160,460"
          fill="url(#rugPattern)"
          stroke="rgba(255,200,100,0.1)" strokeWidth="1"
        />
        <polygon
          points="300,410 430,462 300,514 170,462"
          fill="none" stroke="rgba(255,200,100,0.08)" strokeWidth="0.5"
        />
        {/* Real image */}
        <image href="/images/chambre/room/rug.png"
               x="155" y="395" width="290" height="130"
               preserveAspectRatio="none" opacity="0.85" />
      </g>

      {/* ===== BED (with real image + fallback) ===== */}
      <g transform="translate(370, 255)">
        {/* SVG fallback bed frame */}
        <polygon points="0,0 240,0 260,18 20,18" fill="#7B5B3A" stroke="#5C3D2A" strokeWidth="1" />
        <polygon points="0,-38 0,0 20,18 20,-25" fill="#6B4830" stroke="#5C3D2A" strokeWidth="0.5" />
        <rect x="3" y="-33" width="14" height="28" rx="1" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        <polygon points="240,0 260,18 260,100 240,85" fill="#5C3D2A" />
        <polygon points="20,18 260,18 260,100 20,100" fill="#4A3328" />
        {/* Mattress */}
        <polygon points="8,5 238,5 254,18 24,18" fill="#F5F0E8" />
        <polygon points="24,18 254,18 254,27 24,27" fill="#E8E0D0" />
        {/* Real image overlay */}
        <image href="/images/chambre/room/bed.png"
               x="-10" y="-45" width="280" height="155"
               preserveAspectRatio="xMidYMid meet" />
        {/* Pillows (on top of image) */}
        <ellipse cx="55" cy="10" rx="30" ry="7" fill="#FFFEF8" stroke="#E8E0C8" strokeWidth="0.5" opacity="0.7" />
        <ellipse cx="110" cy="11" rx="24" ry="6" fill="#FFFEF8" stroke="#E8E0C8" strokeWidth="0.5" opacity="0.7" />
        {/* Couette */}
        <polygon points="24,22 254,22 254,93 24,93" fill={couetteColor} opacity="0.85" />
        {/* Couette pattern */}
        <g opacity="0.12">
          {[0,1,2,3,4].map(i => (
            <line key={i} x1={24 + i * 46} y1="22" x2={24 + i * 46 + 26} y2="93"
                  stroke="#fff" strokeWidth="0.5" />
          ))}
          {[0,1,2,3,4].map(i => (
            <line key={`r${i}`} x1={254 - i * 46} y1="22" x2={254 - i * 46 - 26} y2="93"
                  stroke="#fff" strokeWidth="0.5" />
          ))}
        </g>
        <rect x="24" y="20" width="230" height="5" fill={couetteColor} opacity="0.7" />
        {/* Peluches on bed */}
        <text x="200" y="16" fontSize="16">🧸</text>
        <text x="222" y="20" fontSize="11">🐰</text>
        <text x="178" y="18" fontSize="9">🐶</text>
      </g>

      {/* ===== NIGHTSTAND (with real image) ===== */}
      <g transform="translate(90, 280)">
        {/* SVG fallback */}
        <polygon points="0,0 80,0 90,10 10,10" fill="#8B6B4A" />
        <polygon points="10,10 90,10 90,62 10,62" fill="#6B4830" />
        <polygon points="0,0 10,10 10,62 0,52" fill="#5C3D2A" />
        <rect x="20" y="18" width="60" height="22" rx="1" fill="#5C3D2A" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        <rect x="42" y="26" width="16" height="5" rx="2" fill="#9B8060" />
        <rect x="15" y="62" width="5" height="7" fill="#4A3328" />
        <rect x="78" y="62" width="5" height="7" fill="#4A3328" />
        {/* Real image overlay */}
        <image href="/images/chambre/room/nightstand.png"
               x="-5" y="-8" width="100" height="80"
               preserveAspectRatio="xMidYMid meet" />
      </g>

      {/* ===== LAMP (with real image) ===== */}
      <g transform="translate(105, 238)">
        {/* SVG fallback */}
        <polygon points="4,0 28,0 32,20 0,20"
                 fill={lampOn ? "#FFE082" : "#8B7355"} />
        {lampOn && <polygon points="4,0 28,0 32,20 0,20" fill="rgba(255,220,0,0.2)" />}
        <rect x="13" y="20" width="6" height="13" fill={lampOn ? "#C8A050" : "#7B6040"} />
        <rect x="7" y="33" width="18" height="5" rx="2" fill={lampOn ? "#B8903A" : "#6B5335"} />
        {/* Real image */}
        <image
          href={lampOn ? "/images/chambre/room/lamp-on.png" : "/images/chambre/room/lamp-off.png"}
          x="-2" y="-5" width="36" height="48"
          preserveAspectRatio="xMidYMid meet" />
        {lampOn && (
          <circle cx="16" cy="12" r="30" fill="rgba(255,220,80,0.08)" style={{ pointerEvents: "none" }} />
        )}
      </g>

      {/* ===== NIGHTSTAND SMALL ITEMS ===== */}
      {/* Tamagotchi */}
      <g transform="translate(145, 268)">
        <rect x="0" y="0" width="20" height="26" rx="9" fill="#42A5F5" stroke="#1565C0" strokeWidth="1" />
        <rect x="4" y="6" width="12" height="9" rx="1" fill="#D0E0A8" stroke="#90B060" strokeWidth="0.5" />
        <text x="10" y="13" textAnchor="middle" fontSize="5">😊</text>
      </g>
      {/* Alarm clock */}
      <g transform="translate(103, 278)">
        <rect x="0" y="0" width="24" height="14" rx="1" fill="#1a1a1a" stroke="#333" strokeWidth="0.5" />
        <text x="12" y="11" textAnchor="middle" fill="#FF3333" fontSize="7" fontFamily="monospace">
          {new Date().getHours().toString().padStart(2,'0')}:{new Date().getMinutes().toString().padStart(2,'0')}
        </text>
      </g>
      {/* Journal */}
      <g transform="translate(157, 272)">
        <rect x="0" y="0" width="16" height="22" rx="1" fill="#8B4513" stroke="#6B3410" strokeWidth="0.5" />
        <text x="8" y="15" textAnchor="middle" fontSize="7">📓</text>
      </g>
      {/* Radio */}
      <g transform="translate(129, 280)">
        <rect x="0" y="0" width="22" height="15" rx="2" fill="#8B7355" stroke="#5C4528" strokeWidth="0.5" />
        <text x="11" y="11" textAnchor="middle" fontSize="7">📻</text>
      </g>

      {/* ===== FLOOR ITEMS ===== */}
      {/* Panini album */}
      <g transform="translate(235, 432)">
        <rect x="0" y="0" width="35" height="26" rx="1" fill="#DAA520" stroke="#8B6914" strokeWidth="1"
              transform="rotate(-8)" />
        <text x="14" y="15" fontSize="9" transform="rotate(-8)">⚽</text>
        <text x="9" y="23" fontSize="3.5" fill="#4A3000" fontWeight="bold" transform="rotate(-8)">PANINI</text>
      </g>

      {/* Billes */}
      <g transform="translate(320, 450)">
        <circle cx="0" cy="0" r="8" fill="#1E90FF" />
        <circle cx="-2" cy="-3" r="3" fill="#87CEFA" opacity="0.5" />
        <circle cx="16" cy="3" r="6" fill="#FF6347" />
        <circle cx="14" cy="1" r="2.5" fill="#FFD700" opacity="0.4" />
        <circle cx="-12" cy="6" r="10" fill="#6A40B0" />
        <circle cx="-14" cy="4" r="4" fill="#B8A0E0" opacity="0.4" />
        <circle cx="25" cy="8" r="4.5" fill="#228B22" />
        <circle cx="24" cy="6" r="2" fill="#90EE90" opacity="0.4" />
      </g>

      {/* Pate a prout */}
      <g transform="translate(155, 455)">
        <ellipse cx="16" cy="11" rx="16" ry="11" fill="#8E24AA" stroke="#4A148C" strokeWidth="0.5" />
        <text x="16" y="15" textAnchor="middle" fontSize="9">💩</text>
      </g>

      {/* Beyblade */}
      <g transform="translate(545, 460)">
        <ellipse cx="24" cy="14" rx="33" ry="20" fill="none" stroke="rgba(100,100,100,0.15)" strokeWidth="1" />
        <circle cx="14" cy="10" r="12" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
        <circle cx="14" cy="10" r="4" fill="#1D4ED8" stroke="#93C5FD" strokeWidth="0.5" />
        <circle cx="36" cy="16" r="9" fill="#EF4444" stroke="#B91C1C" strokeWidth="1" />
        <circle cx="36" cy="16" r="3" fill="#B91C1C" stroke="#FCA5A5" strokeWidth="0.5" />
      </g>

      {/* Sous le lit */}
      <g transform="translate(392, 408)">
        <rect x="0" y="0" width="55" height="20" rx="3" fill="rgba(0,0,0,0.4)"
              stroke="rgba(200,176,232,0.25)" strokeWidth="0.5" strokeDasharray="3 2" />
        <text x="7" y="14" fill="#C8B0E8" fontSize="7.5" fontFamily="Tahoma, sans-serif">👀 Sous le lit</text>
      </g>

      {/* ===== INTERACTIVE HOTSPOTS (last layer before overlays) ===== */}
      {Object.entries(ISO_HOTSPOTS).map(([id, pos]) => {
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

      {/* ===== LAMP AMBIENT GLOW ===== */}
      {lampOn && (
        <rect x="0" y="0" width={VB_W} height={VB_H}
              fill="url(#lampGlow)" style={{ pointerEvents: "none" }} />
      )}

      {/* ===== DARK OVERLAY ===== */}
      <rect x="0" y="0" width={VB_W} height={VB_H}
            fill="url(#nightDark)"
            opacity={lampOn ? 0 : 1}
            style={{ pointerEvents: "none", transition: "opacity 0.8s ease" }} />

      {/* ===== TOOLTIP ===== */}
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

      {/* ===== TITLE HINT ===== */}
      <text x={VB_W / 2} y={VB_H - 8} textAnchor="middle"
            fill="rgba(139,107,174,0.35)" fontSize="9"
            fontFamily="Tahoma, sans-serif"
            style={{ pointerEvents: "none" }}>
        Clique sur les objets pour les explorer
      </text>
    </svg>
  );
}
