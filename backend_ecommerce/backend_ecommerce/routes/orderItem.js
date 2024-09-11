import express from 'express';
import {
    getAllOrderItems,
    getOrderItemById,
    createOrderItem,
    updateOrderItem,
    deleteOrderItem,
} from '../controllers/orderItem.controller.js';
import { verifieToken } from '../auth.js'; // Middleware pour vérifier le token

const router = express.Router();

// Récupérer tous les articles de commande de l'utilisateur connecté (route protégée)
router.get('/order-items', verifieToken, getAllOrderItems);

// Récupérer un article de commande par son ID (route protégée)
router.get('/order-items/:id', verifieToken, getOrderItemById);

// Créer un nouvel article de commande (route protégée)
router.post('/order-items', verifieToken, createOrderItem);

// Mettre à jour un article de commande (route protégée)
router.put('/order-items/:id', verifieToken, updateOrderItem);

// Supprimer un article de commande (route protégée)
router.delete('/order-items/:id', verifieToken, deleteOrderItem);

export default router;
