# GastonApp – Rapport des 50 messages utilisateur et leur classification

## 1. Résumé
Ce document regroupe 50 exemples réels de messages qu’un utilisateur pourrait envoyer à un chatbot intégré à une application comme *GastonApp*, ainsi que leur classification par type (intent), et leur famille fonctionnelle.

---

## 2. Les 50 messages (liste brute)
1. Ajoute un rappel pour le vaccin annuel de Rex le 12 mars.
2. Enregistre que Bella a eu son vermifuge aujourd’hui.
3. Quelle quantité de croquettes donner à Luna si elle pèse 4,5 kg ?
4. Programme un rappel pour laver les dents de Tom chaque dimanche.
5. Mets Simba en inactif.
6. Ajoute un rendez-vous vétérinaire pour Mimi jeudi à 16h.
7. Montre-moi l’évolution du poids de Max sur les 6 derniers mois.
8. Quelle est la date du dernier bain de Nala ?
9. Ajoute un soin : coupe des griffes pour Cleo aujourd’hui.
10. Change la photo de Mochi avec cette URL.
11. Montre-moi les tâches prévues cette semaine pour mes animaux.
12. Est-ce qu’un chat Bengal peut manger du saumon ?
13. Ajoute une nouvelle race : Spitz nain.
14. Crée un menu alimentaire pour Rex.
15. Rappelle-moi d’acheter des croquettes dans 3 jours.
16. Quels soins recommandés pour un chat Persan ?
17. Mets Shadow en statut « décédé ».
18. Liste-moi tous mes animaux actifs.
19. Trouve un vétérinaire proche de Waremme.
20. Rappelle-moi la race de Bella.
21. Ajoute un événement : toilettage de Lucy samedi.
22. Mes chiens ont-ils dépassé leurs vaccins ?
23. Liste des aliments toxiques pour un Golden.
24. Modifie la date de naissance de Mimi.
25. Ajoute une mesure de poids pour Rex.
26. Mon chat perd beaucoup de poils, est-ce normal ?
27. Crée une tâche récurrente : litière de Luna tous les deux jours.
28. Classe mes animaux du plus jeune au plus vieux.
29. Envoie-moi un récap des traitements de Max.
30. Supprime le rendez-vous de Tom aujourd’hui.
31. J’ai adopté un nouveau chien, aide-moi à remplir sa fiche.
32. Montre uniquement les chats.
33. Montre-moi les dernières photos ajoutées.
34. Active le mode carte pour l’affichage des animaux.
35. Mets en favori les soins importants pour Nala.
36. Je veux imprimer le calendrier des soins du mois.
37. Quelle est la prochaine tâche prévue pour Lucy ?
38. Est-ce que Cleo a des traitements en retard ?
39. Filtre mes animaux : chiens seulement.
40. Ajoute pipette antiparasitaire pour Simba demain.
41. Quel âge a Rex aujourd’hui ?
42. Active une alerte quand un vaccin arrive bientôt.
43. Crée un checkup complet vétérinaire pour janvier.
44. Le poids de Mochi est-il normal pour sa race ?
45. Montre-moi les tâches récemment supprimées.
46. Archive Bella, elle est chez mes parents.
47. Ajoute un mémo : acheter de la pâtée pour Luna.
48. Exporter la fiche de Max en PDF.
49. Ajoute une note : Rex est léthargique aujourd’hui.
50. Liste les soins recommandés pour tous mes animaux ce mois-ci.

---

## 3. Classification des messages par type (Intent)

### **A. PetProfile (gestion de fiche)**
- 5, 10, 18, 20, 24, 31, 32, 33, 34, 46, 48

### **B. HealthCare (soins et santé)**
- 2, 9, 12, 16, 17, 22, 23, 26, 29, 38, 40, 42, 43, 49, 50

### **C. Scheduling (rendez-vous, rappels, calendrier)**
- 1, 4, 6, 11, 14, 15, 21, 27, 30, 36, 37

### **D. Nutrition (menus, alimentation)**
- 3, 12, 14, 15, 23, 47

### **E. Metrics (poids, mesures, évolution)**
- 7, 25, 41, 44

### **F. Tasks (tâches et récurrence)**
- 11, 27, 29, 37, 45, 50

### **G. Knowledge (questions, conseils)**
- 3, 12, 16, 23, 26, 44

### **H. ExternalServices (vétérinaires, toilettage, services)**
- 6, 19, 21

### **I. UserOrganization (notes, mémos, exports)**
- 29, 36, 47, 48

### **J. GlobalOverview (vision multi-animaux)**
- 11, 18, 28, 50

---

## 4. Synthèse par familles fonctionnelles
| Famille | Description | Exemples |
|--------|-------------|----------|
| **PetProfile** | Gestion de la fiche d’un animal | Modifier la fiche, changer la photo |
| **HealthCare** | Soins, traitements, vaccins, santé | Vermifuge, vaccins, checkup |
| **Scheduling** | Événements, rappels, agenda | Rendez-vous vétérinaire |
| **Nutrition** | Alimentation, menus, quantités | Croquettes, aliments toxiques |
| **Metrics** | Poids, mesures | Évolution du poids |
| **Tasks** | Tâches simples ou récurrentes | Nettoyer la litière |
| **Knowledge** | Questions générales | Conseils de race, comportement |
| **ExternalServices** | Trouver un pro | Vétérinaires, toiletteurs |
| **UserOrganization** | Notes et gestion perso | Exports, mémos |
| **GlobalOverview** | Vue d’ensemble | Soins de tous les animaux |

---

## 5. Conclusion
Ce fichier permet d’utiliser les exemples comme base d’entraînement, comme référentiel d’intentions ou comme matrice de classification pour les réponses du chatbot dans GastonApp.

