# PRD — Application de suivi de candidatures

**Version :** 0.2  
**Statut :** Draft  
**Auteur :** Steph  
**Date :** 19/06/2026  

---

## 1. Vision produit

L’application a pour objectif de centraliser le suivi des candidatures envoyées pendant la recherche d’emploi, afin de ne perdre aucune opportunité, aucun document et aucune information utile de préparation d’entretien.

Elle doit remplacer le suivi dispersé entre LinkedIn, emails, fichiers locaux et notes personnelles, en offrant un espace unique pour :
- enregistrer chaque offre,
- suivre l’évolution du statut,
- conserver les documents envoyés,
- préparer les entretiens avec une fiche entreprise évolutive [web:12][web:24][web:36].

---

## 2. Problème utilisateur

Lors d’une recherche d’emploi active, l’utilisateur peut postuler à de nombreuses offres en parallèle.  
Sans outil dédié, il devient difficile de savoir :
- à quelles offres il a déjà répondu,
- quel CV ou quelle lettre de motivation ont été envoyés,
- quand relancer,
- quelles informations préparer avant un entretien,
- quelles entreprises ont déjà répondu ou refusé [web:15][web:21][web:33].

---

## 3. Objectifs produit

### Objectifs principaux
- Centraliser toutes les candidatures dans une seule application.
- Suivre l’état de chaque candidature dans le temps.
- Conserver les documents envoyés par offre.
- Préparer les entretiens grâce à une fiche entreprise enrichissable.
- Permettre l’ajout de nouvelles sections de contenu sans refonte du modèle.

### Objectifs secondaires
- Réduire le temps passé à rechercher des informations dispersées.
- Améliorer la qualité de préparation aux entretiens.
- Donner une vision claire du pipeline de recherche d’emploi [web:36][web:39][web:44].

---

## 4. Utilisateurs cibles

### Persona principal
Un candidat en recherche active d’emploi, à l’aise avec les outils numériques, qui postule sur LinkedIn et d’autres sites.

### Besoins du persona principal
- Suivre ses candidatures avec précision.
- Retrouver les documents envoyés.
- Préparer les entretiens efficacement.
- Garder une vue globale de son avancement.

---

## 5. Périmètre

### Inclus dans la V1 fonctionnelle
- Création d’une candidature.
- Association à une entreprise.
- Enregistrement du lien de l’offre.
- Enregistrement de la date de candidature.
- Gestion d’un statut.
- Historique des changements de statut.
- Ajout du CV envoyé.
- Ajout de la lettre de motivation envoyée.
- Fiche entreprise.
- Section de préparation entretien modulaire.

### Hors périmètre initial
- Synchronisation automatique avec LinkedIn.
- Récupération automatique des données d’entreprise.
- IA de génération de contenu.
- Notifications avancées.
- Partage collaboratif multi-utilisateurs.

---

## 6. User stories

- En tant que candidat, je veux enregistrer une offre afin de suivre ma candidature.
- En tant que candidat, je veux associer une date à ma candidature afin d’avoir un historique fiable.
- En tant que candidat, je veux changer le statut d’une candidature afin de suivre son avancement.
- En tant que candidat, je veux conserver l’historique des statuts afin de retrouver les étapes du processus.
- En tant que candidat, je veux joindre le CV envoyé afin de savoir quelle version a été transmise.
- En tant que candidat, je veux joindre la lettre de motivation envoyée afin de retrouver le document exact.
- En tant que candidat, je veux préparer une fiche entreprise afin d’aborder l’entretien avec les bonnes informations.
- En tant que candidat, je veux ajouter des sections de contenu à la préparation afin d’adapter la fiche à chaque entreprise.

---

## 7. Fonctionnalités détaillées

### 7.1 Gestion des candidatures
Chaque candidature doit contenir :
- titre du poste,
- nom de l’entreprise,
- lien de l’offre,
- date de candidature,
- statut courant,
- notes libres.

### 7.2 Gestion des statuts
Statuts minimum :
- Envoyé
- Réponse reçue
- Entretien
- Refus

Le système doit :
- permettre la mise à jour manuelle du statut,
- conserver l’historique des changements,
- horodater chaque transition.

### 7.3 Gestion des documents
Chaque candidature doit pouvoir contenir :
- un CV envoyé,
- une lettre de motivation envoyée.

Le système doit permettre d’identifier clairement la version utilisée pour chaque candidature.

### 7.4 Fiche entreprise
Chaque entreprise doit pouvoir contenir :
- nom,
- site web,
- secteur,
- taille,
- chiffre d’affaires,
- organisation,
- valeurs,
- historique court,
- notes de préparation.

### 7.5 Préparation entretien évolutive
La préparation doit être structurée en sections modulaires, par exemple :
- chiffres clés,
- secteur et tendances,
- concurrents,
- valeurs et culture,
- faits historiques,
- questions à poser,
- points de vigilance.

L’utilisateur doit pouvoir ajouter de nouveaux types de section sans changer la structure centrale.

---

## 8. Exigences fonctionnelles

- Créer, modifier, consulter et supprimer une candidature.
- Lier une candidature à une entreprise.
- Enregistrer une URL d’offre.
- Enregistrer une date de candidature.
- Modifier le statut d’une candidature.
- Conserver l’historique des statuts.
- Ajouter au moins deux documents à une candidature.
- Ajouter plusieurs sections de préparation à une entreprise.
- Réordonner les sections.
- Rechercher ou filtrer les candidatures par statut, entreprise ou date.

---

## 9. Exigences non fonctionnelles

- L’application doit être simple à utiliser au quotidien.
- Les écrans principaux doivent être rapides.
- Les données doivent rester cohérentes entre les entités liées.
- La structure doit être extensible.
- Les fichiers doivent être accessibles facilement.
- L’expérience doit privilégier l’usage desktop en premier.

---

## 10. Roadmap MVP

### Phase 1 — Cadrage
Objectif : figer le besoin et le périmètre du MVP.
- Valider le modèle de données minimal.
- Valider les statuts de candidature.
- Définir les champs obligatoires.
- Définir les écrans prioritaires.

### Phase 2 — Socle fonctionnel
Objectif : permettre l’enregistrement complet d’une candidature.
- Création d’une candidature.
- Modification et suppression.
- Association à une entreprise.
- Ajout du lien d’offre.
- Ajout de la date de candidature.
- Gestion des statuts.

### Phase 3 — Documents
Objectif : tracer précisément ce qui a été envoyé.
- Upload ou association du CV.
- Upload ou association de la lettre de motivation.
- Visualisation des fichiers par candidature.
- Identification de la version envoyée.

### Phase 4 — Préparation entretien
Objectif : aider l’utilisateur à se préparer efficacement.
- Création de la fiche entreprise.
- Ajout des sections standards.
- Édition des contenus.
- Ajout dynamique de nouvelles sections.

### Phase 5 — Améliorations MVP
Objectif : renforcer la valeur d’usage.
- Recherche et filtres.
- Historique des statuts.
- Tri par date ou entreprise.
- Vue tableau de bord simple.

---

## 11. Priorisation MVP

### Must have
- Candidature.
- Statut.
- Lien d’offre.
- Date.
- CV et lettre joints.
- Fiche entreprise.
- Sections de préparation.

### Should have
- Historique des statuts.
- Recherche et filtres.
- Réorganisation des sections.

### Could have
- Rappels de relance.
- Tags.
- Notes enrichies.
- Statistiques simples.

### Won’t have pour le MVP
- Synchronisation LinkedIn.
- IA générative.
- Intégration calendrier.
- Partage externe.

---

## 12. Modèle de données cible

### Candidature
- id
- titre_poste
- entreprise_id
- url_offre
- date_candidature
- statut
- notes
- created_at
- updated_at

### DocumentCandidature
- id
- candidature_id
- type_document
- nom_fichier
- url_stockage
- version
- date_ajout

### HistoriqueStatut
- id
- candidature_id
- ancien_statut
- nouveau_statut
- date_changement
- commentaire

### Entreprise
- id
- nom
- site_web
- secteur
- taille
- chiffre_affaires
- organisation
- valeurs
- historique_court

### SectionPreparation
- id
- entreprise_id
- type_section
- titre
- contenu
- ordre
- actif

---

## 13. Critères d’acceptation

- Une candidature peut être créée avec les informations de base.
- Une candidature peut être reliée à une entreprise.
- Un statut peut être modifié.
- L’historique conserve les changements.
- Un CV et une lettre peuvent être associés à une candidature.
- Une entreprise peut contenir une fiche de préparation.
- De nouvelles sections peuvent être ajoutées sans changer la structure globale.

---

## 14. Risques

### Risques produit
- Le périmètre peut grossir trop vite.
- La préparation d’entretien peut devenir trop complexe pour une première version.
- L’utilisateur peut ne pas maintenir les données à jour s’il y a trop de friction.

### Risques fonctionnels
- Ambiguïté sur la gestion de plusieurs versions de CV ou lettres.
- Difficulté à définir un modèle de section assez flexible mais simple.
- Risque de redondance entre fiche entreprise et fiche candidature.

### Risques techniques
- Gestion du stockage des fichiers.
- Cohérence entre données de candidature, entreprise et documents.
- Évolutivité du modèle de sections.
- Préparation future d’une éventuelle synchronisation externe.

### Risques d’adoption
- Si la saisie manuelle est trop lourde, l’utilisateur peut abandonner.
- Si l’interface n’est pas très rapide, le produit perd son intérêt.
- Si le suivi de statut est trop rigide, il sera contourné.

### Mesures de mitigation
- Commencer par un MVP très resserré.
- Réduire le nombre de champs obligatoires.
- Prévoir un modèle de sections simple et extensible.
- Valider le besoin réel sur quelques candidatures pilotes.
- Garder l’UX centrée sur la rapidité de saisie.

---

## 15. Questions ouvertes

- Faut-il gérer plusieurs CV par candidature ?
- Faut-il permettre plusieurs lettres de motivation par candidature ?
- Faut-il ajouter un système de relance automatique ?
- Faut-il historiser aussi les modifications de contenu des sections ?
- Faut-il prévoir une vue calendrier des entretiens ?
- Faut-il une exportation PDF ou CSV ?

---

## 16. Hors périmètre

Cette version ne vise pas à remplacer un ATS complet.  
Elle ne cherche pas à automatiser toute la préparation d’entretien via IA.  
Elle reste centrée sur le suivi personnel des candidatures et la préparation associée.