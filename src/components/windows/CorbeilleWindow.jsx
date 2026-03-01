import { useState } from "react";
import Win from "../Win";
import NostalImg from "../NostalImg";
import { playPaperSound } from "../../utils/uiSounds";
import { loadState, saveState } from "../../utils/storage";

const DELETED_ITEMS = [
  { icon: "\u{1F4C4}", name: "Exposé_volcans_FINAL_v3.doc", type: "Document Word", date: "12/03/2004", size: "245 Ko", img: "/images/corbeille/doc.png" },
  { icon: "\u{1F3B5}", name: "Crazy_In_Love-Beyonce.mp3", type: "Fichier MP3", date: "08/11/2003", size: "4.2 Mo", img: "/images/corbeille/mp3.png" },
  { icon: "\u{1F4C1}", name: "Nouveau dossier (3)", type: "Dossier", date: "15/06/2005", size: "0 Ko", img: "/images/corbeille/folder.png" },
  { icon: "\u{1F5BC}\uFE0F", name: "photo_classe_CM2.bmp", type: "Image Bitmap", date: "22/09/2003", size: "3.8 Mo", img: "/images/corbeille/image.svg" },
  { icon: "\u{1F4BE}", name: "age_of_empires_2_crack.exe", type: "Application", date: "03/01/2004", size: "156 Ko", img: "/images/corbeille/exe.png" },
  { icon: "\u{1F4C4}", name: "Lettre_au_Père_Noël_2004.doc", type: "Document Word", date: "18/12/2004", size: "89 Ko", img: "/images/corbeille/doc.png" },
  { icon: "\u{1F3B5}", name: "Dragostea_Din_Tei-OZONE.wma", type: "Fichier WMA", date: "25/04/2004", size: "3.1 Mo", img: "/images/corbeille/mp3.png" },
  { icon: "\u{1F4C1}", name: "Kazaa Downloads", type: "Dossier", date: "07/08/2003", size: "0 Ko", img: "/images/corbeille/folder.png" },
  { icon: "\u{1F5BC}\uFE0F", name: "wallpaper_dbz_1024x768.jpg", type: "Image JPEG", date: "14/02/2005", size: "512 Ko", img: "/images/corbeille/image.svg" },
  { icon: "\u{1F4C4}", name: "Sms_brouillon_pour_Julie.txt", type: "Fichier texte", date: "30/05/2005", size: "1 Ko", img: "/images/corbeille/doc.png" },
];

const HIDDEN_MESSAGES = {
  "Exposé_volcans_FINAL_v3.doc": "Volcan : montagne qui crache du feu. Voilà, exposé terminé.\n\n(J'ai eu 14/20 avec ça. Merci Encarta.)",
  "Lettre_au_Père_Noël_2004.doc": "Cher Père Noël,\n\nCette année je voudrais une PS2, un téléphone Nokia 3310 et la paix dans le monde.\n\nBisous.\n\nPS : si c'est trop, laisse tomber la paix dans le monde.",
  "Sms_brouillon_pour_Julie.txt": "Slt julie sa va ?\ntu veu sorti ac moi ?\nlol\n\n(jamais envoyé... évidemment)",
  "age_of_empires_2_crack.exe": "⚠ VIRUS DÉTECTÉ !\n\nScan en cours...\n████████████░░ 87%\n\n...nan jdéconne, c'est juste un crack.\nWololo.",
};

const COL_WIDTHS = { name: "40%", type: "22%", date: "22%", size: "14%" };

export default function CorbeilleWindow({ onClose, onMinimize, zIndex, onFocus }) {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [locked, setLocked] = useState(() => loadState('corbeille_locked', false));
  const [previewMsg, setPreviewMsg] = useState(null);
  const [restoreMsg, setRestoreMsg] = useState(null);

  return (
    <Win title="Corbeille" onClose={onClose} onMinimize={onMinimize} width={560} height={440} zIndex={zIndex} onFocus={onFocus} color="#888">
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#ECE9D8" }}>
        {/* Toolbar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "4px 8px",
          background: "linear-gradient(180deg, #F6F6F1 0%, #E8E4D8 100%)",
          borderBottom: "1px solid #ACA899",
          fontSize: 11, fontFamily: "'Tahoma', sans-serif",
        }}>
          <NostalImg src="/images/corbeille/folder.png" fallback={"\u{1F4C2}"} size={16} />
          <button
            onClick={() => { saveState('corbeille_locked', true); setLocked(true); }}
            disabled={locked}
            style={{
              padding: "2px 10px",
              background: locked ? "#ECE9D8" : "linear-gradient(180deg, #F8F8F4 0%, #D8D4C8 100%)",
              border: "1px solid #ACA899",
              borderRadius: 3,
              fontSize: 11, fontFamily: "'Tahoma', sans-serif",
              cursor: locked ? "default" : "pointer",
              color: locked ? "#888" : "#000",
            }}
          >{locked ? "Ces souvenirs sont protégés. \u{1F512}" : "Vider la corbeille"}</button>
          <button
            onClick={() => {
              playPaperSound();
              setRestoreMsg("Ce fichier fait partie de ton histoire, il reste ici.");
              setTimeout(() => setRestoreMsg(null), 3000);
            }}
            style={{
              padding: "2px 10px",
              background: "linear-gradient(180deg, #F8F8F4 0%, #D8D4C8 100%)",
              border: "1px solid #ACA899",
              borderRadius: 3,
              fontSize: 11, fontFamily: "'Tahoma', sans-serif",
              cursor: "pointer",
            }}
          >Restaurer</button>
          <span style={{ marginLeft: "auto", color: "#666", fontSize: 10 }}>
            {DELETED_ITEMS.length} éléments
          </span>
        </div>

        {/* Column headers */}
        <div style={{
          display: "flex",
          background: "linear-gradient(180deg, #fff 0%, #E8E4D8 100%)",
          borderBottom: "1px solid #ACA899",
          fontSize: 11, fontFamily: "'Tahoma', sans-serif",
          fontWeight: "bold", color: "#333",
          userSelect: "none",
        }}>
          <div style={{ width: COL_WIDTHS.name, padding: "3px 6px", borderRight: "1px solid #D5D2C6" }}>Nom</div>
          <div style={{ width: COL_WIDTHS.type, padding: "3px 6px", borderRight: "1px solid #D5D2C6" }}>Type</div>
          <div style={{ width: COL_WIDTHS.date, padding: "3px 6px", borderRight: "1px solid #D5D2C6" }}>Date suppression</div>
          <div style={{ width: COL_WIDTHS.size, padding: "3px 6px" }}>Taille</div>
        </div>

        {/* File list */}
        <div style={{ flex: 1, overflow: "auto", background: "#fff" }}>
          {DELETED_ITEMS.map((item, i) => {
            const isHovered = hoveredRow === i;
            return (
              <div
                key={i}
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}
                onDoubleClick={() => { if (HIDDEN_MESSAGES[item.name]) { playPaperSound(); setPreviewMsg({ title: item.name, text: HIDDEN_MESSAGES[item.name] }); } }}
                style={{
                  display: "flex",
                  fontSize: 11, fontFamily: "'Tahoma', sans-serif",
                  background: isHovered ? "#316AC5" : (i % 2 === 0 ? "#fff" : "#F5F5F0"),
                  color: isHovered ? "#fff" : "#000",
                  cursor: "default",
                }}
              >
                <div style={{ width: COL_WIDTHS.name, padding: "3px 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4 }}>
                  <NostalImg src={item.img} fallback={item.icon} size={14} /> {item.name}
                </div>
                <div style={{ width: COL_WIDTHS.type, padding: "3px 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.type}
                </div>
                <div style={{ width: COL_WIDTHS.date, padding: "3px 6px" }}>{item.date}</div>
                <div style={{ width: COL_WIDTHS.size, padding: "3px 6px", textAlign: "right" }}>{item.size}</div>
              </div>
            );
          })}
        </div>
        {/* Restore message */}
        {restoreMsg && (
          <div style={{
            position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
            background: "#FFF8E1", border: "1px solid #FFB74D", borderRadius: 4,
            padding: "8px 16px", fontSize: 11, fontFamily: "'Tahoma', sans-serif",
            color: "#5D4037", boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            animation: "popIn 0.2s ease-out", zIndex: 99,
            whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ fontSize: 14 }}>📦</span> {restoreMsg}
          </div>
        )}
        {/* Preview dialog */}
        {previewMsg && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 999,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.3)",
          }} onClick={() => setPreviewMsg(null)}>
            <div onClick={e => e.stopPropagation()} style={{
              background: "#ECE9D8", border: "2px solid #0055E5",
              borderRadius: "8px 8px 0 0", width: 320,
              boxShadow: "4px 4px 16px rgba(0,0,50,0.4)",
              animation: "popIn 0.2s ease-out",
            }}>
              <div style={{
                background: "linear-gradient(180deg, #0055E5 0%, #0033AA 100%)",
                padding: "4px 8px", color: "#fff", fontWeight: "bold", fontSize: 11,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span>Aperçu — {previewMsg.title}</span>
                <button onClick={() => setPreviewMsg(null)} style={{
                  width: 18, height: 18, border: "1px solid rgba(0,0,0,0.3)", borderRadius: 3,
                  background: "linear-gradient(180deg, #E97 0%, #C44 100%)", color: "#fff",
                  fontWeight: "bold", fontSize: 10, cursor: "pointer", display: "flex",
                  alignItems: "center", justifyContent: "center",
                }}>✕</button>
              </div>
              <div style={{ padding: 16, fontSize: 11, lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "'Tahoma', sans-serif", color: "#333" }}>
                {previewMsg.text}
              </div>
              <div style={{ padding: "8px 16px 12px", textAlign: "center" }}>
                <button onClick={() => setPreviewMsg(null)} style={{
                  padding: "4px 28px", background: "linear-gradient(180deg, #F0F0F0 0%, #D0D0D0 100%)",
                  border: "1px solid #888", borderRadius: 3, cursor: "pointer", fontSize: 11,
                  fontFamily: "'Tahoma', sans-serif",
                }}>OK</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Win>
  );
}
