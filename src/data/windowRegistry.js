import MSNWindow from "../components/windows/MSNWindow";
import TVWindow from "../components/windows/TVWindow";
import MP3Window from "../components/windows/MP3Window";
import SkyblogWindow from "../components/windows/skyblog/SkyblogWindow";

import CartableWindow from "../components/windows/cartable/CartableWindow";
import SalleJeuxWindow from "../components/windows/salleJeux/SalleJeuxWindow";
import ChambreWindow from "../components/windows/chambre/ChambreWindow";
import DemineurWindow from "../components/windows/DemineurWindow";
import PaintWindow from "../components/windows/PaintWindow";
import CorbeilleWindow from "../components/windows/CorbeilleWindow";
import CaramailWindow from "../components/windows/CaramailWindow";
import IEWindow from "../components/windows/ie/IEWindow";
import DehorsWindow from "../components/windows/dehors/DehorsWindow";
import MondeReelWindow from "../components/windows/mondeReel/MondeReelWindow";

export const WINDOW_REGISTRY = {
  msn:      { component: MSNWindow, needsDesktopActions: true },
  tv:       { component: TVWindow },
  mp3:      { component: MP3Window },
  skyblog:  { component: SkyblogWindow },

  cartable: { component: CartableWindow },
  salleJeux: { component: SalleJeuxWindow },
  chambre:  { component: ChambreWindow },
  demineur: { component: DemineurWindow },
  paint:    { component: PaintWindow },
  poubelle: { component: CorbeilleWindow },
  caramail: { component: CaramailWindow },
  ie:       { component: IEWindow },
  dehors:   { component: DehorsWindow },
  mondeReel: { component: MondeReelWindow },
};
