import { useState } from "react";
import { ROOM_ITEMS } from "../../../data/chambreItems";

// Isometric room constants
const VB_W = 800;
const VB_H = 600;

// Room geometry — isometric projection 2:1
// Floor diamond vertices
const FLOOR = {
  top:    { x: 400, y: 260 },
  right:  { x: 720, y: 420 },
  bottom: { x: 400, y: 580 },
  left:   { x: 80,  y: 420 },
};

// Wall corners
const WALL_H = 260; // Wall height in SVG units
const BACK_WALL = {
  tl: { x: 80,  y: FLOOR.left.y - WALL_H },
  tr: { x: 720, y: FLOOR.right.y - WALL_H },
  bl: FLOOR.left,
  br: FLOOR.right,
};

// Hotspot positions mapped to iso coordinates
const ISO_POSITIONS = {
  couette:     { x: 480, y: 340, w: 100, h: 50 },
  peluches:    { x: 590, y: 290, w: 70,  h: 45 },
  tamagotchi:  { x: 170, y: 310, w: 30,  h: 30 },
  lampe:       { x: 140, y: 260, w: 40,  h: 50 },
  lego:        { x: 540, y: 170, w: 50,  h: 40 },
  jeuxSociete: { x: 620, y: 175, w: 50,  h: 35 },
  scoubidous:  { x: 470, y: 175, w: 40,  h: 35 },
  panini:      { x: 250, y: 440, w: 45,  h: 35 },
  pateAProut:  { x: 170, y: 460, w: 35,  h: 28 },
  billes:      { x: 340, y: 460, w: 50,  h: 30 },
  beyblade:    { x: 560, y: 470, w: 55,  h: 40 },
  reveil:      { x: 120, y: 290, w: 30,  h: 20 },
  journal:     { x: 200, y: 280, w: 28,  h: 35 },
  radio:       { x: 155, y: 300, w: 30,  h: 22 },
  sousLelit:   { x: 420, y: 420, w: 60,  h: 30 },
};

export default function ChambreRoomSVG({ lampOn, couetteColor, onToggleLamp, setActiveItem, hoveredItem, setHoveredItem }) {
  const [tooltipPos, setTooltipPos] = useState(null);

  const handleItemClick = (id, e) => {
    e.stopPropagation();
    const item = ROOM_ITEMS.find(i => i.id === id);
    if (!item?.interactive) return;
    if (id === "lampe") { onToggleLamp(); return; }
    setActiveItem(id);
  };

  const handleHover = (id, entering) => {
    if (entering) {
      setHoveredItem(id);
      const pos = ISO_POSITIONS[id];
      if (pos) setTooltipPos({ x: pos.x + pos.w / 2, y: pos.y - 10 });
    } else {
      setHoveredItem(null);
      setTooltipPos(null);
    }
  };

  const hoveredItemData = hoveredItem ? ROOM_ITEMS.find(i => i.id === hoveredItem) : null;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: "#0a0612" }}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        style={{ width: "100%", height: "100%", display: "block" }}
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

          {/* Wall gradient (left, brighter for lamp) */}
          <linearGradient id="wallLeft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#352950" />
            <stop offset="100%" stopColor="#433466" />
          </linearGradient>

          {/* Wall gradient (right, darker) */}
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

          {/* Lamp glow radial */}
          <radialGradient id="lampGlow" cx="18%" cy="50%" r="40%">
            <stop offset="0%" stopColor="rgba(255,220,80,0.15)" />
            <stop offset="50%" stopColor="rgba(255,200,60,0.05)" />
            <stop offset="100%" stopColor="rgba(255,200,60,0)" />
          </radialGradient>

          {/* Night overlay */}
          <radialGradient id="nightDark" cx="15%" cy="45%" r="80%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.4)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.75)" />
          </radialGradient>

          {/* Hover glow filter */}
          <filter id="hoverGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#C8B0E8" floodOpacity="0.6" />
          </filter>

          {/* Rug pattern */}
          <pattern id="rugPattern" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="#6A1B4D" />
            <rect x="4" y="4" width="12" height="12" fill="none" stroke="rgba(255,200,100,0.12)" strokeWidth="1" />
            <circle cx="10" cy="10" r="3" fill="none" stroke="rgba(255,200,100,0.08)" strokeWidth="0.5" />
          </pattern>

          {/* Star glow for phospho stars */}
          <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ===== CEILING (barely visible) ===== */}
        <polygon
          points={`${BACK_WALL.tl.x},${BACK_WALL.tl.y - 15} ${BACK_WALL.tr.x},${BACK_WALL.tr.y - 15} ${BACK_WALL.tr.x},${BACK_WALL.tr.y} ${BACK_WALL.tl.x},${BACK_WALL.tl.y}`}
          fill="#1E1633"
        />

        {/* ===== BACK WALL ===== */}
        <polygon
          points={`${BACK_WALL.tl.x},${BACK_WALL.tl.y} ${BACK_WALL.tr.x},${BACK_WALL.tr.y} ${BACK_WALL.br.x},${BACK_WALL.br.y} ${BACK_WALL.bl.x},${BACK_WALL.bl.y}`}
          fill="url(#wallBack)"
        />

        {/* Subtle wall texture */}
        <polygon
          points={`${BACK_WALL.tl.x},${BACK_WALL.tl.y} ${BACK_WALL.tr.x},${BACK_WALL.tr.y} ${BACK_WALL.br.x},${BACK_WALL.br.y} ${BACK_WALL.bl.x},${BACK_WALL.bl.y}`}
          fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5"
          style={{ pointerEvents: "none" }}
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

        {/* ===== BASEBOARD / PLINTHES ===== */}
        {/* Back wall baseboard */}
        <line x1={BACK_WALL.bl.x} y1={BACK_WALL.bl.y} x2={BACK_WALL.br.x} y2={BACK_WALL.br.y}
              stroke="#6B4830" strokeWidth="5" />
        {/* Left wall baseboard */}
        <line x1="0" y1={FLOOR.bottom.y} x2={FLOOR.left.x} y2={FLOOR.left.y}
              stroke="#5C3D2A" strokeWidth="4" />
        {/* Right wall baseboard */}
        <line x1={VB_W} y1={FLOOR.bottom.y} x2={FLOOR.right.x} y2={FLOOR.right.y}
              stroke="#4A3328" strokeWidth="4" />

        {/* ===== FLOOR (isometric diamond) ===== */}
        <polygon
          points={`${FLOOR.top.x},${FLOOR.top.y} ${FLOOR.right.x},${FLOOR.right.y} ${FLOOR.bottom.x},${FLOOR.bottom.y} ${FLOOR.left.x},${FLOOR.left.y}`}
          fill="url(#parquet)"
        />
        {/* Floor base color underneath */}
        <polygon
          points={`${FLOOR.top.x},${FLOOR.top.y} ${FLOOR.right.x},${FLOOR.right.y} ${FLOOR.bottom.x},${FLOOR.bottom.y} ${FLOOR.left.x},${FLOOR.left.y}`}
          fill="#4A3328" opacity="0.3"
        />

        {/* ===== WINDOW ON WALL ===== */}
        <g transform="translate(120, 180)">
          {/* Window frame */}
          <rect x="-4" y="-4" width="88" height="108" rx="2" fill="#6B4830" />
          {/* Window glass */}
          <rect x="0" y="0" width="80" height="100" rx="1"
                fill={lampOn ? "#1a1050" : "#020210"} />
          {/* Sunset/night sky gradient overlay */}
          <rect x="0" y="0" width="80" height="100" rx="1" opacity="0.6"
                fill={lampOn ? "url(#wallBack)" : "#060620"} />
          {/* Moon */}
          <circle cx="60" cy="18" r="8"
                  fill="#FFFDE8"
                  opacity={lampOn ? 0.6 : 0.9}
                  style={{ filter: lampOn ? "none" : "url(#starGlow)" }} />
          {/* Stars in window */}
          {[{x:12,y:8,r:1.2},{x:28,y:14,r:1},{x:45,y:6,r:1.5},{x:18,y:30,r:0.8},{x:55,y:28,r:1},{x:35,y:22,r:0.7},{x:8,y:42,r:1},{x:50,y:45,r:0.8}].map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r}
                    fill="#fff" opacity={lampOn ? 0.15 : 0.7}>
              <animate attributeName="opacity"
                       values={lampOn ? "0.1;0.2;0.1" : "0.5;0.9;0.5"}
                       dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          ))}
          {/* Horizon glow */}
          {lampOn && <rect x="0" y="60" width="80" height="40" rx="1"
                           fill="rgba(255,180,100,0.15)" />}
          {/* Window cross */}
          <line x1="40" y1="0" x2="40" y2="100" stroke="#6B4830" strokeWidth="3" />
          <line x1="0" y1="50" x2="80" y2="50" stroke="#6B4830" strokeWidth="3" />
          {/* Curtain left */}
          <rect x="-2" y="-2" width="16" height="104" rx="2" fill="#7B2050" opacity="0.85" />
          <line x1="4" y1="0" x2="4" y2="102" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          <line x1="9" y1="0" x2="9" y2="102" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
          {/* Curtain right */}
          <rect x="66" y="-2" width="16" height="104" rx="2" fill="#7B2050" opacity="0.85" />
          {/* Curtain rod */}
          <rect x="-6" y="-5" width="92" height="3" rx="1" fill="#8B7355" />
        </g>

        {/* ===== POSTERS ===== */}
        {/* DBZ poster */}
        <g transform="translate(260, 175)">
          <rect width="65" height="48" rx="1" fill="#1A1A5C" stroke="#333" strokeWidth="1" />
          <text x="32" y="20" textAnchor="middle" fill="#FFD700" fontSize="10" fontWeight="bold">DBZ</text>
          <text x="32" y="36" textAnchor="middle" fill="#FF6600" fontSize="7">⚡GOKU⚡</text>
        </g>
        {/* Yu-Gi-Oh poster */}
        <g transform="translate(355, 190)">
          <rect width="42" height="55" rx="1" fill="#1A1030" stroke="#333" strokeWidth="1" />
          <text x="21" y="18" textAnchor="middle" fill="#9B59B6" fontSize="7" fontWeight="bold">YU-GI-OH!</text>
          <text x="21" y="35" textAnchor="middle" fill="#FFD700" fontSize="16">🃏</text>
        </g>

        {/* ===== GLOW-IN-THE-DARK STARS ===== */}
        <g opacity={lampOn ? 0.06 : 0.85}
           style={{ transition: "opacity 0.8s ease", filter: lampOn ? "none" : "url(#starGlow)" }}>
          {[{x:420,y:170},{x:460,y:185},{x:500,y:168},{x:540,y:190},{x:445,y:200},{x:510,y:205},{x:480,y:175},{x:530,y:172}].map((s, i) => (
            <text key={i} x={s.x} y={s.y} fill="#96FF96" fontSize="8" opacity={0.7 + Math.sin(i) * 0.3}>
              ✦
              {!lampOn && (
                <animate attributeName="opacity" values="0.5;1;0.5" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
              )}
            </text>
          ))}
        </g>

        {/* ===== SHELF (back wall) ===== */}
        <g transform="translate(450, 170)">
          {/* Shelf board top */}
          <polygon points="0,0 180,0 195,10 15,10" fill="#8B6B4A" />
          <polygon points="15,10 195,10 195,15 15,15" fill="#6B4830" />
          {/* Support brackets */}
          <rect x="30" y="15" width="4" height="16" fill="#5C3D2A" />
          <rect x="160" y="15" width="4" height="16" fill="#5C3D2A" />
          {/* Second shelf */}
          <polygon points="10,50 185,50 195,58 15,58" fill="#7B5B3A" />
          <polygon points="15,58 195,58 195,62 15,62" fill="#5C4033" />
          <rect x="35" y="62" width="4" height="14" fill="#4A3328" />
          <rect x="155" y="62" width="4" height="14" fill="#4A3328" />
          {/* Items on top shelf */}
          {/* Lego box */}
          <rect x="20" y="-18" width="28" height="18" rx="1" fill="#E53935" stroke="#B71C1C" strokeWidth="0.5" />
          <text x="34" y="-5" textAnchor="middle" fill="#FFF" fontSize="7" fontWeight="bold">LEGO</text>
          {/* Bionicle figure */}
          <rect x="55" y="-24" width="10" height="24" rx="2" fill="#FF5722" stroke="#BF360C" strokeWidth="0.5" />
          {/* Board game boxes (stacked) */}
          <rect x="110" y="-8" width="40" height="8" rx="1" fill="#2E7D32" stroke="#1B5E20" strokeWidth="0.5" />
          <rect x="110" y="-16" width="40" height="8" rx="1" fill="#1565C0" stroke="#0D47A1" strokeWidth="0.5" />
          <rect x="110" y="-24" width="40" height="8" rx="1" fill="#C62828" stroke="#B71C1C" strokeWidth="0.5" />
          {/* Scoubidous hanging */}
          {["#FF4444","#44FF44","#4488FF","#FFDD44","#FF44FF"].map((c, i) => (
            <line key={i} x1={80 + i * 5} y1={-2} x2={78 + i * 5} y2={-22 + (i % 2) * 4}
                  stroke={c} strokeWidth="2.5" strokeLinecap="round" />
          ))}
          {/* Books on second shelf */}
          <rect x="30" y="32" width="8" height="16" fill="#C62828" />
          <rect x="39" y="34" width="7" height="14" fill="#1565C0" />
          <rect x="47" y="31" width="9" height="17" fill="#F57C00" />
          <rect x="57" y="33" width="6" height="15" fill="#7B1FA2" />
          <text x="100" y="45" textAnchor="middle" fill="#888" fontSize="8">📚</text>
        </g>

        {/* ===== BED (isometric) ===== */}
        <g transform="translate(380, 270)">
          {/* Bed frame - isometric box */}
          {/* Frame back */}
          <polygon points="0,0 220,0 240,15 20,15" fill="#7B5B3A" stroke="#5C3D2A" strokeWidth="1" />
          {/* Headboard */}
          <polygon points="0,-35 0,0 20,15 20,-25" fill="#6B4830" stroke="#5C3D2A" strokeWidth="0.5" />
          <rect x="3" y="-30" width="14" height="25" rx="1" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
          {/* Frame side */}
          <polygon points="220,0 240,15 240,95 220,80" fill="#5C3D2A" />
          {/* Frame bottom front */}
          <polygon points="20,15 240,15 240,95 20,95" fill="#4A3328" />
          {/* Mattress top */}
          <polygon points="8,5 218,5 234,17 24,17" fill="#F5F0E8" />
          {/* Mattress side */}
          <polygon points="24,17 234,17 234,25 24,25" fill="#E8E0D0" />
          {/* Pillows */}
          <ellipse cx="50" cy="10" rx="28" ry="6" fill="#FFFEF8" stroke="#E8E0C8" strokeWidth="0.5" />
          <ellipse cx="100" cy="11" rx="22" ry="5" fill="#FFFEF8" stroke="#E8E0C8" strokeWidth="0.5" />
          {/* Couette / blanket */}
          <polygon points="24,20 234,20 234,88 24,88" fill={couetteColor} opacity="0.9" />
          <polygon points="24,20 234,20 234,88 24,88" fill={couetteColor}
                   style={{ opacity: 0.4 }} />
          {/* Couette diamond pattern */}
          <g opacity="0.15">
            {[0,1,2,3].map(i => (
              <line key={i} x1={24 + i * 52} y1="20" x2={24 + i * 52 + 30} y2="88"
                    stroke="#fff" strokeWidth="0.5" />
            ))}
            {[0,1,2,3].map(i => (
              <line key={`r${i}`} x1={234 - i * 52} y1="20" x2={234 - i * 52 - 30} y2="88"
                    stroke="#fff" strokeWidth="0.5" />
            ))}
          </g>
          {/* Couette fold at top */}
          <rect x="24" y="18" width="210" height="5" fill={couetteColor} opacity="0.7" />
          {/* Peluches on bed */}
          <text x="190" y="15" fontSize="14">🧸</text>
          <text x="210" y="18" fontSize="10">🐰</text>
          <text x="170" y="17" fontSize="8">🐶</text>
        </g>

        {/* ===== NIGHTSTAND (isometric box) ===== */}
        <g transform="translate(100, 290)">
          {/* Top face */}
          <polygon points="0,0 70,0 80,8 10,8" fill="#8B6B4A" />
          {/* Front face */}
          <polygon points="10,8 80,8 80,55 10,55" fill="#6B4830" />
          {/* Side face */}
          <polygon points="0,0 10,8 10,55 0,47" fill="#5C3D2A" />
          {/* Drawer */}
          <rect x="18" y="14" width="54" height="20" rx="1" fill="#5C3D2A" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          {/* Drawer handle */}
          <rect x="38" y="22" width="14" height="4" rx="2" fill="#9B8060" />
          {/* Legs */}
          <rect x="14" y="55" width="4" height="6" fill="#4A3328" />
          <rect x="72" y="55" width="4" height="6" fill="#4A3328" />
          {/* Items on nightstand */}
          {/* Lamp */}
          <g transform="translate(15, -35)">
            {/* Lamp shade */}
            <polygon points="4,0 26,0 30,18 0,18"
                     fill={lampOn ? "#FFE082" : "#8B7355"} />
            {lampOn && <polygon points="4,0 26,0 30,18 0,18"
                                fill="rgba(255,220,0,0.2)" />}
            {/* Lamp stick */}
            <rect x="12" y="18" width="6" height="12" fill={lampOn ? "#C8A050" : "#7B6040"} />
            {/* Lamp base */}
            <rect x="6" y="30" width="18" height="4" rx="2" fill={lampOn ? "#B8903A" : "#6B5335"} />
            {lampOn && (
              <circle cx="15" cy="10" r="25" fill="rgba(255,220,80,0.06)" style={{ pointerEvents: "none" }} />
            )}
          </g>
          {/* Tamagotchi */}
          <g transform="translate(45, -20)">
            <rect x="0" y="0" width="18" height="24" rx="8" fill="#42A5F5" stroke="#1565C0" strokeWidth="1" />
            <rect x="4" y="5" width="10" height="8" rx="1" fill="#D0E0A8" stroke="#90B060" strokeWidth="0.5" />
            <text x="9" y="11" textAnchor="middle" fontSize="4">😊</text>
          </g>
          {/* Alarm clock */}
          <g transform="translate(5, -12)">
            <rect x="0" y="0" width="22" height="13" rx="1" fill="#1a1a1a" stroke="#333" strokeWidth="0.5" />
            <text x="11" y="10" textAnchor="middle" fill="#FF3333" fontSize="6" fontFamily="monospace"
                  style={{ textShadow: "0 0 3px rgba(255,50,50,0.5)" }}>
              {new Date().getHours().toString().padStart(2,'0')}:{new Date().getMinutes().toString().padStart(2,'0')}
            </text>
          </g>
          {/* Journal intime */}
          <g transform="translate(58, -18)">
            <rect x="0" y="0" width="15" height="20" rx="1" fill="#8B4513" stroke="#6B3410" strokeWidth="0.5" />
            <text x="7" y="13" textAnchor="middle" fontSize="6">📓</text>
          </g>
          {/* Radio */}
          <g transform="translate(30, -10)">
            <rect x="0" y="0" width="20" height="14" rx="2" fill="#8B7355" stroke="#5C4528" strokeWidth="0.5" />
            <text x="10" y="10" textAnchor="middle" fontSize="6">📻</text>
          </g>
        </g>

        {/* ===== RUG (isometric diamond on floor) ===== */}
        <g>
          <polygon
            points="300,400 440,460 300,520 160,460"
            fill="url(#rugPattern)"
            stroke="rgba(255,200,100,0.1)" strokeWidth="1"
          />
          {/* Inner rug border */}
          <polygon
            points="300,410 430,462 300,514 170,462"
            fill="none" stroke="rgba(255,200,100,0.08)" strokeWidth="0.5"
          />
        </g>

        {/* ===== FLOOR ITEMS ===== */}
        {/* Panini album on floor */}
        <g transform="translate(235, 435)">
          <rect x="0" y="0" width="32" height="24" rx="1" fill="#DAA520" stroke="#8B6914" strokeWidth="1"
                transform="rotate(-8)" />
          <text x="12" y="14" fontSize="8" transform="rotate(-8)">⚽</text>
          <text x="8" y="22" fontSize="3" fill="#4A3000" fontWeight="bold" transform="rotate(-8)">PANINI</text>
        </g>

        {/* Billes on floor */}
        <g transform="translate(325, 455)">
          <circle cx="0" cy="0" r="8" fill="url(#wallLeft)" opacity="0.8" />
          <circle cx="0" cy="0" r="7" fill="radial-gradient(circle at 30% 30%, #87CEFA, #1E90FF 60%, #0066CC)">
          </circle>
          <circle cx="0" cy="0" r="7" fill="#1E90FF" />
          <circle cx="-2" cy="-2" r="3" fill="#87CEFA" opacity="0.5" />
          <circle cx="14" cy="3" r="5" fill="#FF6347" />
          <circle cx="13" cy="1" r="2" fill="#FFD700" opacity="0.4" />
          <circle cx="-10" cy="5" r="9" fill="#6A40B0" />
          <circle cx="-12" cy="3" r="3.5" fill="#B8A0E0" opacity="0.4" />
          <circle cx="22" cy="8" r="4" fill="#228B22" />
        </g>

        {/* Pate a prout */}
        <g transform="translate(160, 455)">
          <ellipse cx="14" cy="10" rx="14" ry="10" fill="#8E24AA" stroke="#4A148C" strokeWidth="0.5" />
          <text x="14" y="14" textAnchor="middle" fontSize="8">💩</text>
        </g>

        {/* Beyblade on floor */}
        <g transform="translate(545, 465)">
          {/* Stadium hint */}
          <ellipse cx="22" cy="12" rx="30" ry="18" fill="none" stroke="rgba(100,100,100,0.15)" strokeWidth="1" />
          {/* Dragoon */}
          <circle cx="12" cy="8" r="10" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
          <circle cx="12" cy="8" r="3" fill="#1D4ED8" stroke="#93C5FD" strokeWidth="0.5" />
          {/* Dranzer */}
          <circle cx="32" cy="14" r="7" fill="#EF4444" stroke="#B91C1C" strokeWidth="1" />
          <circle cx="32" cy="14" r="2.5" fill="#B91C1C" stroke="#FCA5A5" strokeWidth="0.5" />
        </g>

        {/* Sous le lit indicator */}
        <g transform="translate(395, 410)">
          <rect x="0" y="0" width="50" height="18" rx="3" fill="rgba(0,0,0,0.4)"
                stroke="rgba(200,176,232,0.25)" strokeWidth="0.5" strokeDasharray="3 2" />
          <text x="6" y="13" fill="#C8B0E8" fontSize="7">👀 Sous...</text>
        </g>

        {/* ===== INTERACTIVE HOTSPOTS ===== */}
        {Object.entries(ISO_POSITIONS).map(([id, pos]) => {
          const item = ROOM_ITEMS.find(i => i.id === id);
          if (!item?.interactive) return null;
          const isHovered = hoveredItem === id;
          return (
            <rect
              key={id}
              x={pos.x} y={pos.y} width={pos.w} height={pos.h}
              fill="transparent"
              stroke={isHovered ? "rgba(200,176,232,0.4)" : "none"}
              strokeWidth="1"
              strokeDasharray={isHovered ? "3 2" : "none"}
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

        {/* ===== DARK OVERLAY (lamp off) ===== */}
        <rect x="0" y="0" width={VB_W} height={VB_H}
              fill="url(#nightDark)"
              opacity={lampOn ? 0 : 1}
              style={{ pointerEvents: "none", transition: "opacity 0.8s ease" }} />

        {/* ===== TOOLTIP ===== */}
        {hoveredItemData && hoveredItemData.interactive && tooltipPos && (
          <g transform={`translate(${tooltipPos.x}, ${tooltipPos.y})`} style={{ pointerEvents: "none" }}>
            <rect x="-50" y="-20" width="100" height="18" rx="3"
                  fill="rgba(0,0,0,0.92)" stroke="rgba(139,107,174,0.5)" strokeWidth="0.5" />
            <text x="0" y="-7" textAnchor="middle" fill="#C8B0E8" fontSize="8"
                  fontFamily="Tahoma, sans-serif">
              {hoveredItemData.hint}
            </text>
          </g>
        )}

        {/* ===== TITLE OVERLAY ===== */}
        <text x={VB_W / 2} y={VB_H - 10} textAnchor="middle"
              fill="rgba(139,107,174,0.35)" fontSize="9"
              fontFamily="Tahoma, sans-serif"
              style={{ pointerEvents: "none" }}>
          Clique sur les objets pour les explorer
        </text>
      </svg>
    </div>
  );
}
