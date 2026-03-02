// Pubs années 2000 (intercalées entre les programmes, comme à la vraie télé)
export const PUBS_2000 = [
  { platform: "dailymotion", id: "x64id" },    // Club Internet — le fou
  { platform: "dailymotion", id: "xlsh3" },    // Club Internet — Bogdanov & Magnéto
  { platform: "dailymotion", id: "x1fxob" },   // Club Internet — Jeanne d'Arc
  { platform: "dailymotion", id: "xibsjq" },   // Liberty Surf — Che/Gandhi/Lénine
  { platform: "dailymotion", id: "xceuw4" },   // Free — rétrospective 10 ans
  { platform: "dailymotion", id: "x6b3igf" },  // AOL — pub 1996
  { platform: "dailymotion", id: "xiibih" },   // Lycos — "Exigez le chien" 2001
  { platform: "dailymotion", id: "xn7xnf" },   // Lycos — pub 2001
  { platform: "dailymotion", id: "x382iv7" },  // Nokia 3210
  { platform: "dailymotion", id: "x494skf" },  // Compilation pubs an 2000
];

// Mires TV (pas de signal)
export const MIRES_TV = [
  { platform: "dailymotion", id: "xn2av0" },   // ORTF — mire 2ème chaîne couleur
  { platform: "dailymotion", id: "xn2fcd" },   // RTF — mire cheval de Marly
];

export const CHANNELS = [
  // 1 — France 3 — Les Minikeums (INCHANGÉ)
  {
    name: "France 3 — Les Minikeums", color: "#FFD700", emoji: "\u{1F3AD}",
    bg: "#1a0533", img: "/images/tv/france3.png",
    type: "minikeums",
    videos: [
      { platform: "dailymotion", id: "xf1d1s" },   // Générique Minikeums 1995
      { platform: "dailymotion", id: "x2c3at" },   // Générique Minikeums 1998
      { platform: "dailymotion", id: "x89t1kp" },  // Générique Minikeums
    ],
    content: {
      dialogues: [
        { speaker: "Kévin", text: "Salut les p'tits clous ! Bienvenue sur France 3 !" },
        { speaker: "Dorothée", text: "Aujourd'hui on regarde Dragon Ball Z !!" },
        { speaker: "Kévin", text: "Tro bien ! Végéta il est trop fort !" },
        { speaker: "Dorothée", text: "N'importe quoi, c'est Sangoku le plus fort !" },
        { speaker: "Kévin", text: "On vote ? Envoyez SANGOKU ou VEGETA au 3615 !" },
        { speaker: "Dorothée", text: "Après la pub, Pokémon les amis !" },
        { speaker: "Kévin", text: "Attrapez-les tous ! Et lâchez pas la télé hein !" },
        { speaker: "Dorothée", text: "Restez bien sur France 3, c'est les Minikeums !" },
      ]
    }
  },
  // 2 — France 2 — KD2A (+ Danny Fantôme, Foot de Rue)
  {
    name: "France 2 — KD2A", color: "#FF69B4", emoji: "\u{1F4FA}",
    bg: "#0a1628", img: "/images/tv/france2.png",
    type: "kd2a",
    videos: [
      { platform: "dailymotion", id: "x3ug7a" },   // KD2A France 2
      { platform: "dailymotion", id: "x5croa" },   // Générique KD2A Tecktonik
    ],
    content: {
      programme: [
        { time: "08:30", show: "Totally Spies" },
        { time: "09:00", show: "Code Lyoko" },
        { time: "09:30", show: "Martin Mystère" },
        { time: "10:00", show: "Danny Fantôme" },
        { time: "10:30", show: "Naruto" },
        { time: "11:00", show: "One Piece" },
        { time: "11:30", show: "Foot de Rue" },
        { time: "12:00", show: "Sonic X" },
        { time: "12:30", show: "Yu-Gi-Oh!" },
        { time: "13:00", show: "Reportage : les sonneries de portable" },
      ]
    }
  },
  // 3 — TF1 (dual TFOU matin / Star Ac + Koh-Lanta prime)
  {
    name: "TF1", color: "#FF4444", emoji: "\u2B50",
    bg: "#1a0a0a", img: "/images/tv/tf1.svg",
    type: "tf1",
    videos: [
      { platform: "dailymotion", id: "x812jke" },  // Générique Star Academy S1
      { platform: "dailymotion", id: "x8f6chv" },  // Générique Star Academy
    ],
    content: {
      tfou: [
        { time: "07:00", show: "Titeuf", color: "#FFD700" },
        { time: "07:30", show: "Jimmy Neutron", color: "#44CCFF" },
        { time: "08:00", show: "Cédric", color: "#FF8844" },
        { time: "08:30", show: "Foot de Rue", color: "#44FF44" },
        { time: "09:00", show: "Oggy et les Cafards", color: "#FF44FF" },
        { time: "09:30", show: "Tom-Tom et Nana", color: "#FFAA00" },
      ],
      starac: {
        lyrics: [
          "\u266b C'est ma terre promise \u266b",
          "\u266b Dans cette école de la vie \u266b",
          "\u266b Chaque jour on grandit \u266b",
          "\u266b Sur la scène on brille \u266b",
          "\u266b Ensemble on est plus forts \u266b",
          "\u266b La musique est notre trésor \u266b",
        ],
        nominees: ["Élodie", "Grégory", "Jenifer"],
      },
      kohlanta: [
        "Denis Brogniart : \u00ab Ah ! \u00bb",
        "Épreuve d'immunité : course dans la boue !",
        "Conseil tribal... Le suspense est insoutenable.",
        "Koh-Lanta, l'île des héros ! \u{1F3DD}\uFE0F",
        "Dernière torche éteinte... Éliminé(e) !",
        "Alliance secrète au campement...",
        "Épreuve du confort : barbecue pour les gagnants !",
        "Denis : \u00ab La tribu a parlé. \u00bb",
      ],
    }
  },
  // 4 — M6 (dual M6 Kid matin / Loft Story + Friends prime)
  {
    name: "M6", color: "#44AAFF", emoji: "\u{1F3E0}",
    bg: "#0a1a2a", img: "/images/tv/m6.png",
    type: "m6",
    videos: [
      { platform: "dailymotion", id: "x6tg4i" },   // Générique Loft Story 1 (2001)
      { platform: "dailymotion", id: "x5gvg6r" },  // Générique Loft Story 1
      { platform: "dailymotion", id: "x88uvcd" },  // Générique Loft Story
    ],
    content: {
      m6kid: [
        { time: "08:00", show: "Scooby-Doo", color: "#88CC44" },
        { time: "08:30", show: "Totally Spies", color: "#FF69B4" },
        { time: "09:00", show: "Bob l'Éponge", color: "#FFD700" },
        { time: "09:30", show: "Les Razmoket", color: "#FF8844" },
        { time: "10:00", show: "Dora l'Exploratrice", color: "#FF44FF" },
      ],
      loft: {
        day: 34,
        events: [
          "Loana se réveille... il est 14h.",
          "Débat houleux sur le budget courses.",
          "Jean-Édouard fait des pompes au bord de la piscine.",
          "Steevy prépare le repas du soir.",
          "Moment de confidence au confessionnal...",
          "Christophe joue de la guitare sur le canapé.",
          "Discussion stratégique : qui nominer vendredi ?",
          "Loana retourne se coucher.",
        ],
      },
      friends: [
        "Joey : \u00ab Comment tu vas ? \u00bb \u{1F44B}",
        "Ross : \u00ab ON FAISAIT UNE PAUSE ! \u00bb",
        "Chandler : \u00ab Could this BE any more awkward ? \u00bb",
        "Monica : \u00ab Je SAIS ! \u00bb (frotte la table frénétiquement)",
        "Phoebe chante \u00ab Smelly Cat, Smelly Caaaat... \u00bb \u{1F3B5}",
        "Rachel : \u00ab C'est MA pièce montée ! \u00bb",
        "Joey : \u00ab JOEY DOESN'T SHARE FOOD ! \u00bb \u{1F355}",
        "Ross et le PIVOT! PIVOT! PIVOOOOT!",
      ],
    }
  },
  // 5 — France 5 — Les Zouzous (NOUVEAU)
  {
    name: "France 5 — Les Zouzous", color: "#88CC44", emoji: "\u{1F333}",
    bg: "#0a200a",
    type: "zouzous",
    videos: [],
    content: {
      scenes: [
        { show: "Dora", text: "Sac à dos, sac à dos ! Tu vois le chemin ? Dis \u00ab MAP \u00bb !", color: "#FF69B4" },
        { show: "Bob le Bricoleur", text: "On peut le faire ? OUI ON PEUT !", color: "#FFD700" },
        { show: "Franklin", text: "Franklin pouvait compter par deux et attacher ses lacets...", color: "#44AA44" },
        { show: "Télétubbies", text: "Eh-Oh ! Laa-Laa ! Tinky Winky ! Dipsy ! Po !", color: "#CC44FF" },
        { show: "Bonne nuit les petits", text: "Nicolas, Pimprenelle... il est l'heure de dormir...", color: "#4488CC" },
        { show: "Dora", text: "Chipeur, arrête de chiper ! Chipeur, arrête de chiper !", color: "#FF69B4" },
        { show: "Bob le Bricoleur", text: "Zoé, Scoup et Tournevis sont prêts ! Au travail !", color: "#FFD700" },
        { show: "Télétubbies", text: "Les Télétubbies disent \u00ab Au revoir ! \u00bb \u{1F44B}", color: "#CC44FF" },
      ]
    }
  },
  // 6 — Canal J — Club Manga (INCHANGÉ)
  {
    name: "Canal J — Club Manga", color: "#44FF88", emoji: "\u{1F38C}",
    bg: "#0a1a10", img: "/images/tv/canalj.png",
    type: "manga",
    videos: [
      { platform: "dailymotion", id: "x4xeefy" },  // Générique DBZ — Ariane Carletti (clip officiel)
      { platform: "dailymotion", id: "x3lx6xd" },  // DBZ V1 son remastérisé
    ],
    content: {
      panels: [
        { style: "action", text: "NARUTO : Kage Bunshin no Jutsu !!!" },
        { style: "dialogue", text: "Sasuke : \u00ab Tu ne me rattraperas jamais... \u00bb" },
        { style: "impact", text: "RASENGAN !!!" },
        { style: "narrator", text: "L'examen Ch\u016bnin entre dans sa phase finale..." },
        { style: "action", text: "LUFFY : Gomu Gomu no... PISTOL !" },
        { style: "dialogue", text: "Zoro : \u00ab Rien ne s'est passé. \u00bb" },
        { style: "impact", text: "BANKAI !!!" },
        { style: "narrator", text: "Le combat pour protéger ses amis continue..." },
      ]
    }
  },
  // 7 — Gulli — Pokémon (INCHANGÉ)
  {
    name: "Gulli — Pokémon", color: "#FFAA00", emoji: "\u26A1",
    bg: "#1a1500", img: "/images/tv/gulli.png",
    type: "pokemon",
    videos: [
      { platform: "dailymotion", id: "x83cp03" },  // Générique Pokémon S1 VF
      { platform: "dailymotion", id: "x2ay318" },  // Générique Pokémon S1
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
        { type: "narrator", text: "Le badge Dynamo est à portée de main !" },
      ]
    }
  },
  // 8 — Cartoon Network (NOUVEAU)
  {
    name: "Cartoon Network", color: "#00CCFF", emoji: "\u{1F4A5}",
    bg: "#0a0a1a",
    type: "cartoon_network",
    videos: [],
    content: {
      scenes: [
        { show: "Tom & Jerry", style: "slapstick", text: "SPLAAT ! Tom se prend la poêle en pleine face !", color: "#FFD700" },
        { show: "Les Supers Nanas", style: "action", text: "Belle, Bulle et Rebelle sauvent Townsville !", color: "#FF69B4" },
        { show: "Dexter", style: "dialogue", text: "Dexter : \u00ab N'entre PAS dans mon laboratoire ! \u00bb", color: "#44FF44" },
        { show: "Johnny Bravo", style: "dialogue", text: "Johnny : \u00ab Hé p'tite maman, t'as un plan de cette ville ? Parce que je me suis perdu dans tes yeux ! \u00bb", color: "#FFD700" },
        { show: "Ed, Edd & Eddy", style: "slapstick", text: "CRASH ! Le plan d'Eddy pour des jawbreakers a encore foiré !", color: "#FF8844" },
        { show: "Samurai Jack", style: "action", text: "Jack dégaine son katana... Le mal d'Aku sera vaincu !", color: "#AAAAFF" },
        { show: "Tom & Jerry", style: "slapstick", text: "Jerry nargue Tom depuis son trou dans le mur \u{1F42D}", color: "#FFD700" },
        { show: "Les Supers Nanas", style: "villain", text: "Mojo Jojo : \u00ab MON PLAN EST PARFAIT ! \u00bb", color: "#CC44FF" },
        { show: "Dexter", style: "action", text: "Dee Dee appuie sur le GROS bouton rouge... BOOOM !", color: "#FF4444" },
        { show: "Johnny Bravo", style: "slapstick", text: "WHAM ! Johnny se fait encore gifler \u{1F44B}", color: "#FFD700" },
      ]
    }
  },
  // 9 — Jetix (NOUVEAU)
  {
    name: "Jetix", color: "#FF3300", emoji: "\u{1F9B8}",
    bg: "#1a0500",
    type: "jetix",
    videos: [],
    content: {
      scenes: [
        { show: "Spider-Man", text: "Spider-Man lance sa toile entre les gratte-ciels de New York !", icon: "\u{1F577}\uFE0F" },
        { show: "Batman", text: "Batman surveille Gotham depuis les toits... La nuit est sombre.", icon: "\u{1F987}" },
        { show: "X-Men", text: "Wolverine : \u00ab Je suis le meilleur dans ce que je fais ! \u00bb", icon: "\u2694\uFE0F" },
        { show: "Power Rangers", text: "IT'S MORPHIN' TIME ! \u{1F4A5} Go Go Power Rangers !", icon: "\u26A1" },
        { show: "Sonic X", text: "Sonic fonce à la vitesse du son ! Gotta go fast !", icon: "\u{1F4A8}" },
        { show: "Spider-Man", text: "Avec de grands pouvoirs viennent de grandes responsabilités...", icon: "\u{1F577}\uFE0F" },
        { show: "Power Rangers", text: "Megazord assemblé ! Les Zords fusionnent !", icon: "\u{1F916}" },
        { show: "Batman", text: "Le Joker s'est échappé d'Arkham... encore.", icon: "\u{1F0CF}" },
        { show: "Les Lascars", text: "Tony et José traînent dans le quartier... des embrouilles en vue !", icon: "\u{1F3D9}\uFE0F" },
        { show: "X-Men", text: "Le Professeur Xavier détecte un nouveau mutant avec Cerebro !", icon: "\u{1F9E0}" },
      ]
    }
  },
  // 10 — TF1 Prime — Jeux TV (NOUVEAU)
  {
    name: "TF1 — Jeux TV", color: "#FFD700", emoji: "\u{1F3B0}",
    bg: "#1a1500", img: "/images/tv/tf1.svg",
    type: "jeuxtv",
    videos: [],
    content: {
      jeux: [
        {
          nom: "Qui veut gagner des millions ?",
          scenes: [
            "Jean-Pierre Foucault : \u00ab C'est votre dernier mot ? \u00bb",
            "Le candidat hésite... 50/50 ou appel à un ami ?",
            "Bonne réponse ! On passe à 16 000 euros !",
            "Jean-Pierre : \u00ab Vous repartez avec 32 000 euros ! \u00bb",
          ]
        },
        {
          nom: "Le Maillon Faible",
          scenes: [
            "Laurence Boccolini : \u00ab Vous ÊTES le maillon faible. Au revoir. \u00bb",
            "La banque s'élève à 4 500 euros...",
            "Nouveau tour ! 60 secondes au chrono !",
            "Laurence : \u00ab Qui mérite de rester dans l'équipe ? \u00bb",
          ]
        },
        {
          nom: "Attention à la marche !",
          scenes: [
            "Le candidat monte d'une marche ! Bravo !",
            "Oh non... il tombe d'une marche !",
            "Jean-Luc Reichmann : \u00ab Attention... à la MARCHE ! \u00bb",
            "Le champion est toujours en haut ! Qui l'arrêtera ?",
          ]
        },
        {
          nom: "Le Bigdil",
          scenes: [
            "Bill le bison débarque sur le plateau !",
            "Vincent Lagaf' : \u00ab C'est le BIGDIL ! \u00bb",
            "Le lot mystère : une voiture ou... une brouette ?!",
            "Bill fait tomber les décors... encore une fois !",
          ]
        },
      ]
    }
  },
];
