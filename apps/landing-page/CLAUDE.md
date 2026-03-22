# CLAUDE.md — Landing Page

Site marketing GastonApp. React 18 + Vite + TypeScript + Tailwind CSS.

## Stack

| Lib | Version |
|---|---|
| React | ^18.2.0 |
| Vite | ^5.4.1 |
| Tailwind CSS | ^3.4.1 (+forms, +typography) |
| Headless UI | ^2.2.0 |
| FontAwesome | ^6.7.2 |
| React Router DOM | ^6.4.2 |

## Attention — Design system différent de la web app

Cette app utilise un **design system distinct** de la web app :
- **Icônes** : FontAwesome (pas Phosphor Icons)
- **Palette** : tons bleus (primary #3b82f6) — pas la palette eucalyptus de la web app
- **Pas de Mantine** — Tailwind + Headless UI uniquement
- **Font** : Nunito (cohérent avec la web app)

## Structure (src/)

```
src/
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Layout.tsx
├── pages/
│   ├── Home.tsx
│   ├── Features.tsx
│   ├── Pricing.tsx
│   └── Tutorials.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## Déploiement

Config Docker séparée dans `/.deploy-landing/` (à la racine du monorepo).

```bash
pnpm deploy:landing
pnpm docker:landing:build / docker:landing:up / docker:landing:down / docker:landing:logs
```
