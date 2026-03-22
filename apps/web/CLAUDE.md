# CLAUDE.md — Web App

App principale GastonApp. React 18 + Vite + TypeScript. Port 4480.

## Stack

| Lib | Version |
|---|---|
| React | ^18.2.0 |
| Vite | ^5.4.1 |
| Mantine | **v5.10.5** (pas v7!) |
| Tailwind CSS | ^3.4.1 |
| Redux Toolkit | ^2.2.7 |
| React Router DOM | ^6.4.2 |
| i18next | ^23.16.8 |
| Bugsnag | ^8.1.2 |

## Interdictions spécifiques

- **Mantine v7+ API** → projet en **v5.10.x**
- **Noir pur `#000000`**, tons bleus/gris froids
- **CSS modules** → Tailwind + design tokens uniquement
- **FontAwesome pour nouveaux composants** → Phosphor Icons

## Avant de coder

- **UI/Styling** : lire `/design-system/` (tokens, couleurs, typo, composants, layouts)
- **Architecture** : lire `docs/technical/front-architecture.md`
- **Vérifier l'existant** dans `src/` — les contextes, services et hooks ci-dessous couvrent déjà beaucoup de cas

## Contextes (src/contexts/)

| Contexte | Rôle |
|---|---|
| `AuthContext` | Authentification utilisateur |
| `AIAssistantContext` | État de l'assistant AI |
| `EventsContext` | État des événements |
| `PetsContext` | État des animaux |
| `FeedingContext` | Suivi alimentation |
| `MessageContext` | Messages / notifications |
| `GlobalContext` | État global app |

## Providers (src/providers/)

FontawesomeProvider, ToastProvider, apiClientProvider

## Services (src/services/)

| Service | Rôle |
|---|---|
| `EventService` | Logique métier événements |
| `ModelService` | Logique métier animaux |
| `FeedingService` | Logique métier alimentation |
| `OpenAIService` | Intégration AI |
| `ConversationService` | Gestion conversations AI |

## Repositories (src/repository/)

RestEventRepository, RestModelRepository — couche d'accès API REST vers le backend Laravel.

## Hooks (src/hooks/)

- `ai/useAIStream`, `ai/useConversations` — streaming et historique AI
- `useFeedingDashboard` — dashboard alimentation
- `useSpeechProcessing`, `useSpeechRecognition` — reconnaissance vocale

## Routes (react-router-dom v6, lazy loading)

| Route | Page | Layout | Auth |
|---|---|---|---|
| `/login`, `/register` | Auth | blank | non |
| `/` | Dashboard (Index) | default | oui |
| `/ai-assistant` | Assistant AI | blank | oui |
| `/feeding` | Suivi alimentation | default | oui |
| `/onboarding` | Onboarding | blank | oui |
| `/profile` | Profil | default | oui |
| `/components-showcase` | Showcase | default | oui |
| `/terms`, `/privacy` | Légal | blank | non |

## Path Aliases

- `@/` → `src/`
- `@c/` → `src/components/`

## Design System — Règles immutables

- **Font** : Nunito (400/600/700) exclusivement
- **Icônes** : Phosphor Icons (Regular 1.5px, Bold 2px). Pas d'emojis dans l'UI
- **Couleurs** : primaire `#8FA998`, secondaire `#D4A574`, bg `#F4F1E8`, surfaces `#FDFCFA`
- **Shadows** : tintées `rgba(143,169,152,x)`, jamais noir
- **Radius** : cards 20px, buttons pill 9999px, inputs 12px
- **Layout** : mobile-first. Breakpoints : 768/1200/1440px. Touch targets 44px min. WCAG AA
- **Architecture** : chat-centric (chat = écran principal). 3 colonnes progressives
- **Design tokens CSS** : `src/styles/design-tokens.css`
- **Specs complètes** : `/design-system/` (00 à 05)

## Structure composants (src/components/)

AI/, Alerts/, Calendar/, Common/, Dashboard/, Event/, Feeding/, Form/, Home/, Icon/, Layouts/, Modal/, Navigation/, Pets/, Router/, Shared/

## Store Redux (src/store/)

`themeConfigSlice` — configuration du thème uniquement. Le reste de l'état passe par Context.
