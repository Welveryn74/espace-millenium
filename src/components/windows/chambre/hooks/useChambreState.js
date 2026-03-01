import { useState, useCallback, useEffect } from "react";
import { COUETTES } from "../../../../data/chambreItems";
import { startChambreAmbient, stopChambreAmbient, setChambreNightMode, playLampClick } from "../../../../utils/chambreSounds";
import useTamagotchi from "./useTamagotchi";
import usePanini from "./usePanini";
import useSousLeLit from "./useSousLeLit";
import useJournal from "./useJournal";
import useRadio from "./useRadio";

export default function useChambreState() {
  const [activeItem, setActiveItem] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [couette, setCouette] = useState("harryPotter");
  const [lampOn, setLampOn] = useState(true);
  const [proutAnim, setProutAnim] = useState(false);
  const [doorPhase, setDoorPhase] = useState("closed");

  const tamagotchi = useTamagotchi();
  const panini = usePanini(activeItem);
  const sousLeLit = useSousLeLit();
  const journal = useJournal();
  const radio = useRadio();

  // Chambre ambient sounds
  useEffect(() => {
    startChambreAmbient();
    return () => stopChambreAmbient();
  }, []);

  useEffect(() => {
    setChambreNightMode(!lampOn);
  }, [lampOn]);

  const toggleLamp = useCallback(() => {
    playLampClick();
    setLampOn(l => !l);
  }, []);

  // Pate a prout sound
  const playProut = useCallback(() => {
    setProutAnim(true);
    setTimeout(() => setProutAnim(false), 600);
    if (localStorage.getItem('em_muted') === 'true') return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (_) { /* silent fallback */ }
  }, []);

  const goBack = () => setActiveItem(null);
  const currentCouette = COUETTES.find((c) => c.id === couette);

  return {
    activeItem, setActiveItem,
    hoveredItem, setHoveredItem,
    couette, setCouette, currentCouette,
    lampOn, toggleLamp,
    proutAnim, playProut,
    doorPhase, setDoorPhase,
    goBack,
    tamagotchi,
    panini,
    sousLeLit,
    journal,
    radio,
  };
}
