# 🚀 GastonApp - Plan d'Optimisation Complet

> **Objectif:** Transformer GastonApp d'un prototype avec bugs critiques en MVP production-ready en 8 semaines

**Dernière mise à jour:** 2025-11-11
**Statut actuel:** 37 issues identifiées (10 critiques, 9 hautes, 11 moyennes, 7 basses)
**Cible MVP:** 8 semaines pour 1,000 utilisateurs

---

## 📊 État des lieux

### Forces
✅ Architecture technique solide (React + TypeScript + Laravel)
✅ Différenciation unique (Assistant vocal IA)
✅ Backend Docker fonctionnel
✅ Marché énorme ($2-3B, 18% CAGR)

### Faiblesses critiques
❌ **Suppression de pets ne fonctionne PAS** (fausse confirmation UI)
❌ **Authentification hardcodée** (tous les users = "1")
❌ **37 bugs identifiés** dont 10 critiques
❌ **Data layer incohérent** (mix Firebase + REST API)
❌ **Pas de validation des inputs**

---

## 🎯 Stratégie d'Optimisation

### Principe directeur
> **"Mieux vaut 3 features parfaites que 10 features cassées"**

### Approche en 3 phases

**Phase 1 (Semaines 1-2): STABILISATION**
Objectif: Réparer les bugs critiques qui bloquent l'utilisation basique

**Phase 2 (Semaines 3-5): MVP CORE**
Objectif: Compléter les fonctionnalités essentielles pour le lancement

**Phase 3 (Semaines 6-8): POLISH & LAUNCH**
Objectif: Optimiser l'UX et préparer le lancement public

---

## 📅 Phase 1: STABILISATION (Semaines 1-2)

### Objectif
Corriger les 10 bugs **CRITIQUES** qui empêchent l'utilisation de base de l'app.

### Sprint 1.1: Bugs Bloquants (3 jours)

#### 🔴 CRITIQUE #1: Suppression de pets cassée
**Fichier:** `src/pages/content/Pet/Pets.tsx:126-137`
**Problème:** La suppression s'affiche en UI mais n'est JAMAIS persistée en DB
**Impact:** Utilisateurs ne peuvent pas supprimer de pets
**Temps estimé:** 2 heures

**Action:**
```typescript
// AVANT (ligne 126-137)
const timeout = setTimeout(() => {
    console.log("Suppression réussie après 10 secondes");
    // Aucun appel API ici ! ❌
}, 10000);

// APRÈS (fix complet)
const timeout = setTimeout(async () => {
    try {
        await modelService.delete("pets", petToDelete);
        setDeletionQueue((prev) => prev.filter(item => item.id !== id));
        addToast({ message: "Pet deleted successfully", type: "success" });
        refreshPets();
    } catch (error) {
        addToast({ message: "Failed to delete pet", type: "error" });
        console.error("Delete error:", error);
    }
}, 10000);
```

**Test de validation:**
- [ ] Supprimer un pet → Attendre 10 sec → Vérifier en DB qu'il a disparu
- [ ] Cliquer "Undo" avant 10 sec → Pet reste
- [ ] Rafraîchir la page après suppression → Pet ne réapparaît pas

---

#### 🔴 CRITIQUE #2: Authentification hardcodée
**Fichiers:**
- `src/services/ModelService.ts:87`
- `src/pages/content/Pet/ThePetFormPage.tsx:83`

**Problème:** Tous les users voient les pets de l'user "1"
**Impact:** Aucune isolation multi-user, sécurité compromise
**Temps estimé:** 4 heures

**Action:**
1. Créer un AuthContext avec Firebase Auth
2. Remplacer `getAuthenticatedOwnerId()` par vraie auth
3. Stocker userId dans localStorage après login
4. Ajouter token Bearer dans axios headers

```typescript
// Nouveau fichier: src/contexts/AuthContext.tsx
export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        return auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            if (user) {
                localStorage.setItem('userId', user.uid);
            }
        });
    }, []);

    return { currentUser, userId: currentUser?.uid };
};

// Dans ModelService.ts
private getAuthenticatedOwnerId(): string | null {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        throw new Error("User not authenticated");
    }
    return userId;
}
```

**Test de validation:**
- [ ] Créer 2 comptes différents
- [ ] User A crée un pet → User B ne le voit PAS
- [ ] Se déconnecter → Redirection vers /login

---

#### 🔴 CRITIQUE #3: Types TypeScript invalides
**Fichier:** `src/types/global.d.ts:12,71,72`
**Problème:** Syntaxe Flow (`?string`) au lieu de TypeScript
**Impact:** Compilation échoue en mode strict
**Temps estimé:** 30 minutes

**Action:**
```typescript
// AVANT
interface PetFormData {
    id: ?string; // ❌ Flow syntax
}

// APRÈS
interface PetFormData {
    id: string | null; // ✅ TypeScript
}
```

**Test de validation:**
- [ ] `npm run build` → Pas d'erreurs TypeScript
- [ ] Activer `strict: true` dans tsconfig.json

---

#### 🔴 CRITIQUE #4: EventSummary - Missing await
**Fichier:** `src/components/Event/list/EventSummary.tsx:85-98`
**Problème:** Success toast avant que l'API réponde
**Temps estimé:** 1 heure

**Action:**
```typescript
// AVANT
const handleChangeDoneStatus = (event: Event) => {
    try {
        const resp = eventService.changeDoneStatus(event); // ❌ No await
        addToast({ message: "Event updated!", type: "success" });
    } catch (error) { /* Never caught */ }
};

// APRÈS
const handleChangeDoneStatus = async (event: Event) => {
    try {
        await eventService.changeDoneStatus(event);
        addToast({ message: "Event updated!", type: "success" });
        refreshEvents();
    } catch (error) {
        addToast({ message: "Failed to update event", type: "error" });
    }
};
```

---

#### 🔴 CRITIQUE #5: Checkbox handling cassé
**Fichier:** `src/pages/content/Pet/ThePetFormPage.tsx:70-79`
**Problème:** Checkbox devient `"checked"` (string) au lieu de `true` (boolean)
**Temps estimé:** 30 minutes

**Action:**
```typescript
// AVANT
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? "checked" : value // ❌
    }));
};

// APRÈS
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value // ✅
    }));
};
```

---

### Sprint 1.2: Sécurité & Data Layer (4 jours)

#### 🔴 CRITIQUE #6: Bugsnag API key exposée
**Fichier:** `src/App.tsx:26,30`
**Temps estimé:** 1 heure

**Action:**
```typescript
// Ajouter dans .env
VITE_BUGSNAG_API_KEY=05ccd85ddac435639e21692be85d8bf8

// Dans App.tsx
Bugsnag.start({
    apiKey: import.meta.env.VITE_BUGSNAG_API_KEY,
});
```

---

#### 🔴 CRITIQUE #7: EventsContext dates hardcodées
**Fichier:** `src/contexts/EventsContext.tsx:28-33`
**Problème:** Toujours fetch Janvier 2024, jamais les autres mois
**Temps estimé:** 2 heures

**Action:**
```typescript
// AVANT
const getDateRange = (date: Date) => {
    return {
        start_date: "2024-01-01", // ❌ Hardcoded
        end_date: "2024-01-31",
    };
};

// APRÈS
const getDateRange = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    return {
        start_date: firstDay.toISOString().split('T')[0],
        end_date: lastDay.toISOString().split('T')[0],
    };
};
```

---

#### 🟠 HIGH #8: Consolidation data layer
**Problème:** Mix Firebase + REST API incohérent
**Temps estimé:** 6 heures

**Décision stratégique:**
- **Option A:** 100% REST API (recommandé car backend Laravel existe)
- **Option B:** 100% Firebase (plus simple mais moins scalable)

**Plan (Option A - REST API):**
1. Supprimer tous imports Firestore dans composants
2. Remplacer `addDoc/updateDoc` par `modelService.add/update`
3. Supprimer `src/repository/ModelRepository.ts` (Firestore, inutilisé)
4. Garder Firebase uniquement pour Auth et Storage

**Fichiers à modifier:**
- `src/pages/content/Pet/ThePetFormPage.tsx` (lignes 83-95)
- `src/pages/content/Pet/Pets.tsx` (supprimer imports ligne 1)

---

#### 🟠 HIGH #9: Tokens d'authentification dans axios
**Fichier:** `src/providers/apiClientProvider/axiosClient.ts`
**Temps estimé:** 2 heures

**Action:**
```typescript
import { auth } from '@/firebase/firebase';

axiosClient.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

**Backend (Laravel):**
```php
// Ajouter middleware dans routes/api.php
Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('pets', PetController::class);
    Route::apiResource('events', EventController::class);
});
```

---

#### 🟠 HIGH #10: EventController.destroy manque return
**Fichier:** `gaston-backend/app/Http/Controllers/Api/EventController.php:38`
**Temps estimé:** 15 minutes

**Action:**
```php
public function destroy(Event $event)
{
    return response()->json(
        $this->eventService->delete($event->id, ...)
    );
}
```

---

### Livrables Phase 1
- [ ] Les 10 bugs critiques corrigés
- [ ] Tests manuels validés pour chaque fix
- [ ] Branch `feature/stabilization` mergée dans `develop`
- [ ] Documentation des breaking changes

**Temps total Phase 1:** 10 jours ouvrés
**Critère de succès:** Aucun bug bloquant restant, auth fonctionnelle

---

## 📅 Phase 2: MVP CORE (Semaines 3-5)

### Objectif
Compléter les fonctionnalités essentielles + nettoyer le code.

### Sprint 2.1: Validation & Error Handling (5 jours)

#### 🟠 Task #11: Validation formulaire Pet
**Temps estimé:** 4 heures

**Action:**
```typescript
// Nouveau fichier: src/utils/validation.ts
export const validatePetForm = (data: PetFormData): string[] => {
    const errors: string[] = [];

    if (!data.name || data.name.length < 2) {
        errors.push("Name must be at least 2 characters");
    }

    if (!/^[a-zA-Z\s-]+$/.test(data.name)) {
        errors.push("Name contains invalid characters");
    }

    if (!["dog", "cat", "bird", "other"].includes(data.species)) {
        errors.push("Invalid species");
    }

    if (data.birth_date && new Date(data.birth_date) > new Date()) {
        errors.push("Birth date cannot be in the future");
    }

    return errors;
};

// Dans PetForm.tsx
const handleSubmit = () => {
    const errors = validatePetForm(petFormData);
    if (errors.length > 0) {
        errors.forEach(err => addToast({ message: err, type: "error" }));
        return;
    }
    // Continue...
};
```

---

#### 🟠 Task #12: Error boundaries
**Temps estimé:** 3 heures

**Action:**
```typescript
// Nouveau fichier: src/components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component<Props, State> {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        Bugsnag.notify(error, (event) => {
            event.addMetadata('errorInfo', errorInfo);
        });
    }

    render() {
        if (this.state.hasError) {
            return <ErrorFallback error={this.state.error} />;
        }
        return this.props.children;
    }
}

// Dans App.tsx
<ErrorBoundary>
    <RouterProvider router={router} />
</ErrorBoundary>
```

---

#### 🟠 Task #13: Unified error handling
**Temps estimé:** 4 heures

**Stratégie:**
1. Créer `src/utils/errorHandler.ts`
2. Wrapper toutes les appels API
3. Format d'erreur cohérent côté backend

```typescript
// src/utils/errorHandler.ts
export const handleApiError = (error: any): string => {
    if (error.response) {
        switch (error.response.status) {
            case 401:
                return "Please log in again";
            case 422:
                return error.response.data.message || "Validation error";
            case 404:
                return "Resource not found";
            case 500:
                return "Server error. Please try again later";
            default:
                return "An error occurred";
        }
    }
    return "Network error. Check your connection";
};

// Usage dans services
try {
    await axiosClient.post('/pets', data);
} catch (error) {
    const message = handleApiError(error);
    addToast({ message, type: "error" });
    throw error;
}
```

---

### Sprint 2.2: Code Quality & Types (5 jours)

#### 🟡 Task #14: Supprimer tous les `any`
**Fichiers concernés:** 50+ occurrences
**Temps estimé:** 8 heures

**Approche:**
1. Créer interfaces manquantes dans `src/types/`
2. Remplacer progressivement par fichier
3. Activer `noImplicitAny` dans tsconfig.json

**Exemple:**
```typescript
// AVANT
const handleChange = (e: any) => { // ❌
    // ...
};

// APRÈS
type FormChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

const handleChange = (e: FormChangeEvent) => { // ✅
    // ...
};
```

**Priorité par fichier:**
1. `src/services/ModelService.ts` (11 occurrences)
2. `src/repository/*.ts` (20+ occurrences)
3. `src/components/Modal/ActionModal.tsx` (11 occurrences)

---

#### 🟡 Task #15: Supprimer `@ts-ignore`
**Occurrences:** 8 fichiers
**Temps estimé:** 4 heures

**Méthode:**
1. Commenter le `@ts-ignore`
2. Voir l'erreur TypeScript
3. Fixer la cause root
4. Supprimer le commentaire

---

#### 🟡 Task #16: Supprimer console.logs
**Occurrences:** 40+ fichiers
**Temps estimé:** 2 heures

**Action:**
```bash
# Trouver tous les console.log
npm run lint:fix

# Remplacer par logger
import { logger } from '@/utils/logger';

logger.debug('Pet data:', petData); // Development only
logger.error('API error:', error); // Production + Bugsnag
```

---

### Sprint 2.3: Features Core (5 jours)

#### 🟠 Task #17: Implémenter méthodes pet actions
**Fichier:** `src/pages/content/Pet/Pets.tsx:87-177`
**Temps estimé:** 6 heures

**Actions manquantes:**
```typescript
// toggleActiveStatus (ligne 87)
const toggleActiveStatus = async (id: string) => {
    try {
        const pet = pets.find(p => p.id === id);
        await modelService.update("pets", id, {
            isActive: !pet.isActive
        });
        addToast({ message: "Status updated", type: "success" });
        refreshPets();
    } catch (error) {
        addToast({ message: "Failed to update", type: "error" });
    }
};

// setDeceased (ligne 93)
const setDeceased = async (id: string) => {
    const result = await Swal.fire({
        title: "Mark as deceased?",
        showCancelButton: true,
    });

    if (result.isConfirmed) {
        await modelService.update("pets", id, {
            status: "deceased",
            deceased_date: new Date().toISOString(),
        });
        refreshPets();
    }
};

// addTreatment, addMenu, addRendezvous
// → Ces features sont pour Phase 3
```

---

#### 🟠 Task #18: Delete button dans EventCalendarDropdown
**Fichier:** `src/components/Event/list/EventCalendarDropdown.tsx:94-100`
**Temps estimé:** 1 heure

**Action:**
```typescript
<button
    type="button"
    onClick={() => handleDeleteEvent(event)}
    className="..."
>
    <FontAwesomeIcon icon={faTrash} className="mr-2" />
    Delete Event
</button>

const handleDeleteEvent = async (event: Event) => {
    const result = await Swal.fire({
        title: "Delete this event?",
        showCancelButton: true,
    });

    if (result.isConfirmed) {
        await eventService.delete(event);
        refreshEvents();
    }
};
```

---

#### 🟠 Task #19: Onboarding flow
**Nouveau fichier:** `src/components/Onboarding/OnboardingWizard.tsx`
**Temps estimé:** 8 heures

**Flow:**
1. Welcome screen
2. Add first pet
3. Create first event
4. Enable notifications
5. Voice assistant intro

---

### Sprint 2.4: AI Features Polish (5 jours)

#### 🟠 Task #20: Error handling pour Speech Recognition
**Fichier:** `src/hooks/useSpeechRecognition.ts`
**Temps estimé:** 3 heures

**Action:**
```typescript
// Améliorer la détection de support
const checkBrowserSupport = (): boolean => {
    if (!('webkitSpeechRecognition' in window)) {
        addToast({
            message: "Voice recognition not supported on this browser. Try Chrome.",
            type: "warning"
        });
        return false;
    }
    return true;
};

// Gérer les timeouts
recognition.onend = () => {
    if (isListening) {
        // Relancer automatiquement si timeout
        recognition.start();
    }
};
```

---

#### 🟠 Task #21: OpenAI error handling
**Temps estimé:** 2 heures

**Action:**
```typescript
// Dans OpenAIService
try {
    const response = await openai.chat.completions.create({...});
    return response.choices[0].message.content;
} catch (error) {
    if (error.code === 'insufficient_quota') {
        throw new Error("OpenAI quota exceeded. Please contact support.");
    }
    if (error.code === 'rate_limit_exceeded') {
        throw new Error("Too many requests. Please try again in a moment.");
    }
    throw new Error("AI service temporarily unavailable");
}
```

---

### Livrables Phase 2
- [ ] Tous les bugs HIGH corrigés
- [ ] Validation complète des formulaires
- [ ] Error handling unifié
- [ ] Types TypeScript propres (pas de `any`, pas de `@ts-ignore`)
- [ ] Features core implémentées
- [ ] Onboarding flow fonctionnel
- [ ] Tests E2E pour happy paths

**Temps total Phase 2:** 15 jours ouvrés
**Critère de succès:** App utilisable de bout en bout sans bugs critiques

---

## 📅 Phase 3: POLISH & LAUNCH (Semaines 6-8)

### Objectif
Optimiser UX, performance, et préparer lancement beta.

### Sprint 3.1: UX Polish (5 jours)

#### 🟡 Task #22: Loading states partout
**Temps estimé:** 4 heures

**Action:**
```typescript
// Ajouter dans chaque fetch
const [isLoading, setIsLoading] = useState(false);

const fetchPets = async () => {
    setIsLoading(true);
    try {
        const data = await modelService.getModels("pets");
        setPets(data);
    } finally {
        setIsLoading(false);
    }
};

// UI
{isLoading ? <Skeleton count={3} /> : <PetList pets={pets} />}
```

---

#### 🟡 Task #23: Empty states
**Temps estimé:** 3 heures

**Action:**
```typescript
// src/components/EmptyState.tsx
export const EmptyPetsState = () => (
    <div className="text-center py-12">
        <FontAwesomeIcon icon={faPaw} size="3x" className="text-gray-300" />
        <h3>No pets yet</h3>
        <p>Add your first pet to get started</p>
        <Button onClick={onAddPet}>Add Pet</Button>
    </div>
);
```

---

#### 🟡 Task #24: Animations & transitions
**Temps estimé:** 4 heures

**Action:**
```typescript
// Ajouter Framer Motion
npm install framer-motion

// Animer listes
<motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
>
    <PetCard pet={pet} />
</motion.div>
```

---

### Sprint 3.2: Performance (3 jours)

#### 🟡 Task #25: Lazy loading & code splitting
**Temps estimé:** 3 heures

**Action:**
```typescript
// Router avec lazy loading
const Pets = lazy(() => import('@/pages/content/Pet/Pets'));
const Events = lazy(() => import('@/pages/content/Event/Events'));

<Suspense fallback={<PageLoader />}>
    <Routes>
        <Route path="/pets" element={<Pets />} />
    </Routes>
</Suspense>
```

---

#### 🟡 Task #26: Optimistic updates
**Temps estimé:** 4 heures

**Action:**
```typescript
// Dans PetsContext
const updatePet = async (id: string, data: Partial<Pet>) => {
    // Optimistic update
    setPets(prev => prev.map(p =>
        p.id === id ? { ...p, ...data } : p
    ));

    try {
        await modelService.update("pets", id, data);
    } catch (error) {
        // Rollback on error
        refreshPets();
        throw error;
    }
};
```

---

#### 🟡 Task #27: Image optimization
**Temps estimé:** 2 heures

**Action:**
```typescript
// Lazy load images
<img
    src={pet.photo}
    loading="lazy"
    onError={(e) => e.target.src = '/placeholder-pet.png'}
/>

// Compress uploads
import imageCompression from 'browser-image-compression';

const compressImage = async (file: File) => {
    return await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
    });
};
```

---

### Sprint 3.3: Tests & QA (5 jours)

#### 🟡 Task #28: Tests E2E critiques
**Temps estimé:** 8 heures

**Scénarios:**
```typescript
// tests/e2e/pet-management.spec.ts
test('User can create, edit, and delete a pet', async ({ page }) => {
    await page.goto('/pets');
    await page.click('text=Add Pet');
    await page.fill('[name="name"]', 'Rex');
    await page.selectOption('[name="species"]', 'dog');
    await page.click('button:has-text("Save")');

    await expect(page.locator('text=Rex')).toBeVisible();

    // Edit
    await page.click('[data-testid="edit-pet"]');
    await page.fill('[name="name"]', 'Rex Updated');
    await page.click('button:has-text("Save")');

    await expect(page.locator('text=Rex Updated')).toBeVisible();

    // Delete
    await page.click('[data-testid="delete-pet"]');
    await page.waitForTimeout(11000); // Wait for undo timeout

    await expect(page.locator('text=Rex Updated')).not.toBeVisible();
});
```

---

#### 🟡 Task #29: Security audit
**Temps estimé:** 4 heures

**Checklist:**
- [ ] XSS: Tous les inputs sanitized
- [ ] CSRF: Tokens sur mutations
- [ ] Auth: Tous les endpoints protégés
- [ ] SQL Injection: Eloquent ORM (Laravel protège)
- [ ] Rate limiting: Activer sur API
- [ ] HTTPS: Enforcer en production

---

### Sprint 3.4: Launch Prep (3 jours)

#### 🟡 Task #30: Analytics setup
**Temps estimé:** 3 heures

**Action:**
```typescript
// Google Analytics 4
import ReactGA from "react-ga4";

ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID);

// Track events
const trackEvent = (category: string, action: string, label?: string) => {
    ReactGA.event({ category, action, label });
};

// Usage
trackEvent('Pet', 'Created', 'Dog');
trackEvent('Voice', 'Started', 'Event Creation');
```

---

#### 🟡 Task #31: Beta landing page
**Temps estimé:** 4 heures

**Contenu:**
- Hero avec value prop
- Demo video (30 sec)
- Beta signup form
- Feature highlights
- FAQ

---

#### 🟡 Task #32: Beta tester onboarding
**Temps estimé:** 3 heures

**Email automation:**
1. Welcome email avec instructions
2. Day 3: Feature tutorial
3. Day 7: Feedback survey
4. Day 14: Referral request

---

### Livrables Phase 3
- [ ] UX polie (loading, empty states, animations)
- [ ] Performance optimisée (lazy loading, optimistic updates)
- [ ] Tests E2E passent
- [ ] Security audit complet
- [ ] Analytics configuré
- [ ] Landing page beta live
- [ ] 100 beta testers invités

**Temps total Phase 3:** 13 jours ouvrés
**Critère de succès:** Prêt pour lancement beta public

---

## 📈 Métriques de Succès

### Phase 1 (Stabilisation)
- ✅ 0 bugs critiques restants
- ✅ Auth fonctionnelle avec multi-user
- ✅ CRUD pets fonctionne (create, read, update, delete)
- ✅ Types TypeScript valides

### Phase 2 (MVP Core)
- ✅ 0 erreurs TypeScript
- ✅ Error handling sur 100% des API calls
- ✅ Validation sur tous les formulaires
- ✅ Onboarding flow complet
- ✅ Tests E2E pour happy paths

### Phase 3 (Polish & Launch)
- ✅ Lighthouse score > 90
- ✅ < 3s load time
- ✅ 100 beta testers onboardés
- ✅ < 5% error rate
- ✅ Net Promoter Score > 50

---

## 🚧 Risques & Mitigation

### Risque #1: Manque de temps
**Probabilité:** Haute
**Impact:** Critique

**Mitigation:**
- Découper Phase 2 en 2 releases si nécessaire
- Prioriser strictement: Critical → High → Medium
- Reporter features "nice-to-have" en post-MVP

### Risque #2: Bugs backend non identifiés
**Probabilité:** Moyenne
**Impact:** Haute

**Mitigation:**
- Audit backend Laravel en parallèle de Phase 1
- Tests d'intégration frontend ↔ backend
- Monitoring Bugsnag dès Phase 1

### Risque #3: OpenAI quota exceeded
**Probabilité:** Moyenne
**Impact:** Moyenne

**Mitigation:**
- Limiter requêtes: max 10/user/day en beta
- Cache responses pour prompts similaires
- Fallback gracieux si quota atteint

---

## 📊 Estimation Temps Total

| Phase | Durée | Tâches | Bugs fixés |
|-------|-------|--------|------------|
| Phase 1: Stabilisation | 10 jours | 10 | 10 critiques |
| Phase 2: MVP Core | 15 jours | 12 | 9 high + features |
| Phase 3: Polish & Launch | 13 jours | 11 | Polish + QA |
| **TOTAL** | **38 jours** | **33 tâches** | **37 issues** |

**Avec buffer 20%:** 45 jours = 9 semaines calendaires

---

## 🎯 Roadmap Visuelle

```
SEMAINE 1-2 │ STABILISATION
━━━━━━━━━━━━┿━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            │ ✓ Fix bugs critiques
            │ ✓ Auth réelle
            │ ✓ Data layer cohérent
            │ → Milestone: App utilisable sans crashes

SEMAINE 3-5 │ MVP CORE
━━━━━━━━━━━━┿━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            │ ✓ Validation + Error handling
            │ ✓ Types TypeScript propres
            │ ✓ Features core complètes
            │ ✓ Onboarding
            │ → Milestone: MVP complet et stable

SEMAINE 6-8 │ POLISH & LAUNCH
━━━━━━━━━━━━┿━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            │ ✓ UX polish
            │ ✓ Performance
            │ ✓ Tests E2E
            │ ✓ Beta launch
            │ → Milestone: 100 beta users actifs
```

---

## 🚀 Prochaines Étapes Immédiates

### Cette semaine
1. **Lundi matin:** Créer branch `feature/stabilization`
2. **Lundi PM:** Fixer bug #1 (Pet deletion)
3. **Mardi:** Fixer bug #2 (Auth hardcodée)
4. **Mercredi:** Fixer bugs #3-5 (Types, await, checkbox)
5. **Jeudi:** Fixer bugs #6-7 (Bugsnag, dates)
6. **Vendredi:** Tests manuels complets + merge

### Semaine prochaine
- Sprint 1.2: Data layer consolidation
- Setup CI/CD pour tests automatiques
- Début Phase 2

---

## 📝 Notes

- **Code freezes:** Aucun pendant les 8 semaines (focus total)
- **Daily standups:** Recommandés pour tracker blockers
- **Definition of Done:** Tests passent + Code review + Deployed to staging
- **Tech debt:** Accepté temporairement si bloque MVP, mais documenté

---

**Dernière mise à jour:** 2025-11-11
**Prochaine revue:** Fin Phase 1 (2 semaines)
**Owner:** Fred
