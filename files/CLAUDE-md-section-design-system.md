# ─────────────────────────────────────────────
# SECTION À AJOUTER DANS TON CLAUDE.md EXISTANT
# Copie le contenu ci-dessous dans ton CLAUDE.md
# ─────────────────────────────────────────────

## Design System — GastonApp

### Fichiers de référence
Le design system complet est dans `/design-system/`. **Toujours consulter ces fichiers avant de modifier du CSS, du styling, ou de créer un composant UI** :
- `00-design-tokens.md` — Tokens (couleurs, spacing, radius, shadows, z-index, animations)
- `01-color-system.md` — Palette, gradients, semantic colors, règles de contraste
- `02-typography.md` — Nunito, type scale, line-heights
- `03-iconography.md` — Phosphor Icons, weights, sizing
- `04-components.md` — Specs des composants (buttons, cards, inputs, nav, badges)
- `05-layouts.md` — Grilles, breakpoints, templates de pages, safe areas

### Règles immutables
- **Font** : Nunito exclusivement (400/600/700). Pas d'Inter, Roboto, Arial, ou system fonts.
- **Icônes** : Phosphor Icons (Regular 1.5px + Bold 2px). Pas d'emojis dans l'UI.
- **Couleurs** : Toujours utiliser les tokens du design system. Palette chaude/organique. Jamais de tons bleus/gris froids, jamais de noir pur `#000000`.
  - Primaire : `#8FA998` (eucalyptus)
  - Secondaire : `#D4A574` (golden honey)
  - Background : `#F4F1E8` (lin-2)
  - Surfaces : `#FDFCFA` (lin-0)
- **Shadows** : Tintées eucalyptus `rgba(143,169,152,x)`, jamais noir pur.
- **Radius** : Cards 20px, buttons pill 9999px, inputs 12px.
- **Layout** : Mobile-first. Breakpoints : 768px (tablette), 1200px (desktop), 1440px (wide).
- **Touch targets** : 44px minimum sur mobile.
- **Contraste** : WCAG AA minimum pour tout texte.

### Architecture UI
L'application est **chat-centric**. Le chat est l'écran principal permanent. Les autres vues (animaux, calendrier) sont des compléments accessibles via sidebar ou navigation.

Layout 3 colonnes progressif :
- Mobile : chat plein écran + bottom tab bar + drawer menu
- Tablette : sidebar gauche + chat center
- Desktop : sidebar gauche + chat center + sidebar droite contextuelle
