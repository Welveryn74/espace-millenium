import { useState, useEffect } from "react";
import { loadState, saveState } from "../../../../utils/storage";
import { startRadio, stopRadio } from "../../../../utils/radioMelodies";

export default function useRadio() {
  const [radioOn, setRadioOn] = useState(false);
  const [radioStation, setRadioStation] = useState(() => loadState('radio_station', 'nrj'));

  useEffect(() => {
    return () => stopRadio();
  }, []);

  const toggleRadio = () => {
    if (radioOn) {
      stopRadio();
      setRadioOn(false);
    } else {
      startRadio(radioStation);
      setRadioOn(true);
    }
  };

  const changeStation = (id) => {
    setRadioStation(id);
    saveState('radio_station', id);
    if (radioOn) {
      startRadio(id);
    }
  };

  return { radioOn, radioStation, toggleRadio, changeStation };
}
