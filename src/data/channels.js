export const CHANNELS = [
  {
    name: "France 3 — Les Minikeums", color: "#FFD700", emoji: "\u{1F3AD}",
    bg: "#1a0533", img: "/images/tv/france3.png",
    type: "minikeums",
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
  {
    name: "France 2 — KD2A", color: "#FF69B4", emoji: "\u{1F4FA}",
    bg: "#0a1628", img: "/images/tv/france2.png",
    type: "kd2a",
    content: {
      programme: [
        { time: "08:30", show: "Totally Spies" },
        { time: "09:00", show: "Code Lyoko" },
        { time: "09:30", show: "Martin Mystère" },
        { time: "10:00", show: "Pokémon Advance" },
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
    name: "TF1 — Star Academy", color: "#FF4444", emoji: "\u2B50",
    bg: "#1a0a0a", img: "/images/tv/tf1.png",
    type: "starac",
    content: {
      lyrics: [
        "♫ C'est ma terre promise ♫",
        "♫ Dans cette école de la vie ♫",
        "♫ Chaque jour on grandit ♫",
        "♫ Sur la scène on brille ♫",
        "♫ Ensemble on est plus forts ♫",
        "♫ La musique est notre trésor ♫",
      ],
      nominees: ["Élodie", "Grégory", "Jenifer"],
    }
  },
  {
    name: "M6 — Loft Story", color: "#44AAFF", emoji: "\u{1F3E0}",
    bg: "#0a1a2a", img: "/images/tv/m6.png",
    type: "loft",
    content: {
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
      ]
    }
  },
  {
    name: "Canal J — Club Manga", color: "#44FF88", emoji: "\u{1F38C}",
    bg: "#0a1a10", img: "/images/tv/canalj.png",
    type: "manga",
    content: {
      panels: [
        { style: "action", text: "NARUTO : Kage Bunshin no Jutsu !!!" },
        { style: "dialogue", text: "Sasuke : « Tu ne me rattraperas jamais... »" },
        { style: "impact", text: "RASENGAN !!!" },
        { style: "narrator", text: "L'examen Chūnin entre dans sa phase finale..." },
        { style: "action", text: "LUFFY : Gomu Gomu no... PISTOL !" },
        { style: "dialogue", text: "Zoro : « Rien ne s'est passé. »" },
        { style: "impact", text: "BANKAI !!!" },
        { style: "narrator", text: "Le combat pour protéger ses amis continue..." },
      ]
    }
  },
  {
    name: "Gulli — Pokémon", color: "#FFAA00", emoji: "\u26A1",
    bg: "#1a1500", img: "/images/tv/gulli.png",
    type: "pokemon",
    content: {
      scenes: [
        { type: "narrator", text: "Sacha et Pikachu arrivent dans la ville de Poivressel !" },
        { type: "attack", text: "Pikachu utilise Tonnerre !", attacker: "Pikachu" },
        { type: "hp", target: "Ennemi Racaillou", pct: 35 },
        { type: "dialogue", text: "Sacha : « Pikachu, je te choisis ! »" },
        { type: "attack", text: "Dracaufeu utilise Lance-Flammes !", attacker: "Dracaufeu" },
        { type: "hp", target: "Ennemi Arbok", pct: 12 },
        { type: "dialogue", text: "Team Rocket : « Une fois de plus, la Team Rocket s'envole vers d'autres cieux ! »" },
        { type: "narrator", text: "Le badge Dynamo est à portée de main !" },
      ]
    }
  },
];
