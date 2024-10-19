import express from 'express';
import { searchArticles } from '../controllers/search.controller.js'; // Importation de la fonction de recherche

const router = express.Router();

// Route de recherche
router.get('/search', searchArticles); // Appeler la fonction de recherche lors d'une requête GET sur /search

export default router;
