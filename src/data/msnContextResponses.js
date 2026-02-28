/**
 * Réponses MSN contextuelles — le bot sait ce que tu fais !
 * 60% réponses classiques / 40% contextuelles
 */

export const CONTEXT_RESPONSES = {
  mp3: [
    "tu ecoute koi la ?? moi jécoute Lorie mdr",
    "met la chanson de Crazy Frog stp !! 🐸",
    "ta telecharger sa sur kazaa ?? fai gaffe aux virus lol",
    "moi ma chanson preferee cé Toxic de Britney 💕",
  ],
  tv: [
    "ta vu la star ac hier ??? jvé voter pr Nolwenn",
    "les minikeums c tro bien mdr 😂",
    "moi jregarde le loft story ac ma soeur",
    "change de chaine ya DBZ sur canal j !!",
  ],
  paint: [
    "tu desine koi ?? envoi moi le dessin !!",
    "mdr fai un bonhomme batons 😂",
    "moi jsui tro nul en dessin ptdr",
  ],
  salleJeux: [
    "tu joue a koi ??? moi jé la GameBoy",
    "mdr le snake jy joue en cours de math",
    "ta battu mon score ?? jcroi pa 😤",
    "moi jpreferé le morpion lol",
  ],
  demineur: [
    "mdr le démineur jy joue en cours de math",
    "jcompren rien o démineur moi 😭",
    "ta reussi ?? moi je clique o hazard ptdr",
  ],
  skyblog: [
    "fo ke tu voi la nvelle foto sur mon sky !!!",
    "lache tes coms sur mon skyblog stp !! +5 pr toi",
    "jé mi une nvelle zik sur mon profil 🎵",
  ],
  cartable: [
    "ta fé tes devoirs ??? moi non ptdr 😂",
    "on a un controle de math 2m1 tu savé ??",
    "jsui en trin de copier lexposé de julien lol",
  ],
  chambre: [
    "ta rangé ta chambre ?? ma mer elle veut ke je range la mienne 😤",
    "mdr ton tamagotchi il é mort ?? le mien aussi",
    "jé trouvé une figurine panini super rare !!",
  ],
  poubelle: [
    "pk tu regarde ta corbeille ?? ya rien dedans mdr",
    "suprime pa tes fichiers jte previens 😂",
  ],
};

/**
 * Retourne une réponse contextuelle basée sur les fenêtres ouvertes
 * ou null si on veut une réponse classique (60% du temps)
 */
export function getContextResponse(openWindowIds) {
  // 60% chance de réponse classique
  if (Math.random() < 0.6) return null;

  // Trouver une fenêtre ouverte qui a des réponses contextuelles
  const contextualWindows = openWindowIds.filter(id => CONTEXT_RESPONSES[id]);
  if (contextualWindows.length === 0) return null;

  const windowId = contextualWindows[Math.floor(Math.random() * contextualWindows.length)];
  const responses = CONTEXT_RESPONSES[windowId];
  return responses[Math.floor(Math.random() * responses.length)];
}
