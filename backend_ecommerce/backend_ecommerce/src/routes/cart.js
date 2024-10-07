import express from 'express';
import { getCartByUserId, updateCartTotalAmount, deleteCart } from '../controllers/cart.controller.js';
import { verifieToken } from '../auth.js'; // Importer le middleware de vérification du token

const router = express.Router();

// Routes pour gérer les paniers avec vérification du token
router.get('/cart/:id', verifieToken, getCartByUserId); // 
router.put('/cart', verifieToken, updateCartTotalAmount); // Mettre à jour le montant total du panier
router.delete('/cart/:id', verifieToken, deleteCart); // Supprimer le panier d'un utilisateur connecté

export default router;

