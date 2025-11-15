# Configuration GitHub Secrets

Ce document liste
tous les secrets à
configurer dans
GitHub Actions pour
le déploiement
automatique.

## Configuration

Allez sur:
`https://github.com/fredattack/GastonApp/settings/secrets/actions`

---

## Secrets pour Production

### 1. Secrets SSH et Serveur

| Nom               | Description                     | Exemple                    |
|-------------------|---------------------------------|----------------------------|
| `SSH_PRIVATE_KEY` | Clé SSH privée complète         | Contenu de `~/.ssh/id_rsa` |
| `DROPLET_IP`      | IP du droplet de production     | `64.226.118.164`           |
| `DROPLET_USER`    | Utilisateur SSH                 | `root`                     |
| `REMOTE_PATH`     | Chemin du projet sur le droplet | `/root/GastonApp`          |

### 2. Secrets Application

| Nom                    | Description                                |
|------------------------|--------------------------------------------|
| `VITE_OPENAI_API_KEY`  | Clé API OpenAI                             |
| `VITE_API_URL`         | URL de votre backend API                   |
| `VITE_BUGSNAG_API_KEY` | Clé API Bugsnag pour le tracking d'erreurs |

---

## Secrets pour Staging (Optionnel)

Si vous voulez un
environnement de
staging:

### Variables (pas secrets)

Dans **Variables** (
pas **Secrets**):

| Nom                    | Valeur                    |
|------------------------|---------------------------|
| `STAGING_DROPLET_IP`   | IP du droplet de staging  |
| `STAGING_DROPLET_USER` | `root`                    |
| `STAGING_REMOTE_PATH`  | `/root/GastonApp-staging` |

### Secrets pour Staging

| Nom                            | Description                 |
|--------------------------------|-----------------------------|
| `STAGING_SSH_PRIVATE_KEY`      | Clé SSH pour staging        |
| `STAGING_VITE_OPENAI_API_KEY`  | OpenAI API key pour staging |
| `STAGING_VITE_API_URL`         | API URL pour staging        |
| `STAGING_VITE_BUGSNAG_API_KEY` | Bugsnag key pour staging    |

---

## Comment Ajouter un Secret

1. Allez sur
   `https://github.com/fredattack/GastonApp/settings/secrets/actions`
2. Cliquez sur **New
   repository secret
   **
3. Entrez le **Name
   ** (exactement
   comme listé
   ci-dessus)
4. Entrez la **Value
   **
5. Cliquez sur **Add
   secret**

## Comment Obtenir votre Clé SSH

```bash
# Afficher votre clé privée
cat ~/.ssh/id_rsa

# Copiez TOUT le contenu (y compris BEGIN et END)
# Collez-le comme valeur de SSH_PRIVATE_KEY
```

## Vérifier que les Secrets sont Configurés

Une fois tous les
secrets ajoutés,
vous pouvez
déclencher un
workflow
manuellement:

1. Allez sur
   `https://github.com/fredattack/GastonApp/actions`
2. Cliquez sur "
   Deploy to
   Production"
3. Cliquez sur "Run
   workflow"
4. Sélectionnez la
   branche `master`
5. Cliquez sur le
   bouton vert "Run
   workflow"

Si tous les secrets
sont corrects, le
déploiement devrait
réussir.

---

## Déclenchement Automatique

Une fois les secrets
configurés:

- **Push
  sur `master`** →
  Déploiement
  automatique en
  production
- **Push
  sur `develop`** →
  Déploiement
  automatique en
  staging (si
  configuré)
- **Pull Request** →
  Tests automatiques
  uniquement

---

**Dernière mise à
jour:** Janvier 2025
