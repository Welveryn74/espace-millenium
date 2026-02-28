import MSNWindow from "../components/windows/MSNWindow";
import TVWindow from "../components/windows/TVWindow";
import MP3Window from "../components/windows/MP3Window";
import SkyblogWindow from "../components/windows/SkyblogWindow";
import DressingWindow from "../components/windows/DressingWindow";
import CartableWindow from "../components/windows/CartableWindow";
import SalleJeuxWindow from "../components/windows/SalleJeuxWindow";
import ChambreWindow from "../components/windows/ChambreWindow";
import DemineurWindow from "../components/windows/DemineurWindow";
import PaintWindow from "../components/windows/PaintWindow";
import CorbeilleWindow from "../components/windows/CorbeilleWindow";

export const WINDOW_REGISTRY = {
  msn:      { component: MSNWindow, needsDesktopActions: true },
  tv:       { component: TVWindow },
  mp3:      { component: MP3Window },
  skyblog:  { component: SkyblogWindow },
  dressing: { component: DressingWindow },
  cartable: { component: CartableWindow },
  salleJeux: { component: SalleJeuxWindow },
  chambre:  { component: ChambreWindow },
  demineur: { component: DemineurWindow },
  paint:    { component: PaintWindow },
  poubelle: { component: CorbeilleWindow },
};
