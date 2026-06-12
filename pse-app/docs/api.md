# Documentation API - PSE Application

## 📡 Aperçu

L'API PSE est une **RESTful API** développée avec **Node.js + Express** qui permet de gérer les candidatures, entreprises, documents et sections de préparation.

- **Base URL** : `http://localhost:3000/api` (en développement)
- **Format** : JSON
- **Authentification** : Aucune (single-user pour le MVP)
- **CORS** : Activé pour `http://localhost:5173`

---

## 📋 Table des Matières
1. [Candidatures](#candidatures)
2. [Entreprises](#entreprises)
3. [Sections de Préparation](#sections-de-préparation)
4. [Documents](#documents)
5. [Codes de Réponse](#codes-de-réponse)
6. [Exemples Complets](#exemples-complets)

---

## 🎯 Candidatures

### Liste des candidatures

**Endpoint** : `GET /api/candidatures`

**Query Parameters** :
| Paramètre | Type | Description | Exemple |
|-----------|------|-------------|---------|
| `statut` | String | Filtrer par statut | `?statut=Envoyé` |
| `entreprise_id` | String | Filtrer par ID d'entreprise | `?entreprise_id=60d5ec9f8b3a8b0015f1b2a1` |
| `limit` | Number | Nombre de résultats par page | `?limit=20` |
| `page` | Number | Numéro de page | `?page=2` |

**Réponse** :
```json
{
  "data": [
    {
      "_id": "60d5ec9f8b3a8b0015f1b2a1",
      "titre_poste": "Développeur Full Stack",
      "entreprise_id": {
        "_id": "60d5ec9f8b3a8b0015f1b2b1",
        "nom": "Google",
        "secteur": "Technologie"
      },
      "url_offre": "https://google.com/jobs/123",
      "date_candidature": "2026-06-15T10:00:00.000Z",
      "statut": "Envoyé",
      "notes": "Poste très intéressant",
      "documents": [],
      "historique_statut": [],
      "createdAt": "2026-06-15T10:00:00.000Z",
      "updatedAt": "2026-06-15T10:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

---

### Créer une candidature

**Endpoint** : `POST /api/candidatures`

**Body** :
```json
{
  "titre_poste": "Développeur Full Stack",
  "entreprise_id": "60d5ec9f8b3a8b0015f1b2b1",
  "url_offre": "https://google.com/jobs/123",
  "date_candidature": "2026-06-15",
  "statut": "Envoyé",
  "notes": "Poste très intéressant"
}
```

**Champs requis** : `titre_poste`, `entreprise_id`, `url_offre`

**Champs optionnels** : `date_candidature` (par défaut: date actuelle), `statut` (par défaut: "Envoyé"), `notes`

**Réponse** (201 Created) :
```json
{
  "_id": "60d5ec9f8b3a8b0015f1b2a1",
  "titre_poste": "Développeur Full Stack",
  "entreprise_id": "60d5ec9f8b3a8b0015f1b2b1",
  "url_offre": "https://google.com/jobs/123",
  "date_candidature": "2026-06-15T00:00:00.000Z",
  "statut": "Envoyé",
  "notes": "Poste très intéressant",
  "documents": [],
  "historique_statut": [
    {
      "ancien_statut": null,
      "nouveau_statut": "Envoyé",
      "date_changement": "2026-06-15T10:00:00.000Z",
      "commentaire": "Création de la candidature"
    }
  ],
  "createdAt": "2026-06-15T10:00:00.000Z",
  "updatedAt": "2026-06-15T10:00:00.000Z"
}
```

---

### Récupérer une candidature

**Endpoint** : `GET /api/candidatures/:id`

**Réponse** (200 OK) :
```json
{
  "_id": "60d5ec9f8b3a8b0015f1b2a1",
  "titre_poste": "Développeur Full Stack",
  "entreprise_id": {
    "_id": "60d5ec9f8b3a8b0015f1b2b1",
    "nom": "Google",
    "secteur": "Technologie",
    "site_web": "https://google.com",
    "taille": "10000+ employés",
    "chiffre_affaires": "100M$",
    "organisation": "Multinationale",
    "valeurs": "Innovation, Collaboration",
    "historique_court": "Fondée en 1998...",
    "sections_preparation": [],
    "createdAt": "2026-06-14T00:00:00.000Z",
    "updatedAt": "2026-06-14T00:00:00.000Z"
  },
  "url_offre": "https://google.com/jobs/123",
  "date_candidature": "2026-06-15T00:00:00.000Z",
  "statut": "Envoyé",
  "notes": "Poste très intéressant",
  "documents": [
    {
      "_id": "60d5ec9f8b3a8b0015f1b2c1",
      "type_document": "CV",
      "nom_fichier": "mon_cv.pdf",
      "chemin_fichier": "/uploads/document-1234567890123.pdf",
      "version": "1.0",
      "date_ajout": "2026-06-15T10:30:00.000Z"
    }
  ],
  "historique_statut": [
    {
      "_id": "60d5ec9f8b3a8b0015f1b2d1",
      "ancien_statut": null,
      "nouveau_statut": "Envoyé",
      "date_changement": "2026-06-15T10:00:00.000Z",
      "commentaire": "Création de la candidature"
    }
  ],
  "createdAt": "2026-06-15T10:00:00.000Z",
  "updatedAt": "2026-06-15T10:30:00.000Z"
}
```

---

### Mettre à jour une candidature

**Endpoint** : `PUT /api/candidatures/:id`

**Body** :
```json
{
  "titre_poste": "Développeur Full Stack Senior",
  "url_offre": "https://google.com/jobs/123-updated",
  "statut": "Réponse reçue",
  "commentaire": "Réponse positive par email",
  "notes": "Entretien prévu la semaine prochaine"
}
```

**Comportement** :
- Si `statut` est modifié, une entrée est ajoutée à `historique_statut` avec le `commentaire` (si fourni)
- Les autres champs sont mis à jour normalement

**Réponse** (200 OK) :
```json
{
  "_id": "60d5ec9f8b3a8b0015f1b2a1",
  "titre_poste": "Développeur Full Stack Senior",
  "entreprise_id": "60d5ec9f8b3a8b0015f1b2b1",
  "url_offre": "https://google.com/jobs/123-updated",
  "date_candidature": "2026-06-15T00:00:00.000Z",
  "statut": "Réponse reçue",
  "notes": "Entretien prévu la semaine prochaine",
  "historique_statut": [
    {
      "ancien_statut": null,
      "nouveau_statut": "Envoyé",
      "date_changement": "2026-06-15T10:00:00.000Z",
      "commentaire": "Création de la candidature"
    },
    {
      "ancien_statut": "Envoyé",
      "nouveau_statut": "Réponse reçue",
      "date_changement": "2026-06-16T10:00:00.000Z",
      "commentaire": "Réponse positive par email"
    }
  ],
  "createdAt": "2026-06-15T10:00:00.000Z",
  "updatedAt": "2026-06-16T10:00:00.000Z"
}
```

---

### Mettre à jour le statut (avec historique)

**Endpoint** : `PUT /api/candidatures/:id/statut`

**Body** :
```json
{
  "nouveau_statut": "Entretien",
  "commentaire": "Entretien téléphonique prévu"
}
```

**Champs requis** : `nouveau_statut`

**Champs optionnels** : `commentaire`

**Réponse** (200 OK) :
```json
{
  "_id": "60d5ec9f8b3a8b0015f1b2a1",
  "titre_poste": "Développeur Full Stack",
  "statut": "Entretien",
  "historique_statut": [
    {
      "ancien_statut": null,
      "nouveau_statut": "Envoyé",
      "date_changement": "2026-06-15T10:00:00.000Z",
      "commentaire": "Création de la candidature"
    },
    {
      "ancien_statut": "Envoyé",
      "nouveau_statut": "Réponse reçue",
      "date_changement": "2026-06-16T10:00:00.000Z",
      "commentaire": "Réponse positive par email"
    },
    {
      "ancien_statut": "Réponse reçue",
      "nouveau_statut": "Entretien",
      "date_changement": "2026-06-17T10:00:00.000Z",
      "commentaire": "Entretien téléphonique prévu"
    }
  ],
  "createdAt": "2026-06-15T10:00:00.000Z",
  "updatedAt": "2026-06-17T10:00:00.000Z"
}
```

---

### Supprimer une candidature

**Endpoint** : `DELETE /api/candidatures/:id`

**Réponse** (200 OK) :
```json
{
  "message": "Candidature supprimée avec succès"
}
```

---

## 🏢 Entreprises

### Liste des entreprises

**Endpoint** : `GET /api/entreprises`

**Query Parameters** :
| Paramètre | Type | Description | Exemple |
|-----------|------|-------------|---------|
| `secteur` | String | Filtrer par secteur | `?secteur=Technologie` |
| `limit` | Number | Nombre de résultats par page | `?limit=20` |
| `page` | Number | Numéro de page | `?page=2` |

**Réponse** :
```json
{
  "data": [
    {
      "_id": "60d5ec9f8b3a8b0015f1b2b1",
      "nom": "Google",
      "site_web": "https://google.com",
      "secteur": "Technologie",
      "taille": "10000+ employés",
      "chiffre_affaires": "100M$",
      "organisation": "Multinationale",
      "valeurs": "Innovation, Collaboration",
      "historique_court": "Fondée en 1998...",
      "sections_preparation": [],
      "createdAt": "2026-06-14T00:00:00.000Z",
      "updatedAt": "2026-06-14T00:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

---

### Créer une entreprise

**Endpoint** : `POST /api/entreprises`

**Body** :
```json
{
  "nom": "Google",
  "site_web": "https://google.com",
  "secteur": "Technologie",
  "taille": "10000+ employés",
  "chiffre_affaires": "100M$",
  "organisation": "Multinationale",
  "valeurs": "Innovation, Collaboration",
  "historique_court": "Fondée en 1998 par Larry Page et Sergey Brin...",
  "sections_preparation": []
}
```

**Champs requis** : `nom`

**Champs optionnels** : Tous les autres

**Réponse** (201 Created) :
```json
{
  "_id": "60d5ec9f8b3a8b0015f1b2b1",
  "nom": "Google",
  "site_web": "https://google.com",
  "secteur": "Technologie",
  "taille": "10000+ employés",
  "chiffre_affaires": "100M$",
  "organisation": "Multinationale",
  "valeurs": "Innovation, Collaboration",
  "historique_court": "Fondée en 1998 par Larry Page et Sergey Brin...",
  "sections_preparation": [],
  "createdAt": "2026-06-14T10:00:00.000Z",
  "updatedAt": "2026-06-14T10:00:00.000Z"
}
```

---

### Récupérer une entreprise

**Endpoint** : `GET /api/entreprises/:id`

**Réponse** (200 OK) :
```json
{
  "_id": "60d5ec9f8b3a8b0015f1b2b1",
  "nom": "Google",
  "site_web": "https://google.com",
  "secteur": "Technologie",
  "taille": "10000+ employés",
  "chiffre_affaires": "100M$",
  "organisation": "Multinationale",
  "valeurs": "Innovation, Collaboration",
  "historique_court": "Fondée en 1998...",
  "sections_preparation": [
    {
      "_id": "60d5ec9f8b3a8b0015f1b2e1",
      "type_section": "Chiffres clés",
      "titre": "Chiffre d'affaires 2025",
      "contenu": "100 milliards de dollars",
      "ordre": 0,
      "actif": true
    },
    {
      "_id": "60d5ec9f8b3a8b0015f1b2e2",
      "type_section": "Concurrents",
      "titre": "Principaux concurrents",
      "contenu": "Microsoft, Amazon, Meta",
      "ordre": 1,
      "actif": true
    }
  ],
  "createdAt": "2026-06-14T10:00:00.000Z",
  "updatedAt": "2026-06-15T10:00:00.000Z"
}
```

---

### Mettre à jour une entreprise

**Endpoint** : `PUT /api/entreprises/:id`

**Body** :
```json
{
  "site_web": "https://google.com/fr",
  "secteur": "Technologie - IA",
  "taille": "20000+ employés"
}
```

**Réponse** (200 OK) :
```json
{
  "_id": "60d5ec9f8b3a8b0015f1b2b1",
  "nom": "Google",
  "site_web": "https://google.com/fr",
  "secteur": "Technologie - IA",
  "taille": "20000+ employés",
  "chiffre_affaires": "100M$",
  "organisation": "Multinationale",
  "valeurs": "Innovation, Collaboration",
  "historique_court": "Fondée en 1998...",
  "sections_preparation": [],
  "createdAt": "2026-06-14T10:00:00.000Z",
  "updatedAt": "2026-06-16T10:00:00.000Z"
}
```

---

### Supprimer une entreprise

**Endpoint** : `DELETE /api/entreprises/:id`

**Réponse** (200 OK) :
```json
{
  "message": "Entreprise supprimée avec succès"
}
```

---

## 📚 Sections de Préparation

### Ajouter une section à une entreprise

**Endpoint** : `POST /api/entreprises/:id/sections`

**Body** :
```json
{
  "type_section": "Chiffres clés",
  "titre": "Chiffre d'affaires 2025",
  "contenu": "100 milliards de dollars",
  "ordre": 0
}
```

**Champs requis** : `type_section`, `titre`, `contenu`

**Champs optionnels** : `ordre` (par défaut: max + 1)

**Réponse** (200 OK) :
```json
{
  "_id": "60d5ec9f8b3a8b0015f1b2b1",
  "nom": "Google",
  "sections_preparation": [
    {
      "_id": "60d5ec9f8b3a8b0015f1b2e1",
      "type_section": "Chiffres clés",
      "titre": "Chiffre d'affaires 2025",
      "contenu": "100 milliards de dollars",
      "ordre": 0,
      "actif": true
    }
  ],
  "createdAt": "2026-06-14T10:00:00.000Z",
  "updatedAt": "2026-06-16T10:00:00.000Z"
}
```

---

### Mettre à jour une section

**Endpoint** : `PUT /api/entreprises/:id/sections/:sectionId`

**Body** :
```json
{
  "titre": "Chiffre d'affaires 2026",
  "contenu": "120 milliards de dollars",
  "actif": true
}
```

**Réponse** (200 OK) :
```json
{
  "_id": "60d5ec9f8b3a8b0015f1b2b1",
  "sections_preparation": [
    {
      "_id": "60d5ec9f8b3a8b0015f1b2e1",
      "type_section": "Chiffres clés",
      "titre": "Chiffre d'affaires 2026",
      "contenu": "120 milliards de dollars",
      "ordre": 0,
      "actif": true
    }
  ]
}
```

---

### Supprimer une section

**Endpoint** : `DELETE /api/entreprises/:id/sections/:sectionId`

**Réponse** (200 OK) :
```json
{
  "_id": "60d5ec9f8b3a8b0015f1b2b1",
  "sections_preparation": [],
  "updatedAt": "2026-06-16T10:30:00.000Z"
}
```

---

### Réorganiser les sections

**Endpoint** : `PUT /api/entreprises/:id/sections/reorder`

**Body** :
```json
{
  "sections": [
    {"sectionId": "60d5ec9f8b3a8b0015f1b2e1", "ordre": 1},
    {"sectionId": "60d5ec9f8b3a8b0015f1b2e2", "ordre": 0}
  ]
}
```

**Réponse** (200 OK) :
```json
{
  "_id": "60d5ec9f8b3a8b0015f1b2b1",
  "sections_preparation": [
    {
      "_id": "60d5ec9f8b3a8b0015f1b2e2",
      "type_section": "Concurrents",
      "titre": "Principaux concurrents",
      "contenu": "Microsoft, Amazon, Meta",
      "ordre": 0,
      "actif": true
    },
    {
      "_id": "60d5ec9f8b3a8b0015f1b2e1",
      "type_section": "Chiffres clés",
      "titre": "Chiffre d'affaires 2025",
      "contenu": "100 milliards de dollars",
      "ordre": 1,
      "actif": true
    }
  ]
}
```

---

## 📄 Documents

### Uploader un document

**Endpoint** : `POST /api/upload`

**Content-Type** : `multipart/form-data`

**Form Data** :
| Champ | Type | Description |
|-------|------|-------------|
| `candidature_id` | String | ID de la candidature |
| `type_document` | String | Type de document (`CV` ou `Lettre de motivation`) |
| `version` | String | Version du document (optionnel, par défaut: `1.0`) |
| `document` | File | Fichier à uploader (PDF, DOC, DOCX) |

**Réponse** (201 Created) :
```json
{
  "message": "Document téléchargé avec succès",
  "document": {
    "type_document": "CV",
    "nom_fichier": "mon_cv.pdf",
    "chemin_fichier": "/uploads/document-1234567890123.pdf",
    "version": "1.0"
  }
}
```

**Contraintes** :
- Types de fichiers autorisés : PDF, DOC, DOCX
- Taille maximale : 5 Mo

---

### Supprimer un document

**Endpoint** : `DELETE /api/candidatures/:id/documents/:documentId`

**Réponse** (200 OK) :
```json
{
  "_id": "60d5ec9f8b3a8b0015f1b2a1",
  "titre_poste": "Développeur Full Stack",
  "documents": [],
  "updatedAt": "2026-06-16T10:30:00.000Z"
}
```

---

## 📊 Codes de Réponse

| Code | Description | Exemple |
|------|-------------|---------|
| 200 | OK | Requête réussie |
| 201 | Created | Ressource créée avec succès |
| 400 | Bad Request | Données invalides |
| 404 | Not Found | Ressource non trouvée |
| 500 | Internal Server Error | Erreur serveur |

---

## 🎯 Exemples Complets

### Scénario 1 : Création complète d'une candidature avec documents

1. **Créer une entreprise** :
   ```bash
   curl -X POST http://localhost:3000/api/entreprises \
     -H "Content-Type: application/json" \
     -d '{"nom": "Google", "secteur": "Technologie"}'
   ```

2. **Créer une candidature** :
   ```bash
   curl -X POST http://localhost:3000/api/candidatures \
     -H "Content-Type: application/json" \
     -d '{
       "titre_poste": "Développeur Full Stack",
       "entreprise_id": "ID_DE_L_ENTREPRISE",
       "url_offre": "https://google.com/jobs/123",
       "statut": "Envoyé"
     }'
   ```

3. **Uploader un CV** :
   ```bash
   curl -X POST http://localhost:3000/api/upload \
     -F "candidature_id=ID_DE_LA_CANDIDATURE" \
     -F "type_document=CV" \
     -F "document=@/chemin/vers/mon_cv.pdf"
   ```

4. **Mettre à jour le statut** :
   ```bash
   curl -X PUT http://localhost:3000/api/candidatures/ID_DE_LA_CANDIDATURE/statut \
     -H "Content-Type: application/json" \
     -d '{"nouveau_statut": "Réponse reçue", "commentaire": "Réponse positive"}'
   ```

---

### Scénario 2 : Préparation d'entretien

1. **Ajouter des sections à une entreprise** :
   ```bash
   # Section 1
   curl -X POST http://localhost:3000/api/entreprises/ID_ENTREPRISE/sections \
     -H "Content-Type: application/json" \
     -d '{"type_section": "Chiffres clés", "titre": "CA 2025", "contenu": "100M$"}'
   
   # Section 2
   curl -X POST http://localhost:3000/api/entreprises/ID_ENTREPRISE/sections \
     -H "Content-Type: application/json" \
     -d '{"type_section": "Concurrents", "titre": "Principaux concurrents", "contenu": "Microsoft, Amazon"}'
   ```

2. **Réorganiser les sections** :
   ```bash
   curl -X PUT http://localhost:3000/api/entreprises/ID_ENTREPRISE/sections/reorder \
     -H "Content-Type: application/json" \
     -d '{
       "sections": [
         {"sectionId": "ID_SECTION_2", "ordre": 0},
         {"sectionId": "ID_SECTION_1", "ordre": 1}
       ]
     }'
   ```

---

## 🔧 Configuration Requise

### Variables d'Environnement (Backend)

Créez un fichier `.env` dans le dossier `backend/` :

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb://mongodb:27017/pse-app
```

### CORS

Le backend est configuré pour accepter les requêtes depuis `FRONTEND_URL`. Pour ajouter d'autres origines :

```javascript
// Dans backend/src/app.js
app.use(cors({
  origin: ['http://localhost:5173', 'http://autre-origine.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 📖 Notes

1. **Single-User** : Cette API est conçue pour une utilisation single-user (pas d'authentification).
2. **Stockage Local** : Les documents sont stockés localement dans `backend/uploads/`.
3. **MongoDB** : Assurez-vous que MongoDB est en cours d'exécution avant de démarrer le backend.
4. **Docker** : Utilisez `docker-compose up -d` pour lancer tous les services.
5. **Développement** : Le frontend utilise un proxy vers le backend pour éviter les problèmes CORS.
