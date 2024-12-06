import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Chemin du dossier de stockage
const uploadsDir = path.join(process.cwd(), 'uploads/articles');

// Vérifier et créer le dossier si nécessaire
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Dossier créé : ${uploadsDir}`);
}

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Dossier de stockage
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Nom unique
  },
});

// Filtrer les fichiers pour autoriser uniquement les images
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées !'));
  }
};

// Configuration de Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Taille max : 5MB
  fileFilter: fileFilter,
});

export default upload;
