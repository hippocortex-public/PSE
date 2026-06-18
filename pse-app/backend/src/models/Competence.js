const mongoose = require('mongoose');

const competenceSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom de la compétence est obligatoire'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  categorie: {
    type: String,
    trim: true,
    enum: ['Technique', 'Fonctionnelle', 'Méthodologie', 'Langue', 'Autre'],
    default: 'Technique'
  },
  date_creation: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
competenceSchema.index({ nom: 1 });
competenceSchema.index({ categorie: 1 });

const Competence = mongoose.model('Competence', competenceSchema);

module.exports = Competence;
