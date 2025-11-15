y# Migration du
Droplet Digital
Ocean vers la
Nouvelle Structure
Monorepo

Ce guide vous
accompagne dans la
migration de votre
droplet Digital
Ocean existant vers
la nouvelle
structure monorepo
de GastonApp.

## Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Prérequis](#prérequis)
- [Étape 1: Sauvegarde](#étape-1-sauvegarde)
- [Étape 2: Connexion au Droplet](#étape-2-connexion-au-droplet)
- [Étape 3: Mise à jour du Code](#étape-3-mise-à-jour-du-code)
- [Étape 4: Configuration de l'Environnement](#étape-4-configuration-de-lenvironnement)
- [Étape 5: Déploiement](#étape-5-déploiement)
- [Étape 6: Vérification](#étape-6-vérification)
- [Rollback en cas de Problème](#rollback-en-cas-de-problème)
- [Troubleshooting](#troubleshooting)

---

## Vue d'ensemble

La nouvelle
structure utilise:

- **Turborepo** pour
  la gestion du
  monorepo
- **pnpm** comme
  gestionnaire de
  paquets
- **Docker
  multi-stage builds
  ** pour
  l'optimisation
- **Nginx** pour
  servir
  l'application

**Différences
principales:**

- Structure
  monorepo (
  `apps/web/` au
  lieu de la racine)
- Utilisation de
  pnpm au lieu de
  npm/yarn
- Configuration
  Docker optimisée
- Variables
  d'environnement
  dans
  `apps/web/.env`

---

## Prérequis

### Sur votre machine locale:

- Accès SSH au
  droplet
- Git configuré
- Toutes les
  variables
  d'environnement
  sauvegardées

### Sur le droplet:

- Docker et Docker
  Compose installés
- Git installé
- Accès root ou sudo

---

## Étape 1: Sauvegarde

### 1.1 Sauvegarder les Variables d'Environnement

**Sur votre machine
locale:**

```bash
# Se connecter au droplet
ssh root@your-droplet-ip

# Localiser et sauvegarder l'ancien fichier .env
cd /path/to/old/GastonApp
cat .env > ~/gastonapp-env-backup.txt

# Afficher le contenu pour le copier
cat ~/gastonapp-env-backup.txt
```

**Copiez ces valeurs
** et conservez-les
en sécurité.

### 1.2 Sauvegarder la Base de Données (si applicable)

Si vous utilisez une
base de données
locale:

```bash
# Exemple pour PostgreSQL
pg_dump your_database > ~/gastonapp-db-backup.sql

# Exemple pour MySQL
mysqldump -u user -p your_database > ~/gastonapp-db-backup.sql
```

### 1.3 Sauvegarder les Certificats SSL (si configurés)

```bash
# Sauvegarder les certificats
sudo cp -r /etc/letsencrypt ~/letsencrypt-backup
sudo cp -r /etc/nginx/ssl ~/nginx-ssl-backup 2>/dev/null || true
```

### 1.4 Noter la Configuration Actuelle

```bash
# Vérifier les conteneurs en cours
docker ps

# Vérifier les ports utilisés
sudo lsof -i :80
sudo lsof -i :443

# Noter le chemin du projet actuel
pwd
```

---

## Étape 2: Connexion au Droplet

```bash
# Se connecter en SSH
ssh root@your-droplet-ip

# Ou si vous utilisez une clé SSH spécifique
ssh -i ~/.ssh/your-key root@your-droplet-ip
```

---

## Étape 3: Mise à jour du Code

### 3.1 Arrêter l'Ancienne Application

```bash
# Naviguer vers l'ancien projet
cd /path/to/old/GastonApp

# Arrêter les conteneurs Docker
docker-compose down

# Ou si vous utilisez pm2/nginx directement
sudo systemctl stop nginx
pm2 stop all  # si applicable
```

### 3.2 Créer un Backup du Projet Actuel

```bash
cd /path/to/parent/directory
mv GastonApp GastonApp-old-$(date +%Y%m%d)
```

### 3.3 Cloner la Nouvelle Version

```bash
# Cloner le nouveau repository
git clone https://github.com/fredattack/GastonApp.git
cd GastonApp

# Vérifier que vous êtes sur la bonne branche
git branch
git log -1
```

### 3.4 Vérifier la Structure

```bash
# Vérifier que la nouvelle structure est présente
ls -la
# Vous devriez voir: apps/, packages/, .deploy/, turbo.json, pnpm-workspace.yaml

ls -la apps/web/
# Vous devriez voir le code de l'application web

ls -la .deploy/
# Vous devriez voir: Dockerfile, docker-compose.yml, nginx.conf, deploy.sh
```

---

## Étape 4: Configuration de l'Environnement

### 4.1 Créer le Fichier .env pour l'Application Web

```bash
# Naviguer vers le dossier de l'application web
cd apps/web/

# Créer le fichier .env
nano .env
```

**Coller le contenu
suivant** (avec vos
vraies valeurs):

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key

# Backend API URL (si applicable)
VITE_API_URL=https://your-backend-api.com

# Environment
VITE_NODE_ENV=production
```

**Sauvegarder et
quitter** (Ctrl+O,
Enter, Ctrl+X dans
nano)

### 4.2 Vérifier les Permissions

```bash
# Retourner à la racine du projet
cd /path/to/GastonApp

# Vérifier que le script de déploiement est exécutable
chmod +x .deploy/deploy.sh
```

### 4.3 Configurer SSL (optionnel)

Si vous aviez SSL
configuré
précédemment:

```bash
# Copier les certificats sauvegardés
sudo cp -r ~/letsencrypt-backup/* /etc/letsencrypt/
sudo cp -r ~/nginx-ssl-backup/* .deploy/ssl/ 2>/dev/null || true

# Créer le dossier SSL si nécessaire
mkdir -p .deploy/ssl
```

---

## Étape 5: Déploiement

### 5.1 Vérifier Docker

```bash
# Vérifier que Docker fonctionne
docker --version
docker-compose --version

# Redémarrer Docker si nécessaire
sudo systemctl restart docker
```

### 5.2 Construire et Déployer

**Option A: Utiliser
le script de
déploiement (
Recommandé)**

```bash
# Depuis la racine du projet
./.deploy/deploy.sh
```

Ce script va:

1. Construire
   l'image Docker
2. Arrêter les
   anciens
   conteneurs
3. Démarrer les
   nouveaux
   conteneurs
4. Vérifier le
   statut

**Option B:
Commandes manuelles
**

```bash
# Construire l'image
docker-compose -f .deploy/docker-compose.yml build

# Arrêter les anciens conteneurs
docker-compose -f .deploy/docker-compose.yml down

# Démarrer les nouveaux conteneurs
docker-compose -f .deploy/docker-compose.yml up -d

# Vérifier le statut
docker-compose -f .deploy/docker-compose.yml ps
```

### 5.3 Suivre les Logs

```bash
# Suivre les logs en temps réel
docker-compose -f .deploy/docker-compose.yml logs -f

# Ou seulement le service web
docker-compose -f .deploy/docker-compose.yml logs -f web
```

**Attendez que vous
voyiez:**

- Le build se
  termine sans
  erreur
- Nginx démarre
  correctement
- Pas d'erreurs dans
  les logs

---

## Étape 6: Vérification

### 6.1 Vérifier que l'Application Fonctionne

```bash
# Test local sur le droplet
curl http://localhost

# Devrait retourner le HTML de votre application

# Tester le health check
curl http://localhost/health
# Devrait retourner: healthy
```

### 6.2 Vérifier depuis votre Navigateur

Ouvrez votre
navigateur et allez
sur:

-

`http://your-droplet-ip`

- Ou
  `https://your-domain.com`
  si vous avez un
  domaine

**Vérifiez:**

- La page se charge
  correctement
- Pas d'erreurs dans
  la console du
  navigateur (F12)
- Les
  fonctionnalités
  principales
  marchent
- Les connexions
  Firebase
  fonctionnent

### 6.3 Vérifier les Conteneurs

```bash
# Lister les conteneurs
docker ps

# Vous devriez voir un conteneur 'web' avec le status 'Up' et 'healthy'

# Vérifier les ressources utilisées
docker stats --no-stream
```

### 6.4 Vérifier les Logs pour les Erreurs

```bash
# Vérifier les logs nginx
docker-compose -f .deploy/docker-compose.yml exec web cat /var/log/nginx/error.log

# Vérifier les dernières lignes des logs
docker-compose -f .deploy/docker-compose.yml logs --tail=50 web
```

---

## Rollback en cas de Problème

Si quelque chose ne
va pas, vous pouvez
revenir à l'ancienne
version:

### Rollback Rapide

```bash
# Arrêter les nouveaux conteneurs
cd /path/to/GastonApp
docker-compose -f .deploy/docker-compose.yml down

# Retourner à l'ancienne version
cd /path/to/parent/directory
mv GastonApp GastonApp-new-failed
mv GastonApp-old-YYYYMMDD GastonApp

# Redémarrer l'ancienne application
cd GastonApp
docker-compose up -d  # ou la commande que vous utilisiez avant
```

### Récupérer les Données

```bash
# Restaurer la base de données si nécessaire
psql your_database < ~/gastonapp-db-backup.sql
# ou
mysql -u user -p your_database < ~/gastonapp-db-backup.sql

# Restaurer les certificats SSL
sudo cp -r ~/letsencrypt-backup/* /etc/letsencrypt/
```

---

## Troubleshooting

### Problème: Le build Docker échoue

**Erreur: "out of
memory" ou "killed"
**

```bash
# Augmenter la mémoire Docker
# Éditer /etc/docker/daemon.json
sudo nano /etc/docker/daemon.json

# Ajouter:
{
  "default-address-pools": [
    {"base":"172.17.0.0/16","size":24}
  ],
  "default-runtime": "runc",
  "max-concurrent-downloads": 1,
  "max-concurrent-uploads": 1
}

# Redémarrer Docker
sudo systemctl restart docker

# Réessayer le build avec plus de ressources
docker-compose -f .deploy/docker-compose.yml build --no-cache
```

**Erreur: "pnpm: not
found"**

Le Dockerfile
devrait installer
pnpm
automatiquement. Si
ce n'est pas le cas:

```bash
# Vérifier le Dockerfile
cat .deploy/Dockerfile | grep pnpm

# Rebuild en nettoyant le cache
docker system prune -a
docker-compose -f .deploy/docker-compose.yml build --no-cache
```

### Problème: Les conteneurs ne démarrent pas

```bash
# Vérifier les logs détaillés
docker-compose -f .deploy/docker-compose.yml logs

# Vérifier si le port est déjà utilisé
sudo lsof -i :80
sudo lsof -i :443

# Tuer le processus si nécessaire
sudo kill -9 PID

# Redémarrer
docker-compose -f .deploy/docker-compose.yml up -d
```

### Problème: Page blanche ou erreurs 404

**Cause possible:
Variables
d'environnement
manquantes**

```bash
# Vérifier que le fichier .env existe
ls -la apps/web/.env

# Vérifier son contenu
cat apps/web/.env

# Rebuild avec les bonnes variables
docker-compose -f .deploy/docker-compose.yml down
docker-compose -f .deploy/docker-compose.yml build --no-cache
docker-compose -f .deploy/docker-compose.yml up -d
```

**Cause possible:
Build incomplet**

```bash
# Vérifier les fichiers construits dans le conteneur
docker-compose -f .deploy/docker-compose.yml exec web ls -la /usr/share/nginx/html

# Vous devriez voir: index.html, assets/, etc.
# Si vide ou manquant, rebuild:
docker-compose -f .deploy/docker-compose.yml build --no-cache
```

### Problème: Erreurs CORS ou API

**Vérifier la
configuration de
l'API:**

```bash
# Vérifier VITE_API_URL dans .env
cat apps/web/.env | grep VITE_API_URL

# S'assurer que l'URL est correcte et accessible
curl https://your-backend-api.com/health  # ou votre endpoint de test
```

**Vérifier les
headers nginx:**

```bash
# Vérifier la config nginx
cat .deploy/nginx.conf | grep -A 10 "location /api"

# Si nécessaire, décommenter la section proxy dans nginx.conf
```

### Problème: SSL ne fonctionne pas

Si vous aviez SSL
avant:

```bash
# Vérifier les certificats
sudo certbot certificates

# Renouveler si nécessaire
sudo certbot renew

# Éditer nginx.conf pour activer SSL
nano .deploy/nginx.conf

# Décommenter la section SSL (lignes 54-66)
# Mettre à jour server_name avec votre domaine

# Rebuild et redéployer
docker-compose -f .deploy/docker-compose.yml down
docker-compose -f .deploy/docker-compose.yml build
docker-compose -f .deploy/docker-compose.yml up -d
```

### Problème: Performance lente

```bash
# Vérifier les ressources du droplet
htop

# Vérifier l'utilisation de Docker
docker stats

# Si nécessaire, upgrader le droplet:
# - Aller sur Digital Ocean Dashboard
# - Sélectionner le droplet
# - Resize -> Choisir un plan plus grand
```

### Problème: Les mises à jour ne se reflètent pas

```bash
# Clear le cache Docker
docker system prune -a

# Rebuild sans cache
docker-compose -f .deploy/docker-compose.yml build --no-cache

# Redémarrer
docker-compose -f .deploy/docker-compose.yml down
docker-compose -f .deploy/docker-compose.yml up -d
```

---

## Commandes Utiles Post-Déploiement

### Mise à jour de l'Application

```bash
# Se connecter au droplet
ssh root@your-droplet-ip

# Naviguer vers le projet
cd /path/to/GastonApp

# Pull les derniers changements
git pull origin main  # ou votre branche

# Redéployer
./.deploy/deploy.sh
```

### Monitoring

```bash
# Voir les logs en temps réel
docker-compose -f .deploy/docker-compose.yml logs -f

# Voir le statut des conteneurs
docker-compose -f .deploy/docker-compose.yml ps

# Voir les ressources utilisées
docker stats

# Voir l'espace disque
df -h
```

### Maintenance

```bash
# Nettoyer les images inutilisées
docker system prune -a

# Redémarrer l'application
docker-compose -f .deploy/docker-compose.yml restart

# Arrêter l'application
docker-compose -f .deploy/docker-compose.yml down

# Voir tous les conteneurs (même arrêtés)
docker ps -a
```

---

## Checklist Finale

Après la migration,
vérifiez:

- [ ] L'application
  se charge
  correctement sur
  `http://your-droplet-ip`
- [ ] Pas d'erreurs
  dans la console du
  navigateur
- [ ] Les connexions
  Firebase
  fonctionnent
- [ ] Les
  fonctionnalités
  principales
  marchent (créer
  event, créer pet,
  etc.)
- [ ] Les logs
  Docker ne montrent
  pas d'erreurs
  critiques
- [ ] Le health
  check retourne "
  healthy":
  `curl http://localhost/health`
- [ ] SSL fonctionne
  si configuré (
  https://)
- [ ] Les variables
  d'environnement
  sont correctes
- [ ] Le backup de
  l'ancienne version
  est en sécurité
- [ ] La
  documentation est
  à jour

---

## Support et Ressources

### Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) -
  Guide de
  déploiement
  complet
- [CLAUDE.md](CLAUDE.md) -
  Vue d'ensemble du
  projet
- [README.md](README.md) -
  Quick start

### Commandes Rapides

```bash
# Déployer
./.deploy/deploy.sh

# Voir les logs
docker-compose -f .deploy/docker-compose.yml logs -f

# Redémarrer
docker-compose -f .deploy/docker-compose.yml restart

# Arrêter
docker-compose -f .deploy/docker-compose.yml down
```

### En cas de Problème

1. Vérifier les
   logs:
   `docker-compose -f .deploy/docker-compose.yml logs`
2. Vérifier le
   health check:
   `curl http://localhost/health`
3. Consulter la
   section [Troubleshooting](#troubleshooting)
4. Rollback si
   nécessaire (voir
   section dédiée)

---

**Date de création
**: Janvier 2025
**Dernière mise à
jour**: Janvier 2025
