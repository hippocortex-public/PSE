# Schéma de la Base de Données - PSE Application

## 🗃 Vue d'Ensemble

L'application PSE utilise **MongoDB** comme base de données NoSQL. MongoDB est particulièrement adapté pour ce projet grâce à :

- **Flexibilité du schéma** : Permet d'ajouter facilement de nouveaux champs
- **Documents embarqués** : Idéal pour les sections de préparation modulaires
- **Références entre collections** : Pour lier candidatures et entreprises
- **Indexation** : Optimisation des requêtes fréquentes

---

## 📊 Collections Principales

### 1. Collection `candidatures`

**Description** : Stocke toutes les informations relatives aux candidatures des utilisateurs.

#### Schéma

```javascript
{
  // Identifiant unique généré par MongoDB
  _id: ObjectId,
  
  // Informations de base
  titre_poste: {
    type: String,
    required: true,
    trim: true,
    description: "Titre du poste pour lequel l'utilisateur a postulé"
  },
  
  entreprise_id: {
    type: ObjectId,
    ref: 'Entreprise',
    required: true,
    description: "Référence à l'entreprise associée"
  },
  
  url_offre: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: /^https?:\/\/.+/,
      message: "L'URL doit être valide"
    },
    description: "Lien vers l'offre d'emploi"
  },
  
  date_candidature: {
    type: Date,
    required: true,
    default: Date.now,
    description: "Date à laquelle la candidature a été envoyée"
  },
  
  statut: {
    type: String,
    enum: ['Envoyé', 'Réponse reçue', 'Entretien', 'Refus'],
    default: 'Envoyé',
    description: "Statut actuel de la candidature"
  },
  
  notes: {
    type: String,
    trim: true,
    description: "Notes supplémentaires de l'utilisateur"
  },
  
  // Documents joints (CV, lettre de motivation)
  documents: [
    {
      _id: ObjectId,
      type_document: {
        type: String,
        enum: ['CV', 'Lettre de motivation'],
        required: true
      },
      nom_fichier: {
        type: String,
        required: true,
        description: "Nom original du fichier"
      },
      chemin_fichier: {
        type: String,
        required: true,
        description: "Chemin relatif vers le fichier stocké (ex: /uploads/cv-123.pdf)"
      },
      version: {
        type: String,
        default: '1.0',
        description: "Version du document"
      },
      date_ajout: {
        type: Date,
        default: Date.now,
        description: "Date à laquelle le document a été ajouté"
      }
    }
  ],
  
  // Historique des changements de statut
  historique_statut: [
    {
      _id: ObjectId,
      ancien_statut: {
        type: String,
        enum: ['Envoyé', 'Réponse reçue', 'Entretien', 'Refus'],
        description: "Peut être null pour la création initiale"
      },
      nouveau_statut: {
        type: String,
        enum: ['Envoyé', 'Réponse reçue', 'Entretien', 'Refus'],
        required: true
      },
      date_changement: {
        type: Date,
        default: Date.now
      },
      commentaire: {
        type: String,
        trim: true,
        description: "Commentaire optionnel sur le changement"
      }
    }
  ],
  
  // Timestamps automatiques
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

#### Index

```javascript
// Index pour optimiser les requêtes
candidatureSchema.index({ entreprise_id: 1 });      // Filtre par entreprise
candidatureSchema.index({ statut: 1 });             // Filtre par statut
candidatureSchema.index({ date_candidature: -1 }); // Tri par date (descendant)
```

#### Exemple de Document

```json
{
  "_id": ObjectId("60d5ec9f8b3a8b0015f1b2a1"),
  "titre_poste": "Développeur Full Stack",
  "entreprise_id": ObjectId("60d5ec9f8b3a8b0015f1b2b1"),
  "url_offre": "https://entreprise.com/offres/dev-fullstack",
  "date_candidature": ISODate("2026-06-15T10:00:00Z"),
  "statut": "Envoyé",
  "notes": "Poste très intéressant avec des technologies modernes",
  "documents": [
    {
      "_id": ObjectId("60d5ec9f8b3a8b0015f1b2c1"),
      "type_document": "CV",
      "nom_fichier": "cv_jean_dupont.pdf",
      "chemin_fichier": "/uploads/cv-1234567890123.pdf",
      "version": "2.0",
      "date_ajout": ISODate("2026-06-15T10:30:00Z")
    },
    {
      "_id": ObjectId("60d5ec9f8b3a8b0015f1b2c2"),
      "type_document": "Lettre de motivation",
      "nom_fichier": "lettre_google.docx",
      "chemin_fichier": "/uploads/lettre-1234567890456.docx",
      "version": "1.0",
      "date_ajout": ISODate("2026-06-15T10:35:00Z")
    }
  ],
  "historique_statut": [
    {
      "_id": ObjectId("60d5ec9f8b3a8b0015f1b2d1"),
      "ancien_statut": null,
      "nouveau_statut": "Envoyé",
      "date_changement": ISODate("2026-06-15T10:00:00Z"),
      "commentaire": "Création de la candidature"
    },
    {
      "_id": ObjectId("60d5ec9f8b3a8b0015f1b2d2"),
      "ancien_statut": "Envoyé",
      "nouveau_statut": "Réponse reçue",
      "date_changement": ISODate("2026-06-16T14:00:00Z"),
      "commentaire": "Réponse positive par email"
    }
  ],
  "createdAt": ISODate("2026-06-15T10:00:00Z"),
  "updatedAt": ISODate("2026-06-16T14:00:00Z")
}
```

---

### 2. Collection `entreprises`

**Description** : Stocke les informations sur les entreprises et leurs sections de préparation d'entretien.

#### Schéma

```javascript
{
  // Identifiant unique généré par MongoDB
  _id: ObjectId,
  
  // Informations de base
  nom: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    description: "Nom unique de l'entreprise"
  },
  
  site_web: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Champ optionnel
        return /^https?:\/\/.+/.test(v);
      },
      message: "L'URL doit être valide"
    },
    description: "Site web de l'entreprise"
  },
  
  secteur: {
    type: String,
    trim: true,
    description: "Secteur d'activité de l'entreprise"
  },
  
  taille: {
    type: String,
    trim: true,
    description: "Taille de l'entreprise (ex: '10-50 employés')"
  },
  
  chiffre_affaires: {
    type: String,
    trim: true,
    description: "Chiffre d'affaires de l'entreprise"
  },
  
  organisation: {
    type: String,
    trim: true,
    description: "Description de l'organisation"
  },
  
  valeurs: {
    type: String,
    trim: true,
    description: "Valeurs de l'entreprise"
  },
  
  historique_court: {
    type: String,
    trim: true,
    description: "Historique court de l'entreprise"
  },
  
  // Sections de préparation d'entretien (modulaires)
  sections_preparation: [
    {
      _id: ObjectId,
      type_section: {
        type: String,
        required: true,
        trim: true,
        description: "Type de la section (ex: 'Chiffres clés', 'Concurrents')"
      },
      titre: {
        type: String,
        required: true,
        trim: true,
        description: "Titre de la section"
      },
      contenu: {
        type: String,
        required: true,
        trim: true,
        description: "Contenu de la section"
      },
      ordre: {
        type: Number,
        required: true,
        default: 0,
        description: "Ordre d'affichage"
      },
      actif: {
        type: Boolean,
        default: true,
        description: "Si la section est active/visible"
      }
    }
  ],
  
  // Timestamps automatiques
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

#### Index

```javascript
// Index pour optimiser les requêtes
entrepriseSchema.index({ nom: 1 });          // Recherche par nom
entrepriseSchema.index({ secteur: 1 });      // Filtre par secteur
```

#### Exemple de Document

```json
{
  "_id": ObjectId("60d5ec9f8b3a8b0015f1b2b1"),
  "nom": "Google",
  "site_web": "https://www.google.com",
  "secteur": "Technologie",
  "taille": "10000+ employés",
  "chiffre_affaires": "256.74 milliards $ (2023)",
  "organisation": "Société multinationale spécialisée dans les services technologiques",
  "valeurs": "Innovation, Collaboration, Ouverture, Respect, Excellence",
  "historique_court": "Fondée en 1998 par Larry Page et Sergey Brin à Stanford. Devenue un géant de la technologie avec des produits comme le moteur de recherche, Android, YouTube, etc.",
  "sections_preparation": [
    {
      "_id": ObjectId("60d5ec9f8b3a8b0015f1b2e1"),
      "type_section": "Chiffres clés",
      "titre": "Chiffre d'affaires 2023",
      "contenu": "256.74 milliards de dollars",
      "ordre": 0,
      "actif": true
    },
    {
      "_id": ObjectId("60d5ec9f8b3a8b0015f1b2e2"),
      "type_section": "Secteur et tendances",
      "titre": "Positionnement marché",
      "contenu": "Leader mondial de la publicité en ligne et des services cloud. Forte croissance dans l'IA et le machine learning.",
      "ordre": 1,
      "actif": true
    },
    {
      "_id": ObjectId("60d5ec9f8b3a8b0015f1b2e3"),
      "type_section": "Concurrents",
      "titre": "Principaux concurrents",
      "contenu": "Microsoft (Bing, Azure), Amazon (AWS, publicité), Meta (Facebook, Instagram), Apple (Siri, services)",
      "ordre": 2,
      "actif": true
    },
    {
      "_id": ObjectId("60d5ec9f8b3a8b0015f1b2e4"),
      "type_section": "Valeurs et culture",
      "titre": "Culture d'entreprise",
      "contenu": "Culture axée sur l'innovation avec des avantages comme les '20% time', les repas gratuits, les espaces de travail collaboratifs.",
      "ordre": 3,
      "actif": true
    },
    {
      "_id": ObjectId("60d5ec9f8b3a8b0015f1b2e5"),
      "type_section": "Questions à poser",
      "titre": "Questions pour l'entretien",
      "contenu": "1. Quels sont les défis techniques actuels de l'équipe?\n2. Comment est structurée la collaboration entre les équipes?\n3. Quelles sont les opportunités de formation?",
      "ordre": 4,
      "actif": true
    }
  ],
  "createdAt": ISODate("2026-06-14T09:00:00Z"),
  "updatedAt": ISODate("2026-06-15T15:30:00Z")
}
```

---

## 🔗 Relations entre Collections

### Relation Candidature → Entreprise

- **Type** : Référence (Reference)
- **Champ** : `candidature.entreprise_id` → `entreprise._id`
- **Cardinalité** : Une candidature appartient à une seule entreprise (1:1)
- **Population** : Utilisation de `.populate('entreprise_id')` pour récupérer les données de l'entreprise

```javascript
// Exemple de population dans le backend
const candidature = await Candidature.findById(id)
  .populate('entreprise_id', 'nom secteur site_web')
  .exec();
```

### Relation Entreprise → Sections de Préparation

- **Type** : Embedding (sous-document)
- **Champ** : `entreprise.sections_preparation` (tableau de sous-documents)
- **Avantages** : 
  - Lecture atomique (toutes les sections sont récupérées avec l'entreprise)
  - Pas besoin de jointure
  - Performances optimales pour les requêtes fréquentes

---

## 📈 Optimisations

### 1. Indexation

Les index suivants sont créés pour optimiser les requêtes :

```javascript
// Pour les candidatures
candidatureSchema.index({ entreprise_id: 1 });      // Filtre par entreprise
candidatureSchema.index({ statut: 1 });             // Filtre par statut
candidatureSchema.index({ date_candidature: -1 }); // Tri par date (descendant)

// Pour les entreprises
entrepriseSchema.index({ nom: 1 });                 // Recherche par nom
entrepriseSchema.index({ secteur: 1 });             // Filtre par secteur
```

### 2. Pagination

Toutes les listes (candidatures, entreprises) supportent la pagination :

```javascript
// Exemple de requête avec pagination
const candidatures = await Candidature.find(query)
  .sort({ date_candidature: -1 })
  .limit(parseInt(limit))
  .skip((parseInt(page) - 1) * parseInt(limit))
  .exec();
```

### 3. Tri

Les résultats sont triés par défaut :
- Candidatures : par `date_candidature` (descendant)
- Entreprises : par `nom` (ascendant)
- Sections : par `ordre` (ascendant)

---

## 🔄 Opérations Courantes

### 1. Créer une Candidature

```javascript
const nouvelleCandidature = new Candidature({
  titre_poste: "Développeur Frontend",
  entreprise_id: ObjectId("60d5ec9f8b3a8b0015f1b2b1"),
  url_offre: "https://entreprise.com/offre",
  date_candidature: new Date(),
  statut: "Envoyé",
  historique_statut: [
    {
      ancien_statut: null,
      nouveau_statut: "Envoyé",
      date_changement: new Date(),
      commentaire: "Création de la candidature"
    }
  ]
});

await nouvelleCandidature.save();
```

### 2. Mettre à jour le Statut

```javascript
const candidature = await Candidature.findById(id);
candidature.historique_statut.push({
  ancien_statut: candidature.statut,
  nouveau_statut: "Réponse reçue",
  date_changement: new Date(),
  commentaire: "Réponse positive par email"
});
candidature.statut = "Réponse reçue";
await candidature.save();
```

### 3. Ajouter un Document

```javascript
const candidature = await Candidature.findById(id);
candidature.documents.push({
  type_document: "CV",
  nom_fichier: "cv.pdf",
  chemin_fichier: "/uploads/cv-1234567890.pdf",
  version: "1.0"
});
await candidature.save();
```

### 4. Ajouter une Section de Préparation

```javascript
const entreprise = await Entreprise.findById(id);
const nouvelOrdre = entreprise.sections_preparation.length > 0
  ? Math.max(...entreprise.sections_preparation.map(s => s.ordre)) + 1
  : 0;

entreprise.sections_preparation.push({
  type_section: "Points de vigilance",
  titre: "À surveiller",
  contenu: "Vérifier la politique de télétravail",
  ordre: nouvelOrdre,
  actif: true
});

// Trier par ordre
entreprise.sections_preparation.sort((a, b) => a.ordre - b.ordre);
await entreprise.save();
```

---

## 📊 Statistiques et Requêtes Utiles

### 1. Nombre de Candidatures par Statut

```javascript
const stats = await Candidature.aggregate([
  {
    $group: {
      _id: "$statut",
      count: { $sum: 1 }
    }
  }
]);
// Résultat: [{ _id: 'Envoyé', count: 5 }, { _id: 'Entretien', count: 2 }, ...]
```

### 2. Candidatures par Entreprise

```javascript
const stats = await Candidature.aggregate([
  {
    $group: {
      _id: "$entreprise_id",
      count: { $sum: 1 }
    }
  },
  {
    $lookup: {
      from: "entreprises",
      localField: "_id",
      foreignField: "_id",
      as: "entreprise"
    }
  },
  {
    $unwind: "$entreprise"
  },
  {
    $project: {
      entreprise: "$entreprise.nom",
      count: 1
    }
  }
]);
```

### 3. Candidatures Récentes

```javascript
const recent = await Candidature.find()
  .sort({ date_candidature: -1 })
  .limit(5)
  .populate('entreprise_id', 'nom')
  .exec();
```

### 4. Entreprises avec le plus de Candidatures

```javascript
const topEntreprises = await Candidature.aggregate([
  {
    $group: {
      _id: "$entreprise_id",
      count: { $sum: 1 }
    }
  },
  {
    $sort: { count: -1 }
  },
  {
    $limit: 5
  },
  {
    $lookup: {
      from: "entreprises",
      localField: "_id",
      foreignField: "_id",
      as: "entreprise"
    }
  }
]);
```

---

## 🔧 Maintenance

### 1. Sauvegarde

Pour sauvegarder la base de données MongoDB :

```bash
# Avec mongodump (dans le conteneur)
docker exec pse-mongodb mongodump --out /backup/$(date +%Y-%m-%d) --db pse-app

# Copier la sauvegarde localement
docker cp pse-mongodb:/backup /host/backup/path
```

### 2. Restauration

```bash
# Copier la sauvegarde dans le conteneur
docker cp /host/backup/path pse-mongodb:/backup

# Restaurer avec mongorestore
docker exec pse-mongodb mongorestore --db pse-app /backup/2026-06-15/pse-app
```

### 3. Nettoyage des Documents Orphelins

```javascript
// Trouver les documents dont la candidature n'existe plus
const candidatures = await Candidature.find();
const validCandidatureIds = candidatures.map(c => c._id.toString());

// Supprimer les fichiers dans /uploads qui ne sont pas référencés
// (À implémenter avec fs et une vérification des chemins)
```

---

## 🎯 Bonnes Pratiques

### 1. Nommage

- Utiliser des noms **clairs et descriptifs** pour les champs
- **Éviter les abréviations** sauf si largement comprises
- Utiliser **camelCase** pour les noms de champs
- Utiliser **PascalCase** pour les noms de modèles

### 2. Types de Données

- **String** : Pour le texte, URLs, identifiants
- **Number** : Pour les nombres (éviter pour les identifiants)
- **Date** : Pour les dates et heures
- **Boolean** : Pour les flags (actif/inactif)
- **ObjectId** : Pour les références à d'autres documents
- **Array** : Pour les listes de sous-documents

### 3. Validation

- Toujours **valider les données** côté backend
- Utiliser les **validateurs Mongoose** pour les champs critiques
- Ajouter des **messages d'erreur clairs**

### 4. Index

- Créer des **index** pour les champs fréquemment interrogés
- Éviter les **index inutiles** qui ralentissent les écritures
- Utiliser des **index composés** pour les requêtes complexes

### 5. Embedding vs Referencing

| Critère | Embedding | Referencing |
|---------|-----------|-------------|
| **Lecture** | ✅ Rapide (1 requête) | ❌ Multiple requêtes |
| **Écriture** | ❌ Lente (document volumineux) | ✅ Rapide |
| **Taille** | ❌ Document peut grossir | ✅ Documents séparés |
| **Flexibilité** | ❌ Moins flexible | ✅ Plus flexible |
| **Cas d'usage** | Données fréquemment accédées ensemble | Données rarement accédées ensemble |

**Dans PSE** :
- **Embedding** : Sections de préparation (toujours accédées avec l'entreprise)
- **Referencing** : Candidatures → Entreprises (une entreprise peut avoir plusieurs candidatures)

---

## 📁 Stockage des Fichiers

### Structure

```
backend/
└── uploads/
    ├── cv-1234567890123.pdf
    ├── lettre-1234567890456.docx
    ├── cv-1234567891234.pdf
    └── lettre-1234567891567.docx
```

### Nommage

Les fichiers sont nommés selon le pattern :
```
{fieldname}-{timestamp}-{random}.{extension}
```

Exemple : `document-1718123456789-123456789.pdf`

### Sécurité

- **Types autorisés** : PDF, DOC, DOCX uniquement
- **Taille max** : 5 Mo
- **Validation** : Vérification du MIME type et de l'extension
- **Accès** : Via route statique `/uploads/{filename}`

---

## 🔮 Évolution Future

### 1. Ajout de l'Authentification

```javascript
// Schéma User à ajouter
{
  _id: ObjectId,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nom: String,
  prenom: String,
  createdAt: Date,
  updatedAt: Date
}

// Ajout de user_id dans les candidatures et entreprises
candidatureSchema.add({
  user_id: { type: ObjectId, ref: 'User', required: true }
});

entrepriseSchema.add({
  user_id: { type: ObjectId, ref: 'User', required: true }
});
```

### 2. Multi-utilisateurs

- Ajouter un champ `user_id` à toutes les collections
- Implémenter un middleware d'authentification
- Filtrer les requêtes par `user_id`

### 3. Synchronisation avec LinkedIn

- Ajouter un champ `linkedin_id` aux candidatures
- Stocker les données synchronisées depuis LinkedIn
- Implémenter un système de synchronisation périodique

### 4. Tags et Catégories

```javascript
candidatureSchema.add({
  tags: [String],  // Ex: ['urgent', 'intéressant', 'remote']
  priorite: { type: Number, enum: [1, 2, 3, 4, 5] }
});
```

### 5. Rappels et Notifications

```javascript
candidatureSchema.add({
  rappels: [
    {
      date: Date,
      type: String,  // Ex: 'relance', 'entretien'
      message: String,
      notifie: { type: Boolean, default: false }
    }
  ]
});
```
