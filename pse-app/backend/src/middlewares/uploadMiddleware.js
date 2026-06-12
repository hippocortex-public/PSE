const multer = require('multer');
const path = require('path');

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    // Générer un nom de fichier unique avec timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const nomFichier = `${file.fieldname}-${uniqueSuffix}${extension}`;
    cb(null, nomFichier);
  }
});

// Filtre pour accepter uniquement les fichiers PDF, DOC, DOCX
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers PDF, DOC et DOCX sont autorisés'), false);
  }
};

// Limite de taille (5 Mo)
const limits = {
  fileSize: 5 * 1024 * 1024
};

// Middleware pour l'upload de fichiers
const upload = multer({
  storage,
  fileFilter,
  limits
});

// Middleware pour gérer les erreurs d'upload
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Erreur spécifique à Multer
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Le fichier est trop volumineux (max 5 Mo)' });
    }
    return res.status(400).json({ message: err.message });
  } else if (err) {
    // Autres erreurs
    return res.status(400).json({ message: err.message });
  }
  next();
};

module.exports = {
  upload,
  handleUploadError
};
