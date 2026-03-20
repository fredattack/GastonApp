# MVP Beta - Feeding Dashboard
# "Le papier sur le frigo doit disparaitre"

**Objectif** : 2 personnes, 16 animaux, gestion quotidienne des repas
**Duree** : 4 semaines (16 mars - 13 avril 2026)
**KPI** : Fred + compagne utilisent l'app CHAQUE JOUR pendant 7 jours consecutifs

---

## Semaine 1 : Backend Feeding + Page minimale [DONE]

### Backend (gaston-backend)

- [x] **T1.1** Migration `feeding_schedules`
  - `database/migrations/2026_03_16_000001_create_feeding_schedules_table.php`
- [x] **T1.2** Migration `feeding_logs`
  - `database/migrations/2026_03_16_000002_create_feeding_logs_table.php`
- [x] **T1.3** Model `FeedingSchedule` + relations
  - `app/Models/FeedingSchedule.php`
- [x] **T1.4** Model `FeedingLog` + relations
  - `app/Models/FeedingLog.php`
- [x] **T1.5** Relations sur `Pet.php` (feedingSchedules, feedingLogs)
- [x] **T1.6** `FeedingService` : getTodayFeedings, markAsDone, markBatchDone, undoMark, CRUD schedules, getHistory
  - `app/Services/FeedingService.php`
- [x] **T1.7** `FeedingController` : 8 endpoints REST
  - `app/Http/Controllers/Api/FeedingController.php`
- [x] **T1.8** Routes feeding dans `routes/api.php`
  - GET /today, POST /mark-done, POST /mark-batch, POST /undo-mark, GET/POST /schedules, PUT /schedules/{id}, GET /history/{petId}
- [x] **T1.9** `FeedingScheduleSeeder` : 16 animaux avec regimes realistes
  - `database/seeders/FeedingScheduleSeeder.php`
- [x] **T1.10** AI integration : 4 nouveaux requestTypes dans `AiOrchestratorService`
  - markFeeding, batchMarkFeeding, updateFeedingSchedule, queryDiet
- [x] **T1.11** AI prompts : nouveaux types + exemples dans `ConsumeAiService`

### Frontend (apps/web)

- [x] **T1.12** Types Feeding dans `global.d.ts`
  - FeedingSchedule, FeedingItem, FeedingSlotData, FeedingTodayResponse, MealSlot
- [x] **T1.13** `FeedingService.ts` : client API
- [x] **T1.14** `FeedingContext.tsx` : etat du jour + optimistic updates + polling 30s
- [x] **T1.15** `useFeedingDashboard.ts` : hook logique metier
- [x] **T1.16** `FeedingPetRow.tsx` : ligne animal + bouton toggle
- [x] **T1.17** `FeedingSlotTabs.tsx` : onglets matin/midi/soir
- [x] **T1.18** `FeedingSpeciesSection.tsx` : groupement chiens/chats + compteurs
- [x] **T1.19** `BatchActionBar.tsx` : "Tous les chiens nourris"
- [x] **T1.20** `FeedingDashboardPage.tsx` : page complete
- [x] **T1.21** Route `/feeding` dans `routes.tsx`
- [x] **T1.22** TabBar : onglet Repas + badge (5 cols)

### Validation S1

- [ ] **T1.V1** `php artisan migrate` OK
- [ ] **T1.V2** `php artisan db:seed --class=FeedingScheduleSeeder` OK
- [ ] **T1.V3** Page `/feeding` affiche les 16 animaux groupes par espece
- [ ] **T1.V4** Tap sur `[ ]` → feedback vert instantane → API OK
- [ ] **T1.V5** Tap "Tous les chiens nourris" → batch OK

---

## Semaine 2 : UX complete + operations groupees [DONE]

### Frontend

- [x] **T2.1** `SmartFeedingSuggestion.tsx` : banniere contextuelle IA
  - Apparait dans la fenetre horaire du slot actif si repas non faits
  - Suggestion intelligente par espece ou globale
  - Boutons [Oui] [Ignorer]
  - `apps/web/src/components/Feeding/SmartFeedingSuggestion.tsx`

- [x] **T2.2** `PetDietCard.tsx` : fiche regime par animal
  - Tap sur nom dans FeedingPetRow → modal avec details regime
  - Affiche tous les slots (matin/midi/soir) avec food_type + quantity + race
  - `apps/web/src/components/Feeding/PetDietCard.tsx`

- [x] **T2.3** Integrer SmartFeedingSuggestion dans FeedingDashboardPage
  - Logique conditionnelle basee sur l'heure et le statut des repas

- [x] **T2.4** Integrer PetDietCard (modal on pet name tap)
  - onClick sur pet_name dans FeedingPetRow → propage via FeedingSpeciesSection
  - State selectedPet dans FeedingDashboardPage

- [x] **T2.5** Corriger position FAB sur mobile
  - `bottom-20` pour ne pas chevaucher TabBar, z-40 pour ne pas bloquer modals
  - `apps/web/src/components/Common/FAB.tsx`

- [ ] **T2.6** Swipe gesture sur FeedingPetRow (nice-to-have, reporte)
  - Swipe droite → meme action que tap sur bouton toggle
  - Utiliser touch events natifs ou react-swipeable

### Backend

- [x] **T2.7** Endpoint `GET /feeding/schedules` : enrichir avec infos pet
  - Reponse groupee par animal avec species/breed
  - Nouveau type PetScheduleGroup frontend

- [x] **T2.8** Unique constraint `pet_id + meal_slot` sur feeding_schedules
  - Migration `2026_03_17_000001_add_unique_constraint_feeding_schedules.php`

### Validation S2

- [ ] **T2.V1** Banniere suggestion apparait au bon moment
- [ ] **T2.V2** Tap sur nom animal → fiche regime visible
- [ ] **T2.V3** FAB ne chevauche plus la TabBar sur mobile
- [ ] **T2.V4** App utilisable au quotidien par 2 personnes (test reel)

---

## Semaine 3 : AI vocale + synchronisation [DONE]

### Frontend

- [x] **T3.1** Bouton micro dans le header du FeedingDashboard
  - VoiceCommandButton.tsx avec state machine (idle/recording/processing/error)
  - Pulsing red rings pendant l'enregistrement, spinner pendant le traitement
  - Auto-stop apres 10 secondes, tap pour arreter manuellement
  - `apps/web/src/components/Feeding/VoiceCommandButton.tsx`

- [x] **T3.2** Feedback vocal : confirmation visuelle apres commande
  - VoiceCommandFeedback.tsx : banniere slide-in avec auto-dismiss 4s
  - Vert (executed), rouge (error), ambre (low_confidence)
  - Progress bar visuelle avant auto-dismiss
  - `apps/web/src/components/Feeding/VoiceCommandFeedback.tsx`

- [x] **T3.3** Gestion des erreurs vocales
  - Erreur API → message "Impossible de traiter la commande"
  - Low confidence → message ambre avec description de l'IA
  - State "error" sur le bouton pendant 2s

### Backend

- [x] **T3.4** FeedingCommandService : endpoint stateless `/ai/command`
  - Prompt optimise ~800 tokens (vs ~3000 pour ConsumeAiService)
  - temperature: 0.0, max_tokens: 300, JSON response format
  - Execution immediate si confiance >= 70
  - 5 actions: markFeeding, batchMarkFeeding, updateFeedingSchedule, queryDiet, undoFeeding
  - `app/Services/FeedingCommandService.php`

- [x] **T3.5** Mapping commandes vocales → actions feeding
  - Colloquialismes: toutous/clebs = dog, matous/minous = cat
  - Auto-detection meal slot (morning/noon/evening)
  - Few-shot examples inline dans le system prompt
  - Pet name fuzzy matching

- [x] **T3.6** Route `/ai/command` dans `routes/api.php`
  - command() method dans ConsumeAiController

### Composants supplementaires

- [ ] **T3.7** `PetDietCard.tsx` enrichi : historique derniers jours (reporte S4)

- [x] **T3.8** Polling 30s : implemente dans FeedingContext (T1.14)
  - refreshFeedings() appele apres chaque commande vocale reussie

### Validation S3

- [ ] **T3.V1** "Les chiens ont mange" par la voix → 4 chiens marques (< 3 sec)
- [ ] **T3.V2** "Qu'est-ce que Luna mange ?" → fiche affichee
- [ ] **T3.V3** Commande incomprehensible → message d'erreur clair
- [ ] **T3.V4** Sync 2 appareils : changement visible en < 30s

---

## Semaine 4 : Polish + mise en production beta [TODO]

### Tests et corrections

- [ ] **T4.1** Tests manuels avec les 16 animaux reels
  - Fred et compagne testent pendant 3-4 jours
  - Noter tous les bugs et frictions

- [ ] **T4.2** Fix des bugs trouves pendant les tests
  - Prioriser par impact sur usage quotidien

- [ ] **T4.3** Responsive mobile : test sur iPhone Safari + Android Chrome
  - Touch targets >= 44x44px
  - TabBar visible et fonctionnelle
  - Scrolling fluide avec 16+ animaux

- [ ] **T4.4** Setup de donnees reelles
  - Regimes alimentaires exacts de chaque animal
  - Verifier les quantites avec Fred

### Deploiement

- [ ] **T4.5** Build Docker : `pnpm build:web` + Dockerfile
  - `.deploy/Dockerfile` existe deja
  - Verifier que le build passe proprement

- [ ] **T4.6** Deploy sur Digital Ocean
  - `docker-compose up -d`
  - Verifier que les containers tournent

- [ ] **T4.7** Configuration CORS
  - Backend accepte les requetes du domaine de production
  - Verifier dans `config/cors.php`

- [ ] **T4.8** HTTPS
  - Certificat SSL via Let's Encrypt ou DigitalOcean
  - Redirect HTTP → HTTPS dans nginx.conf

- [ ] **T4.9** Monitoring basique
  - Logs Laravel accessibles
  - Alerter si l'API est down

### Validation S4 (KPI de succes)

- [ ] **T4.V1** Fred et compagne utilisent l'app CHAQUE JOUR pendant 7 jours
- [ ] **T4.V2** Le papier/tableau sur le frigo n'est plus necessaire
- [ ] **T4.V3** La compagne n'a eu besoin d'aucune explication
- [ ] **T4.V4** "Les chiens ont mange" par la voix fonctionne 8/10
- [ ] **T4.V5** Aucun animal n'a ete oublie grace a l'app

---

## Ce qu'on NE fait PAS (decisions explicites)

- Pas d'authentification (on l'ajoutera quand le MVP sera valide)
- Pas de multi-tenant (un seul foyer)
- Pas de streaming AI (POST/response simple)
- Pas de PWA/notifications push
- Pas de refactoring du code existant
- Pas d'onboarding
- Pas de landing page
- Pas de paiement

---

## Fichiers crees/modifies - Reference

### Backend (gaston-backend)

| Fichier | Semaine | Status |
|---|---|---|
| `database/migrations/2026_03_16_000001_create_feeding_schedules_table.php` | S1 | Done |
| `database/migrations/2026_03_16_000002_create_feeding_logs_table.php` | S1 | Done |
| `app/Models/FeedingSchedule.php` | S1 | Done |
| `app/Models/FeedingLog.php` | S1 | Done |
| `app/Models/Pet.php` (modifie) | S1 | Done |
| `app/Services/FeedingService.php` | S1 | Done |
| `app/Http/Controllers/Api/FeedingController.php` | S1 | Done |
| `database/seeders/FeedingScheduleSeeder.php` | S1 | Done |
| `app/Services/AiOrchestratorService.php` (modifie) | S1 | Done |
| `app/Services/ConsumeAiService.php` (modifie) | S1 | Done |
| `routes/api.php` (modifie) | S1 | Done |
| `app/Http/Controllers/ConsumeAiController.php` (modifie) | S3 | Todo |

### Frontend (apps/web/src)

| Fichier | Semaine | Status |
|---|---|---|
| `types/global.d.ts` (modifie) | S1 | Done |
| `services/FeedingService.ts` | S1 | Done |
| `contexts/FeedingContext.tsx` | S1 | Done |
| `hooks/useFeedingDashboard.ts` | S1 | Done |
| `components/Feeding/FeedingPetRow.tsx` | S1 | Done |
| `components/Feeding/FeedingSlotTabs.tsx` | S1 | Done |
| `components/Feeding/FeedingSpeciesSection.tsx` | S1 | Done |
| `components/Feeding/BatchActionBar.tsx` | S1 | Done |
| `pages/content/Feeding/FeedingDashboardPage.tsx` | S1 | Done |
| `router/routes.tsx` (modifie) | S1 | Done |
| `components/Navigation/TabBar.tsx` (modifie) | S1 | Done |
| `components/Feeding/SmartFeedingSuggestion.tsx` | S2 | Todo |
| `components/Feeding/PetDietCard.tsx` | S2 | Todo |
| `components/Common/FAB.tsx` (modifie) | S2 | Todo |
