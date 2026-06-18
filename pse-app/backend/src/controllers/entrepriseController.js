const Entreprise = require('../models/Entreprise');

// Créer une nouvelle entreprise
const createEntreprise = async (req, res) => {
  try {
    const {
      nom,
      site_web,
      secteur,
      taille,
      chiffre_affaires,
      organisation,
      valeurs,
      historique_court,
      sections_preparation
    } = req.body;

    // Vérifier si l'entreprise existe déjà (par nom)
    const entrepriseExistante = await Entreprise.findOne({ nom });
    if (entrepriseExistante) {
      return res.status(400).json({ message: 'Une entreprise avec ce nom existe déjà' });
    }

    const nouvelleEntreprise = new Entreprise({
      nom,
      site_web,
      secteur,
      taille,
      chiffre_affaires,
      organisation,
      valeurs,
      historique_court,
      sections_preparation: sections_preparation || []
    });

    await nouvelleEntreprise.save();
    res.status(201).json(nouvelleEntreprise);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Lister toutes les entreprises
const getAllEntreprises = async (req, res) => {
  try {
    const { secteur, limit = 10, page = 1 } = req.query;
    
    const query = {};
    if (secteur && secteur.length >= 3) {
      // Recherche "LIKE" insensible à la casse avec regex
      query.secteur = { $regex: secteur, $options: 'i' };
    }

    const entreprises = await Entreprise.find(query)
      .sort({ nom: 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .exec();

    const total = await Entreprise.countDocuments(query);
    
    res.json({
      data: entreprises,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer une entreprise par ID
const getEntrepriseById = async (req, res) => {
  try {
    const entreprise = await Entreprise.findById(req.params.id);
    if (!entreprise) {
      return res.status(404).json({ message: 'Entreprise non trouvée' });
    }
    res.json(entreprise);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour une entreprise
const updateEntreprise = async (req, res) => {
  try {
    const {
      nom,
      site_web,
      secteur,
      taille,
      chiffre_affaires,
      organisation,
      valeurs,
      historique_court
    } = req.body;

    const entreprise = await Entreprise.findById(req.params.id);
    if (!entreprise) {
      return res.status(404).json({ message: 'Entreprise non trouvée' });
    }

    // Mettre à jour les champs
    if (nom) entreprise.nom = nom;
    if (site_web) entreprise.site_web = site_web;
    if (secteur) entreprise.secteur = secteur;
    if (taille) entreprise.taille = taille;
    if (chiffre_affaires) entreprise.chiffre_affaires = chiffre_affaires;
    if (organisation) entreprise.organisation = organisation;
    if (valeurs) entreprise.valeurs = valeurs;
    if (historique_court) entreprise.historique_court = historique_court;

    await entreprise.save();
    res.json(entreprise);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une entreprise
const deleteEntreprise = async (req, res) => {
  try {
    const entreprise = await Entreprise.findByIdAndDelete(req.params.id);
    if (!entreprise) {
      return res.status(404).json({ message: 'Entreprise non trouvée' });
    }
    res.json({ message: 'Entreprise supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ajouter une section de préparation à une entreprise
const addSectionPreparation = async (req, res) => {
  try {
    const { type_section, titre, contenu, ordre } = req.body;

    const entreprise = await Entreprise.findById(req.params.id);
    if (!entreprise) {
      return res.status(404).json({ message: 'Entreprise non trouvée' });
    }

    // Calculer l'ordre si non fourni
    const nouvelOrdre = ordre !== undefined 
      ? ordre 
      : (entreprise.sections_preparation.length > 0 
          ? Math.max(...entreprise.sections_preparation.map(s => s.ordre)) + 1 
          : 0);

    entreprise.sections_preparation.push({
      type_section,
      titre,
      contenu,
      ordre: nouvelOrdre,
      actif: true
    });

    // Trier les sections par ordre
    entreprise.sections_preparation.sort((a, b) => a.ordre - b.ordre);

    await entreprise.save();
    res.json(entreprise);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour une section de préparation
const updateSectionPreparation = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { type_section, titre, contenu, ordre, actif } = req.body;

    const entreprise = await Entreprise.findById(req.params.id);
    if (!entreprise) {
      return res.status(404).json({ message: 'Entreprise non trouvée' });
    }

    const section = entreprise.sections_preparation.id(sectionId);
    if (!section) {
      return res.status(404).json({ message: 'Section non trouvée' });
    }

    // Mettre à jour les champs
    if (type_section) section.type_section = type_section;
    if (titre) section.titre = titre;
    if (contenu) section.contenu = contenu;
    if (ordre !== undefined) section.ordre = ordre;
    if (actif !== undefined) section.actif = actif;

    // Retrier les sections par ordre
    entreprise.sections_preparation.sort((a, b) => a.ordre - b.ordre);

    await entreprise.save();
    res.json(entreprise);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une section de préparation
const deleteSectionPreparation = async (req, res) => {
  try {
    const { sectionId } = req.params;

    const entreprise = await Entreprise.findById(req.params.id);
    if (!entreprise) {
      return res.status(404).json({ message: 'Entreprise non trouvée' });
    }

    // Filtrer la section à supprimer
    entreprise.sections_preparation = entreprise.sections_preparation.filter(
      section => section._id.toString() !== sectionId
    );

    await entreprise.save();
    res.json(entreprise);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Réorganiser les sections de préparation
const reorderSections = async (req, res) => {
  try {
    const { sections } = req.body; // Tableau d'objets { sectionId, ordre }

    const entreprise = await Entreprise.findById(req.params.id);
    if (!entreprise) {
      return res.status(404).json({ message: 'Entreprise non trouvée' });
    }

    // Mettre à jour les ordres
    sections.forEach(({ sectionId, ordre }) => {
      const section = entreprise.sections_preparation.id(sectionId);
      if (section) {
        section.ordre = ordre;
      }
    });

    // Trier les sections par ordre
    entreprise.sections_preparation.sort((a, b) => a.ordre - b.ordre);

    await entreprise.save();
    res.json(entreprise);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createEntreprise,
  getAllEntreprises,
  getEntrepriseById,
  updateEntreprise,
  deleteEntreprise,
  addSectionPreparation,
  updateSectionPreparation,
  deleteSectionPreparation,
  reorderSections
};
