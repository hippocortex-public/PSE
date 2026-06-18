const express = require('express');
const router = express.Router();
const projetController = require('../controllers/projetController');

// Routes pour les projets
router.post('/', projetController.createProjet);
router.get('/', projetController.getAllProjets);
router.get('/:id', projetController.getProjetById);
router.put('/:id', projetController.updateProjet);
router.delete('/:id', projetController.deleteProjet);

module.exports = router;
