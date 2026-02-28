import { useState, useEffect, useCallback, useRef } from "react";
import Win from "../Win";
import NostalImg from "../NostalImg";
import { ROOM_ITEMS, COUETTES, BILLES_COLLECTION, LEGO_SETS, PELUCHES, SCOUBIDOUS, JEUX_SOCIETE } from "../../data/chambreItems";
import { ALBUM_PAGES, ALBUM_TITLE, TOTAL_STICKERS, ALL_STICKER_NAMES } from "../../data/paniniAlbum";
import { loadState, saveState, clearState } from "../../utils/storage";
import BeybladeArena from "./BeybladeArena";

const TAMA_TICK_MS = 10_000; // stats decay every 10s
const TAMA_MAX = 5;
const TAMA_OFFLINE_DECAY_MS = 2 * 60 * 60 * 1000; // 1 point lost per 2 hours offline
const TAMA_MAX_OFFLINE_MS = 24 * 60 * 60 * 1000; // cap offline decay at 24 hours

function loadTamaState() {
  const saved = loadState("tamagotchi", null);
  if (!saved || !saved.lastSaved) return { faim: 4, bonheur: 4, proprete: 4 };
  const elapsed = Math.min(Date.now() - saved.lastSaved, TAMA_MAX_OFFLINE_MS);
  const decay = Math.floor(elapsed / TAMA_OFFLINE_DECAY_MS);
  return {
    faim: Math.max(0, (saved.faim ?? 4) - decay),
    bonheur: Math.max(0, (saved.bonheur ?? 4) - decay),
    proprete: Math.max(0, (saved.proprete ?? 4) - decay),
  };
}

export default function ChambreWindow({ onClose, onMinimize, zIndex, onFocus }) {
  const [activeItem, setActiveItem] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  // --- Couette state ---
  const [couette, setCouette] = useState("harryPotter");

  // --- Tamagotchi state ---
  const [tama, setTama] = useState(loadTamaState);
  const [tamaAction, setTamaAction] = useState(null); // brief animation label

  // --- Panini state ---
  const [paniniPage, setPaniniPage] = useState(0);
  const [collectedStickers, setCollectedStickers] = useState(() => loadState('panini_collected', []));
  const [newStickers, setNewStickers] = useState([]);
  const paniniDiscovered = useRef(false);

  // Discover new stickers when album opens
  useEffect(() => {
    if (activeItem !== "panini" || paniniDiscovered.current) return;
    paniniDiscovered.current = true;
    const missing = ALL_STICKER_NAMES.filter(n => !collectedStickers.includes(n));
    if (missing.length === 0) return;
    const count = Math.min(missing.length, 1 + Math.floor(Math.random() * 3));
    const shuffled = [...missing].sort(() => Math.random() - 0.5);
    const discovered = shuffled.slice(0, count);
    const updated = [...collectedStickers, ...discovered];
    setCollectedStickers(updated);
    setNewStickers(discovered);
    saveState('panini_collected', updated);
  }, [activeItem, collectedStickers]);

  // --- Lampe state ---
  const [lampOn, setLampOn] = useState(true);

  // --- Pâte à prout state ---
  const [proutAnim, setProutAnim] = useState(false);

  // Save tama state on every change
  useEffect(() => {
    saveState('tamagotchi', { ...tama, lastSaved: Date.now() });
  }, [tama]);

  // Tamagotchi decay
  useEffect(() => {
    const id = setInterval(() => {
      setTama((t) => ({
        faim: Math.max(0, t.faim - 1),
        bonheur: Math.max(0, t.bonheur - 1),
        proprete: Math.max(0, t.proprete - 1),
      }));
    }, TAMA_TICK_MS);
    return () => clearInterval(id);
  }, []);

  const tamaDo = useCallback((action) => {
    setTama((t) => {
      if (action === "nourrir") return { ...t, faim: Math.min(TAMA_MAX, t.faim + 2) };
      if (action === "jouer") return { ...t, bonheur: Math.min(TAMA_MAX, t.bonheur + 2) };
      if (action === "nettoyer") return { ...t, proprete: Math.min(TAMA_MAX, t.proprete + 2) };
      return t;
    });
    setTamaAction(action);
    setTimeout(() => setTamaAction(null), 800);
  }, []);

  const tamaReset = useCallback(() => {
    clearState('tamagotchi');
    setTama({ faim: 4, bonheur: 4, proprete: 4 });
  }, []);

  const tamaTotal = tama.faim + tama.bonheur + tama.proprete;
  const tamaNeglected = tamaTotal === 0;
  const tamaMood = tamaNeglected ? "💀" : tamaTotal >= 12 ? "😊" : tamaTotal >= 6 ? "😐" : "😢";

  // Pate a prout sound (Web Audio)
  const playProut = useCallback(() => {
    setProutAnim(true);
    setTimeout(() => setProutAnim(false), 600);
    if (localStorage.getItem('em_muted') === 'true') return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (_) { /* silent fallback */ }
  }, []);

  const goBack = () => setActiveItem(null);

  const currentCouette = COUETTES.find((c) => c.id === couette);
  const titleText = activeItem
    ? `La Chambre — ${ROOM_ITEMS.find((i) => i.id === activeItem)?.label || ""}`
    : "La Chambre d'Enfant";

  return (
    <Win title={titleText} onClose={onClose} onMinimize={onMinimize} width={560} height={520} zIndex={zIndex} onFocus={onFocus} initialPos={{ x: 160, y: 40 }} color="#8B6BAE">
      <div style={{ height: "100%", background: "linear-gradient(180deg, #1a1028 0%, #2d1f3d 50%, #1a1028 100%)", overflow: "hidden" }}>
        {activeItem === null ? (
          /* ============ ROOM VIEW ============ */
          <RoomScene
            items={ROOM_ITEMS}
            hoveredItem={hoveredItem}
            setHoveredItem={setHoveredItem}
            setActiveItem={setActiveItem}
            couetteColor={currentCouette.color}
            lampOn={lampOn}
            onToggleLamp={() => setLampOn(l => !l)}
          />
        ) : (
          /* ============ DETAIL VIEWS ============ */
          <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "8px 12px", borderBottom: "1px solid rgba(139,107,174,0.3)" }}>
              <button onClick={goBack} style={backBtnStyle} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(139,107,174,0.2)")} onMouseLeave={(e) => (e.currentTarget.style.background = "none")}>
                ← Retour
              </button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
              {activeItem === "couette" && (
                <CouetteSelector couette={couette} setCouette={setCouette} />
              )}
              {activeItem === "tamagotchi" && (
                <TamagotchiWidget tama={tama} tamaDo={tamaDo} tamaMood={tamaMood} tamaAction={tamaAction} neglected={tamaNeglected} onReset={tamaReset} tamaTotal={tamaTotal} />
              )}
              {activeItem === "panini" && (
                <PaniniAlbum page={paniniPage} setPage={setPaniniPage} collected={collectedStickers} newStickers={newStickers} />
              )}
              {activeItem === "pateAProut" && (
                <PateAProut playing={proutAnim} onPress={playProut} />
              )}
              {activeItem === "beyblade" && (
                <BeybladeArena />
              )}
              {activeItem === "billes" && (
                <BillesView />
              )}
              {activeItem === "lego" && (
                <LegoGallery />
              )}
              {activeItem === "peluches" && (
                <PeluchesView />
              )}
              {activeItem === "scoubidous" && (
                <ScoubidousView />
              )}
              {activeItem === "jeuxSociete" && (
                <JeuxSocieteView />
              )}
            </div>
          </div>
        )}
      </div>
    </Win>
  );
}

/* ============================================================
   ROOM SCENE — Spatial emoji layout of the bedroom
   ============================================================ */
function RoomScene({ items, hoveredItem, setHoveredItem, setActiveItem, couetteColor, lampOn, onToggleLamp }) {
  /* Interactive item hotspot helper */
  const spot = (id, children, style, customClick) => {
    const item = items.find(i => i.id === id);
    const isHovered = hoveredItem === id;
    const isActive = item?.interactive;
    return (
      <div
        onClick={(e) => { e.stopPropagation(); if (customClick) customClick(); else if (isActive) setActiveItem(id); }}
        onMouseEnter={() => setHoveredItem(id)}
        onMouseLeave={() => setHoveredItem(null)}
        style={{
          position: "absolute", cursor: isActive ? "pointer" : "default",
          transition: "transform 0.2s ease, filter 0.2s ease",
          filter: isHovered && isActive ? "brightness(1.3) drop-shadow(0 0 8px rgba(200,176,232,0.7))" : "none",
          transform: isHovered && isActive ? "scale(1.12)" : "scale(1)",
          zIndex: isHovered ? 12 : (style?.zIndex || 3),
          ...style,
        }}
      >
        {children}
        {isHovered && isActive && item && (
          <div style={{
            position: "absolute", bottom: "110%", left: "50%", transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.92)", color: "#C8B0E8",
            fontSize: 9, padding: "3px 8px", borderRadius: 4, whiteSpace: "nowrap",
            border: "1px solid rgba(139,107,174,0.5)", zIndex: 20, pointerEvents: "none",
          }}>
            {item.hint}
          </div>
        )}
      </div>
    );
  };

  /* Fixed-size room that scales uniformly to fit the window */
  const containerRef = useRef(null);
  const [roomScale, setRoomScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width && height) setRoomScale(Math.min(width / 560, height / 488));
    };
    update();
    const obs = new ResizeObserver(update);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: "#1a1028", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 560, height: 488, position: "relative", transform: `scale(${roomScale})`, transformOrigin: "center center", flexShrink: 0 }}>

      {/* ====== WALL ====== */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "55%",
        background: "linear-gradient(180deg, #2E2245 0%, #362952 40%, #3D2F5C 100%)",
        backgroundImage: `
          linear-gradient(180deg, #2E2245 0%, #362952 40%, #3D2F5C 100%),
          repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(255,255,255,0.012) 28px, rgba(255,255,255,0.012) 30px),
          repeating-linear-gradient(90deg, transparent, transparent 28px, rgba(255,255,255,0.012) 28px, rgba(255,255,255,0.012) 30px)
        `,
      }} />

      {/* ====== BASEBOARD / PLINTHE ====== */}
      <div style={{
        position: "absolute", top: "55%", left: 0, right: 0, height: 7,
        background: "linear-gradient(180deg, #6B4830, #4A3328, #3E2A1F)",
        boxShadow: "0 2px 4px rgba(0,0,0,0.4)", zIndex: 3,
      }} />

      {/* ====== FLOOR (PARQUET) ====== */}
      <div style={{
        position: "absolute", top: "55%", left: 0, right: 0, bottom: 0,
        background: "#5C3D2A",
        backgroundImage: `
          repeating-linear-gradient(90deg, transparent 0px, transparent 68px, rgba(0,0,0,0.12) 68px, rgba(0,0,0,0.12) 70px),
          repeating-linear-gradient(0deg, transparent 0px, transparent 22px, rgba(0,0,0,0.06) 22px, rgba(0,0,0,0.06) 23px),
          linear-gradient(180deg, #4A3328 0%, #6B4830 30%, #7B5638 60%, #6B4830 100%)
        `,
      }} />

      {/* ====== WINDOW ON WALL (night sky) ====== */}
      <div style={{
        position: "absolute", top: "5%", left: "4%", width: 95, height: 110,
        background: "linear-gradient(180deg, #060620, #0B0B3E 50%, #141450)",
        border: "5px solid #6B4830", borderRadius: 3,
        boxShadow: "inset 0 0 20px rgba(0,0,80,0.5), 0 3px 10px rgba(0,0,0,0.5), inset 0 0 40px rgba(30,30,100,0.2)",
        overflow: "hidden",
      }}>
        {/* Window cross frame */}
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 4, background: "#6B4830", transform: "translateY(-50%)", zIndex: 2 }} />
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 4, background: "#6B4830", transform: "translateX(-50%)", zIndex: 2 }} />
        {/* Moon */}
        <div style={{
          position: "absolute", top: 10, right: 12, width: 20, height: 20, borderRadius: "50%",
          background: "radial-gradient(circle at 35% 30%, #FFFDE8, #F5E6A0 70%, #E8D080)",
          boxShadow: "0 0 16px rgba(255,253,224,0.5), 0 0 40px rgba(255,240,180,0.15)",
        }} />
        {/* Stars */}
        {[{t:6,l:10,s:2},{t:18,l:6,s:1.5},{t:12,l:55,s:2},{t:4,l:35,s:1.5},{t:28,l:22,s:2},{t:35,l:58,s:1.5},{t:8,l:68,s:1},{t:44,l:12,s:1.5},{t:50,l:42,s:1},{t:22,l:40,s:1}].map((s,i) => (
          <div key={i} style={{
            position: "absolute", top: s.t, left: s.l, width: s.s, height: s.s, borderRadius: "50%",
            background: "#fff", opacity: 0.6 + Math.sin(i) * 0.3,
            animation: `blink ${1.8 + i * 0.4}s infinite`,
          }} />
        ))}
        {/* Curtain left */}
        <div style={{
          position: "absolute", top: -2, left: -2, width: 20, height: "104%",
          background: "linear-gradient(90deg, #7B2050DD, #7B2050BB, #7B205088)",
          borderRadius: "0 6px 8px 0", zIndex: 3,
          boxShadow: "2px 0 6px rgba(0,0,0,0.3)",
        }}>
          {/* Curtain folds */}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: 6, width: 1, background: "rgba(255,255,255,0.05)" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: 12, width: 1, background: "rgba(0,0,0,0.1)" }} />
        </div>
        {/* Curtain right */}
        <div style={{
          position: "absolute", top: -2, right: -2, width: 20, height: "104%",
          background: "linear-gradient(-90deg, #7B2050DD, #7B2050BB, #7B205088)",
          borderRadius: "6px 0 0 8px", zIndex: 3,
          boxShadow: "-2px 0 6px rgba(0,0,0,0.3)",
        }}>
          <div style={{ position: "absolute", top: 0, bottom: 0, right: 6, width: 1, background: "rgba(255,255,255,0.05)" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, right: 12, width: 1, background: "rgba(0,0,0,0.1)" }} />
        </div>
        {/* Curtain rod */}
        <div style={{ position: "absolute", top: -3, left: -8, right: -8, height: 4, background: "linear-gradient(180deg, #8B7355, #6B5335)", borderRadius: 2, zIndex: 4 }} />
      </div>

      {/* ====== POSTER DBZ ====== */}
      <div style={{
        position: "absolute", top: "3%", left: "24%", width: 76, height: 56,
        background: "linear-gradient(135deg, #FF7800, #FF9500 30%, #FFB800 60%, #FF7800)",
        border: "3px solid #5C4033", borderRadius: 2,
        boxShadow: "2px 3px 8px rgba(0,0,0,0.5), inset 0 0 25px rgba(255,255,255,0.1)",
        display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
      }}>
        {/* Starburst rays */}
        <div style={{ position: "absolute", inset: 0, background: "conic-gradient(from 0deg, transparent, rgba(255,255,255,0.08) 10%, transparent 20%)", }} />
        <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 24, textShadow: "0 0 8px rgba(255,200,0,0.6)" }}>⚡</div>
          <div style={{ fontSize: 6, fontWeight: "bold", color: "#FFF", textShadow: "1px 1px 2px rgba(0,0,0,0.9)", letterSpacing: 2, marginTop: 1, fontFamily: "Impact, sans-serif" }}>DRAGON BALL Z</div>
        </div>
      </div>

      {/* ====== SECOND POSTER (Yu-Gi-Oh / Pokémon) ====== */}
      <div style={{
        position: "absolute", top: "12%", left: "40%", width: 48, height: 62,
        background: "linear-gradient(180deg, #1A237E, #283593 40%, #3949AB)",
        border: "2px solid #5C4033", borderRadius: 2,
        boxShadow: "2px 2px 6px rgba(0,0,0,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 22 }}>🃏</div>
          <div style={{ fontSize: 5, color: "#FFD54F", fontWeight: "bold", marginTop: 2, letterSpacing: 0.5 }}>YU-GI-OH!</div>
        </div>
      </div>

      {/* ====== GLOW-IN-THE-DARK STARS (on wall) ====== */}
      {[{t:"3%",l:"52%"},{t:"6%",l:"60%"},{t:"2%",l:"70%"},{t:"9%",l:"56%"},{t:"4%",l:"48%"}].map((s,i) => (
        <div key={`glow${i}`} style={{
          position: "absolute", top: s.t, left: s.l,
          fontSize: 7, color: lampOn ? "rgba(180,255,180,0.1)" : "rgba(150,255,150,0.85)",
          transition: "color 0.6s ease", zIndex: 1, pointerEvents: "none",
        }}>✦</div>
      ))}

      {/* ====== SHELF ====== */}
      <div style={{
        position: "absolute", top: 78, right: 22, width: 160,
        zIndex: 4,
      }}>
        {/* Shelf board */}
        <div style={{
          width: "100%", height: 8,
          background: "linear-gradient(180deg, #8B6B4A, #6B4830, #5C3D2A)",
          borderRadius: "2px 2px 0 0",
          boxShadow: "0 3px 8px rgba(0,0,0,0.5)",
        }} />
        {/* Brackets */}
        <div style={{ position: "absolute", top: 8, left: 14, width: 5, height: 18, background: "linear-gradient(90deg, #5C4033, #4A3328)", borderRadius: "0 0 2px 2px" }} />
        <div style={{ position: "absolute", top: 8, right: 14, width: 5, height: 18, background: "linear-gradient(90deg, #4A3328, #5C4033)", borderRadius: "0 0 2px 2px" }} />
        {/* Second shelf */}
        <div style={{
          position: "absolute", top: 56, left: 10, right: 10, height: 6,
          background: "linear-gradient(180deg, #7B5B3A, #5C4033)",
          borderRadius: 1, boxShadow: "0 2px 5px rgba(0,0,0,0.4)",
        }} />
        <div style={{ position: "absolute", top: 62, left: 20, width: 4, height: 14, background: "#4A3328" }} />
        <div style={{ position: "absolute", top: 62, right: 20, width: 4, height: 14, background: "#4A3328" }} />
      </div>

      {/* Items on top shelf */}
      {spot("lego", (
        <div style={{ display: "flex", gap: 3, alignItems: "flex-end" }}>
          {/* Lego box */}
          <div style={{ width: 28, height: 22, background: "linear-gradient(135deg, #E53935, #C62828)", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #B71C1C", boxShadow: "1px 2px 4px rgba(0,0,0,0.4)" }}>
            <span style={{ fontSize: 12 }}>🧱</span>
          </div>
          {/* Bionicle figure */}
          <div style={{ width: 14, height: 26, background: "linear-gradient(180deg, #FF5722, #BF360C)", borderRadius: "4px 4px 1px 1px", border: "1px solid #BF360C", boxShadow: "1px 1px 3px rgba(0,0,0,0.3)" }} />
        </div>
      ), { top: 50, right: 110, zIndex: 5 })}

      {spot("jeuxSociete", (
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <div style={{ width: 36, height: 8, background: "linear-gradient(90deg, #2E7D32, #4CAF50)", borderRadius: 1, border: "1px solid #1B5E20", boxShadow: "1px 1px 2px rgba(0,0,0,0.3)" }} />
          <div style={{ width: 36, height: 8, background: "linear-gradient(90deg, #1565C0, #42A5F5)", borderRadius: 1, border: "1px solid #0D47A1" }} />
          <div style={{ width: 36, height: 8, background: "linear-gradient(90deg, #C62828, #EF5350)", borderRadius: 1, border: "1px solid #B71C1C" }} />
        </div>
      ), { top: 51, right: 30, zIndex: 5 })}

      {spot("scoubidous", (
        <div style={{ display: "flex", gap: 1, alignItems: "flex-end", padding: "0 2px" }}>
          {["#FF4444","#44FF44","#4488FF","#FFDD44","#FF44FF"].map((c,i) => (
            <div key={i} style={{ width: 3, height: [20,24,18,22,16][i], background: `linear-gradient(180deg, ${c}, ${c}88, ${c})`, borderRadius: 2, transform: `rotate(${(i-2)*4}deg)`, boxShadow: `0 0 3px ${c}40` }} />
          ))}
        </div>
      ), { top: 48, right: 168, zIndex: 5 })}

      {/* Decorative books on second shelf */}
      <div style={{
        position: "absolute", top: 96, right: 62, width: 30, height: 38,
        background: "linear-gradient(180deg, #E8E0D0, #D0C8B8)", borderRadius: 2,
        border: "1px solid #B0A898", boxShadow: "1px 2px 4px rgba(0,0,0,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 4,
      }}>
        <span style={{ fontSize: 16 }}>📚</span>
      </div>

      {/* ====== BED ====== */}
      <div style={{
        position: "absolute", top: 215, right: 17, width: 302, height: 205, zIndex: 2,
      }}>
        {/* Headboard */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 40,
          background: "linear-gradient(180deg, #7B5B3A 0%, #6B4830 50%, #5C3D2A 100%)",
          borderRadius: "8px 8px 0 0",
          boxShadow: "inset 0 2px 6px rgba(255,255,255,0.08), 0 -2px 8px rgba(0,0,0,0.3)",
        }}>
          {/* Decorative headboard panels */}
          <div style={{ position: "absolute", top: 5, left: 10, right: 10, bottom: 5, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4 }} />
          <div style={{ position: "absolute", top: 8, left: "35%", right: "35%", bottom: 8, border: "1px solid rgba(255,255,255,0.04)", borderRadius: 3 }} />
        </div>
        {/* Mattress frame */}
        <div style={{
          position: "absolute", top: 38, left: -2, right: -2, bottom: -2,
          background: "linear-gradient(180deg, #5C4033, #4A3328)",
          borderRadius: "0 0 4px 4px",
        }} />
        {/* Mattress */}
        <div style={{
          position: "absolute", top: 38, left: 2, right: 2, bottom: 2,
          background: "linear-gradient(180deg, #F5F0E8, #E8E0D0)",
          borderRadius: "0 0 3px 3px", overflow: "hidden",
        }}>
          {/* Pillow */}
          <div style={{
            position: "absolute", top: 2, left: 10, width: "30%", height: 22,
            background: "linear-gradient(180deg, #FFFEF8, #F5F0E0)",
            borderRadius: 10, border: "1px solid #E8E0C8",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05), 0 2px 3px rgba(0,0,0,0.08)",
          }} />
          <div style={{
            position: "absolute", top: 4, left: "36%", width: "25%", height: 18,
            background: "linear-gradient(180deg, #FFFEF8, #F5F0E0)",
            borderRadius: 8, border: "1px solid #E8E0C8",
            boxShadow: "inset 0 2px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
          }} />
          {/* Couette / blanket */}
          <div style={{
            position: "absolute", top: 20, left: 3, right: 3, bottom: 3,
            background: `linear-gradient(150deg, ${couetteColor}, ${couetteColor}DD 40%, ${couetteColor}EE 70%, ${couetteColor})`,
            borderRadius: 4,
            boxShadow: `inset 0 3px 10px rgba(0,0,0,0.12), inset 0 -2px 6px rgba(255,255,255,0.08)`,
          }}>
            {/* Blanket quilting pattern */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: 4, opacity: 0.4,
              backgroundImage: `
                repeating-linear-gradient(45deg, transparent, transparent 14px, rgba(255,255,255,0.05) 14px, rgba(255,255,255,0.05) 16px),
                repeating-linear-gradient(-45deg, transparent, transparent 14px, rgba(255,255,255,0.03) 14px, rgba(255,255,255,0.03) 16px)
              `,
            }} />
            {/* Folded edge */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 8,
              background: `linear-gradient(180deg, ${couetteColor}FF, ${couetteColor}CC)`,
              borderRadius: "4px 4px 0 0",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }} />
          </div>
        </div>
      </div>

      {/* Bed interactive spots */}
      {spot("couette", (
        <div style={{ fontSize: 18, background: `${couetteColor}30`, borderRadius: 6, padding: "3px 6px", border: `1px solid ${couetteColor}50` }}>🛏️</div>
      ), { top: 320, right: 140, zIndex: 5 })}

      {spot("peluches", (
        <div style={{ display: "flex", gap: 3, alignItems: "flex-end" }}>
          <span style={{ fontSize: 20 }}>🧸</span>
          <span style={{ fontSize: 14, marginBottom: 2 }}>🐰</span>
          <span style={{ fontSize: 10, marginBottom: 1 }}>🐶</span>
        </div>
      ), { top: 240, right: 32, zIndex: 5 })}

      {/* ====== NIGHTSTAND ====== */}
      <div style={{
        position: "absolute", top: 254, left: 22, width: 72, height: 65, zIndex: 3,
      }}>
        {/* Table top surface */}
        <div style={{
          position: "absolute", top: 0, left: -4, right: -4, height: 7,
          background: "linear-gradient(180deg, #8B6B4A, #6B4830)",
          borderRadius: 3, boxShadow: "0 3px 6px rgba(0,0,0,0.4)",
        }} />
        {/* Table body */}
        <div style={{
          position: "absolute", top: 7, left: 0, right: 0, bottom: 6,
          background: "linear-gradient(180deg, #6B4830, #5C3D2A, #4A3328)",
          borderRadius: "0 0 2px 2px",
        }}>
          {/* Drawer */}
          <div style={{
            position: "absolute", top: 5, left: 5, right: 5, height: 20,
            background: "linear-gradient(180deg, #5C3D2A, #4A3328)",
            border: "1px solid rgba(255,255,255,0.04)", borderRadius: 2,
          }}>
            {/* Drawer knob */}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 12, height: 5, borderRadius: 3, background: "linear-gradient(180deg, #9B8060, #7B6040)", boxShadow: "0 1px 2px rgba(0,0,0,0.3)" }} />
          </div>
        </div>
        {/* Legs */}
        <div style={{ position: "absolute", bottom: 0, left: 3, width: 5, height: 6, background: "#4A3328", borderRadius: "0 0 1px 1px" }} />
        <div style={{ position: "absolute", bottom: 0, right: 3, width: 5, height: 6, background: "#4A3328", borderRadius: "0 0 1px 1px" }} />
      </div>

      {/* Lamp on nightstand */}
      {spot("lampe", (
        <div style={{ textAlign: "center", position: "relative" }}>
          {/* Lamp glow aura */}
          {lampOn && <div style={{ position: "absolute", top: -8, left: -10, width: 50, height: 30, background: "radial-gradient(ellipse, rgba(255,220,80,0.25), transparent 70%)", pointerEvents: "none" }} />}
          {/* Shade */}
          <div style={{
            width: 30, height: 20, margin: "0 auto",
            background: lampOn
              ? "linear-gradient(180deg, #FFE082, #FFCC02, #FFB300)"
              : "linear-gradient(180deg, #8B7355, #6B5335, #5C4528)",
            clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
            boxShadow: lampOn ? "0 0 25px rgba(255,200,0,0.5), 0 4px 8px rgba(255,180,0,0.3)" : "0 1px 3px rgba(0,0,0,0.3)",
            transition: "all 0.3s ease",
          }} />
          {/* Stem */}
          <div style={{ width: 4, height: 14, background: lampOn ? "#C8A050" : "#7B6040", margin: "0 auto", transition: "background 0.3s" }} />
          {/* Base */}
          <div style={{ width: 18, height: 5, background: lampOn ? "#B8903A" : "#6B5335", borderRadius: 3, margin: "0 auto", boxShadow: "0 1px 2px rgba(0,0,0,0.3)" }} />
        </div>
      ), { top: 214, left: 30, zIndex: 6 }, onToggleLamp)}

      {/* Tamagotchi on nightstand */}
      {spot("tamagotchi", (
        <div style={{
          width: 24, height: 30, borderRadius: "50% 50% 42% 42%",
          background: "linear-gradient(180deg, #90CAF9, #42A5F5, #1E88E5)",
          border: "2px solid #1565C0",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "2px 2px 6px rgba(0,0,0,0.4), inset 0 1px 3px rgba(255,255,255,0.2)",
        }}>
          <div style={{
            width: 14, height: 11, borderRadius: 2,
            background: "linear-gradient(180deg, #D0E0A8, #B8D088)",
            border: "1px solid #90B060",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 6, lineHeight: 1 }}>😊</span>
          </div>
        </div>
      ), { top: 222, left: 58, zIndex: 6 })}

      {/* ====== RUG ON FLOOR ====== */}
      <div style={{
        position: "absolute", top: 336, left: 34, width: 235, height: 137,
        background: "linear-gradient(135deg, #6A1B4D, #8B2252 30%, #9B2862 50%, #8B2252 70%, #6A1B4D)",
        borderRadius: 6,
        boxShadow: "inset 0 0 20px rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.25)",
        zIndex: 1,
      }}>
        {/* Rug border ornament */}
        <div style={{ position: "absolute", inset: 6, border: "1px solid rgba(255,200,100,0.15)", borderRadius: 3 }} />
        <div style={{ position: "absolute", inset: 10, border: "1px solid rgba(255,200,100,0.08)", borderRadius: 2 }} />
        {/* Center medallion pattern */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: 30, height: 30, borderRadius: "50%",
          border: "1px solid rgba(255,200,100,0.1)",
        }} />
      </div>

      {/* ====== FLOOR ITEMS ====== */}
      {spot("panini", (
        <div style={{
          width: 34, height: 26, background: "linear-gradient(135deg, #FFD700, #DAA520, #B8860B)",
          border: "2px solid #8B6914", borderRadius: 2,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "2px 2px 6px rgba(0,0,0,0.4)",
          transform: "rotate(-8deg)",
        }}>
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: 10 }}>⚽</span>
            <div style={{ fontSize: 4, color: "#4A3000", fontWeight: "bold" }}>PANINI</div>
          </div>
        </div>
      ), { top: 380, left: 78, zIndex: 4 })}

      {spot("billes", (
        <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "radial-gradient(circle at 30% 30%, #87CEFA, #1E90FF 60%, #0066CC)", boxShadow: "inset 0 -3px 4px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.4), 1px 1px 3px rgba(0,0,0,0.3)" }} />
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: "radial-gradient(circle at 30% 30%, #FFD700, #FF6347 70%, #CC3300)", boxShadow: "inset 0 -2px 3px rgba(0,0,0,0.3), inset 0 2px 3px rgba(255,255,255,0.3)" }} />
          <div style={{ width: 16, height: 16, borderRadius: "50%", background: "radial-gradient(circle at 30% 30%, #B8A0E0, #6A40B0 60%, #3A1070)", boxShadow: "inset 0 -3px 5px rgba(0,0,0,0.3), inset 0 3px 5px rgba(255,255,255,0.25), 1px 2px 4px rgba(0,0,0,0.3)" }} />
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "radial-gradient(circle at 30% 30%, #90EE90, #228B22)", boxShadow: "inset 0 -1px 2px rgba(0,0,0,0.3)" }} />
        </div>
      ), { top: 420, left: 156, zIndex: 4 })}

      {spot("pateAProut", (
        <div style={{
          width: 28, height: 20, borderRadius: "50% 50% 44% 44%",
          background: "linear-gradient(180deg, #AB47BC, #8E24AA, #6A1B9A)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "2px 2px 5px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.15)",
          border: "1px solid #4A148C",
        }}>
          <span style={{ fontSize: 11 }}>💩</span>
        </div>
      ), { top: 370, left: 34, zIndex: 4 })}

      {spot("beyblade", (
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {/* Dragoon */}
          <div style={{
            width: 22, height: 22, borderRadius: "50%",
            background: "conic-gradient(from 30deg, #3B82F6, #93C5FD, #2563EB, #60A5FA, #3B82F6)",
            border: "2px solid #1D4ED8",
            boxShadow: "0 0 8px rgba(59,130,246,0.4), inset 0 0 4px rgba(255,255,255,0.2)",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1D4ED8", margin: "6px auto 0", border: "1px solid #93C5FD" }} />
          </div>
          {/* Dranzer */}
          <div style={{
            width: 18, height: 18, borderRadius: "50%",
            background: "conic-gradient(from 60deg, #EF4444, #FCA5A5, #DC2626, #F87171, #EF4444)",
            border: "2px solid #B91C1C",
            boxShadow: "0 0 6px rgba(239,68,68,0.3)",
          }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#B91C1C", margin: "5px auto 0", border: "1px solid #FCA5A5" }} />
          </div>
          {/* Stadium edge hint */}
          <div style={{
            position: "absolute", top: -6, left: -10, right: -10, bottom: -6,
            border: "2px solid rgba(100,100,100,0.15)", borderRadius: "50%",
            pointerEvents: "none",
          }} />
        </div>
      ), { top: 430, right: 90, zIndex: 4 })}

      {/* ====== LAMP AMBIENT GLOW ====== */}
      {lampOn && (
        <>
          <div style={{
            position: "absolute", top: 170, left: 0, width: 150, height: 150,
            background: "radial-gradient(ellipse at center, rgba(255,220,80,0.1) 0%, rgba(255,200,50,0.04) 40%, transparent 70%)",
            pointerEvents: "none", zIndex: 0,
          }} />
          <div style={{
            position: "absolute", top: 244, left: 15, width: 80, height: 80,
            background: "radial-gradient(circle, rgba(255,240,180,0.06) 0%, transparent 60%)",
            pointerEvents: "none", zIndex: 0,
          }} />
        </>
      )}

      {/* ====== DARK OVERLAY (lamp off) ====== */}
      {!lampOn && (
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 10% 40%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.72) 100%)",
          pointerEvents: "none", transition: "opacity 0.5s ease", zIndex: 8,
        }} />
      )}

      {/* ====== TITLE OVERLAY ====== */}
      <div style={{
        position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)",
        textAlign: "center", zIndex: 9, pointerEvents: "none",
      }}>
        <div style={{
          fontSize: 9, color: "rgba(139,107,174,0.4)", fontFamily: "'Tahoma', sans-serif",
          textShadow: "0 1px 3px rgba(0,0,0,0.5)",
        }}>
          Clique sur les objets pour les explorer
        </div>
      </div>
      </div>
    </div>
  );
}

/* ============================================================
   COUETTE SELECTOR
   ============================================================ */
function CouetteSelector({ couette, setCouette }) {
  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <NostalImg src="/images/desktop/chambre.png" fallback="🛏️" size={36} />
        <div style={{ color: "#C8B0E8", fontSize: 15, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif", marginTop: 4 }}>
          Choisis ta housse de couette !
        </div>
        <div style={{ color: "#8B6BAE", fontSize: 11, marginTop: 4, fontStyle: "italic" }}>
          Celle qui disait tout sur ta personnalité...
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {COUETTES.map((c) => {
          const selected = couette === c.id;
          return (
            <div
              key={c.id}
              onClick={() => setCouette(c.id)}
              style={{
                background: selected ? `${c.color}30` : "rgba(255,255,255,0.05)",
                border: selected ? `2px solid ${c.color}90` : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8, padding: 14, cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: selected ? `0 0 20px ${c.color}30` : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <NostalImg src={c.img} fallback={c.emoji} size={28} />
                <div style={{ color: "#E0E0E0", fontSize: 13, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif" }}>
                  {c.label}
                </div>
              </div>
              <div style={{ color: "#999", fontSize: 11, marginTop: 8, lineHeight: 1.5 }}>
                {c.desc}
              </div>
              {selected && (
                <div style={{ color: c.color, fontSize: 10, marginTop: 6, fontWeight: "bold" }}>
                  ✓ Sur ton lit !
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   TAMAGOTCHI WIDGET
   ============================================================ */
function TamagotchiWidget({ tama, tamaDo, tamaMood, tamaAction, neglected, onReset, tamaTotal }) {
  const statBar = (label, value, color) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <span style={{ color: "#AAA", fontSize: 11, width: 65, fontFamily: "'Tahoma', sans-serif" }}>{label}</span>
      <div style={{ flex: 1, height: 10, background: "rgba(255,255,255,0.08)", borderRadius: 5, overflow: "hidden" }}>
        <div style={{
          width: `${(value / TAMA_MAX) * 100}%`, height: "100%",
          background: value <= 1 ? "#e74c3c" : color,
          borderRadius: 5, transition: "width 0.5s ease",
        }} />
      </div>
      <span style={{ color: "#666", fontSize: 10, width: 20, textAlign: "right" }}>{value}/{TAMA_MAX}</span>
    </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      {/* Tamagotchi screen */}
      <div style={{
        background: "#C8D8A0", borderRadius: 16, padding: 20, maxWidth: 240, margin: "0 auto",
        border: "4px solid #A0B878", boxShadow: "inset 0 2px 8px rgba(0,0,0,0.15), 0 0 20px rgba(168,200,120,0.2)",
      }}>
        {neglected ? (
          /* Neglected / dead state */
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{ fontSize: 48, opacity: 0.6 }}>💀</div>
            <div style={{ fontSize: 11, color: "#8B6040", fontWeight: "bold", marginTop: 8 }}>
              Ton Tamagotchi s'est endormi...
            </div>
            <button
              onClick={onReset}
              style={{
                marginTop: 12,
                background: "#A0B878",
                border: "2px solid #6B8840",
                borderRadius: 8,
                padding: "8px 18px",
                cursor: "pointer",
                fontSize: 12,
                color: "#2D3B1A",
                fontWeight: "bold",
                fontFamily: "'Tahoma', sans-serif",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#B8D090")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#A0B878")}
            >
              🔄 Réveiller
            </button>
          </div>
        ) : (
          <>
            {/* Pixel pet display */}
            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <div style={{
                fontSize: 48,
                transition: "transform 0.3s",
                transform: tamaAction ? "scale(1.2)" : "scale(1)",
              }}>
                {tamaMood}
              </div>
              {tamaAction && (
                <div style={{ fontSize: 11, color: "#556B2F", fontWeight: "bold", marginTop: 4, animation: "fadeIn 0.2s" }}>
                  {tamaAction === "nourrir" && "Miam miam !"}
                  {tamaAction === "jouer" && "Youpi !"}
                  {tamaAction === "nettoyer" && "Tout propre !"}
                </div>
              )}
            </div>

            {/* Stats */}
            <div style={{ marginBottom: 12 }}>
              {statBar("Faim", tama.faim, "#E8A838")}
              {statBar("Bonheur", tama.bonheur, "#E86088")}
              {statBar("Propreté", tama.proprete, "#58A8D8")}
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
              {[
                { action: "nourrir", emoji: "🍔", label: "Nourrir" },
                { action: "jouer", emoji: "⚽", label: "Jouer" },
                { action: "nettoyer", emoji: "🧼", label: "Nettoyer" },
              ].map((btn) => (
                <button
                  key={btn.action}
                  onClick={() => tamaDo(btn.action)}
                  style={{
                    background: "#8CA858",
                    border: "2px solid #6B8840",
                    borderRadius: 8,
                    padding: "6px 10px",
                    cursor: "pointer",
                    fontSize: 11,
                    color: "#2D3B1A",
                    fontWeight: "bold",
                    fontFamily: "'Tahoma', sans-serif",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#A0C060")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#8CA858")}
                >
                  {btn.emoji} {btn.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Flavor text */}
      <div style={{ textAlign: "center", marginTop: 16, color: "#8B6BAE", fontSize: 11, fontStyle: "italic" }}>
        {tamaTotal >= 12
          ? "Ton Tamagotchi est au top ! Des petits coeurs flottent autour de lui..."
          : tamaTotal >= 6
          ? "Il va bien, mais il aimerait un peu plus d'attention..."
          : "Il est triste ! Vite, occupe-toi de lui !"
        }
      </div>
    </div>
  );
}

/* ============================================================
   PANINI ALBUM
   ============================================================ */
function PaniniAlbum({ page, setPage, collected, newStickers }) {
  const currentPage = ALBUM_PAGES[page];
  const ownedCount = collected.length;
  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      {/* Album cover / header */}
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: "bold", color: "#E0C870", fontFamily: "'Tahoma', sans-serif" }}>
          {ALBUM_TITLE}
        </div>
        <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>
          {ownedCount}/{TOTAL_STICKERS} stickers collectés{ownedCount < TOTAL_STICKERS ? " — Il t'en manque toujours..." : " — Collection complète !!"}
        </div>
      </div>

      {/* Team page */}
      <div style={{
        background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: 12,
        border: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <span style={{ color: "#E0C870", fontSize: 13, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif" }}>
            {currentPage.team}
          </span>
        </div>

        {/* Sticker grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
          {currentPage.stickers.map((sticker, i) => {
            const owned = collected.includes(sticker.name);
            const isNew = newStickers.includes(sticker.name);
            return (
              <div
                key={i}
                style={{
                  background: owned ? "rgba(224,200,112,0.1)" : "rgba(100,100,100,0.1)",
                  border: owned ? "1px solid rgba(224,200,112,0.3)" : "1px dashed rgba(100,100,100,0.3)",
                  borderRadius: 6, padding: 8, textAlign: "center", position: "relative",
                  minHeight: 60, display: "flex", flexDirection: "column", justifyContent: "center",
                  animation: isNew ? "popIn 0.4s ease-out" : "none",
                }}
              >
                {owned ? (
                  <>
                    {isNew && (
                      <div style={{
                        position: "absolute", top: -4, right: -4,
                        background: "#FF4444", color: "#fff", fontSize: 7, fontWeight: "bold",
                        padding: "1px 4px", borderRadius: 6, animation: "blink 1s infinite",
                      }}>Nouveau!</div>
                    )}
                    <div style={{ fontSize: 18 }}>⚽</div>
                    <div style={{ color: "#E0E0E0", fontSize: 8, marginTop: 4, fontWeight: "bold", lineHeight: 1.2 }}>
                      {sticker.name}
                    </div>
                    <div style={{ color: "#888", fontSize: 7, marginTop: 1 }}>#{sticker.number}</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 18, opacity: 0.3 }}>👤</div>
                    <div style={{ color: "#555", fontSize: 8, marginTop: 4 }}>???</div>
                    <div style={{ color: "#444", fontSize: 7, marginTop: 1 }}>#{sticker.number}</div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Page navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
        <button
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
          style={{ ...pageBtnStyle, opacity: page === 0 ? 0.3 : 1 }}
        >
          ← Précédent
        </button>
        <span style={{ color: "#888", fontSize: 10 }}>
          Page {page + 1} / {ALBUM_PAGES.length}
        </span>
        <button
          onClick={() => setPage(Math.min(ALBUM_PAGES.length - 1, page + 1))}
          disabled={page === ALBUM_PAGES.length - 1}
          style={{ ...pageBtnStyle, opacity: page === ALBUM_PAGES.length - 1 ? 0.3 : 1 }}
        >
          Suivant →
        </button>
      </div>

      {/* Nostalgia text */}
      <div style={{ textAlign: "center", marginTop: 10, color: "#8B6BAE", fontSize: 10, fontStyle: "italic" }}>
        "T'as pas Zidane en double ? Je te l'échange contre deux Trezeguet !"
      </div>
    </div>
  );
}

/* ============================================================
   PATE A PROUT
   ============================================================ */
function PateAProut({ playing, onPress }) {
  return (
    <div style={{ textAlign: "center", animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ color: "#C8B0E8", fontSize: 15, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif" }}>
          La Pâte à Prout
        </div>
        <div style={{ color: "#8B6BAE", fontSize: 11, marginTop: 4, fontStyle: "italic" }}>
          Le jouet le plus stupide. Et le plus génial.
        </div>
      </div>

      {/* The putty */}
      <div
        onClick={onPress}
        style={{
          display: "inline-block",
          fontSize: 80,
          cursor: "pointer",
          transition: "transform 0.15s ease",
          transform: playing ? "scale(1.3) rotate(10deg)" : "scale(1)",
          filter: playing ? "drop-shadow(0 0 20px rgba(200,100,255,0.5))" : "none",
          userSelect: "none",
        }}
      >
        🫠
      </div>

      {playing && (
        <div style={{
          fontSize: 32, marginTop: 8, animation: "fadeIn 0.1s ease-out",
          color: "#C8B0E8",
        }}>
          💨 PROUUUT 💨
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <div
          onClick={onPress}
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #9B59B6, #8E44AD)",
            color: "white", fontWeight: "bold", fontSize: 14,
            padding: "12px 32px", borderRadius: 24, cursor: "pointer",
            fontFamily: "'Tahoma', sans-serif",
            boxShadow: "0 4px 15px rgba(155,89,182,0.4)",
            transition: "all 0.15s",
            transform: playing ? "scale(0.95)" : "scale(1)",
          }}
        >
          APPUYER 👇
        </div>
      </div>

      <div style={{ marginTop: 24, color: "#666", fontSize: 10 }}>
        Vendu 2,50 euros en magasin de jouets. Valeur sentimentale : inestimable.
      </div>
    </div>
  );
}

/* ============================================================
   BILLES COLLECTION
   ============================================================ */
function BillesView() {
  const [selected, setSelected] = useState(null);
  const current = selected ? BILLES_COLLECTION.find(b => b.id === selected) : null;

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <NostalImg fallback="🔮" size={36} />
        <div style={{ color: "#C8B0E8", fontSize: 15, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif", marginTop: 4 }}>
          Ma Pochette de Billes
        </div>
        <div style={{ color: "#8B6BAE", fontSize: 11, marginTop: 4, fontStyle: "italic" }}>
          "Tu joues pour de vrai ou pour de faux ?"
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, justifyItems: "center" }}>
        {BILLES_COLLECTION.map((b) => {
          const isSelected = selected === b.id;
          return (
            <div
              key={b.id}
              onClick={() => setSelected(isSelected ? null : b.id)}
              style={{ textAlign: "center", cursor: "pointer", transition: "transform 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              <div style={{
                width: b.size, height: b.size, borderRadius: "50%", margin: "0 auto",
                background: `radial-gradient(circle at 30% 30%, ${b.colors[1]}, ${b.colors[0]} 50%, ${b.colors[2]} 100%)`,
                boxShadow: isSelected
                  ? `0 0 16px ${b.colors[0]}80, inset 0 -3px 6px rgba(0,0,0,0.3), inset 0 3px 6px rgba(255,255,255,0.4)`
                  : `inset 0 -3px 6px rgba(0,0,0,0.3), inset 0 3px 6px rgba(255,255,255,0.4)`,
                border: isSelected ? `2px solid ${b.colors[0]}` : "2px solid transparent",
                transition: "box-shadow 0.2s, border 0.2s",
              }} />
              <div style={{
                color: isSelected ? "#E0E0E0" : "#999",
                fontSize: 9, marginTop: 6, fontWeight: isSelected ? "bold" : "normal",
                fontFamily: "'Tahoma', sans-serif",
              }}>
                {b.name}
              </div>
            </div>
          );
        })}
      </div>

      {current && (
        <div style={{
          marginTop: 16, padding: 14,
          background: `rgba(${parseInt(current.colors[0].slice(1,3),16)},${parseInt(current.colors[0].slice(3,5),16)},${parseInt(current.colors[0].slice(5,7),16)},0.08)`,
          border: `1px solid ${current.colors[0]}40`,
          borderRadius: 8, animation: "fadeIn 0.2s ease-out",
        }}>
          <div style={{ color: "#E0E0E0", fontSize: 13, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif", marginBottom: 6 }}>
            {current.name}
          </div>
          <div style={{ color: "#AAA", fontSize: 11, lineHeight: 1.6 }}>
            {current.desc}
          </div>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 14, color: "#8B6BAE", fontSize: 10, fontStyle: "italic" }}>
        La pochette en filet avec le cordon. Le trésor de la récré.
      </div>
    </div>
  );
}

/* ============================================================
   JEUX DE SOCIÉTÉ
   ============================================================ */
function JeuxSocieteView() {
  const [open, setOpen] = useState(null);

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <NostalImg fallback="🎲" size={36} />
        <div style={{ color: "#C8B0E8", fontSize: 15, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif", marginTop: 4 }}>
          Jeux de Société
        </div>
        <div style={{ color: "#8B6BAE", fontSize: 11, marginTop: 4, fontStyle: "italic" }}>
          La pile de boîtes dans le placard. Dimanche après-midi, c'est jeu de société.
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {JEUX_SOCIETE.map((g) => {
          const isOpen = open === g.id;
          return (
            <div
              key={g.id}
              onClick={() => setOpen(isOpen ? null : g.id)}
              style={{
                background: isOpen ? `${g.color}20` : "rgba(255,255,255,0.04)",
                border: isOpen ? `2px solid ${g.color}60` : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8, overflow: "hidden", cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { if (!isOpen) e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
              onMouseLeave={(e) => { if (!isOpen) e.currentTarget.style.background = isOpen ? `${g.color}20` : "rgba(255,255,255,0.04)"; }}
            >
              {/* Box top */}
              <div style={{
                padding: "10px 14px",
                background: isOpen ? `linear-gradient(135deg, ${g.color}30, ${g.color}10)` : "none",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <NostalImg src={g.img} fallback={g.emoji} size={26} />
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#E0E0E0", fontSize: 13, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif" }}>
                    {g.name}
                  </div>
                  <span style={{ fontSize: 9, color: "#888" }}>{g.players} joueurs</span>
                </div>
                <span style={{ color: "#666", fontSize: 10, transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
              </div>
              {isOpen && (
                <div style={{ padding: "0 14px 12px 14px", color: "#AAA", fontSize: 11, lineHeight: 1.6, animation: "fadeIn 0.2s ease-out" }}>
                  {g.desc}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginTop: 14, color: "#8B6BAE", fontSize: 10, fontStyle: "italic" }}>
        "C'est pas du jeu !" "Si c'est du jeu, c'est la règle !" "Non c'est PAS la règle !"
      </div>
    </div>
  );
}

/* ============================================================
   SCOUBIDOUS
   ============================================================ */
function ScoubidousView() {
  const [selected, setSelected] = useState(null);
  const current = selected ? SCOUBIDOUS.find(s => s.id === selected) : null;

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <NostalImg fallback="🪢" size={36} />
        <div style={{ color: "#C8B0E8", fontSize: 15, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif", marginTop: 4 }}>
          Mes Scoubidous
        </div>
        <div style={{ color: "#8B6BAE", fontSize: 11, marginTop: 4, fontStyle: "italic" }}>
          Dessus, dessous, tirer, recommencer...
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {SCOUBIDOUS.map((s) => {
          const isSelected = selected === s.id;
          return (
            <div
              key={s.id}
              onClick={() => setSelected(isSelected ? null : s.id)}
              style={{
                textAlign: "center", cursor: "pointer",
                background: isSelected ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                border: isSelected ? `2px solid ${s.colors[0]}60` : "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10, padding: 12,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              {/* Scoubidou strand visual */}
              <div style={{ display: "flex", justifyContent: "center", gap: 2, height: 48, alignItems: "center" }}>
                {s.colors.map((c, i) => (
                  <div key={i} style={{
                    width: 6, height: 40, borderRadius: 3,
                    background: `linear-gradient(180deg, ${c}, ${c}88, ${c})`,
                    transform: i % 2 === 0 ? "rotate(8deg)" : "rotate(-8deg)",
                    boxShadow: `0 0 4px ${c}40`,
                  }} />
                ))}
              </div>
              <div style={{
                color: isSelected ? "#E0E0E0" : "#AAA",
                fontSize: 11, fontWeight: "bold", marginTop: 8,
                fontFamily: "'Tahoma', sans-serif",
              }}>
                {s.name}
              </div>
            </div>
          );
        })}
      </div>

      {current && (
        <div style={{
          marginTop: 16, padding: 14,
          background: `${current.colors[0]}12`,
          border: `1px solid ${current.colors[0]}30`,
          borderRadius: 8, animation: "fadeIn 0.2s ease-out",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            {current.colors.map((c, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
            ))}
            <span style={{ color: "#E0E0E0", fontSize: 13, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif" }}>
              {current.name}
            </span>
          </div>
          <div style={{ color: "#AAA", fontSize: 11, lineHeight: 1.6 }}>
            {current.desc}
          </div>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 14, color: "#8B6BAE", fontSize: 10, fontStyle: "italic" }}>
        Fils en plastique achetés 50 centimes à la papeterie. Bonheur : gratuit.
      </div>
    </div>
  );
}

/* ============================================================
   PELUCHES
   ============================================================ */
function PeluchesView() {
  const [hugged, setHugged] = useState(null);

  const doHug = (id) => {
    setHugged(id);
    setTimeout(() => setHugged(null), 1500);
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <NostalImg src="/images/chambre/peluches/ours.png" fallback="🧸" size={36} />
        <div style={{ color: "#C8B0E8", fontSize: 15, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif", marginTop: 4 }}>
          Mes Peluches
        </div>
        <div style={{ color: "#8B6BAE", fontSize: 11, marginTop: 4, fontStyle: "italic" }}>
          Clique pour leur faire un câlin !
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {PELUCHES.map((p) => {
          const isHugged = hugged === p.id;
          return (
            <div
              key={p.id}
              onClick={() => !hugged && doHug(p.id)}
              style={{
                background: isHugged ? `${p.color}25` : "rgba(255,255,255,0.04)",
                border: isHugged ? `2px solid ${p.color}60` : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10, padding: 14, cursor: hugged ? "default" : "pointer",
                transition: "all 0.2s", textAlign: "center",
              }}
              onMouseEnter={(e) => { if (!hugged) e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
              onMouseLeave={(e) => { if (!isHugged) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
            >
              <div style={{
                transition: "transform 0.3s ease",
                transform: isHugged ? "scale(1.3)" : "scale(1)",
                animation: isHugged ? "pulse 0.4s ease-in-out 3" : "none",
              }}>
                <NostalImg src={p.img} fallback={p.emoji} size={40} />
              </div>
              <div style={{ color: "#E0E0E0", fontSize: 12, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif", marginTop: 6 }}>
                {p.name}
              </div>
              {isHugged ? (
                <div style={{ color: p.color, fontSize: 11, marginTop: 6, fontWeight: "bold", animation: "fadeIn 0.2s ease-out" }}>
                  {p.reaction}
                </div>
              ) : (
                <div style={{ color: "#888", fontSize: 10, marginTop: 6, lineHeight: 1.5 }}>
                  {p.desc}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginTop: 14, color: "#8B6BAE", fontSize: 10, fontStyle: "italic" }}>
        Tu les as toujours. Ils sont dans un carton au grenier. Ils t'attendent.
      </div>
    </div>
  );
}

/* ============================================================
   LEGO & BIONICLE GALLERY
   ============================================================ */
function LegoGallery() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <NostalImg fallback="🧱" size={36} />
        <div style={{ color: "#C8B0E8", fontSize: 15, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif", marginTop: 4 }}>
          Ma Collection Lego
        </div>
        <div style={{ color: "#8B6BAE", fontSize: 11, marginTop: 4, fontStyle: "italic" }}>
          Le catalogue de Noël, page cornée sur les Lego...
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {LEGO_SETS.map((set) => {
          const isOpen = expanded === set.id;
          return (
            <div
              key={set.id}
              onClick={() => setExpanded(isOpen ? null : set.id)}
              style={{
                background: isOpen ? `${set.color}20` : "rgba(255,255,255,0.04)",
                border: isOpen ? `2px solid ${set.color}70` : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8, padding: 12, cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { if (!isOpen) e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
              onMouseLeave={(e) => { if (!isOpen) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <NostalImg src={set.img} fallback={set.emoji} size={24} />
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#E0E0E0", fontSize: 13, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif" }}>
                    {set.name}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 3 }}>
                    <span style={{
                      fontSize: 9, padding: "1px 6px", borderRadius: 3,
                      background: `${set.color}30`, color: set.color,
                      fontWeight: "bold",
                    }}>
                      {set.theme}
                    </span>
                    <span style={{ fontSize: 9, color: "#888" }}>{set.year}</span>
                    <span style={{ fontSize: 9, color: "#888" }}>{set.pieces} pièces</span>
                  </div>
                </div>
                <span style={{ color: "#666", fontSize: 10, transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
              </div>
              {isOpen && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${set.color}30`, color: "#AAA", fontSize: 11, lineHeight: 1.6, animation: "fadeIn 0.2s ease-out" }}>
                  {set.desc}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginTop: 14, color: "#8B6BAE", fontSize: 10, fontStyle: "italic" }}>
        L'odeur des briques neuves quand tu ouvrais le sachet. Inoubliable.
      </div>
    </div>
  );
}

/* ============================================================
   SHARED STYLES
   ============================================================ */
const backBtnStyle = {
  background: "none",
  border: "1px solid rgba(139,107,174,0.5)",
  color: "#8B6BAE",
  padding: "4px 12px",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 11,
  fontWeight: "bold",
  fontFamily: "'Tahoma', sans-serif",
};

const pageBtnStyle = {
  background: "none",
  border: "1px solid rgba(224,200,112,0.4)",
  color: "#E0C870",
  padding: "4px 12px",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 10,
  fontWeight: "bold",
  fontFamily: "'Tahoma', sans-serif",
};
