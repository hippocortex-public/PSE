# PSE - Application de Suivi de Candidatures

[English Version Below](#english-version)

Une application complète pour centraliser et gérer vos candidatures, entreprises et préparations d'entretien.

## 🚀 Démarrage Rapide

### Prérequis
- Docker
- Docker Compose

### Installation et Lancement

1. **Cloner le projet** (si ce n'est pas déjà fait) :
   ```bash
   git clone <url-du-depot>
   cd pse-app
   ```

2. **Lancer l'application avec Docker Compose** :
   ```bash
   docker-compose up -d
   ```

3. **Accéder à l'application** :
   - Frontend : [http://localhost:5173](http://localhost:5173)
   - Backend API : [http://localhost:3000](http://localhost:3000)
   - MongoDB : [mongodb://localhost:27017](mongodb://localhost:27017)

4. **Arrêter l'application** :
   ```bash
   docker-compose down
   ```

## 📂 Structure du Projet

```
pse-app/
├── backend/               # API Node.js + Express
│   ├── src/
│   │   ├── models/        # Schémas MongoDB
│   │   ├── routes/        # Routes API
│   │   ├── controllers/   # Logique métier
│   │   ├── middlewares/   # Middlewares (upload, etc.)
│   │   └── app.js         # Point d'entrée
│   ├── uploads/           # Stockage des documents
│   ├── Dockerfile
│   └── package.json
│
├── frontend/              # Application React
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── pages/         # Pages de l'application
│   │   ├── services/      # Appels API (Axios)
│   │   ├── App.jsx        # Routing principal
│   │   └── main.jsx       # Point d'entrée
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml     # Orchestration Docker
└── README.md              # Documentation
```

## 🔧 Configuration

### Variables d'Environnement

#### Backend
Créez un fichier `.env` dans le dossier `backend/` basé sur `.env.example` :
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb://mongodb:27017/pse-app
```

#### Frontend
Le frontend utilise un proxy vers le backend (configuré dans `vite.config.js`).

## 📡 API Backend

### Endpoints Disponibles

#### Candidatures
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/candidatures` | Lister toutes les candidatures |
| POST | `/api/candidatures` | Créer une nouvelle candidature |
| GET | `/api/candidatures/:id` | Récupérer une candidature |
| PUT | `/api/candidatures/:id` | Mettre à jour une candidature |
| DELETE | `/api/candidatures/:id` | Supprimer une candidature |
| PUT | `/api/candidatures/:id/statut` | Mettre à jour le statut |
| POST | `/api/candidatures/:id/documents` | Ajouter un document |
| DELETE | `/api/candidatures/:id/documents/:documentId` | Supprimer un document |

#### Entreprises
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/entreprises` | Lister toutes les entreprises |
| POST | `/api/entreprises` | Créer une nouvelle entreprise |
| GET | `/api/entreprises/:id` | Récupérer une entreprise |
| PUT | `/api/entreprises/:id` | Mettre à jour une entreprise |
| DELETE | `/api/entreprises/:id` | Supprimer une entreprise |

#### Sections de Préparation
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/entreprises/:id/sections` | Ajouter une section |
| PUT | `/api/entreprises/:id/sections/:sectionId` | Mettre à jour une section |
| DELETE | `/api/entreprises/:id/sections/:sectionId` | Supprimer une section |
| PUT | `/api/entreprises/:id/sections/reorder` | Réorganiser les sections |

#### Upload de Documents
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/upload` | Uploader un document (CV, lettre) |

### Exemples de Requêtes

#### Créer une entreprise
```bash
curl -X POST http://localhost:3000/api/entreprises \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Google",
    "secteur": "Technologie",
    "site_web": "https://google.com",
    "taille": "10000+ employés"
  }'
```

#### Créer une candidature
```bash
curl -X POST http://localhost:3000/api/candidatures \
  -H "Content-Type: application/json" \
  -d '{
    "titre_poste": "Développeur Full Stack",
    "entreprise_id": "ID_DE_L_ENTREPRISE",
    "url_offre": "https://exemple.com/offre",
    "date_candidature": "2026-06-15",
    "statut": "Envoyé"
  }'
```

#### Uploader un document
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "candidature_id=ID_DE_LA_CANDIDATURE" \
  -F "type_document=CV" \
  -F "document=@/chemin/vers/mon_cv.pdf"
```

## 🎨 Fonctionnalités Frontend

### Pages Disponibles
- **Dashboard** (`/`) : Liste des candidatures avec filtres
- **Création/Édition de Candidature** (`/candidatures/new`, `/candidatures/:id/edit`)
- **Détails de Candidature** (`/candidatures/:id`) : Avec historique des statuts et gestion des documents
- **Liste des Entreprises** (`/entreprises`) : Avec filtres
- **Création/Édition d'Entreprise** (`/entreprises/new`, `/entreprises/:id/edit`)
- **Détails d'Entreprise** (`/entreprises/:id`) : Avec sections de préparation modulaires

### Gestion des Statuts
Les statuts disponibles sont :
- Envoyé
- Réponse reçue
- Entretien
- Refus

Chaque changement de statut est enregistré dans l'historique avec une date et un commentaire optionnel.

### Gestion des Documents
- Upload de CV et lettres de motivation (PDF, DOC, DOCX)
- Stockage local dans `backend/uploads/`
- Accès direct aux fichiers via l'API

### Sections de Préparation
Les entreprises peuvent avoir des sections de préparation personnalisées :
- Chiffres clés
- Secteur et tendances
- Concurrents
- Valeurs et culture
- Faits historiques
- Questions à poser
- Points de vigilance

## 📊 Modèle de Données

### Candidature
```javascript
{
  titre_poste: String,
  entreprise_id: ObjectId,
  url_offre: String,
  date_candidature: Date,
  statut: String, // ['Envoyé', 'Réponse reçue', 'Entretien', 'Refus']
  notes: String,
  documents: [
    {
      type_document: String, // ['CV', 'Lettre de motivation']
      nom_fichier: String,
      chemin_fichier: String,
      version: String,
      date_ajout: Date
    }
  ],
  historique_statut: [
    {
      ancien_statut: String,
      nouveau_statut: String,
      date_changement: Date,
      commentaire: String
    }
  ]
}
```

### Entreprise
```javascript
{
  nom: String,
  site_web: String,
  secteur: String,
  taille: String,
  chiffre_affaires: String,
  organisation: String,
  valeurs: String,
  historique_court: String,
  sections_preparation: [
    {
      type_section: String,
      titre: String,
      contenu: String,
      ordre: Number,
      actif: Boolean
    }
  ]
}
```

## 🛠 Développement Local (sans Docker)

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📦 Dépendances

### Backend
- express
- mongoose
- multer
- cors
- dotenv
- nodemon (dev)

### Frontend
- react
- react-dom
- react-router-dom
- axios
- vite
- @vitejs/plugin-react

## 🎯 Roadmap

### MVP Actuel
- [x] Gestion complète des candidatures (CRUD)
- [x] Gestion complète des entreprises (CRUD)
- [x] Historique des statuts
- [x] Upload de documents
- [x] Sections de préparation modulaires
- [x] Interface utilisateur simple et fonctionnelle
- [x] Dockerisation complète

### Améliorations Futures
- [ ] Authentification utilisateur
- [ ] Synchronisation avec LinkedIn (partielle)
- [ ] Recherche avancée et filtres
- [ ] Export des données (PDF, CSV)
- [ ] Notifications et rappels
- [ ] Interface drag-and-drop pour les sections
- [ ] Thème sombre/clair
- [ ] Tests unitaires et d'intégration

## 📄 Licence

Ce projet est sous licence MIT.

## 🙏 Contribution

Les contributions sont les bienvenues ! Ouvrez une issue ou soumettez une pull request.

## 📞 Support

Pour toute question ou problème, veuillez ouvrir une issue dans le dépôt GitHub.

---

# English Version

# PSE - Application Tracking Application

A comprehensive application to centralize and manage your job applications, companies, and interview preparations.

## 🚀 Quick Start

### Prerequisites
- Docker
- Docker Compose

### Installation and Launch

1. **Clone the project** (if not already done):
   ```bash
   git clone <repository-url>
   cd pse-app
   ```

2. **Launch the application with Docker Compose**:
   ```bash
   docker-compose up -d
   ```

3. **Access the application**:
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:3000](http://localhost:3000)
   - MongoDB: [mongodb://localhost:27017](mongodb://localhost:27017)

4. **Stop the application**:
   ```bash
   docker-compose down
   ```

## 📂 Project Structure

```
pse-app/
├── backend/               # Node.js + Express API
│   ├── src/
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Business logic
│   │   ├── middlewares/   # Middlewares (upload, etc.)
│   │   └── app.js         # Entry point
│   ├── uploads/           # Document storage
│   ├── Dockerfile
│   └── package.json
│
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Application pages
│   │   ├── services/      # API calls (Axios)
│   │   ├── App.jsx        # Main routing
│   │   └── main.jsx       # Entry point
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml     # Docker orchestration
└── README.md              # Documentation
```

## 🔧 Configuration

### Environment Variables

#### Backend
Create a `.env` file in the `backend/` folder based on `.env.example`:
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb://mongodb:27017/pse-app
```

#### Frontend
The frontend uses a proxy to the backend (configured in `vite.config.js`).

## 📡 Backend API

### Available Endpoints

#### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/candidatures` | List all applications |
| POST | `/api/candidatures` | Create a new application |
| GET | `/api/candidatures/:id` | Get an application |
| PUT | `/api/candidatures/:id` | Update an application |
| DELETE | `/api/candidatures/:id` | Delete an application |
| PUT | `/api/candidatures/:id/statut` | Update status |
| POST | `/api/candidatures/:id/documents` | Add a document |
| DELETE | `/api/candidatures/:id/documents/:documentId` | Delete a document |

#### Companies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/entreprises` | List all companies |
| POST | `/api/entreprises` | Create a new company |
| GET | `/api/entreprises/:id` | Get a company |
| PUT | `/api/entreprises/:id` | Update a company |
| DELETE | `/api/entreprises/:id` | Delete a company |

#### Preparation Sections
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/entreprises/:id/sections` | Add a section |
| PUT | `/api/entreprises/:id/sections/:sectionId` | Update a section |
| DELETE | `/api/entreprises/:id/sections/:sectionId` | Delete a section |
| PUT | `/api/entreprises/:id/sections/reorder` | Reorder sections |

#### Document Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload a document (CV, letter) |

### Request Examples

#### Create a company
```bash
curl -X POST http://localhost:3000/api/entreprises \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Google",
    "secteur": "Technology",
    "site_web": "https://google.com",
    "taille": "10000+ employees"
  }'
```

#### Create an application
```bash
curl -X POST http://localhost:3000/api/candidatures \
  -H "Content-Type: application/json" \
  -d '{
    "titre_poste": "Full Stack Developer",
    "entreprise_id": "COMPANY_ID",
    "url_offre": "https://example.com/offer",
    "date_candidature": "2026-06-15",
    "statut": "Sent"
  }'
```

#### Upload a document
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "candidature_id=APPLICATION_ID" \
  -F "type_document=CV" \
  -F "document=@/path/to/my_cv.pdf"
```

## 🎨 Frontend Features

### Available Pages
- **Dashboard** (`/`): List of applications with filters
- **Create/Edit Application** (`/candidatures/new`, `/candidatures/:id/edit`)
- **Application Details** (`/candidatures/:id`): With status history and document management
- **Companies List** (`/entreprises`): With filters
- **Create/Edit Company** (`/entreprises/new`, `/entreprises/:id/edit`)
- **Company Details** (`/entreprises/:id`): With modular preparation sections

### Status Management
Available statuses are:
- Sent
- Response received
- Interview
- Rejection

Each status change is recorded in the history with a date and optional comment.

### Document Management
- Upload CV and cover letters (PDF, DOC, DOCX)
- Local storage in `backend/uploads/`
- Direct file access via API

### Preparation Sections
Companies can have customized preparation sections:
- Key figures
- Sector and trends
- Competitors
- Values and culture
- Historical facts
- Questions to ask
- Points of caution

## 📊 Data Model

### Application
```javascript
{
  titre_poste: String,
  entreprise_id: ObjectId,
  url_offre: String,
  date_candidature: Date,
  statut: String, // ['Sent', 'Response received', 'Interview', 'Rejection']
  notes: String,
  documents: [
    {
      type_document: String, // ['CV', 'Cover letter']
      nom_fichier: String,
      chemin_fichier: String,
      version: String,
      date_ajout: Date
    }
  ],
  historique_statut: [
    {
      ancien_statut: String,
      nouveau_statut: String,
      date_changement: Date,
      commentaire: String
    }
  ]
}
```

### Company
```javascript
{
  nom: String,
  site_web: String,
  secteur: String,
  taille: String,
  chiffre_affaires: String,
  organisation: String,
  valeurs: String,
  historique_court: String,
  sections_preparation: [
    {
      type_section: String,
      titre: String,
      contenu: String,
      ordre: Number,
      actif: Boolean
    }
  ]
}
```

## 🛠 Local Development (without Docker)

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📦 Dependencies

### Backend
- express
- mongoose
- multer
- cors
- dotenv
- nodemon (dev)

### Frontend
- react
- react-dom
- react-router-dom
- axios
- vite
- @vitejs/plugin-react

## 🎯 Roadmap

### Current MVP
- [x] Complete application management (CRUD)
- [x] Complete company management (CRUD)
- [x] Status history
- [x] Document upload
- [x] Modular preparation sections
- [x] Simple and functional user interface
- [x] Complete Dockerization

### Future Improvements
- [ ] User authentication
- [ ] LinkedIn synchronization (partial)
- [ ] Advanced search and filters
- [ ] Data export (PDF, CSV)
- [ ] Notifications and reminders
- [ ] Drag-and-drop interface for sections
- [ ] Dark/light theme
- [ ] Unit and integration tests

## 📄 License

This project is licensed under the MIT License.

## 🙏 Contributing

Contributions are welcome! Open an issue or submit a pull request.

## 📞 Support

For any questions or issues, please open an issue in the GitHub repository.
