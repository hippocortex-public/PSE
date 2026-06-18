const mongoose = require('mongoose');

const projetSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: [true, 'Le titre du projet est obligatoire'],
    trim: true
  },
  contexte_projet: {
    type: String,
    required: [true, 'Le contexte du projet est obligatoire'],
    trim: true
  },
  contexte_technologique: {
    type: String,
    required: [true, 'Le contexte technologique est obligatoire'],
    trim: true
  },
  mission: {
    type: String,
    required: [true, 'La mission est obligatoire'],
    trim: true
  },
  date_debut: {
    type: Date,
    required: [true, 'La date de début est obligatoire']
  },
  date_fin: {
    type: Date
  },
  entreprise_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entreprise',
    required: false
  },
  statut: {
    type: String,
    enum: ['En cours', 'Terminé', 'À venir', 'Annulé'],
    default: 'À venir'
  },
  competences: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Competence'
  }],
  notes: {
    type: String,
    trim: true
  },
  date_creation: {
    type: Date,
    default: Date.now
  },
  date_mise_a_jour: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
projetSchema.index({ titre: 1 });
projetSchema.index({ statut: 1 });
projetSchema.index({ date_debut: -1 });
projetSchema.index({ entreprise_id: 1 });

// Mettre à jour la date de mise à jour avant sauvegarde
projetSchema.pre('save', function(next) {
  this.date_mise_a_jour = new Date();
  next();
});

const Projet = mongoose.model('Projet', projetSchema);

module.exports = Projet;
