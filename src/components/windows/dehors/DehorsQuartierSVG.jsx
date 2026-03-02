import { useState, useRef, useCallback } from "react";
import { LIEUX } from "../../../data/dehorsItems";

const VB_W = 800;
const VB_H = 500;

// Zones cliquables — positions dans le viewBox
const ZONES = {
  cityStade:  { x: 40,  y: 310, w: 200, h: 150 },
  mcdo:       { x: 530, y: 30,  w: 230, h: 140 },
  laserGame:  { x: 580, y: 250, w: 180, h: 140 },
  gouter:     { x: 40,  y: 40,  w: 200, h: 160 },
  courRecre:  { x: 490, y: 370, w: 230, h: 120 },
};

export default function DehorsQuartierSVG({ setActiveLieu, hoveredLieu, setHoveredLieu }) {
  const [tooltipPos, setTooltipPos] = useState(null);
  const svgRef = useRef(null);

  const handleClick = useCallback((id, e) => {
    e.stopPropagation();
    setActiveLieu(id);
  }, [setActiveLieu]);

  const handleHover = useCallback((id, entering) => {
    if (entering) {
      setHoveredLieu(id);
      const z = ZONES[id];
      if (z) setTooltipPos({ x: z.x + z.w / 2, y: z.y - 14 });
    } else {
      setHoveredLieu(null);
      setTooltipPos(null);
    }
  }, [setHoveredLieu]);

  const hoveredData = hoveredLieu ? LIEUX.find((l) => l.id === hoveredLieu) : null;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5BB8F5" />
          <stop offset="60%" stopColor="#87CEEB" />
          <stop offset="100%" stopColor="#B0E0E6" />
        </linearGradient>
        <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#66CC66" />
          <stop offset="100%" stopColor="#339933" />
        </linearGradient>
        <filter id="zoneGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#FFFFFF" floodOpacity="0.6" />
        </filter>
        <filter id="buildingShadow" x="-5%" y="-5%" width="110%" height="120%">
          <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#000" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* === Ciel === */}
      <rect x="0" y="0" width={VB_W} height="260" fill="url(#skyGrad)" />
      {/* Nuages */}
      <ellipse cx="120" cy="60" rx="60" ry="20" fill="#fff" opacity="0.7" />
      <ellipse cx="150" cy="55" rx="40" ry="18" fill="#fff" opacity="0.6" />
      <ellipse cx="90" cy="58" rx="35" ry="15" fill="#fff" opacity="0.5" />
      <ellipse cx="600" cy="80" rx="50" ry="16" fill="#fff" opacity="0.6" />
      <ellipse cx="630" cy="75" rx="35" ry="14" fill="#fff" opacity="0.5" />
      {/* Soleil */}
      <circle cx="700" cy="50" r="30" fill="#FFD700" opacity="0.9" />
      <circle cx="700" cy="50" r="38" fill="#FFD700" opacity="0.2" />

      {/* === Herbe === */}
      <rect x="0" y="240" width={VB_W} height="260" fill="url(#grassGrad)" />

      {/* === Route qui serpente === */}
      <path
        d="M0,350 C150,340 200,290 350,300 S550,330 650,280 S780,300 800,310"
        fill="none" stroke="#888" strokeWidth="30" strokeLinecap="round"
      />
      <path
        d="M0,350 C150,340 200,290 350,300 S550,330 650,280 S780,300 800,310"
        fill="none" stroke="#FFD700" strokeWidth="2" strokeDasharray="12 8" opacity="0.7"
      />
      {/* Route secondaire verticale */}
      <path
        d="M400,0 C390,100 410,200 400,300 S395,400 400,500"
        fill="none" stroke="#888" strokeWidth="24" strokeLinecap="round"
      />
      <path
        d="M400,0 C390,100 410,200 400,300 S395,400 400,500"
        fill="none" stroke="#FFD700" strokeWidth="2" strokeDasharray="12 8" opacity="0.7"
      />

      {/* === Décorations — arbres === */}
      {[[300, 250], [460, 230], [270, 380], [350, 440], [500, 200], [150, 230]].map(([cx, cy], i) => (
        <g key={`tree-${i}`}>
          <rect x={cx - 3} y={cy} width="6" height="18" fill="#8B6914" rx="1" />
          <circle cx={cx} cy={cy - 6} r="14" fill="#2E8B57" opacity="0.9" />
          <circle cx={cx - 6} cy={cy - 2} r="10" fill="#3CB371" opacity="0.8" />
          <circle cx={cx + 5} cy={cy - 3} r="11" fill="#228B22" opacity="0.85" />
        </g>
      ))}
      {/* Lampadaires */}
      {[[320, 290], [480, 310]].map(([x, y], i) => (
        <g key={`lamp-${i}`}>
          <rect x={x - 1.5} y={y - 30} width="3" height="30" fill="#666" />
          <circle cx={x} cy={y - 32} r="5" fill="#FFD700" opacity="0.5" />
        </g>
      ))}
      {/* Bancs */}
      <rect x="280" y="268" width="20" height="6" fill="#8B5A2B" rx="1" />
      <rect x="450" y="218" width="20" height="6" fill="#8B5A2B" rx="1" />

      {/* ================================================= */}
      {/* === LIEU 1 — Maison d'un pote (haut gauche) === */}
      {/* ================================================= */}
      <g filter={hoveredLieu === "gouter" ? "url(#zoneGlow)" : "url(#buildingShadow)"}>
        {/* Jardin */}
        <rect x="55" y="120" width="170" height="70" fill="#55BB55" rx="4" opacity="0.5" />
        {/* Maison */}
        <rect x="80" y="70" width="100" height="70" fill="#F5DEB3" rx="3" />
        {/* Toit */}
        <polygon points="75,70 130,35 185,70" fill="#CC4444" />
        {/* Porte */}
        <rect x="118" y="110" width="18" height="30" fill="#8B4513" rx="2" />
        <circle cx="132" cy="126" r="2" fill="#FFD700" />
        {/* Fenêtres */}
        <rect x="90" y="82" width="16" height="16" fill="#87CEEB" rx="1" stroke="#8B6914" strokeWidth="1" />
        <rect x="148" y="82" width="16" height="16" fill="#87CEEB" rx="1" stroke="#8B6914" strokeWidth="1" />
        {/* Trampoline dans le jardin */}
        <ellipse cx="190" cy="168" rx="18" ry="6" fill="#333" opacity="0.6" />
        <ellipse cx="190" cy="165" rx="16" ry="5" fill="#4488FF" opacity="0.5" />
        {/* Balançoire */}
        <line x1="70" y1="148" x2="70" y2="185" stroke="#8B6914" strokeWidth="2" />
        <line x1="90" y1="148" x2="90" y2="185" stroke="#8B6914" strokeWidth="2" />
        <line x1="68" y1="148" x2="92" y2="148" stroke="#8B6914" strokeWidth="2" />
        <line x1="80" y1="148" x2="76" y2="175" stroke="#666" strokeWidth="1" />
        <rect x="72" y="175" width="10" height="3" fill="#CC4444" rx="1" />
        {/* Label */}
        <text x="140" y="200" textAnchor="middle" fill="#FFAA44" fontSize="11" fontWeight="bold" fontFamily="Tahoma" opacity={hoveredLieu === "gouter" ? 1 : 0}>
          🍫 Goûter
        </text>
      </g>

      {/* ================================================= */}
      {/* === LIEU 2 — City Stade (bas gauche) ===          */}
      {/* ================================================= */}
      <g filter={hoveredLieu === "cityStade" ? "url(#zoneGlow)" : "url(#buildingShadow)"}>
        {/* Terrain */}
        <rect x="50" y="330" width="180" height="110" fill="#55AA44" rx="4" stroke="#888" strokeWidth="2" />
        {/* Lignes du terrain */}
        <line x1="140" y1="330" x2="140" y2="440" stroke="#fff" strokeWidth="1" opacity="0.5" />
        <circle cx="140" cy="385" r="20" fill="none" stroke="#fff" strokeWidth="1" opacity="0.5" />
        {/* Buts */}
        <rect x="50" y="365" width="8" height="40" fill="none" stroke="#fff" strokeWidth="1.5" />
        <rect x="222" y="365" width="8" height="40" fill="none" stroke="#fff" strokeWidth="1.5" />
        {/* Grillage (hachures) */}
        {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180].map((dx, i) => (
          <line key={`fence-${i}`} x1={50 + dx} y1="325" x2={50 + dx} y2="330" stroke="#999" strokeWidth="1" />
        ))}
        <line x1="50" y1="325" x2="230" y2="325" stroke="#999" strokeWidth="1.5" />
        {/* Ballon */}
        <circle cx="155" cy="390" r="5" fill="#fff" stroke="#333" strokeWidth="0.5" />
        {/* Label */}
        <text x="140" y="465" textAnchor="middle" fill="#44BB44" fontSize="11" fontWeight="bold" fontFamily="Tahoma" opacity={hoveredLieu === "cityStade" ? 1 : 0}>
          ⚽ City Stade
        </text>
      </g>

      {/* ================================================= */}
      {/* === LIEU 3 — McDo (haut droite) ===               */}
      {/* ================================================= */}
      <g filter={hoveredLieu === "mcdo" ? "url(#zoneGlow)" : "url(#buildingShadow)"}>
        {/* Bâtiment */}
        <rect x="550" y="60" width="190" height="100" fill="#CC2222" rx="4" />
        {/* Toit plat */}
        <rect x="545" y="55" width="200" height="10" fill="#AA1111" rx="2" />
        {/* Arche M dorée */}
        <text x="645" y="105" textAnchor="middle" fill="#FFD700" fontSize="40" fontWeight="bold" fontFamily="Arial">M</text>
        {/* Fenêtres */}
        <rect x="560" y="120" width="30" height="25" fill="#FFEE88" rx="2" opacity="0.8" />
        <rect x="600" y="120" width="30" height="25" fill="#FFEE88" rx="2" opacity="0.8" />
        <rect x="700" y="120" width="30" height="25" fill="#FFEE88" rx="2" opacity="0.8" />
        {/* Porte */}
        <rect x="645" y="110" width="25" height="50" fill="#FFD700" rx="2" opacity="0.6" />
        {/* Parking */}
        <rect x="555" y="165" width="180" height="3" fill="#666" rx="1" />
        {/* Label */}
        <text x="645" y="185" textAnchor="middle" fill="#FF4444" fontSize="11" fontWeight="bold" fontFamily="Tahoma" opacity={hoveredLieu === "mcdo" ? 1 : 0}>
          🍔 McDo
        </text>
      </g>

      {/* ================================================= */}
      {/* === LIEU 4 — Laser Game (droite milieu) ===       */}
      {/* ================================================= */}
      <g filter={hoveredLieu === "laserGame" ? "url(#zoneGlow)" : "url(#buildingShadow)"}>
        {/* Bâtiment sombre */}
        <rect x="590" y="260" width="160" height="110" fill="#1a1a2e" rx="4" />
        {/* Enseigne néon */}
        <rect x="610" y="268" width="120" height="18" fill="#111" rx="3" />
        <text x="670" y="282" textAnchor="middle" fill="#00FF88" fontSize="11" fontWeight="bold" fontFamily="Tahoma">
          LASER GAME
        </text>
        {/* Néons décoratifs */}
        <line x1="595" y1="265" x2="595" y2="365" stroke="#FF00FF" strokeWidth="2" opacity="0.4" />
        <line x1="745" y1="265" x2="745" y2="365" stroke="#00FFFF" strokeWidth="2" opacity="0.4" />
        {/* Porte */}
        <rect x="650" y="330" width="30" height="40" fill="#222" rx="2" />
        <rect x="652" y="332" width="26" height="36" fill="#0a0a1e" rx="1" />
        {/* Étoiles néon sur le mur */}
        <circle cx="620" cy="310" r="3" fill="#FF00FF" opacity="0.6" />
        <circle cx="710" cy="300" r="3" fill="#00FFFF" opacity="0.6" />
        <circle cx="640" cy="340" r="2" fill="#00FF88" opacity="0.5" />
        {/* Label */}
        <text x="670" y="390" textAnchor="middle" fill="#00FF88" fontSize="11" fontWeight="bold" fontFamily="Tahoma" opacity={hoveredLieu === "laserGame" ? 1 : 0}>
          🔫 Laser Game
        </text>
      </g>

      {/* ================================================= */}
      {/* === LIEU 5 — Cour de Récré (bas droite) ===       */}
      {/* ================================================= */}
      <g filter={hoveredLieu === "courRecre" ? "url(#zoneGlow)" : "url(#buildingShadow)"}>
        {/* Bâtiment école */}
        <rect x="500" y="370" width="140" height="60" fill="#D4A574" rx="3" />
        <rect x="495" y="365" width="150" height="10" fill="#C49464" rx="2" />
        {/* Fenêtres école */}
        {[0, 30, 60, 90].map((dx, i) => (
          <rect key={`fen-${i}`} x={510 + dx} y="380" width="18" height="18" fill="#87CEEB" rx="1" stroke="#8B6914" strokeWidth="0.5" />
        ))}
        {/* Porte école */}
        <rect x="555" y="400" width="18" height="30" fill="#8B4513" rx="1" />
        {/* Cour en béton */}
        <rect x="650" y="380" width="80" height="80" fill="#BBAA99" rx="3" />
        {/* Préau */}
        <rect x="655" y="380" width="40" height="30" fill="#8B6914" rx="2" opacity="0.6" />
        {/* Marelle */}
        <rect x="710" y="400" width="12" height="12" fill="none" stroke="#FF6688" strokeWidth="1" />
        <rect x="710" y="414" width="12" height="12" fill="none" stroke="#FF6688" strokeWidth="1" />
        <rect x="710" y="428" width="12" height="12" fill="none" stroke="#FF6688" strokeWidth="1" />
        {/* Label */}
        <text x="610" y="475" textAnchor="middle" fill="#4488FF" fontSize="11" fontWeight="bold" fontFamily="Tahoma" opacity={hoveredLieu === "courRecre" ? 1 : 0}>
          🏫 Cour de Récré
        </text>
      </g>

      {/* === Zones cliquables invisibles === */}
      {LIEUX.map((lieu) => {
        const z = ZONES[lieu.id];
        if (!z) return null;
        return (
          <rect
            key={lieu.id}
            x={z.x}
            y={z.y}
            width={z.w}
            height={z.h}
            fill="transparent"
            cursor="pointer"
            onClick={(e) => handleClick(lieu.id, e)}
            onMouseEnter={() => handleHover(lieu.id, true)}
            onMouseLeave={() => handleHover(lieu.id, false)}
          />
        );
      })}

      {/* === Tooltip === */}
      {hoveredData && tooltipPos && (
        <g>
          <rect
            x={tooltipPos.x - 60}
            y={tooltipPos.y - 14}
            width="120"
            height="22"
            rx="6"
            fill="rgba(0,0,0,0.8)"
          />
          <text
            x={tooltipPos.x}
            y={tooltipPos.y + 1}
            textAnchor="middle"
            fill="#fff"
            fontSize="11"
            fontFamily="Tahoma"
            fontWeight="bold"
          >
            {hoveredData.emoji} {hoveredData.label}
          </text>
        </g>
      )}
    </svg>
  );
}
