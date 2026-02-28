import { useEffect } from "react";
import { playMSNMessage } from "../utils/uiSounds";

export default function MSNNotification({ botName, onOpen, onDismiss }) {
  useEffect(() => {
    playMSNMessage();
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      onClick={onOpen}
      style={{
        position: "fixed", bottom: 50, right: 20, zIndex: 101,
        background: "linear-gradient(180deg, #0078D4 0%, #005A9E 100%)",
        border: "2px solid #003D6B",
        borderRadius: 6, padding: "10px 16px",
        color: "#fff", fontFamily: "'Tahoma', sans-serif",
        boxShadow: "4px 4px 16px rgba(0,0,80,0.4)",
        cursor: "pointer", maxWidth: 260,
        animation: "slideInRight 0.3s ease-out",
      }}
    >
      <div style={{ fontSize: 10, opacity: 0.8, marginBottom: 4 }}>MSN Messenger</div>
      <div style={{ fontSize: 12, fontWeight: "bold" }}>Nouveau message de</div>
      <div style={{ fontSize: 11, marginTop: 2, fontStyle: "italic" }}>{botName}</div>
    </div>
  );
}
