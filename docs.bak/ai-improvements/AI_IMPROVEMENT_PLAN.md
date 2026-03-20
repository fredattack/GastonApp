# 🚀 Plan d'Amélioration AI - GastonApp

**Version:** 1.0
**Date:** 16 Novembre 2025
**Durée estimée:** 6-8 semaines
**Contexte:** Amélioration du système AI pour couvrir tous les types de messages utilisateur

---

## 📋 TABLE DES MATIÈRES

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture Actuelle](#architecture-actuelle)
3. [Analyse des Gaps](#analyse-des-gaps)
4. [Plan d'Implémentation par Phases](#plan-dimplémentation-par-phases)
5. [Spécifications Techniques](#spécifications-techniques)
6. [Calendrier de Déploiement](#calendrier-de-déploiement)
7. [Critères de Succès](#critères-de-succès)

---

## 🎯 VUE D'ENSEMBLE

### Objectifs Principaux

1. **Étendre les capacités AI** pour couvrir les 10 familles fonctionnelles identifiées
2. **Différencier les réponses** selon le type de requête (createEvent, query, advice, etc.)
3. **Réutiliser les composants existants** (ActionModal, AIMessageCard, MessageBubble)
4. **Ajouter des disclaimers santé** pour toutes les requêtes médicales
5. **Améliorer la précision** et la robustesse des réponses AI
6. **Permettre l'extrapolation** pour gérer des cas non prévus

### Familles Fonctionnelles à Couvrir

| # | Famille | Statut Actuel | Priorité |
|---|---------|--------------|----------|
| 1 | **PetProfile** (Gestion de fiche) | ✅ Implémenté (createPet, updatePet) | P0 |
| 2 | **HealthCare** (Soins et santé) | 🟡 Partiel (createEvent medical) | P0 |
| 3 | **Scheduling** (Rendez-vous, rappels) | ✅ Implémenté (createEvent appointment) | P0 |
| 4 | **Nutrition** (Menus, alimentation) | ✅ Implémenté (createEvent feeding) | P0 |
| 5 | **Metrics** (Poids, mesures) | 🔴 Non implémenté | P1 |
| 6 | **Tasks** (Tâches récurrentes) | 🟡 Partiel (récurrence simple) | P1 |
| 7 | **Knowledge** (Questions, conseils) | 🔴 Non implémenté | P1 |
| 8 | **ExternalServices** (Vétérinaires, toilettage) | 🔴 Non implémenté | P2 |
| 9 | **UserOrganization** (Notes, mémos, exports) | 🔴 Non implémenté | P2 |
| 10 | **GlobalOverview** (Vision multi-animaux) | 🔴 Non implémenté | P2 |

---

## 🏗️ ARCHITECTURE ACTUELLE

### Frontend

```
apps/web/src/
├── components/
│   ├── Modal/
│   │   └── ActionModal.tsx          ✅ Modal création/édition événements & pets
│   └── Event/Form/EventForm.tsx     ✅ Formulaire événement
├── pages/AIAssistant/components/
│   ├── MessageBubble.tsx            ✅ Affichage messages simples
│   └── AIMessageCard.tsx            ✅ Affichage avancé événements (preview/edit)
├── contexts/
│   └── AIAssistantContext.tsx       ✅ Gestion conversations & streaming
├── services/
│   └── OpenAIService.tsx            ✅ Communication backend AI
└── types/global.d.ts                ✅ Types Message, AIResponse, etc.
```

### Backend

```
gaston-backend/app/
├── Http/Controllers/
│   └── ConsumeAiController.php      ✅ Endpoint POST /ai
├── Services/
│   ├── ConsumeAiService.php         ✅ Logique AI (GPT-4o)
│   ├── EventService.php             ✅ Gestion événements
│   └── PetService.php               ✅ Gestion animaux
└── Models/
    ├── Event.php
    └── Pet.php
```

### Types de Requêtes Supportées

| Type | Frontend | Backend | Affichage |
|------|----------|---------|-----------|
| `createEvent` | ✅ | ✅ | AIMessageCard + EventForm |
| `updateEvent` | 🟡 | 🟡 | ActionModal |
| `deleteEvent` | 🔴 | 🔴 | ❌ |
| `createPet` | ✅ | ✅ | ActionModal + PetForm |
| `updatePet` | 🟡 | 🟡 | ActionModal |
| `deletePet` | 🔴 | 🔴 | ❌ |
| `query` | 🔴 | 🔴 | ❌ |
| `advice` | 🔴 | 🔴 | ❌ |
| `metrics` | 🔴 | 🔴 | ❌ |

---

## 🔍 ANALYSE DES GAPS

### 1. Types de Réponses Manquants

#### 🔴 Query (Requêtes & Consultation)
- **Exemples:** "Quels sont les rendez-vous de Pablo cette semaine ?"
- **Backend:** Aucun endpoint de recherche exposé à l'AI
- **Frontend:** Pas de composant d'affichage pour résultats de recherche
- **Impact:** Impossible de répondre aux questions utilisateur

#### 🔴 Advice (Conseils & Recommandations)
- **Exemples:** "Quelle quantité de croquettes donner à Luna si elle pèse 4,5 kg ?"
- **Backend:** Pas de base de connaissance intégrée
- **Frontend:** Pas de composant pour afficher des conseils
- **Impact:** Valeur ajoutée limitée, pas d'aide proactive

#### 🔴 Metrics (Métriques & Suivi)
- **Exemples:** "Montre-moi l'évolution du poids de Max sur les 6 derniers mois"
- **Backend:** Pas de modèle Weight/Metric
- **Frontend:** Pas de graphiques/visualisations
- **Impact:** Pas de suivi santé avancé

### 2. Disclaimers Santé

**Problème:** Aucun avertissement lors de requêtes médicales/santé

**Requis:**
- ⚠️ Alerte automédication
- ⚠️ Décharge de responsabilité
- ⚠️ Recommandation de consulter un vétérinaire

**Déclencheurs:**
- Type d'événement = `medical`
- Mots-clés: "médicament", "traitement", "symptôme", "malade", "douleur", etc.
- Intent = `advice` + contexte santé

### 3. Extrapolation & Patterns

**Problème actuel:**
- Système rigide basé sur 4 types de requêtes
- Few-shot examples limités à 3 exemples
- Pas de gestion des formulations variées

**Solution:**
- Enrichir le system prompt avec plus de patterns
- Ajouter classification d'intent plus granulaire
- Implémenter fallback intelligent

---

## 📅 PLAN D'IMPLÉMENTATION PAR PHASES

---

## 🔵 PHASE 1: Fondations & Disclaimers Santé
**Durée:** 1-2 semaines
**Priorité:** P0 - CRITIQUE

### Objectifs
1. Ajouter disclaimers santé obligatoires
2. Améliorer validation backend
3. Créer composants d'affichage réutilisables
4. Améliorer les types TypeScript

### 1.1 Backend - Disclaimers & Validation

**Fichier:** `/gaston-backend/app/Services/ConsumeAiService.php`

#### Tâches:

**A. Ajouter détection contexte santé**

```php
protected function isMedicalContext(array $response): bool
{
    // Vérifier le type d'événement
    if (isset($response['data']['type']) && $response['data']['type'] === 'medical') {
        return true;
    }

    // Vérifier les mots-clés santé dans le prompt et la description
    $medicalKeywords = [
        'médicament', 'traitement', 'symptôme', 'malade', 'douleur',
        'vétérinaire', 'vaccin', 'vermifuge', 'antibiotique', 'anti-inflammatoire',
        'vomi', 'diarrhée', 'fièvre', 'blessure', 'infection', 'allergie'
    ];

    $textToCheck = strtolower($response['description'] ?? '');

    foreach ($medicalKeywords as $keyword) {
        if (str_contains($textToCheck, $keyword)) {
            return true;
        }
    }

    return false;
}
```

**B. Enrichir la réponse avec disclaimer**

```php
protected function enrichResponseWithMetadata(array $response, string $prompt): array
{
    $enriched = $response;

    // Ajouter métadonnées
    $enriched['metadata'] = [
        'hasMedicalContext' => $this->isMedicalContext($response),
        'processedAt' => now()->toIso8601String(),
        'originalPrompt' => $prompt,
    ];

    // Ajouter disclaimer si contexte médical
    if ($enriched['metadata']['hasMedicalContext']) {
        $enriched['healthDisclaimer'] = $this->getHealthDisclaimer();
    }

    return $enriched;
}

protected function getHealthDisclaimer(): array
{
    return [
        'severity' => 'warning', // 'info' | 'warning' | 'critical'
        'type' => 'medical',
        'title' => '⚠️ Avertissement Santé',
        'message' => "Les informations fournies par GastonApp ne remplacent en aucun cas l'avis d'un vétérinaire professionnel. En cas de doute sur la santé de votre animal, consultez immédiatement un vétérinaire.",
        'actions' => [
            [
                'label' => 'Trouver un vétérinaire',
                'type' => 'primary',
                'action' => 'findVet',
            ],
            [
                'label' => 'J\'ai compris',
                'type' => 'secondary',
                'action' => 'dismiss',
            ],
        ],
        'autoMedicationWarning' => "⚠️ Ne donnez jamais de médicaments à votre animal sans prescription vétérinaire. L'automédication peut être dangereuse, voire mortelle.",
    ];
}
```

**C. Modifier la méthode consumeAi()**

```php
public function consumeAi(string $prompt): array
{
    try {
        $response = $this->callOpenAI($prompt);
        $parsed = $this->parseResponse($response);

        if (! $this->validateResponse($parsed)) {
            Log::warning('AI Response validation failed, retrying', ['response' => $parsed]);
            return $this->retryWithEnhancedPrompt($prompt);
        }

        // ✨ NOUVEAU: Enrichir avec métadonnées et disclaimers
        $enriched = $this->enrichResponseWithMetadata($parsed, $prompt);

        return $enriched;

    } catch (Exception $e) {
        Log::error('AI Service Error', [
            'prompt' => $prompt,
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ]);

        return $this->getFallbackResponse($prompt);
    }
}
```

### 1.2 Frontend - Types & Interfaces

**Fichier:** `/apps/web/src/types/global.d.ts`

#### Tâches:

**A. Ajouter types pour disclaimers**

```typescript
interface HealthDisclaimer {
    severity: 'info' | 'warning' | 'critical';
    type: 'medical' | 'nutrition' | 'general';
    title: string;
    message: string;
    actions: DisclaimerAction[];
    autoMedicationWarning?: string;
}

interface DisclaimerAction {
    label: string;
    type: 'primary' | 'secondary' | 'danger';
    action: 'findVet' | 'dismiss' | 'learnMore' | 'callEmergency';
}

interface AIResponseMetadata {
    hasMedicalContext: boolean;
    processedAt: string;
    originalPrompt: string;
    confidence?: number;
}

interface AIResponse {
    score: number;
    requestType: "createEvent" | "updateEvent" | "deleteEvent" | "createPet" | "updatePet" | "deletePet" | "query" | "advice";
    description: string;
    data: AIEventData | PetFormData | QueryResult | AdviceData;
    metadata?: AIResponseMetadata;
    healthDisclaimer?: HealthDisclaimer;
}
```

**B. Ajouter types pour nouveaux request types**

```typescript
interface QueryResult {
    queryType: 'events' | 'pets' | 'statistics' | 'history';
    results: Event[] | Pet[] | any[];
    totalCount: number;
    filters?: {
        petIds?: string[];
        startDate?: string;
        endDate?: string;
        eventTypes?: string[];
    };
    summary?: string;
}

interface AdviceData {
    adviceType: 'nutrition' | 'health' | 'behavior' | 'general';
    question: string;
    answer: string;
    sources?: string[];
    relatedTopics?: string[];
    confidence: number;
}
```

### 1.3 Frontend - Composant HealthDisclaimer

**Nouveau fichier:** `/apps/web/src/components/AI/HealthDisclaimer.tsx`

```typescript
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

interface HealthDisclaimerProps {
    disclaimer: HealthDisclaimer;
    onAction: (action: string) => void;
}

const HealthDisclaimer: React.FC<HealthDisclaimerProps> = ({ disclaimer, onAction }) => {
    const severityStyles = {
        info: 'bg-blue-50 border-blue-300 text-blue-900 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-100',
        warning: 'bg-yellow-50 border-yellow-400 text-yellow-900 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-100',
        critical: 'bg-red-50 border-red-400 text-red-900 dark:bg-red-900/20 dark:border-red-700 dark:text-red-100',
    };

    const iconStyles = {
        info: 'text-blue-500',
        warning: 'text-yellow-500',
        critical: 'text-red-500',
    };

    return (
        <div className={`border-l-4 p-4 mb-4 rounded-r-lg ${severityStyles[disclaimer.severity]}`}>
            <div className="flex items-start gap-3">
                <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className={`mt-1 ${iconStyles[disclaimer.severity]}`}
                    size="lg"
                />
                <div className="flex-1">
                    <h4 className="font-bold text-sm mb-2">{disclaimer.title}</h4>
                    <p className="text-sm mb-3 leading-relaxed">{disclaimer.message}</p>

                    {disclaimer.autoMedicationWarning && (
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg mb-3 border border-red-300 dark:border-red-700">
                            <p className="text-xs font-semibold text-red-700 dark:text-red-300">
                                {disclaimer.autoMedicationWarning}
                            </p>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                        {disclaimer.actions.map((action, index) => (
                            <button
                                key={index}
                                onClick={() => onAction(action.action)}
                                className={`
                                    px-3 py-1.5 text-xs font-medium rounded-lg transition-colors
                                    ${action.type === 'primary'
                                        ? 'bg-primary text-white hover:bg-primary-dark'
                                        : action.type === 'danger'
                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                    }
                                `}
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthDisclaimer;
```

### 1.4 Frontend - Intégration dans AIMessageCard

**Fichier:** `/apps/web/src/pages/AIAssistant/components/AIMessageCard.tsx`

#### Modifications:

```typescript
import HealthDisclaimer from '../../../components/AI/HealthDisclaimer';

const AIMessageCard: React.FC<AIMessageCardProps> = ({
    message,
    aiResponse,
    onEventCreated,
}) => {
    // ... code existant ...

    const handleDisclaimerAction = (action: string) => {
        switch (action) {
            case 'findVet':
                // Ouvrir modal recherche vétérinaire (Phase 3)
                console.log('Finding vet...');
                break;
            case 'callEmergency':
                // Afficher numéros d'urgence vétérinaire
                window.open('tel:112', '_self');
                break;
            case 'dismiss':
                // Marquer comme lu (localStorage)
                break;
            default:
                break;
        }
    };

    return (
        <div className="flex gap-3 mb-4 items-start">
            {/* ... Icon ... */}

            <div className="flex-1 max-w-[85%]">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">

                    {/* ✨ NOUVEAU: Health Disclaimer */}
                    {aiResponse?.healthDisclaimer && (
                        <HealthDisclaimer
                            disclaimer={aiResponse.healthDisclaimer}
                            onAction={handleDisclaimerAction}
                        />
                    )}

                    {/* ... Reste du code existant ... */}
                </div>
            </div>
        </div>
    );
};
```

### 1.5 Tests Phase 1

**Tests Backend:**
```bash
# Test disclaimer médical
curl -X POST http://localhost:8000/api/ai \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Pablo a vomi ce matin, que faire ?"}'

# Expected: response avec healthDisclaimer.severity = 'warning'
```

**Tests Frontend:**
- Envoyer message "Luna a de la fièvre"
- Vérifier affichage HealthDisclaimer
- Tester actions (findVet, dismiss)

### 1.6 Checklist Phase 1

- [ ] Backend: Méthode `isMedicalContext()`
- [ ] Backend: Méthode `getHealthDisclaimer()`
- [ ] Backend: Enrichissement réponse avec métadonnées
- [ ] Frontend: Types `HealthDisclaimer`, `AIResponseMetadata`
- [ ] Frontend: Composant `HealthDisclaimer.tsx`
- [ ] Frontend: Intégration dans `AIMessageCard`
- [ ] Tests: Messages médicaux déclenchent disclaimer
- [ ] Tests: Actions disclaimer fonctionnent
- [ ] Documentation: Guide utilisation disclaimers

---

## 🟢 PHASE 2: Type Query - Requêtes & Consultation
**Durée:** 2 semaines
**Priorité:** P1 - HAUTE

### Objectifs
1. Implémenter requestType `query`
2. Créer endpoints backend de recherche
3. Composant d'affichage résultats de recherche
4. Gérer différents types de queries

### 2.1 Backend - Nouveaux Endpoints

**Nouveau fichier:** `/gaston-backend/app/Http/Controllers/QueryController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Pet;
use Carbon\Carbon;
use Illuminate\Http\Request;

class QueryController extends Controller
{
    public function events(Request $request)
    {
        $query = Event::query()
            ->with('pets')
            ->where('owner_id', auth()->id());

        // Filtrer par animal
        if ($request->has('petIds')) {
            $query->whereHas('pets', function ($q) use ($request) {
                $q->whereIn('pets.id', $request->petIds);
            });
        }

        // Filtrer par type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filtrer par période
        if ($request->has('startDate')) {
            $query->where('start_date', '>=', $request->startDate);
        }
        if ($request->has('endDate')) {
            $query->where('start_date', '<=', $request->endDate);
        }

        $results = $query->orderBy('start_date', 'desc')->get();

        return response()->json([
            'queryType' => 'events',
            'results' => $results,
            'totalCount' => $results->count(),
            'filters' => $request->only(['petIds', 'type', 'startDate', 'endDate']),
        ]);
    }

    public function statistics(Request $request)
    {
        $petId = $request->petId;
        $startDate = $request->startDate ?? now()->subMonths(6);
        $endDate = $request->endDate ?? now();

        $events = Event::query()
            ->whereHas('pets', fn($q) => $q->where('pets.id', $petId))
            ->whereBetween('start_date', [$startDate, $endDate])
            ->get();

        $stats = [
            'totalEvents' => $events->count(),
            'byType' => $events->groupBy('type')->map->count(),
            'upcomingEvents' => $events->where('start_date', '>', now())->count(),
            'completedEvents' => $events->where('is_done', true)->count(),
        ];

        return response()->json([
            'queryType' => 'statistics',
            'results' => $stats,
            'totalCount' => 1,
            'period' => [
                'start' => $startDate,
                'end' => $endDate,
            ],
        ]);
    }
}
```

**Routes:** `/gaston-backend/routes/api.php`

```php
Route::prefix('query')->middleware('auth:sanctum')->group(function () {
    Route::post('events', [QueryController::class, 'events']);
    Route::post('statistics', [QueryController::class, 'statistics']);
});
```

### 2.2 Backend - Amélioration ConsumeAiService

**Fichier:** `/gaston-backend/app/Services/ConsumeAiService.php`

#### Modifications:

**A. Ajouter type `query` dans validation**

```php
protected function validateResponse(array $response): bool
{
    // ... code existant ...

    $validTypes = [
        'createEvent', 'updateEvent', 'deleteEvent',
        'createPet', 'updatePet', 'deletePet',
        'query', 'advice' // ✨ NOUVEAU
    ];
    if (! in_array($response['requestType'], $validTypes)) {
        return false;
    }

    // ... reste du code ...
}
```

**B. Enrichir system prompt avec queries**

```php
protected function getSystemPrompt(): string
{
    // ... code existant ...

    $queryInstructions = [
        'Pour requestType "query"',
        '- Identifier le type de recherche demandée',
        '- Extraire les critères de filtrage',
        '- Déterminer la période concernée',
        '- Spécifier queryType: events | pets | statistics | history',
    ];

    $queryExamples = [
        'Quels sont les rendez-vous de Pablo cette semaine ?' => [
            'requestType' => 'query',
            'queryType' => 'events',
            'filters' => [
                'petIds' => [1],
                'type' => 'appointment',
                'startDate' => 'start_of_week',
                'endDate' => 'end_of_week',
            ],
        ],
        'Combien de fois Pablo a mangé ce mois-ci ?' => [
            'requestType' => 'query',
            'queryType' => 'statistics',
            'petId' => 1,
            'eventType' => 'feeding',
            'period' => 'current_month',
        ],
    ];

    // Ajouter au JSON du system prompt
    $schemaReponse['queryData'] = $this->getQueryStructure();

    // ... reste du code ...
}

protected function getQueryStructure(): array
{
    return [
        'queryType' => 'string - events | pets | statistics | history',
        'filters' => [
            'petIds' => 'array - IDs des animaux concernés',
            'type' => 'string - Type d\'événement (medical, feeding, etc.)',
            'startDate' => 'string - Date de début YYYY-MM-DD ou "start_of_week"',
            'endDate' => 'string - Date de fin YYYY-MM-DD ou "end_of_week"',
        ],
        'summary' => 'string - Résumé de ce qui est recherché',
    ];
}
```

### 2.3 Frontend - Composant QueryResults

**Nouveau fichier:** `/apps/web/src/components/AI/QueryResults.tsx`

```typescript
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faPaw, faChartLine, faHistory } from '@fortawesome/free-solid-svg-icons';

interface QueryResultsProps {
    queryResult: QueryResult;
}

const QueryResults: React.FC<QueryResultsProps> = ({ queryResult }) => {
    const { queryType, results, totalCount, summary } = queryResult;

    const getIcon = () => {
        switch (queryType) {
            case 'events': return faCalendar;
            case 'pets': return faPaw;
            case 'statistics': return faChartLine;
            case 'history': return faHistory;
            default: return faCalendar;
        }
    };

    const renderEvents = () => {
        if (!Array.isArray(results) || results.length === 0) {
            return (
                <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                    Aucun résultat trouvé
                </p>
            );
        }

        return (
            <div className="space-y-2">
                {results.map((event: Event, index: number) => (
                    <div
                        key={event.id || index}
                        className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h5 className="font-semibold text-sm text-gray-900 dark:text-white">
                                    {event.title}
                                </h5>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {new Date(event.start_date).toLocaleDateString('fr-FR', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                                {event.pets && event.pets.length > 0 && (
                                    <div className="flex gap-1 mt-2">
                                        {event.pets.map((pet: Pet) => (
                                            <span
                                                key={pet.id}
                                                className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full"
                                            >
                                                {pet.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <span className={`
                                text-xs px-2 py-1 rounded-full
                                ${event.type === 'medical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''}
                                ${event.type === 'feeding' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                                ${event.type === 'appointment' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}
                                ${event.type === 'other' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' : ''}
                            `}>
                                {event.type}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderStatistics = () => {
        if (typeof results !== 'object') return null;

        return (
            <div className="grid grid-cols-2 gap-3">
                {Object.entries(results).map(([key, value]) => (
                    <div
                        key={key}
                        className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {typeof value === 'object' ? JSON.stringify(value) : value}
                        </p>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 mt-3">
            <div className="flex items-center gap-2 mb-3">
                <FontAwesomeIcon
                    icon={getIcon()}
                    className="text-purple-600 dark:text-purple-400"
                />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                    Résultats de recherche
                </h4>
                <span className="ml-auto text-xs bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full">
                    {totalCount} résultat{totalCount > 1 ? 's' : ''}
                </span>
            </div>

            {summary && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 italic">
                    {summary}
                </p>
            )}

            {queryType === 'events' && renderEvents()}
            {queryType === 'statistics' && renderStatistics()}
        </div>
    );
};

export default QueryResults;
```

### 2.4 Frontend - Intégration dans AIMessageCard

**Fichier:** `/apps/web/src/pages/AIAssistant/components/AIMessageCard.tsx`

```typescript
import QueryResults from '../../../components/AI/QueryResults';

const AIMessageCard: React.FC<AIMessageCardProps> = ({
    message,
    aiResponse,
    onEventCreated,
}) => {
    // ... code existant ...

    // Déterminer le type de contenu à afficher
    const isQuery = aiResponse?.requestType === 'query';
    const isEvent = aiResponse?.requestType?.includes('Event');
    const isPet = aiResponse?.requestType?.includes('Pet');

    return (
        <div className="flex gap-3 mb-4 items-start">
            {/* ... Icon ... */}

            <div className="flex-1 max-w-[85%]">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">

                    {/* Health Disclaimer */}
                    {aiResponse?.healthDisclaimer && (
                        <HealthDisclaimer
                            disclaimer={aiResponse.healthDisclaimer}
                            onAction={handleDisclaimerAction}
                        />
                    )}

                    {/* Description */}
                    {!isStreaming && description && (
                        <p className="text-sm text-gray-900 dark:text-white leading-relaxed mb-3">
                            {description}
                        </p>
                    )}

                    {/* ✨ NOUVEAU: Query Results */}
                    {!isStreaming && isQuery && aiResponse?.data && (
                        <QueryResults queryResult={aiResponse.data as QueryResult} />
                    )}

                    {/* Event Preview/Edit (code existant) */}
                    {!isStreaming && isEvent && mode === "preview" && (
                        <>
                            <IntentHeader {...} />
                            <EventHeroSection {...} />
                            <SecondaryDetails {...} />
                            <ContextualActions {...} />
                        </>
                    )}

                    {/* ... reste du code ... */}
                </div>
            </div>
        </div>
    );
};
```

### 2.5 Tests Phase 2

**Tests Backend:**
```bash
# Test query événements
curl -X POST http://localhost:8000/api/query/events \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "petIds": [1],
    "type": "appointment",
    "startDate": "2025-01-01",
    "endDate": "2025-01-31"
  }'
```

**Tests Frontend:**
- Message: "Quels sont les rendez-vous de Pablo cette semaine ?"
- Vérifier affichage QueryResults
- Vérifier formatage dates

### 2.6 Checklist Phase 2

- [ ] Backend: Controller `QueryController`
- [ ] Backend: Routes `/api/query/events` et `/api/query/statistics`
- [ ] Backend: Amélioration system prompt pour queries
- [ ] Backend: Structure `queryData` dans prompt
- [ ] Frontend: Types `QueryResult`
- [ ] Frontend: Composant `QueryResults.tsx`
- [ ] Frontend: Intégration dans `AIMessageCard`
- [ ] Tests: Requêtes simples fonctionnent
- [ ] Tests: Statistiques calculées correctement
- [ ] Documentation: Exemples de queries supportées

---

## 🟡 PHASE 3: Type Advice - Conseils & Recommandations
**Durée:** 1-2 semaines
**Priorité:** P1 - HAUTE

### Objectifs
1. Implémenter requestType `advice`
2. Base de connaissance intégrée
3. Composant d'affichage conseils
4. Suggestions contextuelles

### 3.1 Backend - Base de Connaissance

**Nouveau fichier:** `/gaston-backend/app/Services/KnowledgeBaseService.php`

```php
<?php

namespace App\Services;

class KnowledgeBaseService
{
    protected array $nutritionKnowledge = [
        'dog' => [
            'daily_calories' => [
                'formula' => 'weight_kg * 30 + 70',
                'adjustments' => [
                    'puppy' => '* 2',
                    'senior' => '* 0.8',
                    'active' => '* 1.2',
                    'inactive' => '* 0.9',
                ],
            ],
            'toxic_foods' => [
                'chocolate', 'raisins', 'grapes', 'onions', 'garlic',
                'avocado', 'xylitol', 'caffeine', 'alcohol', 'macadamia nuts'
            ],
            'feeding_frequency' => [
                'puppy' => '3-4 times per day',
                'adult' => '2 times per day',
                'senior' => '2 times per day',
            ],
        ],
        'cat' => [
            'daily_calories' => [
                'formula' => 'weight_kg * 70',
                'adjustments' => [
                    'kitten' => '* 2.5',
                    'senior' => '* 0.8',
                    'active' => '* 1.1',
                    'inactive' => '* 0.8',
                ],
            ],
            'toxic_foods' => [
                'chocolate', 'onions', 'garlic', 'grapes', 'raisins',
                'milk', 'raw fish', 'raw eggs', 'caffeine', 'alcohol'
            ],
            'feeding_frequency' => [
                'kitten' => '4 times per day',
                'adult' => '2-3 times per day',
                'senior' => '2 times per day',
            ],
        ],
    ];

    public function getNutritionAdvice(string $species, float $weight, ?string $age = 'adult'): array
    {
        $knowledge = $this->nutritionKnowledge[$species] ?? $this->nutritionKnowledge['dog'];

        // Calculer calories quotidiennes
        $baseCalories = $weight * 30 + 70;
        $adjustment = $knowledge['daily_calories']['adjustments'][$age] ?? '* 1';
        eval("\$dailyCalories = $baseCalories $adjustment;");

        return [
            'adviceType' => 'nutrition',
            'species' => $species,
            'weight' => $weight,
            'age' => $age,
            'answer' => sprintf(
                "Pour un %s de %s kg en âge %s, l'apport calorique quotidien recommandé est d'environ %d calories. Répartissez cet apport sur %s.",
                $species === 'dog' ? 'chien' : 'chat',
                $weight,
                $age,
                round($dailyCalories),
                $knowledge['feeding_frequency'][$age]
            ),
            'dailyCalories' => round($dailyCalories),
            'feedingFrequency' => $knowledge['feeding_frequency'][$age],
            'toxicFoods' => $knowledge['toxic_foods'],
            'confidence' => 95,
        ];
    }

    public function getHealthAdvice(string $symptom): array
    {
        $commonSymptoms = [
            'vomit' => [
                'severity' => 'medium',
                'advice' => "Les vomissements occasionnels peuvent être normaux, mais surveillez votre animal. Si les vomissements persistent plus de 24h, contiennent du sang, ou sont accompagnés d'autres symptômes, consultez immédiatement un vétérinaire.",
                'redFlags' => ['sang', 'plus de 24h', 'léthargie', 'refus de boire'],
                'nextSteps' => [
                    'Retirer la nourriture pendant 12h',
                    'Proposer de l\'eau en petites quantités',
                    'Consulter un vétérinaire si persistance',
                ],
            ],
            'diarrhea' => [
                'severity' => 'medium',
                'advice' => "La diarrhée peut avoir plusieurs causes. Une diarrhée légère peut se résoudre en 24-48h. Si elle persiste, contient du sang, ou votre animal semble déshydraté, consultez un vétérinaire.",
                'redFlags' => ['sang', 'déshydratation', 'plus de 48h', 'fièvre'],
                'nextSteps' => [
                    'Maintenir une bonne hydratation',
                    'Diète légère (riz + poulet)',
                    'Consulter si persistance ou aggravation',
                ],
            ],
        ];

        $symptomKey = strtolower($symptom);
        $info = $commonSymptoms[$symptomKey] ?? null;

        if (!$info) {
            return [
                'adviceType' => 'health',
                'question' => "Symptôme: $symptom",
                'answer' => "Pour tout problème de santé, nous recommandons vivement de consulter un vétérinaire. Seul un professionnel peut établir un diagnostic précis.",
                'confidence' => 50,
                'severity' => 'unknown',
            ];
        }

        return [
            'adviceType' => 'health',
            'question' => "Symptôme: $symptom",
            'answer' => $info['advice'],
            'severity' => $info['severity'],
            'redFlags' => $info['redFlags'],
            'nextSteps' => $info['nextSteps'],
            'confidence' => 85,
        ];
    }
}
```

### 3.2 Backend - Intégration ConsumeAiService

**Fichier:** `/gaston-backend/app/Services/ConsumeAiService.php`

```php
public function __construct(protected KnowledgeBaseService $knowledgeBase)
{
}

protected function enrichAdviceWithKnowledge(array $response): array
{
    if ($response['requestType'] !== 'advice') {
        return $response;
    }

    $adviceType = $response['data']['adviceType'] ?? 'general';

    // Si c'est un conseil nutrition, enrichir avec calculs
    if ($adviceType === 'nutrition' && isset($response['data']['weight'])) {
        $species = $response['data']['species'] ?? 'dog';
        $weight = $response['data']['weight'];
        $age = $response['data']['age'] ?? 'adult';

        $enrichedAdvice = $this->knowledgeBase->getNutritionAdvice($species, $weight, $age);
        $response['data'] = array_merge($response['data'], $enrichedAdvice);
    }

    // Si c'est un conseil santé, enrichir avec infos symptômes
    if ($adviceType === 'health' && isset($response['data']['symptom'])) {
        $healthAdvice = $this->knowledgeBase->getHealthAdvice($response['data']['symptom']);
        $response['data'] = array_merge($response['data'], $healthAdvice);

        // Ajouter disclaimer santé automatiquement
        $response['healthDisclaimer'] = $this->getHealthDisclaimer();
    }

    return $response;
}

public function consumeAi(string $prompt): array
{
    try {
        $response = $this->callOpenAI($prompt);
        $parsed = $this->parseResponse($response);

        if (! $this->validateResponse($parsed)) {
            return $this->retryWithEnhancedPrompt($prompt);
        }

        $enriched = $this->enrichResponseWithMetadata($parsed, $prompt);

        // ✨ NOUVEAU: Enrichir advice avec knowledge base
        $enriched = $this->enrichAdviceWithKnowledge($enriched);

        return $enriched;

    } catch (Exception $e) {
        Log::error('AI Service Error', [...]);
        return $this->getFallbackResponse($prompt);
    }
}
```

### 3.3 Frontend - Composant AdviceCard

**Nouveau fichier:** `/apps/web/src/components/AI/AdviceCard.tsx`

```typescript
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

interface AdviceCardProps {
    advice: AdviceData;
}

const AdviceCard: React.FC<AdviceCardProps> = ({ advice }) => {
    const {
        adviceType,
        question,
        answer,
        dailyCalories,
        feedingFrequency,
        toxicFoods,
        redFlags,
        nextSteps,
        severity,
        confidence,
    } = advice;

    const getTypeIcon = () => {
        switch (adviceType) {
            case 'nutrition': return faLightbulb;
            case 'health': return faExclamationCircle;
            default: return faCheckCircle;
        }
    };

    const getSeverityColor = () => {
        switch (severity) {
            case 'high': return 'text-red-600 dark:text-red-400';
            case 'medium': return 'text-yellow-600 dark:text-yellow-400';
            case 'low': return 'text-green-600 dark:text-green-400';
            default: return 'text-blue-600 dark:text-blue-400';
        }
    };

    return (
        <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-4 mt-3">
            <div className="flex items-start gap-3 mb-3">
                <FontAwesomeIcon
                    icon={getTypeIcon()}
                    className={`mt-1 ${getSeverityColor()}`}
                    size="lg"
                />
                <div className="flex-1">
                    {question && (
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                            {question}
                        </h4>
                    )}
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {answer}
                    </p>
                </div>
                {confidence && (
                    <span className="text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded-full whitespace-nowrap">
                        {confidence}% confiance
                    </span>
                )}
            </div>

            {/* Nutrition specifics */}
            {adviceType === 'nutrition' && (
                <div className="grid grid-cols-2 gap-3 mb-3">
                    {dailyCalories && (
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                Calories quotidiennes
                            </p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                {dailyCalories} kcal
                            </p>
                        </div>
                    )}
                    {feedingFrequency && (
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                Fréquence
                            </p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {feedingFrequency}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {toxicFoods && toxicFoods.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg mb-3">
                    <p className="text-xs font-semibold text-red-800 dark:text-red-200 mb-2">
                        ⚠️ Aliments toxiques à éviter:
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {toxicFoods.map((food, index) => (
                            <span
                                key={index}
                                className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded"
                            >
                                {food}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Health specifics */}
            {redFlags && redFlags.length > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg mb-3">
                    <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                        🚩 Signes d'alerte:
                    </p>
                    <ul className="text-xs text-yellow-900 dark:text-yellow-100 space-y-1">
                        {redFlags.map((flag, index) => (
                            <li key={index} className="flex items-center gap-2">
                                <span className="w-1 h-1 bg-yellow-600 rounded-full"></span>
                                {flag}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {nextSteps && nextSteps.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-xs font-semibold text-blue-800 dark:text-blue-200 mb-2">
                        📋 Prochaines étapes:
                    </p>
                    <ol className="text-xs text-blue-900 dark:text-blue-100 space-y-1 list-decimal list-inside">
                        {nextSteps.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
            )}
        </div>
    );
};

export default AdviceCard;
```

### 3.4 Frontend - Intégration dans AIMessageCard

**Fichier:** `/apps/web/src/pages/AIAssistant/components/AIMessageCard.tsx`

```typescript
import AdviceCard from '../../../components/AI/AdviceCard';

const AIMessageCard: React.FC<AIMessageCardProps> = ({...}) => {
    const isAdvice = aiResponse?.requestType === 'advice';

    return (
        <div className="flex gap-3 mb-4 items-start">
            {/* ... */}
            <div className="flex-1 max-w-[85%]">
                <div className="...">

                    {/* Health Disclaimer */}
                    {aiResponse?.healthDisclaimer && <HealthDisclaimer {...} />}

                    {/* Description */}
                    {!isStreaming && description && <p>{description}</p>}

                    {/* ✨ NOUVEAU: Advice Card */}
                    {!isStreaming && isAdvice && aiResponse?.data && (
                        <AdviceCard advice={aiResponse.data as AdviceData} />
                    )}

                    {/* Query Results */}
                    {!isStreaming && isQuery && <QueryResults {...} />}

                    {/* Event Preview/Edit */}
                    {!isStreaming && isEvent && <EventHeroSection {...} />}

                </div>
            </div>
        </div>
    );
};
```

### 3.5 Tests Phase 3

**Messages à tester:**
1. "Quelle quantité de croquettes donner à Luna si elle pèse 4,5 kg ?"
2. "Mon chat perd beaucoup de poils, est-ce normal ?"
3. "Pablo a vomi ce matin, que faire ?"
4. "Liste des aliments toxiques pour un Golden Retriever"

### 3.6 Checklist Phase 3

- [ ] Backend: Service `KnowledgeBaseService`
- [ ] Backend: Base nutrition (dog, cat)
- [ ] Backend: Base santé (symptômes communs)
- [ ] Backend: Enrichissement advice dans `ConsumeAiService`
- [ ] Frontend: Types `AdviceData`
- [ ] Frontend: Composant `AdviceCard.tsx`
- [ ] Frontend: Intégration dans `AIMessageCard`
- [ ] Tests: Conseils nutrition précis
- [ ] Tests: Conseils santé + disclaimer
- [ ] Documentation: Types de conseils disponibles

---

## 🟣 PHASE 4: Metrics & Analytics
**Durée:** 2 semaines
**Priorité:** P2 - MOYENNE

### Objectifs
1. Modèle Weight/Metric pour suivi poids
2. Graphiques évolution
3. Alertes variations anormales
4. Intégration dans conseils nutrition

### 4.1 Backend - Migration & Modèle

**Migration:** `/gaston-backend/database/migrations/xxxx_create_metrics_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('metrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pet_id')->constrained()->onDelete('cascade');
            $table->string('metric_type'); // weight, temperature, heart_rate, etc.
            $table->decimal('value', 10, 2);
            $table->string('unit'); // kg, °C, bpm, etc.
            $table->date('measured_at');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['pet_id', 'metric_type', 'measured_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('metrics');
    }
};
```

**Modèle:** `/gaston-backend/app/Models/Metric.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Metric extends Model
{
    protected $fillable = [
        'pet_id',
        'metric_type',
        'value',
        'unit',
        'measured_at',
        'notes',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'measured_at' => 'date',
    ];

    public function pet(): BelongsTo
    {
        return $this->belongsTo(Pet::class);
    }
}
```

### 4.2 Backend - Endpoint Metrics

**Controller:** `/gaston-backend/app/Http/Controllers/MetricController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\Metric;
use App\Models\Pet;
use Illuminate\Http\Request;

class MetricController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'pet_id' => 'required|exists:pets,id',
            'metric_type' => 'required|in:weight,temperature,heart_rate',
            'value' => 'required|numeric',
            'unit' => 'required|string',
            'measured_at' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $metric = Metric::create($validated);

        return response()->json($metric, 201);
    }

    public function history(Request $request, int $petId)
    {
        $metricType = $request->input('metric_type', 'weight');
        $startDate = $request->input('start_date', now()->subMonths(6));
        $endDate = $request->input('end_date', now());

        $metrics = Metric::where('pet_id', $petId)
            ->where('metric_type', $metricType)
            ->whereBetween('measured_at', [$startDate, $endDate])
            ->orderBy('measured_at', 'asc')
            ->get();

        $analysis = $this->analyzeMetrics($metrics);

        return response()->json([
            'metrics' => $metrics,
            'analysis' => $analysis,
        ]);
    }

    protected function analyzeMetrics($metrics): array
    {
        if ($metrics->isEmpty()) {
            return [];
        }

        $values = $metrics->pluck('value')->toArray();
        $average = array_sum($values) / count($values);
        $min = min($values);
        $max = max($values);

        $firstValue = $values[0];
        $lastValue = end($values);
        $change = $lastValue - $firstValue;
        $changePercent = ($change / $firstValue) * 100;

        return [
            'average' => round($average, 2),
            'min' => $min,
            'max' => $max,
            'change' => round($change, 2),
            'changePercent' => round($changePercent, 2),
            'trend' => $changePercent > 5 ? 'increasing' : ($changePercent < -5 ? 'decreasing' : 'stable'),
        ];
    }
}
```

**Routes:**

```php
Route::prefix('metrics')->middleware('auth:sanctum')->group(function () {
    Route::post('/', [MetricController::class, 'store']);
    Route::get('/{petId}/history', [MetricController::class, 'history']);
});
```

### 4.3 Frontend - Graphique Évolution

**Nouveau fichier:** `/apps/web/src/components/AI/MetricsChart.tsx`

*Note: Installer recharts: `pnpm add recharts`*

```typescript
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricsChartProps {
    metrics: any[];
    analysis: any;
}

const MetricsChart: React.FC<MetricsChartProps> = ({ metrics, analysis }) => {
    const data = metrics.map(m => ({
        date: new Date(m.measured_at).toLocaleDateString('fr-FR'),
        value: parseFloat(m.value),
    }));

    const getTrendColor = () => {
        switch (analysis.trend) {
            case 'increasing': return 'text-red-600';
            case 'decreasing': return 'text-blue-600';
            default: return 'text-green-600';
        }
    };

    const getTrendIcon = () => {
        switch (analysis.trend) {
            case 'increasing': return '📈';
            case 'decreasing': return '📉';
            default: return '➡️';
        }
    };

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 mt-3">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                📊 Évolution du poids
            </h4>

            <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="bg-white dark:bg-gray-800 p-2 rounded-lg text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Moyenne</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {analysis.average} kg
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 rounded-lg text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Min</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {analysis.min} kg
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 rounded-lg text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Max</p>
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">
                        {analysis.max} kg
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 rounded-lg text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Évolution</p>
                    <p className={`text-lg font-bold ${getTrendColor()}`}>
                        {getTrendIcon()} {analysis.changePercent > 0 ? '+' : ''}{analysis.changePercent}%
                    </p>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10 }}
                        stroke="currentColor"
                    />
                    <YAxis
                        tick={{ fontSize: 10 }}
                        stroke="currentColor"
                        domain={['auto', 'auto']}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        dot={{ fill: '#8b5cf6', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MetricsChart;
```

### 4.4 Checklist Phase 4

- [ ] Backend: Migration `metrics` table
- [ ] Backend: Model `Metric.php`
- [ ] Backend: Controller `MetricController`
- [ ] Backend: Routes `/api/metrics/*`
- [ ] Backend: Analyse tendances
- [ ] Frontend: Install `recharts`
- [ ] Frontend: Composant `MetricsChart.tsx`
- [ ] Frontend: Intégration dans AIMessageCard
- [ ] Tests: Ajout poids fonctionne
- [ ] Tests: Historique calculé correctement
- [ ] Tests: Graphique s'affiche
- [ ] Documentation: API metrics

---

## 🔶 PHASE 5: Delete Operations & External Services
**Durée:** 1 semaine
**Priorité:** P2 - MOYENNE

### Objectifs
1. Implémenter `deleteEvent` et `deletePet`
2. Recherche vétérinaires à proximité (API externe)
3. Suggestions toiletteurs, pet-sitters

### 5.1 Backend - Delete Operations

**Fichier:** `/gaston-backend/app/Services/ConsumeAiService.php`

```php
protected function getSystemPrompt(): string
{
    // ... existing code ...

    $validTypes = [
        'createEvent', 'updateEvent', 'deleteEvent',
        'createPet', 'updatePet', 'deletePet',
        'query', 'advice'
    ];

    // Ajouter exemples delete
    $deleteExamples = [
        "Annuler le repas de Pablo de ce soir" => [
            'requestType' => 'deleteEvent',
            'data' => [
                'filters' => [
                    'petIds' => [1],
                    'type' => 'feeding',
                    'date' => 'today_evening',
                ],
            ],
        ],
        "Supprimer tous les rendez-vous de cette semaine" => [
            'requestType' => 'deleteEvent',
            'data' => [
                'filters' => [
                    'type' => 'appointment',
                    'startDate' => 'start_of_week',
                    'endDate' => 'end_of_week',
                ],
                'confirmationRequired' => true,
            ],
        ],
    ];

    // ... rest of code ...
}
```

**Controller:** `/gaston-backend/app/Http/Controllers/EventController.php` (ajouter)

```php
public function bulkDelete(Request $request)
{
    $validated = $request->validate([
        'filters' => 'required|array',
        'filters.petIds' => 'sometimes|array',
        'filters.type' => 'sometimes|string',
        'filters.startDate' => 'sometimes|date',
        'filters.endDate' => 'sometimes|date',
    ]);

    $query = Event::where('owner_id', auth()->id());

    if (isset($validated['filters']['petIds'])) {
        $query->whereHas('pets', fn($q) => $q->whereIn('pets.id', $validated['filters']['petIds']));
    }

    if (isset($validated['filters']['type'])) {
        $query->where('type', $validated['filters']['type']);
    }

    if (isset($validated['filters']['startDate'])) {
        $query->where('start_date', '>=', $validated['filters']['startDate']);
    }

    if (isset($validated['filters']['endDate'])) {
        $query->where('start_date', '<=', $validated['filters']['endDate']);
    }

    $eventsToDelete = $query->get();
    $count = $eventsToDelete->count();

    $query->delete();

    return response()->json([
        'message' => "$count événement(s) supprimé(s)",
        'count' => $count,
    ]);
}
```

### 5.2 Frontend - Confirmation Modal

**Nouveau fichier:** `/apps/web/src/components/AI/ConfirmationDialog.tsx`

```typescript
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

interface ConfirmationDialogProps {
    title: string;
    message: string;
    itemsToDelete?: string[];
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    title,
    message,
    itemsToDelete,
    onConfirm,
    onCancel,
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                <div className="flex items-start gap-3 mb-4">
                    <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className="text-yellow-500 mt-1"
                        size="lg"
                    />
                    <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {message}
                        </p>
                    </div>
                </div>

                {itemsToDelete && itemsToDelete.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 mb-4">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Éléments concernés:
                        </p>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 max-h-32 overflow-y-auto">
                            {itemsToDelete.map((item, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Confirmer la suppression
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;
```

### 5.3 Checklist Phase 5

- [ ] Backend: `deleteEvent` et `deletePet` dans system prompt
- [ ] Backend: Route bulk delete
- [ ] Backend: Validation filters
- [ ] Frontend: Composant `ConfirmationDialog`
- [ ] Frontend: Gestion deleteEvent dans AIMessageCard
- [ ] Tests: Suppression simple
- [ ] Tests: Suppression multiple avec confirmation
- [ ] Documentation: API delete

---

## 📈 CALENDRIER DE DÉPLOIEMENT

| Phase | Semaines | Dates estimées | Livrable |
|-------|----------|----------------|----------|
| **Phase 1** | Semaines 1-2 | S1-S2 | Disclaimers santé opérationnels |
| **Phase 2** | Semaines 3-4 | S3-S4 | Type `query` fonctionnel |
| **Phase 3** | Semaines 5-6 | S5-S6 | Type `advice` avec knowledge base |
| **Phase 4** | Semaines 7-8 | S7-S8 | Metrics & graphiques poids |
| **Phase 5** | Semaine 9 | S9 | Delete operations |

---

## ✅ CRITÈRES DE SUCCÈS

### Phase 1
- ✅ 100% des messages médicaux déclenchent un disclaimer
- ✅ Disclaimer affiché avant la création d'événement médical
- ✅ Actions "Trouver un vétérinaire" et "Dismiss" fonctionnent
- ✅ 0 événement médical créé sans avertissement

### Phase 2
- ✅ Requêtes "Quels sont les rendez-vous de X cette semaine ?" retournent résultats
- ✅ Statistiques calculées correctement (count, byType, etc.)
- ✅ Affichage liste événements avec formatting dates
- ✅ >80% reconnaissance correcte requêtes query

### Phase 3
- ✅ Conseils nutrition précis (calories, fréquence, aliments toxiques)
- ✅ Conseils santé + disclaimer automatique
- ✅ Confiance >85% pour conseils basés sur knowledge base
- ✅ Fallback gracieux pour conseils inconnus

### Phase 4
- ✅ Ajout poids via AI fonctionne
- ✅ Graphique évolution s'affiche correctement
- ✅ Analyse tendances précise (stable, increasing, decreasing)
- ✅ Alertes variations anormales (>10% en 1 mois)

### Phase 5
- ✅ Suppression événements simples sans confirmation
- ✅ Suppression multiple avec confirmation obligatoire
- ✅ Nombre d'éléments affichés avant suppression
- ✅ 0 suppression accidentelle

---

## 📚 DOCUMENTATION À PRODUIRE

### Par Phase

**Phase 1:**
- Guide disclaimers santé (trigger, customisation)
- API documentation (metadata, healthDisclaimer)
- Composant HealthDisclaimer (props, actions)

**Phase 2:**
- API endpoints query (events, statistics)
- Exemples requêtes supportées
- Composant QueryResults (queryTypes)

**Phase 3:**
- Knowledge base nutrition (formules, toxic foods)
- Knowledge base santé (symptômes, severity)
- Composant AdviceCard (adviceTypes)

**Phase 4:**
- API metrics (POST /metrics, GET /:petId/history)
- Analyse tendances (formules, alertes)
- Composant MetricsChart (recharts config)

**Phase 5:**
- API delete (bulkDelete, filters)
- Composant ConfirmationDialog (usage)

---

## 🔧 MAINTENANCE & ÉVOLUTION

### Post-Déploiement

1. **Monitoring:**
   - Taux de succès AI par requestType
   - Temps de réponse backend
   - Erreurs fréquentes

2. **Amélioration Continue:**
   - Enrichir knowledge base selon feedback utilisateur
   - Ajouter patterns variés dans few-shot examples
   - Optimiser prompts selon taux reconnaissance

3. **Évolutions Futures:**
   - Phase 6: User Organization (notes, exports)
   - Phase 7: Global Overview (multi-animaux)
   - Phase 8: Advanced AI (context awareness, conversations)

---

**Document Status:** Ready for Implementation
**Prochaine révision:** Après Phase 1
**Contact:** Équipe Produit GastonApp