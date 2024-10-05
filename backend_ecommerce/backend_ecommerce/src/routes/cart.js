import express from 'express';
import { getCartByUserId, createCart, updateCartTotalAmount, deleteCart } from '../controllers/cart.controller.js';
import { verifieToken } from '../auth.js'; // Importer le middleware de vérification du token

const router = express.Router();

// Routes pour gérer les paniers avec vérification du token
router.get('/cart', verifieToken, getCartByUserId); // Obtenir le panier d'un utilisateur connecté
router.post('/cart', verifieToken, createCart); // Créer un panier pour un utilisateur connecté
router.put('/cart', verifieToken, updateCartTotalAmount); // Mettre à jour le montant total du panier
router.delete('/cart', verifieToken, deleteCart); // Supprimer le panier d'un utilisateur connecté

export default router;

