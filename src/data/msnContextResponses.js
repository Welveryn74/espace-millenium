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
    "met du son a fond !! 🔊🔊",
    "moi jécoute ke du RnB en ce moment cé tro bi1",
    "ta deja écouté Linkin Park ?? cé tro bien mé cé triste",
  ],
  tv: [
    "ta vu la star ac hier ??? jvé voter pr Nolwenn",
    "les minikeums c tro bien mdr 😂",
    "moi jregarde le loft story ac ma soeur",
    "change de chaine ya DBZ sur canal j !!",
    "zap pa !! ya les pubs la cé nul",
    "mdr ya les guignols de linfo la cé tro drôle",
    "ta vu le prime de star ac samedi ?? jenai pleuré 😭",
    "moi jregarde pok\u00E9mon ts les matins avt lécole",
  ],
  paint: [
    "tu desine koi ?? envoi moi le dessin !!",
    "mdr fai un bonhomme batons 😂",
    "moi jsui tro nul en dessin ptdr",
    "fé moi un portrait stp !! 🎨",
    "ta vu les dessins sur deviantart ?? cé tro bo",
    "fé un dragon stp !! ac du feu 🔥",
    "mdr on diré un picasso (cé pa un compliment ptdr)",
  ],
  salleJeux: [
    "tu joue a koi ??? moi jé la GameBoy",
    "mdr le snake jy joue en cours de math",
    "ta battu mon score ?? jcroi pa 😤",
    "moi jpreferé le morpion lol",
    "jte bats a tetris kan tu veu !!",
    "mdr tu joue encor ?? ta pa des devoirs ??",
    "tu koné le jeu du dinosaure sur internet explorer ?? tro bien",
  ],
  demineur: [
    "mdr le démineur jy joue en cours de math",
    "jcompren rien o démineur moi 😭",
    "ta reussi ?? moi je clique o hazard ptdr",
    "moi jexplose tjs a la premiere case 💀",
    "ya un truc ac les chiffres mais jsai pa koi",
    "le démineur cé pr les intellos mdr",
    "essaye le mode expert jte défie !!",
  ],
  skyblog: [
    "fo ke tu voi la nvelle foto sur mon sky !!!",
    "lache tes coms sur mon skyblog stp !! +5 pr toi",
    "jé mi une nvelle zik sur mon profil 🎵",
    "jadore ton sky cé tro beau !! 💖",
    "tu devré mètre un compteur de visite sur ton sky",
    "mdr ya kk1 ki a laché un com méchan sur mon sky 😤",
    "tu koné le code pr mètre de la zik en fond sur skyblog ??",
  ],
  cartable: [
    "ta fé tes devoirs ??? moi non ptdr 😂",
    "on a un controle de math 2m1 tu savé ??",
    "jsui en trin de copier lexposé de julien lol",
    "ta fé lexo de français ?? envoi moi les rep stp 🙏",
    "moi jfé mes devoirs pdt la récré mdr",
    "la prof de maths elle donne tro 2 devoirs cé abusé",
    "tu pourra me préter ton compas 2m1 ?? jé perdu le mien",
  ],
  chambre: [
    "ta rangé ta chambre ?? ma mer elle veut ke je range la mienne 😤",
    "mdr ton tamagotchi il é mort ?? le mien aussi",
    "jé trouvé une figurine panini super rare !!",
    "montre moi ta chambre mdr jveu voir 👀",
    "moi jé un poster de britney ds ma chambre",
    "ta combien de peluches ?? moi jen ai genre 50",
    "mdr ta vu le bazar ds ma chambre ??",
  ],
  poubelle: [
    "pk tu regarde ta corbeille ?? ya rien dedans mdr",
    "suprime pa tes fichiers jte previens 😂",
    "mdr vide ta poubelle !! 🗑️",
    "tu cherche koi ds la corbeille ?? ta supprimé un truc ??",
    "jespere ta pa supprimé tes photos ptdr",
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
