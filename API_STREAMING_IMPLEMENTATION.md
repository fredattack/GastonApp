# API Streaming Implementation Guide

## Vue d'ensemble

Ce document décrit l'implémentation nécessaire côté backend (Laravel) pour supporter le streaming des réponses AI dans l'interface conversationnelle.

## État Actuel

### ✅ Ce qui fonctionne déjà

**Endpoint existant : `POST /api/v1-0-0/ai`**

```json
Request:
{
  "prompt": "Pablo doit manger 365gr de barf demain matin",
  "filters": {}
}

Response:
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

✅ **Fallback automatique** : Le frontend utilise cet endpoint et simule le streaming visuellement.

---

## 🚀 Implémentation du Streaming (Optionnel mais Recommandé)

### Nouvel endpoint : `POST /api/v1-0-0/ai/stream`

#### 1. Route Laravel

```php
// routes/api.php
Route::post('/v1-0-0/ai/stream', [AIController::class, 'stream'])->name('ai.stream');
```

#### 2. Controller

```php
<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Controller;

class AIController extends Controller
{
    /**
     * Stream AI response avec Server-Sent Events
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function stream(Request $request)
    {
        $messages = $request->input('messages', []);

        // Validation
        if (empty($messages)) {
            return response()->json(['error' => 'Messages required'], 400);
        }

        return response()->stream(
            function () use ($messages) {
                // Configuration OpenAI
                $apiKey = config('services.openai.key');
                $model = config('services.openai.model', 'gpt-4');

                // Préparer le contexte système
                $systemMessage = [
                    'role' => 'system',
                    'content' => $this->getSystemPrompt()
                ];

                // Combiner avec les messages utilisateur
                $allMessages = array_merge([$systemMessage], $messages);

                try {
                    // Appel à OpenAI avec streaming
                    $response = Http::withHeaders([
                        'Authorization' => 'Bearer ' . $apiKey,
                        'Content-Type' => 'application/json',
                    ])
                    ->timeout(60)
                    ->withOptions(['stream' => true])
                    ->post('https://api.openai.com/v1/chat/completions', [
                        'model' => $model,
                        'messages' => $allMessages,
                        'stream' => true,
                        'temperature' => 0.7,
                    ]);

                    // Stream les chunks au client
                    $fullContent = '';

                    foreach ($response->body() as $chunk) {
                        $lines = explode("\n", $chunk);

                        foreach ($lines as $line) {
                            if (strpos($line, 'data: ') === 0) {
                                $data = substr($line, 6);

                                if ($data === '[DONE]') {
                                    continue;
                                }

                                try {
                                    $decoded = json_decode($data, true);

                                    if (isset($decoded['choices'][0]['delta']['content'])) {
                                        $content = $decoded['choices'][0]['delta']['content'];
                                        $fullContent .= $content;

                                        // Envoyer le chunk au client
                                        echo "data: " . json_encode([
                                            'chunk' => $content,
                                            'done' => false
                                        ]) . "\n\n";

                                        ob_flush();
                                        flush();
                                    }
                                } catch (\Exception $e) {
                                    \Log::error('Stream parsing error: ' . $e->getMessage());
                                }
                            }
                        }
                    }

                    // Analyser le contenu complet pour générer la réponse structurée
                    $finalResponse = $this->parseAIResponse($fullContent);

                    // Envoyer la réponse finale
                    echo "data: " . json_encode([
                        'chunk' => '',
                        'done' => true,
                        'response' => $finalResponse
                    ]) . "\n\n";

                    ob_flush();
                    flush();

                } catch (\Exception $e) {
                    \Log::error('AI Streaming error: ' . $e->getMessage());

                    echo "data: " . json_encode([
                        'error' => $e->getMessage(),
                        'done' => true
                    ]) . "\n\n";

                    ob_flush();
                    flush();
                }
            },
            200,
            [
                'Content-Type' => 'text/event-stream',
                'Cache-Control' => 'no-cache',
                'X-Accel-Buffering' => 'no',
                'Connection' => 'keep-alive',
            ]
        );
    }

    /**
     * Parse la réponse AI pour extraire les données structurées
     */
    private function parseAIResponse(string $content): array
    {
        // Réutiliser la logique existante de l'endpoint /ai
        // Pour parser le contenu et extraire les données structurées

        // Exemple simplifié
        return [
            'score' => 95,
            'requestType' => 'createEvent',
            'description' => $content,
            'data' => $this->extractEventData($content)
        ];
    }

    /**
     * Extraire les données d'événement du contenu
     */
    private function extractEventData(string $content): array
    {
        // Logique pour extraire les données structurées
        // À adapter selon votre implémentation actuelle

        return [
            'title' => '',
            'type' => 'feeding',
            'petId' => [],
            'start_date' => now()->addDay()->format('Y-m-d H:i:s'),
            'end_date' => null,
            'is_recurring' => false,
            'is_full_day' => false,
            'pets' => [],
            'notes' => ''
        ];
    }

    /**
     * Prompt système pour l'IA
     */
    private function getSystemPrompt(): string
    {
        return "Tu es un assistant pour la gestion d'animaux de compagnie.
        Tu aides à créer des événements (repas, soins vétérinaires, etc.)
        en analysant les demandes en langage naturel.

        Réponds de manière naturelle et conversationnelle.

        Les types d'événements possibles sont :
        - feeding (alimentation)
        - medical (soins médicaux)
        - appointment (rendez-vous)
        - training (dressage)
        - social (socialisation)";
    }
}
```

#### 3. Configuration

```php
// config/services.php
return [
    // ...
    'openai' => [
        'key' => env('OPENAI_API_KEY'),
        'model' => env('OPENAI_MODEL', 'gpt-4'),
    ],
];
```

```env
# .env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4
```

---

## 🔄 Alternative : Améliorer l'endpoint existant

Si tu ne veux pas implémenter le streaming immédiatement, tu peux améliorer l'endpoint existant pour supporter le contexte multi-tour :

```php
/**
 * POST /api/v1-0-0/ai
 * Support pour contexte conversationnel
 */
public function analyze(Request $request)
{
    $validated = $request->validate([
        'prompt' => 'required_without:messages|string',
        'messages' => 'required_without:prompt|array',
        'messages.*.role' => 'required_with:messages|in:user,assistant,system',
        'messages.*.content' => 'required_with:messages|string',
        'filters' => 'array',
    ]);

    // Si messages (nouveau format multi-tour)
    if (isset($validated['messages'])) {
        $messages = $validated['messages'];
        $lastUserMessage = collect($messages)
            ->reverse()
            ->firstWhere('role', 'user');

        $prompt = $lastUserMessage['content'] ?? '';
    } else {
        // Format legacy (simple prompt)
        $prompt = $validated['prompt'];
        $messages = [
            ['role' => 'user', 'content' => $prompt]
        ];
    }

    // Votre logique existante...
    $response = $this->callOpenAI($messages);

    return response()->json($response);
}
```

---

## 📊 Comparaison des Options

### Option 1 : Garder le système actuel (Fallback uniquement)

**Avantages** :
- ✅ Aucune modification nécessaire
- ✅ Fonctionne déjà bien
- ✅ Simulation de streaming côté frontend

**Inconvénients** :
- ❌ Pas de vrai streaming (attente complète de la réponse)
- ❌ Latence perçue plus élevée
- ❌ Pas de contexte multi-tour

### Option 2 : Endpoint amélioré (sans streaming)

**Avantages** :
- ✅ Support du contexte multi-tour
- ✅ Conversations plus intelligentes
- ✅ Modification minimale

**Inconvénients** :
- ❌ Pas de vrai streaming
- ❌ Attente complète de la réponse

### Option 3 : Streaming complet (Recommandé)

**Avantages** :
- ✅ Expérience utilisateur optimale
- ✅ Feedback en temps réel
- ✅ Contexte multi-tour
- ✅ Perception de rapidité

**Inconvénients** :
- ⚠️ Implémentation plus complexe
- ⚠️ Nécessite des tests

---

## 🧪 Tests

### Test manuel du streaming

```bash
# Test avec curl
curl -X POST http://localhost:3008/api/v1-0-0/ai/stream \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Pablo doit manger 365gr de barf demain matin"
      }
    ]
  }'
```

### Test avec le frontend

1. Ouvrir l'application : `http://localhost:4481/ai-assistant`
2. Envoyer un message
3. Observer dans la console :
   - ✅ Si streaming OK : Pas de warning
   - ⚠️ Si fallback : "Streaming endpoint not available, falling back to regular API"

---

## 📝 Recommandations

### Court terme (Option 2)
1. Modifier l'endpoint `/ai` pour supporter `messages[]`
2. Garder le fallback actuel
3. Améliorer le contexte conversationnel

### Long terme (Option 3)
1. Implémenter `/ai/stream`
2. Tester avec des conversations réelles
3. Monitorer les performances
4. Optimiser si nécessaire

---

## 🔐 Sécurité

```php
// Middleware pour limiter le rate limiting
Route::middleware(['throttle:ai'])->group(function () {
    Route::post('/ai', [AIController::class, 'analyze']);
    Route::post('/ai/stream', [AIController::class, 'stream']);
});

// config/throttle.php
'ai' => [
    'max_attempts' => 20, // 20 requêtes
    'decay_minutes' => 1, // par minute
],
```

---

## 💰 Considérations de Coût

- Streaming = Même coût qu'une requête normale
- Avantage : Meilleure UX sans surcoût
- Monitorer l'utilisation de tokens OpenAI

---

## 🐛 Debugging

```php
// Log des requêtes AI
\Log::channel('ai')->info('AI Request', [
    'messages' => $messages,
    'user_id' => auth()->id(),
]);

// Log des réponses
\Log::channel('ai')->info('AI Response', [
    'response' => $response,
    'duration' => $duration,
]);
```

---

## ✅ Checklist de Déploiement

- [ ] Endpoint `/ai/stream` implémenté
- [ ] Tests unitaires écrits
- [ ] Tests d'intégration passants
- [ ] Rate limiting configuré
- [ ] Logging activé
- [ ] Variables d'environnement configurées
- [ ] Documentation à jour
- [ ] Frontend testé avec vrai streaming
- [ ] Monitoring activé

---

## 📞 Support

En cas de problème :
1. Vérifier les logs Laravel : `storage/logs/laravel.log`
2. Vérifier la console browser : Network tab
3. Tester avec curl directement
4. Vérifier la clé OpenAI

