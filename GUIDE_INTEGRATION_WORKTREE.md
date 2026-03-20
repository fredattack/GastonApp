# Guide d'Intégration du Worktree - Revue Visuelle Front

## 📋 État Actuel

**Worktree**: `.claude/worktrees/flamboyant-wescoff`
**Branche**: `claude/flamboyant-wescoff`
**Fichiers modifiés**: 4 fichiers dans `apps/landing-page/`
- `src/components/Footer.tsx` (34 lignes modifiées)
- `src/components/Header.tsx` (16 lignes modifiées)
- `src/pages/Home.tsx` (104 lignes modifiées)
- `tailwind.config.js` (72 lignes modifiées)

---

## 🔄 Processus d'Intégration

### Étape 1️⃣: Valider les Modifications

```bash
# Depuis le worktree, voir les changements détaillés
cd .claude/worktrees/flamboyant-wescoff
git diff apps/landing-page/

# Ou voir un aperçu formaté
git diff --stat
```

**À vérifier**:
- ✅ Respect du design system (couleurs, typography, spacing)
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Compatibilité avec les design tokens
- ✅ Accessibilité (contraste, touch targets)

---

### Étape 2️⃣: Tester les Modifications

```bash
# Depuis le worktree
cd .claude/worktrees/flamboyant-wescoff

# Installer les dépendances (si nécessaire)
pnpm install

# Tester la landing-page uniquement
pnpm dev:landing-page

# Ou tous les apps
pnpm dev
```

**Vérifications visuelles**:
- [ ] Landing page s'affiche correctement
- [ ] Pas d'erreurs console
- [ ] Responsive OK (test mobile, tablet, desktop)
- [ ] Animations fluides

---

### Étape 3️⃣: Committer les Modifications dans le Worktree

```bash
cd .claude/worktrees/flamboyant-wescoff

# Voir l'état
git status

# Ajouter les fichiers
git add apps/landing-page/

# Committer avec message conventionnel
git commit -m "style(landing-page): redesign header, footer, and home page

- Update Header component styling and layout
- Redesign Footer component with improved spacing
- Refactor Home page layout and visual hierarchy
- Enhance Tailwind config with custom tokens and spacing"
```

---

### Étape 4️⃣: Merger la Branche dans Master

#### Option A: Merge Simple (Recommandé pour une branche courte)

```bash
# Revenir au repo principal (hors du worktree)
cd /Users/fred/PhpstormProjects/GastonApp

# Vérifier qu'on est sur master
git checkout master
git pull origin master

# Merger la branche du worktree
git merge claude/flamboyant-wescoff

# Résoudre les conflits s'il y en a
# (puis: git add . && git commit)

# Pusher
git push origin master
```

#### Option B: Pull Request (Meilleur pour la traçabilité)

```bash
# Dans le worktree, pousser la branche
cd .claude/worktrees/flamboyant-wescoff
git push origin claude/flamboyant-wescoff

# Créer une PR via GitHub CLI ou interface web
gh pr create --base master --title "style(landing-page): redesign header, footer, and home page"
```

---

### Étape 5️⃣: Nettoyer le Worktree

```bash
# Quitter le worktree
cd /Users/fred/PhpstormProjects/GastonApp

# Supprimer le worktree une fois les modifs intégrées
git worktree remove .claude/worktrees/flamboyant-wescoff --force

# Supprimer la branche en local (optionnel)
git branch -D claude/flamboyant-wescoff
```

---

## 🎯 Checklist d'Intégration Complète

- [ ] **Validation**
  - [ ] Les changements respectent le design system
  - [ ] Vérification contraste (WCAG AA)
  - [ ] Vérification responsive (mobile/tablet/desktop)

- [ ] **Test Local**
  - [ ] `pnpm dev` fonctionne sans erreurs
  - [ ] Landing page affichage correct
  - [ ] Pas de warnings console
  - [ ] Performance OK (lighthouse?)

- [ ] **Commit & Merge**
  - [ ] Commit avec message conventionnel
  - [ ] Merge ou PR créée
  - [ ] Pas de conflits (ou conflits résolus)
  - [ ] Tests passent (si CI/CD configuré)

- [ ] **Cleanup**
  - [ ] Worktree supprimé
  - [ ] Branche locale supprimée
  - [ ] Status git clean (`git status`)

---

## 🚨 Gestion des Conflits

Si des conflits apparaissent lors du merge:

```bash
# 1. Voir les fichiers en conflit
git status

# 2. Éditer les fichiers (VS Code affiche les conflits)
# 3. Résoudre les conflits manuellement

# 4. Ajouter et committer
git add apps/landing-page/
git commit -m "merge: resolve conflicts from claude/flamboyant-wescoff"

# 5. Pousser
git push origin master
```

---

## 📝 Notes Importantes

- **Design System**: Avant d'intégrer, vérifier que toutes les couleurs, spacings, et shadows utilisent les tokens dans `design-system/00-design-tokens.md`
- **Tailwind Config**: Les changements dans `tailwind.config.js` affectent toute l'app → tester sur web ET landing-page
- **Branche**: Ne PAS créer de commits dans le worktree avant de l'avoir merger
- **Performance**: Après merge, lancer `pnpm build` pour vérifier le bundle size

---

## ✅ Après l'Intégration

```bash
# Vérifier que master est à jour
git log --oneline -5

# Build de vérification
pnpm build

# Linter & type-check
pnpm lint
pnpm type-check

# Deploy (si prêt)
pnpm deploy
```

