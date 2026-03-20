# Plan de Mise à Jour Backend - GastonApp

**Date:** 16 Novembre 2025
**Version:** 1.0
**Contexte:** Mise à jour du backend Laravel pour supporter les nouvelles fonctionnalités du calendrier frontend

---

## Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Nouvelles Fonctionnalités](#nouvelles-fonctionnalités)
3. [Modifications API](#modifications-api)
4. [Schéma Base de Données](#schéma-base-de-données)
5. [Endpoints à Créer/Modifier](#endpoints-à-créermodifier)
6. [Gestion des Événements Récurrents](#gestion-des-événements-récurrents)
7. [Sécurité](#sécurité)
8. [Tests](#tests)
9. [Déploiement](#déploiement)

---

## Vue d'ensemble

Le frontend a été enrichi avec de nouvelles fonctionnalités de calendrier nécessitant des modifications backend :

### Fonctionnalités Ajoutées au Frontend

1. ✅ **Drag & Drop** - Déplacer des événements entre créneaux horaires
2. ✅ **Resize** - Modifier la durée d'un événement
3. ✅ **Édition Événements Récurrents** - Choisir entre éditer "cet événement" ou "toute la série"
4. ✅ **Vues Calendrier** - Jour, Semaine, Mois avec timeline

### Impact Backend Requis

- ⚠️ Gestion scope d'édition/suppression (`single` vs `series`)
- ⚠️ Validation des conflits d'événements
- ⚠️ Endpoints de mise à jour optimisés

---

## Nouvelles Fonctionnalités

### 1. Drag & Drop (Déplacement d'événements)

**Besoin:**
Lorsqu'un utilisateur glisse-dépose un événement dans un nouveau créneau, le frontend appelle `PUT /events/{id}` avec la nouvelle `start_date`.

**Ce qui existe déjà:**
```php
// EventController@update
public function update(Request $request, $id)
{
    $event = Event::findOrFail($id);
    $event->update($request->all());
    return response()->json($event);
}
```

**Amélioration requise:**
```php
public function update(Request $request, $id)
{
    $event = Event::findOrFail($id);

    // Vérifier la propriété
    if ($event->owner_id !== auth()->id()) {
        abort(403, 'Non autorisé');
    }

    $validated = $request->validate([
        'start_date' => 'sometimes|date',
        'end_date' => 'sometimes|date|after:start_date',
        'scope' => 'sometimes|in:single,series', // NOUVEAU
        // ... autres champs
    ]);

    // Si c'est un événement récurrent et scope = 'series'
    if ($request->scope === 'series' && $event->is_recurring && $event->master_id) {
        return $this->updateRecurringSeries($event->master_id, $validated);
    }

    // Sinon mise à jour normale
    $event->update($validated);

    return response()->json($event->load('pets'));
}
```

---

### 2. Resize (Modification de durée)

**Besoin:**
Modifier la `end_date` d'un événement en tirant le bas de la carte événement.

**Frontend envoie:**
```json
PUT /events/{id}
{
    "end_date": "2025-11-16T16:00:00.000Z",
    "scope": "single" // ou "series"
}
```

**Backend:**
Utilise le même endpoint `update` ci-dessus avec validation `after:start_date`.

---

### 3. Événements Récurrents - Édition Scope

**Besoin:**
Permettre d'éditer/supprimer soit:
- **"Cet événement uniquement"** (`scope: single`)
- **"Tous les événements de la série"** (`scope: series`)

#### A. Édition d'un événement unique dans une série

**Frontend envoie:**
```json
PUT /events/{occurrence_id}
{
    "title": "Nouveau titre",
    "scope": "single"
}
```

**Backend doit:**
1. Créer une **exception** pour cette occurrence
2. Marquer l'occurrence comme `is_exception: true`
3. Ne pas propager aux autres occurrences

**Code suggéré:**
```php
protected function updateSingleOccurrence($event, $data)
{
    // Si l'événement fait partie d'une série mais n'est pas le master
    if ($event->master_id && !$event->is_master) {
        // Créer une exception
        $event->is_exception = true;
        $event->update($data);
    } else {
        // Simple mise à jour
        $event->update($data);
    }

    return $event;
}
```

#### B. Édition de toute la série

**Frontend envoie:**
```json
PUT /events/{any_occurrence_id}
{
    "title": "Nouveau titre pour tous",
    "scope": "series"
}
```

**Backend doit:**
1. Trouver le `master_id`
2. Mettre à jour le master
3. Mettre à jour toutes les occurrences **sauf les exceptions**

**Code suggéré:**
```php
protected function updateRecurringSeries($masterId, $data)
{
    $master = Event::where('id', $masterId)
        ->where('is_master', true)
        ->firstOrFail();

    // Mise à jour du master
    $master->update($data);

    // Mise à jour des occurrences non-exceptionnelles
    Event::where('master_id', $masterId)
        ->where('is_exception', false)
        ->update($data);

    return $master;
}
```

---

### 4. Suppression d'événements récurrents

#### A. Supprimer une occurrence unique

**Frontend envoie:**
```json
DELETE /events/{occurrence_id}?scope=single
```

**Backend:**
```php
public function destroy(Request $request, $id)
{
    $event = Event::findOrFail($id);

    // Vérifier la propriété
    if ($event->owner_id !== auth()->id()) {
        abort(403);
    }

    $scope = $request->query('scope', 'single');

    if ($scope === 'series' && $event->master_id) {
        return $this->deleteRecurringSeries($event->master_id);
    }

    // Suppression simple ou soft delete
    $event->delete();

    return response()->json(['message' => 'Événement supprimé']);
}

protected function deleteRecurringSeries($masterId)
{
    $master = Event::where('id', $masterId)
        ->where('is_master', true)
        ->firstOrFail();

    // Supprimer toutes les occurrences
    Event::where('master_id', $masterId)->delete();

    // Supprimer le master
    $master->delete();

    return response()->json(['message' => 'Série supprimée']);
}
```

---

## Schéma Base de Données

### Modifications Table `events`

**Colonnes à ajouter:**

```sql
ALTER TABLE events
ADD COLUMN is_master BOOLEAN DEFAULT FALSE COMMENT 'True si c''est l''événement master d''une série',
ADD COLUMN is_exception BOOLEAN DEFAULT FALSE COMMENT 'True si cette occurrence a été modifiée individuellement',
ADD INDEX idx_master_id (master_id),
ADD INDEX idx_is_master (is_master);
```

**Structure finale:**

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | bigint | ID unique |
| `master_id` | bigint nullable | ID du master si récurrent |
| `owner_id` | bigint | ID propriétaire |
| `type` | varchar | medical, feeding, etc. |
| `title` | varchar | Titre |
| `start_date` | datetime | Date début |
| `end_date` | datetime nullable | Date fin |
| `is_recurring` | boolean | Est récurrent? |
| `is_master` | boolean | **NOUVEAU** - Est le master? |
| `is_exception` | boolean | **NOUVEAU** - Est une exception? |
| `is_done` | boolean | Terminé? |
| `is_full_day` | boolean | Toute la journée? |
| `recurrence` | json | Config récurrence |
| `notes` | text | Notes |
| `created_at` | timestamp | Créé le |
| `updated_at` | timestamp | Modifié le |
| `deleted_at` | timestamp nullable | Supprimé le (soft delete) |

---

## Endpoints à Créer/Modifier

### 1. GET /events

**Existant:**
```php
GET /events?start_date=2025-11-01&end_date=2025-11-30
```

**Modification requise:**
Retourner les événements **développés** (expanded) si récurrents.

**Avant:**
```json
[
    {
        "id": 1,
        "title": "Repas Pablo",
        "is_recurring": true,
        "recurrence": {
            "frequency_type": "daily",
            "frequency": 1
        }
    }
]
```

**Après (développé):**
```json
[
    {
        "id": 1,
        "master_id": 1,
        "title": "Repas Pablo",
        "start_date": "2025-11-16T08:00:00Z",
        "is_recurring": true
    },
    {
        "id": 2,
        "master_id": 1,
        "title": "Repas Pablo",
        "start_date": "2025-11-17T08:00:00Z",
        "is_recurring": true
    },
    // ... occurrences suivantes
]
```

**Code suggéré:**
```php
public function index(Request $request)
{
    $startDate = $request->query('start_date');
    $endDate = $request->query('end_date');

    $events = Event::where('owner_id', auth()->id())
        ->where(function ($query) use ($startDate, $endDate) {
            $query->whereBetween('start_date', [$startDate, $endDate])
                  ->orWhere('is_master', true); // Inclure les masters récurrents
        })
        ->with('pets')
        ->get();

    // Développer les événements récurrents
    $expanded = $this->expandRecurringEvents($events, $startDate, $endDate);

    return response()->json($expanded);
}

protected function expandRecurringEvents($events, $startDate, $endDate)
{
    $result = [];

    foreach ($events as $event) {
        if ($event->is_master && $event->is_recurring) {
            // Générer les occurrences entre startDate et endDate
            $occurrences = $this->generateOccurrences($event, $startDate, $endDate);
            $result = array_merge($result, $occurrences);
        } else {
            $result[] = $event;
        }
    }

    return $result;
}

protected function generateOccurrences($masterEvent, $startDate, $endDate)
{
    $occurrences = [];
    $recurrence = $masterEvent->recurrence;

    $currentDate = new Carbon($masterEvent->start_date);
    $endLimit = new Carbon($endDate);

    // Déterminer l'intervalle selon frequency_type
    $interval = match($recurrence['frequency_type']) {
        'daily' => 'days',
        'weekly' => 'weeks',
        'monthly' => 'months',
        default => 'days'
    };

    $frequency = $recurrence['frequency'] ?? 1;
    $maxOccurrences = $recurrence['occurrences'] ?? 365;
    $count = 0;

    while ($currentDate <= $endLimit && $count < $maxOccurrences) {
        // Vérifier si cette occurrence a été modifiée (exception)
        $existing = Event::where('master_id', $masterEvent->id)
            ->whereDate('start_date', $currentDate)
            ->first();

        if ($existing) {
            $occurrences[] = $existing;
        } else {
            // Créer occurrence virtuelle
            $occurrence = $masterEvent->replicate();
            $occurrence->id = null; // Sera généré
            $occurrence->master_id = $masterEvent->id;
            $occurrence->is_master = false;
            $occurrence->start_date = $currentDate->toDateTimeString();
            $occurrence->end_date = $currentDate->copy()->addHours(1)->toDateTimeString();

            $occurrences[] = $occurrence;
        }

        $currentDate->add($frequency, $interval);
        $count++;
    }

    return $occurrences;
}
```

---

### 2. PUT /events/{id}

**Paramètres supplémentaires:**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `scope` | string | `single` ou `series` (optionnel, défaut: `single`) |

**Logique:**

```php
public function update(Request $request, $id)
{
    $event = Event::findOrFail($id);

    $this->authorize('update', $event);

    $validated = $request->validate([
        'title' => 'sometimes|string|max:255',
        'start_date' => 'sometimes|date',
        'end_date' => 'sometimes|date|after:start_date',
        'type' => 'sometimes|in:medical,feeding,appointment,training,social,other',
        'notes' => 'sometimes|string',
        'is_done' => 'sometimes|boolean',
        'scope' => 'sometimes|in:single,series',
    ]);

    $scope = $request->input('scope', 'single');

    if ($scope === 'series' && $event->is_recurring && $event->master_id) {
        return $this->updateRecurringSeries($event->master_id, $validated);
    } else {
        return $this->updateSingleOccurrence($event, $validated);
    }
}

protected function updateSingleOccurrence($event, $data)
{
    if ($event->master_id && !$event->is_exception) {
        // Marquer comme exception
        $event->is_exception = true;
    }

    $event->update($data);

    return response()->json($event->load('pets'));
}

protected function updateRecurringSeries($masterId, $data)
{
    $master = Event::where('id', $masterId)
        ->where('is_master', true)
        ->firstOrFail();

    $master->update($data);

    // Mettre à jour toutes les occurrences non-exceptionnelles
    Event::where('master_id', $masterId)
        ->where('is_exception', false)
        ->update($data);

    return response()->json($master->load('pets'));
}
```

---

### 3. DELETE /events/{id}

**Query Params:**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `scope` | string | `single` ou `series` (optionnel, défaut: `single`) |

**Logique:**

```php
public function destroy(Request $request, $id)
{
    $event = Event::findOrFail($id);

    $this->authorize('delete', $event);

    $scope = $request->query('scope', 'single');

    if ($scope === 'series' && ($event->is_master || $event->master_id)) {
        $masterId = $event->is_master ? $event->id : $event->master_id;
        return $this->deleteRecurringSeries($masterId);
    }

    $event->delete();

    return response()->json(['message' => 'Événement supprimé avec succès']);
}

protected function deleteRecurringSeries($masterId)
{
    // Supprimer toutes les occurrences
    Event::where('master_id', $masterId)->delete();

    // Supprimer le master
    Event::where('id', $masterId)->delete();

    return response()->json(['message' => 'Série d\'événements supprimée avec succès']);
}
```

---

## Gestion des Événements Récurrents

### Principes de Design

1. **Master Event** - L'événement original créé par l'utilisateur
   - `is_master = true`
   - `master_id = null` (ou self-reference)
   - Contient la config `recurrence`

2. **Occurrences** - Instances générées à la demande ou persistées
   - `is_master = false`
   - `master_id = {id du master}`
   - Héritent des propriétés du master

3. **Exceptions** - Occurrences modifiées individuellement
   - `is_exception = true`
   - Ont leurs propres valeurs (title, date, etc.)
   - Ne sont PAS affectées par les mises à jour de la série

### Stratégies de Stockage

#### Option A: Génération Dynamique (Recommandé)

**Avantages:**
- Pas de duplication en base
- Économie d'espace
- Modifications de série simples

**Inconvénients:**
- Calcul à chaque requête
- Performance pour grandes séries

**Implémentation:**
- Stocker uniquement le master + exceptions
- Générer les occurrences à la volée dans `GET /events`
- Persister une occurrence seulement si modifiée

#### Option B: Pré-génération

**Avantages:**
- Requêtes simples
- Performance prévisible

**Inconvénients:**
- Beaucoup de lignes en base
- Modifications de série complexes
- Gestion des conflits

**Non recommandé** pour ce projet.

---

## Sécurité

### 1. Validation Propriété

**Toujours vérifier:**
```php
if ($event->owner_id !== auth()->id()) {
    abort(403, 'Non autorisé à modifier cet événement');
}
```

**Laravel Policy:**
```php
// app/Policies/EventPolicy.php
public function update(User $user, Event $event)
{
    return $user->id === $event->owner_id;
}

public function delete(User $user, Event $event)
{
    return $user->id === $event->owner_id;
}
```

### 2. Validation Dates

```php
$request->validate([
    'start_date' => 'required|date|after_or_equal:today',
    'end_date' => 'nullable|date|after:start_date',
]);
```

### 3. Prévention Conflits

**Optionnel mais recommandé:**

```php
protected function checkConflicts($petIds, $startDate, $endDate, $excludeEventId = null)
{
    $conflicts = Event::where(function ($query) use ($petIds, $startDate, $endDate) {
        $query->whereHas('pets', function ($q) use ($petIds) {
            $q->whereIn('pets.id', $petIds);
        })
        ->where(function ($q) use ($startDate, $endDate) {
            $q->whereBetween('start_date', [$startDate, $endDate])
              ->orWhereBetween('end_date', [$startDate, $endDate]);
        });
    })
    ->when($excludeEventId, function ($query, $excludeEventId) {
        $query->where('id', '!=', $excludeEventId);
    })
    ->exists();

    if ($conflicts) {
        throw new \Exception('Conflit détecté avec un autre événement');
    }
}
```

### 4. Rate Limiting

```php
// routes/api.php
Route::middleware(['auth:sanctum', 'throttle:events'])->group(function () {
    Route::apiResource('events', EventController::class);
});

// app/Providers/RouteServiceProvider.php
RateLimiter::for('events', function (Request $request) {
    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});
```

---

## Tests

### Tests Unitaires

```php
// tests/Unit/EventTest.php
public function test_can_update_single_occurrence()
{
    $event = Event::factory()->recurring()->create();

    $response = $this->putJson("/api/events/{$event->id}", [
        'title' => 'Nouveau titre',
        'scope' => 'single'
    ]);

    $response->assertOk();
    $this->assertEquals('Nouveau titre', $event->fresh()->title);
    $this->assertTrue($event->fresh()->is_exception);
}

public function test_can_update_entire_series()
{
    $master = Event::factory()->recurring()->master()->create();
    $occurrence = Event::factory()->recurring()->occurrence()->create([
        'master_id' => $master->id
    ]);

    $response = $this->putJson("/api/events/{$occurrence->id}", [
        'title' => 'Nouveau titre série',
        'scope' => 'series'
    ]);

    $response->assertOk();
    $this->assertEquals('Nouveau titre série', $master->fresh()->title);
    $this->assertEquals('Nouveau titre série', $occurrence->fresh()->title);
}

public function test_can_delete_single_occurrence()
{
    $event = Event::factory()->recurring()->create();

    $response = $this->deleteJson("/api/events/{$event->id}?scope=single");

    $response->assertOk();
    $this->assertSoftDeleted($event);
}

public function test_can_delete_entire_series()
{
    $master = Event::factory()->recurring()->master()->create();
    $occurrence1 = Event::factory()->recurring()->occurrence()->create([
        'master_id' => $master->id
    ]);
    $occurrence2 = Event::factory()->recurring()->occurrence()->create([
        'master_id' => $master->id
    ]);

    $response = $this->deleteJson("/api/events/{$occurrence1->id}?scope=series");

    $response->assertOk();
    $this->assertSoftDeleted($master);
    $this->assertSoftDeleted($occurrence1);
    $this->assertSoftDeleted($occurrence2);
}
```

### Tests d'Intégration

```php
public function test_drag_drop_updates_start_date()
{
    $event = Event::factory()->create([
        'start_date' => '2025-11-16 08:00:00'
    ]);

    $response = $this->putJson("/api/events/{$event->id}", [
        'start_date' => '2025-11-16 14:00:00'
    ]);

    $response->assertOk();
    $this->assertEquals('2025-11-16 14:00:00', $event->fresh()->start_date);
}

public function test_resize_updates_end_date()
{
    $event = Event::factory()->create([
        'start_date' => '2025-11-16 08:00:00',
        'end_date' => '2025-11-16 09:00:00'
    ]);

    $response = $this->putJson("/api/events/{$event->id}", [
        'end_date' => '2025-11-16 11:00:00'
    ]);

    $response->assertOk();
    $this->assertEquals('2025-11-16 11:00:00', $event->fresh()->end_date);
}
```

---

## Déploiement

### Checklist de Déploiement

#### 1. Base de Données

```bash
# Créer migration
php artisan make:migration add_recurring_fields_to_events_table

# Exécuter migration
php artisan migrate

# Vérifier
php artisan migrate:status
```

**Migration:**
```php
public function up()
{
    Schema::table('events', function (Blueprint $table) {
        $table->boolean('is_master')->default(false)->after('is_recurring');
        $table->boolean('is_exception')->default(false)->after('is_master');

        $table->index('master_id');
        $table->index('is_master');
    });
}

public function down()
{
    Schema::table('events', function (Blueprint $table) {
        $table->dropColumn(['is_master', 'is_exception']);
        $table->dropIndex(['master_id']);
        $table->dropIndex(['is_master']);
    });
}
```

#### 2. Code

```bash
# Tester en local
php artisan test

# Build assets (si nécessaire)
npm run build

# Vérifier routes
php artisan route:list | grep events
```

#### 3. Documentation API

Mettre à jour la documentation Swagger/OpenAPI :

```yaml
/events/{id}:
  put:
    parameters:
      - in: query
        name: scope
        schema:
          type: string
          enum: [single, series]
    requestBody:
      content:
        application/json:
          schema:
            type: object
            properties:
              title:
                type: string
              start_date:
                type: string
                format: date-time
              end_date:
                type: string
                format: date-time
  delete:
    parameters:
      - in: query
        name: scope
        schema:
          type: string
          enum: [single, series]
```

#### 4. Déploiement Production

```bash
# Sur le serveur
git pull origin main
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan queue:restart
```

#### 5. Monitoring

Surveiller après déploiement :

- Logs d'erreurs: `storage/logs/laravel.log`
- Temps de réponse API
- Erreurs 500/403
- Utilisation base de données

---

## Annexes

### A. Exemples de Requêtes

**Créer événement récurrent:**
```bash
POST /api/events
{
    "title": "Repas quotidien Pablo",
    "type": "feeding",
    "start_date": "2025-11-16T08:00:00Z",
    "is_recurring": true,
    "recurrence": {
        "frequency_type": "daily",
        "frequency": 1,
        "occurrences": 365
    },
    "pets": [{"id": 1}]
}
```

**Modifier une occurrence:**
```bash
PUT /api/events/123?scope=single
{
    "title": "Repas exceptionnel",
    "start_date": "2025-11-17T10:00:00Z"
}
```

**Supprimer toute la série:**
```bash
DELETE /api/events/123?scope=series
```

### B. Schéma JSON Recurrence

```json
{
    "frequency_type": "daily|weekly|monthly",
    "frequency": 1,
    "days": [1, 3, 5],  // Pour weekly: 1=Lun, 2=Mar, etc.
    "end_date": "2026-11-16",  // Date de fin
    "occurrences": 365  // Ou nombre d'occurrences
}
```

---

## Résumé des Actions Requises

| Action | Priorité | Effort | Statut |
|--------|----------|--------|--------|
| Migration BDD (is_master, is_exception) | P0 | 1h | ⏳ À faire |
| Modifier EventController@update | P0 | 2h | ⏳ À faire |
| Modifier EventController@destroy | P0 | 2h | ⏳ À faire |
| Ajouter méthode expandRecurringEvents | P0 | 3h | ⏳ À faire |
| Ajouter EventPolicy | P1 | 1h | ⏳ À faire |
| Tests unitaires | P1 | 4h | ⏳ À faire |
| Documentation API | P2 | 1h | ⏳ À faire |
| Détection conflits | P2 | 2h | ⏳ À faire |

**Temps Total Estimé:** 16 heures

---

**Préparé par:** Claude AI Assistant
**Dernière mise à jour:** 16 Novembre 2025
**Contact:** Pour questions, voir CALENDAR_IMPLEMENTATION.md
