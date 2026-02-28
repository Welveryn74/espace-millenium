import { useState, useEffect, useRef } from "react";
import Win from "../Win";
import NostalImg from "../NostalImg";
import { SKYBLOG_POSTS } from "../../data/skyblogPosts";
import { ieBtnStyle } from "../../styles/windowStyles";
import { loadState, saveState } from "../../utils/storage";

const POSTS_PER_PAGE = 3;

export default function SkyblogWindow({ onClose, onMinimize, zIndex, onFocus }) {
  const [likedPosts, setLikedPosts] = useState({});
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [visitors, setVisitors] = useState(() => {
    const v = loadState("skyblog_visitors", 1337);
    const next = v + 1;
    saveState("skyblog_visitors", next);
    return next;
  });
  const contentRef = useRef(null);

  const totalPages = Math.ceil(SKYBLOG_POSTS.length / POSTS_PER_PAGE);
  const currentPosts = SKYBLOG_POSTS.slice(page * POSTS_PER_PAGE, (page + 1) * POSTS_PER_PAGE);

  // Scroll to top on page change
  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [page]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const urlSuffix = page > 0 ? `/page/${page + 1}` : "";

  return (
    <Win title="Internet Explorer — xX-DaRk-PoWeR-2005-Xx.skyblog.com" onClose={onClose} onMinimize={onMinimize} width={540} height={500} zIndex={zIndex} onFocus={onFocus} initialPos={{ x: 90, y: 15 }} color="#0055E5">
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* IE Toolbar */}
        <div style={{ background: "#ECE9D8", borderBottom: "1px solid #bbb" }}>
          <div style={{ padding: "3px 8px", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid #d0d0d0" }}>
            <button style={{ ...ieBtnStyle, opacity: page === 0 ? 0.4 : 1 }} disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Préc.</button>
            <button style={{ ...ieBtnStyle, opacity: page >= totalPages - 1 ? 0.4 : 1 }} disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>→ Suiv.</button>
            <button style={ieBtnStyle} onClick={handleRefresh}>🔄</button>
            <button style={ieBtnStyle} onClick={() => setPage(0)}>🏠</button>
          </div>
          <div style={{ padding: "3px 8px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, color: "#444" }}>Adresse</span>
            <div style={{ flex: 1, background: "#fff", border: "1px solid #7A96DF", borderRadius: 2, padding: "3px 8px", fontSize: 11, color: "#333", display: "flex", alignItems: "center", gap: 4 }}>
              <span>🔒</span>http://xX-DaRk-PoWeR-2005-Xx.skyblog.com{urlSuffix}
            </div>
            <span style={{ fontSize: 11, color: "#00C", cursor: "pointer" }}>⭐ Favoris</span>
          </div>
        </div>

        {/* Blog content */}
        <div ref={contentRef} style={{
          flex: 1, overflowY: "auto",
          background: refreshing ? "#fff" : "linear-gradient(180deg, #0a0014 0%, #1a0033 30%, #0a0014 100%)",
          transition: "background 0.15s",
        }}>
          {refreshing ? null : (
            <>
              {/* Blog header */}
              <div style={{
                textAlign: "center", padding: "24px 16px 18px",
                backgroundImage: "radial-gradient(ellipse at top, rgba(200,0,255,0.15), transparent 70%)",
              }}>
                <div style={{
                  fontFamily: "'Comic Sans MS', cursive", fontSize: 24, fontWeight: "bold",
                  background: "linear-gradient(90deg, #F0F, #0FF, #FF0, #F0F, #0FF)",
                  backgroundSize: "200% 100%",
                  animation: "gradient 3s linear infinite",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  marginBottom: 8,
                }}>~*~ xX DaRk PoWeR 2005 Xx ~*~</div>
                <div style={{ color: "#C0F", fontSize: 12, fontFamily: "'Comic Sans MS', cursive", letterSpacing: 1 }}>
                  ★ LaCh3z VoS cOmS ★ +5 pOuR tOuT lE mOnDe ★
                </div>
                <div style={{ color: "#666", fontSize: 10, marginTop: 6 }}>
                  Visiteurs : {visitors.toLocaleString("fr-FR")} | Articles : {SKYBLOG_POSTS.length} | Commentaires : {SKYBLOG_POSTS.reduce((s, p) => s + p.comments, 0)}
                </div>
                {/* Marquee */}
                <div style={{ overflow: "hidden", marginTop: 8, height: 16 }}>
                  <div style={{ animation: "marquee 12s linear infinite", whiteSpace: "nowrap", color: "#F0F", fontSize: 11, fontFamily: "'Comic Sans MS', cursive" }}>
                    ★ BiEnVeNuE sUr MoN sKy !! LâChEz VoS cOmS eT +5 !! MeRcI a ToUs MeS aMiS !! ★ JaDORe le ROCK !! EvAnEsCeNcE, LiNkIn PaRk, GrEeN dAy !! ★
                  </div>
                </div>
              </div>

              {/* Posts */}
              <div style={{ padding: "0 16px 12px" }}>
                {currentPosts.map((post, i) => (
                  <div key={page * POSTS_PER_PAGE + i} style={{
                    background: "rgba(0,0,0,0.5)", border: "1px solid rgba(150,0,255,0.3)",
                    borderRadius: 6, padding: 16, marginBottom: 14,
                    boxShadow: "0 2px 8px rgba(100,0,200,0.1)",
                    animation: `slideUp 0.3s ease-out ${i * 0.1}s both`,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <div>
                        <div style={{ fontFamily: "'Comic Sans MS', cursive", fontSize: 16, color: "#F0F", fontWeight: "bold" }}>{post.title}</div>
                        <div style={{ color: "#888", fontSize: 10, marginTop: 2 }}>Posté le {post.date} à 18h42</div>
                      </div>
                      <NostalImg src={post.img} fallback={post.emoji} size={80} style={{ borderRadius: 6 }} />
                    </div>
                    <div style={{
                      color: "#ddd", fontSize: 12, lineHeight: 1.7,
                      fontFamily: "'Comic Sans MS', cursive", marginBottom: 10, whiteSpace: "pre-line",
                    }}>{post.content}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(150,0,255,0.2)", paddingTop: 8 }}>
                      <span style={{ color: "#0CF", fontSize: 11, cursor: "pointer" }}>💬 {post.comments} commentaires</span>
                      <span
                        onClick={() => {
                          const idx = page * POSTS_PER_PAGE + i;
                          setLikedPosts(prev => ({ ...prev, [idx]: !prev[idx] }));
                        }}
                        style={{ fontSize: 12, cursor: "pointer", color: likedPosts[page * POSTS_PER_PAGE + i] ? "#F00" : "#888", transition: "all 0.2s" }}
                      >
                        {likedPosts[page * POSTS_PER_PAGE + i] ? "❤️ Kiffé !" : "♡ Kiff cet article"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div style={{ display: "flex", justifyContent: "center", gap: 6, paddingBottom: 16 }}>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button key={i} onClick={() => setPage(i)} style={{
                    width: 28, height: 28, borderRadius: 4, border: "1px solid rgba(150,0,255,0.4)",
                    background: i === page ? "rgba(200,0,255,0.3)" : "rgba(0,0,0,0.4)",
                    color: i === page ? "#F0F" : "#888", cursor: "pointer",
                    fontFamily: "'Comic Sans MS', cursive", fontSize: 12, fontWeight: i === page ? "bold" : "normal",
                    transition: "all 0.15s",
                  }}>{i + 1}</button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Win>
  );
}
