# Redesign Homepage — GastonApp Chat Dashboard

## Objectif

Refactorer la
homepage existante
de GastonApp pour
adopter un layout *
*chat-centric,
mobile-first,
responsive** avec 3
breakpoints (
mobile / tablette /
desktop).

L'application est
pilotée
intégralement par le
chat (texte + voix).
Les autres vues (
animaux, calendrier,
fiches) sont
accessibles en
complément mais le
chat reste l'écran
principal permanent.

---

## Fichiers de référence — Design System

Lis et respecte *
*strictement** ces
fichiers avant toute
modification :

-
`design-system/00-design-tokens.md` —
Tokens fondation (
couleurs, spacing,
radius, shadows,
animations)
-
`design-system/01-color-system.md` —
Palette complète,
gradients, semantic
colors, règles
d'accessibilité
-
`design-system/02-typography.md` —
Nunito exclusif,
type scale,
line-heights
-
`design-system/03-iconography.md` —
Phosphor Icons,
weights Regular +
Bold, sizing
-
`design-system/04-components.md` —
Spécifications des
composants (boutons,
cards, inputs,
badges, nav)
-
`design-system/05-layouts.md` —
Grilles,
breakpoints, safe
areas, templates de
pages
-
`design-system/GastonApp-DesignSystem-Guidelines-MegaPrompt.md` —
Résumé global des
règles immutables

---

## Mockup de référence

-
`prompts/dashboard-mockup.jsx` —
Prototype
fonctionnel React du
dashboard cible

Ce fichier contient
l'architecture
complète à
reproduire.
Utilise-le comme *
*référence visuelle
et structurelle**,
pas comme
copier-coller.

---

## Architecture cible

### Layout 3 colonnes progressif

```
Mobile (<768px)          Tablette (768px+)         Desktop (1200px+)
┌──────────────┐         ┌────┬──────────┐         ┌────┬──────────┬────┐
│              │         │    │          │         │    │          │    │
│  Chat plein  │         │ SB │  Chat    │         │ SB │  Chat    │ SB │
│  écran       │         │ L  │  center  │         │ L  │  center  │ R  │
│              │         │    │          │         │    │          │    │
├──────────────┤         │    │          │         │    │          │    │
│  Tab bar     │         └────┴──────────┘         └────┴──────────┴────┘
└──────────────┘
+ Drawer gauche
```

### Mobile (<768px)

- **Chat plein écran
  ** comme vue
  principale
- **Bottom tab bar**
  flat (fond blanc
  solide `#FDFCFA`,
  border-top
  `#EFEADC`)
    - 5 onglets :
      Accueil,
      Animaux,
      Chat (actif),
      Agenda, Profil
    - Style :
      icône + label
      en dessous,
      pas de
      bulles/cercles
    - Indicateur
      actif : trait
      vert `#8FA998`
      en haut de
      l'onglet
- **Hamburger menu
  ** (header chat) →
  ouvre un **drawer
  ** glissant depuis
  la gauche
    - Contenu
      identique à la
      sidebar
      tablette
    - Backdrop
      semi-transparent
      au clic
    - Transition
      `transform: translateX`
      avec
      `cubic-bezier(0.4, 0, 0.2, 1)`
    - Bouton close
      en haut à
      droite du
      drawer

### Tablette (768px+)

- **Sidebar gauche**
  permanente (260px)
    - Logo Gaston +
      subtitle
    - Navigation (
      Chat, Mes
      animaux,
      Calendrier,
      Réglages)
    - Liste animaux
      **collapsible
      ** (3 visibles
      par défaut, "
      Voir tous (X)"
      pour expand)
    - Recherche
      animaux
      visible si > 5
      animaux et
      liste expanded
    - Liste
      scrollable (
      max-height ~
      240px) quand
      expanded
    - Prochains
      RDV (compact)
    - Footer user
- **Chat center**
  prend le reste de
  la largeur
- Bottom tab bar et
  drawer **masqués**

### Desktop (1200px+)

- **Sidebar droite**
  apparaît (290px)
    - Prochains
      événements (
      EventCards)
    - Résumé du jour
      par animal
    - Statistiques (
      grille 2x2 :
      Repas,
      Médicaments,
      Promenades,
      Événements)

### Wide Desktop (1440px+)

- Sidebars
  élargies (290px /
  320px)
- Chat center avec
  padding plus
  généreux

---

## Composants du Chat

### Header chat

- Hamburger (mobile
  only) → ouvre le
  drawer
- Avatar Gaston (
  cercle gradient
  eucalyptus
  `#ABC3B7` →
  `#657A6D`, icône
  paw blanche)
- Nom "Gaston" +
  status "En ligne ·
  X animaux suivis"
- Bouton
  notification (
  cercle blanc,
  icône bell, badge
  rouge)

### Zone messages

- Séparateur date ("
  Aujourd'hui" dans
  chip `#EFEADC`)
- Bulles Gaston :
  fond blanc,
  `border-radius: 4px 20px 20px 20px`,
  shadow légère
- Bulles user : fond
  gradient
  eucalyptus,
  `border-radius: 20px 4px 20px 20px`
- Avatar Gaston (
  30px) à gauche des
  bulles assistant
- Horodatage sous
  chaque bulle
- Typing indicator (
  3 dots animés
  bounce)
- Animation
  `fadeInUp` sur le
  dernier message

### Suggestion chips

- Bande horizontale
  scrollable
  au-dessus de
  l'input
- Suggestions
  contextuelles en
  langage naturel (
  ex: "📅 Prochain
  RDV de Luna ?")
- Style :
  `border: 1px solid #E0D8C3`,
  `border-radius: 99px`,
  texte `#6B6B6B`
- Hover : fond
  `#FDFCFA`, border
  `#8FA998`
- Au clic → envoie
  le texte dans le
  chat

### Barre d'input

- Container
  `border-radius: 22px`,
  fond blanc, border
  `#E9E3D0`
- Focus : border
  `#8FA998` + shadow
  eucalyptus
- Textarea
  auto-expand (
  max-height 100px)
- Bouton send (
  cercle 36px,
  eucalyptus quand
  texte présent,
  gris sinon)
- Bouton microphone
  séparé (cercle
  46px, gradient
  eucalyptus)
    - État
      recording :
      gradient
      rouge-coral +
      animation
      pulse
    - Change le
      status header
      en "🎙 Écoute
      en cours…"

---

## Règles de style strictes

### Couleurs

- Background
  principal :
  `#F4F1E8` (lin-2)
- Surfaces
  cards/sidebars :
  `#FDFCFA` (lin-0)
-
Borders/séparateurs :
`#EFEADC` (lin-3)
- Primaire
  interactive :
  `#8FA998` (
  primary-400)
- Texte heading :
  `#1A1A1A` (
  text-primary)
- Texte body :
  `#4A4A4A` (
  text-secondary) ou
  `#6B6B6B` (
  text-tertiary)
- **Jamais** de tons
  bleus, gris
  froids, ou noir
  pur `#000000`

### Typographie

- **Nunito
  exclusivement** —
  weights 400, 600,
  700
- Import :
  `https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap`
- Body : 15px/1.55,
  Regular
- Labels sidebar :
  11px uppercase,
  Bold,
  `letter-spacing: 0.06em`
- Nav items : 14px,
  SemiBold si actif

### Icônes

- **Phosphor Icons
  ** — Regular (
  1.5px stroke) par
  défaut, Bold (2px)
  pour
  actifs/emphasis
- Taille base :
  19-22px pour
  navigation,
  15-16px pour
  inline
- Pas d'emojis dans
  l'UI (sauf contenu
  chat)

### Spacing & Radius

- Utiliser les
  tokens spacing (
  multiples de 4px)
- Cards :
  `border-radius: 20px` (
  radius-xl)
- Buttons pill :
  `border-radius: 9999px`
- Inputs :
  `border-radius: 12px` (
  radius-md)
- Shadows : toujours
  tintées eucalyptus
  `rgba(143,169,152,x)`,
  jamais noir pur

### Animations

- Transitions :
  `0.15s ease` pour
  hover, `0.2s ease`
  pour state changes
- Easing drawer :
  `cubic-bezier(0.4, 0, 0.2, 1)`
- Pas d'animations
  excessives —
  subtil et
  organique

---

## Accessibilité

- Touch targets
  minimum 44px sur
  mobile
- Focus visible (
  `outline: 3px solid #8FA998, offset: 2px`)
- Contraste WCAG AA
  minimum pour tout
  texte
- `aria-label` sur
  tous les boutons
  icon-only
- Support
  `prefers-reduced-motion`
  pour les
  animations

---

## Ce qu'il ne faut PAS faire

- ❌ Utiliser des
  couleurs hors
  design system
- ❌ Mélanger les
  fonts (Nunito
  uniquement)
- ❌ Mettre des
  emojis dans les
  boutons/nav (
  Phosphor Icons)
- ❌ Bottom nav avec
  des bulles rondes
  colorées
- ❌ Afficher tous
  les animaux sans
  pagination/collapse
- ❌ Hardcoder des
  valeurs de
  spacing/color —
  utiliser les
  tokens
- ❌ Oublier les
  breakpoints
  tablette et
  desktop
