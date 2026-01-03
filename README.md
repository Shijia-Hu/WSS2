# WSS2 Website

This repository contains a static website ready to run with a modern dev server.

## Getting started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy

This project is configured to deploy to GitHub Pages from the `main` branch.
The workflow builds the site and publishes the `dist/` folder.

## Project structure

- `index.html` — preview landing page that links into the WSS2 experience.
- `wss2.html` — main WSS2 interaction experience.
- `styles/` — extracted CSS for the landing and WSS2 pages.
- `scripts/` — extracted JS for the landing and WSS2 pages.
- `public/assets/` — static image assets referenced by the pages.
- `archive/` — legacy HTML exports kept for reference.
