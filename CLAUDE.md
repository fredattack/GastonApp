# CLAUDE.md — Root (Monorepo)

Instructions globales pour le monorepo GastonApp. Chaque app a son propre CLAUDE.md avec ses règles spécifiques.

## Projet

GastonApp — monorepo Turborepo (pnpm) pour gestion d'animaux et événements.

**Backend** : Laravel 12 séparé → `/Users/fred/PhpstormProjects/gaston-backend` (port 3008 en local, possède son propre CLAUDE.md).

## Apps

| App | Path | Commande | Port |
|---|---|---|---|
| Web (principale) | `apps/web/` | `pnpm dev:web` | 4480 |
| Landing page | `apps/landing-page/` | `pnpm dev:landing` | — |
| Mobile (futur) | `apps/mobile/` | `pnpm dev:mobile` | — |

## Packages partagés

| Package | Contenu actuel |
|---|---|
| `@gastonapp/shared` | AuthService, types/index.ts, utils/index.ts — **le reste du code métier est encore dans `apps/web/src/`** |
| `@gastonapp/ui` | Futur — vide |
| `@gastonapp/eslint-config` | react.js, react-native.js |
| `@gastonapp/typescript-config` | base.json, react.json, react-native.json |

## Commandes

```bash
pnpm install              # Install
pnpm dev                  # Dev toutes les apps
pnpm dev:web              # Dev web
pnpm dev:landing          # Dev landing
pnpm build:web            # Build web
pnpm build:landing        # Build landing
pnpm lint && pnpm type-check  # Qualité
pnpm clean                # Reset complet (node_modules + .turbo)
pnpm deploy               # Deploy web (Docker)
pnpm deploy:landing       # Deploy landing (Docker)
pnpm --filter @gastonapp/web <cmd>  # Commande ciblée sur un workspace
```

## Interdictions globales

- **Commit de fichiers `.env`**
- **Déplacer du code vers `packages/shared/`** sans confirmation
- **HOC** → utiliser hooks/providers

## Conventions globales

- Components `PascalCase.tsx`, hooks `useCamelCase.ts`
- State : useState → hooks → Context → Redux Toolkit
- TypeScript strict, ESLint Airbnb, Prettier
- Env : `import.meta.env.VITE_*`

## Avant de coder

- **Vérifier l'existant** : un service/hook/contexte existe peut-être déjà
- **Lire le CLAUDE.md de l'app concernée** pour les règles spécifiques
