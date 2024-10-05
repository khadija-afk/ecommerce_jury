import express from 'express';
import * as categorieController from '../controllers/categorie.controller.js';

const router = express.Router();

// Route pour récupérer toutes les catégories
router.get('/', categorieController.getAllCategories);

// Route pour récupérer une catégorie par son ID
router.get('/:id', categorieController.getCategoryById);

// Route pour créer une nouvelle catégorie
router.post('/', categorieController.createCategory);

// Route pour mettre à jour une catégorie par son ID
router.put('/:id', categorieController.updateCategory);

// Route pour supprimer une catégorie par son ID
router.delete('/:id', categorieController.deleteCategory);

export default router;
