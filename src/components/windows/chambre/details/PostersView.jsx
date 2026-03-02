import { useState } from "react";
import { viewTitle, viewSubtitle, viewFlavor, C } from "../../../../styles/chambreStyles";
import { loadState, saveState } from "../../../../utils/storage";

const POSTERS = [
  { id: "dbz", name: "Dragon Ball Z", category: "anime", color: "#FF9800", emoji: "⚡" },
  { id: "naruto", name: "Naruto", category: "anime", color: "#FF5722", emoji: "🍥" },
  { id: "onepiece", name: "One Piece", category: "anime", color: "#F44336", emoji: "🏴‍☠️" },
  { id: "harrypotter", name: "Harry Potter", category: "film", color: "#7B1FA2", emoji: "🧙" },
  { id: "lotr", name: "Le Seigneur des Anneaux", category: "film", color: "#4E342E", emoji: "💍" },
  { id: "matrix", name: "Matrix", category: "film", color: "#4CAF50", emoji: "🕶️" },
  { id: "starwars", name: "Star Wars", category: "film", color: "#1565C0", emoji: "⭐" },
  { id: "spiderman", name: "Spider-Man", category: "film", color: "#D32F2F", emoji: "🕷️" },
  { id: "eminem", name: "Eminem", category: "musique", color: "#9E9E9E", emoji: "🎤" },
  { id: "linkinpark", name: "Linkin Park", category: "musique", color: "#212121", emoji: "🎸" },
  { id: "greenday", name: "Green Day", category: "musique", color: "#4CAF50", emoji: "🤘" },
  { id: "zidane", name: "Zidane", category: "sport", color: "#1976D2", emoji: "⚽" },
  { id: "tony", name: "Tony Hawk", category: "sport", color: "#795548", emoji: "🛹" },
  { id: "pokemonPoster", name: "Pokémon", category: "anime", color: "#FFD700", emoji: "⚡" },
  { id: "yugiohPoster", name: "Yu-Gi-Oh!", category: "anime", color: "#6D4C41", emoji: "🃏" },
];

const SLOTS = 6;
const ALL_ANIME = POSTERS.filter((p) => p.category === "anime").map((p) => p.id);

export default function PostersView() {
  const [wall, setWall] = useState(() => loadState("posters_wall", Array(SLOTS).fill(null)));
  const [editingSlot, setEditingSlot] = useState(null);
  const [allAnime, setAllAnime] = useState(false);

  const setPoster = (slotIdx, posterId) => {
    const updated = [...wall];
    updated[slotIdx] = posterId;
    setWall(updated);
    saveState("posters_wall", updated);
    setEditingSlot(null);
    // Check easter egg
    const filled = updated.filter(Boolean);
    if (filled.length === SLOTS && filled.every((id) => ALL_ANIME.includes(id))) {
      setAllAnime(true);
    } else {
      setAllAnime(false);
    }
  };

  const removePoster = (slotIdx) => {
    const updated = [...wall];
    updated[slotIdx] = null;
    setWall(updated);
    saveState("posters_wall", updated);
    setAllAnime(false);
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={viewTitle}>Posters Muraux</div>
        <div style={viewSubtitle}>
          6 emplacements sur le mur. Personnalise ta chambre comme en 2004.
        </div>
      </div>

      {/* Easter egg */}
      {allAnime && (
        <div style={{
          textAlign: "center", padding: "8px 12px", marginBottom: 12,
          borderRadius: 6, background: "rgba(255,152,0,0.15)",
          border: "1px solid rgba(255,152,0,0.3)",
          animation: "fadeIn 0.5s ease-out",
        }}>
          <div style={{ fontSize: 12, color: "#FF9800", fontWeight: "bold" }}>
            OTAKU DÉTECTÉ !
          </div>
          <div style={{ fontSize: 10, color: C.textDim }}>
            Tous tes posters sont des anime. Maman est pas contente, mais toi t'es fier.
          </div>
        </div>
      )}

      {/* Mur de posters */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8,
        marginBottom: 16,
      }}>
        {wall.map((posterId, i) => {
          const poster = posterId ? POSTERS.find((p) => p.id === posterId) : null;
          return (
            <div key={i} style={{ position: "relative" }}>
              <div
                onClick={() => setEditingSlot(editingSlot === i ? null : i)}
                style={{
                  height: 80, borderRadius: 6, cursor: "pointer",
                  background: poster
                    ? `linear-gradient(135deg, ${poster.color}30, ${poster.color}15)`
                    : "rgba(255,255,255,0.03)",
                  border: editingSlot === i
                    ? `2px solid ${C.primary}`
                    : poster
                      ? `1px solid ${poster.color}40`
                      : `1px dashed ${C.border}`,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }}
              >
                {poster ? (
                  <>
                    <div style={{ fontSize: 24 }}>{poster.emoji}</div>
                    <div style={{ fontSize: 9, color: poster.color, fontWeight: "bold", marginTop: 2 }}>
                      {poster.name}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 18, opacity: 0.2 }}>+</div>
                    <div style={{ fontSize: 8, color: C.textMuted }}>Vide</div>
                  </>
                )}
              </div>
              {poster && (
                <div
                  onClick={() => removePoster(i)}
                  style={{
                    position: "absolute", top: 2, right: 4,
                    fontSize: 10, color: C.textMuted, cursor: "pointer",
                    opacity: 0.5,
                  }}
                  title="Enlever"
                >
                  x
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Poster picker */}
      {editingSlot !== null && (
        <div style={{
          padding: 12, borderRadius: 8, marginBottom: 12,
          background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`,
          animation: "fadeIn 0.2s ease-out",
        }}>
          <div style={{ color: C.textDim, fontSize: 10, marginBottom: 8, textAlign: "center" }}>
            Choisis un poster pour l'emplacement {editingSlot + 1} :
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4 }}>
            {POSTERS.map((p) => {
              const alreadyUsed = wall.includes(p.id) && wall.indexOf(p.id) !== editingSlot;
              return (
                <div
                  key={p.id}
                  onClick={() => !alreadyUsed && setPoster(editingSlot, p.id)}
                  style={{
                    padding: 4, borderRadius: 4, cursor: alreadyUsed ? "default" : "pointer",
                    background: `${p.color}15`, border: `1px solid ${p.color}30`,
                    textAlign: "center", opacity: alreadyUsed ? 0.3 : 1,
                    transition: "all 0.15s",
                  }}
                  title={alreadyUsed ? "Déjà sur le mur" : p.name}
                >
                  <div style={{ fontSize: 16 }}>{p.emoji}</div>
                  <div style={{ fontSize: 7, color: p.color, fontWeight: "bold" }}>{p.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={viewFlavor}>
        La Patafix qui arrache la peinture. Maman va être contente.
      </div>
    </div>
  );
}
