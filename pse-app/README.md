# PSE - Application de Suivi de Candidatures

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
