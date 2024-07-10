import express from 'express';
import { getAllOrderItems, getOrderItemById, createOrderItem, updateOrderItem, deleteOrderItem } from '../controllers/orderItem.controller.js';

const router = express.Router();

// Récupérer tous les articles de commande
router.get('/', getAllOrderItems);

// Récupérer un article de commande par son ID
router.get('/:id', getOrderItemById);

// Créer un nouvel article de commande
router.post('/', createOrderItem);

// Mettre à jour un article de commande
router.put('/:id', updateOrderItem);

// Supprimer un article de commande
router.delete('/:id', deleteOrderItem);

export default router;
