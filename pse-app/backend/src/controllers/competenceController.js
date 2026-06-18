const Competence = require('../models/Competence');

// Créer une nouvelle compétence
const createCompetence = async (req, res) => {
  try {
    const { nom, description, categorie } = req.body;

    // Validation des champs obligatoires
    if (!nom || nom.trim() === '') {
      return res.status(400).json({ message: 'Le nom de la compétence est obligatoire' });
    }

    // Vérifier si la compétence existe déjà
    const competenceExistante = await Competence.findOne({ nom: nom.trim() });
    if (competenceExistante) {
      return res.status(400).json({ 
        message: 'Une compétence avec ce nom existe déjà',
        competence: competenceExistante
      });
    }

    const nouvelleCompetence = new Competence({
      nom: nom.trim(),
      description: description ? description.trim() : '',
      categorie: categorie || 'Technique'
    });

    await nouvelleCompetence.save();
    res.status(201).json(nouvelleCompetence);
  } catch (error) {
    console.error('Erreur lors de la création de la compétence:', error);
    res.status(400).json({ message: error.message || 'Erreur lors de la création de la compétence' });
  }
};

// Lister toutes les compétences
const getAllCompetences = async (req, res) => {
  try {
    const { categorie, search, limit = 50, page = 1 } = req.query;

    const query = {};
    if (categorie) query.categorie = categorie;
    if (search) {
      query.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const competences = await Competence.find(query)
      .sort({ nom: 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .exec();

    const total = await Competence.countDocuments(query);

    res.json({
      data: competences,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des compétences:', error);
    res.status(500).json({ message: error.message });
  }
};

// Récupérer une compétence par ID
const getCompetenceById = async (req, res) => {
  try {
    const competence = await Competence.findById(req.params.id);

    if (!competence) {
      return res.status(404).json({ message: 'Compétence non trouvée' });
    }

    res.json(competence);
  } catch (error) {
    console.error('Erreur lors de la récupération de la compétence:', error);
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour une compétence
const updateCompetence = async (req, res) => {
  try {
    const { nom, description, categorie } = req.body;

    const competence = await Competence.findById(req.params.id);
    if (!competence) {
      return res.status(404).json({ message: 'Compétence non trouvée' });
    }

    // Vérifier si le nouveau nom est déjà utilisé par une autre compétence
    if (nom && nom.trim() !== competence.nom) {
      const competenceExistante = await Competence.findOne({ nom: nom.trim() });
      if (competenceExistante && competenceExistante._id.toString() !== req.params.id) {
        return res.status(400).json({ message: 'Une compétence avec ce nom existe déjà' });
      }
    }

    // Mettre à jour les champs
    if (nom) competence.nom = nom.trim();
    if (description) competence.description = description.trim();
    if (categorie) competence.categorie = categorie;

    await competence.save();
    res.json(competence);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la compétence:', error);
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une compétence
const deleteCompetence = async (req, res) => {
  try {
    const competence = await Competence.findByIdAndDelete(req.params.id);
    if (!competence) {
      return res.status(404).json({ message: 'Compétence non trouvée' });
    }
    res.json({ message: 'Compétence supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la compétence:', error);
    res.status(500).json({ message: error.message });
  }
};

// Créer ou récupérer une compétence par nom (utile pour l'autocomplétion)
const getOrCreateCompetenceByNom = async (req, res) => {
  try {
    const { nom, description, categorie } = req.body;

    if (!nom || nom.trim() === '') {
      return res.status(400).json({ message: 'Le nom de la compétence est obligatoire' });
    }

    // Rechercher la compétence existante
    let competence = await Competence.findOne({ nom: nom.trim() });
    
    if (!competence) {
      // Créer une nouvelle compétence
      competence = new Competence({
        nom: nom.trim(),
        description: description ? description.trim() : '',
        categorie: categorie || 'Technique'
      });
      await competence.save();
    }

    res.json(competence);
  } catch (error) {
    console.error('Erreur lors de la récupération/création de la compétence:', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createCompetence,
  getAllCompetences,
  getCompetenceById,
  updateCompetence,
  deleteCompetence,
  getOrCreateCompetenceByNom
};
