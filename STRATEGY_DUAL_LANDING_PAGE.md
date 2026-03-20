# Stratégie: Dual Landing Page (Deux Versions Actives)

## 🎯 Objectif
Garder **les deux versions** et switcher facilement entre elles sans risque, pour tester puis décider progressivement.

---

## 📋 Architecture

### Option 1: Feature Flag (Recommandée ⭐)

**Structure**:
```
apps/landing-page/src/
├── components/
│   ├── Header.tsx          (v1 - actuelle)
│   ├── Header.v2.tsx       (v2 - nouveau design)
│   ├── Footer.tsx          (v1)
│   ├── Footer.v2.tsx       (v2)
│   └── Layout.tsx          (inchangé)
├── pages/
│   ├── Home.tsx            (v1)
│   ├── Home.v2.tsx         (v2)
│   └── [autres pages]
├── hooks/
│   └── useLandingPageVersion.ts  (NEW - hook pour version)
└── App.tsx                 (NEW - router intelligent)
```

**Avantage**:
- ✅ 0 risque - v1 reste intacte
- ✅ Switch instantané via env var ou localStorage
- ✅ Test A/B possible
- ✅ Rollback en 1 seconde
- ✅ Merge progressif

---

### Option 2: Routes Séparées

**Structure**:
```
/                          → Landing v1 (défaut)
/landing-v2                → Landing v2 (test)
/landing-compare           → Comparaison côte à côte
```

**Avantage**:
- ✅ Parfait pour partager une URL de test
- ✅ Pas de risque pour les utilisateurs (v1 par défaut)
- ❌ Plus complexe à mettre en place

---

## 🚀 Implémentation - Option 1 (Recommandée)

### Étape 1: Créer le hook de feature flag

```typescript
// apps/landing-page/src/hooks/useLandingPageVersion.ts

export type LandingPageVersion = 'v1' | 'v2';

export function useLandingPageVersion(): LandingPageVersion {
  // Priority: localStorage > env var > default

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('landingPageVersion');
    if (stored === 'v1' || stored === 'v2') {
      return stored;
    }
  }

  const envVersion = import.meta.env.VITE_LANDING_PAGE_VERSION as LandingPageVersion;
  if (envVersion === 'v1' || envVersion === 'v2') {
    return envVersion;
  }

  return 'v1'; // Default: v1 (safe)
}
```

### Étape 2: Copier les fichiers du worktree en v2

```bash
# Depuis le worktree, exporter les fichiers modifiés
cd .claude/worktrees/flamboyant-wescoff

# Copier dans le repo principal
cp apps/landing-page/src/components/Header.tsx \
   ../../apps/landing-page/src/components/Header.v2.tsx

cp apps/landing-page/src/components/Footer.tsx \
   ../../apps/landing-page/src/components/Footer.v2.tsx

cp apps/landing-page/src/pages/Home.tsx \
   ../../apps/landing-page/src/pages/Home.v2.tsx

cp apps/landing-page/tailwind.config.js \
   ../../apps/landing-page/tailwind.config.v2.js
```

### Étape 3: Créer des composants wrapper intelligents

```typescript
// apps/landing-page/src/components/Header.tsx (MODIFIER)

import { useLandingPageVersion } from '../hooks/useLandingPageVersion';
import HeaderV1 from './Header.v1.tsx';  // Ancien Header (renommé)
import HeaderV2 from './Header.v2.tsx';  // Nouveau Header

export default function Header() {
  const version = useLandingPageVersion();

  return version === 'v2'
    ? <HeaderV2 />
    : <HeaderV1 />;
}
```

```typescript
// apps/landing-page/src/components/Footer.tsx (MODIFIER)

import { useLandingPageVersion } from '../hooks/useLandingPageVersion';
import FooterV1 from './Footer.v1.tsx';
import FooterV2 from './Footer.v2.tsx';

export default function Footer() {
  const version = useLandingPageVersion();

  return version === 'v2'
    ? <FooterV2 />
    : <FooterV1 />;
}
```

```typescript
// apps/landing-page/src/pages/Home.tsx (MODIFIER)

import { useLandingPageVersion } from '../hooks/useLandingPageVersion';
import HomeV1 from './Home.v1.tsx';
import HomeV2 from './Home.v2.tsx';

export default function Home() {
  const version = useLandingPageVersion();

  return version === 'v2'
    ? <HomeV2 />
    : <HomeV1 />;
}
```

### Étape 4: Ajouter le contrôle utilisateur (Optional)

```typescript
// apps/landing-page/src/components/VersionSwitcher.tsx (NEW)

import { useLandingPageVersion } from '../hooks/useLandingPageVersion';

export function VersionSwitcher() {
  const currentVersion = useLandingPageVersion();

  const toggle = () => {
    const newVersion = currentVersion === 'v1' ? 'v2' : 'v1';
    localStorage.setItem('landingPageVersion', newVersion);
    window.location.reload();
  };

  return (
    <button
      onClick={toggle}
      className="fixed bottom-4 right-4 px-4 py-2 bg-gray-800 text-white rounded text-sm z-50"
    >
      🎨 Design v{currentVersion === 'v1' ? '1' : '2'} (Click to toggle)
    </button>
  );
}
```

**Afficher le switcher en dev/staging**:
```typescript
// apps/landing-page/src/App.tsx

import { VersionSwitcher } from './components/VersionSwitcher';

export function App() {
  const isDev = import.meta.env.DEV;

  return (
    <>
      {/* Pages */}
      <main>{/* ... */}</main>

      {/* Switcher en dev seulement */}
      {isDev && <VersionSwitcher />}
    </>
  );
}
```

### Étape 5: Configuration .env

```bash
# apps/landing-page/.env.local
VITE_LANDING_PAGE_VERSION=v1  # ou v2 pour tester

# Ou laisser vide → utilise localStorage → défaut v1
```

---

## 🧪 Workflow de Test

### Tester v2 rapidement:

```bash
# Option A: Via localStorage (en dev)
# - Ouvrir DevTools → Console
# - Taper: localStorage.setItem('landingPageVersion', 'v2')
# - Recharger la page

# Option B: Via .env.local
echo "VITE_LANDING_PAGE_VERSION=v2" >> apps/landing-page/.env.local
pnpm dev:landing-page
```

### Revenir à v1:

```bash
localStorage.setItem('landingPageVersion', 'v1')
# Ou: rm apps/landing-page/.env.local && pnpm dev:landing-page
```

---

## 📊 État à Chaque Étape

| Étape | v1 | v2 | Utilisateurs | Risque |
|-------|----|----|---|---|
| Actuel | ✅ | ❌ | Voient v1 | 0% |
| Après import | ✅ | ✅ | Voient v1 | 0% |
| Dev toggle | ✅ | ✅ | Voient v1 | 0% |
| Env v2 | ✅ | ✅ | Voient v2 | Test |
| Switch localStorage | ✅ | ✅ | Toggle v1↔v2 | Test |
| Décision finale | ✅ | ✅ | Décision 👇 | Zéro |

---

## 🎯 Décision Finale: Deux Options

### Option A: Garder v2 (Merger complètement)

```bash
# Supprimer les fichiers v1
rm apps/landing-page/src/components/Header.v1.tsx
rm apps/landing-page/src/components/Footer.v1.tsx
rm apps/landing-page/src/pages/Home.v1.tsx

# Renommer v2 en fichiers principaux
mv Header.v2.tsx Header.tsx
mv Footer.v2.tsx Footer.tsx
mv Home.v2.tsx Home.tsx

# Merger dans git
git add apps/landing-page/
git commit -m "style(landing-page): deploy new design as v1"
```

### Option B: Garder v1 (Ignorer v2)

```bash
# Supprimer les fichiers v2
rm apps/landing-page/src/components/Header.v2.tsx
rm apps/landing-page/src/components/Footer.v2.tsx
rm apps/landing-page/src/pages/Home.v2.tsx

# Revenir aux composants simples (pas de wrapper)
git checkout apps/landing-page/src/components/Header.tsx
git checkout apps/landing-page/src/components/Footer.tsx
git checkout apps/landing-page/src/pages/Home.tsx
```

---

## 🚨 Gestion du Tailwind Config

**Problème**: Les deux versions peuvent avoir des tokens différents.

**Solution 1** (Plus sûr):
```javascript
// apps/landing-page/tailwind.config.js
export default {
  theme: {
    extend: {
      // Charger les tokens de DEUX configs
      ...require('./tailwind.config.v1.js').theme.extend,
      ...require('./tailwind.config.v2.js').theme.extend,
    }
  }
}
```

**Solution 2** (Plus flexible):
```typescript
// apps/landing-page/src/styles/tokens.v1.ts
// apps/landing-page/src/styles/tokens.v2.ts
// Utiliser des variables CSS plutôt que Tailwind
```

---

## ✅ Checklist d'Implémentation

- [ ] Hook `useLandingPageVersion` créé
- [ ] Fichiers copiés: `Header.v2.tsx`, `Footer.v2.tsx`, `Home.v2.tsx`
- [ ] Anciens fichiers renommés: `Header.v1.tsx`, etc.
- [ ] Composants wrapper intelligents créés
- [ ] VersionSwitcher créé (optionnel)
- [ ] `.env.local` configuré pour testing
- [ ] Tailwind config fusionné
- [ ] Test: vérifier que v1 et v2 fonctionnent
- [ ] Commit: `feat(landing-page): add dual version support`

---

## 📝 Commande Git Final

```bash
# Une fois testé et décidé
git add apps/landing-page/
git commit -m "feat(landing-page): implement dual version system with feature flag

- Add useLandingPageVersion hook for version control
- Create v1 and v2 variants of Header, Footer, Home
- Add localStorage-based feature flag
- Allow instant switching between designs
- Zero risk: v1 is default, v2 behind feature flag"

git push origin master
```
