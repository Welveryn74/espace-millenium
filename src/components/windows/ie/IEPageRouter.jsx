import PageWanadoo from "./pages/PageWanadoo";
import PageGoogle from "./pages/PageGoogle";
import PagePerso from "./pages/PagePerso";
import PageEncarta from "./pages/PageEncarta";
import PageJVC from "./pages/PageJVC";
import PageKazaa from "./pages/PageKazaa";
import PageDollz from "./pages/PageDollz";
import PageAboutBlank from "./pages/PageAboutBlank";
import Page404 from "./pages/Page404";
import WaybackFrame from "./WaybackFrame";
import { resolveUrl } from "./hooks/useIENavigation";

export default function IEPageRouter({
  loading, currentUrl, navigateTo, onBSOD,
  searchQuery, setSearchQuery,
  selectedArticle, setSelectedArticle,
  waybackState, waybackUrl, onWaybackLoad,
}) {
  if (loading) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100%", background: "#fff", fontFamily: "Tahoma, sans-serif",
        fontSize: 12, color: "#888",
      }}>
        Chargement...
      </div>
    );
  }

  const resolved = resolveUrl(currentUrl);
  switch (resolved) {
    case "wanadoo.fr":
      return <PageWanadoo navigateTo={navigateTo} />;
    case "google.fr":
      return <PageGoogle navigateTo={navigateTo} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />;
    case "perso.wanadoo.fr/~darkangel":
      return <PagePerso navigateTo={navigateTo} />;
    case "encarta.msn.com":
      return <PageEncarta navigateTo={navigateTo} selectedArticle={selectedArticle} setSelectedArticle={setSelectedArticle} />;
    case "forum.jeuxvideo.com":
      return <PageJVC navigateTo={navigateTo} />;
    case "kazaa.com":
      return <PageKazaa onBSOD={onBSOD} />;
    case "dollz.fr":
      return <PageDollz navigateTo={navigateTo} />;
    case "about:blank":
      return <PageAboutBlank />;
    default:
      // Wayback Machine flow
      if (waybackState === "found" && waybackUrl) {
        return <WaybackFrame url={waybackUrl} onLoad={onWaybackLoad} />;
      }
      if (waybackState === "not_found") {
        return <Page404 url={currentUrl} waybackChecked />;
      }
      // idle or checking — show search screen
      return (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          height: "100%", background: "#fff", fontFamily: "Tahoma, sans-serif",
          fontSize: 12, color: "#888", flexDirection: "column", gap: 12,
        }}>
          <div style={{ fontSize: 32 }}>🌐</div>
          <div>Recherche dans les archives du Web...</div>
          <div style={{ fontSize: 10, color: "#aaa" }}>
            Consultation de la Wayback Machine (~2005)
          </div>
          <div style={{
            width: 200, height: 3, background: "#ddd",
            borderRadius: 2, overflow: "hidden", marginTop: 4,
          }}>
            <div style={{
              height: "100%",
              background: "linear-gradient(90deg, #0055E5, #00AAFF)",
              animation: "loadbar 1.5s ease-in-out infinite",
            }} />
          </div>
        </div>
      );
  }
}
