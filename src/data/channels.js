// Pubs ann\u00e9es 2000 (intercal\u00e9es entre les programmes, comme \u00e0 la vraie t\u00e9l\u00e9)
export const PUBS_2000 = [
  { platform: "dailymotion", id: "x64id" },    // Club Internet \u2014 le fou
  { platform: "dailymotion", id: "xlsh3" },    // Club Internet \u2014 Bogdanov & Magn\u00e9to
  { platform: "dailymotion", id: "x1fxob" },   // Club Internet \u2014 Jeanne d'Arc
  { platform: "dailymotion", id: "xibsjq" },   // Liberty Surf \u2014 Che/Gandhi/L\u00e9nine
  { platform: "dailymotion", id: "xceuw4" },   // Free \u2014 r\u00e9trospective 10 ans
  { platform: "dailymotion", id: "x6b3igf" },  // AOL \u2014 pub 1996
  { platform: "dailymotion", id: "xiibih" },   // Lycos \u2014 "Exigez le chien" 2001
  { platform: "dailymotion", id: "xqzdp" },    // Lycos \u2014 entretien d'embauche
  { platform: "dailymotion", id: "x382iv7" },  // Nokia 3210
  { platform: "dailymotion", id: "x494skf" },  // Compilation pubs an 2000
];

// Mires TV (pas de signal)
export const MIRES_TV = [
  { platform: "dailymotion", id: "xn2av0" },   // ORTF \u2014 mire 2\u00e8me cha\u00eene couleur
  { platform: "dailymotion", id: "xn2fcd" },   // RTF \u2014 mire cheval de Marly
];

export const CHANNELS = [
  {
    name: "France 3 \u2014 Les Minikeums", color: "#FFD700", emoji: "\u{1F3AD}",
    bg: "#1a0533", img: "/images/tv/france3.png",
    type: "minikeums",
    videos: [
      { platform: "dailymotion", id: "xf1d1s" },   // G\u00e9n\u00e9rique Minikeums 1995
      { platform: "dailymotion", id: "x2c3at" },   // G\u00e9n\u00e9rique Minikeums 1998
      { platform: "dailymotion", id: "x89t1kp" },  // G\u00e9n\u00e9rique Minikeums
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
      { platform: "dailymotion", id: "x2uk5i" },   // Habillage KD2A 2007
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
      { platform: "dailymotion", id: "x812jke" },  // G\u00e9n\u00e9rique Star Academy S1
      { platform: "dailymotion", id: "x8f6chv" },  // G\u00e9n\u00e9rique Star Academy
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
      { platform: "dailymotion", id: "x6tg4i" },   // G\u00e9n\u00e9rique Loft Story 1 (2001)
      { platform: "dailymotion", id: "x5gvg6r" },  // G\u00e9n\u00e9rique Loft Story 1
      { platform: "dailymotion", id: "x88uvcd" },  // G\u00e9n\u00e9rique Loft Story
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
      { platform: "dailymotion", id: "x4xeefy" },  // G\u00e9n\u00e9rique DBZ \u2014 Ariane Carletti (clip officiel)
      { platform: "dailymotion", id: "x3lx6xd" },  // DBZ V1 son remast\u00e9ris\u00e9
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
      { platform: "dailymotion", id: "x83cp03" },  // G\u00e9n\u00e9rique Pok\u00e9mon S1 VF
      { platform: "dailymotion", id: "x2ay318" },  // G\u00e9n\u00e9rique Pok\u00e9mon S1
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
