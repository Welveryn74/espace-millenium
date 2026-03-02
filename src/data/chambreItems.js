// Room zones and interactive items for La Chambre d'Enfant
// Each item has a position in the room scene, interaction type, and metadata

export const COUETTES = [
  { id: "harryPotter", emoji: "🧙", label: "Harry Potter", color: "#722F37", desc: "La housse Gryffondor avec le Vif d'Or doré. Tu dormais dans la magie tous les soirs." },
  { id: "spiderman", emoji: "🕷️", label: "Spider-Man", color: "#CC1C2C", desc: "Toile d'araignée sur fond bleu et rouge. Tu faisais le geste pchit-pchit au réveil.", img: "/images/chambre/couettes/spiderman.svg" },
  { id: "roiLion", emoji: "🦁", label: "Le Roi Lion", color: "#D4943A", desc: "Simba et Nala sur fond de savane. Hakuna Matata avant même de savoir ce que ça voulait dire." },
  { id: "dinosaures", emoji: "🦖", label: "Dinosaures", color: "#2E7D32", desc: "T-Rex, Tricératops, Stégosaure. Tu connaissais plus de noms de dinos que de capitales." },
];

export const BEYBLADE_TOUPIES = [
  { id: "dragoon", name: "Dragoon Storm", color: "#3B82F6", accent: "#93C5FD", stat: 7, desc: "La toupie de Tyson. Le Dragon Bleu. Celle que tout le monde voulait dans la cour.", img: "/images/chambre/beyblades/dragoon.png" },
  { id: "dranzer", name: "Dranzer Flame", color: "#EF4444", accent: "#FCA5A5", stat: 8, desc: "Le Phoenix de Kai. Puissante, élégante, et avec cette aura de rival cool.", img: "/images/chambre/beyblades/dranzer.svg" },
  { id: "driger", name: "Driger Fang", color: "#22C55E", accent: "#86EFAC", stat: 6, desc: "Le Tigre Blanc de Ray. Rapide comme l'éclair, fidèle comme un ami.", img: "/images/chambre/beyblades/driger.svg" },
  { id: "draciel", name: "Draciel Shield", color: "#A855F7", accent: "#D8B4FE", stat: 9, desc: "La Tortue de Max. La meilleure défense. Increvable dans l'arène.", img: "/images/chambre/beyblades/draciel.svg" },
];

export const BILLES_COLLECTION = [
  { id: "calot", name: "Le Calot", colors: ["#1E90FF", "#87CEFA", "#1E90FF"], size: 44, desc: "La grosse. La reine de la cour. Celui qui avait un calot en verre bleu était respecté de tous.", img: "/images/chambre/billes/calot.svg" },
  { id: "agate", name: "L'Agate", colors: ["#FF6347", "#FFD700", "#FF4500"], size: 30, desc: "Avec ses veines de couleur qui tourbillonnent à l'intérieur. On pouvait la regarder pendant des heures.", img: "/images/chambre/billes/agate.svg" },
  { id: "terre", name: "La Terre", colors: ["#8B4513", "#D2691E", "#A0522D"], size: 28, desc: "La bille de base. Celle qu'on avait en 50 exemplaires. Monnaie d'échange universelle.", img: "/images/chambre/billes/terre.svg" },
  { id: "galaxie", name: "La Galaxie", colors: ["#191970", "#9370DB", "#000080"], size: 32, desc: "Bleu nuit avec des paillettes. On aurait dit qu'elle contenait l'univers.", img: "/images/chambre/billes/galaxie.svg" },
  { id: "oeilDeChat", name: "L'Œil de Chat", colors: ["#32CD32", "#ADFF2F", "#228B22"], size: 28, desc: "Verte avec une bande claire au milieu. Le nom faisait un peu peur et un peu envie.", img: "/images/chambre/billes/oeil-de-chat.svg" },
  { id: "cristal", name: "La Cristal", colors: ["#E0E0E0", "#FFFFFF", "#C0C0C0"], size: 28, desc: "Transparente comme du verre. Fragile, précieuse. Tu la sortais jamais pour jouer, juste pour montrer.", img: "/images/chambre/billes/cristal.svg" },
  { id: "boulard", name: "Le Boulard", colors: ["#FF1493", "#FF69B4", "#FF1493"], size: 48, desc: "L'ÉNORME. Interdite dans certaines cours parce qu'elle écrasait tout. La bille nucléaire.", img: "/images/chambre/billes/boulard.svg" },
  { id: "chinoise", name: "La Chinoise", colors: ["#FFD700", "#FF8C00", "#FFD700"], size: 26, desc: "Toute petite, dorée, avec des motifs. Personne savait pourquoi on l'appelait comme ça.", img: "/images/chambre/billes/chinoise.svg" },
];

export const LEGO_SETS = [
  { id: "starwars", name: "Faucon Millénium", theme: "Star Wars", year: 2000, pieces: 664, color: "#607D8B", emoji: "🚀", desc: "Le set que tu demandais à CHAQUE Noël. 664 pièces. Tu l'as monté en un week-end avec papa et tu as perdu 3 pièces dans le tapis." },
  { id: "bionicle", name: "Tahu Nuva", theme: "Bionicle", year: 2002, pieces: 36, color: "#E53935", emoji: "🔥", desc: "Le Toa du Feu. Le premier Bionicle. Tu le montais, le démontais, le remontais. Son masque était la pièce la plus précieuse de ta collection." },
  { id: "harrypotter", name: "Poudlard Express", theme: "Harry Potter", year: 2001, pieces: 410, color: "#7B1FA2", emoji: "🧙", desc: "Le train rouge et noir. La mini-fig de Harry avec sa cicatrice. Tu l'emmenais partout même à table." },
  { id: "city", name: "La Caserne des Pompiers", theme: "City", year: 1999, pieces: 302, color: "#F57C00", emoji: "🚒", desc: "Avec le camion échelle, la porte de garage qui s'ouvre, et le dalmatien. LE set classique par excellence." },
  { id: "racers", name: "Ferrari F1", theme: "Racers", year: 2003, pieces: 237, color: "#C62828", emoji: "🏎️", desc: "Michael Schumacher en Lego. Tu la faisais rouler sur le carrelage à fond et elle explosait dans les murs." },
  { id: "castle", name: "Le Château Royal", theme: "Castle", year: 2000, pieces: 524, color: "#5D4037", emoji: "🏰", desc: "Avec le pont-levis qui descend et les chevaliers. Tu inventais des batailles qui duraient tout l'après-midi." },
];

export const PELUCHES = [
  { id: "ours", emoji: "🧸", name: "Gros Nounours", color: "#A0522D", desc: "Le premier. Celui qui a perdu un œil et dont le bras tient avec du scotch. Tu refusais de dormir sans lui.", reaction: "Câlin ! Il est tout doux malgré les années...", img: "/images/chambre/peluches/ours.svg" },
  { id: "lapin", emoji: "🐰", name: "Lapinou", color: "#DDA0DD", desc: "Les oreilles qui pendouillent. Tu le traînais partout par une patte. Il sentait le lait et le doudou.", reaction: "Ses oreilles se redressent de joie !", img: "/images/chambre/peluches/lapin.svg" },
  { id: "chien", emoji: "🐶", name: "Pitou", color: "#D2B48C", desc: "Le chien en peluche que tu avais demandé parce que maman voulait pas de vrai chien. Tu lui parlais quand même.", reaction: "Il remue la queue ! Enfin... presque.", img: "/images/chambre/peluches/chien.svg" },
  { id: "dragon", emoji: "🐉", name: "Drago", color: "#2E8B57", desc: "Le dragon vert gagné à la fête foraine. Papa a dépensé 15 euros de chamboule-tout pour le gagner.", reaction: "Il crache du feu imaginaire ! ROOAAR !", img: "/images/chambre/peluches/dragon.svg" },
];

export const SCOUBIDOUS = [
  { id: "rond", name: "Le Rond", colors: ["#FF4444", "#FFDD44"], desc: "Le premier qu'on apprenait. Quatre fils, dessus-dessous. T'avais mal aux doigts mais tu lâchais pas.", img: "/images/chambre/scoubidous/rond.svg" },
  { id: "carre", name: "Le Carré", colors: ["#4488FF", "#44FF88"], desc: "Le niveau 2. Un peu plus classe. Tu le faisais pendre à ta trousse comme un trophée.", img: "/images/chambre/scoubidous/carre.svg" },
  { id: "torsade", name: "Le Torsadé", colors: ["#FF44FF", "#44FFFF"], desc: "Le twist. Littéralement. Celui qui impressionnait tout le monde au centre aéré.", img: "/images/chambre/scoubidous/torsade.svg" },
  { id: "spirale", name: "La Spirale", colors: ["#FF8844", "#8844FF"], desc: "Le niveau expert. Si tu savais faire celui-là, tu étais le maître incontesté du scoubidou.", img: "/images/chambre/scoubidous/spirale.svg" },
  { id: "plat", name: "Le Plat", colors: ["#44FF44", "#FF4488"], desc: "Le bracelet. Tu en faisais pour tes copains et ta maman. Cadeau de fête des mères officiel.", img: "/images/chambre/scoubidous/plat.svg" },
  { id: "etoile", name: "L'Étoile", colors: ["#FFDD44", "#FF4444", "#4488FF"], desc: "Le mythique. Six fils. Personne dans la classe savait vraiment le faire. On faisait semblant.", img: "/images/chambre/scoubidous/etoile.svg" },
];

export const JEUX_SOCIETE = [
  { id: "monopoly", name: "Monopoly", emoji: "🏠", color: "#2E7D32", players: "2-6", desc: "La Rue de la Paix. Les hôtels rouges. Les billets de Monopoly cachés sous la table. Et papa qui retournait le plateau quand il perdait." },
  { id: "bonnePaye", name: "La Bonne Paye", emoji: "💰", color: "#1565C0", players: "2-6", desc: "Le jeu où tu apprenais ce que c'était de payer des factures. À 8 ans. Bienvenue dans la vie adulte, version plateau." },
  { id: "petitsChevaux", name: "Les Petits Chevaux", emoji: "🐴", color: "#E65100", players: "2-4", desc: "Les bagarres pour la couleur du pion. Le cri de rage quand quelqu'un te renvoyait à l'écurie. Dimanche après-midi classique." },
  { id: "cluedo", name: "Cluedo", emoji: "🔍", color: "#6A1B9A", players: "3-6", desc: "\"C'est le Colonel Moutarde, dans la cuisine, avec le chandelier !\" Tu te sentais détective privé. Même si tu accusais au hasard.", img: "/images/chambre/jeux/cluedo.png" },
  { id: "unMille", name: "Le 1000 Bornes", emoji: "🚗", color: "#C62828", players: "2-4", desc: "Crevaison ! Panne d'essence ! Limitation de vitesse ! Le jeu de cartes qui rendait les trajets en voiture encore plus longs.", img: "/images/chambre/jeux/1000bornes.png" },
];

export const SOUS_LE_LIT = [
  { id: "carambar", emoji: "🍬", name: "Vieux Carambar", desc: "Un Carambar collé au parquet depuis 2003. La blague est illisible mais tu essaies quand même.", flavor: "Quelle est la diff... (illisible)" },
  { id: "chaussette", emoji: "🧦", name: "Chaussette perdue", desc: "La chaussette droite des Pokémon. La gauche a disparu au lavage en 2001. Mystère toujours non résolu.", flavor: "Elle sent encore un peu le propre !" },
  { id: "gameboy", emoji: "🎮", name: "Game Boy Pocket", desc: "La Game Boy Pocket grise que tu croyais perdue ! L'écran est un peu rayé et les piles ont coulé, mais elle est là.", flavor: "Il reste une sauvegarde de Pokémon Rouge !" },
  { id: "titeuf", emoji: "📕", name: "Titeuf Tome 3", desc: "\"Ça épate les filles\". Le tome que tu as lu 400 fois sous la couette avec la lampe de poche.", flavor: "Tchô la page de Nadia est cornée..." },
  { id: "piece", emoji: "🪙", name: "Pièce de 1€", desc: "Une pièce de 1 euro qui a roulé sous le lit un jour de 2002. Elle vaut toujours 1€ mais la trouver ça vaut de l'or.", flavor: "Tu te sens riche !" },
  { id: "powerranger", emoji: "🦸", name: "Figurine Power Rangers", desc: "Le Ranger Rouge, bras cassé. Il a survécu à 1000 batailles contre des Lego et des dinosaures en plastique.", flavor: "IT'S MORPHIN' TIME !" },
  { id: "bille", emoji: "🔵", name: "Bille perdue", desc: "Un calot bleu transparent. Perdu lors du Grand Match de la Récré 2002. Enfin retrouvé.", flavor: "Elle brille encore !" },
  { id: "dessin", emoji: "🖍️", name: "Dessin pour maman", desc: "Un dessin au feutre avec écrit \"je t'aime maman\" et un soleil avec des bras. Tu avais 5 ans.", flavor: "Il est un peu froissé mais toujours beau." },
];

export const ROOM_ITEMS = [
  // --- Le Lit (center) ---
  {
    id: "couette",
    emoji: "🛏️",
    label: "Housses de couette",
    zone: "lit",
    interactive: true,
    position: { top: "38%", left: "35%" },
    hint: "Choisis ta housse !",
    vhsSubtitle: "On dormait toujours du côté du mur...",
  },
  {
    id: "peluches",
    emoji: "🧸",
    label: "Peluches",
    zone: "lit",
    interactive: true,
    position: { top: "30%", left: "55%" },
    hint: "Fais un câlin !",
    vhsSubtitle: "Celui-là, c'était le préféré...",
  },

  // --- Table de nuit (left) ---
  {
    id: "tamagotchi",
    emoji: "🥚",
    label: "Tamagotchi",
    zone: "tableDenuit",
    interactive: true,
    position: { top: "42%", left: "12%" },
    hint: "Il a faim !",
    vhsSubtitle: "Faut pas oublier de le nourrir !",
  },
  {
    id: "lampe",
    emoji: "🔦",
    label: "Lampe de chevet",
    zone: "tableDenuit",
    interactive: true,
    toggle: true,
    position: { top: "28%", left: "8%" },
    hint: "Clic pour allumer/éteindre",
    vhsSubtitle: "Clic.",
  },

  // --- Étagère (top/back wall) ---
  {
    id: "lego",
    emoji: "🧱",
    label: "Lego & Bionicle",
    zone: "etagere",
    interactive: true,
    position: { top: "8%", left: "70%" },
    hint: "Ouvre le catalogue !",
    vhsSubtitle: "Il a passé tout le week-end à monter ça...",
  },
  {
    id: "jeuxSociete",
    emoji: "🎲",
    label: "Jeux de société",
    zone: "etagere",
    interactive: true,
    position: { top: "8%", left: "85%" },
    hint: "Soirée jeux en famille !",
    vhsSubtitle: "Soirée jeux du dimanche soir !",
  },
  {
    id: "scoubidous",
    emoji: "🪢",
    label: "Scoubidous",
    zone: "etagere",
    interactive: true,
    position: { top: "14%", left: "78%" },
    hint: "Dessus, dessous, dessus...",
    vhsSubtitle: "Dessus, dessous, dessus, dessous...",
  },

  // --- Par terre (bottom) ---
  {
    id: "panini",
    emoji: "📖",
    label: "Album Panini",
    zone: "parterre",
    interactive: true,
    position: { top: "72%", left: "65%" },
    hint: "Il manque des stickers...",
    vhsSubtitle: "T'as des doubles ? Je t'échange !",
  },
  {
    id: "pateAProut",
    emoji: "💩",
    label: "Pâte à prout",
    zone: "parterre",
    interactive: true,
    position: { top: "78%", left: "25%" },
    hint: "Ose appuyer.",
    vhsSubtitle: "Non mais c'est dégoûtant !",
  },
  {
    id: "billes",
    emoji: "🔮",
    label: "Pochette de billes",
    zone: "parterre",
    interactive: true,
    position: { top: "75%", left: "45%" },
    hint: "Ouvre ta pochette !",
    vhsSubtitle: "Montre-nous ta collection !",
  },
  {
    id: "beyblade",
    emoji: "🌀",
    label: "Beyblade",
    zone: "parterre",
    interactive: true,
    position: { top: "82%", left: "82%" },
    hint: "3, 2, 1... LET IT RIP !",
    vhsSubtitle: "3, 2, 1... LET IT RIP !",
  },

  // --- Table de nuit (new items) ---
  {
    id: "reveil",
    emoji: "⏰",
    label: "Réveil digital",
    zone: "tableDenuit",
    interactive: true,
    position: { top: "44%", left: "4%" },
    hint: "Quelle heure il est ?",
    vhsSubtitle: "Déjà cette heure-là ?!",
  },
  {
    id: "journal",
    emoji: "📓",
    label: "Journal intime",
    zone: "tableDenuit",
    interactive: true,
    position: { top: "36%", left: "16%" },
    hint: "Cher journal...",
    vhsSubtitle: "Chut, c'est secret !",
  },
  {
    id: "radio",
    emoji: "📻",
    label: "Poste radio",
    zone: "tableDenuit",
    interactive: true,
    position: { top: "38%", left: "2%" },
    hint: "Écoute la radio !",
    vhsSubtitle: "Écoute ce qu'y a à la radio...",
  },

  // --- Sous le lit ---
  {
    id: "sousLelit",
    emoji: "👀",
    label: "Sous le lit",
    zone: "lit",
    interactive: true,
    position: { top: "62%", left: "42%" },
    hint: "Qu'est-ce qui se cache là-dessous ?",
    vhsSubtitle: "Y'a quoi là-dessous ?",
  },

  // --- Nouveaux objets (Sprint 1.2 / 1.3) ---
  {
    id: "cartes",
    emoji: "🃏",
    label: "Cartes à collectionner",
    zone: "etagere",
    interactive: true,
    position: { top: "14%", left: "65%" },
    hint: "T'as des doubles ?",
    vhsSubtitle: "Regarde, il a toute la collection !",
  },
  {
    id: "lampeALave",
    emoji: "🫧",
    label: "Lampe à lave",
    zone: "tableDenuit",
    interactive: true,
    position: { top: "28%", left: "16%" },
    hint: "Hypnotisant...",
    vhsSubtitle: "C'est hypnotisant ce truc...",
  },
  {
    id: "telephone",
    emoji: "📱",
    label: "Nokia 3310",
    zone: "tableDenuit",
    interactive: true,
    position: { top: "44%", left: "8%" },
    hint: "Slt sa va ?",
    vhsSubtitle: "Slt, sa va ? Mdr",
  },
  {
    id: "dinos",
    emoji: "🦖",
    label: "Figurines dinosaures",
    zone: "etagere",
    interactive: true,
    position: { top: "8%", left: "60%" },
    hint: "ROAAAAR !",
    vhsSubtitle: "ROAAAAR !!",
  },
  {
    id: "posters",
    emoji: "🖼️",
    label: "Posters muraux",
    zone: "etagere",
    interactive: true,
    position: { top: "20%", left: "30%" },
    hint: "Personnalise ton mur !",
    vhsSubtitle: "Regarde tous ses posters !",
  },
  {
    id: "diddl",
    emoji: "🐭",
    label: "Collection Diddl",
    zone: "parterre",
    interactive: true,
    position: { top: "70%", left: "55%" },
    hint: "Ça sent la fraise !",
    vhsSubtitle: "Ça sent bon la fraise !",
  },

  // --- Jouets iconiques (Sprint P3) ---
  {
    id: "kaleidoscope",
    emoji: "🌈",
    label: "Kaléidoscope",
    zone: "etagere",
    interactive: true,
    position: { top: "14%", left: "72%" },
    hint: "Ferme un œil et tourne...",
    vhsSubtitle: "Ferme un œil et tourne !",
  },
  {
    id: "bouleDisco",
    emoji: "🪩",
    label: "Boule disco",
    zone: "etagere",
    interactive: true,
    position: { top: "8%", left: "78%" },
    hint: "Ambiance fête !",
    vhsSubtitle: "Ambiance boum d'anniversaire !",
  },
  {
    id: "voitureRC",
    emoji: "🏎️",
    label: "Voitures télécommandées",
    zone: "parterre",
    interactive: true,
    position: { top: "80%", left: "35%" },
    hint: "VROOOM ! ...les piles sont mortes.",
    vhsSubtitle: "VROOOM ! ...ah, les piles sont mortes.",
  },
];
