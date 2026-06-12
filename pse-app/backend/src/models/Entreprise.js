const mongoose = require('mongoose');

const sectionPreparationSchema = new mongoose.Schema({
  type_section: {
    type: String,
    required: [true, 'Le type de section est obligatoire'],
    trim: true
  },
  titre: {
    type: String,
    required: [true, 'Le titre de la section est obligatoire'],
    trim: true
  },
  contenu: {
    type: String,
    required: [true, 'Le contenu de la section est obligatoire'],
    trim: true
  },
  ordre: {
    type: Number,
    required: true,
    default: 0
  },
  actif: {
    type: Boolean,
    default: true
  }
});

const entrepriseSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom de l\'entreprise est obligatoire'],
    trim: true,
    unique: true
  },
  site_web: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Champ optionnel
        return /^https?:\/\/.+/.test(v);
      },
      message: props => `${props.value} n'est pas une URL valide`
    }
  },
  secteur: {
    type: String,
    trim: true
  },
  taille: {
    type: String,
    trim: true
  },
  chiffre_affaires: {
    type: String,
    trim: true
  },
  organisation: {
    type: String,
    trim: true
  },
  valeurs: {
    type: String,
    trim: true
  },
  historique_court: {
    type: String,
    trim: true
  },
  sections_preparation: [sectionPreparationSchema]
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
entrepriseSchema.index({ nom: 1 });
entrepriseSchema.index({ secteur: 1 });

const Entreprise = mongoose.model('Entreprise', entrepriseSchema);

module.exports = Entreprise;
