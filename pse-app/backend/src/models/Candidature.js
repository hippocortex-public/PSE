const mongoose = require('mongoose');

const statutEnum = ['Envoyé', 'Réponse reçue', 'Entretien', 'Refus'];

const candidatureSchema = new mongoose.Schema({
  titre_poste: {
    type: String,
    required: [true, 'Le titre du poste est obligatoire'],
    trim: true
  },
  entreprise_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entreprise',
    required: [true, 'L\'entreprise est obligatoire']
  },
  url_offre: {
    type: String,
    required: [true, 'Le lien de l\'offre est obligatoire'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: props => `${props.value} n'est pas une URL valide`
    }
  },
  date_candidature: {
    type: Date,
    required: [true, 'La date de candidature est obligatoire'],
    default: Date.now
  },
  statut: {
    type: String,
    enum: statutEnum,
    default: 'Envoyé'
  },
  notes: {
    type: String,
    trim: true
  },
  documents: [{
    type_document: {
      type: String,
      enum: ['CV', 'Lettre de motivation'],
      required: true
    },
    nom_fichier: {
      type: String,
      required: true
    },
    chemin_fichier: {
      type: String,
      required: true
    },
    url_complete: {
      type: String,
      description: 'URL complète pour accéder au fichier'
    },
    version: {
      type: String,
      default: '1.0'
    },
    date_ajout: {
      type: Date,
      default: Date.now
    }
  }],
  historique_statut: [{
    ancien_statut: {
      type: String,
      enum: statutEnum
    },
    nouveau_statut: {
      type: String,
      enum: statutEnum,
      required: true
    },
    date_changement: {
      type: Date,
      default: Date.now
    },
    commentaire: {
      type: String,
      trim: true
    }
  }]
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
candidatureSchema.index({ entreprise_id: 1 });
candidatureSchema.index({ statut: 1 });
candidatureSchema.index({ date_candidature: -1 });

const Candidature = mongoose.model('Candidature', candidatureSchema);

module.exports = Candidature;
