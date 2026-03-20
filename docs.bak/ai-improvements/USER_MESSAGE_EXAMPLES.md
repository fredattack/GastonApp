# 📝 Exemples de Messages Utilisateur - GastonApp

**Version:** 1.0
**Date:** Novembre
2025
**Basé sur:** MVP
Definition
Document & Analyse
du codebase

---

## 📊 Vue d'ensemble

Ce document présente
**30 exemples de
messages** qu'un
utilisateur pourrait
envoyer à l'
assistant vocal AI
de GastonApp. Ces
exemples sont
catégorisés selon
leur implémentation
actuelle et leur
complexité.

### Légende des statuts

- ✅ **Déjà supporté
  ** -
  Fonctionnalité
  implémentée dans
  le code actuel
- 🟡 **Partiellement
  supporté** -
  Nécessite des
  ajustements
  mineurs
- 🔴 **Non implémenté
  ** - Nouvelle
  fonctionnalité à
  développer

---

## 1️⃣ ALIMENTATION (Feeding) - Type:
`feeding`

### ✅ Exemple 1: Alimentation simple avec quantité

```
Pablo doit manger 365gr de barf demain matin
```

**Type AI:**
`createEvent`
**Catégorie:**
Feeding
**Récurrence:** Non
**Complexité:**
Basique

---

### ✅ Exemple 2: Alimentation récurrente quotidienne

```
Donne à manger à Luna 200g de croquettes tous les jours à 8h et 18h
```

**Type AI:**
`createEvent`
**Catégorie:**
Feeding
**Récurrence:**
Daily (2 événements)
**Complexité:**
Moyenne

---

### ✅ Exemple 3: Alimentation multi-animaux

```
Nourrir Pablo et Luna avec 150g de pâtée chacun ce soir à 19h
```

**Type AI:**
`createEvent`
**Catégorie:**
Feeding
**Récurrence:** Non
**Multi-pets:** Oui
**Complexité:**
Moyenne

---

### 🟡 Exemple 4: Alimentation avec notes spécifiques

```
Pablo mange 250g de boeuf cru tous les matins à 7h, penser à ajouter ses vitamines
```

**Type AI:**
`createEvent`
**Catégorie:**
Feeding
**Récurrence:**
Daily
**Notes:** "penser à
ajouter ses
vitamines"
**Complexité:**
Moyenne

---

### 🔴 Exemple 5: Alimentation avec condition de poids

```
Si Pablo pèse plus de 25kg, réduire sa ration à 300g au lieu de 350g
```

**Type AI:**
`createEvent` +
logique
conditionnelle
**Catégorie:**
Feeding + Health
tracking
**Complexité:**
Avancée
**Remarque:**
Nécessite
intégration du suivi
de poids

---

## 2️⃣ SANTÉ & MÉDICAL (Medical) - Type:
`medical`

### ✅ Exemple 6: Médicament simple

```
Rappelle-moi de donner son antibiotique à Luna à 10h demain
```

**Type AI:**
`createEvent`
**Catégorie:**
Medical
**Récurrence:** Non
**Complexité:**
Basique

---

### ✅ Exemple 7: Traitement récurrent

```
Pablo doit prendre son traitement anti-puces tous les mois le 15
```

**Type AI:**
`createEvent`
**Catégorie:**
Medical
**Récurrence:**
Monthly
**Complexité:**
Moyenne

---

### ✅ Exemple 8: Traitement avec durée

```
Luna prend 1 comprimé d'anti-inflammatoire matin et soir pendant 7 jours
```

**Type AI:**
`createEvent`
**Catégorie:**
Medical
**Récurrence:**
Daily (durée
limitée)
**Complexité:**
Moyenne

---

### 🔴 Exemple 9: Alerte de stock de médicament

```
Je n'ai plus que 3 jours de traitement pour Pablo, rappelle-moi de commander
```

**Type AI:**
`createEvent` +
inventory tracking
**Catégorie:**
Medical + Reminder
**Complexité:**
Avancée
**Remarque:**
Nécessite gestion
d'inventaire

---

### 🔴 Exemple 10: Suivi de symptômes

```
Pablo a vomi ce matin, surveiller et créer une alerte si ça se reproduit dans les 24h
```

**Type AI:**
`createEvent` +
health monitoring
**Catégorie:**
Medical + Health log
**Complexité:**
Avancée
**Remarque:**
Nécessite journal de
santé

---

## 3️⃣ RENDEZ-VOUS (Appointment) - Type:
`appointment`

### ✅ Exemple 11: Rendez-vous vétérinaire simple

```
Rendez-vous chez le vétérinaire pour Luna le 25 novembre à 14h30
```

**Type AI:**
`createEvent`
**Catégorie:**
Appointment
**Récurrence:** Non
**Complexité:**
Basique

---

### ✅ Exemple 12: Vaccination annuelle

```
Vaccin annuel de Pablo tous les ans le 10 janvier chez le Dr Martin
```

**Type AI:**
`createEvent`
**Catégorie:**
Appointment
**Récurrence:**
Yearly
**Complexité:**
Moyenne

---

### 🔴 Exemple 13: Toilettage récurrent

```
Réserver toilettage pour Luna tous les 2 mois chez Canin Beauté
```

**Type AI:**
`createEvent`
**Catégorie:**
Appointment (
Grooming)
**Récurrence:**
Bi-monthly (custom)
**Complexité:**
Moyenne
**Remarque:**
Récurrence
bi-mensuelle non
supportée
actuellement

---

### 🔴 Exemple 14: Rendez-vous avec rappel anticipé

```
Contrôle dentaire de Pablo le 15 décembre à 10h, me rappeler 3 jours avant
```

**Type AI:**
`createEvent` +
reminder
**Catégorie:**
Appointment
**Notifications:**
Advanced
**Complexité:**
Moyenne
**Remarque:**
Notifications
avancées non
implémentées

---

### 🔴 Exemple 15: Rendez-vous avec préparation

```
Rendez-vous opération Luna le 20 décembre, ne pas nourrir 12h avant
```

**Type AI:**
`createEvent` +
preparation reminder
**Catégorie:**
Appointment +
Medical
**Complexité:**
Avancée
**Remarque:**
Nécessite gestion de
pré-instructions

---

## 4️⃣ ENTRAÎNEMENT & SOCIAL (Training/Social)

### 🟡 Exemple 16: Cours d'éducation

```
Cours d'éducation canine pour Pablo tous les mercredis à 18h
```

**Type AI:**
`createEvent`
**Catégorie:**
Training
**Récurrence:**
Weekly
**Complexité:**
Basique
**Remarque:** Type "
training" existe
mais peu utilisé

---

### 🔴 Exemple 17: Socialisation

```
Rendez-vous au parc pour Luna tous les samedis matin avec ses copains
```

**Type AI:**
`createEvent`
**Catégorie:**
Social
**Récurrence:**
Weekly
**Complexité:**
Basique
**Remarque:** Type "
social" existe mais
non documenté dans
MVP

---

### 🔴 Exemple 18: Exercice quotidien

```
Promenade de 30 minutes pour Pablo tous les matins à 7h et le soir à 19h
```

**Type AI:**
`createEvent`
**Catégorie:**
Exercise (Other?)
**Récurrence:**
Daily (2x)
**Complexité:**
Moyenne
**Remarque:** Pas de
catégorie
spécifique "
Exercise"

---

## 5️⃣ GESTION DES ANIMAUX (Pet Management)

### ✅ Exemple 19: Ajout d'un nouvel animal

```
Ajouter un nouveau chien nommé Max, né le 15 mars 2023, race Labrador
```

**Type AI:**
`createPet`
**Catégorie:** Pet
Management
**Complexité:**
Basique

---

### 🟡 Exemple 20: Modification d'informations

```
Changer la race de Pablo en Border Collie
```

**Type AI:**
`updatePet`
**Catégorie:** Pet
Management
**Complexité:**
Basique
**Remarque:**
updatePet n'est pas
explicitement dans
les types AI

---

### 🔴 Exemple 21: Marquer comme décédé

```
Marquer Luna comme décédée le 10 novembre 2025
```

**Type AI:**
`updatePet`
**Catégorie:** Pet
Management
**Complexité:**
Moyenne
**Remarque:**
Fonctionnalité "Mark
as deceased"
mentionnée dans MVP
mais non implémentée

---

## 6️⃣ REQUÊTES & CONSULTATION (Query)

### 🟡 Exemple 22: Consultation d'agenda

```
Quels sont les rendez-vous de Pablo cette semaine ?
```

**Type AI:** `query`
**Catégorie:**
Query/Information
**Complexité:**
Moyenne
**Remarque:** Type "
query" existe mais
peu documenté

---

### 🔴 Exemple 23: Historique médical

```
Quand est-ce que Luna a reçu son dernier vaccin ?
```

**Type AI:** `query`
**Catégorie:**
Query/Medical
history
**Complexité:**
Moyenne
**Remarque:**
Nécessite recherche
dans l'historique

---

### 🔴 Exemple 24: Statistiques d'alimentation

```
Combien de fois Pablo a-t-il mangé cette semaine ?
```

**Type AI:** `query`
**Catégorie:**
Query/Analytics
**Complexité:**
Avancée
**Remarque:**
Nécessite analytics
non implémentées

---

### 🔴 Exemple 25: Coûts vétérinaires

```
Quel est le total des dépenses vétérinaires pour Luna cette année ?
```

**Type AI:** `query`
**Catégorie:**
Query/Expense
tracking
**Complexité:**
Avancée
**Remarque:**
Expense tracking
prévu pour Month 2-3

---

## 7️⃣ MODIFICATIONS & SUPPRESSIONS (Update/Delete)

### ✅ Exemple 26: Modification d'événement

```
Décaler le rendez-vous de Luna du 25 au 26 novembre
```

**Type AI:**
`updateEvent`
**Catégorie:** Event
Management
**Complexité:**
Moyenne

---

### ✅ Exemple 27: Suppression d'événement

```
Annuler le repas de Pablo de ce soir
```

**Type AI:**
`deleteEvent`
**Catégorie:** Event
Management
**Complexité:**
Basique

---

### 🔴 Exemple 28: Modification de récurrence

```
Changer la promenade de Pablo de 7h à 6h30 tous les matins à partir de lundi prochain
```

**Type AI:**
`updateEvent` avec
récurrence
**Catégorie:** Event
Management
**Complexité:**
Avancée
**Remarque:**
Modification de
récurrence complexe

---

## 8️⃣ CAS COMPLEXES & CONTEXTUELS

### 🔴 Exemple 29: Contexte multi-tâches

```
Ce weekend je pars en vacances, suspend tous les événements de Pablo et Luna sauf les médicaments
```

**Type AI:**
`updateEvent` (
multiple) + logique
conditionnelle
**Catégorie:** Event
Management
**Complexité:** Très
avancée
**Remarque:**
Nécessite gestion de
contexte avancée et
batch updates

---

### 🔴 Exemple 30: Intelligence contextuelle

```
Pablo semble fatigué ces derniers jours, que suggères-tu ?
```

**Type AI:**
`query` + AI
recommendations
**Catégorie:** AI
Assistant / Health
insights
**Complexité:** Très
avancée
**Remarque:**
Nécessite AI
conversationnelle
avancée et health
insights (Month 2-3)

---

## 📊 STATISTIQUES & ANALYSE

### Répartition par statut d'implémentation

| Statut                    | Nombre | Pourcentage |
|---------------------------|--------|-------------|
| ✅ Déjà supporté           | 12     | 40%         |
| 🟡 Partiellement supporté | 6      | 20%         |
| 🔴 Non implémenté         | 12     | 40%         |

### Répartition par catégorie

| Catégorie                 | Nombre d'exemples |
|---------------------------|-------------------|
| Feeding (Alimentation)    | 5                 |
| Medical (Santé/Médical)   | 5                 |
| Appointment (Rendez-vous) | 5                 |
| Training/Social           | 3                 |
| Pet Management            | 3                 |
| Query (Consultation)      | 4                 |
| Update/Delete             | 3                 |
| Cas complexes             | 2                 |

### Répartition par complexité

| Complexité   | Nombre | Pourcentage |
|--------------|--------|-------------|
| Basique      | 10     | 33%         |
| Moyenne      | 13     | 43%         |
| Avancée      | 5      | 17%         |
| Très avancée | 2      | 7%          |

---

## 🎯 RECOMMANDATIONS POUR LE MVP

### Priorité P0 - CRITIQUE (À implémenter avant le launch)

1. **Exemples 1-8**:
   Alimentation et
   médical basiques
    - Ces cas
      couvrent 80%
      des besoins
      quotidiens
    - Déjà largement
      supportés,
      nécessitent
      seulement des
      validations

2. **Exemples 11-12
   **: Rendez-vous
   basiques
    - Fonctionnalité
      essentielle
      pour la valeur
      ajoutée
    - Déjà
      implémentés

3. **Exemple 19**:
   Ajout d'animaux
    - Core feature,
      déjà
      fonctionnel

### Priorité P1 - HAUTE (MVP extended - Week 2-3)

4. **Exemples 13-14
   **: Rendez-vous
   avec rappels
    - Améliore
      l'expérience
      utilisateur
    - Nécessite
      système de
      notifications
      basique

5. **Exemples 22-23
   **: Requêtes
   simples
    - Permet de
      valider la
      compréhension
      contextuelle
      de l'AI
    - Type "query"
      existe mais
      nécessite
      implémentation
      backend

6. **Exemples 26-27
   **:
   Modifications/Suppressions
    - Déjà supporté
      mais nécessite
      amélioration
      UX

### Priorité P2 - MOYENNE (Month 2-3 features)

7. **Exemples 9-10,
   24-25**: Suivi
   avancé et
   analytics
    - Health
      insights et
      expense
      tracking
    - Mentionnés
      dans roadmap
      Month 2-3

8. **Exemples 16-18
   **: Training et
   Social
    - Types existent
      mais peu
      utilisés
    - Valeur ajoutée
      moyenne pour
      MVP

### Priorité P3 - BASSE (Future features)

9. **Exemples 29-30
   **: Intelligence
   contextuelle
   avancée
    - Nécessite AI
      conversationnelle
      avancée
    - Complexité
      technique
      élevée
    - Valeur ajoutée
      pour
      différenciation
      future

---

## 🧪 RECOMMANDATIONS DE TESTS

### Tests Alpha (Week 3-4)

Tester avec les **12
exemples déjà
supportés** (✅):

- Exemples 1-4, 6-8,
  11-12, 19, 26-27

**Critères de
succès:**

- 90% de
  reconnaissance
  correcte
- Création
  d'événements avec
  données exactes
- Gestion correcte
  des récurrences

### Tests Beta (Week 5-6)

Ajouter les **6
exemples
partiellement
supportés** (🟡):

- Exemples 4, 16,
  20, 22-23

**Critères de
succès:**

- 70% de
  reconnaissance
  correcte
- Fallback gracieux
  sur échecs
- Messages d'erreur
  clairs

### Tests Post-MVP (Month 2)

Implémenter
progressivement les
**12 exemples non
implémentés** (🔴):

- Focus sur P1:
  Exemples 13-14
- Focus sur P2:
  Exemples 9-10,
  17-18, 24-25

---

## 📝 PATTERNS DE COMMANDES IDENTIFIÉS

### Pattern 1: Action + Animal + Quantité + Timing

```
[Action] [Animal] [Quantité] [Timing]
"Nourrir Pablo 365gr demain matin"
```

### Pattern 2: Animal + Action + Fréquence

```
[Animal] [Action] [Fréquence]
"Pablo doit prendre son traitement tous les mois"
```

### Pattern 3: Rendez-vous + Animal + Date + Heure + Lieu

```
"Rendez-vous chez le vétérinaire pour Luna le 25 novembre à 14h30"
```

### Pattern 4: Ajout Animal + Attributs

```
"Ajouter un nouveau chien nommé Max, né le 15 mars 2023, race Labrador"
```

### Pattern 5: Query + Animal + Période/Critère

```
"Quels sont les rendez-vous de Pablo cette semaine ?"
```

### Pattern 6: Modification + Événement + Nouveau timing

```
"Décaler le rendez-vous de Luna du 25 au 26 novembre"
```

---

## 🚀 GUIDE D'IMPLÉMENTATION

### Phase 1: MVP Core (Week 1-2)

**Backend AI
Improvements:**

```typescript
// Améliorer la validation des patterns 1-3
// Ajouter support pour notes dans événements
// Améliorer parsing des quantités et unités
```

**Patterns à
supporter:**

- ✅ Pattern 1:
  Action + Animal +
  Quantité + Timing
- ✅ Pattern 2:
  Animal + Action +
  Fréquence
- ✅ Pattern 3:
  Rendez-vous +
  Date + Heure
- 🟡 Pattern 4: Ajout
  Animal (
  amélioration)

### Phase 2: MVP Extended (Week 3-4)

**Nouvelles
fonctionnalités:**

```typescript
// Implémenter type "query" properly
// Ajouter système de notifications basique
// Améliorer gestion multi-animaux
```

**Patterns à
supporter:**

- ✅ Pattern 5: Query
  basique
- ✅ Pattern 6:
  Modifications

### Phase 3: Post-MVP (Month 2-3)

**Features avancées:
**

```typescript
// Health insights & analytics
// Expense tracking
// Advanced AI context awareness
// Conditional logic
```

---

## 📚 RÉFÉRENCES

### Documents liés:

- [MVP Definition Document](../MVP_DEFINITION.md)
- [Types globaux](../../apps/web/src/types/global.d.ts)
- [OpenAI Service](../../apps/web/src/services/OpenAIService.tsx)
- [Event Types](../../apps/web/src/enums/EventTypes.ts)

### Codes sources pertinents:

-
`apps/web/src/services/EventService.ts` -
Gestion des
événements
-
`apps/web/src/services/ModelService.ts` -
Gestion des animaux
-
`apps/web/src/services/OpenAIService.tsx` -
Service AI

---

**Document Status:**
Ready for Review
**Next Steps:**

1. Valider les
   exemples avec
   l'équipe produit
2. Prioriser les
   patterns pour le
   MVP
3. Créer des user
   stories basées
   sur ces exemples
4. Définir les tests
   d'acceptance pour
   chaque pattern

**Contributeurs:**
Claude Code AI
Assistant
**Date de dernière
mise à jour:** 16
novembre 2025
