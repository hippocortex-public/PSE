const Candidature = require('../models/Candidature');
const Entreprise = require('../models/Entreprise');

// Créer une nouvelle candidature
const createCandidature = async (req, res) => {
  try {
    console.log('Données reçues pour nouvelle candidature:', req.body);
    
    const { titre_poste, entreprise_id, nom_entreprise, url_offre, date_candidature, statut, notes } = req.body;

    // Validation des champs obligatoires
    if (!titre_poste || titre_poste.trim() === '') {
      console.log('Erreur: titre_poste manquant');
      return res.status(400).json({ message: 'Le titre du poste est obligatoire' });
    }
    
    if (!url_offre || url_offre.trim() === '') {
      console.log('Erreur: url_offre manquante');
      return res.status(400).json({ message: 'Le lien de l\'offre est obligatoire' });
    }
    
    // Vérifier qu'une entreprise est fournie (soit ID, soit nom)
    if (!entreprise_id && !nom_entreprise) {
      console.log('Erreur: aucune entreprise fournie (entreprise_id ou nom_entreprise)');
      return res.status(400).json({ message: 'Une entreprise est obligatoire (ID ou nom)' });
    }

    console.log(`Entreprise: ID=${entreprise_id}, Nom=${nom_entreprise}`);

    let entreprise;
    
    // Si un nom d'entreprise est fourni, créer une nouvelle entreprise
    if (nom_entreprise && nom_entreprise.trim() !== '') {
      console.log(`Recherche ou création de l'entreprise: ${nom_entreprise.trim()}`);
      // Vérifier si une entreprise avec ce nom existe déjà
      entreprise = await Entreprise.findOne({ nom: nom_entreprise.trim() });
      if (!entreprise) {
        console.log(`Création de la nouvelle entreprise: ${nom_entreprise.trim()}`);
        entreprise = new Entreprise({ nom: nom_entreprise.trim() });
        await entreprise.save();
        console.log(`Entreprise créée avec ID: ${entreprise._id}`);
      } else {
        console.log(`Entreprise existante trouvée avec ID: ${entreprise._id}`);
      }
    } else {
      console.log(`Recherche de l'entreprise par ID: ${entreprise_id}`);
      // Sinon, vérifier si l'entreprise_id existe
      entreprise = await Entreprise.findById(entreprise_id);
      if (!entreprise) {
        console.log(`Erreur: entreprise non trouvée avec ID: ${entreprise_id}`);
        return res.status(404).json({ message: 'Entreprise non trouvée' });
      }
      console.log(`Entreprise trouvée avec ID: ${entreprise._id}`);
    }

    console.log(`Création de la candidature avec entreprise_id: ${entreprise._id}`);
    
    const nouvelleCandidature = new Candidature({
      titre_poste: titre_poste.trim(),
      entreprise_id: entreprise._id,
      url_offre: url_offre.trim(),
      date_candidature: date_candidature || new Date(),
      statut: statut || 'Envoyé',
      notes: notes ? notes.trim() : '',
      historique_statut: statut ? [
        {
          ancien_statut: null,
          nouveau_statut: statut,
          date_changement: new Date(),
          commentaire: 'Création de la candidature'
        }
      ] : []
    });

    await nouvelleCandidature.save();
    console.log(`Candidature créée avec succès: ${nouvelleCandidature._id}`);
    res.status(201).json(nouvelleCandidature);
  } catch (error) {
    console.error('Erreur lors de la création de la candidature:', error);
    res.status(400).json({ 
      message: error.message || 'Erreur lors de la création de la candidature' 
    });
  }
};

// Lister toutes les candidatures
const getAllCandidatures = async (req, res) => {
  try {
    const { statut, entreprise_id, limit = 10, page = 1 } = req.query;
    
    const query = {};
    if (statut) query.statut = statut;
    if (entreprise_id) query.entreprise_id = entreprise_id;

    const candidatures = await Candidature.find(query)
      .populate('entreprise_id', 'nom secteur')
      .sort({ date_candidature: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .exec();

    const total = await Candidature.countDocuments(query);
    
    res.json({
      data: candidatures,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer une candidature par ID
const getCandidatureById = async (req, res) => {
  try {
    const candidature = await Candidature.findById(req.params.id)
      .populate('entreprise_id')
      .exec();

    if (!candidature) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }

    res.json(candidature);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour une candidature
const updateCandidature = async (req, res) => {
  try {
    const { titre_poste, url_offre, date_candidature, statut, notes } = req.body;

    const candidature = await Candidature.findById(req.params.id);
    if (!candidature) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }

    // Mettre à jour les champs
    if (titre_poste) candidature.titre_poste = titre_poste;
    if (url_offre) candidature.url_offre = url_offre;
    if (date_candidature) candidature.date_candidature = date_candidature;
    if (notes) candidature.notes = notes;

    // Si le statut change, ajouter à l'historique
    if (statut && statut !== candidature.statut) {
      candidature.historique_statut.push({
        ancien_statut: candidature.statut,
        nouveau_statut: statut,
        date_changement: new Date(),
        commentaire: req.body.commentaire || null
      });
      candidature.statut = statut;
    }

    await candidature.save();
    res.json(candidature);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une candidature
const deleteCandidature = async (req, res) => {
  try {
    const candidature = await Candidature.findByIdAndDelete(req.params.id);
    if (!candidature) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }
    res.json({ message: 'Candidature supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour le statut d'une candidature (avec historique)
const updateStatut = async (req, res) => {
  try {
    const { nouveau_statut, commentaire } = req.body;

    const candidature = await Candidature.findById(req.params.id);
    if (!candidature) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }

    // Ajouter à l'historique
    candidature.historique_statut.push({
      ancien_statut: candidature.statut,
      nouveau_statut,
      date_changement: new Date(),
      commentaire: commentaire || null
    });

    candidature.statut = nouveau_statut;
    await candidature.save();

    res.json(candidature);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Ajouter un document à une candidature
const addDocument = async (req, res) => {
  try {
    const { type_document, nom_fichier, chemin_fichier, version } = req.body;

    const candidature = await Candidature.findById(req.params.id);
    if (!candidature) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }

    candidature.documents.push({
      type_document,
      nom_fichier,
      chemin_fichier,
      version: version || '1.0'
    });

    await candidature.save();
    res.json(candidature);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un document d'une candidature
const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const candidature = await Candidature.findById(req.params.id);
    if (!candidature) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }

    // Filtrer le document à supprimer
    candidature.documents = candidature.documents.filter(
      doc => doc._id.toString() !== documentId
    );

    await candidature.save();
    res.json(candidature);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createCandidature,
  getAllCandidatures,
  getCandidatureById,
  updateCandidature,
  deleteCandidature,
  updateStatut,
  addDocument,
  deleteDocument
};
