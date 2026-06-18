const Projet = require('../models/Projet');
const Entreprise = require('../models/Entreprise');

// Créer un nouveau projet
const createProjet = async (req, res) => {
  try {
    const { titre, contexte_projet, contexte_technologique, mission, date_debut, date_fin, entreprise_id, statut, competences, notes } = req.body;

    // Validation des champs obligatoires
    if (!titre || titre.trim() === '') {
      return res.status(400).json({ message: 'Le titre du projet est obligatoire' });
    }
    if (!contexte_projet || contexte_projet.trim() === '') {
      return res.status(400).json({ message: 'Le contexte du projet est obligatoire' });
    }
    if (!contexte_technologique || contexte_technologique.trim() === '') {
      return res.status(400).json({ message: 'Le contexte technologique est obligatoire' });
    }
    if (!mission || mission.trim() === '') {
      return res.status(400).json({ message: 'La mission est obligatoire' });
    }
    if (!date_debut) {
      return res.status(400).json({ message: 'La date de début est obligatoire' });
    }

    // Vérifier si l'entreprise existe (si fournie)
    let entreprise = null;
    if (entreprise_id) {
      entreprise = await Entreprise.findById(entreprise_id);
      if (!entreprise) {
        return res.status(404).json({ message: 'Entreprise non trouvée' });
      }
    }

    const nouveauProjet = new Projet({
      titre: titre.trim(),
      contexte_projet: contexte_projet.trim(),
      contexte_technologique: contexte_technologique.trim(),
      mission: mission.trim(),
      date_debut: new Date(date_debut),
      date_fin: date_fin ? new Date(date_fin) : null,
      entreprise_id: entreprise ? entreprise._id : null,
      statut: statut || 'À venir',
      competences: competences || [],
      notes: notes ? notes.trim() : ''
    });

    await nouveauProjet.save();
    res.status(201).json(nouveauProjet);
  } catch (error) {
    console.error('Erreur lors de la création du projet:', error);
    res.status(400).json({ message: error.message || 'Erreur lors de la création du projet' });
  }
};

// Lister tous les projets
const getAllProjets = async (req, res) => {
  try {
    const { statut, entreprise_id, limit = 10, page = 1, search } = req.query;

    const query = {};
    if (statut) query.statut = statut;
    if (entreprise_id) query.entreprise_id = entreprise_id;
    if (search) {
      query.$or = [
        { titre: { $regex: search, $options: 'i' } },
        { contexte_projet: { $regex: search, $options: 'i' } },
        { contexte_technologique: { $regex: search, $options: 'i' } },
        { mission: { $regex: search, $options: 'i' } }
      ];
    }

    const projets = await Projet.find(query)
      .populate('entreprise_id', 'nom secteur')
      .populate('competences', 'nom categorie')
      .sort({ date_debut: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .exec();

    const total = await Projet.countDocuments(query);

    res.json({
      data: projets,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un projet par ID
const getProjetById = async (req, res) => {
  try {
    const projet = await Projet.findById(req.params.id)
      .populate('entreprise_id', 'nom secteur')
      .populate('competences', 'nom categorie description')
      .exec();

    if (!projet) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    res.json(projet);
  } catch (error) {
    console.error('Erreur lors de la récupération du projet:', error);
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un projet
const updateProjet = async (req, res) => {
  try {
    const { titre, contexte_projet, contexte_technologique, mission, date_debut, date_fin, entreprise_id, statut, competences, notes } = req.body;

    const projet = await Projet.findById(req.params.id);
    if (!projet) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    // Mettre à jour les champs
    if (titre) projet.titre = titre.trim();
    if (contexte_projet) projet.contexte_projet = contexte_projet.trim();
    if (contexte_technologique) projet.contexte_technologique = contexte_technologique.trim();
    if (mission) projet.mission = mission.trim();
    if (date_debut) projet.date_debut = new Date(date_debut);
    if (date_fin) projet.date_fin = date_fin ? new Date(date_fin) : null;
    if (entreprise_id) {
      const entreprise = await Entreprise.findById(entreprise_id);
      if (!entreprise) {
        return res.status(404).json({ message: 'Entreprise non trouvée' });
      }
      projet.entreprise_id = entreprise._id;
    }
    if (statut) projet.statut = statut;
    if (competences) projet.competences = competences;
    if (notes) projet.notes = notes.trim();

    await projet.save();
    
    // Populer les compétences pour la réponse
    const projetMisAJour = await Projet.findById(projet._id)
      .populate('entreprise_id', 'nom secteur')
      .populate('competences', 'nom categorie description')
      .exec();
    
    res.json(projetMisAJour);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du projet:', error);
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un projet
const deleteProjet = async (req, res) => {
  try {
    const projet = await Projet.findByIdAndDelete(req.params.id);
    if (!projet) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }
    res.json({ message: 'Projet supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProjet,
  getAllProjets,
  getProjetById,
  updateProjet,
  deleteProjet
};
