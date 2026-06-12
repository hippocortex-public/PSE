const express = require('express');
const router = express.Router();
const { upload, handleUploadError } = require('../middlewares/uploadMiddleware');
const Candidature = require('../models/Candidature');

// Route pour uploader un document (CV ou lettre de motivation)
router.post('/', upload.single('document'), handleUploadError, async (req, res) => {
  try {
    const { candidature_id, type_document, version } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier téléchargé' });
    }

    // Vérifier que la candidature existe
    const candidature = await Candidature.findById(candidature_id);
    if (!candidature) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }

    // Construire l'URL complète pour accéder au fichier
    // En développement: http://localhost:3000/uploads/filename
    // En production via Docker: http://backend:3000/uploads/filename
    const baseUrl = process.env.FRONTEND_URL ? 
      new URL('/api/uploads', process.env.FRONTEND_URL).origin : 
      'http://localhost:3000';
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    // Ajouter le document à la candidature
    candidature.documents.push({
      type_document,
      nom_fichier: req.file.originalname,
      chemin_fichier: `/uploads/${req.file.filename}`,
      url_complete: fileUrl,  // URL complète pour l'accès direct
      version: version || '1.0'
    });

    await candidature.save();

    res.status(201).json({
      message: 'Document téléchargé avec succès',
      document: {
        type_document,
        nom_fichier: req.file.originalname,
        chemin_fichier: `/uploads/${req.file.filename}`,
        url_complete: fileUrl,
        version: version || '1.0'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
