const express = require('express');
const router = express.Router();
const competenceController = require('../controllers/competenceController');

// Routes pour les compétences
router.post('/', competenceController.createCompetence);
router.get('/', competenceController.getAllCompetences);
router.get('/:id', competenceController.getCompetenceById);
router.put('/:id', competenceController.updateCompetence);
router.delete('/:id', competenceController.deleteCompetence);

// Route pour créer ou récupérer une compétence par nom
router.post('/get-or-create', competenceController.getOrCreateCompetenceByNom);

module.exports = router;
