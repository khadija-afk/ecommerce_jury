import express from 'express';
import { getAllCartItems, getCartItemById, addCartItem, updateCartItem, deleteCartItem } from '../controllers/cartItem.controller.js';

const router = express.Router();

// Récupérer tous les articles du panier
router.get('/', getAllCartItems);

// Récupérer un article du panier par son ID
router.get('/:id', getCartItemById);

// Ajouter un nouvel article au panier
router.post('/', addCartItem);

// Mettre à jour un article du panier
router.put('/:id', updateCartItem);

// Supprimer un article du panier
router.delete('/:id', deleteCartItem);

export default router;
