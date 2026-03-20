# Comment lancer le redesign avec Claude Code

## 1. Préparer les fichiers

Place les fichiers
dans ton projet :

## 2. Lancer Claude Code

### Commande de base

```bash
claude "Lis le prompt @prompts/redesign-homepage.md puis refactore @src/pages/Home.jsx pour suivre cette spec. Consulte les fichiers design-system/ référencés dans le prompt avant de coder."
```

### Si tu veux cibler plusieurs fichiers

```bash
claude "Lis @prompts/redesign-homepage.md et applique le redesign sur ces fichiers :
- @src/pages/Home.jsx (layout principal)
- @src/components/Chat/ (composants chat)
- @src/components/Navigation/ (sidebar, bottom nav, drawer)
Consulte le design system dans @design-system/ avant chaque décision de style."
```

### Pour un dry-run (plan d'abord, code ensuite)

```bash
claude "Lis @prompts/redesign-homepage.md et le design system dans @design-system/. 
Propose-moi un plan de refactoring fichier par fichier AVANT de coder. 
Liste les composants à créer/modifier et les breaking changes."
```

### Pour itérer sur un composant spécifique

```bash
claude "En suivant le design system (@design-system/04-components.md), refactore le composant chat input bar dans @src/components/Chat/InputBar.jsx. Réfère-toi au mockup @src/components/dashboard-mockup.jsx pour le résultat attendu."
```

## 3. Tips

- Le `CLAUDE.md` est
  lu automatiquement
  à chaque session →
  les règles design
  s'appliquent même
  sans mentionner le
  prompt
- Utilise `/review`
  après le
  refactoring pour
  vérifier la
  conformité
- Si Claude Code
  dévie des tokens,
  rappelle-lui :
  "Vérifie
  @design-system/00-design-tokens.md,
  tu utilises une
  couleur hors
  palette"
