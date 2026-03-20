# Architecture Front-End GastonApp

> **Guide de référence pour le développement des applications React du mono-repo GastonApp**
>
> Ce document définit les patterns, conventions et guidelines d'architecture à suivre pour toutes les applications front-end du projet (web app, mobile app, landing page).

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Design Patterns](#design-patterns)
3. [Structure du mono-repo](#structure-du-mono-repo)
4. [Guidelines de développement](#guidelines-de-développement)
5. [Bonnes pratiques](#bonnes-pratiques)
6. [Exemples concrets](#exemples-concrets)

---

## Vue d'ensemble

### Contexte

GastonApp est un **mono-repo Turborepo** contenant :
- **apps/web** : Application web React + TypeScript + Vite
- **apps/mobile** : Application mobile React Native + Expo (future)
- **apps/landing** : Landing page marketing (future)
- **packages/shared** : Code partagé entre les apps
- **packages/ui** : Composants UI partagés (future)

### Objectifs architecturaux

1. **Réutilisation maximale** : La logique métier et les composants UI doivent être partagés entre web et mobile
2. **Séparation des responsabilités** : Logique métier ` UI ` Navigation
3. **Maintenabilité** : Code organisé, prévisible et facile à modifier
4. **Performance** : Minimiser les re-renders inutiles
5. **Type-safety** : TypeScript strict sur tout le code

### Principes directeurs

- **Hooks-first** : Les custom hooks sont le pattern principal pour la logique métier
- **Provider pour le global** : Context API pour les états globaux uniquement
- **Composants UI purs** : Séparation claire entre présentation et logique
- **Pas de prop drilling** : Maximum 2 niveaux de props pour les données globales
- **Co-location** : Garder les fichiers liés proches les uns des autres

---

## Design Patterns

### 1. Hooks Pattern P (Pattern principal)

**Le pattern Hooks est le standard pour toute logique métier réutilisable.**

#### Règles

 **À FAIRE :**
- Toute logique métier réutilisable va dans un custom hook
- Les hooks sont placés dans `packages/shared/src/hooks/`
- Les écrans/pages appellent les hooks et consomment leurs valeurs
- Un hook = une responsabilité claire (gestion liste, formulaire, détail, etc.)

L **À ÉVITER :**
- Fetch direct dans les composants
- `useEffect` avec 10+ dépendances dans les pages
- Duplication de logique entre web et mobile
- Logique métier éparpillée dans plusieurs composants

#### Structure d'un hook métier

```typescript
// packages/shared/src/hooks/usePetsList.ts

export interface UsePetsListOptions {
  familyId?: string;
  initialSearch?: string;
}

export interface UsePetsListReturn {
  pets: Pet[];
  isLoading: boolean;
  error: Error | null;
  search: string;
  setSearch: (value: string) => void;
  toggleActive: (petId: string) => Promise<void>;
  deletePet: (petId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function usePetsList(options?: UsePetsListOptions): UsePetsListReturn {
  const [search, setSearch] = useState(options?.initialSearch ?? '');
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Logique de fetch, filtrage, mutations...

  return {
    pets,
    isLoading,
    error,
    search,
    setSearch,
    toggleActive,
    deletePet,
    refetch,
  };
}
```

#### Utilisation dans les apps

```typescript
// apps/web/src/pages/PetsPage.tsx
function PetsPage() {
  const { pets, isLoading, search, setSearch, toggleActive } = usePetsList();

  return (
    <PetsTable
      data={pets}
      isLoading={isLoading}
      search={search}
      onSearchChange={setSearch}
      onToggleActive={toggleActive}
    />
  );
}

// apps/mobile/src/screens/PetsScreen.tsx
function PetsScreen() {
  const { pets, isLoading, search, setSearch } = usePetsList();

  return (
    <PetsList
      pets={pets}
      isLoading={isLoading}
      search={search}
      onSearchChange={setSearch}
    />
  );
}
```

**Même logique, deux UIs différentes. (**

#### Types de hooks à créer

| Type | Exemples | Responsabilité |
|------|----------|----------------|
| **Data fetching** | `usePetsList`, `useFamilyDetails` | Gérer fetch, cache, loading, error |
| **Formulaires** | `usePetForm`, `useEventForm` | Validation, soumission, états |
| **UI State** | `useModal`, `useDisclosure`, `useToggle` | Gérer ouverture/fermeture, toggles |
| **Synchronisation** | `useWebSocket`, `useRealtime` | Connexions temps réel |
| **Derived state** | `useFilteredPets`, `useGroupedEvents` | Calculs dérivés des données |

---

### 2. Provider Pattern (Context API)

**Le Provider Pattern est réservé aux états globaux partagés dans toute l'application.**

#### Règles

 **À FAIRE :**
- Utiliser Context pour : Auth, Theme, I18n, données utilisateur, famille courante
- Un provider = un contexte métier clair
- Toujours exposer un custom hook (`useAuth`, `useTheme`) avec le context

L **À ÉVITER :**
- Context pour des données locales à une feature
- Trop de providers imbriqués (max 3-4 niveaux)
- Context comme système de state management complet (utiliser Redux/Zustand si besoin)
- Prop drilling de plus de 2 niveaux pour des données globales

#### Structure d'un Provider

```typescript
// packages/shared/src/contexts/AuthContext.tsx

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (credentials: Credentials) => {
    // Logic...
  };

  const logout = async () => {
    // Logic...
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook personnalisé obligatoire
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

#### Providers standards du projet

| Provider | Responsabilité | Localisation |
|----------|---------------|--------------|
| `AuthProvider` | User, token, permissions | Global (root) |
| `ThemeProvider` | Couleurs, mode dark/light | Global (root) |
| `I18nProvider` | Langue, traductions | Global (root) |
| `FamilyProvider` | Famille courante, membres | App-level |
| `PetsProvider` | Cache des animaux de la famille | Feature-level (optionnel) |

#### Hiérarchie des providers

```tsx
// apps/web/src/App.tsx
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <I18nProvider>
          <FamilyProvider>
            <Router />
          </FamilyProvider>
        </I18nProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
```

---

### 3. Séparation UI / Logique (Soft Rule)

**Pas de dogmatisme "dumb vs smart", mais une séparation claire des responsabilités.**

#### Règles

 **Composants UI purs** (dans `packages/ui` ou `apps/*/components`)
- Ne contiennent **pas** de fetch
- Ne contiennent **pas** de `useEffect` sauf pour micro-interactions UI
- Reçoivent toutes les données par props
- Sont réutilisables et testables facilement

 **Composants Screen/Page/Container** (dans `apps/*/pages` ou `apps/*/screens`)
- Appellent les hooks métier
- Coordonnent les providers locaux si besoin
- Instancient les composants UI
- Gèrent la navigation

#### Exemple : Refactoring d'un composant mixte

**L AVANT : Tout dans un seul composant**

```typescript
// apps/web/src/pages/Pets.tsx (600 lignes)
function Pets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch pets...
  }, []);

  const handleEdit = (pet: Pet) => {
    // Logic...
  };

  const handleDelete = (id: string) => {
    // Logic...
  };

  return (
    <div>
      <input value={search} onChange={(e) => setSearch(e.target.value)} />
      <table>
        {/* 400 lignes de JSX... */}
      </table>
    </div>
  );
}
```

** APRÈS : Séparation claire**

```typescript
// packages/shared/src/hooks/usePetsList.ts
export function usePetsList() {
  // Toute la logique ici
}

// packages/ui/src/PetsTable.tsx
export function PetsTable({
  data,
  isLoading,
  onEdit,
  onDelete
}: PetsTableProps) {
  // Uniquement du JSX
}

// apps/web/src/pages/PetsPage.tsx (50 lignes)
function PetsPage() {
  const { pets, isLoading, handleEdit, handleDelete } = usePetsList();

  return (
    <PetsTable
      data={pets}
      isLoading={isLoading}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
```

---

### 4. HOC (Higher-Order Components) - Usage limité

**Les HOC sont considérés comme un pattern legacy. Usage fortement déconseillé.**

#### Règles

L **Interdit dans le code métier maison** sauf cas exceptionnel documenté

 **Accepté uniquement pour :**
- Wrapping de libs externes qui imposent un HOC (`react-redux` connect, etc.)
- Un seul HOC très ciblé (instrumentation analytics, par exemple)
- **Justification obligatoire** dans un commentaire si utilisé

#### Migration HOC ’ Hook

**L Ancien pattern (HOC)**
```typescript
function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const user = useAuth();
    if (!user) return <Login />;
    return <Component {...props} user={user} />;
  };
}

export default withAuth(ProfilePage);
```

** Pattern moderne (Hook + Guard)**
```typescript
// Hook
function useRequireAuth() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated]);

  return { user, isAuthenticated };
}

// Utilisation
function ProfilePage() {
  const { user } = useRequireAuth();
  return <div>Welcome {user.name}</div>;
}
```

---

### 5. Render Props - Pour le contrôle du rendu

**Les Render Props sont utiles pour donner le contrôle du rendu UI, pas pour la logique métier.**

#### Règles

 **À UTILISER pour :**
- Composants de layout/wrapper qui délèguent le contenu
- Composants UI très génériques (Tooltip, Modal, Dropdown)
- Différences de rendu entre web/mobile

L **À ÉVITER pour :**
- Partager de la logique métier (utiliser un hook à la place)

#### Exemples valides

```typescript
// packages/ui/src/HeroSection.tsx
interface HeroSectionProps {
  title: string;
  subtitle: string;
  renderCTA: () => ReactNode;
  renderImage?: () => ReactNode;
}

export function HeroSection({ title, subtitle, renderCTA, renderImage }: HeroSectionProps) {
  return (
    <section>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {renderCTA()}
      {renderImage?.()}
    </section>
  );
}

// apps/landing/src/pages/HomePage.tsx
<HeroSection
  title="Gérez la vie de vos animaux"
  subtitle="Application tout-en-un"
  renderCTA={() => (
    isMobile ? <MobileCTAButton /> : <WebCTAButton />
  )}
  renderImage={() => <HeroImage />}
/>
```

---

## Structure du mono-repo

### Organisation des packages

```
GastonApp/
   apps/
      web/                          # Application web principale
         src/
            pages/                # Pages/routes (containers)
            components/           # Composants UI spécifiques web
            layouts/              # Layouts de navigation
            router/               # Configuration routing
            main.tsx
         package.json
   
      mobile/                       # Application mobile React Native
         app/                      # Expo Router screens
         components/               # Composants UI spécifiques mobile
         package.json
   
      landing/                      # Landing page marketing
          src/
             pages/
             components/
          package.json

   packages/
      shared/                       # Code métier partagé P
         src/
            hooks/                # Custom hooks métier
               usePetsList.ts
               usePetForm.ts
               useEventsList.ts
               useAuth.ts
               index.ts
         
            contexts/             # Providers globaux
               AuthContext.tsx
               ThemeContext.tsx
               FamilyContext.tsx
               index.ts
         
            services/             # Logique métier
               EventService.ts
               PetService.ts
               OpenAIService.ts
         
            repository/           # Data access layer
               RestEventRepository.ts
               RestPetRepository.ts
         
            types/                # Types TypeScript
               Pet.ts
               Event.ts
               User.ts
         
            utils/                # Utilitaires
                date.ts
                validation.ts
      
         package.json
   
      ui/                           # Composants UI partagés P
         src/
            components/
               Button/
                  Button.tsx
                  Button.stories.tsx
                  index.ts
            
               Input/
               Card/
               Modal/
               Table/
               index.ts
         
            layouts/              # Layouts réutilisables
            theme/                # Thème et tokens
                colors.ts
                spacing.ts
                typography.ts
      
         package.json
   
      eslint-config/                # Configuration ESLint
      typescript-config/            # Configuration TypeScript

   package.json                      # Root package.json
```

### Règles d'import

```typescript
//  BON : Import depuis les packages
import { usePetsList, usePetForm } from '@gastonapp/shared';
import { Button, Card, Modal } from '@gastonapp/ui';

// L MAUVAIS : Import direct de fichiers internes
import { usePetsList } from '@gastonapp/shared/src/hooks/usePetsList';

//  BON : Import relatif dans le même package
import { PetCard } from '../PetCard';
import { formatDate } from '../../utils/date';
```

### Où placer le code ?

| Type de code | Localisation | Raison |
|--------------|--------------|--------|
| Hook métier (fetch, form, etc.) | `packages/shared/src/hooks/` | Réutilisé web + mobile |
| Provider global (Auth, Theme) | `packages/shared/src/contexts/` | Réutilisé web + mobile |
| Service métier | `packages/shared/src/services/` | Logique indépendante de React |
| Repository (API calls) | `packages/shared/src/repository/` | Data access layer |
| Types TS | `packages/shared/src/types/` | Contrats de données |
| Composant UI générique | `packages/ui/src/components/` | Réutilisé web + mobile (+ landing) |
| Composant spécifique web | `apps/web/src/components/` | Uniquement pour web |
| Composant spécifique mobile | `apps/mobile/components/` | Uniquement pour mobile |
| Page/Screen | `apps/*/src/pages` ou `apps/*/app` | Point d'entrée navigation |

---

## Guidelines de développement

### 1. Hooks métier (obligatoires)

####  Règles

1. **Un hook par responsabilité**
   - `usePetsList` : gestion de la liste
   - `usePetDetails` : détail d'un pet
   - `usePetForm` : formulaire de création/édition

2. **Nommage**
   - Toujours préfixé `use`
   - Verbe + nom du domaine : `useFetchPets`, `useCreateEvent`, `useFilteredPets`

3. **Return type explicite**
   ```typescript
   export interface UsePetsListReturn {
     pets: Pet[];
     isLoading: boolean;
     error: Error | null;
     // ...
   }

   export function usePetsList(): UsePetsListReturn {
     // ...
   }
   ```

4. **Documentation**
   ```typescript
   /**
    * Hook pour gérer la liste des animaux d'une famille.
    *
    * @param options - Configuration du hook
    * @param options.familyId - ID de la famille (optionnel)
    * @param options.initialSearch - Recherche initiale
    * @returns État et actions pour la liste des pets
    *
    * @example
    * ```tsx
    * function PetsPage() {
    *   const { pets, isLoading, search, setSearch } = usePetsList({ familyId: '123' });
    *   return <PetsList pets={pets} />;
    * }
    * ```
    */
   export function usePetsList(options?: UsePetsListOptions): UsePetsListReturn {
     // ...
   }
   ```

#### L Anti-patterns

```typescript
// L Hook qui fait trop de choses
function usePets() {
  // Fetch, form, validation, navigation, analytics...
  // 500 lignes de code
}

// L Logique métier dans le composant
function PetsPage() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    fetch('/api/pets')
      .then(res => res.json())
      .then(setPets);
  }, []);

  // ...
}

// L Duplication entre web et mobile
// apps/web/src/hooks/usePets.ts
// apps/mobile/src/hooks/usePets.ts
//   Même code dupliqué !
```

---

### 2. Providers globaux

####  Règles

1. **Limiter le nombre de providers**
   - Maximum 4-5 providers globaux
   - Privilégier la composition de hooks plutôt que multiplier les contexts

2. **Toujours exposer un hook custom**
   ```typescript
   //  BON
   export function useAuth() {
     const context = useContext(AuthContext);
     if (!context) {
       throw new Error('useAuth must be used within AuthProvider');
     }
     return context;
   }

   // L MAUVAIS : Utilisation directe du context
   const auth = useContext(AuthContext);
   ```

3. **Memoization des valeurs**
   ```typescript
   export function AuthProvider({ children }: { children: ReactNode }) {
     const [user, setUser] = useState<User | null>(null);

     const login = useCallback(async (credentials: Credentials) => {
       // Logic...
     }, []);

     const logout = useCallback(async () => {
       // Logic...
     }, []);

     //  Memoize la valeur du context
     const value = useMemo(
       () => ({
         user,
         isAuthenticated: !!user,
         login,
         logout,
       }),
       [user, login, logout]
     );

     return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
   }
   ```

4. **Éviter les re-renders inutiles**
   ```typescript
   //  Séparer les contexts si données indépendantes
   <AuthProvider>
     <ThemeProvider>
       <App />
     </ThemeProvider>
   </AuthProvider>

   // L Tout dans un seul gros context
   <AppProvider> {/* user, theme, locale, pets, events... */}
     <App />
   </AppProvider>
   ```

---

### 3. Séparation UI / Logique

####  Composants UI purs

```typescript
// packages/ui/src/PetsTable/PetsTable.tsx

export interface PetsTableProps {
  /** Liste des animaux à afficher */
  data: Pet[];
  /** État de chargement */
  isLoading?: boolean;
  /** Texte de recherche */
  search?: string;
  /** Callback changement recherche */
  onSearchChange?: (value: string) => void;
  /** Callback toggle actif/inactif */
  onToggleActive?: (petId: string) => void;
  /** Callback édition */
  onEdit?: (pet: Pet) => void;
  /** Callback suppression */
  onDelete?: (petId: string) => void;
}

/**
 * Composant Table d'affichage des animaux.
 *
 * Composant purement présentationnel, ne contient aucune logique métier.
 */
export function PetsTable({
  data,
  isLoading = false,
  search = '',
  onSearchChange,
  onToggleActive,
  onEdit,
  onDelete,
}: PetsTableProps) {
  // Uniquement de la logique UI (tri, colonnes visibles, etc.)
  const [sortBy, setSortBy] = useState<keyof Pet>('name');

  return (
    <table>
      {/* JSX pur */}
    </table>
  );
}
```

####  Composants Page/Screen (containers)

```typescript
// apps/web/src/pages/PetsPage.tsx

export function PetsPage() {
  //  Orchestration des hooks
  const { user } = useAuth();
  const { currentFamily } = useFamily();
  const {
    pets,
    isLoading,
    error,
    search,
    setSearch,
    handleEdit,
    handleDelete,
    toggleActive,
  } = usePetsList({ familyId: currentFamily?.id });

  const navigate = useNavigate();

  //  Handlers de navigation
  const handleCreateNew = () => {
    navigate('/pets/new');
  };

  //  Gestion d'erreurs
  if (error) {
    return <ErrorBoundary error={error} />;
  }

  //  Assembly des composants UI
  return (
    <PageLayout title="Mes animaux">
      <PetsTable
        data={pets}
        isLoading={isLoading}
        search={search}
        onSearchChange={setSearch}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={toggleActive}
      />
      <Button onClick={handleCreateNew}>Ajouter un animal</Button>
    </PageLayout>
  );
}
```

---

### 4. Gestion d'état

#### Hiérarchie de choix

1. **État local** (`useState`) : État UI pur, pas partagé
   ```typescript
   const [isModalOpen, setIsModalOpen] = useState(false);
   ```

2. **Custom hook** : Logique réutilisable, pas forcément globale
   ```typescript
   const { pets, isLoading } = usePetsList();
   ```

3. **Context** : État global simple (auth, theme, locale)
   ```typescript
   const { user } = useAuth();
   ```

4. **Redux/Zustand** : État global complexe avec beaucoup de mutations
   ```typescript
   const dispatch = useDispatch();
   ```

#### Quand utiliser quoi ?

| Cas | Solution |
|-----|----------|
| Toggle modal | `useState` local |
| Formulaire simple | `useState` local + validation |
| Formulaire complexe | Hook `useForm` (react-hook-form) |
| Fetch liste d'items | Custom hook `usePetsList` |
| User connecté | Context `AuthProvider` |
| Thème dark/light | Context `ThemeProvider` |
| Cache global + mutations | Redux Toolkit ou React Query |

---

### 5. Typage TypeScript

####  Règles strictes

1. **Typage explicite des props**
   ```typescript
   //  BON
   interface ButtonProps {
     label: string;
     onClick: () => void;
     variant?: 'primary' | 'secondary';
     disabled?: boolean;
   }

   export function Button({ label, onClick, variant = 'primary', disabled = false }: ButtonProps) {
     // ...
   }

   // L MAUVAIS
   export function Button(props: any) {
     // ...
   }
   ```

2. **Return types des hooks**
   ```typescript
   //  Explicite
   export function usePetsList(): UsePetsListReturn {
     // ...
   }

   // L Implicite
   export function usePetsList() {
     // TypeScript infère, mais moins clair
   }
   ```

3. **Éviter `any`**
   ```typescript
   // L MAUVAIS
   const data: any = await fetch('/api/pets');

   //  BON
   const data: Pet[] = await fetch('/api/pets').then(res => res.json());

   //  Ou avec type guard
   function isPet(value: unknown): value is Pet {
     return typeof value === 'object' && value !== null && 'id' in value;
   }
   ```

4. **Générics pour la réutilisabilité**
   ```typescript
   interface UseListReturn<T> {
     items: T[];
     isLoading: boolean;
     error: Error | null;
   }

   function useList<T>(fetchFn: () => Promise<T[]>): UseListReturn<T> {
     // ...
   }

   // Usage
   const { items: pets } = useList<Pet>(fetchPets);
   ```

---

### 6. Performance

####  Optimisations essentielles

1. **Memoization des composants lourds**
   ```typescript
   const PetsTable = memo(function PetsTable({ data, onEdit }: PetsTableProps) {
     // ...
   });
   ```

2. **Memoization des callbacks**
   ```typescript
   const handleEdit = useCallback((pet: Pet) => {
     // Logic...
   }, [/* deps */]);
   ```

3. **Memoization des valeurs calculées**
   ```typescript
   const filteredPets = useMemo(
     () => pets.filter(pet => pet.name.includes(search)),
     [pets, search]
   );
   ```

4. **Lazy loading des routes**
   ```typescript
   const PetsPage = lazy(() => import('./pages/PetsPage'));

   <Suspense fallback={<Loader />}>
     <PetsPage />
   </Suspense>
   ```

5. **Virtualisation des longues listes**
   ```typescript
   import { useVirtualizer } from '@tanstack/react-virtual';

   const virtualizer = useVirtualizer({
     count: pets.length,
     getScrollElement: () => scrollRef.current,
     estimateSize: () => 50,
   });
   ```

#### L Sur-optimisation

```typescript
// L Ne pas tout memoize par défaut
const name = useMemo(() => user.firstName, [user]);
//  Calcul trivial, pas besoin de memo
const name = user.firstName;

// L useCallback pour tout
const handleClick = useCallback(() => console.log('click'), []);
//  Si pas passé à un composant memoizé, inutile
const handleClick = () => console.log('click');
```

**Règle** : Optimiser seulement quand un problème de perf est identifié (profiler React DevTools).

---

### 7. Tests

#### Structure des tests

```typescript
// packages/shared/src/hooks/__tests__/usePetsList.test.ts

import { renderHook, act, waitFor } from '@testing-library/react';
import { usePetsList } from '../usePetsList';

describe('usePetsList', () => {
  it('should fetch pets on mount', async () => {
    const { result } = renderHook(() => usePetsList());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pets).toHaveLength(3);
  });

  it('should filter pets by search', async () => {
    const { result } = renderHook(() => usePetsList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setSearch('Max');
    });

    expect(result.current.pets).toHaveLength(1);
    expect(result.current.pets[0].name).toBe('Max');
  });
});
```

#### Tests des composants UI

```typescript
// packages/ui/src/Button/__tests__/Button.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('should render with label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click me" onClick={handleClick} />);

    fireEvent.click(screen.getByText('Click me'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button label="Click me" onClick={() => {}} disabled />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
```

---

## Bonnes pratiques

### 1. Organisation des fichiers

####  Co-location

Garder les fichiers liés proches les uns des autres :

```
PetsTable/
   PetsTable.tsx           # Composant principal
   PetsTable.test.tsx      # Tests
   PetsTable.stories.tsx   # Storybook (optionnel)
   PetsTableRow.tsx        # Sous-composant
   usePetsTableSort.ts     # Hook local si besoin
   types.ts                # Types spécifiques
   index.ts                # Exports publics
```

####  Index files

```typescript
// packages/ui/src/components/index.ts
export { Button } from './Button';
export { Card } from './Card';
export { Modal } from './Modal';
export { Table } from './Table';

export type { ButtonProps } from './Button';
export type { CardProps } from './Card';
// ...
```

### 2. Nommage

| Élément | Convention | Exemples |
|---------|-----------|----------|
| Composants | PascalCase | `PetsTable`, `EventCard`, `UserProfile` |
| Hooks | camelCase avec `use` | `usePetsList`, `useAuth`, `useModal` |
| Fichiers composants | PascalCase | `PetsTable.tsx`, `EventCard.tsx` |
| Fichiers hooks | camelCase | `usePetsList.ts`, `useAuth.ts` |
| Fichiers utils | camelCase | `formatDate.ts`, `validation.ts` |
| Props interfaces | ComponentName + Props | `PetsTableProps`, `ButtonProps` |
| Return types hooks | HookName + Return | `UsePetsListReturn`, `UseAuthReturn` |

### 3. Imports

####  Ordre des imports

```typescript
// 1. React et libs externes
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Packages internes (@gastonapp/*)
import { usePetsList, Pet } from '@gastonapp/shared';
import { Button, Card, Table } from '@gastonapp/ui';

// 3. Imports relatifs
import { PetsTableRow } from './PetsTableRow';
import { formatPetAge } from '../../utils/pets';

// 4. Styles
import styles from './PetsTable.module.css';
```

### 4. Props

####  Destructuration avec defaults

```typescript
export function Button({
  label,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
}: ButtonProps) {
  // ...
}
```

####  Props composition

```typescript
//  Spread des props natives
export function Input({ className, ...props }: InputProps) {
  return <input className={cn(styles.input, className)} {...props} />;
}

//  Children as prop
export function Card({ title, children, actions }: CardProps) {
  return (
    <div>
      <h3>{title}</h3>
      <div>{children}</div>
      {actions && <div>{actions}</div>}
    </div>
  );
}
```

### 5. Gestion d'erreurs

####  Error boundaries

```typescript
// packages/ui/src/ErrorBoundary/ErrorBoundary.tsx

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // Log to Bugsnag, Sentry, etc.
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// Usage dans App
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

####  Gestion d'erreurs dans les hooks

```typescript
export function usePetsList(): UsePetsListReturn {
  const [error, setError] = useState<Error | null>(null);

  const fetchPets = useCallback(async () => {
    try {
      setError(null);
      const data = await petRepository.getAll();
      setPets(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      console.error('Failed to fetch pets:', error);
    }
  }, []);

  return { error, /* ... */ };
}
```

### 6. Accessibilité

####  ARIA attributes

```typescript
<button
  aria-label="Supprimer l'animal Max"
  aria-disabled={isLoading}
  onClick={handleDelete}
>
  <TrashIcon />
</button>

<input
  aria-invalid={!!error}
  aria-describedby={error ? 'error-message' : undefined}
/>
{error && <span id="error-message" role="alert">{error}</span>}
```

####  Keyboard navigation

```typescript
const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
  if (e.key === 'Escape') {
    onClose();
  }
  if (e.key === 'Enter') {
    onConfirm();
  }
};

<div
  role="dialog"
  aria-modal="true"
  onKeyDown={handleKeyDown}
  tabIndex={-1}
>
  {/* Modal content */}
</div>
```

---

## Exemples concrets

### Exemple complet : Feature "Pets"

#### 1. Hook métier

```typescript
// packages/shared/src/hooks/usePetsList.ts

import { useState, useEffect, useCallback } from 'react';
import { petRepository } from '../repository';
import type { Pet } from '../types';

export interface UsePetsListOptions {
  familyId?: string;
  initialSearch?: string;
  autoFetch?: boolean;
}

export interface UsePetsListReturn {
  pets: Pet[];
  filteredPets: Pet[];
  isLoading: boolean;
  error: Error | null;
  search: string;
  setSearch: (value: string) => void;
  refetch: () => Promise<void>;
  createPet: (data: CreatePetData) => Promise<Pet>;
  updatePet: (id: string, data: UpdatePetData) => Promise<Pet>;
  deletePet: (id: string) => Promise<void>;
  toggleActive: (id: string) => Promise<void>;
}

export function usePetsList(options: UsePetsListOptions = {}): UsePetsListReturn {
  const { familyId, initialSearch = '', autoFetch = true } = options;

  const [pets, setPets] = useState<Pet[]>([]);
  const [search, setSearch] = useState(initialSearch);
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState<Error | null>(null);

  const fetchPets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = familyId
        ? await petRepository.getByFamily(familyId)
        : await petRepository.getAll();

      setPets(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch pets');
      setError(error);
      console.error('usePetsList: fetch error', error);
    } finally {
      setIsLoading(false);
    }
  }, [familyId]);

  useEffect(() => {
    if (autoFetch) {
      fetchPets();
    }
  }, [autoFetch, fetchPets]);

  const filteredPets = useMemo(() => {
    if (!search) return pets;

    const query = search.toLowerCase();
    return pets.filter(pet =>
      pet.name.toLowerCase().includes(query) ||
      pet.species.toLowerCase().includes(query)
    );
  }, [pets, search]);

  const createPet = useCallback(async (data: CreatePetData) => {
    const newPet = await petRepository.create(data);
    setPets(prev => [...prev, newPet]);
    return newPet;
  }, []);

  const updatePet = useCallback(async (id: string, data: UpdatePetData) => {
    const updated = await petRepository.update(id, data);
    setPets(prev => prev.map(p => (p.id === id ? updated : p)));
    return updated;
  }, []);

  const deletePet = useCallback(async (id: string) => {
    await petRepository.delete(id);
    setPets(prev => prev.filter(p => p.id !== id));
  }, []);

  const toggleActive = useCallback(async (id: string) => {
    const pet = pets.find(p => p.id === id);
    if (!pet) return;

    await updatePet(id, { isActive: !pet.isActive });
  }, [pets, updatePet]);

  return {
    pets,
    filteredPets,
    isLoading,
    error,
    search,
    setSearch,
    refetch: fetchPets,
    createPet,
    updatePet,
    deletePet,
    toggleActive,
  };
}
```

#### 2. Composant UI pur

```typescript
// packages/ui/src/PetsTable/PetsTable.tsx

import type { Pet } from '@gastonapp/shared';

export interface PetsTableProps {
  /** Liste des animaux à afficher */
  data: Pet[];
  /** État de chargement */
  isLoading?: boolean;
  /** Texte de recherche */
  search?: string;
  /** Callback changement recherche */
  onSearchChange?: (value: string) => void;
  /** Callback édition */
  onEdit?: (pet: Pet) => void;
  /** Callback suppression */
  onDelete?: (petId: string) => void;
  /** Callback toggle actif/inactif */
  onToggleActive?: (petId: string) => void;
}

export function PetsTable({
  data,
  isLoading = false,
  search = '',
  onSearchChange,
  onEdit,
  onDelete,
  onToggleActive,
}: PetsTableProps) {
  if (isLoading) {
    return <Skeleton rows={5} />;
  }

  if (data.length === 0) {
    return <EmptyState message="Aucun animal trouvé" />;
  }

  return (
    <div>
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Rechercher un animal..."
      />

      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Espèce</th>
            <th>Âge</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(pet => (
            <PetsTableRow
              key={pet.id}
              pet={pet}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleActive={onToggleActive}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

#### 3. Page (container)

```typescript
// apps/web/src/pages/PetsPage.tsx

import { usePetsList } from '@gastonapp/shared';
import { PetsTable, Button, PageLayout } from '@gastonapp/ui';
import { useNavigate } from 'react-router-dom';
import { useFamily } from '../contexts/FamilyContext';

export function PetsPage() {
  const navigate = useNavigate();
  const { currentFamily } = useFamily();

  const {
    filteredPets,
    isLoading,
    error,
    search,
    setSearch,
    deletePet,
    toggleActive,
  } = usePetsList({ familyId: currentFamily?.id });

  const handleEdit = (pet: Pet) => {
    navigate(`/pets/${pet.id}/edit`);
  };

  const handleDelete = async (petId: string) => {
    if (!confirm('Supprimer cet animal ?')) return;

    try {
      await deletePet(petId);
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleCreateNew = () => {
    navigate('/pets/new');
  };

  if (error) {
    return (
      <PageLayout title="Mes animaux">
        <ErrorMessage error={error} />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Mes animaux"
      actions={
        <Button onClick={handleCreateNew} variant="primary">
          Ajouter un animal
        </Button>
      }
    >
      <PetsTable
        data={filteredPets}
        isLoading={isLoading}
        search={search}
        onSearchChange={setSearch}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={toggleActive}
      />
    </PageLayout>
  );
}
```

#### 4. Écran mobile (même logique, UI différente)

```typescript
// apps/mobile/app/(tabs)/pets.tsx

import { usePetsList } from '@gastonapp/shared';
import { PetsList, Fab } from '@gastonapp/ui-mobile';
import { useRouter } from 'expo-router';

export default function PetsScreen() {
  const router = useRouter();
  const { currentFamily } = useFamily();

  const {
    filteredPets,
    isLoading,
    error,
    search,
    setSearch,
    deletePet,
    toggleActive,
  } = usePetsList({ familyId: currentFamily?.id });

  const handleEdit = (pet: Pet) => {
    router.push(`/pets/${pet.id}`);
  };

  const handleDelete = async (petId: string) => {
    Alert.alert(
      'Supprimer',
      'Supprimer cet animal ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', onPress: () => deletePet(petId) },
      ]
    );
  };

  return (
    <SafeAreaView>
      <PetsList
        data={filteredPets}
        isLoading={isLoading}
        error={error}
        search={search}
        onSearchChange={setSearch}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={toggleActive}
      />

      <Fab onPress={() => router.push('/pets/new')} />
    </SafeAreaView>
  );
}
```

---

## Checklist de code review

### Avant de commit

- [ ] Pas de `console.log` ou `debugger` oubliés
- [ ] Pas de `any` non justifiés
- [ ] Tous les composants sont typés avec des interfaces
- [ ] Les hooks ont un return type explicite
- [ ] Pas de logique métier dans les composants UI
- [ ] Les providers ont un hook custom (`useAuth`, etc.)
- [ ] Pas de prop drilling > 2 niveaux
- [ ] Les fichiers sont dans le bon package (`shared` vs `ui` vs app-specific)
- [ ] Les imports utilisent les alias (`@gastonapp/*`)
- [ ] Le code compile sans erreurs TypeScript
- [ ] Les tests passent

### Pour une PR

- [ ] Le code suit les patterns définis (Hooks + Provider + UI/logique séparée)
- [ ] Aucun HOC ajouté sans justification documentée
- [ ] Les composants UI sont réutilisables
- [ ] Les hooks métier sont dans `packages/shared`
- [ ] La logique est partageable entre web et mobile
- [ ] Les noms sont clairs et cohérents
- [ ] Pas de duplication de code
- [ ] Documentation/commentaires pour les parties complexes
- [ ] Accessibilité considérée (ARIA, keyboard nav)
- [ ] Performance : pas de re-renders inutiles (profiler React DevTools)

---

## Ressources

### Documentation officielle

- [React Official Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Turborepo Docs](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)

### Articles et guides

- [React Design Patterns (Radix)](https://www.radix-ui.com/blog/react-design-patterns) - Article de référence
- [Thinking in React](https://react.dev/learn/thinking-in-react)
- [Hooks Rules](https://react.dev/reference/rules/rules-of-hooks)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)

### Outils

- [React DevTools](https://react.dev/learn/react-developer-tools) - Debugging et profiling
- [TypeScript Playground](https://www.typescriptlang.org/play) - Test de types
- [Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) - Analyse du bundle

---

## Glossaire

| Terme | Définition |
|-------|------------|
| **Hook** | Fonction React commençant par `use` qui permet d'utiliser les features React (state, context, etc.) |
| **Custom Hook** | Hook créé par le dev pour extraire de la logique réutilisable |
| **Provider** | Composant qui expose un Context à ses descendants |
| **Context** | Mécanisme React pour partager des données sans prop drilling |
| **Prop drilling** | Passer des props à travers plusieurs niveaux de composants |
| **Container** | Composant qui gère la logique et passe des données aux composants présentationnels |
| **Presentational** | Composant purement visuel sans logique métier |
| **HOC** | Higher-Order Component : fonction qui prend un composant et retourne un composant enrichi |
| **Render Props** | Pattern où un composant reçoit une fonction en prop qui retourne du JSX |
| **Mono-repo** | Repository unique contenant plusieurs packages/apps |
| **Co-location** | Placer les fichiers liés proches les uns des autres |

---

## Changelog

| Date | Version | Changements |
|------|---------|-------------|
| 2025-01-16 | 1.0.0 | Version initiale basée sur l'article Radix et les besoins du projet |

---

**Questions ou suggestions ?** Ouvrir une discussion dans le repo ou contacter l'équipe tech.