const express = require('express');
const router = express.Router();
const entrepriseController = require('../controllers/entrepriseController');

// Routes pour les entreprises
router.post('/', entrepriseController.createEntreprise);
router.get('/', entrepriseController.getAllEntreprises);
router.get('/:id', entrepriseController.getEntrepriseById);
router.put('/:id', entrepriseController.updateEntreprise);
router.delete('/:id', entrepriseController.deleteEntreprise);

// Routes pour les sections de préparation
router.post('/:id/sections', entrepriseController.addSectionPreparation);
router.put('/:id/sections/:sectionId', entrepriseController.updateSectionPreparation);
router.delete('/:id/sections/:sectionId', entrepriseController.deleteSectionPreparation);
router.put('/:id/sections/reorder', entrepriseController.reorderSections);

module.exports = router;
