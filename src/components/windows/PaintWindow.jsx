import { useState, useRef, useEffect, useCallback } from "react";
import Win from "../Win";
import {
  XP_COLORS, TOOLS, BRUSH_SIZES,
  CANVAS_WIDTH, CANVAS_HEIGHT, DEFAULTS,
} from "../../data/paintConfig";
import { loadState, saveState } from "../../utils/storage";

/* ── Flood-fill (BFS, Uint8Array visited) ── */
function floodFill(ctx, startX, startY, fillColor, w, h) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  const idx = (startY * w + startX) * 4;
  const tR = data[idx], tG = data[idx + 1], tB = data[idx + 2], tA = data[idx + 3];

  // parse fillColor hex
  const fR = parseInt(fillColor.slice(1, 3), 16);
  const fG = parseInt(fillColor.slice(3, 5), 16);
  const fB = parseInt(fillColor.slice(5, 7), 16);

  if (tR === fR && tG === fG && tB === fB && tA === 255) return;

  const visited = new Uint8Array(w * h);
  const queue = [startX, startY];
  const tolerance = 32;

  function match(i) {
    return (
      Math.abs(data[i] - tR) <= tolerance &&
      Math.abs(data[i + 1] - tG) <= tolerance &&
      Math.abs(data[i + 2] - tB) <= tolerance &&
      Math.abs(data[i + 3] - tA) <= tolerance
    );
  }

  while (queue.length) {
    const x = queue.shift();
    const y = queue.shift();
    const pi = y * w + x;
    if (x < 0 || x >= w || y < 0 || y >= h) continue;
    if (visited[pi]) continue;
    const di = pi * 4;
    if (!match(di)) continue;
    visited[pi] = 1;
    data[di] = fR; data[di + 1] = fG; data[di + 2] = fB; data[di + 3] = 255;
    queue.push(x - 1, y, x + 1, y, x, y - 1, x, y + 1);
  }
  ctx.putImageData(imageData, 0, 0);
}

/* ── Helpers ── */
function getCanvasCoords(e, canvas) {
  const r = canvas.getBoundingClientRect();
  return {
    x: Math.max(0, Math.min(CANVAS_WIDTH - 1, Math.round(e.clientX - r.left))),
    y: Math.max(0, Math.min(CANVAS_HEIGHT - 1, Math.round(e.clientY - r.top))),
  };
}

function hexFromRgb(r, g, b) {
  return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
}

/* ── Component ── */
export default function PaintWindow({ onClose: rawOnClose, onMinimize, zIndex, onFocus }) {
  const [activeTool, setActiveTool] = useState(DEFAULTS.tool);
  const [activeColor, setActiveColor] = useState(DEFAULTS.color);
  const [brushSize, setBrushSize] = useState(DEFAULTS.brushSize);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [lineStart, setLineStart] = useState(null);
  const [showFileMenu, setShowFileMenu] = useState(false);

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const onClose = useCallback(() => {
    if (canvasRef.current) {
      try {
        const dataURL = canvasRef.current.toDataURL('image/png');
        saveState('paint_canvas', dataURL);
      } catch (_) { /* silent */ }
    }
    rawOnClose();
  }, [rawOnClose]);

  /* ── Init canvas + restore saved drawing ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = DEFAULTS.bgColor;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;
    // Restore saved canvas
    const saved = loadState('paint_canvas', null);
    if (saved) {
      const img = new Image();
      img.onload = () => { ctx.drawImage(img, 0, 0); };
      img.src = saved;
    }
  }, []);

  /* ── File menu outside-click ── */
  useEffect(() => {
    if (!showFileMenu) return;
    const close = () => setShowFileMenu(false);
    const timer = setTimeout(() => document.addEventListener("click", close), 0);
    return () => { clearTimeout(timer); document.removeEventListener("click", close); };
  }, [showFileMenu]);

  /* ── Tool change: clear line state ── */
  const handleToolChange = useCallback((toolId) => {
    setActiveTool(toolId);
    setLineStart(null);
    setIsDrawing(false);
    const pv = previewCanvasRef.current;
    if (pv) pv.getContext("2d").clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }, []);

  /* ── Nouveau ── */
  const handleNew = useCallback(() => {
    const ctx = ctxRef.current;
    ctx.fillStyle = DEFAULTS.bgColor;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    saveState('paint_canvas', null);
    setShowFileMenu(false);
  }, []);

  /* ── Drawing helpers ── */
  const strokeWidth = () => (activeTool === "pencil" ? 1 : brushSize);

  const beginStroke = useCallback((x, y) => {
    const ctx = ctxRef.current;
    ctx.strokeStyle = activeTool === "eraser" ? DEFAULTS.bgColor : activeColor;
    ctx.lineWidth = strokeWidth();
    ctx.beginPath();
    ctx.moveTo(x, y);
    // draw a dot so single clicks are visible
    ctx.lineTo(x + 0.1, y + 0.1);
    ctx.stroke();
  }, [activeTool, activeColor, brushSize]);

  const continueStroke = useCallback((x, y) => {
    const ctx = ctxRef.current;
    ctx.lineTo(x, y);
    ctx.stroke();
  }, []);

  /* ── Mouse handlers ── */
  const handleMouseDown = useCallback((e) => {
    const canvas = canvasRef.current;
    const { x, y } = getCanvasCoords(e, canvas);
    const ctx = ctxRef.current;

    if (activeTool === "fill") {
      floodFill(ctx, x, y, activeColor, CANVAS_WIDTH, CANVAS_HEIGHT);
      return;
    }
    if (activeTool === "eyedropper") {
      const px = ctx.getImageData(x, y, 1, 1).data;
      setActiveColor(hexFromRgb(px[0], px[1], px[2]));
      return;
    }
    if (activeTool === "line") {
      setLineStart({ x, y });
      setIsDrawing(true);
      return;
    }
    // pencil / brush / eraser
    setIsDrawing(true);
    beginStroke(x, y);
  }, [activeTool, activeColor, beginStroke]);

  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    const { x, y } = getCanvasCoords(e, canvas);
    setMousePos({ x, y });

    if (!isDrawing) return;

    if (activeTool === "line" && lineStart) {
      const pvCtx = previewCanvasRef.current.getContext("2d");
      pvCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      pvCtx.strokeStyle = activeColor;
      pvCtx.lineWidth = brushSize;
      pvCtx.lineCap = "round";
      pvCtx.beginPath();
      pvCtx.moveTo(lineStart.x, lineStart.y);
      pvCtx.lineTo(x, y);
      pvCtx.stroke();
      return;
    }

    if (activeTool === "pencil" || activeTool === "brush" || activeTool === "eraser") {
      continueStroke(x, y);
    }
  }, [isDrawing, activeTool, activeColor, brushSize, lineStart, continueStroke]);

  const handleMouseUp = useCallback((e) => {
    if (!isDrawing) return;

    if (activeTool === "line" && lineStart) {
      const canvas = canvasRef.current;
      const { x, y } = getCanvasCoords(e, canvas);
      const ctx = ctxRef.current;
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(lineStart.x, lineStart.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      // clear preview
      previewCanvasRef.current.getContext("2d").clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      setLineStart(null);
    }

    setIsDrawing(false);
  }, [isDrawing, activeTool, activeColor, brushSize, lineStart]);

  const handleMouseLeave = useCallback(() => {
    if (isDrawing && activeTool !== "line") {
      setIsDrawing(false);
    }
  }, [isDrawing, activeTool]);

  /* ── Styles ── */
  const S = {
    root: {
      display: "flex", flexDirection: "column", height: "100%",
      background: "#ECE9D8", fontFamily: "Tahoma, sans-serif", fontSize: 11,
      userSelect: "none",
    },
    menuBar: {
      display: "flex", alignItems: "center", padding: "2px 4px",
      borderBottom: "1px solid #ACA899",
    },
    menuBtn: {
      padding: "2px 8px", cursor: "pointer", position: "relative",
    },
    dropdown: {
      position: "absolute", top: "100%", left: 0, background: "#fff",
      border: "1px solid #ACA899", boxShadow: "2px 2px 4px rgba(0,0,0,0.2)",
      zIndex: 10, minWidth: 140,
    },
    dropItem: {
      padding: "4px 24px", cursor: "pointer", whiteSpace: "nowrap",
    },
    body: {
      display: "flex", flex: 1, minHeight: 0,
    },
    sidebar: {
      display: "flex", flexDirection: "column", gap: 4,
      padding: 4, background: "#ECE9D8",
      borderRight: "1px solid #ACA899", width: 66,
    },
    toolBtn: (active) => ({
      width: 28, height: 28,
      border: active ? "1px inset #808080" : "1px outset #D4D0C8",
      background: active ? "#C0C0C0" : "#ECE9D8",
      cursor: "pointer", fontSize: 14,
      display: "flex", alignItems: "center", justifyContent: "center",
    }),
    sizeBtn: (active) => ({
      width: 28, height: 28,
      border: active ? "1px inset #808080" : "1px outset #D4D0C8",
      background: active ? "#C0C0C0" : "#ECE9D8",
      cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
    }),
    canvasArea: {
      flex: 1, background: "#808080", overflow: "auto",
      display: "flex", alignItems: "flex-start", justifyContent: "flex-start",
      padding: 4,
    },
    canvasWrapper: {
      position: "relative", border: "1px inset #404040",
      width: CANVAS_WIDTH, height: CANVAS_HEIGHT, flexShrink: 0,
    },
    canvas: {
      display: "block", cursor: activeTool === "eyedropper" ? "crosshair" : "crosshair",
    },
    preview: {
      position: "absolute", top: 0, left: 0, pointerEvents: "none",
    },
    colorBar: {
      display: "flex", alignItems: "center", gap: 6,
      padding: "3px 6px", borderTop: "1px solid #ACA899",
      background: "#ECE9D8",
    },
    activeColorBox: {
      width: 28, height: 28, border: "2px inset #808080",
      background: activeColor, flexShrink: 0,
    },
    swatchGrid: {
      display: "grid", gridTemplateColumns: "repeat(14, 14px)",
      gridTemplateRows: "repeat(2, 14px)", gap: 1,
    },
    swatch: (c) => ({
      width: 14, height: 14, background: c, cursor: "pointer",
      border: c === activeColor ? "1px solid #000" : "1px solid #808080",
    }),
    statusBar: {
      display: "flex", justifyContent: "space-between",
      padding: "2px 8px", borderTop: "1px solid #ACA899",
      background: "#ECE9D8", color: "#000", fontSize: 11,
    },
  };

  return (
    <Win
      title="Sans titre - Paint"
      onClose={onClose}
      onMinimize={onMinimize}
      width={860}
      height={620}
      zIndex={zIndex}
      onFocus={onFocus}
      color="#808080"
    >
      <div style={S.root}>
        {/* ── Menu Bar ── */}
        <div style={S.menuBar}>
          <div
            style={S.menuBtn}
            onClick={(e) => { e.stopPropagation(); setShowFileMenu(v => !v); }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#316AC5"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = ""; }}
          >
            Fichier
            {showFileMenu && (
              <div style={S.dropdown}>
                <div
                  style={S.dropItem}
                  onClick={handleNew}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#316AC5"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "#000"; }}
                >
                  Nouveau
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Body: Sidebar + Canvas ── */}
        <div style={S.body}>
          {/* Tool palette */}
          <div style={S.sidebar}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              {TOOLS.map((t) => (
                <button
                  key={t.id}
                  title={t.label}
                  style={S.toolBtn(activeTool === t.id)}
                  onClick={() => handleToolChange(t.id)}
                >
                  {t.emoji}
                </button>
              ))}
            </div>
            {/* Brush sizes */}
            <div style={{ borderTop: "1px solid #ACA899", paddingTop: 4, display: "flex", flexDirection: "column", gap: 2 }}>
              {BRUSH_SIZES.map((s) => (
                <button
                  key={s}
                  style={S.sizeBtn(brushSize === s)}
                  onClick={() => setBrushSize(s)}
                  title={`${s}px`}
                >
                  <div style={{
                    width: Math.min(s * 2, 20), height: Math.min(s * 2, 20),
                    borderRadius: "50%", background: "#000",
                  }} />
                </button>
              ))}
            </div>
          </div>

          {/* Canvas area */}
          <div style={S.canvasArea}>
            <div style={S.canvasWrapper}>
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                style={S.canvas}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              />
              <canvas
                ref={previewCanvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                style={S.preview}
              />
            </div>
          </div>
        </div>

        {/* ── Color Bar ── */}
        <div style={S.colorBar}>
          <div style={S.activeColorBox} />
          <div style={S.swatchGrid}>
            {XP_COLORS.map((c) => (
              <div
                key={c}
                style={S.swatch(c)}
                onClick={() => setActiveColor(c)}
              />
            ))}
          </div>
          <input
            type="color"
            value={activeColor}
            onChange={(e) => setActiveColor(e.target.value)}
            title="Couleur personnalisée"
            style={{ width: 28, height: 28, padding: 0, border: "1px solid #808080", cursor: "pointer" }}
          />
        </div>

        {/* ── Status Bar ── */}
        <div style={S.statusBar}>
          <span>Pos: {mousePos.x}, {mousePos.y}</span>
          <span>{CANVAS_WIDTH} x {CANVAS_HEIGHT} px</span>
        </div>
      </div>
    </Win>
  );
}
