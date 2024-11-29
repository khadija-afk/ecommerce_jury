// routes/favoriteRoutes.js

import express from 'express';
import {
    addFavorite,
    getFavoritesByUser,
    removeFavorite,
    isFavorite,
    clearFavorites
} from '../controllers/favorie.controller.js';
import { verifieToken } from '../auth.js';

const router = express.Router();

router.post('/', verifieToken, addFavorite); // Ajouter aux favoris
router.get('/', verifieToken, getFavoritesByUser); // Récupérer les favoris
router.delete('/:product_fk', verifieToken, removeFavorite); // Supprimer un favori
router.get('/:product_fk', verifieToken, isFavorite); // Vérifier si un produit est en favori
router.delete('/clear/api', verifieToken, clearFavorites);

export default router;
