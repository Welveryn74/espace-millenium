import CouetteSelector from "./details/CouetteSelector";
import TamagotchiWidget from "./details/TamagotchiWidget";
import PaniniAlbum from "./details/PaniniAlbum";
import PateAProut from "./details/PateAProut";
import BillesView from "./details/BillesView";
import LegoGallery from "./details/LegoGallery";
import PeluchesView from "./details/PeluchesView";
import ScoubidousView from "./details/ScoubidousView";
import JeuxSocieteView from "./details/JeuxSocieteView";
import ReveilView from "./details/ReveilView";
import SousLeLitView from "./details/SousLeLitView";
import JournalView from "./details/JournalView";
import RadioView from "./details/RadioView";
import BeybladeArena from "../BeybladeArena";

const backBtnStyle = {
  background: "none",
  border: "1px solid rgba(139,107,174,0.5)",
  color: "#8B6BAE",
  padding: "4px 12px",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 11,
  fontWeight: "bold",
  fontFamily: "'Tahoma', sans-serif",
};

export default function ChambreDetailRouter({ activeItem, goBack, state }) {
  const { couette, setCouette, proutAnim, playProut, tamagotchi, panini, sousLeLit, journal, radio } = state;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "8px 12px", borderBottom: "1px solid rgba(139,107,174,0.3)" }}>
        <button onClick={goBack} style={backBtnStyle}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(139,107,174,0.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          ← Retour
        </button>
      </div>
      <div key={activeItem} style={{ flex: 1, overflowY: "auto", padding: 16, animation: "slideUp 0.3s ease-out" }}>
        {activeItem === "couette" && (
          <CouetteSelector couette={couette} setCouette={setCouette} />
        )}
        {activeItem === "tamagotchi" && (
          <TamagotchiWidget
            tama={tamagotchi.tama}
            tamaDo={tamagotchi.tamaDo}
            tamaMood={tamagotchi.tamaMood}
            tamaAction={tamagotchi.tamaAction}
            neglected={tamagotchi.tamaNeglected}
            onReset={tamagotchi.tamaReset}
            tamaTotal={tamagotchi.tamaTotal}
            TAMA_MAX={tamagotchi.TAMA_MAX}
          />
        )}
        {activeItem === "panini" && (
          <PaniniAlbum
            page={panini.paniniPage}
            setPage={panini.setPaniniPage}
            collected={panini.collectedStickers}
            newStickers={panini.newStickers}
          />
        )}
        {activeItem === "pateAProut" && (
          <PateAProut playing={proutAnim} onPress={playProut} />
        )}
        {activeItem === "beyblade" && <BeybladeArena />}
        {activeItem === "billes" && <BillesView />}
        {activeItem === "lego" && <LegoGallery />}
        {activeItem === "peluches" && <PeluchesView />}
        {activeItem === "scoubidous" && <ScoubidousView />}
        {activeItem === "jeuxSociete" && <JeuxSocieteView />}
        {activeItem === "reveil" && <ReveilView />}
        {activeItem === "sousLelit" && (
          <SousLeLitView
            found={sousLeLit.sousLeLitFound}
            searching={sousLeLit.sousLeLitSearching}
            lastFound={sousLeLit.sousLeLitLast}
            doSearch={sousLeLit.doSearch}
          />
        )}
        {activeItem === "journal" && (
          <JournalView
            entries={journal.journalEntries}
            setEntries={() => {}}
            text={journal.journalText}
            setText={journal.setJournalText}
            addEntry={journal.addEntry}
          />
        )}
        {activeItem === "radio" && (
          <RadioView
            radioOn={radio.radioOn}
            toggleRadio={radio.toggleRadio}
            station={radio.radioStation}
            changeStation={radio.changeStation}
          />
        )}
      </div>
    </div>
  );
}
