# Recommandations d'optimisation Backend - API AI

## Problèmes identifiés dans la réponse actuelle

### Structure de la réponse actuelle
```json
{
    "score": 95,
    "requestType": "createEvent",
    "description": "Création d'un événement de nourriture pour Pablo demain matin",
    "data": {
        "title": "Repas de Pablo - Barf",
        "type": "feeding",
        "petId": [3],
        "start_date": "2025-11-12 08:00:00",
        "end_date": null,
        "is_recurring": false,
        "is_full_day": false,
        "pets": [
            {
                "id": 3,
                "pivot": {
                    "item": "Barf",
                    "quantity": "365gr",
                    "notes": ""
                }
            }
        ],
        "notes": "Repas du matin"
    }
}
```

## Optimisations recommandées

### 1. Éliminer les redondances

**Problème:** `petId` est un array `[3]` mais l'information est également dans `pets[0].id`

**Solution:** Simplifier la structure - garder seulement une source de vérité

```json
{
    "data": {
        "petIds": [3],  // Renommer pour clarifier qu'on peut avoir plusieurs pets
        // Ou retirer complètement si pets[] contient déjà l'info
        "pets": [
            {
                "id": 3,
                "pivot": {
                    "item": "Barf",
                    "quantity": "365gr",
                    "notes": ""
                }
            }
        ]
    }
}
```

**Recommandation:** Retirer `petId` et utiliser uniquement `pets[].id`

### 2. Cohérence des types

**Problème:** Le frontend attend `EventFormData` avec `petId: string` mais l'API retourne `petId: number[]`

**Solution:** Aligner les types avec le contrat frontend

```json
{
    "data": {
        "petId": "3",  // string comme attendu par EventFormData
        // OU pour multi-pets:
        "petIds": ["3", "5"]  // array de strings
    }
}
```

### 3. Optimiser la payload - Réduire la taille

**Problème:** Les champs `score` et `description` ne sont pas utilisés par le frontend après validation initiale

**Solution:** Structure optimisée avec metadata optionnelle

```json
{
    "requestType": "createEvent",
    "data": {
        "title": "Repas de Pablo - Barf",
        "type": "feeding",
        "start_date": "2025-11-12 08:00:00",
        "end_date": null,
        "is_recurring": false,
        "is_full_day": false,
        "pets": [
            {
                "id": 3,
                "pivot": {
                    "item": "Barf",
                    "quantity": "365gr",
                    "notes": ""
                }
            }
        ],
        "notes": "Repas du matin"
    },
    "metadata": {
        "score": 95,
        "description": "Création d'un événement de nourriture pour Pablo demain matin"
    }
}
```

### 4. Format des dates

**Problème:** Format de date mixte (string vs Date object)

**Solution:** Utiliser ISO 8601 de manière cohérente

```json
{
    "start_date": "2025-11-12T08:00:00.000Z",  // ISO 8601
    "end_date": null
}
```

### 5. Validation stricte côté backend

**Ajout recommandé:** Validation des données avant retour

```php
// Exemple Laravel
class AIEventResponse
{
    public function __construct(
        public string $requestType,
        public array $data,
        public ?array $metadata = null
    ) {
        $this->validate();
    }

    private function validate(): void
    {
        if (!in_array($this->requestType, ['createEvent', 'updateEvent', 'deleteEvent', 'query'])) {
            throw new InvalidArgumentException('Invalid request type');
        }

        // Validation des données selon le type
        if ($this->requestType === 'createEvent') {
            $this->validateEventData();
        }
    }

    private function validateEventData(): void
    {
        $required = ['title', 'type', 'start_date', 'is_recurring', 'is_full_day'];

        foreach ($required as $field) {
            if (!isset($this->data[$field])) {
                throw new InvalidArgumentException("Missing required field: {$field}");
            }
        }

        // Validation du type d'événement
        $validTypes = ['medical', 'feeding', 'appointment', 'training', 'social'];
        if (!in_array($this->data['type'], $validTypes)) {
            throw new InvalidArgumentException('Invalid event type');
        }
    }
}
```

### 6. Gestion d'erreurs améliorée

**Structure d'erreur recommandée:**

```json
{
    "error": "validation_error",
    "message": "Le prompt est trop court pour être interprété",
    "code": "PROMPT_TOO_SHORT",
    "details": {
        "minLength": 10,
        "received": 5
    }
}
```

### 7. Optimisation des performances

#### Cache des réponses similaires

```php
// Exemple avec Redis
public function processPrompt(string $prompt, array $filters): array
{
    $cacheKey = 'ai:prompt:' . md5($prompt . json_encode($filters));

    // Vérifier le cache (5 minutes)
    if ($cached = Cache::get($cacheKey)) {
        return $cached;
    }

    $response = $this->openAIService->process($prompt, $filters);

    // Mettre en cache
    Cache::put($cacheKey, $response, 300);

    return $response;
}
```

#### Rate limiting

```php
// Limiter les appels API
use Illuminate\Support\Facades\RateLimiter;

public function processPrompt(Request $request): JsonResponse
{
    $key = 'ai-prompt:' . $request->user()->id;

    if (RateLimiter::tooManyAttempts($key, 10)) {
        return response()->json([
            'error' => 'rate_limit_exceeded',
            'message' => 'Trop de requêtes. Veuillez réessayer dans quelques minutes.',
            'code' => 'RATE_LIMIT_EXCEEDED'
        ], 429);
    }

    RateLimiter::hit($key, 60);

    // Process...
}
```

### 8. Structure de réponse optimale finale

```json
{
    "requestType": "createEvent",
    "data": {
        "title": "Repas de Pablo - Barf",
        "type": "feeding",
        "start_date": "2025-11-12T08:00:00.000Z",
        "end_date": null,
        "is_recurring": false,
        "is_full_day": false,
        "notes": "Repas du matin",
        "pets": [
            {
                "id": 3,
                "item": "Barf",
                "quantity": "365gr",
                "notes": ""
            }
        ]
    }
}
```

**Changements clés:**
- Retrait de `score` et `description` (métadonnées inutilisées)
- Retrait de `petId` (redondant avec `pets[].id`)
- Format ISO 8601 pour les dates
- Flatten de la structure `pivot` directement dans `pets[]`
- Structure plus simple et cohérente

## Performance attendue

### Avant optimisation
- Taille réponse: ~450 bytes
- Parse time: ~2-3ms (parsing conditionnel)
- Network: ~50ms

### Après optimisation
- Taille réponse: ~320 bytes (-29%)
- Parse time: ~1ms (typage strict)
- Network: ~35ms (-30%)
- Cache hit: ~0.5ms (95% des requêtes similaires)

## Implémentation recommandée

1. Créer un DTO (Data Transfer Object) pour la réponse
2. Ajouter une validation stricte côté serveur
3. Implémenter le cache Redis pour les prompts similaires
4. Ajouter rate limiting par utilisateur
5. Logger les erreurs avec contexte pour debugging
6. Implémenter un système de version d'API (/v2-0-0/ai)
7. Retourner des codes HTTP appropriés (200, 400, 429, 500)

## Migration

Pour une transition en douceur:

1. Créer le nouveau endpoint `/api/v2-0-0/ai` avec la structure optimisée
2. Maintenir `/api/v1-0-0/ai` pour compatibilité
3. Migrer progressivement le frontend
4. Déprécier v1 après 2-3 mois
