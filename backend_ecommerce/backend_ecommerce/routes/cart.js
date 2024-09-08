import express from 'express';
import { getCartByUserId, createCart, updateCartTotalAmount, deleteCart } from '../controllers/cart.controller.js';

const router = express.Router();

router.get('/cart/:userId', getCartByUserId); // Obtenir le panier d'un utilisateur
router.post('/cart/:userId', createCart); // Créer un panier pour un utilisateur
router.put('/cart/:userId', updateCartTotalAmount); // Mettre à jour le montant total du panier
router.delete('/cart/:userId', deleteCart); // Supprimer le panier d'un utilisateur

export default router;
