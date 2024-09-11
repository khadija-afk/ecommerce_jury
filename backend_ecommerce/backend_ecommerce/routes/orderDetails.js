import express from 'express';
import {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
} from '../controllers/orderDetails.controller.js'; // Assurez-vous que le nom est correct
import { verifieToken } from '../auth.js'; // Middleware pour vérifier le token

const router = express.Router();

// Récupérer toutes les commandes (route protégée)
router.get('/orders', verifieToken, getAllOrders);

// Récupérer une commande par son ID (route protégée)
router.get('/orders/:id', verifieToken, getOrderById);

// Créer une nouvelle commande (route protégée)
router.post('/orders', verifieToken, createOrder);

// Mettre à jour une commande existante (route protégée)
router.put('/orders/:id', verifieToken, updateOrder);

// Supprimer une commande (route protégée)
router.delete('/orders/:id', verifieToken, deleteOrder);

export default router;
