# PRD — Application de suivi de candidatures

**Statut :** Draft  
**Auteur :** Steph  
**Date :** 12/06/2026  
**Version :** 0.1  

## 1. Contexte

La recherche d’emploi implique de suivre un grand nombre d’offres, de candidatures, de réponses et d’entretiens.  
Aujourd’hui, le suivi est souvent dispersé entre LinkedIn, emails, documents locaux et notes personnelles.  
L’objectif de ce produit est de centraliser toutes les informations liées à une candidature dans une seule application, avec un suivi clair du statut, des documents envoyés et de la préparation d’entretien [web:12][web:33].

## 2. Problème

Les candidats perdent facilement la trace des offres auxquelles ils ont postulé, des versions de CV ou de lettre envoyées, et des relances à effectuer.  
Il est également difficile de préparer efficacement un entretien sans rassembler au même endroit les informations clés sur l’entreprise, son secteur, ses concurrents et ses valeurs [web:19][web:25][web:27].  
LinkedIn propose un suivi simplifié des candidatures par étapes, mais il ne couvre pas totalement le besoin de préparation approfondie ni l’organisation des pièces jointes [web:12][web:7].

## 3. Objectifs

- Centraliser toutes les candidatures dans une seule interface.
- Suivre le statut de chaque candidature dans le temps.
- Stocker les documents envoyés pour chaque offre.
- Préparer les entretiens avec une fiche entreprise enrichissable.
- Permettre l’ajout futur de nouvelles sections de contenu dans la préparation entretien [web:28][web:30].

## 4. Utilisateurs cibles

### 4.1 Utilisateur principal
Candidat en recherche d’emploi, qui postule régulièrement à des offres et souhaite garder une vision claire de son pipeline de candidatures.

### 4.2 Utilisateurs secondaires
- Coach emploi ou mentor.
- Recruteur ou manager partageant un besoin similaire de suivi.
- Utilisateur souhaitant structurer sa préparation d’entretien.

## 5. Périmètre du produit

### 5.1 Inclus
- Création d’une fiche offre/candidature.
- Enregistrement du lien de l’offre.
- Enregistrement de la date de candidature.
- Gestion du statut de la candidature.
- Historique des changements de statut.
- Association du CV envoyé.
- Association de la lettre de motivation envoyée.
- Fiche entreprise liée à la candidature.
- Section de préparation entretien évolutive avec blocs de contenu ajoutables [web:12][web:21][web:24].

### 5.2 Hors périmètre initial
- Synchronisation automatique complète avec LinkedIn.
- Extraction automatique des données d’entreprise depuis des sources externes.
- Partage multi-utilisateur.
- Recommandations intelligentes de candidatures.
- IA de génération de réponses d’entretien.

## 6. User stories

- En tant que candidat, je veux enregistrer un lien d’offre afin de retrouver rapidement l’annonce.
- En tant que candidat, je veux associer une date à chaque candidature afin de suivre mon historique.
- En tant que candidat, je veux changer le statut d’une candidature afin de visualiser son avancement.
- En tant que candidat, je veux conserver l’historique des statuts afin de savoir quand une réponse ou un entretien a eu lieu.
- En tant que candidat, je veux joindre le CV envoyé afin de savoir exactement quelle version a été transmise.
- En tant que candidat, je veux joindre la lettre de motivation envoyée afin de conserver la version correspondante.
- En tant que candidat, je veux stocker des informations sur l’entreprise afin de mieux préparer l’entretien.
- En tant que candidat, je veux ajouter de nouvelles sections à la préparation entretien afin d’adapter le contenu à chaque entreprise.

## 7. Parcours utilisateur

1. L’utilisateur ajoute une nouvelle candidature.
2. Il renseigne le poste, l’entreprise, le lien de l’offre et la date de candidature.
3. Il associe les documents envoyés : CV et lettre de motivation.
4. Il sélectionne un statut initial, par exemple “Envoyé”.
5. Quand un retour arrive, il met à jour le statut : “Réponse reçue”, “Entretien”, ou “Refus”.
6. Il consulte la fiche entreprise pour préparer l’entretien.
7. Il enrichit la fiche avec les données utiles et les sections personnalisées.

## 8. Fonctionnalités détaillées

### 8.1 Gestion des candidatures
Chaque candidature doit contenir au minimum :
- Titre du poste.
- Nom de l’entreprise.
- Lien vers l’offre.
- Date de candidature.
- Statut courant.
- Notes libres.

### 8.2 Gestion des statuts
Les statuts minimum attendus sont :
- Envoyé.
- Réponse reçue.
- Entretien.
- Refus.

Le produit doit conserver un historique des changements de statut avec date et commentaire optionnel.  
Le statut doit pouvoir être modifié manuellement à tout moment.

### 8.3 Gestion des documents
Chaque candidature doit permettre d’associer :
- Le CV envoyé.
- La lettre de motivation envoyée.

Le système doit permettre d’identifier clairement quelle version a été envoyée pour une candidature donnée.

### 8.4 Fiche entreprise
Chaque entreprise liée à une candidature doit pouvoir contenir :
- Nom.
- Site web.
- Secteur.
- Taille.
- Chiffre d’affaires.
- Organisation.
- Valeurs.
- Historique court.
- Notes de préparation.

### 8.5 Préparation entretien évolutive
La fiche de préparation doit être composée de sections modulaires, par exemple :
- Chiffres clés.
- Secteur et tendances.
- Concurrents.
- Valeurs et culture.
- Faits historiques.
- Questions à poser.
- Points de vigilance.

L’utilisateur doit pouvoir ajouter de nouvelles sections sans modifier la structure globale du produit.

## 9. Exigences fonctionnelles

- Le système doit permettre de créer, modifier, consulter et supprimer une candidature.
- Le système doit permettre d’associer une candidature à une entreprise.
- Le système doit permettre d’enregistrer un lien d’offre.
- Le système doit permettre de stocker la date de candidature.
- Le système doit permettre de mettre à jour un statut de candidature.
- Le système doit conserver un historique des statuts.
- Le système doit permettre d’ajouter au moins deux pièces jointes par candidature.
- Le système doit permettre de créer plusieurs sections de contenu par entreprise.
- Le système doit permettre d’ajouter, éditer, réordonner et supprimer ces sections.
- Le système doit permettre de retrouver rapidement les candidatures par statut, entreprise ou date.

## 10. Exigences non fonctionnelles

- L’application doit être simple à utiliser au quotidien.
- Le temps de chargement des listes doit rester court.
- Les données liées à une candidature doivent rester cohérentes entre elles.
- Les pièces jointes doivent être accessibles facilement.
- L’application doit être conçue pour évoluer sans refonte majeure du modèle de données.
- L’interface doit rester lisible sur desktop en priorité.

## 11. Modèle de données cible

### Entité `Candidature`
- id
- titre_poste
- entreprise_id
- url_offre
- date_candidature
- statut
- notes
- created_at
- updated_at

### Entité `DocumentCandidature`
- id
- candidature_id
- type_document
- nom_fichier
- url_stockage
- version
- date_ajout

### Entité `HistoriqueStatut`
- id
- candidature_id
- ancien_statut
- nouveau_statut
- date_changement
- commentaire

### Entité `Entreprise`
- id
- nom
- site_web
- secteur
- taille
- chiffre_affaires
- organisation
- valeurs
- historique_court

### Entité `SectionPreparation`
- id
- entreprise_id
- type_section
- titre
- contenu
- ordre
- actif

## 12. Critères d’acceptation

- Une candidature peut être créée avec un lien d’offre et une date.
- Une candidature peut passer d’un statut à un autre.
- L’historique des statuts est visible.
- Le CV et la lettre de motivation sont attachés à la candidature.
- La fiche entreprise contient des informations utiles à la préparation d’entretien.
- De nouvelles sections de contenu peuvent être ajoutées sans modifier le modèle principal.
- L’utilisateur peut retrouver facilement chaque candidature et ses documents associés.

## 13. KPI de succès

- 100 % des candidatures sont enregistrées avec un lien et une date.
- 100 % des candidatures disposent d’un statut.
- Au moins 90 % des candidatures ont leurs documents associés.
- Réduction du temps passé à retrouver un CV ou une lettre envoyée.
- Réduction des oublis de relance et des candidatures non suivies.

## 14. Hypothèses

- L’utilisateur renseigne manuellement les informations de candidature.
- Les documents sont déposés ou sélectionnés localement.
- La préparation d’entretien est alimentée progressivement.
- Les informations de l’entreprise peuvent être saisies manuellement au départ.

## 15. Dépendances

- Stockage des fichiers.
- Gestion d’authentification si le produit devient multi-utilisateur.
- Choix d’une base de données adaptée aux relations entre candidatures, documents et sections.
- Éventuelle intégration future avec LinkedIn ou d’autres sources.

## 16. Questions ouvertes

- Faut-il une synchronisation partielle avec LinkedIn ?
- Faut-il autoriser plusieurs CV par candidature ?
- Faut-il prévoir des rappels automatiques de relance ?
- Faut-il gérer plusieurs entreprises pour une même candidature ?
- Faut-il ajouter des tags ou priorités sur les candidatures ?

## 17. Hors périmètre

Ce produit ne vise pas, dans sa première version, à remplacer un ATS complet.  
Il ne couvre pas non plus la génération automatique de contenu d’entretien ni l’analyse avancée de marché.  
L’objectif initial reste un outil personnel de suivi et de préparation de candidatures [web:21][web:24][web:32].
