import { useState, useEffect, useRef } from "react";
import Win from "../../Win";
import { SKYBLOG_POSTS, SKYBLOG_THEMES } from "../../../data/skyblogPosts";
import { ieBtnStyle } from "../../../styles/windowStyles";
import { loadState, saveState, getUsername, logActivity } from "../../../utils/storage";
import SkyblogSidebar from "./SkyblogSidebar";
import SkyblogPost from "./SkyblogPost";
import SkyblogEditor from "./SkyblogEditor";
import { CPU_COMMENTS } from "./SkyblogEditor";

const POSTS_PER_PAGE = 4;

export default function SkyblogWindow({ onClose, onMinimize, zIndex, onFocus, onOpenUrl }) {
  const [likedPosts, setLikedPosts] = useState(() => loadState("skyblog_likes", {}));
  const [comments, setComments] = useState(() => loadState("skyblog_comments", {}));
  const [userPosts, setUserPosts] = useState(() => loadState("skyblog_user_posts", []));
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [themeIdx, setThemeIdx] = useState(() => loadState("skyblog_theme", 0));
  const [filterMonth, setFilterMonth] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [visitors, setVisitors] = useState(() => {
    const v = loadState("skyblog_visitors", 1337);
    const next = v + 1;
    saveState("skyblog_visitors", next);
    return next;
  });
  const contentRef = useRef(null);
  const username = getUsername();
  const theme = SKYBLOG_THEMES[themeIdx];

  // All posts (user + default)
  const allPosts = [...userPosts, ...SKYBLOG_POSTS];

  // Filter by month if active
  const filteredPosts = filterMonth
    ? allPosts.filter(p => p.month === filterMonth)
    : allPosts;

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const currentPosts = filteredPosts.slice(page * POSTS_PER_PAGE, (page + 1) * POSTS_PER_PAGE);

  // Persist
  useEffect(() => { saveState("skyblog_likes", likedPosts); }, [likedPosts]);
  useEffect(() => { saveState("skyblog_comments", comments); }, [comments]);
  useEffect(() => { saveState("skyblog_user_posts", userPosts); }, [userPosts]);
  useEffect(() => { saveState("skyblog_theme", themeIdx); }, [themeIdx]);

  // Scroll to top on page change
  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [page, filterMonth]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  const handleLike = (idx) => {
    setLikedPosts(prev => ({ ...prev, [idx]: (prev[idx] || 0) + 1 }));
  };

  const handleComment = (idx, comment) => {
    setComments(prev => ({ ...prev, [idx]: [...(prev[idx] || []), comment] }));
  };

  const handlePublish = (post) => {
    setUserPosts(prev => [post, ...prev]);
    setShowEditor(false);
    setPage(0);
    setFilterMonth(null);
    logActivity("skyblog_publish_article");

    // CPU auto-comment after 30s
    setTimeout(() => {
      // Easter egg: if article mentions "chambre", special comment
      const isChambrePost = (post.title + post.content).toLowerCase().includes("chambre");
      const cpuComment = {
        pseudo: "xx-princ3ss-du-78-xx",
        text: isChambrePost
          ? "mdr jé vu ta chambre sur ton sky ct tro bi1 !! jtm les posters 💕"
          : CPU_COMMENTS[Math.floor(Math.random() * CPU_COMMENTS.length)],
        date: new Date().toLocaleDateString("fr-FR"),
      };
      setComments(prev => ({ ...prev, ["user_0"]: [...(prev["user_0"] || []), cpuComment] }));
    }, 30000);
  };

  const totalComments = allPosts.reduce((s, p) => s + p.comments, 0)
    + Object.values(comments).reduce((s, arr) => s + arr.length, 0);

  const urlSuffix = filterMonth
    ? `/archives/${filterMonth}`
    : page > 0 ? `/page/${page + 1}` : "";

  return (
    <Win
      title="Internet Explorer — xX-DaRk-PoWeR-2005-Xx.skyblog.com"
      onClose={onClose} onMinimize={onMinimize}
      width={720} height={600} zIndex={zIndex} onFocus={onFocus}
      initialPos={{ x: 90, y: 15 }} color="#0055E5"
    >
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* IE Toolbar */}
        <div style={{ background: "#ECE9D8", borderBottom: "1px solid #bbb", flexShrink: 0 }}>
          <div style={{ padding: "3px 8px", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid #d0d0d0" }}>
            <button style={{ ...ieBtnStyle, opacity: page === 0 ? 0.4 : 1 }} disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Préc.</button>
            <button style={{ ...ieBtnStyle, opacity: page >= totalPages - 1 ? 0.4 : 1 }} disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>→ Suiv.</button>
            <button style={ieBtnStyle} onClick={handleRefresh}>🔄</button>
            <button style={ieBtnStyle} onClick={() => { setPage(0); setFilterMonth(null); setShowEditor(false); }}>🏠</button>
            <div style={{ flex: 1 }} />
            <button
              style={{ ...ieBtnStyle, fontSize: 9 }}
              onClick={() => setShowSettings(!showSettings)}
            >
              🎨 Thème
            </button>
          </div>
          <div style={{ padding: "3px 8px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, color: "#444" }}>Adresse</span>
            <div style={{ flex: 1, background: "#fff", border: "1px solid #7A96DF", borderRadius: 2, padding: "3px 8px", fontSize: 11, color: "#333", display: "flex", alignItems: "center", gap: 4 }}>
              <span>🔒</span>http://xX-DaRk-PoWeR-2005-Xx.skyblog.com{urlSuffix}
            </div>
            <span style={{ fontSize: 11, color: "#00C", cursor: "pointer" }}>⭐ Favoris</span>
          </div>
          {/* Theme picker */}
          {showSettings && (
            <div style={{
              padding: "6px 8px", background: "#F5F0E0", borderTop: "1px solid #d0d0d0",
              display: "flex", gap: 6, alignItems: "center",
            }}>
              <span style={{ fontSize: 10, color: "#555" }}>Thème :</span>
              {SKYBLOG_THEMES.map((t, i) => (
                <button key={t.id} onClick={() => { setThemeIdx(i); setShowSettings(false); }} style={{
                  padding: "3px 10px", borderRadius: 3, cursor: "pointer", fontSize: 9,
                  background: i === themeIdx ? t.accent + "30" : "#fff",
                  border: i === themeIdx ? `2px solid ${t.accent}` : "1px solid #ccc",
                  color: t.accent, fontWeight: i === themeIdx ? "bold" : "normal",
                }}>
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main content area */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Sidebar */}
          <SkyblogSidebar
            username={username}
            visitors={visitors}
            totalPosts={allPosts.length}
            totalComments={totalComments}
            theme={theme}
            onFilterMonth={setFilterMonth}
            activeMonth={filterMonth}
            onOpenEditor={() => { setShowEditor(true); setFilterMonth(null); }}
          />

          {/* Blog content */}
          <div ref={contentRef} style={{
            flex: 1, overflowY: "auto",
            background: refreshing ? "#fff" : theme.bg,
            transition: "background 0.15s",
          }}>
            {refreshing ? null : showEditor ? (
              <SkyblogEditor
                theme={theme}
                onPublish={handlePublish}
                onCancel={() => setShowEditor(false)}
              />
            ) : (
              <>
                {/* Blog header */}
                <div style={{
                  textAlign: "center", padding: "20px 16px 14px",
                  backgroundImage: theme.headerBg,
                }}>
                  <div style={{
                    fontFamily: "'Comic Sans MS', cursive", fontSize: 24, fontWeight: "bold",
                    background: `linear-gradient(90deg, ${theme.accent}, #0FF, #FF0, ${theme.accent}, #0FF)`,
                    backgroundSize: "200% 100%",
                    animation: "gradient 3s linear infinite",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    marginBottom: 6,
                  }}>
                    ~*~ xX-{username}-2005-Xx ~*~
                  </div>
                  <div style={{
                    color: theme.accent, fontSize: 11,
                    fontFamily: "'Comic Sans MS', cursive", letterSpacing: 1,
                  }}>
                    ★ LaCh3z VoS cOmS ★ +5 pOuR tOuT lE mOnDe ★
                  </div>
                  {/* Marquee */}
                  <div style={{ overflow: "hidden", marginTop: 6, height: 14 }}>
                    <div style={{
                      animation: "marquee 14s linear infinite", whiteSpace: "nowrap",
                      color: theme.accent, fontSize: 10, fontFamily: "'Comic Sans MS', cursive",
                    }}>
                      ★ BiEnVeNuE sUr MoN sKy !! LâChEz VoS cOmS eT +5 !! MeRcI a ToUs MeS aMiS !! ★ JaDORe le ROCK !! EvAnEsCeNcE, LiNkIn PaRk, GrEeN dAy !! ★
                    </div>
                  </div>
                  {filterMonth && (
                    <div style={{
                      marginTop: 6, fontSize: 10, color: theme.text, opacity: 0.6,
                    }}>
                      📅 Archives : {filterMonth}
                      <span onClick={() => setFilterMonth(null)} style={{
                        marginLeft: 8, color: theme.accent, cursor: "pointer", textDecoration: "underline",
                      }}>
                        Voir tout
                      </span>
                    </div>
                  )}
                </div>

                {/* Posts */}
                <div style={{ padding: "0 14px 12px" }}>
                  {currentPosts.length === 0 ? (
                    <div style={{
                      textAlign: "center", padding: 30,
                      color: theme.text, opacity: 0.4,
                      fontFamily: "'Comic Sans MS', cursive", fontSize: 12,
                    }}>
                      Aucun article pour cette période...
                    </div>
                  ) : (
                    currentPosts.map((post, i) => {
                      const globalIdx = page * POSTS_PER_PAGE + i;
                      const commentKey = post.isUserPost ? `user_${i}` : globalIdx;
                      return (
                        <SkyblogPost
                          key={`${page}-${i}`}
                          post={post}
                          index={commentKey}
                          theme={theme}
                          likeCount={likedPosts[commentKey] || 0}
                          postComments={comments[commentKey] || []}
                          onLike={handleLike}
                          onComment={handleComment}
                          onOpenUrl={onOpenUrl}
                          username={username}
                        />
                      );
                    })
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ display: "flex", justifyContent: "center", gap: 4, paddingBottom: 14 }}>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button key={i} onClick={() => setPage(i)} style={{
                        width: 26, height: 26, borderRadius: 4,
                        border: `1px solid ${theme.accent}40`,
                        background: i === page ? `${theme.accent}30` : "rgba(0,0,0,0.4)",
                        color: i === page ? theme.accent : "#888",
                        cursor: "pointer",
                        fontFamily: "'Comic Sans MS', cursive", fontSize: 11,
                        fontWeight: i === page ? "bold" : "normal",
                        transition: "all 0.15s",
                      }}>
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes marquee {
          from { transform: translateX(100%); }
          to { transform: translateX(-100%); }
        }
        @keyframes slideUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </Win>
  );
}
