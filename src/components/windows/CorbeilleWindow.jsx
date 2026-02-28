import { useState } from "react";
import Win from "../Win";
import NostalImg from "../NostalImg";

const DELETED_ITEMS = [
  { icon: "\u{1F4C4}", name: "Exposé_volcans_FINAL_v3.doc", type: "Document Word", date: "12/03/2004", size: "245 Ko", img: "/images/corbeille/doc.png" },
  { icon: "\u{1F3B5}", name: "Crazy_In_Love-Beyonce.mp3", type: "Fichier MP3", date: "08/11/2003", size: "4.2 Mo", img: "/images/corbeille/mp3.png" },
  { icon: "\u{1F4C1}", name: "Nouveau dossier (3)", type: "Dossier", date: "15/06/2005", size: "0 Ko", img: "/images/corbeille/folder.png" },
  { icon: "\u{1F5BC}\uFE0F", name: "photo_classe_CM2.bmp", type: "Image Bitmap", date: "22/09/2003", size: "3.8 Mo", img: "/images/corbeille/image.png" },
  { icon: "\u{1F4BE}", name: "age_of_empires_2_crack.exe", type: "Application", date: "03/01/2004", size: "156 Ko", img: "/images/corbeille/exe.png" },
  { icon: "\u{1F4C4}", name: "Lettre_au_Père_Noël_2004.doc", type: "Document Word", date: "18/12/2004", size: "89 Ko", img: "/images/corbeille/doc.png" },
  { icon: "\u{1F3B5}", name: "Dragostea_Din_Tei-OZONE.wma", type: "Fichier WMA", date: "25/04/2004", size: "3.1 Mo", img: "/images/corbeille/mp3.png" },
  { icon: "\u{1F4C1}", name: "Kazaa Downloads", type: "Dossier", date: "07/08/2003", size: "0 Ko", img: "/images/corbeille/folder.png" },
  { icon: "\u{1F5BC}\uFE0F", name: "wallpaper_dbz_1024x768.jpg", type: "Image JPEG", date: "14/02/2005", size: "512 Ko", img: "/images/corbeille/image.png" },
  { icon: "\u{1F4C4}", name: "Sms_brouillon_pour_Julie.txt", type: "Fichier texte", date: "30/05/2005", size: "1 Ko", img: "/images/corbeille/doc.png" },
];

const COL_WIDTHS = { name: "40%", type: "22%", date: "22%", size: "14%" };

export default function CorbeilleWindow({ onClose, onMinimize, zIndex, onFocus }) {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [locked, setLocked] = useState(false);

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
            onClick={() => setLocked(true)}
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
      </div>
    </Win>
  );
}
