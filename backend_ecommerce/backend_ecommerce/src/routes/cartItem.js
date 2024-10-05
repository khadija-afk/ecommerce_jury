import express from 'express';
import { getAllCartItems, getCartItemById, addCartItem, updateCartItem, deleteCartItem} from '../controllers/cartItem.controller.js';
import { verifieToken } from '../auth.js';

const router = express.Router();

// Récupérer tous les articles du panier (optionnel, mais utile pour la gestion globale du panier)
router.get('/cart-items',verifieToken, getAllCartItems);

// Récupérer un article spécifique du panier par son ID
router.get('/cart-items/:id', getCartItemById);

// Ajouter un nouvel article au panier
router.post('/cart-items',verifieToken, addCartItem);

// Mettre à jour un article du panier (par exemple, modifier la quantité)
router.put('/cart-items/:id', verifieToken, updateCartItem);

// Supprimer un article du panier
router.delete('/cart-items/:id', verifieToken, deleteCartItem);

export default router;
