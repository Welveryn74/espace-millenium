import { useState, useEffect } from "react";
import Win from "../Win";
import NostalImg from "../NostalImg";
import { CARAMAIL_EMAILS, CARAMAIL_SENT, CARAMAIL_DRAFTS, CARAMAIL_TRASH } from "../../data/caramailEmails";
import { loadState, saveState } from "../../utils/storage";
import { playClick } from "../../utils/uiSounds";

const FOLDERS = [
  { id: "inbox", label: "Boîte de réception", emoji: "📥" },
  { id: "sent", label: "Envoyés", emoji: "📤" },
  { id: "drafts", label: "Brouillons", emoji: "📝" },
  { id: "trash", label: "Corbeille", emoji: "🗑️" },
];

const FOLDER_DATA = {
  inbox: CARAMAIL_EMAILS,
  sent: CARAMAIL_SENT,
  drafts: CARAMAIL_DRAFTS,
  trash: CARAMAIL_TRASH,
};

export default function CaramailWindow({ onClose, onMinimize, zIndex, onFocus }) {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [readEmails, setReadEmails] = useState(() => {
    const persisted = loadState('caramail_read', null);
    if (persisted) return new Set(persisted);
    return new Set(CARAMAIL_EMAILS.filter(e => e.read).map(e => e.id));
  });
  const [activeFolder, setActiveFolder] = useState("inbox");
  const [sentEmails, setSentEmails] = useState([]);
  const [replyMode, setReplyMode] = useState(false); // 'reply' | 'compose' | false
  const [composeData, setComposeData] = useState({ to: "", subject: "", body: "" });
  const [toast, setToast] = useState(null);

  // Persist read state
  useEffect(() => {
    saveState('caramail_read', [...readEmails]);
  }, [readEmails]);

  const inboxUnread = CARAMAIL_EMAILS.filter(e => !readEmails.has(e.id)).length;

  const handleSelectEmail = (email) => {
    playClick();
    setSelectedEmail(email);
    setReadEmails(prev => new Set([...prev, email.id]));
  };

  const allSent = [...CARAMAIL_SENT, ...sentEmails];
  const currentEmails = activeFolder === "sent" ? allSent : (FOLDER_DATA[activeFolder] || []);
  const isSentOrDraft = activeFolder === "sent" || activeFolder === "drafts";
  const totalMessages = Object.values(FOLDER_DATA).reduce((sum, arr) => sum + arr.length, 0) + sentEmails.length;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const handleSend = () => {
    if (!composeData.subject.trim() && !composeData.body.trim()) return;
    const newMail = {
      id: `sent_${Date.now()}`,
      to: composeData.to || "inconnu@caramail.fr",
      from: "moi@caramail.fr",
      subject: composeData.subject || "(sans objet)",
      body: composeData.body,
      date: new Date().toLocaleDateString("fr-FR"),
    };
    setSentEmails(prev => [newMail, ...prev]);
    setReplyMode(false);
    setComposeData({ to: "", subject: "", body: "" });
    showToast("Message envoyé !");
  };

  const openReply = () => {
    if (!selectedEmail) return;
    setComposeData({
      to: selectedEmail.from || "",
      subject: `Re: ${selectedEmail.subject}`,
      body: "",
    });
    setReplyMode("reply");
  };

  const openCompose = () => {
    setComposeData({ to: "", subject: "", body: "" });
    setReplyMode("compose");
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

        {/* Toolbar */}
        <div style={{
          padding: "3px 8px", background: "#ECE9D8", borderBottom: "1px solid #ACA899",
          display: "flex", gap: 6, alignItems: "center",
        }}>
          <button onClick={openCompose} style={{
            padding: "3px 10px", fontSize: 10, fontFamily: "'Tahoma', sans-serif",
            background: "linear-gradient(180deg, #E8E8E8 0%, #C8C8C8 100%)",
            border: "1px solid #888", borderRadius: 2, cursor: "pointer",
          }}>✉️ Nouveau message</button>
          {selectedEmail && activeFolder === "inbox" && (
            <button onClick={openReply} style={{
              padding: "3px 10px", fontSize: 10, fontFamily: "'Tahoma', sans-serif",
              background: "linear-gradient(180deg, #E8E8E8 0%, #C8C8C8 100%)",
              border: "1px solid #888", borderRadius: 2, cursor: "pointer",
            }}>↩️ Répondre</button>
          )}
        </div>

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Sidebar — folders */}
          <div style={{
            width: 140, background: "#F5F0E8", borderRight: "1px solid #D0C8B8",
            padding: "8px 0", flexShrink: 0,
          }}>
            {FOLDERS.map(f => {
              const count = f.id === "inbox" ? inboxUnread : FOLDER_DATA[f.id].length;
              return (
                <div
                  key={f.id}
                  onClick={() => { playClick(); setActiveFolder(f.id); setSelectedEmail(null); }}
                  style={{
                    padding: "5px 10px", fontSize: 11, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 6,
                    background: activeFolder === f.id ? "#316AC5" : "transparent",
                    color: activeFolder === f.id ? "#fff" : "#333",
                    fontWeight: f.id === "inbox" && inboxUnread > 0 ? "bold" : "normal",
                  }}
                  onMouseEnter={e => { if (activeFolder !== f.id) e.currentTarget.style.background = "#E0D8C8"; }}
                  onMouseLeave={e => { if (activeFolder !== f.id) e.currentTarget.style.background = "transparent"; }}
                >
                  <span>{f.emoji}</span>
                  <span>{f.label}</span>
                  {f.id === "inbox" && inboxUnread > 0 && (
                    <span style={{
                      marginLeft: "auto", background: activeFolder === f.id ? "#fff" : "#E87000",
                      color: activeFolder === f.id ? "#316AC5" : "#fff",
                      borderRadius: 8, padding: "0 5px", fontSize: 9, fontWeight: "bold",
                    }}>{inboxUnread}</span>
                  )}
                  {f.id !== "inbox" && (
                    <span style={{
                      marginLeft: "auto", fontSize: 9, color: activeFolder === f.id ? "#ccc" : "#999",
                    }}>{FOLDER_DATA[f.id].length}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Main content */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
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
                <div style={{ flex: 2, padding: "0 4px" }}>{isSentOrDraft ? "À" : "De"}</div>
                <div style={{ flex: 4, padding: "0 4px" }}>Objet</div>
                <div style={{ width: 80, padding: "0 4px" }}>Date</div>
              </div>
              {currentEmails.map(email => {
                const isRead = activeFolder !== "inbox" || readEmails.has(email.id);
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
                      {activeFolder === "drafts" ? "📝" : activeFolder === "trash" ? "🗑️" : !isRead ? "✉️" : "📭"}
                    </div>
                    <div style={{ flex: 2, padding: "0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {isSentOrDraft ? email.to : email.from}
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
            {selectedEmail && !replyMode && (
              <div style={{ flex: 1, overflow: "auto", padding: 12 }}>
                <div style={{ borderBottom: "1px solid #ddd", paddingBottom: 8, marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: "bold", color: "#333", marginBottom: 4 }}>
                    {selectedEmail.subject}
                  </div>
                  <div style={{ fontSize: 10, color: "#666" }}>
                    {isSentOrDraft ? "À" : "De"} : <strong>{isSentOrDraft ? selectedEmail.to : selectedEmail.from}</strong> — {selectedEmail.date}
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

            {/* Reply / Compose form */}
            {replyMode && (
              <div style={{ flex: 1, overflow: "auto", padding: 12, background: "#ECE9D8" }}>
                <div style={{ fontWeight: "bold", fontSize: 12, color: "#333", marginBottom: 8 }}>
                  {replyMode === "reply" ? "Répondre" : "Nouveau message"}
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 10, color: "#555", width: 30 }}>À :</span>
                  <input
                    value={composeData.to}
                    onChange={e => setComposeData(d => ({ ...d, to: e.target.value }))}
                    style={{
                      flex: 1, padding: "3px 6px", border: "1px inset #aaa",
                      fontSize: 11, fontFamily: "'Tahoma', sans-serif",
                    }}
                  />
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 10, color: "#555", width: 30 }}>Objet :</span>
                  <input
                    value={composeData.subject}
                    onChange={e => setComposeData(d => ({ ...d, subject: e.target.value }))}
                    style={{
                      flex: 1, padding: "3px 6px", border: "1px inset #aaa",
                      fontSize: 11, fontFamily: "'Tahoma', sans-serif",
                    }}
                  />
                </div>
                <textarea
                  value={composeData.body}
                  onChange={e => setComposeData(d => ({ ...d, body: e.target.value }))}
                  placeholder="Votre message..."
                  style={{
                    width: "100%", height: 100, padding: 6, border: "1px inset #aaa",
                    fontSize: 11, fontFamily: "'Tahoma', sans-serif", resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button onClick={handleSend} style={{
                    padding: "4px 16px", fontSize: 10, fontFamily: "'Tahoma', sans-serif",
                    background: "linear-gradient(180deg, #E8E8E8 0%, #C8C8C8 100%)",
                    border: "1px solid #888", borderRadius: 2, cursor: "pointer",
                  }}>Envoyer</button>
                  <button onClick={() => setReplyMode(false)} style={{
                    padding: "4px 16px", fontSize: 10, fontFamily: "'Tahoma', sans-serif",
                    background: "linear-gradient(180deg, #E8E8E8 0%, #C8C8C8 100%)",
                    border: "1px solid #888", borderRadius: 2, cursor: "pointer",
                  }}>Annuler</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status bar */}
        <div style={{
          padding: "3px 10px", background: "#ECE9D8", borderTop: "1px solid #ACA899",
          fontSize: 10, color: "#666", display: "flex", justifyContent: "space-between",
        }}>
          <span>{totalMessages} messages — {inboxUnread} non lu{inboxUnread > 1 ? "s" : ""}</span>
          <span>Connexion : 56K — Wanadoo</span>
        </div>

        {/* Toast notification */}
        {toast && (
          <div style={{
            position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)",
            background: "#228B22", color: "#fff", padding: "6px 16px", borderRadius: 4,
            fontSize: 11, fontFamily: "'Tahoma', sans-serif", boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            animation: "fadeIn 0.2s ease-out", zIndex: 10,
          }}>
            {toast}
          </div>
        )}
      </div>
    </Win>
  );
}
