import express from 'express';
import { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder } from '../controllers/order.controller.js';

const router = express.Router();

// Récupérer toutes les commandes
router.get('/', getAllOrders);

// Récupérer une commande par son ID
router.get('/:id', getOrderById);

// Créer une nouvelle commande
router.post('/', createOrder);

// Mettre à jour une commande
router.put('/:id', updateOrder);

// Supprimer une commande
router.delete('/:id', deleteOrder);

export default router;
