import { useState, useEffect } from "react";

export default function ReveilView() {
  const [time, setTime] = useState(new Date());
  const [alarmPlaying, setAlarmPlaying] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const playAlarm = () => {
    if (alarmPlaying) return;
    setAlarmPlaying(true);
    if (localStorage.getItem('em_muted') !== 'true') {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        for (let i = 0; i < 8; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.value = i % 2 === 0 ? 880 : 660;
          const t = ctx.currentTime + i * 0.25;
          gain.gain.setValueAtTime(0.06, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
          osc.connect(gain).connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.22);
        }
      } catch (_) {}
    }
    setTimeout(() => setAlarmPlaying(false), 2000);
  };

  const hh = time.getHours().toString().padStart(2, '0');
  const mm = time.getMinutes().toString().padStart(2, '0');
  const ss = time.getSeconds().toString().padStart(2, '0');

  return (
    <div style={{ textAlign: "center", animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ color: "#C8B0E8", fontSize: 15, fontWeight: "bold", fontFamily: "'Tahoma', sans-serif" }}>
          Réveil Digital
        </div>
        <div style={{ color: "#8B6BAE", fontSize: 11, marginTop: 4, fontStyle: "italic" }}>
          Le petit rectangle rouge qui brillait dans le noir. Tu le regardais quand tu n'arrivais pas à dormir.
        </div>
      </div>

      <div style={{
        display: "inline-block", padding: "24px 40px", borderRadius: 8,
        background: "#1a1a1a", border: "2px solid #333",
        boxShadow: "inset 0 0 20px rgba(0,0,0,0.5), 0 0 15px rgba(255,50,50,0.1)",
      }}>
        <div style={{
          fontFamily: "monospace", fontSize: 48, fontWeight: "bold",
          color: "#FF3333",
          textShadow: "0 0 10px rgba(255,50,50,0.6), 0 0 30px rgba(255,50,50,0.3)",
          letterSpacing: 4,
        }}>
          {hh}:{mm}
        </div>
        <div style={{
          fontFamily: "monospace", fontSize: 14, color: "#FF333380",
          textShadow: "0 0 4px rgba(255,50,50,0.3)", marginTop: 4,
        }}>
          :{ss}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <button
          onClick={playAlarm}
          disabled={alarmPlaying}
          style={{
            background: alarmPlaying ? "rgba(255,50,50,0.3)" : "rgba(255,50,50,0.15)",
            color: "#FF6666", border: "1px solid rgba(255,50,50,0.4)",
            padding: "8px 24px", borderRadius: 6, cursor: alarmPlaying ? "default" : "pointer",
            fontFamily: "'Tahoma', sans-serif", fontSize: 12, fontWeight: "bold",
            transition: "all 0.15s",
          }}
        >
          {alarmPlaying ? "🔔 BIP BIP BIP !" : "🔔 Tester l'alarme"}
        </button>
      </div>

      <div style={{ marginTop: 20, color: "#666", fontSize: 10, lineHeight: 1.6 }}>
        Modèle Radio-Réveil FM circa 2001. Les chiffres rouges dans l'obscurité,<br/>
        c'était à la fois rassurant et un peu flippant.
      </div>
    </div>
  );
}
