import { useState, useEffect, useRef } from "react";

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"];

export default function Screensaver({ onDismiss }) {
  const [pos, setPos] = useState({ x: 100, y: 100 });
  const [vel, setVel] = useState({ dx: 2, dy: 1.5 });
  const [colorIdx, setColorIdx] = useState(0);
  const rafRef = useRef(null);
  const posRef = useRef(pos);
  const velRef = useRef(vel);
  const colorRef = useRef(colorIdx);

  useEffect(() => {
    const logoW = 220, logoH = 60;

    const animate = () => {
      let { x, y } = posRef.current;
      let { dx, dy } = velRef.current;

      x += dx;
      y += dy;

      let bounced = false;
      if (x <= 0 || x + logoW >= window.innerWidth) {
        dx = -dx;
        bounced = true;
      }
      if (y <= 0 || y + logoH >= window.innerHeight) {
        dy = -dy;
        bounced = true;
      }

      if (bounced) {
        colorRef.current = (colorRef.current + 1) % COLORS.length;
        setColorIdx(colorRef.current);
      }

      posRef.current = { x, y };
      velRef.current = { dx, dy };
      setPos({ x, y });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  // Dismiss on any interaction
  useEffect(() => {
    const dismiss = () => onDismiss();
    window.addEventListener("mousemove", dismiss);
    window.addEventListener("keydown", dismiss);
    window.addEventListener("mousedown", dismiss);
    return () => {
      window.removeEventListener("mousemove", dismiss);
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("mousedown", dismiss);
    };
  }, [onDismiss]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99998,
      background: "#000", cursor: "none",
    }}>
      <div style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        color: COLORS[colorIdx],
        fontSize: 24,
        fontWeight: "bold",
        fontFamily: "'Tahoma', 'Segoe UI', sans-serif",
        textShadow: `0 0 20px ${COLORS[colorIdx]}80, 0 0 40px ${COLORS[colorIdx]}40`,
        transition: "color 0.3s, text-shadow 0.3s",
        whiteSpace: "nowrap",
      }}>
        L'Espace Millénium
      </div>
    </div>
  );
}
