import { useState } from "react";
import Win from "../Win";
import NostalImg from "../NostalImg";
import { CARAMAIL_EMAILS } from "../../data/caramailEmails";

const FOLDERS = [
  { id: "inbox", label: "Boîte de réception", emoji: "📥" },
  { id: "sent", label: "Envoyés", emoji: "📤" },
  { id: "drafts", label: "Brouillons", emoji: "📝" },
  { id: "trash", label: "Corbeille", emoji: "🗑️" },
];

export default function CaramailWindow({ onClose, onMinimize, zIndex, onFocus }) {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [readEmails, setReadEmails] = useState(() => new Set(CARAMAIL_EMAILS.filter(e => e.read).map(e => e.id)));
  const [activeFolder, setActiveFolder] = useState("inbox");

  const unreadCount = CARAMAIL_EMAILS.filter(e => !readEmails.has(e.id)).length;

  const handleSelectEmail = (email) => {
    setSelectedEmail(email);
    setReadEmails(prev => new Set([...prev, email.id]));
  };

  return (
    <Win
      title="Caramail — Boîte de réception"
      onClose={onClose}
      onMinimize={onMinimize}
      width={640}
      height={480}
      zIndex={zIndex}
      onFocus={onFocus}
      color="#E87000"
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff", fontFamily: "'Tahoma', sans-serif" }}>
        {/* Header */}
        <div style={{
          padding: "6px 12px",
          background: "linear-gradient(180deg, #FF8C00 0%, #E87000 100%)",
          borderBottom: "2px solid #C06000",
          display: "flex", alignItems: "center", gap: 8,
          color: "#fff",
        }}>
          <NostalImg src="/images/desktop/caramail.png" fallback="📧" size={20} />
          <span style={{ fontWeight: "bold", fontSize: 13, textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}>Caramail</span>
          <span style={{ fontSize: 10, opacity: 0.8, marginLeft: "auto" }}>10 Mo utilisés sur 10 Mo</span>
        </div>

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Sidebar — folders */}
          <div style={{
            width: 140, background: "#F5F0E8", borderRight: "1px solid #D0C8B8",
            padding: "8px 0", flexShrink: 0,
          }}>
            {FOLDERS.map(f => (
              <div
                key={f.id}
                onClick={() => { setActiveFolder(f.id); setSelectedEmail(null); }}
                style={{
                  padding: "5px 10px", fontSize: 11, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6,
                  background: activeFolder === f.id ? "#316AC5" : "transparent",
                  color: activeFolder === f.id ? "#fff" : "#333",
                  fontWeight: f.id === "inbox" && unreadCount > 0 ? "bold" : "normal",
                }}
                onMouseEnter={e => { if (activeFolder !== f.id) e.currentTarget.style.background = "#E0D8C8"; }}
                onMouseLeave={e => { if (activeFolder !== f.id) e.currentTarget.style.background = "transparent"; }}
              >
                <span>{f.emoji}</span>
                <span>{f.label}</span>
                {f.id === "inbox" && unreadCount > 0 && (
                  <span style={{
                    marginLeft: "auto", background: activeFolder === f.id ? "#fff" : "#E87000",
                    color: activeFolder === f.id ? "#316AC5" : "#fff",
                    borderRadius: 8, padding: "0 5px", fontSize: 9, fontWeight: "bold",
                  }}>{unreadCount}</span>
                )}
              </div>
            ))}
          </div>

          {/* Main content */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {activeFolder === "inbox" ? (
              <>
                {/* Email list */}
                <div style={{
                  flex: selectedEmail ? "0 0 40%" : 1,
                  overflow: "auto", borderBottom: selectedEmail ? "2px solid #ccc" : "none",
                }}>
                  {/* Column headers */}
                  <div style={{
                    display: "flex", background: "linear-gradient(180deg, #fff 0%, #E8E4D8 100%)",
                    borderBottom: "1px solid #ACA899", fontSize: 10, fontWeight: "bold",
                    color: "#555", padding: "3px 0", position: "sticky", top: 0,
                  }}>
                    <div style={{ width: 24 }} />
                    <div style={{ flex: 2, padding: "0 4px" }}>De</div>
                    <div style={{ flex: 4, padding: "0 4px" }}>Objet</div>
                    <div style={{ width: 80, padding: "0 4px" }}>Date</div>
                  </div>
                  {CARAMAIL_EMAILS.map(email => {
                    const isRead = readEmails.has(email.id);
                    const isSelected = selectedEmail?.id === email.id;
                    return (
                      <div
                        key={email.id}
                        onClick={() => handleSelectEmail(email)}
                        style={{
                          display: "flex", fontSize: 11, padding: "4px 0",
                          cursor: "pointer",
                          background: isSelected ? "#316AC5" : "transparent",
                          color: isSelected ? "#fff" : "#000",
                          fontWeight: isRead ? "normal" : "bold",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                        onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#E8F0FF"; }}
                        onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                      >
                        <div style={{ width: 24, textAlign: "center", fontSize: 9 }}>
                          {!isRead ? "✉️" : "📭"}
                        </div>
                        <div style={{ flex: 2, padding: "0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {email.from}
                        </div>
                        <div style={{ flex: 4, padding: "0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {email.subject}
                        </div>
                        <div style={{ width: 80, padding: "0 4px", color: isSelected ? "#ddd" : "#888", fontSize: 10 }}>
                          {email.date}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Email preview */}
                {selectedEmail && (
                  <div style={{ flex: 1, overflow: "auto", padding: 12 }}>
                    <div style={{ borderBottom: "1px solid #ddd", paddingBottom: 8, marginBottom: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: "bold", color: "#333", marginBottom: 4 }}>
                        {selectedEmail.subject}
                      </div>
                      <div style={{ fontSize: 10, color: "#666" }}>
                        De : <strong>{selectedEmail.from}</strong> — {selectedEmail.date}
                      </div>
                    </div>
                    <div style={{
                      fontSize: 11, lineHeight: 1.7, color: "#333",
                      whiteSpace: "pre-wrap", fontFamily: "'Tahoma', sans-serif",
                    }}>
                      {selectedEmail.body}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                color: "#999", fontSize: 12, fontStyle: "italic",
              }}>
                {activeFolder === "sent" && "Aucun message envoyé. Tu communiques que par MSN de toute façon."}
                {activeFolder === "drafts" && "Aucun brouillon. Tu tapes trop vite pour réfléchir avant d'envoyer."}
                {activeFolder === "trash" && "La corbeille est vide. Enfin, celle-là."}
              </div>
            )}
          </div>
        </div>

        {/* Status bar */}
        <div style={{
          padding: "3px 10px", background: "#ECE9D8", borderTop: "1px solid #ACA899",
          fontSize: 10, color: "#666", display: "flex", justifyContent: "space-between",
        }}>
          <span>{CARAMAIL_EMAILS.length} messages — {unreadCount} non lu{unreadCount > 1 ? "s" : ""}</span>
          <span>Connexion : 56K — Wanadoo</span>
        </div>
      </div>
    </Win>
  );
}
