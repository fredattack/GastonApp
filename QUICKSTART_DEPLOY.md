# Quick Start - Déploiement GastonApp

Guide rapide pour déployer GastonApp sur votre droplet Digital Ocean en 5 minutes.

## Option 1: Déploiement Automatique (Recommandé)

### Prérequis
- Un droplet Digital Ocean avec Ubuntu 20.04/22.04
- Accès SSH au droplet
- Vos variables d'environnement Firebase/OpenAI

### Étapes

**1. Depuis votre machine locale, lancez le déploiement:**

```bash
pnpm deploy:remote -- --host VOTRE_DROPLET_IP
```

**2. Le script va:**
- ✅ Tester la connexion SSH
- ✅ Vérifier si Docker est installé (et l'installer si nécessaire)
- ✅ Cloner le projet
- ✅ Vous demander de configurer les variables d'environnement
- ✅ Déployer l'application

**3. Quand il vous demande de configurer .env:**

```bash
# SSH sur votre droplet
ssh root@VOTRE_DROPLET_IP

# Créer le fichier .env
cd /root/GastonApp
nano apps/web/.env

# Collez vos variables:
VITE_FIREBASE_API_KEY=votre_cle
VITE_FIREBASE_AUTH_DOMAIN=votre_domaine
VITE_FIREBASE_PROJECT_ID=votre_projet
VITE_FIREBASE_STORAGE_BUCKET=votre_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
VITE_FIREBASE_APP_ID=votre_app_id
VITE_OPENAI_API_KEY=votre_cle_openai
VITE_API_URL=votre_url_api
VITE_NODE_ENV=production

# Sauvegardez (Ctrl+O, Enter, Ctrl+X)
```

**4. Relancez le déploiement:**

```bash
pnpm deploy:remote -- --host VOTRE_DROPLET_IP
```

**5. C'est tout !** 🎉

Votre application est accessible sur: `http://VOTRE_DROPLET_IP`

---

## Option 2: Déploiement Automatique via GitHub Actions

### Configuration Unique (une seule fois)

**1. Configurer les GitHub Secrets:**

Allez sur: `https://github.com/fredattack/GastonApp/settings/secrets/actions`

Ajoutez ces secrets:

| Secret | Valeur |
|--------|--------|
| `SSH_PRIVATE_KEY` | Votre clé SSH privée complète |
| `DROPLET_IP` | IP de votre droplet |
| `DROPLET_USER` | `root` |
| `REMOTE_PATH` | `/root/GastonApp` |
| `VITE_FIREBASE_API_KEY` | Votre clé Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | Votre domaine Firebase |
| `VITE_FIREBASE_PROJECT_ID` | Votre projet ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Votre bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Votre sender ID |
| `VITE_FIREBASE_APP_ID` | Votre app ID |
| `VITE_OPENAI_API_KEY` | Votre clé OpenAI |
| `VITE_API_URL` | URL de votre API |

**2. Installer Docker sur le droplet:**

```bash
# SSH sur le droplet
ssh root@VOTRE_DROPLET_IP

# Télécharger et exécuter le script d'installation
curl -fsSL https://raw.githubusercontent.com/fredattack/GastonApp/master/.deploy/install-prerequisites.sh | sudo bash
```

**3. Cloner le projet une première fois:**

```bash
# Sur le droplet
cd /root
git clone https://github.com/fredattack/GastonApp.git
cd GastonApp

# Créer le fichier .env
nano apps/web/.env
# (Ajoutez vos variables comme ci-dessus)
```

### Utilisation

Après la configuration, chaque fois que vous pushez sur `master`:

```bash
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin master
```

**Le déploiement se fait automatiquement ! 🚀**

Suivez le progrès sur: `https://github.com/fredattack/GastonApp/actions`

---

## Option 3: Installation Manuelle Complète

### 1. SSH sur le droplet

```bash
ssh root@VOTRE_DROPLET_IP
```

### 2. Installer les prérequis

```bash
# Télécharger le script
curl -fsSL https://raw.githubusercontent.com/fredattack/GastonApp/master/.deploy/install-prerequisites.sh -o install.sh

# L'exécuter
chmod +x install.sh
sudo ./install.sh
```

### 3. Cloner le projet

```bash
cd /root
git clone https://github.com/fredattack/GastonApp.git
cd GastonApp
```

### 4. Configurer les variables d'environnement

```bash
nano apps/web/.env
```

Ajoutez:
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_OPENAI_API_KEY=...
VITE_API_URL=...
VITE_NODE_ENV=production
```

### 5. Déployer

```bash
./.deploy/deploy.sh
```

### 6. Vérifier

```bash
# Vérifier que les conteneurs tournent
docker ps

# Tester l'application
curl http://localhost/health
```

Ouvrez `http://VOTRE_DROPLET_IP` dans votre navigateur!

---

## Vérification

### L'application fonctionne ?

```bash
# Test du health check
curl http://VOTRE_DROPLET_IP/health

# Devrait retourner: healthy
```

### Voir les logs

```bash
# SSH sur le droplet
ssh root@VOTRE_DROPLET_IP

cd /root/GastonApp
docker-compose -f .deploy/docker-compose.yml logs -f
```

### Redémarrer l'application

```bash
cd /root/GastonApp
docker-compose -f .deploy/docker-compose.yml restart
```

---

## Mise à Jour de l'Application

### Avec le script remote

```bash
# Depuis votre machine locale
pnpm deploy:remote -- --host VOTRE_DROPLET_IP
```

### Manuellement sur le droplet

```bash
ssh root@VOTRE_DROPLET_IP
cd /root/GastonApp
git pull origin master
./.deploy/deploy.sh
```

### Automatiquement via GitHub Actions

```bash
# Juste pusher sur master
git push origin master
```

---

## Problèmes Courants

### Docker n'est pas installé

```bash
# Sur le droplet
curl -fsSL https://raw.githubusercontent.com/fredattack/GastonApp/master/.deploy/install-prerequisites.sh | sudo bash
```

### .env manquant

```bash
ssh root@VOTRE_DROPLET_IP
cd /root/GastonApp
nano apps/web/.env
# Ajoutez vos variables
```

### L'application ne démarre pas

```bash
# Voir les logs
ssh root@VOTRE_DROPLET_IP
cd /root/GastonApp
docker-compose -f .deploy/docker-compose.yml logs
```

### Page blanche

Vérifiez que toutes les variables d'environnement sont correctes, puis:

```bash
docker-compose -f .deploy/docker-compose.yml down
docker-compose -f .deploy/docker-compose.yml build --no-cache
docker-compose -f .deploy/docker-compose.yml up -d
```

---

## Commandes Utiles

```bash
# Voir les conteneurs
docker ps

# Voir les logs
docker-compose -f .deploy/docker-compose.yml logs -f

# Redémarrer
docker-compose -f .deploy/docker-compose.yml restart

# Arrêter
docker-compose -f .deploy/docker-compose.yml down

# Reconstruire
docker-compose -f .deploy/docker-compose.yml build --no-cache
```

---

## Ressources

- **Guide complet**: [MIGRATION_DEPLOYMENT.md](MIGRATION_DEPLOYMENT.md)
- **CI/CD Setup**: [CICD.md](CICD.md)
- **Documentation complète**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Architecture**: [CLAUDE.md](CLAUDE.md)

---

## Besoin d'aide ?

1. Consultez les guides détaillés ci-dessus
2. Vérifiez les logs: `docker-compose -f .deploy/docker-compose.yml logs`
3. Ouvrez une issue sur GitHub

---

**Bonne chance avec votre déploiement ! 🚀**