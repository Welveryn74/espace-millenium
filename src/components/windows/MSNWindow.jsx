import { useState, useEffect, useRef } from "react";
import Win from "../Win";
import NostalImg from "../NostalImg";
import { MSN_RESPONSES } from "../../data/msnResponses";
import { STATUS_OPTIONS } from "../../data/statusOptions";
import { getContextResponse } from "../../data/msnContextResponses";
import { playMSNMessage, playMSNNudge } from "../../utils/uiSounds";
import { getUsername, logActivity, loadState, saveState } from "../../utils/storage";

const MSN_EMOTICONS = {
  ":)": "😊", ":P": "😛", "(L)": "❤️", "(Y)": "👍", "^^": "😄",
  "XD": "😆", ":D": "😁", ":'(": "😢", "(N)": "👎", "(6)": "😈",
};

const TRANSFER_FILES = [
  "MiX_2005_FINAL.wma", "photo_vacances_lol.jpg",
  "dragon_ball_z_episode_47.avi", "msn_emotion_pack_v3.zip",
  "fond_decran_naruto.bmp",
];

function renderMSNMessage(text) {
  const parts = [];
  let remaining = text;
  let key = 0;
  while (remaining.length > 0) {
    let earliest = -1;
    let matchCode = null;
    for (const code of Object.keys(MSN_EMOTICONS)) {
      const idx = remaining.indexOf(code);
      if (idx !== -1 && (earliest === -1 || idx < earliest)) {
        earliest = idx;
        matchCode = code;
      }
    }
    if (earliest === -1) {
      parts.push(remaining);
      break;
    }
    if (earliest > 0) parts.push(remaining.slice(0, earliest));
    parts.push(
      <span key={key++} style={{ fontSize: 16, verticalAlign: "middle" }}>
        {MSN_EMOTICONS[matchCode]}
      </span>
    );
    remaining = remaining.slice(earliest + matchCode.length);
  }
  return parts;
}

export default function MSNWindow({ onClose, onMinimize, zIndex, onFocus, onWizz, openWindowIds = [], isMinimized = false, onNotification }) {
  const [messages, setMessages] = useState(() =>
    loadState('msn_messages', [{ from: "bot", msg: "cOuCou !! 😊 bienvenu sur msn !! sa fé plézir !!" }])
  );
  const [input, setInput] = useState("");
  const [status, setStatus] = useState(0);
  const [showStatus, setShowStatus] = useState(false);
  const [botIdx, setBotIdx] = useState(0);
  const [typing, setTyping] = useState(false);
  const [nudgeCount, setNudgeCount] = useState(0);
  const [transferProgress, setTransferProgress] = useState(null); // { file, progress }
  const chatRef = useRef(null);
  const transferTimerRef = useRef(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { from: "user", msg: input }]);
    setInput("");
    setTyping(true);
    logActivity('msn_message');
    const delay = 1500 + Math.random() * 2500;
    setTimeout(() => {
      setTyping(false);
      // Essayer une réponse contextuelle d'abord, sinon réponse classique
      const contextMsg = getContextResponse(openWindowIds);
      const username = getUsername();
      let botMsg = contextMsg || MSN_RESPONSES[botIdx % MSN_RESPONSES.length];
      // Parfois le bot utilise le prénom (20% de chance)
      if (!contextMsg && Math.random() < 0.2 && username !== 'Utilisateur') {
        botMsg = `hey ${username} !! ${botMsg}`;
      }
      setMessages(prev => [...prev, { from: "bot", msg: botMsg }]);
      setBotIdx(prev => prev + 1);
      // Notification si minimisé
      if (isMinimized && onNotification) {
        onNotification(botMsg);
      } else {
        playMSNMessage();
      }
      // 10% chance: file transfer
      if (Math.random() < 0.1 && !transferProgress) {
        const file = TRANSFER_FILES[Math.floor(Math.random() * TRANSFER_FILES.length)];
        const transferDelay = 1000 + Math.random() * 1000;
        setTimeout(() => {
          setMessages(prev => [...prev, { from: "system", msg: `📎 ~*~xX_DaRk_AnGeL_Xx~*~ vous envoie un fichier : ${file} (2.4 Mo)` }]);
          setTransferProgress({ file, progress: 0 });
          let prog = 0;
          const duration = 2000 + Math.random() * 2000;
          const steps = 20;
          const increment = 100 / steps;
          const interval = duration / steps;
          transferTimerRef.current = setInterval(() => {
            prog += increment;
            if (prog >= 100) {
              clearInterval(transferTimerRef.current);
              setTransferProgress(null);
              setMessages(prev => [...prev, { from: "system", msg: `✅ Transfert terminé ! Fichier sauvegardé dans Mes Documents` }]);
            } else {
              setTransferProgress({ file, progress: Math.min(100, prog) });
            }
          }, interval);
        }, transferDelay);
      }
    }, delay);
  };

  const doWizz = () => {
    onWizz();
    playMSNNudge();
    setNudgeCount(n => n + 1);
    setMessages(prev => [...prev, { from: "system", msg: `🔔 Tu as envoyé un WIZZ ! (x${nudgeCount + 1})` }]);
    // Bot responds to wizz after a bit
    if (nudgeCount > 0 && nudgeCount % 3 === 0) {
      setTimeout(() => {
        setMessages(prev => [...prev, { from: "bot", msg: "ARRETE DE WIZZ !! 😤😤😤" }]);
      }, 1500);
    }
  };

  // Persist messages (limit 50)
  useEffect(() => {
    saveState('msn_messages', messages.slice(-50));
  }, [messages]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, typing]);

  const botName = "~*~xX_DaRk_AnGeL_Xx~*~";

  return (
    <Win title={`${botName} — Conversation`} onClose={onClose} onMinimize={onMinimize} width={520} height={560} zIndex={zIndex} onFocus={onFocus} initialPos={{ x: 120, y: 25 }} color="#0078D4">
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff" }}>
        {/* Header with contact info */}
        <div style={{ padding: "8px 12px", background: "linear-gradient(180deg, #E8F4FF 0%, #D0E8FF 100%)", borderBottom: "1px solid #B0C8E8", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: 4, background: "linear-gradient(135deg, #F0F, #60F)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)", overflow: "hidden" }}>
            <NostalImg src="/images/ui/msn-contact.png" fallback="😈" size={28} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: "bold", color: "#003" }}>{botName}</div>
            <div style={{ fontSize: 10, color: "#666" }}>🎵 Evanescence — Bring Me To Life 🎵</div>
          </div>
        </div>

        {/* Status selector */}
        <div style={{ padding: "4px 10px", background: "#F0F4FF", borderBottom: "1px solid #D0D8E8", fontSize: 11, position: "relative" }}>
          <span style={{ cursor: "pointer", color: "#444" }} onClick={() => setShowStatus(!showStatus)}>
            Mon statut : {STATUS_OPTIONS[status].emoji} {STATUS_OPTIONS[status].text} ▾
          </span>
          {showStatus && (
            <div style={{ position: "absolute", top: 22, left: 0, background: "#fff", border: "1px solid #aaa", boxShadow: "2px 2px 8px rgba(0,0,0,0.2)", zIndex: 99, width: "100%" }}>
              {STATUS_OPTIONS.map((s, i) => (
                <div key={i} onClick={() => { setStatus(i); setShowStatus(false); }}
                  style={{ padding: "5px 10px", cursor: "pointer", fontSize: 11, borderBottom: "1px solid #eee", transition: "background 0.1s" }}
                  onMouseEnter={e => e.target.style.background = "#E0ECFF"}
                  onMouseLeave={e => e.target.style.background = "#fff"}>
                  {s.emoji} {s.text}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat area */}
        <div ref={chatRef} style={{ flex: 1, padding: 12, overflowY: "auto", fontSize: 14, background: "linear-gradient(180deg, #fff 0%, #FAFCFF 100%)", borderBottom: "1px solid #ccc" }}>
          {messages.map((m, i) => (
            <div key={i} style={{ marginBottom: 10, animation: "slideUp 0.2s ease-out" }}>
              {m.from === "system" ? (
                <div style={{ color: "#999", fontStyle: "italic", textAlign: "center", fontSize: 10, padding: "3px 0" }}>{m.msg}</div>
              ) : (
                <>
                  <div style={{ color: m.from === "bot" ? "#C800C8" : "#0000C8", fontWeight: "bold", fontSize: 10, marginBottom: 2 }}>
                    {m.from === "bot" ? `${botName} dit :` : `${getUsername()} dit :`}
                  </div>
                  <div style={{
                    color: "#333", fontSize: 14, lineHeight: 1.5,
                    fontFamily: m.from === "bot" ? "'Comic Sans MS', 'Comic Sans', cursive" : "'Tahoma', sans-serif",
                  }}>{renderMSNMessage(m.msg)}</div>
                </>
              )}
            </div>
          ))}
          {transferProgress && (
            <div style={{ margin: "6px 0", padding: "6px 10px", background: "#F0F4FF", border: "1px solid #D0D8E8", borderRadius: 4, fontSize: 10 }}>
              <div style={{ color: "#555", marginBottom: 4 }}>📁 Réception : {transferProgress.file}</div>
              <div style={{ height: 8, background: "#ddd", borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                  height: "100%", background: "linear-gradient(90deg, #0078D4, #00AAFF)",
                  borderRadius: 4, width: `${transferProgress.progress}%`,
                  transition: "width 0.15s linear",
                }} />
              </div>
              <div style={{ color: "#888", marginTop: 2 }}>{Math.floor(transferProgress.progress)}%</div>
            </div>
          )}
          {typing && (
            <div style={{ color: "#999", fontSize: 11, fontStyle: "italic" }}>
              {botName} est en train d'écrire
              {[0, 1, 2].map(i => (
                <span key={i} style={{ animation: "dotPulse 1.2s infinite", animationDelay: `${i * 0.4}s` }}>.</span>
              ))}
            </div>
          )}
        </div>

        {/* Emote bar — intentionally kept as emojis */}
        <div style={{ padding: "3px 8px", background: "#F8F8F8", borderBottom: "1px solid #e0e0e0", display: "flex", gap: 4 }}>
          {["😊", "😂", "😢", "😍", "😡", "🤣", "😘", "🙄"].map((e, i) => (
            <span key={i} onClick={() => setInput(prev => prev + e)} style={{ cursor: "pointer", fontSize: 20, padding: 2, borderRadius: 3, transition: "background 0.1s" }}
              onMouseEnter={ev => ev.target.style.background = "#E0E0FF"}
              onMouseLeave={ev => ev.target.style.background = "transparent"}>{e}</span>
          ))}
        </div>

        {/* Input area */}
        <div style={{ padding: 8, background: "#F0F0F0", display: "flex", gap: 4, alignItems: "center" }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Écris un message ici..."
            style={{ flex: 1, padding: "6px 10px", border: "1px solid #aaa", borderRadius: 2, fontSize: 12, fontFamily: "'Tahoma', sans-serif", outline: "none" }}
          />
          <button onClick={sendMessage} style={{
            padding: "6px 14px", background: "linear-gradient(180deg, #6CF 0%, #39F 100%)",
            border: "1px solid #29E", borderRadius: 3, color: "#fff", fontWeight: "bold",
            fontSize: 11, cursor: "pointer",
          }}>Envoyer</button>
          <button onClick={doWizz} title="WIZZ !" style={{
            padding: "6px 10px", background: "linear-gradient(180deg, #FC6 0%, #F90 100%)",
            border: "1px solid #E80", borderRadius: 3, color: "#fff", fontWeight: "bold",
            fontSize: 11, cursor: "pointer", animation: "pulse 2s infinite",
          }}>💥 Wizz</button>
        </div>
      </div>
    </Win>
  );
}
