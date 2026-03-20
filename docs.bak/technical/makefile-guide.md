# 📖 GastonApp - Guide Makefile

Guide complet d'utilisation du Makefile pour gérer facilement le frontend (monorepo) et le backend (Laravel).

---

## 🚀 Commandes Principales

### Démarrage Rapide

```bash
# Lancer TOUT (backend Docker + frontend web)
make dev

# Lancer uniquement le frontend web
make dev-web

# Lancer uniquement le backend (sans Docker)
make dev-backend

# Lancer tout sans Docker (dev local complet)
make dev-full
```

**Résultat:**
- Frontend: `http://localhost:4480`
- Backend API: `http://localhost:3008`
- MySQL: `localhost:3368`

---

## 📦 Installation

```bash
# Installer toutes les dépendances (frontend + backend)
make install

# Frontend uniquement
make install-frontend

# Backend uniquement
make install-backend
```

---

## 🏗️ Build

```bash
# Build tout (frontend + backend)
make build

# Build frontend pour production
make build-frontend

# Build backend (optimize composer)
make build-backend

# Preview du build frontend
make preview
```

---

## 🐳 Docker (Backend)

### Gestion des Containers

```bash
# Démarrer containers backend
make docker-up

# Arrêter containers backend
make docker-down

# Redémarrer containers
make docker-restart

# Voir logs en temps réel
make docker-logs

# Lister containers actifs
make docker-ps

# Nettoyer Docker complet (volumes, images)
make docker-clean
```

### Shell & Debug

```bash
# Ouvrir shell dans container backend
make backend-shell

# Ouvrir MySQL shell
make db-shell

# Laravel Tinker
make tinker
```

---

## 🗄️ Base de Données

```bash
# Exécuter migrations
make db-migrate

# Reset DB + migrations
make db-migrate-fresh

# Exécuter seeders
make db-seed

# Reset complet (migrations + seeders)
make db-fresh-seed
```

**Exemple workflow:**
```bash
# Setup DB fraîche avec données de test
make db-fresh-seed
```

---

## 🧪 Tests

```bash
# Lancer tous les tests (frontend + backend)
make test

# Tests frontend uniquement
make test-frontend

# Tests backend uniquement
make test-backend

# Tests frontend en mode watch
make test-watch
```

---

## 🔍 Qualité de Code

```bash
# Lint tout
make lint

# Lint frontend uniquement
make lint-frontend

# Lint backend (PHPStan + Pint)
make lint-backend

# Format code frontend (Prettier)
make format

# Vérifier types TypeScript
make type-check

# Vérification complète avant commit
make check
```

**Exemple workflow avant commit:**
```bash
# Vérifier que tout est OK
make check
# → Lint + Type Check + Tests
```

---

## 🧹 Nettoyage

```bash
# Nettoyer tout
make clean

# Nettoyer frontend (node_modules, dist)
make clean-frontend

# Nettoyer backend (vendor, caches)
make clean-backend

# Vider tous les caches
make clean-cache
```

**Exemple si problème de build:**
```bash
# Tout nettoyer et réinstaller
make fresh
```

---

## 📊 Git

```bash
# Voir status Git (frontend + backend)
make git-status

# Pull Git (frontend + backend)
make git-pull

# Push Git (frontend + backend)
make git-push
```

---

## 🚢 Déploiement

```bash
# Build + deploy complet
make deploy

# Build image Docker
make docker-build

# Push image vers registry
make docker-push
```

---

## ℹ️ Informations

```bash
# Afficher infos système
make info

# Vérifier ports utilisés
make ports

# Afficher aide complète
make help
```

**Output `make info`:**
```
Frontend:
  Node: v20.x.x
  pnpm: 8.x.x

Backend:
  PHP: 8.2.x
  Composer: 2.x.x

Docker:
  Version: 24.x.x
  Compose: 2.x.x
```

---

## 🔧 Raccourcis Pratiques

| Commande | Équivalent | Description |
|----------|-----------|-------------|
| `make start` | `make dev` | Lancer tout |
| `make stop` | `make docker-down` | Arrêter tout |
| `make restart` | `make docker-restart` | Redémarrer backend |
| `make logs` | `make docker-logs` | Voir logs |
| `make shell` | `make backend-shell` | Shell backend |
| `make watch` | `make dev-web` | Hot reload frontend |
| `make fresh` | `make clean install` | Réinstaller depuis zéro |
| `make reset` | `make clean-cache db-fresh-seed` | Reset complet |

---

## 🎯 Workflows Typiques

### 1. Démarrage Journalier

```bash
# Option 1: Tout lancer (recommandé)
make dev

# Option 2: Seulement frontend (si backend déjà lancé)
make dev-web
```

### 2. Après Pull Git

```bash
# Mettre à jour dépendances + migrations
make install
make db-migrate
make dev
```

### 3. Avant Commit

```bash
# Vérifier code
make check

# Si OK, commit
git add .
git commit -m "feat: nouvelle feature"
```

### 4. Reset Complet

```bash
# Si problème, tout reset
make fresh
make db-fresh-seed
make dev
```

### 5. Développement Feature

```bash
# Lancer avec hot reload
make watch

# Dans un autre terminal, lancer tests en watch
make test-watch
```

### 6. Build Production

```bash
# Build + test
make build
make test

# Si OK, déployer
make deploy
```

### 7. Debug Backend

```bash
# Voir logs en temps réel
make logs

# Ouvrir shell dans container
make shell

# Ou utiliser Tinker
make tinker
```

### 8. Problème de Port

```bash
# Vérifier quels ports sont utilisés
make ports

# Si conflit, arrêter tout
make stop
```

---

## 🐛 Troubleshooting

### Frontend ne démarre pas

```bash
# Nettoyer et réinstaller
make clean-frontend
make install-frontend
make dev-web
```

### Backend ne répond pas

```bash
# Vérifier containers
make docker-ps

# Redémarrer
make restart

# Voir logs
make logs
```

### Tests échouent

```bash
# Vérifier lint et types
make lint
make type-check

# Voir erreurs spécifiques
make test-frontend
make test-backend
```

### Build échoue

```bash
# Nettoyer caches
make clean-cache

# Réinstaller
make fresh

# Rebuild
make build
```

### Base de données corrompue

```bash
# Reset complet DB
make db-fresh-seed
```

### Ports déjà utilisés

```bash
# Voir ce qui utilise les ports
make ports

# Arrêter tout
make stop

# Tuer processus manuellement si nécessaire
lsof -ti:4480 | xargs kill -9
lsof -ti:3008 | xargs kill -9
lsof -ti:3368 | xargs kill -9
```

---

## 🎨 Customisation

### Changer les Ports

Éditer dans le Makefile :

```makefile
# Variables
FRONTEND_PORT := 4480  # Changer ici
BACKEND_PORT := 3008   # Changer ici
```

### Ajouter une Commande

```makefile
my-command: ## Description de ma commande
	@echo "Mon message"
	cd $(FRONTEND_DIR) && ma-commande
```

---

## 📝 Notes Importantes

### Chemins

- Frontend: `/Users/fred/PhpstormProjects/GastonApp`
- Backend: `/Users/fred/PhpstormProjects/gaston-backend`

### Prérequis

- **Node.js** >= 20.x
- **pnpm** >= 8.x
- **PHP** >= 8.2
- **Composer** >= 2.x
- **Docker** + **Docker Compose**

### Performance

- Utilise Turborepo pour cache intelligent
- Build incrémentaux plus rapides
- Hot Module Replacement pour frontend

### Sécurité

- Ne jamais commit `.env` files
- API keys dans variables d'environnement
- Bugsnag seulement en production

---

## 🚀 Quick Reference

```bash
# Les 5 commandes les plus utilisées
make dev          # Lancer tout
make test         # Tester tout
make lint         # Lint tout
make clean        # Nettoyer tout
make help         # Voir aide
```

---

**Dernière mise à jour:** 2025-11-11
**Version Makefile:** 1.0.0