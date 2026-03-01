import { useState, useEffect, useRef } from "react";
import Win from "../Win";
import NostalImg from "../NostalImg";
import { SKYBLOG_POSTS } from "../../data/skyblogPosts";
import { ieBtnStyle } from "../../styles/windowStyles";
import { loadState, saveState, getUsername } from "../../utils/storage";
import { playClick } from "../../utils/uiSounds";

const POSTS_PER_PAGE = 3;

function parseSkyblogLinks(text, onOpenUrl) {
  if (!onOpenUrl || !text) return text;
  const parts = text.split(/([\w-]+\.skyblog\.com)/g);
  return parts.map((part, i) => {
    if (/^[\w-]+\.skyblog\.com$/.test(part)) {
      return (
        <span
          key={i}
          onClick={(e) => { e.stopPropagation(); onOpenUrl(part); }}
          style={{ color: "#0CF", textDecoration: "underline", cursor: "pointer" }}
        >
          {part}
        </span>
      );
    }
    return part;
  });
}

export default function SkyblogWindow({ onClose, onMinimize, zIndex, onFocus, onOpenUrl }) {
  const [likedPosts, setLikedPosts] = useState(() => loadState('skyblog_likes', {}));
  const [comments, setComments] = useState(() => loadState('skyblog_comments', {}));
  const [commentText, setCommentText] = useState("");
  const [commentingOn, setCommentingOn] = useState(null);
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [visitors, setVisitors] = useState(() => {
    const v = loadState("skyblog_visitors", 1337);
    const next = v + 1;
    saveState("skyblog_visitors", next);
    return next;
  });
  const contentRef = useRef(null);
  const username = getUsername();

  const totalPages = Math.ceil(SKYBLOG_POSTS.length / POSTS_PER_PAGE);
  const currentPosts = SKYBLOG_POSTS.slice(page * POSTS_PER_PAGE, (page + 1) * POSTS_PER_PAGE);

  // Persist likes
  useEffect(() => {
    saveState('skyblog_likes', likedPosts);
  }, [likedPosts]);

  // Persist comments
  useEffect(() => {
    saveState('skyblog_comments', comments);
  }, [comments]);

  // Scroll to top on page change
  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [page]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleLike = (idx) => {
    playClick();
    setLikedPosts(prev => {
      const current = prev[idx] || 0;
      return { ...prev, [idx]: current + 1 };
    });
  };

  const handleComment = (idx) => {
    if (!commentText.trim()) return;
    playClick();
    const newComment = {
      pseudo: username,
      text: commentText.trim(),
      date: new Date().toLocaleDateString('fr-FR'),
    };
    setComments(prev => ({
      ...prev,
      [idx]: [...(prev[idx] || []), newComment],
    }));
    setCommentText("");
    setCommentingOn(null);
  };

  const totalComments = SKYBLOG_POSTS.reduce((s, p) => s + p.comments, 0)
    + Object.values(comments).reduce((s, arr) => s + arr.length, 0);

  const urlSuffix = page > 0 ? `/page/${page + 1}` : "";

  return (
    <Win title="Internet Explorer — xX-DaRk-PoWeR-2005-Xx.skyblog.com" onClose={onClose} onMinimize={onMinimize} width={680} height={580} zIndex={zIndex} onFocus={onFocus} initialPos={{ x: 90, y: 15 }} color="#0055E5">
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
                  fontFamily: "'Comic Sans MS', cursive", fontSize: 28, fontWeight: "bold",
                  background: "linear-gradient(90deg, #F0F, #0FF, #FF0, #F0F, #0FF)",
                  backgroundSize: "200% 100%",
                  animation: "gradient 3s linear infinite",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  marginBottom: 8,
                }}>~*~ xX-{username}-2005-Xx ~*~</div>
                <div style={{ color: "#C0F", fontSize: 12, fontFamily: "'Comic Sans MS', cursive", letterSpacing: 1 }}>
                  ★ LaCh3z VoS cOmS ★ +5 pOuR tOuT lE mOnDe ★
                </div>
                <div style={{ color: "#666", fontSize: 10, marginTop: 6 }}>
                  Visiteurs : {visitors.toLocaleString("fr-FR")} | Articles : {SKYBLOG_POSTS.length} | Commentaires : {totalComments}
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
                {currentPosts.map((post, i) => {
                  const idx = page * POSTS_PER_PAGE + i;
                  const likeCount = likedPosts[idx] || 0;
                  const postComments = comments[idx] || [];
                  return (
                    <div key={idx} style={{
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
                        <NostalImg src={post.img} fallback={post.emoji} size={100} style={{ borderRadius: 6 }} />
                      </div>
                      <div style={{
                        color: "#ddd", fontSize: 12, lineHeight: 1.7,
                        fontFamily: "'Comic Sans MS', cursive", marginBottom: 10, whiteSpace: "pre-line",
                      }}>{parseSkyblogLinks(post.content, onOpenUrl)}</div>

                      {/* Like & comment bar */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(150,0,255,0.2)", paddingTop: 8 }}>
                        <span
                          onClick={() => setCommentingOn(commentingOn === idx ? null : idx)}
                          style={{ color: "#0CF", fontSize: 11, cursor: "pointer" }}
                        >
                          💬 {post.comments + postComments.length} commentaires
                        </span>
                        <span
                          onClick={() => handleLike(idx)}
                          style={{ fontSize: 12, cursor: "pointer", color: likeCount > 0 ? "#F00" : "#888", transition: "all 0.2s" }}
                        >
                          {likeCount > 0 ? `❤️ Kiffé ! (${likeCount})` : "♡ Kiff cet article"}
                        </span>
                      </div>

                      {/* User comments */}
                      {postComments.length > 0 && (
                        <div style={{ marginTop: 8, borderTop: "1px solid rgba(150,0,255,0.15)", paddingTop: 8 }}>
                          {postComments.map((c, ci) => (
                            <div key={ci} style={{
                              background: "rgba(200,0,255,0.08)", borderRadius: 4, padding: "6px 10px", marginBottom: 4,
                              fontSize: 11, fontFamily: "'Comic Sans MS', cursive",
                            }}>
                              <span style={{ color: "#F0F", fontWeight: "bold" }}>{c.pseudo}</span>
                              <span style={{ color: "#666", fontSize: 9, marginLeft: 6 }}>{c.date}</span>
                              <div style={{ color: "#ccc", marginTop: 2 }}>{c.text}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Comment input */}
                      {commentingOn === idx && (
                        <div style={{
                          marginTop: 8, padding: 8, background: "rgba(200,0,255,0.06)",
                          borderRadius: 4, animation: "fadeIn 0.2s ease-out",
                        }}>
                          <div style={{ fontSize: 10, color: "#C0F", marginBottom: 4, fontFamily: "'Comic Sans MS', cursive" }}>
                            Pseudo : <strong>{username}</strong>
                          </div>
                          <textarea
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            placeholder="Lâche ton com' ici..."
                            style={{
                              width: "100%", height: 48, resize: "none",
                              background: "rgba(0,0,0,0.4)", color: "#ddd",
                              border: "1px solid rgba(200,0,255,0.3)", borderRadius: 3,
                              padding: 6, fontSize: 11, fontFamily: "'Comic Sans MS', cursive",
                              boxSizing: "border-box",
                            }}
                          />
                          <button
                            onClick={() => handleComment(idx)}
                            disabled={!commentText.trim()}
                            style={{
                              marginTop: 4, padding: "4px 14px",
                              background: commentText.trim() ? "rgba(200,0,255,0.3)" : "rgba(100,100,100,0.2)",
                              color: commentText.trim() ? "#F0F" : "#666",
                              border: "1px solid rgba(200,0,255,0.4)", borderRadius: 3,
                              cursor: commentText.trim() ? "pointer" : "default",
                              fontSize: 11, fontFamily: "'Comic Sans MS', cursive", fontWeight: "bold",
                            }}
                          >Lâcher un com'</button>
                        </div>
                      )}
                    </div>
                  );
                })}
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
