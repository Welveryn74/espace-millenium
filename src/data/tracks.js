// Fréquences utiles
const C4=262,D4=294,E4=330,F4=349,G4=392,A4=440,B4=494;
const C5=523,D5=587,E5=659,F5=698,G5=784,A5=880,B5=988;
const C3=131,D3=147,E3=165,F3=175,G3=196,A3=220,B3=247;
const Ab4=415,Bb4=466,Eb4=311,Eb5=622,Gb4=370,Ab5=831,Bb5=932;
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
    cover: "/images/mp3/daft-punk-one-more-time.jpg",
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
];
