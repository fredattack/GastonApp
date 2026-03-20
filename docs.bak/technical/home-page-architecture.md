# Architecture Technique - Refonte Home Page
## GastonApp Web Application

> Document de spécification architecturale pour la refonte de la page d'accueil (Index.tsx)
>
> **Lead Frontend Developer** - Architecture technique et décomposition des composants
>
> **Date**: 2025-11-16 | **Version**: 1.0.0

---

## Table des matières

1. [Analyse de l'existant](#1-analyse-de-lexistant)
2. [Architecture cible](#2-architecture-cible)
3. [Custom Hooks Specifications](#3-custom-hooks-specifications)
4. [Component Hierarchy](#4-component-hierarchy)
5. [TypeScript Interfaces](#5-typescript-interfaces)
6. [Responsive Implementation](#6-responsive-implementation)
7. [Performance Optimizations](#7-performance-optimizations)
8. [Migration Plan](#8-migration-plan)

---

## 1. Analyse de l'existant

### 1.1 État actuel de l'architecture

**Fichier**: `/apps/web/src/pages/Index.tsx` (30 lignes)

```
Index.tsx (Page container - basique)
├── HeroSection.tsx (48 lignes) - Message d'accueil
├── QuickActions.tsx (111 lignes) - 4 cartes d'actions
├── PetCards.tsx (173 lignes) - Liste horizontale d'animaux
└── TodayTimeline.tsx (192 lignes) - Timeline des événements du jour
```

### 1.2 Problèmes identifiés

#### CRITIQUE - Violation des principes architecturaux

| Composant | Problèmes | Impact |
|-----------|-----------|--------|
| **HeroSection** | Logique métier (getGreeting, getTimeEmoji) mixée avec UI | Non réutilisable, non testable |
| **QuickActions** | Données hardcodées dans le composant | Impossible de personnaliser selon l'utilisateur |
| **PetCards** | Fetch direct via Context dans le composant | Couplage fort, difficile à tester |
| **TodayTimeline** | Logique de filtrage et de tri dans le composant | Duplication potentielle, non réutilisable |

#### Violations spécifiques du front-architecture.md

1. **Logique métier dans les composants UI** ❌
   - `HeroSection` calcule le greeting (lignes 8-23)
   - `PetCards` calcule l'âge (lignes 27-42)
   - `TodayTimeline` filtre et trie les événements (lignes 44-50)

2. **Pas de séparation UI/Logique** ❌
   - Aucun custom hook métier
   - Contextes utilisés directement dans les composants
   - useEffect complexe avec dépendances multiples

3. **Couplage fort avec les contextes** ❌
   - `usePets()` et `useEvents()` appelés directement
   - Impossible de réutiliser les composants sans les providers

4. **Données hardcodées** ❌
   - `QuickActions`: actions statiques non configurables
   - `userName = "Fred"` hardcodé (ligne 25 HeroSection)

5. **Manque de typage strict** ⚠️
   - Certaines interfaces manquantes
   - Props non documentées

### 1.3 Points positifs à conserver

✅ **Structure de base cohérente** : 4 sections logiques bien définies
✅ **Accessibilité** : ARIA labels présents (QuickActions, PetCards, TodayTimeline)
✅ **Responsive** : Classes Tailwind mobile-first
✅ **États de chargement** : Skeletons et empty states gérés
✅ **Navigation** : Utilisation correcte de React Router

---

## 2. Architecture cible

### 2.1 Principes directeurs de la refonte

**Pattern Hooks-First** (Conformément à front-architecture.md)

```
Page (Container)
  ↓ appelle
Custom Hooks (Business Logic)
  ↓ retournent
Data + Actions
  ↓ passées à
UI Components (Presentational)
```

### 2.2 Structure de dossiers complète

```
GastonApp/
├── packages/
│   ├── shared/
│   │   └── src/
│   │       ├── hooks/
│   │       │   ├── home/
│   │       │   │   ├── useHomeDashboard.ts      # Orchestration globale
│   │       │   │   ├── useGreeting.ts           # Message d'accueil
│   │       │   │   ├── usePetsSummary.ts        # Résumé des animaux
│   │       │   │   ├── useTodayEvents.ts        # Événements du jour
│   │       │   │   ├── useQuickActions.ts       # Actions rapides
│   │       │   │   └── index.ts
│   │       │   └── index.ts
│   │       └── types/
│   │           ├── home/
│   │           │   ├── QuickAction.ts
│   │           │   ├── PetSummary.ts
│   │           │   ├── TodayEvent.ts
│   │           │   └── index.ts
│   │           └── index.ts
│   │
│   └── ui/
│       └── src/
│           └── components/
│               ├── home/
│               │   ├── HeroSection/
│               │   │   ├── HeroSection.tsx       # Composant UI pur
│               │   │   ├── HeroSection.test.tsx
│               │   │   ├── HeroSection.stories.tsx
│               │   │   └── index.ts
│               │   ├── QuickActionsGrid/
│               │   │   ├── QuickActionsGrid.tsx
│               │   │   ├── QuickActionCard.tsx   # Molecule
│               │   │   ├── QuickActionsGrid.test.tsx
│               │   │   └── index.ts
│               │   ├── PetsCarousel/
│               │   │   ├── PetsCarousel.tsx
│               │   │   ├── PetCard.tsx           # Molecule
│               │   │   ├── PetsCarousel.test.tsx
│               │   │   └── index.ts
│               │   └── TodayTimeline/
│               │       ├── TodayTimeline.tsx
│               │       ├── TimelineItem.tsx      # Molecule
│               │       ├── TodayTimeline.test.tsx
│               │       └── index.ts
│               └── index.ts
│
└── apps/
    └── web/
        └── src/
            ├── pages/
            │   └── Index.tsx                     # Container - Orchestration
            └── components/
                └── Home/                          # Composants spécifiques web si besoin
                    └── (vide pour l'instant, tout dans packages/ui)
```

### 2.3 Séparation des responsabilités

| Layer | Localisation | Responsabilité | Exemple |
|-------|--------------|----------------|---------|
| **Container** | `apps/web/src/pages/Index.tsx` | Orchestration des hooks + assembly des composants | Appelle useHomeDashboard() |
| **Business Logic** | `packages/shared/src/hooks/home/` | Logique métier, calculs, fetch | useGreeting(), useTodayEvents() |
| **UI Components** | `packages/ui/src/components/home/` | Affichage pur, pas de logique | HeroSection, QuickActionsGrid |
| **Types** | `packages/shared/src/types/home/` | Contrats de données | QuickAction, PetSummary |

### 2.4 Flux de données

```mermaid
Index.tsx (Container)
    |
    ├─> useHomeDashboard() ──────┐
    |       ├─> useGreeting()     │
    |       ├─> usePetsSummary()  │  Custom Hooks
    |       ├─> useTodayEvents()  │  (Business Logic)
    |       └─> useQuickActions() │
    |                              │
    └─> Data + Actions ───────────┘
            |
            ├─> HeroSection (props)
            ├─> QuickActionsGrid (props)
            ├─> PetsCarousel (props)
            └─> TodayTimeline (props)
                    |
                    └─> Pure UI Components
```

---

## 3. Custom Hooks Specifications

### 3.1 useHomeDashboard() - Orchestration Globale

**Localisation**: `packages/shared/src/hooks/home/useHomeDashboard.ts`

**Responsabilité**: Orchestrer tous les hooks métier de la home page et gérer le state global de la page.

```typescript
/**
 * Hook principal pour orchestrer toutes les données de la page d'accueil.
 *
 * Ce hook agrège les données de tous les sous-hooks et gère le loading global.
 * Il est le point d'entrée unique pour la page Index.tsx.
 *
 * @returns État et actions pour la page d'accueil
 *
 * @example
 * ```tsx
 * function IndexPage() {
 *   const dashboard = useHomeDashboard();
 *
 *   if (dashboard.isLoading) return <PageSkeleton />;
 *
 *   return (
 *     <div>
 *       <HeroSection {...dashboard.greeting} />
 *       <QuickActionsGrid actions={dashboard.quickActions} />
 *       <PetsCarousel {...dashboard.petsSummary} />
 *       <TodayTimeline {...dashboard.todayEvents} />
 *     </div>
 *   );
 * }
 * ```
 */

import { useMemo } from 'react';
import { useGreeting } from './useGreeting';
import { usePetsSummary } from './usePetsSummary';
import { useTodayEvents } from './useTodayEvents';
import { useQuickActions } from './useQuickActions';

export interface UseHomeDashboardReturn {
  /** Données du message d'accueil */
  greeting: {
    message: string;
    emoji: string;
    subtitle: string;
    userName: string;
  };

  /** Actions rapides disponibles pour l'utilisateur */
  quickActions: QuickAction[];

  /** Résumé des animaux */
  petsSummary: {
    pets: PetSummary[];
    totalCount: number;
    isLoading: boolean;
    isEmpty: boolean;
    onPetClick: (petId: string) => void;
    onAddPet: () => void;
  };

  /** Événements du jour */
  todayEvents: {
    events: TodayEvent[];
    eventCount: number;
    isLoading: boolean;
    isEmpty: boolean;
    onEventClick: (eventId: string) => void;
    onViewCalendar: () => void;
  };

  /** État de chargement global (true si au moins un sous-hook est en loading) */
  isLoading: boolean;

  /** Erreur globale (présente si au moins un sous-hook a une erreur) */
  error: Error | null;

  /** Rafraîchir toutes les données de la page */
  refresh: () => Promise<void>;
}

export function useHomeDashboard(): UseHomeDashboardReturn {
  const greeting = useGreeting();
  const quickActions = useQuickActions();
  const petsSummary = usePetsSummary();
  const todayEvents = useTodayEvents();

  // Loading global : true si au moins un hook est en loading
  const isLoading = useMemo(
    () => petsSummary.isLoading || todayEvents.isLoading,
    [petsSummary.isLoading, todayEvents.isLoading]
  );

  // Erreur globale : première erreur rencontrée
  const error = useMemo(
    () => petsSummary.error || todayEvents.error || null,
    [petsSummary.error, todayEvents.error]
  );

  // Refresh global
  const refresh = async () => {
    await Promise.all([
      petsSummary.refresh(),
      todayEvents.refresh(),
    ]);
  };

  return {
    greeting,
    quickActions,
    petsSummary: {
      pets: petsSummary.pets,
      totalCount: petsSummary.totalCount,
      isLoading: petsSummary.isLoading,
      isEmpty: petsSummary.isEmpty,
      onPetClick: petsSummary.handlePetClick,
      onAddPet: petsSummary.handleAddPet,
    },
    todayEvents: {
      events: todayEvents.events,
      eventCount: todayEvents.eventCount,
      isLoading: todayEvents.isLoading,
      isEmpty: todayEvents.isEmpty,
      onEventClick: todayEvents.handleEventClick,
      onViewCalendar: todayEvents.handleViewCalendar,
    },
    isLoading,
    error,
    refresh,
  };
}
```

---

### 3.2 useGreeting() - Message d'accueil personnalisé

**Localisation**: `packages/shared/src/hooks/home/useGreeting.ts`

**Responsabilité**: Générer le message d'accueil contextuel basé sur l'heure et l'utilisateur.

```typescript
/**
 * Hook pour générer le message d'accueil personnalisé.
 *
 * Calcule le greeting basé sur l'heure de la journée et récupère le nom de l'utilisateur.
 *
 * @returns Données du message d'accueil
 *
 * @example
 * ```tsx
 * function HeroSection() {
 *   const { message, emoji, subtitle, userName } = useGreeting();
 *
 *   return (
 *     <div>
 *       <span>{emoji}</span>
 *       <h1>{message}, {userName} !</h1>
 *       <p>{subtitle}</p>
 *     </div>
 *   );
 * }
 * ```
 */

import { useMemo } from 'react';
import { useAuth } from '../auth/useAuth';

export interface UseGreetingReturn {
  /** Message de salutation (ex: "Bonjour", "Bonsoir") */
  message: string;

  /** Emoji contextuel (ex: "☀️", "🌙") */
  emoji: string;

  /** Sous-titre contextuel */
  subtitle: string;

  /** Nom de l'utilisateur connecté */
  userName: string;
}

export function useGreeting(): UseGreetingReturn {
  const { user } = useAuth();

  const { message, emoji, subtitle } = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return {
        message: 'Bonjour',
        emoji: '☀️',
        subtitle: 'Excellente journée en perspective !',
      };
    }

    if (hour < 18) {
      return {
        message: 'Bon après-midi',
        emoji: '🌤️',
        subtitle: 'Comment se passe votre journée ?',
      };
    }

    return {
      message: 'Bonsoir',
      emoji: '🌙',
      subtitle: 'Bonne soirée avec vos compagnons',
    };
  }, []);

  return {
    message,
    emoji,
    subtitle,
    userName: user?.firstName || user?.name || 'Invité',
  };
}
```

---

### 3.3 usePetsSummary() - Résumé des animaux

**Localisation**: `packages/shared/src/hooks/home/usePetsSummary.ts`

**Responsabilité**: Gérer l'affichage résumé des animaux avec navigation.

```typescript
/**
 * Hook pour gérer le résumé des animaux sur la home page.
 *
 * Récupère la liste des animaux depuis le contexte, transforme les données
 * pour l'affichage résumé et gère les interactions (clic, ajout).
 *
 * @returns État et actions pour le carousel d'animaux
 *
 * @example
 * ```tsx
 * function PetsCarousel() {
 *   const { pets, totalCount, isEmpty, onPetClick, onAddPet } = usePetsSummary();
 *
 *   if (isEmpty) {
 *     return <EmptyState onAdd={onAddPet} />;
 *   }
 *
 *   return (
 *     <div>
 *       {pets.map(pet => (
 *         <PetCard key={pet.id} {...pet} onClick={() => onPetClick(pet.id)} />
 *       ))}
 *       <span>{totalCount} animaux</span>
 *     </div>
 *   );
 * }
 * ```
 */

import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePets } from '../../contexts/PetsContext';
import type { PetSummary } from '../../types/home';

export interface UsePetsSummaryReturn {
  /** Animaux transformés pour l'affichage résumé */
  pets: PetSummary[];

  /** Nombre total d'animaux */
  totalCount: number;

  /** État de chargement */
  isLoading: boolean;

  /** Liste vide */
  isEmpty: boolean;

  /** Erreur de chargement */
  error: Error | null;

  /** Naviguer vers le détail d'un animal */
  handlePetClick: (petId: string) => void;

  /** Naviguer vers la création d'un animal */
  handleAddPet: () => void;

  /** Naviguer vers la liste complète */
  handleViewAll: () => void;

  /** Rafraîchir les données */
  refresh: () => Promise<void>;
}

/**
 * Calcule l'âge d'un animal à partir de sa date de naissance.
 */
function calculateAge(birthDate?: string): string {
  if (!birthDate) return 'Âge inconnu';

  const birth = new Date(birthDate);
  const today = new Date();
  const ageInMonths =
    (today.getFullYear() - birth.getFullYear()) * 12 +
    (today.getMonth() - birth.getMonth());

  if (ageInMonths < 12) {
    return `${ageInMonths} mois`;
  }

  const years = Math.floor(ageInMonths / 12);
  return `${years} an${years > 1 ? 's' : ''}`;
}

/**
 * Retourne l'emoji correspondant à une espèce.
 */
function getSpeciesEmoji(species?: string): string {
  const emojiMap: Record<string, string> = {
    dog: '🐕',
    cat: '🐈',
    bird: '🐦',
    rabbit: '🐰',
    fish: '🐠',
    hamster: '🐹',
    turtle: '🐢',
    horse: '🐴',
  };
  return emojiMap[species?.toLowerCase() || ''] || '🐾';
}

export function usePetsSummary(): UsePetsSummaryReturn {
  const navigate = useNavigate();
  const { pets, isLoading, refreshPets } = usePets();

  // Transformer les pets en PetSummary
  const petsSummary = useMemo<PetSummary[]>(
    () => pets.map(pet => ({
      id: pet.id,
      name: pet.name,
      species: pet.species || 'Inconnu',
      breed: pet.breed,
      emoji: getSpeciesEmoji(pet.species),
      age: calculateAge(pet.birthDate),
      imageUrl: pet.imageUrl,
    })),
    [pets]
  );

  const handlePetClick = useCallback((petId: string) => {
    navigate(`/content/pets/${petId}`);
  }, [navigate]);

  const handleAddPet = useCallback(() => {
    navigate('/content/pets/new');
  }, [navigate]);

  const handleViewAll = useCallback(() => {
    navigate('/content/pets');
  }, [navigate]);

  const refresh = useCallback(async () => {
    await refreshPets();
  }, [refreshPets]);

  return {
    pets: petsSummary,
    totalCount: pets.length,
    isLoading,
    isEmpty: pets.length === 0,
    error: null, // TODO: Ajouter gestion d'erreur dans PetsContext
    handlePetClick,
    handleAddPet,
    handleViewAll,
    refresh,
  };
}
```

---

### 3.4 useTodayEvents() - Événements du jour

**Localisation**: `packages/shared/src/hooks/home/useTodayEvents.ts`

**Responsabilité**: Filtrer et transformer les événements du jour avec navigation.

```typescript
/**
 * Hook pour gérer les événements du jour sur la home page.
 *
 * Filtre les événements de la journée en cours, les trie par heure,
 * et gère les interactions (clic, navigation calendrier).
 *
 * @returns État et actions pour la timeline du jour
 *
 * @example
 * ```tsx
 * function TodayTimeline() {
 *   const { events, eventCount, isEmpty, onEventClick } = useTodayEvents();
 *
 *   if (isEmpty) {
 *     return <EmptyState message="Aucun événement aujourd'hui" />;
 *   }
 *
 *   return (
 *     <div>
 *       <h2>Aujourd'hui ({eventCount})</h2>
 *       {events.map(event => (
 *         <TimelineItem
 *           key={event.id}
 *           {...event}
 *           onClick={() => onEventClick(event.id)}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */

import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../../contexts/EventsContext';
import type { TodayEvent } from '../../types/home';

export interface UseTodayEventsReturn {
  /** Événements du jour triés par heure */
  events: TodayEvent[];

  /** Nombre d'événements aujourd'hui */
  eventCount: number;

  /** État de chargement */
  isLoading: boolean;

  /** Aucun événement aujourd'hui */
  isEmpty: boolean;

  /** Erreur de chargement */
  error: Error | null;

  /** Naviguer vers le détail d'un événement */
  handleEventClick: (eventId: string) => void;

  /** Naviguer vers le calendrier complet */
  handleViewCalendar: () => void;

  /** Naviguer vers la création d'un événement */
  handleCreateEvent: () => void;

  /** Rafraîchir les données */
  refresh: () => Promise<void>;
}

/**
 * Vérifie si une date est aujourd'hui.
 */
function isToday(dateString: string | Date): boolean {
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Formate une date en heure (ex: "14:30").
 */
function formatTime(dateString: string | Date): string {
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Retourne l'emoji correspondant à un type d'événement.
 */
function getEventEmoji(type?: string): string {
  const emojiMap: Record<string, string> = {
    feeding: '🥩',
    medical: '💊',
    appointment: '📍',
    training: '🏃',
    social: '🎮',
    grooming: '✂️',
    walk: '🚶',
  };
  return emojiMap[type?.toLowerCase() || ''] || '📌';
}

export function useTodayEvents(): UseTodayEventsReturn {
  const navigate = useNavigate();
  const { events, isLoading, fetchEvents } = useEvents();

  // Filtrer et transformer les événements du jour
  const todayEvents = useMemo<TodayEvent[]>(() => {
    return events
      .filter(event => isToday(event.start_date))
      .map(event => ({
        id: event.id,
        title: event.title || 'Événement',
        time: formatTime(event.start_date),
        emoji: getEventEmoji(event.type),
        type: event.type,
        pets: event.pets?.map(p => ({ id: p.id, name: p.name })) || [],
        startDate: event.start_date,
      }))
      .sort((a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
  }, [events]);

  const handleEventClick = useCallback((eventId: string) => {
    navigate(`/events/${eventId}`);
  }, [navigate]);

  const handleViewCalendar = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleCreateEvent = useCallback(() => {
    navigate('/events/new');
  }, [navigate]);

  const refresh = useCallback(async () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    await fetchEvents(
      startOfMonth.toISOString().split('T')[0],
      endOfMonth.toISOString().split('T')[0]
    );
  }, [fetchEvents]);

  return {
    events: todayEvents,
    eventCount: todayEvents.length,
    isLoading,
    isEmpty: todayEvents.length === 0,
    error: null, // TODO: Ajouter gestion d'erreur dans EventsContext
    handleEventClick,
    handleViewCalendar,
    handleCreateEvent,
    refresh,
  };
}
```

---

### 3.5 useQuickActions() - Actions rapides personnalisées

**Localisation**: `packages/shared/src/hooks/home/useQuickActions.ts`

**Responsabilité**: Générer les actions rapides disponibles selon les permissions utilisateur.

```typescript
/**
 * Hook pour générer les actions rapides disponibles pour l'utilisateur.
 *
 * Les actions peuvent être personnalisées selon :
 * - Les permissions de l'utilisateur
 * - Les préférences enregistrées
 * - Le contexte (ex: masquer "Ajouter un animal" si déjà 10 animaux)
 *
 * @returns Liste des actions rapides disponibles
 *
 * @example
 * ```tsx
 * function QuickActionsGrid() {
 *   const actions = useQuickActions();
 *
 *   return (
 *     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 *       {actions.map(action => (
 *         <QuickActionCard key={action.id} {...action} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */

import { useMemo } from 'react';
import { useAuth } from '../auth/useAuth';
import type { QuickAction } from '../../types/home';

export type UseQuickActionsReturn = QuickAction[];

export function useQuickActions(): UseQuickActionsReturn {
  const { user } = useAuth();

  return useMemo<QuickAction[]>(() => {
    const baseActions: QuickAction[] = [
      {
        id: 'add-event',
        emoji: '📅',
        title: 'Nouvel événement',
        description: 'Planifier une activité',
        path: '/events/new',
        variant: 'mint', // Utilise le gradient mint du design system
        isEnabled: true,
      },
      {
        id: 'add-pet',
        emoji: '🐾',
        title: 'Ajouter un animal',
        description: 'Enregistrer un nouveau compagnon',
        path: '/content/pets/new',
        variant: 'lavender',
        isEnabled: true,
      },
      {
        id: 'calendar',
        emoji: '📆',
        title: 'Calendrier',
        description: 'Voir tous les événements',
        path: '/',
        variant: 'yellow',
        isEnabled: true,
      },
      {
        id: 'ai-assistant',
        emoji: '🎤',
        title: 'Assistant IA',
        description: 'Créer avec la voix',
        path: '/ai-assistant',
        variant: 'coral',
        isEnabled: true, // TODO: Vérifier si OpenAI API key configurée
      },
    ];

    // Filtrer selon les permissions (exemple)
    return baseActions.filter(action => {
      // TODO: Implémenter la logique de permissions
      // if (action.id === 'ai-assistant' && !user?.hasAIAccess) return false;
      return action.isEnabled;
    });
  }, [user]);
}
```

---

## 4. Component Hierarchy

### 4.1 Arbre complet des composants

```
Index.tsx (Container Page)
│
├─ useHomeDashboard() ────────────────────┐
│   ├─ useGreeting()                      │
│   ├─ useQuickActions()                  │  Custom Hooks
│   ├─ usePetsSummary()                   │  (Business Logic Layer)
│   └─ useTodayEvents()                   │
│                                          │
└─ UI Components ──────────────────────────┘
    │
    ├─ HeroSection (Organism)
    │   └─ Props: { message, emoji, subtitle, userName }
    │
    ├─ QuickActionsGrid (Organism)
    │   ├─ Props: { actions: QuickAction[] }
    │   └─ QuickActionCard (Molecule) ✕ 4
    │       └─ Props: { emoji, title, description, onClick, variant }
    │
    ├─ PetsCarousel (Organism)
    │   ├─ Props: { pets, isEmpty, onPetClick, onAddPet, onViewAll }
    │   ├─ PetCard (Molecule) ✕ N
    │   │   └─ Props: { id, name, species, breed, emoji, age, onClick }
    │   └─ AddPetCard (Molecule)
    │       └─ Props: { onClick }
    │
    └─ TodayTimeline (Organism)
        ├─ Props: { events, isEmpty, eventCount, onEventClick, onViewCalendar }
        ├─ TimelineItem (Molecule) ✕ N
        │   └─ Props: { id, title, time, emoji, pets, onClick }
        └─ EmptyTimeline (Molecule)
            └─ Props: { onCreateEvent }
```

### 4.2 Responsabilités détaillées

#### Index.tsx - Container Page

**Localisation**: `apps/web/src/pages/Index.tsx`

```typescript
/**
 * Page d'accueil - Container
 *
 * Responsabilités :
 * 1. Orchestrer le hook useHomeDashboard()
 * 2. Gérer les états de chargement et d'erreur globaux
 * 3. Assembler les composants UI avec les bonnes props
 * 4. Gérer le layout responsive
 */

import { useHomeDashboard } from '@gastonapp/shared';
import {
  HeroSection,
  QuickActionsGrid,
  PetsCarousel,
  TodayTimeline,
  PageSkeleton,
  ErrorBoundary,
} from '@gastonapp/ui';

export default function Index() {
  const dashboard = useHomeDashboard();

  // Gestion du loading global
  if (dashboard.isLoading) {
    return <PageSkeleton sections={['hero', 'actions', 'pets', 'timeline']} />;
  }

  // Gestion d'erreur globale
  if (dashboard.error) {
    return (
      <ErrorBoundary
        error={dashboard.error}
        onRetry={dashboard.refresh}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-8">
      {/* Hero Section - Message d'accueil */}
      <HeroSection {...dashboard.greeting} />

      {/* Quick Actions - 4 cartes d'actions */}
      <QuickActionsGrid actions={dashboard.quickActions} />

      {/* Pets Carousel - Aperçu des animaux */}
      <PetsCarousel {...dashboard.petsSummary} />

      {/* Today Timeline - Événements du jour */}
      <TodayTimeline {...dashboard.todayEvents} />
    </div>
  );
}
```

---

## 5. TypeScript Interfaces

### 5.1 Types métier - QuickAction

**Localisation**: `packages/shared/src/types/home/QuickAction.ts`

```typescript
/**
 * Action rapide affichée sur la home page.
 */
export interface QuickAction {
  /** Identifiant unique de l'action */
  id: string;

  /** Emoji représentant l'action */
  emoji: string;

  /** Titre de l'action */
  title: string;

  /** Description courte de l'action */
  description: string;

  /** Chemin de navigation */
  path: string;

  /** Variante de couleur (mapping avec design system) */
  variant: 'mint' | 'lavender' | 'yellow' | 'coral';

  /** Action activée/désactivée */
  isEnabled: boolean;
}
```

---

### 5.2 Types métier - PetSummary

**Localisation**: `packages/shared/src/types/home/PetSummary.ts`

```typescript
/**
 * Résumé d'un animal pour affichage sur la home page.
 */
export interface PetSummary {
  /** Identifiant unique de l'animal */
  id: string;

  /** Nom de l'animal */
  name: string;

  /** Espèce (ex: "dog", "cat") */
  species: string;

  /** Race (optionnelle) */
  breed?: string;

  /** Emoji représentant l'espèce */
  emoji: string;

  /** Âge formaté (ex: "2 ans", "6 mois") */
  age: string;

  /** URL de l'image (optionnelle) */
  imageUrl?: string;
}
```

---

### 5.3 Types métier - TodayEvent

**Localisation**: `packages/shared/src/types/home/TodayEvent.ts`

```typescript
/**
 * Événement du jour pour affichage sur la timeline de la home page.
 */
export interface TodayEvent {
  /** Identifiant unique de l'événement */
  id: string;

  /** Titre de l'événement */
  title: string;

  /** Heure formatée (ex: "14:30") */
  time: string;

  /** Emoji représentant le type d'événement */
  emoji: string;

  /** Type d'événement (ex: "feeding", "medical") */
  type?: string;

  /** Animaux concernés par l'événement */
  pets: Array<{
    id: string;
    name: string;
  }>;

  /** Date de début (ISO string) - pour le tri */
  startDate: string;
}
```

---

### 5.4 Props des composants UI

#### HeroSection Props

**Localisation**: `packages/ui/src/components/home/HeroSection/HeroSection.tsx`

```typescript
export interface HeroSectionProps {
  /** Message de salutation (ex: "Bonjour", "Bonsoir") */
  message: string;

  /** Emoji contextuel (ex: "☀️", "🌙") */
  emoji: string;

  /** Sous-titre contextuel */
  subtitle: string;

  /** Nom de l'utilisateur connecté */
  userName: string;
}

/**
 * Hero Section - Message d'accueil personnalisé
 *
 * Composant purement présentationnel.
 * Ne contient aucune logique métier.
 */
export function HeroSection({
  message,
  emoji,
  subtitle,
  userName,
}: HeroSectionProps) {
  return (
    <section
      className="rounded-3xl p-6 md:p-8"
      style={{
        background: 'linear-gradient(135deg, var(--color-mint-light) 0%, var(--color-lavender-light) 100%)',
      }}
      aria-labelledby="hero-heading"
    >
      <div className="flex items-center gap-3 mb-3">
        <span
          className="text-4xl md:text-5xl"
          aria-hidden="true"
        >
          {emoji}
        </span>
        <div>
          <h1
            id="hero-heading"
            className="text-2xl md:text-3xl font-bold text-gray-900"
          >
            {message}, {userName} !
          </h1>
          <p className="text-sm md:text-base text-gray-700 mt-1">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
```

---

#### QuickActionsGrid Props

**Localisation**: `packages/ui/src/components/home/QuickActionsGrid/QuickActionsGrid.tsx`

```typescript
import type { QuickAction } from '@gastonapp/shared';

export interface QuickActionsGridProps {
  /** Liste des actions rapides à afficher */
  actions: QuickAction[];
}

/**
 * Grille d'actions rapides
 *
 * Affiche les actions sous forme de cartes cliquables.
 * Responsive : 2 colonnes sur mobile, 4 sur desktop.
 */
export function QuickActionsGrid({ actions }: QuickActionsGridProps) {
  if (actions.length === 0) return null;

  return (
    <section aria-labelledby="quick-actions-heading">
      <h2
        id="quick-actions-heading"
        className="text-lg md:text-xl font-semibold text-gray-900 mb-4"
      >
        Actions rapides
      </h2>

      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        role="group"
      >
        {actions.map(action => (
          <QuickActionCard key={action.id} {...action} />
        ))}
      </div>
    </section>
  );
}
```

---

#### QuickActionCard Props (Molecule)

**Localisation**: `packages/ui/src/components/home/QuickActionsGrid/QuickActionCard.tsx`

```typescript
export interface QuickActionCardProps {
  /** Identifiant unique */
  id: string;

  /** Emoji représentant l'action */
  emoji: string;

  /** Titre de l'action */
  title: string;

  /** Description courte */
  description: string;

  /** Chemin de navigation */
  path: string;

  /** Variante de couleur */
  variant: 'mint' | 'lavender' | 'yellow' | 'coral';

  /** Callback au clic (navigation gérée par le parent si besoin) */
  onClick?: () => void;
}

/**
 * Carte d'action rapide (Molecule)
 *
 * Composant atomique cliquable pour une action rapide.
 */
export function QuickActionCard({
  emoji,
  title,
  description,
  onClick,
  variant,
}: QuickActionCardProps) {
  const gradientMap = {
    mint: 'linear-gradient(135deg, var(--color-mint-light) 0%, var(--color-mint-base) 100%)',
    lavender: 'linear-gradient(135deg, var(--color-lavender-light) 0%, var(--color-lavender-base) 100%)',
    yellow: 'linear-gradient(135deg, var(--color-yellow-light) 0%, var(--color-yellow-base) 100%)',
    coral: 'linear-gradient(135deg, var(--color-coral-light) 0%, var(--color-coral-base) 100%)',
  };

  return (
    <button
      onClick={onClick}
      className="
        rounded-2xl p-4 md:p-6
        text-left
        transition-all duration-200
        hover:scale-[1.02] active:scale-[0.98]
        shadow-sm hover:shadow-md
        min-h-[120px] md:min-h-[140px]
        flex flex-col justify-between
        focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2
      "
      style={{ background: gradientMap[variant] }}
      aria-label={`${title}: ${description}`}
      type="button"
    >
      <div>
        <div className="text-3xl md:text-4xl mb-2" aria-hidden="true">
          {emoji}
        </div>
        <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1">
          {title}
        </h3>
      </div>
      <p className="text-xs md:text-sm text-gray-700">
        {description}
      </p>
    </button>
  );
}
```

---

#### PetsCarousel Props

**Localisation**: `packages/ui/src/components/home/PetsCarousel/PetsCarousel.tsx`

```typescript
import type { PetSummary } from '@gastonapp/shared';

export interface PetsCarouselProps {
  /** Liste des animaux à afficher */
  pets: PetSummary[];

  /** État de chargement */
  isLoading?: boolean;

  /** Aucun animal */
  isEmpty: boolean;

  /** Callback au clic sur un animal */
  onPetClick: (petId: string) => void;

  /** Callback pour ajouter un animal */
  onAddPet: () => void;

  /** Callback pour voir tous les animaux */
  onViewAll: () => void;
}

/**
 * Carousel des animaux
 *
 * Affiche les animaux en scrolling horizontal.
 * Gère l'état vide avec une carte d'ajout.
 */
export function PetsCarousel({
  pets,
  isLoading = false,
  isEmpty,
  onPetClick,
  onAddPet,
  onViewAll,
}: PetsCarouselProps) {
  if (isLoading) {
    return <PetsCarouselSkeleton />;
  }

  if (isEmpty) {
    return <PetsEmptyState onAddPet={onAddPet} />;
  }

  return (
    <section aria-labelledby="pets-heading">
      <div className="flex items-center justify-between mb-4">
        <h2
          id="pets-heading"
          className="text-lg md:text-xl font-semibold text-gray-900"
        >
          Mes animaux
        </h2>
        <button
          onClick={onViewAll}
          className="text-sm text-primary-700 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-400 rounded px-2 py-1"
          aria-label="Voir tous les animaux"
          type="button"
        >
          Voir tout
        </button>
      </div>

      <div
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
        role="list"
      >
        {pets.map(pet => (
          <PetCard
            key={pet.id}
            {...pet}
            onClick={() => onPetClick(pet.id)}
          />
        ))}

        <AddPetCard onClick={onAddPet} />
      </div>
    </section>
  );
}
```

---

#### PetCard Props (Molecule)

**Localisation**: `packages/ui/src/components/home/PetsCarousel/PetCard.tsx`

```typescript
export interface PetCardProps {
  /** Identifiant unique */
  id: string;

  /** Nom de l'animal */
  name: string;

  /** Espèce */
  species: string;

  /** Race (optionnelle) */
  breed?: string;

  /** Emoji représentant l'espèce */
  emoji: string;

  /** Âge formaté */
  age: string;

  /** Callback au clic */
  onClick: () => void;
}

/**
 * Carte d'un animal (Molecule)
 *
 * Affichage compact d'un animal pour le carousel.
 */
export function PetCard({
  name,
  species,
  breed,
  emoji,
  age,
  onClick,
}: PetCardProps) {
  return (
    <button
      onClick={onClick}
      className="
        min-w-[140px] md:min-w-[160px]
        bg-white
        rounded-2xl p-4
        shadow-sm hover:shadow-md
        transition-all duration-200
        hover:scale-[1.02] active:scale-[0.98]
        border border-lin-4
        text-left
        focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2
      "
      aria-label={`${name}, ${breed || species}, ${age}`}
      type="button"
      role="listitem"
    >
      <div className="text-3xl mb-2" aria-hidden="true">
        {emoji}
      </div>
      <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
        {name}
      </h3>
      <p className="text-xs text-gray-600 truncate">
        {breed || species}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        {age}
      </p>
    </button>
  );
}
```

---

#### TodayTimeline Props

**Localisation**: `packages/ui/src/components/home/TodayTimeline/TodayTimeline.tsx`

```typescript
import type { TodayEvent } from '@gastonapp/shared';

export interface TodayTimelineProps {
  /** Liste des événements du jour */
  events: TodayEvent[];

  /** Nombre d'événements */
  eventCount: number;

  /** État de chargement */
  isLoading?: boolean;

  /** Aucun événement */
  isEmpty: boolean;

  /** Callback au clic sur un événement */
  onEventClick: (eventId: string) => void;

  /** Callback pour voir le calendrier complet */
  onViewCalendar: () => void;
}

/**
 * Timeline des événements du jour
 *
 * Affiche les événements de la journée en cours triés par heure.
 */
export function TodayTimeline({
  events,
  eventCount,
  isLoading = false,
  isEmpty,
  onEventClick,
  onViewCalendar,
}: TodayTimelineProps) {
  if (isLoading) {
    return <TodayTimelineSkeleton />;
  }

  if (isEmpty) {
    return <EmptyTimeline />;
  }

  return (
    <section aria-labelledby="today-events-heading">
      <div className="flex items-center justify-between mb-4">
        <h2
          id="today-events-heading"
          className="text-lg md:text-xl font-semibold text-gray-900"
        >
          Aujourd'hui
        </h2>
        <span
          className="text-sm text-gray-600"
          aria-label={`${eventCount} événement${eventCount > 1 ? 's' : ''} aujourd'hui`}
        >
          {eventCount} événement{eventCount > 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-2" role="list">
        {events.map(event => (
          <TimelineItem
            key={event.id}
            {...event}
            onClick={() => onEventClick(event.id)}
          />
        ))}
      </div>

      {eventCount >= 3 && (
        <button
          onClick={onViewCalendar}
          className="w-full mt-3 text-sm text-primary-700 hover:underline py-2"
        >
          Voir le calendrier complet
        </button>
      )}
    </section>
  );
}
```

---

#### TimelineItem Props (Molecule)

**Localisation**: `packages/ui/src/components/home/TodayTimeline/TimelineItem.tsx`

```typescript
export interface TimelineItemProps {
  /** Identifiant unique */
  id: string;

  /** Titre de l'événement */
  title: string;

  /** Heure formatée */
  time: string;

  /** Emoji du type d'événement */
  emoji: string;

  /** Animaux concernés */
  pets: Array<{
    id: string;
    name: string;
  }>;

  /** Callback au clic */
  onClick: () => void;
}

/**
 * Item de timeline (Molecule)
 *
 * Affichage d'un événement dans la timeline du jour.
 */
export function TimelineItem({
  title,
  time,
  emoji,
  pets,
  onClick,
}: TimelineItemProps) {
  const petsNames = pets.map(p => p.name).join(', ');

  return (
    <button
      onClick={onClick}
      className="
        w-full
        bg-white
        rounded-xl p-4
        shadow-sm hover:shadow-md
        transition-all duration-200
        hover:scale-[1.01] active:scale-[0.99]
        border border-lin-4
        text-left
        flex items-center gap-4
        focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2
      "
      aria-label={`${title} à ${time}${pets.length > 0 ? ` pour ${petsNames}` : ''}`}
      type="button"
      role="listitem"
    >
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-lin-2 flex items-center justify-center text-2xl">
          {emoji}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-sm font-semibold text-primary-700">
            {time}
          </span>
          <h3 className="font-medium text-gray-900 truncate text-sm">
            {title}
          </h3>
        </div>

        {pets.length > 0 && (
          <p className="text-xs text-gray-600 truncate">
            Pour: {petsNames}
          </p>
        )}
      </div>

      <div className="flex-shrink-0">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </button>
  );
}
```

---

## 6. Responsive Implementation

### 6.1 Breakpoints Strategy

**Utilisation des design tokens** (conformément au design system)

```typescript
// Design system breakpoints
const breakpoints = {
  mobile: '320px',   // Smartphones
  tablet: '768px',   // Tablettes
  desktop: '1024px', // Desktop
  wide: '1280px',    // Large screens
};

// Tailwind config
module.exports = {
  theme: {
    screens: {
      'sm': '640px',   // Small (override Tailwind default)
      'md': '768px',   // Medium (tablet)
      'lg': '1024px',  // Large (desktop)
      'xl': '1280px',  // Extra large
      '2xl': '1536px', // 2X large
    },
  },
};
```

### 6.2 Layout Responsive par Section

#### Mobile (320px - 767px)

```tsx
// Index.tsx - Mobile Layout
<div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
  {/* Hero Section - Full width, compact */}
  <HeroSection {...dashboard.greeting} />

  {/* Quick Actions - 2 colonnes */}
  <QuickActionsGrid actions={dashboard.quickActions} />
  {/* Grid: grid-cols-2 gap-3 */}

  {/* Pets Carousel - Scroll horizontal */}
  <PetsCarousel {...dashboard.petsSummary} />
  {/* Overflow-x-auto, min-w-[140px] par carte */}

  {/* Today Timeline - Stack vertical */}
  <TodayTimeline {...dashboard.todayEvents} />
  {/* Space-y-2 */}
</div>
```

**Spacing mobile** :
- Padding page : `px-4` (16px)
- Gap sections : `space-y-6` (24px)
- Gap cartes : `gap-3` (12px)

---

#### Tablet (768px - 1023px)

```tsx
// Index.tsx - Tablet Layout
<div className="max-w-7xl mx-auto px-6 py-6 space-y-8">
  {/* Hero Section - Plus d'espace */}
  <HeroSection {...dashboard.greeting} />

  {/* Quick Actions - 4 colonnes */}
  <QuickActionsGrid actions={dashboard.quickActions} />
  {/* Grid: md:grid-cols-4 md:gap-4 */}

  {/* Pets Carousel - Scroll horizontal avec cartes plus larges */}
  <PetsCarousel {...dashboard.petsSummary} />
  {/* md:min-w-[160px] par carte */}

  {/* Today Timeline - Stack vertical */}
  <TodayTimeline {...dashboard.todayEvents} />
</div>
```

**Spacing tablet** :
- Padding page : `md:px-6` (24px)
- Gap sections : `md:space-y-8` (32px)
- Gap cartes : `md:gap-4` (16px)

---

#### Desktop (1024px+)

```tsx
// Index.tsx - Desktop Layout
<div className="max-w-7xl mx-auto lg:px-8 py-6 lg:space-y-10">
  {/* Hero Section - Maximum width */}
  <HeroSection {...dashboard.greeting} />

  {/* Quick Actions - 4 colonnes avec plus d'espace */}
  <QuickActionsGrid actions={dashboard.quickActions} />

  {/* Layout 2 colonnes : Pets | Timeline */}
  <div className="lg:grid lg:grid-cols-2 lg:gap-8">
    <PetsCarousel {...dashboard.petsSummary} />
    <TodayTimeline {...dashboard.todayEvents} />
  </div>
</div>
```

**Spacing desktop** :
- Padding page : `lg:px-8` (32px)
- Gap sections : `lg:space-y-10` (40px)
- Layout 2 colonnes : `lg:grid-cols-2 lg:gap-8`

---

### 6.3 Grid System

**Quick Actions Grid**

```tsx
// QuickActionsGrid.tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
  {/* Mobile: 2 colonnes, Desktop: 4 colonnes */}
</div>
```

**Pets/Timeline Layout (Desktop uniquement)**

```tsx
// Index.tsx - Desktop only
<div className="lg:grid lg:grid-cols-2 lg:gap-8">
  <PetsCarousel {...dashboard.petsSummary} />
  <TodayTimeline {...dashboard.todayEvents} />
</div>
```

---

### 6.4 Typography Responsive

**Utilisation des design tokens**

```tsx
// HeroSection.tsx
<h1 className="text-2xl md:text-3xl font-bold">
  {/* Mobile: 32px, Desktop: 40px */}
  {message}, {userName} !
</h1>

<p className="text-sm md:text-base">
  {/* Mobile: 14px, Desktop: 16px */}
  {subtitle}
</p>

// QuickActionCard.tsx
<h3 className="text-sm md:text-base font-semibold">
  {title}
</h3>

<p className="text-xs md:text-sm">
  {description}
</p>
```

**Mapping design tokens** :
- `text-2xl` → `--font-size-h1-mobile: 32px`
- `md:text-3xl` → `--font-size-h1: 40px`
- `text-sm` → `--font-size-body-s-mobile: 14px`
- `md:text-base` → `--font-size-body-m: 16px`

---

### 6.5 Touch Targets (Mobile)

**Conformité WCAG AA** : Minimum 44px de hauteur/largeur

```tsx
// Tous les boutons interactifs
<button
  className="
    min-h-[120px] md:min-h-[140px]  // QuickActionCard
    min-w-[140px] md:min-w-[160px]  // PetCard
    p-4                              // 16px padding minimum
  "
>
  {/* Touch target >= 44px garanti */}
</button>
```

---

## 7. Performance Optimizations

### 7.1 Memoization Strategy

#### React.memo pour les composants UI purs

```typescript
// packages/ui/src/components/home/QuickActionsGrid/QuickActionCard.tsx

import { memo } from 'react';

/**
 * QuickActionCard - Memoized
 *
 * Re-render uniquement si les props changent.
 * Essentiel car affiché 4 fois sur la page.
 */
export const QuickActionCard = memo(function QuickActionCard({
  emoji,
  title,
  description,
  onClick,
  variant,
}: QuickActionCardProps) {
  // ... composant
});

// packages/ui/src/components/home/PetsCarousel/PetCard.tsx
export const PetCard = memo(function PetCard(props: PetCardProps) {
  // ... composant
});

// packages/ui/src/components/home/TodayTimeline/TimelineItem.tsx
export const TimelineItem = memo(function TimelineItem(props: TimelineItemProps) {
  // ... composant
});
```

**Règle** : Memoize tous les composants Molecule affichés en liste.

---

#### useMemo pour les calculs coûteux

```typescript
// packages/shared/src/hooks/home/usePetsSummary.ts

export function usePetsSummary(): UsePetsSummaryReturn {
  const { pets, isLoading, refreshPets } = usePets();

  // Memoize la transformation des pets
  const petsSummary = useMemo<PetSummary[]>(
    () => pets.map(pet => ({
      id: pet.id,
      name: pet.name,
      species: pet.species || 'Inconnu',
      breed: pet.breed,
      emoji: getSpeciesEmoji(pet.species),
      age: calculateAge(pet.birthDate), // Calcul coûteux
      imageUrl: pet.imageUrl,
    })),
    [pets] // Re-calcule uniquement si pets change
  );

  // ...
}

// packages/shared/src/hooks/home/useTodayEvents.ts

export function useTodayEvents(): UseTodayEventsReturn {
  const { events, isLoading, fetchEvents } = useEvents();

  // Memoize le filtrage + tri + transformation
  const todayEvents = useMemo<TodayEvent[]>(() => {
    return events
      .filter(event => isToday(event.start_date))
      .map(event => ({
        id: event.id,
        title: event.title || 'Événement',
        time: formatTime(event.start_date),
        emoji: getEventEmoji(event.type),
        type: event.type,
        pets: event.pets?.map(p => ({ id: p.id, name: p.name })) || [],
        startDate: event.start_date,
      }))
      .sort((a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
  }, [events]); // Re-calcule uniquement si events change

  // ...
}
```

**Règle** : Memoize tous les calculs dérivés (map, filter, sort).

---

#### useCallback pour les handlers

```typescript
// packages/shared/src/hooks/home/usePetsSummary.ts

export function usePetsSummary(): UsePetsSummaryReturn {
  const navigate = useNavigate();

  // Memoize les callbacks de navigation
  const handlePetClick = useCallback((petId: string) => {
    navigate(`/content/pets/${petId}`);
  }, [navigate]);

  const handleAddPet = useCallback(() => {
    navigate('/content/pets/new');
  }, [navigate]);

  const handleViewAll = useCallback(() => {
    navigate('/content/pets');
  }, [navigate]);

  return {
    // ...
    handlePetClick,
    handleAddPet,
    handleViewAll,
  };
}
```

**Règle** : useCallback pour tous les handlers passés en props aux composants memoized.

---

### 7.2 Lazy Loading & Code Splitting

#### Lazy load de la page Index

```typescript
// apps/web/src/router/index.tsx

import { lazy, Suspense } from 'react';
import { PageSkeleton } from '@gastonapp/ui';

// Lazy load de la page Index
const IndexPage = lazy(() => import('../pages/Index'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<PageSkeleton sections={['hero', 'actions', 'pets', 'timeline']} />}>
        <IndexPage />
      </Suspense>
    ),
  },
  // ...
]);
```

**Bénéfice** : Réduction du bundle initial, chargement à la demande.

---

#### Dynamic imports pour les composants lourds (optionnel)

```typescript
// Si certains composants deviennent très lourds (ex: graphiques, calendrier)

const HeavyChart = lazy(() => import('./HeavyChart'));

function Dashboard() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <button onClick={() => setShowChart(true)}>Afficher les statistiques</button>

      {showChart && (
        <Suspense fallback={<div>Chargement...</div>}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
}
```

**Note** : Pas nécessaire pour la home page actuelle (composants légers).

---

### 7.3 Virtualization (Si nécessaire)

**Quand virtualiser ?**
- Liste de plus de 100 éléments
- Performance dégradée sur mobile

**Exemple avec react-virtual** (si la liste de pets devient très longue)

```typescript
// packages/ui/src/components/home/PetsCarousel/PetsCarousel.tsx

import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

export function PetsCarousel({ pets, onPetClick }: PetsCarouselProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: pets.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 160, // Largeur de PetCard
    horizontal: true,
  });

  return (
    <div
      ref={parentRef}
      className="flex gap-3 overflow-x-auto"
      style={{ maxWidth: '100%' }}
    >
      <div
        style={{
          width: `${virtualizer.getTotalSize()}px`,
          height: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '160px',
              transform: `translateX(${virtualItem.start}px)`,
            }}
          >
            <PetCard {...pets[virtualItem.index]} onClick={() => onPetClick(pets[virtualItem.index].id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Note** : Implémenter uniquement si plus de 50 animaux.

---

### 7.4 Bundle Size Optimization

#### Tree-shaking des imports

```typescript
// ❌ MAUVAIS : Importe tout le package
import { Button, Card, Modal, Table, Input, ... } from '@gastonapp/ui';

// ✅ BON : Import spécifique
import { HeroSection } from '@gastonapp/ui/home/HeroSection';
import { QuickActionsGrid } from '@gastonapp/ui/home/QuickActionsGrid';
```

**Configuration package.json** (`packages/ui/package.json`)

```json
{
  "name": "@gastonapp/ui",
  "exports": {
    ".": "./src/index.ts",
    "./home/*": "./src/components/home/*/index.ts"
  },
  "sideEffects": false
}
```

---

#### Analyse du bundle

```bash
# Analyser le bundle Vite
pnpm --filter @gastonapp/web build --analyze

# Ou avec vite-plugin-bundle-analyzer
# vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true }),
  ],
});
```

**Objectif** : Bundle de la home page < 50 KB (gzipped).

---

### 7.5 Performance Checklist

Avant de merger :

- [ ] Tous les composants Molecule sont React.memo
- [ ] Tous les calculs dérivés utilisent useMemo
- [ ] Tous les handlers utilisent useCallback
- [ ] Aucun re-render inutile (vérifier avec React DevTools Profiler)
- [ ] Lazy loading de la page Index
- [ ] Bundle size < 50 KB (gzipped)
- [ ] Lighthouse score > 90 sur mobile
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s

---

## 8. Migration Plan

### 8.1 Étapes de migration (Ordre recommandé)

#### Phase 1 : Préparation (1-2 jours)

**Étape 1.1 : Créer la structure de dossiers**

```bash
# Créer les dossiers dans packages/shared
mkdir -p packages/shared/src/hooks/home
mkdir -p packages/shared/src/types/home

# Créer les dossiers dans packages/ui
mkdir -p packages/ui/src/components/home/HeroSection
mkdir -p packages/ui/src/components/home/QuickActionsGrid
mkdir -p packages/ui/src/components/home/PetsCarousel
mkdir -p packages/ui/src/components/home/TodayTimeline
```

**Étape 1.2 : Créer les types**

```bash
# Créer les fichiers de types
touch packages/shared/src/types/home/QuickAction.ts
touch packages/shared/src/types/home/PetSummary.ts
touch packages/shared/src/types/home/TodayEvent.ts
touch packages/shared/src/types/home/index.ts
```

Implémenter les interfaces définies dans la section 5.

---

#### Phase 2 : Hooks métier (2-3 jours)

**Ordre de création** (du plus simple au plus complexe)

1. **useGreeting()** - Pas de dépendances externes
2. **useQuickActions()** - Juste une config statique
3. **usePetsSummary()** - Dépend de PetsContext
4. **useTodayEvents()** - Dépend de EventsContext
5. **useHomeDashboard()** - Orchestre tous les hooks

**Checklist par hook** :
- [ ] Fichier créé dans `packages/shared/src/hooks/home/`
- [ ] Interface `UseXxxReturn` définie
- [ ] Documentation JSDoc complète
- [ ] Tests unitaires écrits
- [ ] Export dans `index.ts`

---

#### Phase 3 : Composants UI (3-4 jours)

**Ordre de création** (Molecules avant Organisms)

1. **QuickActionCard** (Molecule)
2. **PetCard** + **AddPetCard** (Molecules)
3. **TimelineItem** + **EmptyTimeline** (Molecules)
4. **HeroSection** (Organism)
5. **QuickActionsGrid** (Organism)
6. **PetsCarousel** (Organism)
7. **TodayTimeline** (Organism)

**Checklist par composant** :
- [ ] Fichier créé dans `packages/ui/src/components/home/`
- [ ] Props interface définie
- [ ] Composant 100% présentationnel (pas de logique)
- [ ] Accessibilité WCAG AA (ARIA labels, keyboard nav)
- [ ] Responsive (mobile, tablet, desktop)
- [ ] React.memo appliqué (pour Molecules)
- [ ] Tests unitaires écrits
- [ ] Storybook story créé (optionnel mais recommandé)
- [ ] Export dans `index.ts`

---

#### Phase 4 : Refonte de Index.tsx (1 jour)

**Étape 4.1 : Backup de l'ancien code**

```bash
# Créer un backup
cp apps/web/src/pages/Index.tsx apps/web/src/pages/Index.old.tsx
```

**Étape 4.2 : Réécrire Index.tsx**

Implémenter la nouvelle version avec `useHomeDashboard()`.

**Étape 4.3 : Supprimer les anciens composants**

```bash
# Une fois la migration validée
rm -rf apps/web/src/components/Home/HeroSection.tsx
rm -rf apps/web/src/components/Home/QuickActions.tsx
rm -rf apps/web/src/components/Home/PetCards.tsx
rm -rf apps/web/src/components/Home/TodayTimeline.tsx
```

---

#### Phase 5 : Tests & Optimisation (2 jours)

**Étape 5.1 : Tests d'intégration**

```typescript
// apps/web/src/pages/__tests__/Index.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Index from '../Index';

describe('Index Page', () => {
  it('should render all sections', async () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Bonjour|Bonsoir/)).toBeInTheDocument();
      expect(screen.getByText('Actions rapides')).toBeInTheDocument();
      expect(screen.getByText('Mes animaux')).toBeInTheDocument();
      expect(screen.getByText('Aujourd\'hui')).toBeInTheDocument();
    });
  });

  it('should handle empty states', async () => {
    // Mock usePets() pour retourner []
    // Mock useEvents() pour retourner []

    render(<Index />);

    await waitFor(() => {
      expect(screen.getByText('Aucun animal enregistré')).toBeInTheDocument();
      expect(screen.getByText('Aucun événement prévu')).toBeInTheDocument();
    });
  });
});
```

**Étape 5.2 : Profiling React DevTools**

1. Ouvrir React DevTools
2. Onglet "Profiler"
3. Enregistrer une session (interactions avec la page)
4. Identifier les re-renders inutiles
5. Optimiser avec memo/useMemo/useCallback

**Étape 5.3 : Lighthouse Audit**

```bash
# Lancer un build de production
pnpm build:web

# Tester avec Lighthouse (Chrome DevTools)
# Objectifs :
# - Performance > 90
# - Accessibility > 95
# - Best Practices > 95
# - SEO > 90
```

---

### 8.2 Stratégie de rollback

**En cas de problème critique** :

1. **Restaurer l'ancien Index.tsx**
   ```bash
   git checkout HEAD~1 -- apps/web/src/pages/Index.tsx
   ```

2. **Restaurer les anciens composants Home/**
   ```bash
   git checkout HEAD~1 -- apps/web/src/components/Home/
   ```

3. **Nettoyer les nouveaux packages**
   ```bash
   # Supprimer les hooks non utilisés
   rm -rf packages/shared/src/hooks/home
   rm -rf packages/shared/src/types/home

   # Supprimer les composants UI non utilisés
   rm -rf packages/ui/src/components/home
   ```

**Prévention** : Créer une feature branch dédiée

```bash
git checkout -b feature/home-page-refactoring
# Développement complet sur cette branche
# Merge uniquement après validation complète
```

---

### 8.3 Validation de la migration

**Checklist de validation finale**

#### Fonctionnel
- [ ] Message d'accueil s'affiche correctement
- [ ] Nom de l'utilisateur récupéré depuis le contexte Auth
- [ ] 4 actions rapides affichées et cliquables
- [ ] Liste des animaux affichée (ou état vide)
- [ ] Timeline des événements du jour affichée (ou état vide)
- [ ] Toutes les navigations fonctionnent
- [ ] États de chargement corrects (skeletons)
- [ ] États vides corrects (empty states)

#### Performance
- [ ] Aucun re-render inutile (vérifié avec Profiler)
- [ ] Bundle size < 50 KB (gzipped)
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Lighthouse Performance > 90

#### Responsive
- [ ] Affichage correct sur mobile (320px)
- [ ] Affichage correct sur tablet (768px)
- [ ] Affichage correct sur desktop (1024px+)
- [ ] Pas de scroll horizontal non voulu
- [ ] Touch targets >= 44px sur mobile

#### Accessibilité
- [ ] Tous les boutons ont un aria-label
- [ ] Navigation au clavier fonctionnelle
- [ ] Lecteur d'écran compatible
- [ ] Lighthouse Accessibility > 95
- [ ] Contraste WCAG AA respecté

#### Code Quality
- [ ] Aucune erreur TypeScript
- [ ] Aucun warning ESLint
- [ ] Tous les tests passent (unit + integration)
- [ ] Code review approuvée
- [ ] Documentation à jour

---

### 8.4 Estimation de temps

| Phase | Durée estimée | Développeur |
|-------|---------------|-------------|
| Phase 1 : Préparation | 1-2 jours | Lead Frontend |
| Phase 2 : Hooks métier | 2-3 jours | Lead Frontend |
| Phase 3 : Composants UI | 3-4 jours | Lead Frontend + Frontend Dev |
| Phase 4 : Refonte Index.tsx | 1 jour | Lead Frontend |
| Phase 5 : Tests & Optimisation | 2 jours | QA + Lead Frontend |
| **Total** | **9-12 jours** | **1-2 personnes** |

**En mode solo (Lead Frontend uniquement)** : 12-15 jours ouvrés (2-3 semaines)

**En équipe (Lead + Dev + QA)** : 7-10 jours ouvrés (1.5-2 semaines)

---

## 9. Annexes

### 9.1 Glossaire

| Terme | Définition |
|-------|------------|
| **Container** | Composant qui orchestre la logique (hooks) et assemble les composants UI |
| **Presentational** | Composant UI pur sans logique métier |
| **Organism** | Composant UI complexe composé de Molecules |
| **Molecule** | Composant UI simple réutilisable |
| **Atom** | Composant UI de base (Button, Input, etc.) |
| **Custom Hook** | Hook métier réutilisable (préfixé `use`) |

### 9.2 Références

- [GastonApp Front Architecture](./front-architecture.md)
- [GastonApp Design System](../../design-system/)
- [React Official Docs - Hooks](https://react.dev/reference/react)
- [React Design Patterns (Radix)](https://www.radix-ui.com/blog/react-design-patterns)

### 9.3 Contact

**Lead Frontend Developer** : Disponible pour questions/clarifications

**Documentation maintenue par** : Équipe technique GastonApp

---

**Fin du document**

Date de création : 2025-11-16
Version : 1.0.0
Prochaine revue : Après implémentation Phase 1
