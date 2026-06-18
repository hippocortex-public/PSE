const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

// Importer les routes
const candidatureRoutes = require('./routes/candidatureRoutes');
const entrepriseRoutes = require('./routes/entrepriseRoutes');
const projetRoutes = require('./routes/projetRoutes');
const competenceRoutes = require('./routes/competenceRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Initialiser l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour le CORS (accès depuis le frontend)
app.use(cors({
  origin: ['http://localhost:5173', 'http://frontend:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware pour servir les fichiers statiques (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Connexion à MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/pse-app';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB :', err));

// Routes
app.use('/api/candidatures', candidatureRoutes);
app.use('/api/entreprises', entrepriseRoutes);
app.use('/api/projets', projetRoutes);
app.use('/api/competences', competenceRoutes);
app.use('/api/uploads', uploadRoutes);

// Route de test
app.get('/', (req, res) => {
  res.send('API PSE - Application de suivi de candidatures');
});

// Middleware pour gérer les erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Middleware pour gérer les erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur serveur' });
});

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
