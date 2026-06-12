const express = require('express');
const router = express.Router();
const candidatureController = require('../controllers/candidatureController');

// Routes pour les candidatures
router.post('/', candidatureController.createCandidature);
router.get('/', candidatureController.getAllCandidatures);
router.get('/:id', candidatureController.getCandidatureById);
router.put('/:id', candidatureController.updateCandidature);
router.delete('/:id', candidatureController.deleteCandidature);

// Route pour mettre à jour le statut (avec historique)
router.put('/:id/statut', candidatureController.updateStatut);

// Routes pour les documents
router.post('/:id/documents', candidatureController.addDocument);
router.delete('/:id/documents/:documentId', candidatureController.deleteDocument);

module.exports = router;
