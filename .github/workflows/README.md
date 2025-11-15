# GitHub Actions Workflows

## Workflows Disponibles

### 1. `ci.yml` - Tests Automatiques
**Déclenchement:** Pull requests et pushs sur branches (sauf master/develop)

**Actions:**
- ✅ Lint (ESLint)
- ✅ Type checking (TypeScript)
- ✅ Build de l'application

### 2. `deploy-production.yml` - Déploiement Production
**Déclenchement:** Push sur `master` ou manuel

**Actions:**
- ✅ Tests complets
- ✅ Build
- ✅ Déploiement SSH vers le droplet
- ✅ Health check

### 3. `deploy-staging.yml` - Déploiement Staging
**Déclenchement:** Push sur `develop`/`staging` ou manuel

**Actions:**
- ✅ Tests complets
- ✅ Build
- ✅ Déploiement vers droplet staging (optionnel)
- ✅ Health check

## Configuration Required

Voir **[GITHUB_SECRETS.md](../../GITHUB_SECRETS.md)** pour la liste complète des secrets à configurer.

### Secrets Minimums pour Production

```
SSH_PRIVATE_KEY
DROPLET_IP
DROPLET_USER
REMOTE_PATH
VITE_OPENAI_API_KEY
VITE_API_URL
VITE_BUGSNAG_API_KEY
```

## Utilisation

### Déploiement Automatique

```bash
# Pousser sur master = déploiement auto en production
git push origin master

# Pousser sur develop = déploiement auto en staging
git push origin develop
```

### Déploiement Manuel

1. Allez sur: `https://github.com/fredattack/GastonApp/actions`
2. Sélectionnez le workflow voulu
3. Cliquez sur "Run workflow"
4. Sélectionnez la branche
5. Cliquez sur "Run workflow" (bouton vert)

## Monitoring

Suivez les déploiements sur:
`https://github.com/fredattack/GastonApp/actions`

## Variables d'Environnement

Les fichiers `.env` sont générés automatiquement lors du déploiement avec les valeurs des GitHub Secrets.

**Variables utilisées:**
- `VITE_OPENAI_API_KEY` - Clé API OpenAI
- `VITE_API_URL` - URL du backend
- `VITE_BUGSNAG_API_KEY` - Clé Bugsnag
- `VITE_NODE_ENV` - Environnement (production/staging)

## Troubleshooting

### Erreur: "npm: command not found" ou "workspace:* not supported"

✅ **Résolu:** Les workflows utilisent maintenant `pnpm` au lieu de `npm`.

### Erreur: SSH connection failed

Vérifiez que:
1. `SSH_PRIVATE_KEY` est correctement configuré dans les secrets
2. La clé publique correspondante est sur le droplet dans `~/.ssh/authorized_keys`
3. Le droplet est accessible et `DROPLET_IP` est correct

### Erreur: Health check failed

Le déploiement a réussi mais l'application ne répond pas:
1. SSH sur le droplet
2. Vérifiez les logs: `docker-compose -f .deploy/docker-compose.yml logs`
3. Vérifiez que les conteneurs tournent: `docker ps`

## Ressources

- **[GITHUB_SECRETS.md](../../GITHUB_SECRETS.md)** - Configuration des secrets
- **[DEPLOYMENT.md](../../DEPLOYMENT.md)** - Guide de déploiement complet
- **[QUICKSTART_DEPLOY.md](../../QUICKSTART_DEPLOY.md)** - Guide rapide

---

**Node Version:** 22.3.0
**Package Manager:** pnpm
**Build Tool:** Turborepo + Vite