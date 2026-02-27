# 🖥️ L'Espace Millénium

> Un voyage interactif et nostalgique à travers les années 2000.

Site immersif reproduisant un bureau Windows XP avec des zones thématiques interactives : MSN Messenger, Skyblog, TV cathodique, iPod, dressing Y2K/McBling, et plus encore.

## 🚀 Démarrage rapide

```bash
npm install
npm run dev
```

## 📦 Déploiement sur Vercel

1. Push le repo sur GitHub
2. Connecte-le à [vercel.com](https://vercel.com)
3. Framework preset : **Vite** (auto-détecté)
4. Clique Deploy — c'est tout !

## 🗂️ Structure

```
src/
├── main.jsx              # Point d'entrée React
├── App.jsx               # Wrapper
├── EspaceMillenium.jsx   # Composant principal (desktop + toutes les zones)
└── global.css            # Styles globaux et animations
```

## 🎯 Zones disponibles (MVP)

- 💬 **MSN Messenger** — Chat avec bot SMS, Wizz, statuts
- 📺 **TV Cathodique** — Zapping entre chaînes (Minikeums, Star Ac, Loft Story...)
- 🎵 **Lecteur MP3** — iPod avec playlist de tubes 2000s
- 📝 **Skyblog** — Interface complète avec posts en éCrItUrE aLtErNéE
- 👗 **Dressing Temporel** — Mode Y2K vs McBling
- 🎒 **Mon Cartable** — Objets de la cour de récré
- ⚠️ **Y2K Bug** — Message caché de conclusion

## 🔮 Roadmap

- [ ] Sons réels (modem, Wizz, TV)
- [ ] Salle de jeux (Game Boy, Nintendo DS, PSP)
- [ ] Responsive / mobile
- [ ] Easter eggs supplémentaires
- [ ] Animations d'ouverture de fenêtres plus poussées
- [ ] Partage social

## Tech

Vite + React 18 — Zéro dépendance externe (pas de Tailwind, pas de UI lib).
