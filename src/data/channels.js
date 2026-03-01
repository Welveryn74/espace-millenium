// Pubs années 2000 (intercalées entre les programmes, comme à la vraie télé)
export const PUBS_2000 = [
  { platform: "youtube", id: "3D0xlJeBcGs" },  // Club Internet
  { platform: "youtube", id: "o2AfXHCdzl0" },  // Liberty Surf
  { platform: "youtube", id: "wnjSjBDwejI" },  // Free
  { platform: "youtube", id: "gT2cZE4VQhI" },  // Caramail
  { platform: "youtube", id: "DB17VDhmkao" },  // AOL
  { platform: "youtube", id: "ddDAgQCgi80" },  // Yahoo
  { platform: "youtube", id: "glBkc8t21e8" },  // Lycos
  { platform: "youtube", id: "X277qOHBoDU" },  // Nokia 3210
  { platform: "youtube", id: "F8tMxQF96Gk" },  // Windows
];

// Mires TV (pas de signal)
export const MIRES_TV = [
  { platform: "youtube", id: "X5oklPpCyMI" },
  { platform: "youtube", id: "AYsh5xNYhl4" },
];

export const CHANNELS = [
  {
    name: "France 3 \u2014 Les Minikeums", color: "#FFD700", emoji: "\u{1F3AD}",
    bg: "#1a0533", img: "/images/tv/france3.png",
    type: "minikeums",
    videos: [
      { platform: "youtube", id: "xTX6yVOmSQo" },  // G\u00e9n\u00e9rique Minikeums
    ],
    content: {
      dialogues: [
        { speaker: "K\u00e9vin", text: "Salut les p'tits clous ! Bienvenue sur France 3 !" },
        { speaker: "Doroth\u00e9e", text: "Aujourd'hui on regarde Dragon Ball Z !!" },
        { speaker: "K\u00e9vin", text: "Tro bien ! V\u00e9g\u00e9ta il est trop fort !" },
        { speaker: "Doroth\u00e9e", text: "N'importe quoi, c'est Sangoku le plus fort !" },
        { speaker: "K\u00e9vin", text: "On vote ? Envoyez SANGOKU ou VEGETA au 3615 !" },
        { speaker: "Doroth\u00e9e", text: "Apr\u00e8s la pub, Pok\u00e9mon les amis !" },
        { speaker: "K\u00e9vin", text: "Attrapez-les tous ! Et l\u00e2chez pas la t\u00e9l\u00e9 hein !" },
        { speaker: "Doroth\u00e9e", text: "Restez bien sur France 3, c'est les Minikeums !" },
      ]
    }
  },
  {
    name: "France 2 \u2014 KD2A", color: "#FF69B4", emoji: "\u{1F4FA}",
    bg: "#0a1628", img: "/images/tv/france2.png",
    type: "kd2a",
    videos: [
      { platform: "dailymotion", id: "x2uk5i" },  // Habillage KD2A 2007
    ],
    content: {
      programme: [
        { time: "08:30", show: "Totally Spies" },
        { time: "09:00", show: "Code Lyoko" },
        { time: "09:30", show: "Martin Myst\u00e8re" },
        { time: "10:00", show: "Pok\u00e9mon Advance" },
        { time: "10:30", show: "Naruto" },
        { time: "11:00", show: "One Piece" },
        { time: "11:30", show: "Shaman King" },
        { time: "12:00", show: "Sonic X" },
        { time: "12:30", show: "Yu-Gi-Oh!" },
        { time: "13:00", show: "Reportage : les sonneries de portable" },
      ]
    }
  },
  {
    name: "TF1 \u2014 Star Academy", color: "#FF4444", emoji: "\u2B50",
    bg: "#1a0a0a", img: "/images/tv/tf1.svg",
    type: "starac",
    videos: [
      { platform: "youtube", id: "-dquSZWVa6o", start: 120 },  // Premier prime S1
    ],
    content: {
      lyrics: [
        "\u266b C'est ma terre promise \u266b",
        "\u266b Dans cette \u00e9cole de la vie \u266b",
        "\u266b Chaque jour on grandit \u266b",
        "\u266b Sur la sc\u00e8ne on brille \u266b",
        "\u266b Ensemble on est plus forts \u266b",
        "\u266b La musique est notre tr\u00e9sor \u266b",
      ],
      nominees: ["\u00c9lodie", "Gr\u00e9gory", "Jenifer"],
    }
  },
  {
    name: "M6 \u2014 Loft Story", color: "#44AAFF", emoji: "\u{1F3E0}",
    bg: "#0a1a2a", img: "/images/tv/m6.png",
    type: "loft",
    videos: [
      { platform: "youtube", id: "p7bfOZek9t4" },  // Loft Story g\u00e9n\u00e9rique/best of
    ],
    content: {
      day: 34,
      events: [
        "Loana se r\u00e9veille... il est 14h.",
        "D\u00e9bat houleux sur le budget courses.",
        "Jean-\u00c9douard fait des pompes au bord de la piscine.",
        "Steevy pr\u00e9pare le repas du soir.",
        "Moment de confidence au confessionnal...",
        "Christophe joue de la guitare sur le canap\u00e9.",
        "Discussion strat\u00e9gique : qui nominer vendredi ?",
        "Loana retourne se coucher.",
      ]
    }
  },
  {
    name: "Canal J \u2014 Club Manga", color: "#44FF88", emoji: "\u{1F38C}",
    bg: "#0a1a10", img: "/images/tv/canalj.png",
    type: "manga",
    videos: [
      { platform: "youtube", id: "pHNLtZh3g1A" },  // G\u00e9n\u00e9rique DBZ fran\u00e7ais
    ],
    content: {
      panels: [
        { style: "action", text: "NARUTO : Kage Bunshin no Jutsu !!!" },
        { style: "dialogue", text: "Sasuke : \u00ab Tu ne me rattraperas jamais... \u00bb" },
        { style: "impact", text: "RASENGAN !!!" },
        { style: "narrator", text: "L'examen Ch\u016bnin entre dans sa phase finale..." },
        { style: "action", text: "LUFFY : Gomu Gomu no... PISTOL !" },
        { style: "dialogue", text: "Zoro : \u00ab Rien ne s'est pass\u00e9. \u00bb" },
        { style: "impact", text: "BANKAI !!!" },
        { style: "narrator", text: "Le combat pour prot\u00e9ger ses amis continue..." },
      ]
    }
  },
  {
    name: "Gulli \u2014 Pok\u00e9mon", color: "#FFAA00", emoji: "\u26A1",
    bg: "#1a1500", img: "/images/tv/gulli.png",
    type: "pokemon",
    videos: [
      { platform: "youtube", id: "lQOEhxTZbz8" },  // G\u00e9n\u00e9rique Pok\u00e9mon S1 VF
    ],
    content: {
      scenes: [
        { type: "narrator", text: "Sacha et Pikachu arrivent dans la ville de Poivressel !" },
        { type: "attack", text: "Pikachu utilise Tonnerre !", attacker: "Pikachu" },
        { type: "hp", target: "Ennemi Racaillou", pct: 35 },
        { type: "dialogue", text: "Sacha : \u00ab Pikachu, je te choisis ! \u00bb" },
        { type: "attack", text: "Dracaufeu utilise Lance-Flammes !", attacker: "Dracaufeu" },
        { type: "hp", target: "Ennemi Arbok", pct: 12 },
        { type: "dialogue", text: "Team Rocket : \u00ab Une fois de plus, la Team Rocket s'envole vers d'autres cieux ! \u00bb" },
        { type: "narrator", text: "Le badge Dynamo est \u00e0 port\u00e9e de main !" },
      ]
    }
  },
];
