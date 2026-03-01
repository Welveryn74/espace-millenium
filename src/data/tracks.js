// Fréquences utiles
const C4=262,D4=294,E4=330,F4=349,G4=392,A4=440,B4=494;
const C5=523,D5=587,E5=659,F5=698,G5=784,A5=880,B5=988;
const C3=131,D3=147,E3=165,F3=175,G3=196,A3=220,B3=247;
const Ab4=415,Bb4=466,Eb4=311,Eb5=622,Gb4=370,Ab5=831,Bb5=932;
const Db5=554,Bb3=233,Ab3=208;
const R=0; // silence

export const TRACKS = [
  {
    title: "Lorie — Sur un air latino", duration: "3:42", genre: "Pop FR",
    cover: "/images/mp3/lorie-sur-un-air-latino.jpg",
    previewUrl: "https://p.scdn.co/mp3-preview/9ac40b4f0b884a9e744f03bbf81c76fc84b95a21",
    melody: { bpm: 130, wave: "square", notes: [
      [E5,1,0.5],[D5,0.5,0.4],[C5,0.5,0.4],[D5,1,0.5],[E5,1,0.5],[E5,1,0.5],[D5,1,0.4],
      [C5,0.5,0.4],[D5,0.5,0.4],[E5,1,0.5],[D5,1,0.4],[C5,1,0.5],[R,0.5],
    ], bass: [
      [C3,2,0.4],[G3,2,0.4],[A3,2,0.4],[G3,2,0.4],[C3,2,0.4],[G3,1,0.3],
    ] }
  },
  {
    title: "Britney Spears — Toxic", duration: "3:31", genre: "Pop",
    cover: "/images/mp3/britney-toxic.jpg",
    previewUrl: "https://p.scdn.co/mp3-preview/6de2791f84c1d637a0e24734b6df3997cc742da4",
    melody: { bpm: 143, wave: "square", notes: [
      [E5,0.5,0.5],[Eb5,0.5,0.5],[E5,0.5,0.5],[Eb5,0.5,0.5],[C5,1,0.4],[R,0.5],
      [E5,0.5,0.5],[Eb5,0.5,0.5],[E5,0.5,0.5],[Eb5,0.5,0.5],[B4,1,0.4],[R,0.5],
      [C5,1,0.5],[B4,0.5,0.4],[A4,1.5,0.5],
    ], bass: [
      [A3,2,0.4],[E3,2,0.4],[A3,2,0.4],[B3,2,0.4],[A3,1,0.3],
    ] }
  },
  {
    title: "Eminem — Lose Yourself", duration: "5:26", genre: "Rap",
    cover: "/images/mp3/eminem-lose-yourself.jpg",
    previewUrl: "https://p.scdn.co/mp3-preview/f943c5b5954918a2dbeb13981861859f77978d12",
    melody: { bpm: 86, wave: "square", notes: [
      [D4,0.5,0.5],[D4,0.5,0.5],[D4,0.5,0.4],[D4,0.5,0.4],[D4,0.5,0.5],[E4,0.5,0.4],[F4,1,0.5],
      [D4,0.5,0.4],[D4,0.5,0.4],[D4,0.5,0.5],[E4,0.5,0.4],[C4,1.5,0.5],[R,0.5],
    ], bass: [
      [D3,2,0.5],[D3,2,0.5],[C3,2,0.4],[C3,1,0.4],[D3,1,0.5],
    ] }
  },
  {
    title: "Green Day — Boulevard of Broken Dreams", duration: "4:20", genre: "Rock",
    cover: "/images/mp3/green-day-boulevard.jpg",
    previewUrl: "https://p.scdn.co/mp3-preview/258775e7324ab09be650b91d322d22948ed9df1a",
    melody: { bpm: 86, wave: "sawtooth", notes: [
      [F4,1,0.4],[Ab4,1,0.5],[Bb4,1.5,0.5],[Ab4,0.5,0.4],
      [F4,1,0.4],[Ab4,1,0.5],[Bb4,1,0.5],[C5,1,0.5],[Bb4,1,0.4],[R,0.5],
    ], bass: [
      [F3,2,0.4],[Ab4,2,0.3],[Bb4,2,0.4],[F3,2,0.4],[R,1],
    ] }
  },
  {
    title: "Black Eyed Peas — Where Is The Love?", duration: "4:32", genre: "Pop",
    cover: "/images/mp3/bep-where-is-the-love.jpg",
    previewUrl: "https://p.scdn.co/mp3-preview/a8e15b9256e129c55789674b78041ede8bf91531",
    melody: { bpm: 106, wave: "square", notes: [
      [A4,1,0.5],[G4,0.5,0.4],[A4,0.5,0.4],[C5,1.5,0.5],[R,0.5],
      [A4,0.5,0.4],[G4,0.5,0.4],[A4,1,0.5],[G4,1,0.4],[E4,1.5,0.5],[R,0.5],
    ], bass: [
      [A3,2,0.4],[C3,2,0.4],[G3,2,0.4],[A3,2,0.4],
    ] }
  },
  {
    title: "Crazy Frog — Axel F", duration: "2:53", genre: "WTF",
    cover: "/images/mp3/crazy-frog.jpg",
    previewUrl: "https://p.scdn.co/mp3-preview/fe71c57497b0415939326c8da018869fd22431e4",
    melody: { bpm: 140, wave: "square", notes: [
      [A4,0.5,0.5],[R,0.25],[C5,0.5,0.5],[R,0.25],[A4,0.25,0.4],[A4,0.5,0.5],[D5,0.5,0.5],[A4,0.5,0.4],
      [G4,0.5,0.5],[R,0.25],[A4,0.5,0.5],[R,0.25],[E5,0.5,0.5],[A4,0.5,0.4],[A4,0.25,0.4],[G4,0.5,0.5],
      [E4,0.5,0.4],[A4,1,0.5],[R,0.25],
    ], bass: [
      [D3,2,0.5],[D3,2,0.5],[G3,2,0.4],[D3,2,0.5],[R,0.5],
    ] }
  },
  {
    title: "Evanescence — Bring Me To Life", duration: "3:58", genre: "Rock",
    cover: "/images/mp3/evanescence-bring-me.jpg",
    previewUrl: "https://p.scdn.co/mp3-preview/d318a788a3a6a1ecb8cd0f1c924cef18832ff8d2",
    melody: { bpm: 97, wave: "sawtooth", notes: [
      [E4,1,0.5],[E4,0.5,0.4],[G4,1,0.5],[A4,1.5,0.5],
      [G4,0.5,0.4],[E4,0.5,0.4],[D4,2,0.5],[R,0.5],
      [E4,1,0.5],[G4,1,0.5],[A4,1,0.5],[B4,1.5,0.5],[R,0.5],
    ], bass: [
      [E3,2,0.5],[B3,2,0.4],[C3,2,0.4],[D3,2,0.5],[E3,1,0.4],
    ] }
  },
  {
    title: "50 Cent — In Da Club", duration: "3:43", genre: "Rap",
    cover: "/images/mp3/50-cent-in-da-club.jpg",
    previewUrl: "https://p.scdn.co/mp3-preview/c0199e9be373d6a82ae89071ae34dd38ec72b99c",
    melody: { bpm: 90, wave: "square", notes: [
      [G4,0.5,0.5],[G4,0.5,0.4],[Bb4,0.5,0.5],[G4,0.5,0.4],[F4,0.5,0.4],[G4,1,0.5],[R,0.5],
      [G4,0.5,0.4],[G4,0.5,0.4],[Bb4,0.5,0.5],[G4,0.5,0.4],[F4,0.5,0.4],[Eb4,1.5,0.5],[R,0.5],
    ], bass: [
      [G3,2,0.5],[Eb4,2,0.4],[F3,2,0.4],[G3,2,0.5],
    ] }
  },
  {
    title: "Daft Punk — One More Time", duration: "5:20", genre: "Electro",
    cover: "/images/mp3/daft-punk-one-more-time.svg",
    previewUrl: "https://p.scdn.co/mp3-preview/06e44e119531d1117c007e2e1cb0c268f613f8b4",
    melody: { bpm: 122, wave: "triangle", notes: [
      [A4,1,0.5],[A4,0.5,0.4],[G4,0.5,0.4],[A4,1,0.5],[C5,1,0.5],[R,0.5],
      [A4,1,0.5],[G4,0.5,0.4],[A4,0.5,0.4],[G4,1,0.4],[E4,1.5,0.5],[R,0.5],
    ], bass: [
      [A3,1,0.4],[A3,1,0.4],[C3,1,0.4],[C3,1,0.4],[F3,1,0.4],[F3,1,0.4],[G3,1,0.4],[G3,1,0.4],
    ] }
  },
  {
    title: "Calogero — En apesanteur", duration: "4:08", genre: "Pop FR",
    cover: "/images/mp3/calogero-apesanteur.jpg",
    previewUrl: "https://p.scdn.co/mp3-preview/511f08320d02d2b0d186bbbd7be5f1443804222e",
    melody: { bpm: 76, wave: "triangle", notes: [
      [E4,1.5,0.5],[G4,1,0.4],[A4,1.5,0.5],[G4,1,0.4],
      [E4,1.5,0.5],[D4,1,0.4],[C4,2,0.5],[R,0.5],
    ], bass: [
      [C3,2,0.4],[G3,2,0.3],[A3,2,0.4],[E3,2,0.4],[C3,1,0.3],
    ] }
  },
  // ── Ajouts années 2000 ──────────────────────────────
  {
    title: "Alizée — Moi… Lolita", duration: "4:28", genre: "Pop FR",
    cover: "/images/mp3/alizee-lolita.svg", previewUrl: "https://p.scdn.co/mp3-preview/faf1207ab659f222e19a05bc690e502dec14ba5e",
    melody: { bpm: 116, wave: "square", notes: [
      [A4,0.5,0.5],[A4,0.5,0.4],[A4,0.5,0.4],[G4,0.5,0.4],[A4,1,0.5],[C5,1,0.5],[B4,0.5,0.4],[A4,0.5,0.4],[G4,1,0.4],[E4,1.5,0.5],[R,0.5],
      [A4,0.5,0.4],[A4,0.5,0.4],[G4,0.5,0.4],[A4,1,0.5],[C5,0.5,0.4],[B4,1,0.5],[A4,1.5,0.5],[R,0.5],
    ], bass: [
      [A3,2,0.4],[E3,2,0.4],[F3,2,0.4],[G3,2,0.4],
    ] }
  },
  {
    title: "Linkin Park — In The End", duration: "3:36", genre: "Rock",
    cover: "/images/mp3/linkin-park-in-the-end.svg", previewUrl: "https://p.scdn.co/mp3-preview/b5ee275ca337899f762b1c1883c11e24a04075b0",
    melody: { bpm: 105, wave: "triangle", notes: [
      [Bb4,0.5,0.5],[Eb5,0.5,0.5],[Bb4,0.5,0.4],[Ab4,0.5,0.4],[Bb4,0.5,0.5],[Eb5,0.5,0.5],[G4,0.5,0.4],[Ab4,0.5,0.4],
      [Bb4,0.5,0.5],[Eb5,0.5,0.5],[Bb4,0.5,0.4],[Ab4,0.5,0.4],[G4,1,0.4],[Ab4,1,0.5],[R,0.5],
    ], bass: [
      [C3,2,0.5],[G3,2,0.4],[A3,2,0.4],[B3,2,0.4],
    ] }
  },
  {
    title: "The White Stripes — Seven Nation Army", duration: "3:52", genre: "Rock",
    cover: "/images/mp3/white-stripes-seven-nation.svg", previewUrl: "https://p.scdn.co/mp3-preview/0f93c89eb8e96e2aacccee68dd7c966cd3b4b6d6",
    melody: { bpm: 124, wave: "sawtooth", notes: [
      [E4,1,0.5],[E4,0.5,0.5],[G4,1,0.5],[E4,0.5,0.5],[D4,1,0.5],[C4,1.5,0.5],[B3,2,0.5],[R,1],
      [E4,1,0.5],[E4,0.5,0.5],[G4,1,0.5],[E4,0.5,0.5],[D4,1,0.5],[C4,1,0.5],[D4,0.5,0.4],[C4,2,0.5],[R,1],
    ], bass: [
      [E3,1,0.5],[E3,0.5,0.5],[G3,1,0.5],[E3,0.5,0.4],[D3,1,0.5],[C3,1.5,0.5],[B3,2,0.5],[R,1],
    ] }
  },
  {
    title: "Outkast — Hey Ya!", duration: "3:55", genre: "Pop",
    cover: "/images/mp3/outkast-hey-ya.svg", previewUrl: "https://p.scdn.co/mp3-preview/d24b3c4135ced9157b0ea3015a6bcc048e0c2e3a",
    melody: { bpm: 160, wave: "square", notes: [
      [G4,0.5,0.5],[G4,0.5,0.4],[A4,0.5,0.5],[G4,0.5,0.4],[E4,1,0.5],[R,0.5],[E4,0.5,0.4],[G4,0.5,0.4],[A4,0.5,0.5],[G4,1,0.5],[R,0.5],
      [E4,0.5,0.4],[D4,0.5,0.4],[E4,0.5,0.4],[G4,1,0.5],[A4,1,0.5],[G4,1.5,0.5],[R,0.5],
    ], bass: [
      [G3,2,0.4],[C3,2,0.4],[D3,2,0.4],[E3,2,0.4],
    ] }
  },
  {
    title: "Avril Lavigne — Complicated", duration: "4:04", genre: "Pop Rock",
    cover: "/images/mp3/avril-lavigne-complicated.svg", previewUrl: "https://p.scdn.co/mp3-preview/34657059f6a40050f96e3cbf3d929aa595f5dd60",
    melody: { bpm: 78, wave: "sawtooth", notes: [
      [D4,0.5,0.5],[D4,0.5,0.4],[D4,0.5,0.4],[C4,0.5,0.4],[D4,1,0.5],[F4,1,0.5],[E4,0.5,0.4],[D4,0.5,0.4],[C4,1.5,0.5],[R,0.5],
      [A4,0.5,0.5],[A4,0.5,0.4],[G4,0.5,0.4],[F4,0.5,0.4],[G4,1,0.5],[A4,1,0.5],[G4,1,0.4],[F4,1.5,0.5],[R,0.5],
    ], bass: [
      [D3,2,0.4],[A3,2,0.4],[F3,2,0.4],[C3,2,0.4],
    ] }
  },
  {
    title: "Shakira — Whenever, Wherever", duration: "3:16", genre: "Pop",
    cover: "/images/mp3/shakira-whenever.svg", previewUrl: "https://p.scdn.co/mp3-preview/93dc52d836150fba41afeb6df2e9167875c7d8fb",
    melody: { bpm: 100, wave: "triangle", notes: [
      [A4,1,0.5],[A4,0.5,0.4],[B4,0.5,0.4],[C5,1.5,0.5],[B4,0.5,0.4],[A4,1,0.5],[G4,1,0.4],[R,0.5],
      [A4,0.5,0.4],[B4,0.5,0.4],[C5,1,0.5],[D5,1,0.5],[C5,0.5,0.4],[B4,0.5,0.4],[A4,1.5,0.5],[R,0.5],
    ], bass: [
      [A3,2,0.4],[E3,2,0.4],[F3,2,0.4],[G3,2,0.4],[A3,1,0.3],
    ] }
  },
  {
    title: "Gorillaz — Feel Good Inc.", duration: "3:41", genre: "Electro",
    cover: "/images/mp3/gorillaz-feel-good.svg", previewUrl: "https://p.scdn.co/mp3-preview/b13a1bb2d8a04132982a49b6efee933cc9d67c7e",
    melody: { bpm: 139, wave: "square", notes: [
      [E4,0.5,0.5],[E4,0.5,0.4],[G4,0.5,0.5],[E4,0.5,0.4],[D4,0.5,0.4],[E4,1,0.5],[R,0.25],
      [E4,0.5,0.5],[E4,0.5,0.4],[G4,0.5,0.5],[E4,0.5,0.4],[D4,0.5,0.4],[C4,1,0.5],[R,0.5],
    ], bass: [
      [E3,2,0.5],[G3,2,0.4],[D3,2,0.4],[E3,2,0.5],
    ] }
  },
  {
    title: "Usher — Yeah!", duration: "4:09", genre: "R&B",
    cover: "/images/mp3/usher-yeah.svg", previewUrl: "https://p.scdn.co/mp3-preview/1eca1cb525c2b0df2ecba52f1105f139323e09a2",
    melody: { bpm: 105, wave: "square", notes: [
      [D4,0.5,0.5],[D4,0.5,0.4],[F4,0.5,0.5],[D4,0.5,0.4],[G4,1,0.5],[F4,0.5,0.4],[D4,0.5,0.4],[R,0.5],
      [D4,0.5,0.4],[F4,0.5,0.5],[G4,1,0.5],[A4,1,0.5],[G4,0.5,0.4],[F4,0.5,0.4],[D4,1.5,0.5],[R,0.5],
    ], bass: [
      [D3,2,0.5],[G3,2,0.4],[A3,2,0.4],[D3,2,0.5],
    ] }
  },
  {
    title: "K-Maro — Femme Like U", duration: "3:44", genre: "Pop FR",
    cover: "/images/mp3/k-maro-femme-like-u.svg", previewUrl: "https://p.scdn.co/mp3-preview/5eb4b863c22356d5131b140843cc59c5808ec873",
    melody: { bpm: 96, wave: "square", notes: [
      [A4,0.5,0.5],[C5,0.5,0.5],[B4,0.5,0.4],[A4,0.5,0.4],[G4,1,0.5],[E4,1,0.4],[R,0.5],
      [G4,0.5,0.4],[A4,0.5,0.4],[G4,0.5,0.4],[E4,0.5,0.4],[D4,1,0.5],[E4,1.5,0.5],[R,0.5],
    ], bass: [
      [A3,2,0.4],[E3,2,0.4],[G3,2,0.4],[D3,2,0.4],
    ] }
  },
  {
    title: "Blink-182 — All The Small Things", duration: "2:48", genre: "Rock",
    cover: "/images/mp3/blink-182-small-things.svg", previewUrl: "https://p.scdn.co/mp3-preview/b1447b8d76183737ea2ebd10f70da6292904f833",
    melody: { bpm: 148, wave: "sawtooth", notes: [
      [C5,0.5,0.5],[D5,0.5,0.5],[F5,0.5,0.5],[D5,0.5,0.4],[C5,1,0.5],[R,0.25],
      [C5,0.5,0.5],[D5,0.5,0.5],[F5,0.5,0.5],[D5,1,0.5],[C5,0.5,0.4],[A4,1,0.5],[R,0.5],
    ], bass: [
      [C3,2,0.5],[F3,2,0.4],[G3,2,0.4],[C3,2,0.5],
    ] }
  },
  {
    title: "Bob Sinclar — Love Generation", duration: "3:01", genre: "Electro",
    cover: "/images/mp3/bob-sinclar-love-generation.svg", previewUrl: "https://p.scdn.co/mp3-preview/f4ab6ec92cc297c1e8f5c26ddf7465f4a430c80c",
    melody: { bpm: 128, wave: "triangle", notes: [
      [E5,0.5,0.5],[D5,0.5,0.4],[C5,0.5,0.4],[D5,0.5,0.4],[E5,1,0.5],[E5,0.5,0.5],[D5,0.5,0.4],
      [C5,0.5,0.4],[D5,0.5,0.4],[E5,0.5,0.5],[D5,0.5,0.4],[C5,1.5,0.5],[R,0.5],
    ], bass: [
      [C3,1,0.4],[C3,1,0.4],[F3,1,0.4],[F3,1,0.4],[G3,1,0.4],[G3,1,0.4],[C3,1,0.4],[C3,1,0.4],
    ] }
  },
  {
    title: "Destiny's Child — Survivor", duration: "4:01", genre: "R&B",
    cover: "/images/mp3/destinys-child-survivor.svg", previewUrl: "https://p.scdn.co/mp3-preview/a0cbac2664d8cc005454d3a5b2e27878a62e1edd",
    melody: { bpm: 92, wave: "square", notes: [
      [E4,0.5,0.5],[E4,0.5,0.4],[G4,0.5,0.5],[A4,1,0.5],[G4,0.5,0.4],[E4,0.5,0.4],[D4,1,0.5],[R,0.5],
      [E4,0.5,0.4],[E4,0.5,0.4],[G4,0.5,0.5],[A4,1,0.5],[C5,1,0.5],[A4,0.5,0.4],[G4,1.5,0.5],[R,0.5],
    ], bass: [
      [A3,2,0.4],[E3,2,0.4],[G3,2,0.4],[D3,2,0.4],[A3,1,0.3],
    ] }
  },
  {
    title: "Nelly — Hot in Herre", duration: "3:50", genre: "Rap",
    cover: "/images/mp3/nelly-hot-in-herre.svg", previewUrl: "https://p.scdn.co/mp3-preview/e3d856695fd100c4c2cf21e6c65fac1e0649cc02",
    melody: { bpm: 80, wave: "square", notes: [
      [E4,0.5,0.5],[G4,0.5,0.5],[A4,0.5,0.5],[G4,0.5,0.4],[E4,1,0.5],[D4,0.5,0.4],[E4,1,0.5],[R,0.5],
      [E4,0.5,0.4],[G4,0.5,0.5],[A4,0.5,0.5],[B4,0.5,0.5],[A4,0.5,0.4],[G4,0.5,0.4],[E4,1.5,0.5],[R,0.5],
    ], bass: [
      [E3,2,0.5],[G3,2,0.4],[A3,2,0.4],[E3,2,0.5],
    ] }
  },
  {
    title: "Jenifer — Au Soleil", duration: "3:58", genre: "Pop FR",
    cover: "/images/mp3/jenifer-au-soleil.svg", previewUrl: "https://p.scdn.co/mp3-preview/b4c036a64bc6b8688c5814f2ff76f3477a525166",
    melody: { bpm: 108, wave: "triangle", notes: [
      [G4,1,0.5],[A4,0.5,0.4],[B4,1,0.5],[D5,1,0.5],[B4,0.5,0.4],[A4,0.5,0.4],[G4,1.5,0.5],[R,0.5],
      [G4,0.5,0.4],[A4,0.5,0.4],[B4,1,0.5],[A4,1,0.5],[G4,0.5,0.4],[E4,1,0.5],[D4,1.5,0.5],[R,0.5],
    ], bass: [
      [G3,2,0.4],[D3,2,0.4],[E3,2,0.4],[C3,2,0.4],
    ] }
  },
  {
    title: "Benny Benassi — Satisfaction", duration: "2:52", genre: "Electro",
    cover: "/images/mp3/benny-benassi-satisfaction.svg", previewUrl: "https://p.scdn.co/mp3-preview/c9ba41fd56c50e4af303216b3a76bb1372ef1e00",
    melody: { bpm: 130, wave: "square", notes: [
      [E4,0.5,0.5],[E4,0.5,0.5],[G4,0.5,0.5],[A4,0.5,0.5],[G4,0.5,0.4],[E4,0.5,0.4],[E4,0.5,0.5],[R,0.25],
      [E4,0.5,0.5],[G4,0.5,0.5],[A4,0.5,0.5],[B4,0.5,0.5],[A4,0.5,0.4],[G4,0.5,0.4],[E4,1,0.5],[R,0.5],
    ], bass: [
      [E3,2,0.5],[E3,2,0.5],[A3,2,0.4],[E3,2,0.5],
    ] }
  },
  // ── Ajouts vague 2 ─────────────────────────────
  {
    title: "Coldplay — Clocks", duration: "5:07", genre: "Rock",
    cover: "/images/mp3/coldplay-clocks.svg", previewUrl: "https://p.scdn.co/mp3-preview/f7af250125a083c8212e4b7dd508a12c12aeac37",
    melody: { bpm: 131, wave: "triangle", notes: [
      [Eb5,0.5,0.5],[Bb4,0.5,0.4],[G4,0.5,0.4],[Eb5,0.5,0.5],[Bb4,0.5,0.4],[G4,0.5,0.4],
      [Eb5,0.5,0.5],[Bb4,0.5,0.4],[G4,1,0.5],[R,0.5],
      [Eb5,0.5,0.5],[Bb4,0.5,0.4],[Ab4,0.5,0.4],[Eb5,0.5,0.5],[Bb4,0.5,0.4],[Ab4,1,0.5],[R,0.5],
    ], bass: [
      [Eb4,2,0.4],[Bb3,2,0.4],[F3,2,0.4],[Ab3,2,0.4],
    ] }
  },
  {
    title: "Christina Aguilera — Beautiful", duration: "3:58", genre: "Pop",
    cover: "/images/mp3/aguilera-beautiful.svg", previewUrl: "https://p.scdn.co/mp3-preview/c0187def7753b97d1ff388ef4cfb6078da0d7481",
    melody: { bpm: 76, wave: "triangle", notes: [
      [Eb5,1.5,0.5],[D5,0.5,0.4],[Eb5,1,0.5],[Bb4,1.5,0.5],[R,0.5],
      [G4,1,0.4],[Ab4,1,0.5],[Bb4,1.5,0.5],[Ab4,0.5,0.4],[G4,2,0.5],[R,0.5],
    ], bass: [
      [Eb4,2,0.4],[Bb3,2,0.3],[C3,2,0.4],[Ab3,2,0.4],
    ] }
  },
  {
    title: "Sean Paul — Get Busy", duration: "3:30", genre: "Dancehall",
    cover: "/images/mp3/sean-paul-get-busy.svg", previewUrl: "https://p.scdn.co/mp3-preview/4b9d5a3ffc001106bd73da2759abbdb528af64a7",
    melody: { bpm: 100, wave: "square", notes: [
      [A4,0.5,0.5],[A4,0.5,0.4],[C5,0.5,0.5],[A4,0.5,0.4],[G4,0.5,0.4],[A4,1,0.5],[R,0.5],
      [E4,0.5,0.4],[G4,0.5,0.4],[A4,1,0.5],[G4,0.5,0.4],[E4,0.5,0.4],[D4,1.5,0.5],[R,0.5],
    ], bass: [
      [A3,2,0.4],[E3,2,0.4],[G3,2,0.4],[D3,2,0.4],
    ] }
  },
  {
    title: "Justin Timberlake — Cry Me a River", duration: "4:48", genre: "Pop",
    cover: "/images/mp3/jt-cry-me-a-river.svg", previewUrl: "https://p.scdn.co/mp3-preview/143896ba6eee1270f4116cec384bb3bcce09d6eb",
    melody: { bpm: 76, wave: "triangle", notes: [
      [A4,1,0.5],[C5,1,0.5],[B4,0.5,0.4],[A4,0.5,0.4],[G4,1.5,0.5],[R,0.5],
      [A4,0.5,0.4],[B4,0.5,0.4],[C5,1,0.5],[A4,1,0.5],[G4,0.5,0.4],[E4,1.5,0.5],[R,0.5],
    ], bass: [
      [A3,2,0.4],[F3,2,0.4],[G3,2,0.4],[E3,2,0.4],
    ] }
  },
  {
    title: "System of a Down — Chop Suey!", duration: "3:30", genre: "Rock",
    cover: "/images/mp3/soad-chop-suey.svg", previewUrl: "https://p.scdn.co/mp3-preview/00ee92420f3919ac0014fdb108b747abd704f2fe",
    melody: { bpm: 128, wave: "sawtooth", notes: [
      [G4,0.5,0.5],[G4,0.5,0.5],[Bb4,0.5,0.5],[G4,0.5,0.4],[F4,0.5,0.4],[G4,0.5,0.5],[Eb4,1,0.5],[R,0.25],
      [G4,0.5,0.5],[Bb4,0.5,0.5],[C5,1,0.5],[Bb4,0.5,0.4],[G4,0.5,0.4],[F4,1,0.5],[R,0.5],
    ], bass: [
      [G3,2,0.5],[E3,2,0.5],[F3,2,0.4],[G3,2,0.5],
    ] }
  },
  {
    title: "Beyoncé — Crazy in Love", duration: "3:56", genre: "R&B",
    cover: "/images/mp3/beyonce-crazy-in-love.svg", previewUrl: "https://p.scdn.co/mp3-preview/bcd82e2e27606ec0a0d024e10dfdec5c58188a53",
    melody: { bpm: 100, wave: "square", notes: [
      [D4,0.5,0.5],[D4,0.5,0.5],[F4,0.5,0.5],[D4,0.5,0.4],[A4,1,0.5],[G4,0.5,0.4],[F4,0.5,0.4],[D4,1,0.5],[R,0.5],
      [D4,0.5,0.4],[F4,0.5,0.5],[A4,1,0.5],[G4,1,0.5],[F4,0.5,0.4],[D4,0.5,0.4],[C4,1.5,0.5],[R,0.5],
    ], bass: [
      [D3,2,0.5],[A3,2,0.4],[F3,2,0.4],[G3,2,0.4],
    ] }
  },
  {
    title: "Modjo — Lady (Hear Me Tonight)", duration: "3:38", genre: "Electro",
    cover: "/images/mp3/modjo-lady.svg", previewUrl: "https://p.scdn.co/mp3-preview/05e58f0bcf5a9a29f60d5aa4fd685a528a59f328",
    melody: { bpm: 122, wave: "triangle", notes: [
      [A4,0.5,0.5],[C5,0.5,0.5],[E5,0.5,0.5],[C5,0.5,0.4],[A4,1,0.5],[G4,0.5,0.4],[A4,0.5,0.4],
      [C5,0.5,0.4],[A4,0.5,0.4],[G4,0.5,0.4],[E4,0.5,0.4],[G4,1,0.5],[A4,1.5,0.5],[R,0.5],
    ], bass: [
      [A3,1,0.4],[A3,1,0.4],[C3,1,0.4],[C3,1,0.4],[F3,1,0.4],[F3,1,0.4],[G3,1,0.4],[G3,1,0.4],
    ] }
  },
  {
    title: "Star Academy — La Musique", duration: "4:05", genre: "Pop FR",
    cover: "/images/mp3/star-ac-la-musique.svg", previewUrl: "https://p.scdn.co/mp3-preview/b80aa0f94cf3b38262d3c4eeb56914c3ec45785b",
    melody: { bpm: 120, wave: "square", notes: [
      [G4,1,0.5],[A4,0.5,0.4],[B4,1,0.5],[D5,1,0.5],[B4,0.5,0.4],[A4,0.5,0.4],[G4,1.5,0.5],[R,0.5],
      [G4,0.5,0.4],[A4,0.5,0.4],[B4,1,0.5],[A4,0.5,0.4],[G4,0.5,0.4],[E4,1.5,0.5],[D4,1,0.4],[R,0.5],
    ], bass: [
      [G3,2,0.4],[D3,2,0.4],[E3,2,0.4],[C3,2,0.4],
    ] }
  },
  {
    title: "Tragédie — Hey Oh", duration: "3:52", genre: "R&B",
    cover: "/images/mp3/tragedie-hey-oh.svg", previewUrl: "https://p.scdn.co/mp3-preview/62061c5fa488c21c4a093e44e4f32eafa5b8f8c1",
    melody: { bpm: 92, wave: "square", notes: [
      [A4,0.5,0.5],[A4,0.5,0.4],[C5,0.5,0.5],[B4,0.5,0.4],[A4,1,0.5],[G4,0.5,0.4],[E4,1,0.5],[R,0.5],
      [E4,0.5,0.4],[G4,0.5,0.4],[A4,1,0.5],[G4,1,0.5],[E4,0.5,0.4],[D4,1.5,0.5],[R,0.5],
    ], bass: [
      [A3,2,0.4],[E3,2,0.4],[F3,2,0.4],[D3,2,0.4],
    ] }
  },
  {
    title: "Alicia Keys — Fallin'", duration: "3:30", genre: "R&B",
    cover: "/images/mp3/alicia-keys-fallin.svg", previewUrl: "https://p.scdn.co/mp3-preview/79526addc56f4ca7b29c73df65d063b7a026a46b",
    melody: { bpm: 68, wave: "triangle", notes: [
      [E4,1.5,0.5],[G4,1,0.4],[A4,0.5,0.4],[B4,1.5,0.5],[A4,0.5,0.4],[G4,1,0.4],[E4,1,0.5],[R,0.5],
      [G4,1,0.4],[A4,0.5,0.4],[B4,1,0.5],[A4,1,0.5],[G4,0.5,0.4],[E4,2,0.5],[R,0.5],
    ], bass: [
      [E3,2,0.5],[B3,2,0.4],[C3,2,0.4],[D3,2,0.4],
    ] }
  },
  {
    title: "Red Hot Chili Peppers — Californication", duration: "5:21", genre: "Rock",
    cover: "/images/mp3/rhcp-californication.svg", previewUrl: "https://p.scdn.co/mp3-preview/0fd595c5b63db10f4a99683f8248ea5d13700683",
    melody: { bpm: 96, wave: "sawtooth", notes: [
      [A4,1,0.5],[G4,0.5,0.4],[A4,0.5,0.4],[C5,1.5,0.5],[A4,0.5,0.4],[G4,1,0.4],[E4,1,0.5],[R,0.5],
      [A4,0.5,0.4],[C5,0.5,0.4],[D5,1,0.5],[C5,0.5,0.4],[A4,0.5,0.4],[G4,1,0.5],[A4,1.5,0.5],[R,0.5],
    ], bass: [
      [A3,2,0.4],[F3,2,0.4],[C3,2,0.4],[G3,2,0.4],
    ] }
  },
  {
    title: "Ilona Mitrecey — Un monde parfait", duration: "3:25", genre: "Pop FR",
    cover: "/images/mp3/ilona-monde-parfait.svg", previewUrl: "https://p.scdn.co/mp3-preview/db0bf468f206ded7a402df86d97e0836104e0fea",
    melody: { bpm: 130, wave: "square", notes: [
      [C5,0.5,0.5],[D5,0.5,0.5],[E5,1,0.5],[G5,0.5,0.5],[E5,0.5,0.4],[D5,0.5,0.4],[C5,1.5,0.5],[R,0.5],
      [E5,0.5,0.4],[D5,0.5,0.4],[C5,0.5,0.4],[D5,0.5,0.4],[E5,1,0.5],[D5,0.5,0.4],[C5,1.5,0.5],[R,0.5],
    ], bass: [
      [C3,2,0.4],[G3,2,0.4],[A3,2,0.4],[F3,2,0.4],
    ] }
  },
  {
    title: "Sum 41 — Fat Lip", duration: "2:56", genre: "Rock",
    cover: "/images/mp3/sum-41-fat-lip.svg", previewUrl: "https://p.scdn.co/mp3-preview/ab6a3195917608bf9f386d4d7f84832b64e52cf8",
    melody: { bpm: 98, wave: "sawtooth", notes: [
      [E4,0.5,0.5],[E4,0.5,0.5],[G4,0.5,0.5],[A4,0.5,0.5],[G4,0.5,0.4],[E4,0.5,0.4],[B4,1,0.5],[A4,0.5,0.4],[G4,0.5,0.4],[E4,1,0.5],[R,0.5],
      [E4,0.5,0.4],[G4,0.5,0.5],[A4,1,0.5],[B4,0.5,0.5],[A4,0.5,0.4],[G4,0.5,0.4],[E4,1.5,0.5],[R,0.5],
    ], bass: [
      [E3,2,0.5],[G3,2,0.4],[A3,2,0.4],[E3,2,0.5],
    ] }
  },
];
