# Dual Landing Pages - Simple Dev Setup

## 📁 Structure

```
apps/landing-page/              ← Version ACTIVE (v1 par défaut)
apps/landing-page-versions/
├── v1/src/                     ← Backup v1 actuelle
└── v2/src/                     ← Design redesign (du worktree)
```

## 🔄 Switcher Entre les Versions

```bash
# Charger v2 (nouveau design)
./switch-landing-version.sh v2
pnpm dev:landing-page

# Revenir à v1
./switch-landing-version.sh v1
pnpm dev:landing-page
```

## ✅ C'est tout!

- ✅ Deux versions en dev
- ✅ Switch en 2 secondes
- ✅ Aucun code complexe
- ✅ Facile à nettoyer après

## 🎯 Après le Test

**Si tu kiffes v2:**
```bash
# Copier v2 comme version définitive
cp -r apps/landing-page-versions/v2/src/* apps/landing-page/src/
git add apps/landing-page/
git commit -m "style(landing-page): deploy new design"
```

**Si tu veux rester en v1:**
```bash
# Supprimer les versions
rm -rf apps/landing-page-versions
git add apps/landing-page/
```
