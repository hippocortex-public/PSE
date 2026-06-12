# Architecture de l'Application PSE

## 🏗 Vue d'Ensemble

L'application PSE (Suivi de Candidatures) suit une **architecture client-serveur découplée** avec les composants suivants :

```
┌─────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Frontend)                            │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                     Application React (Vite)                       │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌───────────────────────────┐  │ │
│  │  │   Pages     │  │ Components  │  │       Services (Axios)      │  │ │
│  │  │             │  │             │  │                               │  │ │
│  │  │ - Dashboard │  │ - Table     │  │ - api.js (Appels API)       │  │ │
│  │  │ - Candidature│  │ - Form      │  │ - Auth (futur)              │  │ │
│  │  │ - Entreprise│  │ - Card      │  │                               │  │ │
│  │  └─────────────┘  └─────────────┘  └───────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                    │                                    │
│                                    ▼                                    │
└─────────────────────────────────────────────────────────────────────┘
                                HTTP/HTTPS
┌─────────────────────────────────────────────────────────────────────┐
│                              SERVEUR (Backend)                            │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                      API Node.js (Express)                         │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌───────────────────────────┐  │ │
│  │  │   Routes    │  │ Controllers │  │        Middlewares         │  │ │
│  │  │             │  │             │  │                               │  │ │
│  │  │ - /candidat │  │ - candidat  │  │ - uploadMiddleware.js      │  │ │
│  │  │ - /entrepri │  │ - entreprise│  │ - cors                    │  │ │
│  │  │ - /upload   │  │             │  │ - errorHandler             │  │ │
│  │  └─────────────┘  └─────────────┘  └───────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                    │                                    │
│                                    ▼                                    │
└─────────────────────────────────────────────────────────────────────┘
                                MongoDB
┌─────────────────────────────────────────────────────────────────────┐
│                           BASE DE DONNÉES (MongoDB)                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                         Collections                                │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │ │
│  │  │   Candidatures   │  │    Entreprises   │  │   (Embedded)     │    │ │
│  │  │                 │  │                 │  │                 │    │ │
│  │  │ - titre_poste   │  │ - nom           │  │ - documents      │    │ │
│  │  │ - entreprise_id │  │ - secteur       │  │ - historique_    │    │ │
│  │  │ - url_offre     │  │ - site_web      │  │   statut         │    │ │
│  │  │ - date_cand.    │  │ - taille        │  │                 │    │ │
│  │  │ - statut        │  │ - ca            │  │ - sections_      │    │ │
│  │  │ - notes         │  │ - organisation  │  │   preparation    │    │ │
│  │  │ - documents[]   │  │ - valeurs       │  │                 │    │ │
│  │  │ - historique[]  │  │ - historique    │  │                 │    │ │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘    │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Composants Principaux

### 1. Frontend (React + Vite)

#### Structure des Dossiers
```
frontend/
├── index.html              # Point d'entrée HTML
├── vite.config.js          # Configuration Vite (proxy API)
├── package.json            # Dépendances et scripts
├── Dockerfile              # Conteneurisation
└── src/
    ├── main.jsx            # Point d'entrée React
    ├── index.css           # Styles globaux
    ├── App.jsx             # Routing principal
    ├── services/
    │   └── api.js          # Appels API avec Axios
    └── pages/
        ├── CandidaturesList.jsx     # Liste des candidatures
        ├── CandidatureDetail.jsx    # Détails d'une candidature
        ├── CandidatureForm.jsx     # Formulaire de candidature
        ├── EntreprisesList.jsx     # Liste des entreprises
        ├── EntrepriseDetail.jsx    # Détails d'une entreprise
        └── EntrepriseForm.jsx      # Formulaire d'entreprise
```

#### Flux de Données
```
User Action → React Component → Axios Service → API Endpoint → Response → State Update → Re-render
```

#### Bibliothèques Utilisées
- **React 18** : Bibliothèque principale pour l'UI
- **React Router DOM 6** : Gestion du routage
- **Axios** : Requêtes HTTP vers le backend
- **Vite** : Bundler ultra-rapide

---

### 2. Backend (Node.js + Express)

#### Structure des Dossiers
```
backend/
├── package.json            # Dépendances et scripts
├── .env.example            # Exemple de variables d'environnement
├── Dockerfile              # Conteneurisation
├── uploads/                # Stockage des documents uploadés
└── src/
    ├── app.js              # Point d'entrée Express
    ├── models/
    │   ├── Candidature.js  # Schéma Candidature
    │   └── Entreprise.js   # Schéma Entreprise
    ├── routes/
    │   ├── candidatureRoutes.js
    │   ├── entrepriseRoutes.js
    │   └── uploadRoutes.js
    ├── controllers/
    │   ├── candidatureController.js
    │   └── entrepriseController.js
    └── middlewares/
        └── uploadMiddleware.js  # Gestion upload avec Multer
```

#### Architecture API
- **Type** : RESTful API
- **Format** : JSON
- **Authentification** : Aucune (single-user pour le MVP)
- **CORS** : Activé pour le frontend local

#### Middlewares
1. **`express.json()`** : Parse les requêtes JSON
2. **`cors()`** : Autorise les requêtes cross-origin
3. **`multer()`** : Gère l'upload de fichiers
4. **`express.static()`** : Sert les fichiers uploadés

---

### 3. Base de Données (MongoDB)

#### Schéma des Collections

##### Collection `candidatures`
```javascript
{
  _id: ObjectId,
  titre_poste: String,          // Requise
  entreprise_id: ObjectId,     // Référence à Entreprise, requise
  url_offre: String,           // Requise, validée comme URL
  date_candidature: Date,      // Requise, par défaut = Date.now
  statut: String,              // Enum: ['Envoyé', 'Réponse reçue', 'Entretien', 'Refus']
  notes: String,
  documents: [                // Tableau de documents
    {
      _id: ObjectId,
      type_document: String,   // Enum: ['CV', 'Lettre de motivation']
      nom_fichier: String,
      chemin_fichier: String,  // Chemin relatif (ex: /uploads/cv-123.pdf)
      version: String,         // Par défaut: '1.0'
      date_ajout: Date         // Par défaut: Date.now
    }
  ],
  historique_statut: [        // Tableau d'historique
    {
      _id: ObjectId,
      ancien_statut: String,   // Peut être null (création)
      nouveau_statut: String,
      date_changement: Date,   // Par défaut: Date.now
      commentaire: String
    }
  ],
  createdAt: Date,             // Ajouté automatiquement par timestamps
  updatedAt: Date              // Ajouté automatiquement par timestamps
}
```

##### Collection `entreprises`
```javascript
{
  _id: ObjectId,
  nom: String,                 // Requise, unique
  site_web: String,            // URL validée
  secteur: String,
  taille: String,
  chiffre_affaires: String,
  organisation: String,
  valeurs: String,
  historique_court: String,
  sections_preparation: [     // Tableau de sections modulaires
    {
      _id: ObjectId,
      type_section: String,    // Ex: 'Chiffres clés', 'Concurrents'
      titre: String,           // Requise
      contenu: String,         // Requise
      ordre: Number,           // Pour le tri
      actif: Boolean           // Par défaut: true
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

#### Index MongoDB
- `candidatures`: Index sur `entreprise_id`, `statut`, `date_candidature`
- `entreprises`: Index sur `nom`, `secteur`

---

## 🔄 Flux de Travail

### 1. Création d'une Candidature
```
1. Utilisateur remplit le formulaire (titre, entreprise, URL, date, statut)
2. Frontend envoie POST /api/candidatures avec les données
3. Backend valide les données (URL valide, entreprise existe)
4. Backend crée la candidature avec statut initial
5. Backend ajoute une entrée dans historique_statut
6. Backend retourne la candidature créée
7. Frontend redirige vers la liste ou les détails
```

### 2. Changement de Statut
```
1. Utilisateur clique sur un bouton de changement de statut
2. Frontend affiche une boîte de dialogue pour le commentaire
3. Frontend envoie PUT /api/candidatures/:id/statut avec {nouveau_statut, commentaire}
4. Backend vérifie que la candidature existe
5. Backend ajoute une entrée dans historique_statut
6. Backend met à jour le statut actuel
7. Backend retourne la candidature mise à jour
8. Frontend met à jour l'affichage
```

### 3. Upload d'un Document
```
1. Utilisateur sélectionne un fichier (PDF, DOC, DOCX) et son type
2. Frontend envoie POST /api/upload avec FormData (fichier + metadata)
3. Backend valide le fichier (type, taille < 5Mo)
4. Multer sauvegarde le fichier dans /uploads avec un nom unique
5. Backend ajoute le document à la candidature correspondante
6. Backend retourne les informations du document
7. Frontend met à jour la liste des documents
```

### 4. Ajout d'une Section de Préparation
```
1. Utilisateur remplit le formulaire (type, titre, contenu)
2. Frontend envoie POST /api/entreprises/:id/sections
3. Backend vérifie que l'entreprise existe
4. Backend calcule l'ordre (max + 1)
5. Backend ajoute la section à l'entreprise
6. Backend trie les sections par ordre
7. Backend retourne l'entreprise mise à jour
8. Frontend met à jour l'affichage
```

---

## 🌐 Réseau et Communication

### Ports Utilisés
| Service | Port Interne | Port Externe | Description |
|---------|--------------|--------------|-------------|
| Frontend | 5173 | 5173 | Application React |
| Backend | 3000 | 3000 | API Express |
| MongoDB | 27017 | 27017 | Base de données |

### Configuration Docker Network
- **Réseau** : `pse-network` (bridge)
- **Communication** :
  - Frontend → Backend : `http://backend:3000` (via le réseau Docker)
  - Backend → MongoDB : `mongodb://mongodb:27017` (via le réseau Docker)
  - Frontend (dev) → Backend : `http://localhost:3000` (via proxy Vite)

### Proxy Vite
Le frontend utilise un proxy pour éviter les problèmes CORS en développement :
```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true
    }
  }
}
```

---

## 🔒 Sécurité (MVP)

### Points de Sécurité Implémentés
1. **Validation des Données** :
   - Validation des URLs (format valide)
   - Validation des types de fichiers (PDF, DOC, DOCX uniquement)
   - Limite de taille des fichiers (5 Mo)

2. **CORS** :
   - Restreint aux origines autorisées (`FRONTEND_URL`)
   - Méthodes HTTP autorisées : GET, POST, PUT, DELETE

3. **MongoDB** :
   - Pas d'accès direct depuis l'extérieur
   - Connexion sécurisée via le backend

### Points à Améliorer (Futur)
- [ ] Authentification JWT
- [ ] Autorisation (rôles utilisateurs)
- [ ] Validation plus stricte des entrées
- [ ] Sanitization des données
- [ ] Rate limiting
- [ ] Helmet pour les headers de sécurité
- [ ] CSRF protection

---

## 📈 Performances

### Optimisations Implémentées
1. **Index MongoDB** : Index sur les champs fréquemment interrogés
2. **Pagination** : Limite et offset pour les listes
3. **Populate** : MongoDB populate pour les références
4. **Static Files** : Service des fichiers uploadés via Express static

### Optimisations Futures
- [ ] Cache des requêtes fréquentes
- [ ] Compression des réponses (gzip)
- [ ] Lazy loading des composants React
- [ ] Optimisation des images

---

## 🛠 Outils de Développement

### Backend
- **Nodemon** : Redémarrage automatique du serveur
- **Express** : Framework web minimaliste
- **Mongoose** : ODM pour MongoDB
- **Multer** : Middleware pour l'upload de fichiers

### Frontend
- **Vite** : Bundler ultra-rapide avec HMR
- **React DevTools** : Extension navigateur pour le débogage
- **ESLint** : Linting du code (à ajouter)
- **Prettier** : Formatage du code (à ajouter)

### Base de Données
- **MongoDB Compass** : Interface graphique pour MongoDB
- **mongosh** : CLI pour MongoDB

---

## 📊 Diagrammes

### Diagramme de Classes (Simplifié)
```
┌───────────────────────┐       ┌───────────────────────┐
│        Candidature     │       │        Entreprise      │
├───────────────────────┤       ├───────────────────────┤
│ - titre_poste: String  │       │ - nom: String          │
│ - url_offre: String    │       │ - site_web: String     │
│ - date_candidature: Date│      │ - secteur: String      │
│ - statut: String       │       │ - taille: String       │
│ - notes: String        │       │ - chiffre_affaires: String│
│ - documents: Array    │       │ - organisation: String │
│ - historique: Array    │       │ - valeurs: String      │
└───────────────────────┘       │ - historique_court: String│
         │                         │ - sections: Array      │
         │                         └───────────────────────┘
         ▼
┌───────────────────────┐
│      Document         │
├───────────────────────┤
│ - type: String        │
│ - nom_fichier: String  │
│ - chemin: String       │
│ - version: String     │
│ - date_ajout: Date     │
└───────────────────────┘

┌───────────────────────┐
│   HistoriqueStatut     │
├───────────────────────┤
│ - ancien_statut: String│
│ - nouveau_statut: String│
│ - date: Date          │
│ - commentaire: String │
└───────────────────────┘

┌───────────────────────┐
│   SectionPreparation   │
├───────────────────────┤
│ - type: String        │
│ - titre: String        │
│ - contenu: String      │
│ - ordre: Number        │
│ - actif: Boolean       │
└───────────────────────┘
```

### Diagramme de Séquence (Changement de Statut)
```
Utilisateur → Frontend: Clique sur "→ Entretien"
Frontend → Utilisateur: Affiche prompt pour commentaire
Utilisateur → Frontend: Saisit commentaire (optionnel)
Frontend → Backend: PUT /api/candidatures/:id/statut
Backend → MongoDB: findById(candidatureId)
MongoDB → Backend: Retourne la candidature
Backend → Backend: Ajoute à historique_statut
Backend → MongoDB: save(candidature)
MongoDB → Backend: Retourne la candidature mise à jour
Backend → Frontend: Retourne 200 OK + candidature
Frontend → Utilisateur: Met à jour l'UI
```

---

## 📁 Stockage des Fichiers

### Local (MVP)
- **Emplacement** : `backend/uploads/`
- **Nommage** : `{fieldname}-{timestamp}-{random}.{extension}`
- **Types autorisés** : PDF, DOC, DOCX
- **Taille max** : 5 Mo
- **Accès** : Via `/uploads/{filename}` (route statique)

### Futur (Améliorations)
- [ ] Stockage cloud (AWS S3, Firebase Storage)
- [ ] Gestion des versions
- [ ] Compression des fichiers
- [ ] Virus scanning

---

## 🎯 Bonnes Pratiques

### Backend
1. **Séparation des responsabilités** : Routes → Controllers → Models
2. **Validation des données** : Toujours valider les entrées utilisateur
3. **Gestion des erreurs** : Middleware global pour les erreurs
4. **Logging** : Journalisation des erreurs et requêtes importantes
5. **Configuration** : Variables d'environnement pour les paramètres sensibles

### Frontend
1. **Composants réutilisables** : Éviter la duplication de code
2. **Gestion d'état** : State local pour le MVP, contexte pour l'état global
3. **Appels API** : Centralisés dans `services/api.js`
4. **Loading States** : Toujours gérer les états de chargement
5. **Error Handling** : Afficher les erreurs de manière user-friendly

### Base de Données
1. **Index** : Créer des index pour les requêtes fréquentes
2. **Références** : Utiliser les ObjectId pour les relations
3. **Embedding** : Embedder les données fréquemment accédées ensemble
4. **Validation** : Schéma Mongoose avec validation
5. **Backup** : Sauvegardes régulières des données
