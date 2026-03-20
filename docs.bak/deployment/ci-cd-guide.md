# CI/CD Configuration Guide

Ce guide explique comment configurer le déploiement automatique de GastonApp via GitHub Actions.

## Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Workflows Disponibles](#workflows-disponibles)
- [Configuration des GitHub Secrets](#configuration-des-github-secrets)
- [Configuration SSH pour le Déploiement](#configuration-ssh-pour-le-déploiement)
- [Déclenchement des Déploiements](#déclenchement-des-déploiements)
- [Monitoring et Logs](#monitoring-et-logs)
- [Troubleshooting](#troubleshooting)

---

## Vue d'ensemble

GastonApp utilise GitHub Actions pour:
- **Tests automatiques** sur les pull requests et branches
- **Déploiement automatique en production** lors des pushs sur `master`
- **Déploiement optionnel en staging** lors des pushs sur `develop`/`staging`

### Architecture CI/CD

```
┌─────────────┐
│   Git Push  │
└──────┬──────┘
       │
       ├──────────────┬──────────────┬─────────────┐
       │              │              │             │
       v              v              v             v
  Pull Request    Push to       Push to      Push to
  (any branch)    master        develop      feature/*
       │              │              │             │
       v              v              v             v
   ┌───────┐    ┌──────────┐   ┌─────────┐   ┌─────────┐
   │  CI   │    │ CI + Prod│   │CI + Stag│   │   CI    │
   │ Tests │    │  Deploy  │   │  Deploy │   │  Tests  │
   └───────┘    └──────────┘   └─────────┘   └─────────┘
                     │              │
                     v              v
              ┌────────────┐  ┌────────────┐
              │ Production │  │  Staging   │
              │  Droplet   │  │  Droplet   │
              └────────────┘  └────────────┘
```

---

## Workflows Disponibles

### 1. CI Tests (`ci.yml`)

**Déclenchement:**
- Pull requests vers `master` ou `develop`
- Push sur toutes les branches sauf `master` et `develop`

**Actions:**
- ✅ Lint du code (ESLint)
- ✅ Type checking (TypeScript)
- ✅ Build de l'application
- ✅ Upload des artifacts de build

**Pas de déploiement** - seulement des tests

### 2. Deploy to Production (`deploy-production.yml`)

**Déclenchement:**
- Push sur la branche `master`
- Déclenchement manuel via GitHub UI

**Actions:**
1. Tests complets (lint, type check)
2. Build de l'application
3. Connexion SSH au droplet de production
4. Pull du code sur le droplet
5. Déploiement avec Docker
6. Health check de l'application

**Cible:** Droplet de production

### 3. Deploy to Staging (`deploy-staging.yml`)

**Déclenchement:**
- Push sur la branche `develop` ou `staging`
- Déclenchement manuel via GitHub UI

**Actions:**
1. Tests complets
2. Build de l'application
3. Connexion SSH au droplet de staging
4. Déploiement avec Docker
5. Health check

**Cible:** Droplet de staging (optionnel)

---

## Configuration des GitHub Secrets

### Étape 1: Accéder aux Settings du Repository

1. Allez sur votre repository GitHub: `https://github.com/fredattack/GastonApp`
2. Cliquez sur **Settings**
3. Dans le menu de gauche, cliquez sur **Secrets and variables** > **Actions**

### Étape 2: Créer les Secrets pour Production

Cliquez sur **New repository secret** et ajoutez chaque secret ci-dessous:

#### Secrets SSH et Serveur

| Nom | Description | Exemple |
|-----|-------------|---------|
| `SSH_PRIVATE_KEY` | Clé SSH privée pour se connecter au droplet | Contenu complet de `~/.ssh/id_rsa` |
| `DROPLET_IP` | Adresse IP du droplet de production | `165.227.xxx.xxx` |
| `DROPLET_USER` | Utilisateur SSH (généralement root) | `root` |
| `REMOTE_PATH` | Chemin du projet sur le droplet | `/root/GastonApp` |

#### Secrets Firebase

| Nom | Description | Où le trouver |
|-----|-------------|---------------|
| `VITE_FIREBASE_API_KEY` | Clé API Firebase | Firebase Console > Project Settings |
| `VITE_FIREBASE_AUTH_DOMAIN` | Domaine d'authentification | Firebase Console > Project Settings |
| `VITE_FIREBASE_PROJECT_ID` | ID du projet Firebase | Firebase Console > Project Settings |
| `VITE_FIREBASE_STORAGE_BUCKET` | Bucket de stockage | Firebase Console > Project Settings |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ID de l'expéditeur de messages | Firebase Console > Project Settings |
| `VITE_FIREBASE_APP_ID` | ID de l'application Firebase | Firebase Console > Project Settings |

#### Autres Secrets

| Nom | Description |
|-----|-------------|
| `VITE_OPENAI_API_KEY` | Clé API OpenAI |
| `VITE_API_URL` | URL de votre backend API (si applicable) |

### Étape 3: Secrets pour Staging (Optionnel)

Si vous voulez un environnement de staging, ajoutez également:

#### Variables (pas secrets)

Pour les variables non sensibles, utilisez **Variables** au lieu de **Secrets**:

| Nom | Valeur |
|-----|--------|
| `STAGING_DROPLET_IP` | IP du droplet de staging |
| `STAGING_DROPLET_USER` | Utilisateur SSH pour staging |
| `STAGING_REMOTE_PATH` | Chemin du projet sur staging |

#### Secrets pour Staging

| Nom | Description |
|-----|-------------|
| `STAGING_SSH_PRIVATE_KEY` | Clé SSH pour staging |
| `STAGING_VITE_FIREBASE_API_KEY` | Firebase API key pour staging |
| `STAGING_VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain pour staging |
| `STAGING_VITE_FIREBASE_PROJECT_ID` | Firebase project ID pour staging |
| `STAGING_VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket pour staging |
| `STAGING_VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID pour staging |
| `STAGING_VITE_FIREBASE_APP_ID` | Firebase app ID pour staging |
| `STAGING_VITE_OPENAI_API_KEY` | OpenAI API key pour staging |
| `STAGING_VITE_API_URL` | API URL pour staging |

---

## Configuration SSH pour le Déploiement

### Méthode 1: Utiliser votre clé SSH existante

Si vous avez déjà une clé SSH configurée sur votre droplet:

```bash
# Sur votre machine locale
cat ~/.ssh/id_rsa

# Copiez TOUT le contenu (y compris BEGIN et END)
# Ajoutez-le comme secret SSH_PRIVATE_KEY sur GitHub
```

### Méthode 2: Créer une nouvelle clé SSH dédiée

Plus sécurisé - une clé spécifique pour GitHub Actions:

```bash
# Sur votre machine locale
ssh-keygen -t ed25519 -C "github-actions-gastonapp" -f ~/.ssh/github_actions_gastonapp

# Afficher la clé privée (pour GitHub Secret)
cat ~/.ssh/github_actions_gastonapp

# Afficher la clé publique (pour le droplet)
cat ~/.ssh/github_actions_gastonapp.pub
```

### Ajouter la clé publique au droplet

```bash
# Se connecter au droplet
ssh root@your-droplet-ip

# Ajouter la clé publique
echo "VOTRE_CLE_PUBLIQUE" >> ~/.ssh/authorized_keys

# Vérifier les permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### Tester la connexion

```bash
# Depuis votre machine locale
ssh -i ~/.ssh/github_actions_gastonapp root@your-droplet-ip

# Si ça fonctionne, la configuration est bonne!
```

---

## Déclenchement des Déploiements

### Déploiement Automatique en Production

```bash
# Sur votre machine locale
git checkout master
git pull origin master

# Faire vos modifications, puis:
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin master

# 🚀 Le déploiement démarre automatiquement!
```

### Déploiement Automatique en Staging

```bash
git checkout develop
git pull origin develop

# Faire vos modifications, puis:
git add .
git commit -m "feat: test nouvelle fonctionnalité"
git push origin develop

# 🚀 Le déploiement staging démarre automatiquement!
```

### Déploiement Manuel via GitHub UI

1. Allez sur GitHub: `https://github.com/fredattack/GastonApp/actions`
2. Sélectionnez le workflow voulu (ex: "Deploy to Production")
3. Cliquez sur **Run workflow**
4. Sélectionnez la branche
5. Cliquez sur **Run workflow** (bouton vert)

### Workflow Recommandé: Feature Branches

```bash
# 1. Créer une feature branch
git checkout -b feature/ma-nouvelle-fonctionnalite

# 2. Développer et tester localement
pnpm dev:web

# 3. Commit et push
git add .
git commit -m "feat: description"
git push origin feature/ma-nouvelle-fonctionnalite

# 4. Créer une Pull Request sur GitHub
# → CI tests s'exécutent automatiquement

# 5. Review et merge dans develop
# → Déploiement automatique en staging

# 6. Test en staging, puis merge dans master
# → Déploiement automatique en production
```

---

## Monitoring et Logs

### Voir les Workflows en Cours

1. Allez sur: `https://github.com/fredattack/GastonApp/actions`
2. Vous verrez tous les workflows (en cours, réussis, échoués)

### Voir les Logs d'un Workflow

1. Cliquez sur le workflow qui vous intéresse
2. Cliquez sur le job (ex: "Build and Deploy to Digital Ocean")
3. Cliquez sur chaque étape pour voir les logs détaillés

### Notifications

GitHub vous envoie automatiquement des emails si:
- ❌ Un workflow échoue
- ✅ Un workflow qui avait échoué réussit maintenant

### Badges de Statut

Vous pouvez ajouter des badges dans votre README:

```markdown
![Deploy to Production](https://github.com/fredattack/GastonApp/actions/workflows/deploy-production.yml/badge.svg)
![CI Tests](https://github.com/fredattack/GastonApp/actions/workflows/ci.yml/badge.svg)
```

---

## Troubleshooting

### Problème: SSH Connection Failed

**Erreur:** `Permission denied (publickey)`

**Solution:**

```bash
# Vérifier que la clé privée est correcte dans GitHub Secrets
# Vérifier que la clé publique est sur le droplet

# Sur le droplet:
cat ~/.ssh/authorized_keys  # Doit contenir votre clé publique

# Tester manuellement:
ssh -i ~/.ssh/votre-cle root@droplet-ip
```

### Problème: Build Failed - Out of Memory

**Erreur:** `JavaScript heap out of memory`

**Solution:**

Modifier le workflow pour augmenter la mémoire Node:

```yaml
- name: Build application
  env:
    NODE_OPTIONS: --max-old-space-size=4096
  run: pnpm build:web
```

### Problème: Environment Variables Not Set

**Erreur:** `VITE_FIREBASE_API_KEY is undefined`

**Solution:**

1. Vérifier que tous les secrets sont configurés sur GitHub
2. Vérifier que les noms correspondent exactement
3. Les secrets sont sensibles à la casse: `VITE_FIREBASE_API_KEY` ≠ `vite_firebase_api_key`

### Problème: Deployment Failed - Health Check

**Erreur:** `Health check returned: 000` ou `Health check failed`

**Causes possibles:**

1. **L'application ne démarre pas:**
   ```bash
   # SSH sur le droplet et vérifier les logs
   ssh root@droplet-ip
   cd /root/GastonApp
   docker-compose -f .deploy/docker-compose.yml logs
   ```

2. **Le health endpoint n'existe pas:**
   - Vérifier que nginx.conf a bien `location /health`

3. **Le port n'est pas ouvert:**
   ```bash
   # Sur le droplet
   sudo ufw status
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   ```

### Problème: Workflow Stuck or Takes Too Long

**Solution:**

1. **Vérifier le cache pnpm:**
   - Le cache peut être corrompu
   - Recréer le workflow pour invalider le cache

2. **Vérifier la connexion au droplet:**
   ```yaml
   # Ajouter un timeout
   - name: Deploy to Digital Ocean Droplet
     timeout-minutes: 15  # Arrête après 15 minutes
   ```

### Problème: Secret Not Found

**Erreur:** `Secret DROPLET_IP not found`

**Solution:**

1. Vérifier que le secret existe: Settings > Secrets and variables > Actions
2. Vérifier l'orthographe exacte dans le workflow
3. Les secrets ne sont PAS disponibles dans les forks (sécurité GitHub)

### Problème: Docker Build Fails on Droplet

**Solution:**

```bash
# SSH sur le droplet
ssh root@droplet-ip

cd /root/GastonApp

# Nettoyer Docker
docker system prune -a -f

# Reconstruire manuellement pour voir l'erreur
docker-compose -f .deploy/docker-compose.yml build --no-cache
```

---

## Bonnes Pratiques

### 1. Protection des Branches

Protégez la branche `master`:

1. GitHub > Settings > Branches
2. Add branch protection rule
3. Branch name pattern: `master`
4. Cochez:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging

### 2. Environnements GitHub

Configurez des environnements pour plus de contrôle:

1. Settings > Environments
2. New environment: `production`
3. Ajoutez des protection rules:
   - Required reviewers
   - Wait timer
   - Deployment branches (only `master`)

Puis dans le workflow:

```yaml
jobs:
  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    environment: production  # Nécessite une approbation
```

### 3. Rollback Strategy

En cas de problème, vous pouvez rollback:

```bash
# Option 1: Revert le commit
git revert HEAD
git push origin master
# → Déploiement automatique de la version précédente

# Option 2: Rollback manuel sur le droplet
ssh root@droplet-ip
cd /root/GastonApp
git log --oneline  # Voir les commits
git checkout COMMIT_HASH_PRECEDENT
./.deploy/deploy.sh
```

### 4. Versioning et Tags

```bash
# Créer un tag pour chaque release
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# GitHub Actions peut être configuré pour déployer sur les tags
```

---

## Commandes Utiles

```bash
# Voir le status des workflows
gh workflow list  # Nécessite GitHub CLI

# Voir les runs d'un workflow
gh run list --workflow=deploy-production.yml

# Voir les logs d'un run
gh run view RUN_ID --log

# Relancer un workflow qui a échoué
gh run rerun RUN_ID

# Déclencher manuellement un workflow
gh workflow run deploy-production.yml
```

---

## Checklist de Configuration

Avant le premier déploiement automatique:

- [ ] Tous les secrets GitHub sont configurés
- [ ] La clé SSH est ajoutée au droplet
- [ ] Le projet est cloné sur le droplet
- [ ] Docker est installé et fonctionne sur le droplet
- [ ] Un déploiement manuel a réussi au moins une fois
- [ ] Le health endpoint `/health` répond correctement
- [ ] Les workflows sont dans `.github/workflows/`
- [ ] Les workflows sont commités et pushés
- [ ] Les branches de protection sont configurées (optionnel)

---

## Ressources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

---

**Dernière mise à jour:** Janvier 2025