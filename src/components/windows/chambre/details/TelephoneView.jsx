import { useState, useEffect } from "react";
import { viewTitle, viewSubtitle, viewFlavor, C } from "../../../../styles/chambreStyles";
import { loadState, saveState } from "../../../../utils/storage";
import { SMS_CONTACTS, NOKIA_WALLPAPERS } from "../../../../data/smsMessages";

export default function TelephoneView() {
  const [isOpen, setIsOpen] = useState(false);
  const [screen, setScreen] = useState("home"); // home, sms, contact, conversation, wallpaper, snake
  const [selectedContact, setSelectedContact] = useState(null);
  const [conversations, setConversations] = useState(() => loadState("nokia_convos", {}));
  const [battery, setBattery] = useState(() => loadState("nokia_battery", 100));
  const [wallpaper, setWallpaper] = useState(() => loadState("nokia_wallpaper", 0));
  const [flipAnim, setFlipAnim] = useState(false);

  // Battery drain
  useEffect(() => {
    if (!isOpen) return;
    const iv = setInterval(() => {
      setBattery((b) => {
        const next = Math.max(0, b - 1);
        saveState("nokia_battery", next);
        return next;
      });
    }, 15000); // lose 1% every 15s
    return () => clearInterval(iv);
  }, [isOpen]);

  // Recharge slowly when closed
  useEffect(() => {
    if (isOpen) return;
    const iv = setInterval(() => {
      setBattery((b) => {
        const next = Math.min(100, b + 5);
        saveState("nokia_battery", next);
        return next;
      });
    }, 10000);
    return () => clearInterval(iv);
  }, [isOpen]);

  const toggleFlip = () => {
    setFlipAnim(true);
    setTimeout(() => {
      setIsOpen((o) => !o);
      if (isOpen) setScreen("home");
      setFlipAnim(false);
    }, 300);
  };

  const sendSMS = (contactId, replyText) => {
    const contact = SMS_CONTACTS.find((c) => c.id === contactId);
    if (!contact) return;
    const convo = conversations[contactId] || [...contact.messages];
    convo.push({ from: "me", text: replyText });
    // Auto-response after delay
    if (contact.autoResponses.length > 0) {
      const auto = contact.autoResponses[Math.floor(Math.random() * contact.autoResponses.length)];
      setTimeout(() => {
        setConversations((prev) => {
          const updated = { ...prev };
          const c = updated[contactId] || [...convo];
          c.push({ from: contactId, text: auto });
          updated[contactId] = c;
          saveState("nokia_convos", updated);
          return updated;
        });
      }, 2000 + Math.random() * 3000);
    }
    const updated = { ...conversations, [contactId]: convo };
    setConversations(updated);
    saveState("nokia_convos", updated);
    setBattery((b) => Math.max(0, b - 2));
  };

  const wp = NOKIA_WALLPAPERS[wallpaper];

  // Nokia screen content
  const renderScreen = () => {
    if (battery <= 0) {
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", flexDirection: "column" }}>
          <div style={{ fontSize: 20 }}>🪫</div>
          <div style={{ fontSize: 9, color: "#333", marginTop: 4 }}>Batterie vide</div>
          <div style={{ fontSize: 8, color: "#555", marginTop: 2 }}>Ferme le clapet pour recharger</div>
        </div>
      );
    }

    if (screen === "home") {
      return (
        <div style={{ padding: 4, height: "100%" }}>
          <div style={{ textAlign: "center", fontSize: 12, fontWeight: "bold", color: "#000", fontFamily: "monospace" }}>
            NOKIA
          </div>
          <div style={{ textAlign: "center", fontSize: 8, color: "#444", marginBottom: 6 }}>
            {new Date().getHours().toString().padStart(2, "0")}:{new Date().getMinutes().toString().padStart(2, "0")}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {[
              { label: "Messages", icon: "✉️", action: () => setScreen("sms") },
              { label: "Fond d'écran", icon: "🎨", action: () => setScreen("wallpaper") },
              { label: "Snake", icon: "🐍", action: () => setScreen("snake") },
            ].map((item) => (
              <div
                key={item.label}
                onClick={item.action}
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "3px 6px", borderRadius: 2, cursor: "pointer",
                  background: "rgba(0,0,0,0.1)", fontSize: 9, color: "#000",
                }}
              >
                <span>{item.icon}</span> {item.label}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (screen === "sms") {
      return (
        <div style={{ padding: 4 }}>
          <div onClick={() => setScreen("home")} style={navBtn}>← Retour</div>
          <div style={{ fontSize: 9, fontWeight: "bold", color: "#000", marginBottom: 4 }}>Contacts</div>
          {SMS_CONTACTS.filter((c) => c.replies.length > 0).map((contact) => (
            <div
              key={contact.id}
              onClick={() => { setSelectedContact(contact.id); setScreen("conversation"); }}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "2px 4px", borderRadius: 2, cursor: "pointer",
                fontSize: 8, color: "#000", borderBottom: "1px solid #ccc",
              }}
            >
              <span>{contact.emoji}</span> {contact.name}
            </div>
          ))}
        </div>
      );
    }

    if (screen === "conversation" && selectedContact) {
      const contact = SMS_CONTACTS.find((c) => c.id === selectedContact);
      const convo = conversations[selectedContact] || contact.messages;
      return (
        <div style={{ padding: 4, display: "flex", flexDirection: "column", height: "100%" }}>
          <div onClick={() => setScreen("sms")} style={navBtn}>← {contact.name}</div>
          <div style={{ flex: 1, overflowY: "auto", marginBottom: 4 }}>
            {convo.map((msg, i) => (
              <div key={i} style={{
                fontSize: 7, color: "#000", padding: "2px 4px", marginBottom: 2,
                background: msg.from === "me" ? "rgba(0,100,200,0.15)" : "rgba(0,0,0,0.05)",
                borderRadius: 2, textAlign: msg.from === "me" ? "right" : "left",
              }}>
                {msg.text}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {contact.replies.map((r, i) => (
              <div
                key={i}
                onClick={() => sendSMS(contact.id, r)}
                style={{
                  fontSize: 6, padding: "2px 4px", borderRadius: 2, cursor: "pointer",
                  background: "rgba(0,0,0,0.15)", color: "#000",
                }}
              >
                {r}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (screen === "wallpaper") {
      return (
        <div style={{ padding: 4 }}>
          <div onClick={() => setScreen("home")} style={navBtn}>← Retour</div>
          <div style={{ fontSize: 9, fontWeight: "bold", color: "#000", marginBottom: 4 }}>Fond d'écran</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
            {NOKIA_WALLPAPERS.map((wp, i) => (
              <div
                key={wp.id}
                onClick={() => { setWallpaper(i); saveState("nokia_wallpaper", i); }}
                style={{
                  height: 30, borderRadius: 2, cursor: "pointer",
                  background: wp.color, border: wallpaper === i ? "2px solid #000" : "1px solid #999",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 7, color: "#888",
                }}
              >
                {wp.name}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (screen === "snake") {
      return <MiniSnake onBack={() => setScreen("home")} />;
    }

    return null;
  };

  return (
    <div style={{ textAlign: "center", animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ marginBottom: 12 }}>
        <div style={viewTitle}>Nokia 3310</div>
        <div style={viewSubtitle}>
          Le téléphone indestructible. Tu l'avais eu pour tes 10 ans. Premier texto : "slt sa va ?"
        </div>
      </div>

      {/* Le téléphone */}
      <div
        style={{
          display: "inline-block", perspective: 400, marginBottom: 16,
          cursor: "pointer",
        }}
        onClick={toggleFlip}
      >
        <div style={{
          transition: "transform 0.3s ease",
          transform: flipAnim ? "rotateX(90deg)" : "rotateX(0deg)",
          transformOrigin: "bottom",
        }}>
          {/* Écran / clapet */}
          <div style={{
            width: 120, height: isOpen ? 150 : 30,
            background: isOpen ? "#C5CFA0" : "#1a1a2e",
            borderRadius: "10px 10px 0 0",
            border: "2px solid #333",
            borderBottom: isOpen ? "1px solid #999" : "2px solid #333",
            overflow: "hidden",
            transition: "height 0.3s ease",
            position: "relative",
          }}>
            {isOpen && renderScreen()}
            {/* Battery indicator */}
            {isOpen && (
              <div style={{
                position: "absolute", top: 2, right: 4, fontSize: 7,
                color: battery < 20 ? "#c00" : "#333",
              }}>
                {battery > 66 ? "▓▓▓" : battery > 33 ? "▓▓░" : battery > 10 ? "▓░░" : "░░░"}
              </div>
            )}
          </div>
          {/* Corps / clavier */}
          <div style={{
            width: 120, height: 120,
            background: "linear-gradient(180deg, #2a2a3e, #1a1a2e)",
            borderRadius: "0 0 14px 14px",
            border: "2px solid #333",
            borderTop: "none",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 3, padding: "8px 0",
          }}>
            {/* D-pad */}
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "radial-gradient(circle, #444, #333)",
              border: "1px solid #555",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 8, color: "#888",
            }}>
              OK
            </div>
            {/* Keypad */}
            {[[1, 2, 3], [4, 5, 6], [7, 8, 9], ["*", 0, "#"]].map((row, ri) => (
              <div key={ri} style={{ display: "flex", gap: 3 }}>
                {row.map((k) => (
                  <div key={k} style={{
                    width: 22, height: 14, borderRadius: 3,
                    background: "linear-gradient(180deg, #555, #444)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 8, color: "#aaa", fontFamily: "monospace",
                  }}>
                    {k}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ color: C.textDim, fontSize: 10, marginBottom: 6 }}>
        {isOpen ? "Clic sur le téléphone pour fermer le clapet" : "Clic pour ouvrir le clapet"}
      </div>
      <div style={{ color: C.textMuted, fontSize: 9 }}>
        Batterie : {battery}%
        {battery < 20 && " (ferme le clapet pour recharger !)"}
      </div>

      <div style={viewFlavor}>
        Forfait : 2h d'appel + 30 SMS. Tu gérais tes textos comme un budget. Chaque "lol" comptait.
      </div>
    </div>
  );
}

// Mini Snake embedded in Nokia screen
function MiniSnake({ onBack }) {
  const W = 12, H = 10, CELL = 8;
  const [snake, setSnake] = useState([{ x: 6, y: 5 }]);
  const [food, setFood] = useState({ x: 3, y: 3 });
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [alive, setAlive] = useState(true);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowUp" || e.key === "z") setDir({ x: 0, y: -1 });
      if (e.key === "ArrowDown" || e.key === "s") setDir({ x: 0, y: 1 });
      if (e.key === "ArrowLeft" || e.key === "q") setDir({ x: -1, y: 0 });
      if (e.key === "ArrowRight" || e.key === "d") setDir({ x: 1, y: 0 });
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (!alive) return;
    const iv = setInterval(() => {
      setSnake((prev) => {
        const head = { x: prev[0].x + dir.x, y: prev[0].y + dir.y };
        if (head.x < 0 || head.x >= W || head.y < 0 || head.y >= H) { setAlive(false); return prev; }
        if (prev.some((s) => s.x === head.x && s.y === head.y)) { setAlive(false); return prev; }
        const next = [head, ...prev];
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 1);
          setFood({ x: Math.floor(Math.random() * W), y: Math.floor(Math.random() * H) });
        } else {
          next.pop();
        }
        return next;
      });
    }, 200);
    return () => clearInterval(iv);
  }, [dir, alive, food]);

  return (
    <div style={{ padding: 2 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div onClick={onBack} style={navBtn}>←</div>
        <div style={{ fontSize: 7, color: "#333" }}>Score: {score}</div>
      </div>
      <div style={{
        width: W * CELL, height: H * CELL, margin: "2px auto",
        background: "#9BA88B", position: "relative", border: "1px solid #7A8B6A",
      }}>
        {snake.map((s, i) => (
          <div key={i} style={{
            position: "absolute", left: s.x * CELL, top: s.y * CELL,
            width: CELL - 1, height: CELL - 1, background: "#333",
          }} />
        ))}
        <div style={{
          position: "absolute", left: food.x * CELL, top: food.y * CELL,
          width: CELL - 1, height: CELL - 1, background: "#111",
        }} />
        {!alive && (
          <div style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center",
            justifyContent: "center", background: "rgba(0,0,0,0.3)",
            fontSize: 8, color: "#000", fontWeight: "bold",
          }}>
            Game Over
          </div>
        )}
      </div>
      {/* Touch controls */}
      <div style={{ display: "flex", justifyContent: "center", gap: 2, marginTop: 2 }}>
        {[
          { label: "◀", d: { x: -1, y: 0 } },
          { label: "▲", d: { x: 0, y: -1 } },
          { label: "▼", d: { x: 0, y: 1 } },
          { label: "▶", d: { x: 1, y: 0 } },
        ].map((b) => (
          <div
            key={b.label}
            onClick={() => setDir(b.d)}
            style={{
              width: 16, height: 14, fontSize: 7, display: "flex",
              alignItems: "center", justifyContent: "center",
              background: "rgba(0,0,0,0.15)", borderRadius: 1, cursor: "pointer", color: "#333",
            }}
          >
            {b.label}
          </div>
        ))}
      </div>
    </div>
  );
}

const navBtn = {
  fontSize: 8, color: "#333", cursor: "pointer",
  padding: "1px 4px", marginBottom: 2,
};
