# CLAUDE.md — Mobile App

App mobile GastonApp. **En cours de mise en place** — structure minimale.

## Stack

| Lib | Version |
|---|---|
| React Native | 0.74.0 |
| Expo | ~51.0.0 |
| Expo Router | ~3.5.0 |
| React | 18.2.0 |

## État actuel

L'app contient uniquement un layout root (`_layout.tsx`) et une page index (`index.tsx`). Pas encore de logique métier, pas de navigation avancée.

## Dépendances monorepo

- `@gastonapp/shared` (workspace) — AuthService, types, utils
- `@gastonapp/eslint-config` (workspace)
- `@gastonapp/typescript-config` (workspace)

## Conventions à suivre

- Expo Router pour la navigation (file-based routing)
- Partager le maximum de logique métier via `@gastonapp/shared`
- UI spécifique mobile dans cette app — composants partagés futurs dans `@gastonapp/ui`
- Suivre le design system GastonApp (Nunito, palette eucalyptus) adapté mobile

## Commandes

```bash
pnpm dev:mobile       # Expo start
expo start --ios      # iOS
expo start --android  # Android
```
