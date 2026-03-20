# Dual Web App Versions — Dev Setup

## 📁 Structure

```
apps/web/              ← Version ACTIVE (v1 par défaut)
apps/web-versions/
├── v1/src/            ← Version originale (master)
└── v2/src/            ← Version modifiée (worktree)
```

## 🔄 Switcher Entre les Versions

```bash
# Charger v2 (nouvelle design)
./switch-web-version.sh v2
pnpm dev:web

# Revenir à v1
./switch-web-version.sh v1
pnpm dev:web
```

## ✅ C'est tout!

- ✅ Deux versions en dev
- ✅ Switch en 1 seconde
- ✅ Zéro complexité
- ✅ Facile à nettoyer après

## 🎯 Après le Test

**Si tu kiffes v2:**
```bash
# Copier v2 comme version définitive
cp -r apps/web-versions/v2/src/* apps/web/src/
git add apps/web/
git commit -m "style(web): apply new design from v2"
```

**Si tu veux rester en v1:**
```bash
# Supprimer les versions
rm -rf apps/web-versions
git add apps/web/
```
