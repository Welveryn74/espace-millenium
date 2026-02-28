// Panini Football Album - Coupe du Monde 2002 / Euro 2004 vibes
// Each page has 8 sticker slots, some filled, some missing

const PLAYERS = [
  // France
  { name: "Zinedine Zidane", team: "France", number: 10 },
  { name: "Thierry Henry", team: "France", number: 12 },
  { name: "Patrick Vieira", team: "France", number: 4 },
  { name: "David Trezeguet", team: "France", number: 20 },
  { name: "Fabien Barthez", team: "France", number: 1 },
  { name: "Robert Pires", team: "France", number: 7 },
  { name: "Lilian Thuram", team: "France", number: 15 },
  { name: "Marcel Desailly", team: "France", number: 8 },
  // Brazil
  { name: "Ronaldo", team: "Bresil", number: 9 },
  { name: "Ronaldinho", team: "Bresil", number: 11 },
  { name: "Roberto Carlos", team: "Bresil", number: 6 },
  { name: "Rivaldo", team: "Bresil", number: 10 },
  { name: "Cafu", team: "Bresil", number: 2 },
  { name: "Kaka", team: "Bresil", number: 8 },
  { name: "Adriano", team: "Bresil", number: 7 },
  { name: "Dida", team: "Bresil", number: 1 },
  // England
  { name: "David Beckham", team: "Angleterre", number: 7 },
  { name: "Michael Owen", team: "Angleterre", number: 10 },
  { name: "Steven Gerrard", team: "Angleterre", number: 4 },
  { name: "Wayne Rooney", team: "Angleterre", number: 9 },
  { name: "Frank Lampard", team: "Angleterre", number: 8 },
  { name: "Rio Ferdinand", team: "Angleterre", number: 5 },
  { name: "Ashley Cole", team: "Angleterre", number: 3 },
  { name: "Paul Scholes", team: "Angleterre", number: 18 },
  // Italy
  { name: "Francesco Totti", team: "Italie", number: 10 },
  { name: "Alessandro Del Piero", team: "Italie", number: 7 },
  { name: "Gianluigi Buffon", team: "Italie", number: 1 },
  { name: "Paolo Maldini", team: "Italie", number: 3 },
  { name: "Andrea Pirlo", team: "Italie", number: 21 },
  { name: "Fabio Cannavaro", team: "Italie", number: 5 },
  { name: "Alessandro Nesta", team: "Italie", number: 13 },
  { name: "Christian Vieri", team: "Italie", number: 9 },
  // Spain
  { name: "Raul", team: "Espagne", number: 7 },
  { name: "Iker Casillas", team: "Espagne", number: 1 },
  { name: "Xavi", team: "Espagne", number: 6 },
  { name: "Fernando Torres", team: "Espagne", number: 9 },
  { name: "Carles Puyol", team: "Espagne", number: 5 },
  { name: "Michel Salgado", team: "Espagne", number: 2 },
  { name: "Fernando Morientes", team: "Espagne", number: 19 },
  { name: "Vicente", team: "Espagne", number: 21 },
  // Germany
  { name: "Oliver Kahn", team: "Allemagne", number: 1 },
  { name: "Michael Ballack", team: "Allemagne", number: 13 },
  { name: "Miroslav Klose", team: "Allemagne", number: 11 },
  { name: "Philipp Lahm", team: "Allemagne", number: 16 },
  { name: "Bastian Schweinsteiger", team: "Allemagne", number: 7 },
  { name: "Lukas Podolski", team: "Allemagne", number: 20 },
  { name: "Torsten Frings", team: "Allemagne", number: 8 },
  { name: "Jens Lehmann", team: "Allemagne", number: 1 },
];

const TEAMS_PER_PAGE = [
  "France", "Bresil", "Angleterre", "Italie", "Espagne", "Allemagne",
];

// Build album pages from player data
// Each page = one team, 8 sticker slots
export const ALBUM_PAGES = TEAMS_PER_PAGE.map((team) => {
  const teamPlayers = PLAYERS.filter((p) => p.team === team);
  return {
    team,
    stickers: teamPlayers.map((player) => ({ ...player })),
  };
});

export const ALL_STICKER_NAMES = PLAYERS.map((p) => p.name);
export const ALBUM_TITLE = "PANINI Football 2002";
export const TOTAL_STICKERS = PLAYERS.length;
