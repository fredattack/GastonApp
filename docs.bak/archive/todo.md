# 📋 TODO - GastonApp

**Objectif global :** Stabiliser l'existant, offrir une expérience impeccable et transformer le projet en assistant personnel piloté par IA.

---

## 🚨 QUICK WINS (< 1 jour)

- [ ] Créer `.env.example` avec toutes les variables d'environnement
- [ ] Remplacer tous les `console.log` par un système de logging structuré
- [ ] Implémenter réellement la suppression d'animaux (Pets.tsx:99-149)
- [ ] Ajouter une page 404
- [ ] Améliorer les messages d'erreur utilisateur (toasts explicites)
- [ ] Documenter les conventions de code dans le README

---

## 🏗️ PHASE 1 : STABILISATION & NETTOYAGE (1-2 semaines)

### 1.1 Nettoyage technique
- [ ] Créer service de logging structuré (winston/pino)
  - [ ] Remplacer tous les `console.log` par le logger
  - [ ] Logger avec niveaux (debug, info, warn, error)
  - [ ] Ajouter contexte enrichi (userId, timestamp, stack trace)
- [ ] Corriger tous les `@ts-ignore` (11 fichiers)
  - [ ] `src/router/routes.tsx`
  - [ ] `src/services/ModelService.ts`
  - [ ] `src/pages/content/Pet/Pets.tsx`
  - [ ] `src/components/Shared/DropdownMenu.tsx`
  - [ ] `src/components/Pets/index/PetsTable.tsx`
  - [ ] `src/components/Layouts/Sidebar.tsx`
  - [ ] `src/components/Layouts/CTAButton.tsx`
  - [ ] `src/components/Event/list/EventCalendar.tsx`
  - [ ] `src/components/Event/list/EventCalendarDropdown.tsx`
  - [ ] `src/components/Event/Form/EventRecurrence.tsx`
  - [ ] Ajouter types manquants
- [ ] Supprimer code commenté inutile
  - [ ] Pets.tsx lignes 101-110 (code Firebase commenté)
  - [ ] axiosClient.ts (imports et logique commentée)
- [ ] Nettoyer les imports inutilisés
- [ ] Formater tout le code avec Prettier

### 1.2 Compléter fonctionnalités incomplètes
- [ ] **Actions sur les animaux**
  - [ ] Implémenter `deleteAnimal()` avec Firebase
  - [ ] Implémenter `setDeceased()` - marquage décédé
  - [ ] Implémenter `toggleActiveStatus()` - actif/inactif
  - [ ] Implémenter `addTreatment()` - ajout traitement
  - [ ] Implémenter `addMenu()` - ajout menu repas
  - [ ] Implémenter `addRendezvous()` - ajout RDV vétérinaire
- [ ] Finaliser la logique d'annulation de suppression (undoDelete)
- [ ] Compléter OpenAIService.tsx (endpoint et gestion erreurs)

### 1.3 Gestion d'erreurs robuste
- [ ] Créer ErrorBoundary global personnalisé
- [ ] Ajouter ErrorBoundary spécifiques par route
- [ ] Implémenter système de toasts d'erreur cohérent
- [ ] Enrichir les logs Bugsnag avec contexte utilisateur
- [ ] Gérer les cas d'erreurs réseau (retry, offline mode)
- [ ] Ajouter fallbacks UI pour erreurs (pas de data, erreur serveur)
- [ ] Valider toutes les réponses API (Zod ou Yup)

### 1.4 Documentation
- [ ] **README.md complet**
  - [ ] Description du projet
  - [ ] Installation et setup
  - [ ] Variables d'environnement
  - [ ] Scripts disponibles
  - [ ] Architecture du projet
  - [ ] Conventions de code
  - [ ] Contribution guidelines
- [ ] `.env.example` avec descriptions
- [ ] Documenter l'API backend (endpoints, payloads)
- [ ] Ajouter JSDoc aux fonctions critiques
- [ ] Créer ARCHITECTURE.md (diagrammes)
- [ ] Créer CHANGELOG.md

---

## ✅ PHASE 2 : QUALITÉ & TESTS (2-3 semaines)

### 2.1 Configuration tests
- [ ] Installer et configurer Vitest
- [ ] Configurer React Testing Library
- [ ] Setup coverage reports
- [ ] Configurer MSW (Mock Service Worker) pour API

### 2.2 Tests unitaires
- [ ] **Services**
  - [ ] ModelService.test.ts (CRUD complet)
  - [ ] EventService.test.ts
  - [ ] OpenAIService.test.ts
- [ ] **Repositories**
  - [ ] RestModelRepository.test.ts
  - [ ] RestEventRepository.test.ts
  - [ ] FirebaseRepository.test.ts
- [ ] **Hooks**
  - [ ] useSpeechRecognition.test.ts
  - [ ] useSpeechProcessing.test.ts
- [ ] **Helpers**
  - [ ] helpers.test.tsx
- [ ] **Utils**
  - [ ] Date formatters
  - [ ] Validation functions

### 2.3 Tests d'intégration
- [ ] **Contextes**
  - [ ] PetsContext.test.tsx (CRUD + refresh)
  - [ ] EventsContext.test.tsx
  - [ ] GlobalContext.test.tsx
  - [ ] MessageContext.test.tsx
- [ ] **Formulaires**
  - [ ] PetForm.test.tsx (création, édition, validation)
  - [ ] EventForm.test.tsx (récurrence, pets, validation)
- [ ] **Composants complexes**
  - [ ] EventCalendar.test.tsx
  - [ ] ActionModal.test.tsx

### 2.4 Tests E2E (optionnel mais recommandé)
- [ ] Installer Playwright ou Cypress
- [ ] **Flows critiques**
  - [ ] Création d'un animal
  - [ ] Création d'un événement avec récurrence
  - [ ] Modification d'un événement
  - [ ] Suppression avec undo
  - [ ] Reconnaissance vocale → création événement

### 2.5 CI/CD
- [ ] **GitHub Actions**
  - [ ] Job: Lint (ESLint)
  - [ ] Job: Type checking (tsc)
  - [ ] Job: Tests unitaires + coverage
  - [ ] Job: Build production
  - [ ] Job: Tests E2E (si implémentés)
- [ ] Badge coverage dans README
- [ ] Bloquer PR si coverage < 70%

---

## 🔐 PHASE 3 : AUTHENTIFICATION & SÉCURITÉ (2 semaines)

### 3.1 Système d'authentification
- [ ] Choisir provider (Firebase Auth recommandé)
- [ ] Implémenter login/logout
- [ ] Implémenter inscription
- [ ] Gestion reset password
- [ ] Persistance session (localStorage + secure tokens)
- [ ] **Remplacer `ownerId = "1"` partout**
  - [ ] ModelService.ts:87
  - [ ] Tous les appels API
- [ ] Ajouter AuthContext
- [ ] Protéger les routes (PrivateRoute component)

### 3.2 Gestion utilisateurs
- [ ] Page de profil utilisateur
  - [ ] Avatar
  - [ ] Nom, email
  - [ ] Préférences (langue, timezone, notifications)
- [ ] Settings page
  - [ ] Thème (dark/light déjà présent)
  - [ ] Notifications (email, push)
  - [ ] Export données (RGPD)
  - [ ] Suppression compte

### 3.3 Sécurité
- [ ] **Validation & Sanitization**
  - [ ] Valider tous les inputs avec Yup
  - [ ] Sanitizer les données avant envoi API
  - [ ] XSS protection
- [ ] **API Security**
  - [ ] Ajouter JWT tokens dans headers
  - [ ] Refresh token logic
  - [ ] CSRF protection
  - [ ] Rate limiting client-side
- [ ] **Secrets management**
  - [ ] Ne jamais commit `.env`
  - [ ] Utiliser Vault ou similar en prod
  - [ ] Rotation clés API
- [ ] Audit dépendances (npm audit)
- [ ] HTTPS only en production

---

## 🚀 PHASE 4 : AMÉLIORATION UX & PERFORMANCE (3 semaines)

### 4.1 Optimisations performance
- [ ] **Code splitting avancé**
  - [ ] Route-based splitting (déjà partiellement fait)
  - [ ] Component-based splitting (modals, calendar)
- [ ] **Memoization**
  - [ ] React.memo sur composants lourds
  - [ ] useMemo pour calculs coûteux
  - [ ] useCallback pour fonctions passées en props
- [ ] **Virtualization**
  - [ ] Liste d'animaux (react-window)
  - [ ] Liste d'événements
  - [ ] Calendrier mois/année
- [ ] **Images optimization**
  - [ ] Lazy loading images
  - [ ] WebP format
  - [ ] Responsive images
  - [ ] Compression
- [ ] **Service Worker & PWA**
  - [ ] Installer workbox
  - [ ] Offline-first strategy
  - [ ] Cache API responses
  - [ ] manifest.json pour PWA
  - [ ] Add to Home Screen
- [ ] **Bundle optimization**
  - [ ] Analyzer bundle size
  - [ ] Tree shaking
  - [ ] Remove unused deps
  - [ ] CDN pour libs lourdes

### 4.2 UX améliorée
- [ ] **Loading states**
  - [ ] Skeleton loaders (pets, events, calendar)
  - [ ] Suspense boundaries
  - [ ] Progress bars pour uploads
- [ ] **Animations fluides**
  - [ ] Installer Framer Motion
  - [ ] Transitions page-to-page
  - [ ] Micro-interactions (hover, click)
  - [ ] Modal animations
  - [ ] List animations (enter/exit)
- [ ] **Interactions avancées**
  - [ ] Drag & drop pour réorganiser événements
  - [ ] Swipe actions sur mobile
  - [ ] Infinite scroll
  - [ ] Pull to refresh
- [ ] **Recherche/Filtres avancés**
  - [ ] Recherche full-text animaux
  - [ ] Filtres multiples événements (type, date, animal)
  - [ ] Tri personnalisé
  - [ ] Sauvegarde filtres préférés
- [ ] **Notifications**
  - [ ] Push notifications (PWA)
  - [ ] Email notifications
  - [ ] In-app notifications center
  - [ ] Notification preferences

### 4.3 Accessibilité (a11y)
- [ ] **Navigation clavier**
  - [ ] Tab order logique
  - [ ] Focus visible
  - [ ] Shortcuts clavier (Cmd+K search)
  - [ ] Escape pour fermer modals
- [ ] **ARIA**
  - [ ] Labels sur tous les inputs
  - [ ] Roles appropriés
  - [ ] Live regions pour updates dynamiques
  - [ ] aria-expanded, aria-hidden
- [ ] **Contraste & lisibilité**
  - [ ] Vérifier contraste WCAG AA
  - [ ] Tailles de police ajustables
  - [ ] Support high contrast mode
- [ ] **Support lecteurs d'écran**
  - [ ] Tester avec NVDA/JAWS
  - [ ] Descriptions images
  - [ ] Annonces importantes

### 4.4 Mobile-first responsive
- [ ] Audit responsive design
- [ ] Touch gestures optimisés
- [ ] Bottom sheet pour modals mobile
- [ ] Hamburger menu optimisé
- [ ] Safe area iOS (notch)
- [ ] Tester sur devices réels (Android, iOS)

---

## 🤖 PHASE 5 : ASSISTANT IA INTELLIGENT (4-6 semaines)

### 5.1 Reconnaissance vocale améliorée
- [ ] **Multi-langues**
  - [ ] Support FR, EN, ES, DE
  - [ ] Détection langue automatique
  - [ ] Switch langue à la volée
- [ ] **NLP avancé**
  - [ ] Remplacer regex basique par NLP library (compromise, natural)
  - [ ] Extraction entités (nom animal, heure, type événement)
  - [ ] Intent detection
  - [ ] Context awareness (conversation continue)
- [ ] **Fallbacks robustes**
  - [ ] Suggestions si pas compris
  - [ ] Demande clarification
  - [ ] Mode correction vocale
- [ ] **Text-to-Speech**
  - [ ] Feedback vocal
  - [ ] Confirmation actions
  - [ ] Lecture résumés

### 5.2 Assistant IA conversationnel
- [ ] **Commandes vocales naturelles**
  - [ ] "Rappelle-moi de nourrir Max demain à 8h"
  - [ ] "Quel est le prochain vaccin de Luna ?"
  - [ ] "Résume les activités de cette semaine"
  - [ ] "Crée un planning de repas pour Milo"
  - [ ] "Annule le rendez-vous de mercredi"
  - [ ] "Montre-moi l'historique médical de Rex"
- [ ] **Conversation contextuelle**
  - [ ] Historique conversations
  - [ ] Références temporelles ("demain", "la semaine prochaine")
  - [ ] Pronoms ("lui" = dernier animal mentionné)
  - [ ] Multi-turn dialogues
- [ ] **UI Chat interface**
  - [ ] Chatbot widget (bottom-right)
  - [ ] Historique messages
  - [ ] Typing indicators
  - [ ] Quick actions buttons

### 5.3 Fonctionnalités IA avancées

#### 5.3.1 Suggestions proactives
- [ ] **Rappels intelligents**
  - [ ] "Max n'a pas mangé depuis 12h"
  - [ ] "Le vaccin de Luna expire dans 1 semaine"
  - [ ] "Vous avez oublié la promenade de ce matin"
- [ ] **Recommandations**
  - [ ] "Temps idéal pour une promenade (météo)"
  - [ ] "Stock de croquettes bientôt épuisé"
  - [ ] "RDV vétérinaire annuel à programmer"
- [ ] **Notifications contextuelles**
  - [ ] Basées sur localisation (proche du vétérinaire)
  - [ ] Basées sur heure (rappel du soir)
  - [ ] Basées sur patterns

#### 5.3.2 Analyse de patterns
- [ ] **Machine Learning basics**
  - [ ] Identifier habitudes (heures repas, promenades)
  - [ ] Détecter anomalies
  - [ ] Prédire besoins futurs
- [ ] **Insights santé**
  - [ ] Courbes de poids
  - [ ] Fréquence événements médicaux
  - [ ] Corrélations comportement/santé
- [ ] **Alertes anomalies**
  - [ ] Animal pas nourri à l'heure habituelle
  - [ ] Médicament oublié
  - [ ] Changement comportement

#### 5.3.3 Génération automatique
- [ ] **Planning intelligent**
  - [ ] Planning hebdomadaire basé sur historique
  - [ ] Adaptation automatique aux imprévus
  - [ ] Optimisation horaires (éviter conflits)
- [ ] **Rapports & exports**
  - [ ] Rapport santé mensuel (PDF)
  - [ ] Export pour vétérinaire
  - [ ] Graphiques et visualisations
  - [ ] Carnet de santé digital
- [ ] **Suggestions menus**
  - [ ] Repas équilibrés
  - [ ] Rotation alimentation
  - [ ] Prise en compte allergies/restrictions

### 5.4 Intégrations tierces
- [ ] **Calendriers**
  - [ ] Google Calendar sync bidirectionnel
  - [ ] Apple Calendar
  - [ ] Outlook Calendar
- [ ] **Santé**
  - [ ] Apple Health (poids, activité)
  - [ ] Google Fit
  - [ ] Strava (promenades)
- [ ] **Vétérinaires**
  - [ ] API cabinets vétérinaires (si disponible)
  - [ ] Prise RDV en ligne
  - [ ] Partage dossier médical
- [ ] **E-commerce**
  - [ ] Amazon (commande croquettes)
  - [ ] Zooplus, Wanimo
  - [ ] Alertes promos
- [ ] **Photos & reconnaissance**
  - [ ] Google Photos integration
  - [ ] Reconnaissance automatique animaux (ML)
  - [ ] Albums par animal
  - [ ] Détection santé via photos (éruptions, blessures)
- [ ] **Smart Home**
  - [ ] Distributeur croquettes connecté
  - [ ] Caméra surveillance
  - [ ] Porte connectée (sorties)

### 5.5 Chatbot multimodal
- [ ] **Modes d'interaction**
  - [ ] Vocal (Speech-to-Text)
  - [ ] Texte (chat classique)
  - [ ] Images (upload + analyse)
  - [ ] Mix (texte + vocal dans même conversation)
- [ ] **Upload & analyse images**
  - [ ] "C'est quoi cette éruption sur Max ?"
  - [ ] Vision AI (OpenAI GPT-4V, Google Vision)
  - [ ] Détection urgences médicales
- [ ] **Historique conversations**
  - [ ] Persistance cloud
  - [ ] Recherche dans historique
  - [ ] Export conversations
- [ ] **Context-aware responses**
  - [ ] Mémoire long-terme (préférences user)
  - [ ] Adaptation ton (formel/casual)
  - [ ] Personnalisation par utilisateur

---

## 📊 MÉTRIQUES & KPIs

### Performance
- [ ] Lighthouse score > 90 (toutes catégories)
- [ ] Time to Interactive < 3s
- [ ] First Contentful Paint < 1.5s
- [ ] Bundle size < 500kb (gzipped)

### Qualité
- [ ] Code coverage > 70%
- [ ] 0 erreurs TypeScript
- [ ] 0 erreurs ESLint
- [ ] Tous les tests passent

### Accessibilité
- [ ] WCAG 2.1 Level AA
- [ ] axe DevTools 0 violations

### Sécurité
- [ ] 0 vulnérabilités npm audit
- [ ] HTTPS A+ rating
- [ ] Security headers configurés

---

## 🎯 PRIORISATION

### ⚡ SPRINT 1-2 (Critique - 2-4 semaines)
1. Quick Wins
2. Phase 1 complète (Stabilisation)
3. Authentification basique (Phase 3.1)
4. Tests critiques (Phase 2.1 + 2.2)

### 🔥 SPRINT 3-4 (Important - 4-6 semaines)
1. Phase 2 complète (Tests)
2. Phase 3 complète (Sécurité)
3. Phase 4.1 et 4.2 (Performance + UX)
4. IA : Suggestions simples (Phase 5.3.1)

### 💎 SPRINT 5+ (Nice-to-have - 6-10 semaines)
1. Phase 4.3 et 4.4 (a11y + Mobile)
2. Phase 5 complète (Assistant IA)
3. Intégrations tierces (Phase 5.4)
4. Fonctionnalités avancées ML

---

## 📝 NOTES

### Décisions techniques à prendre
- [ ] Choisir provider auth (Firebase vs Auth0 vs Supabase)
- [ ] Choisir solution NLP (compromise vs natural vs OpenAI)
- [ ] Choisir framework E2E (Playwright vs Cypress)
- [ ] Choisir solution analytics (Mixpanel, Amplitude, PostHog)
- [ ] Backend : Laravel ou migration vers Node.js ?

### Questions ouvertes
- [ ] Monétisation future ? (freemium, premium features)
- [ ] Multi-pets limit pour free tier ?
- [ ] Partage entre utilisateurs (famille) ?
- [ ] API publique pour développeurs tiers ?

---

## 🏁 DÉFINITION OF DONE

Une tâche est terminée quand :
- ✅ Code écrit et fonctionnel
- ✅ Tests écrits et passent
- ✅ Documentation mise à jour
- ✅ Review code effectuée
- ✅ Pas de régression
- ✅ Déployé en staging
- ✅ Validé par utilisateur/PO

---

**Dernière mise à jour :** 2025-10-20
**Maintainer :** Équipe GastonApp
