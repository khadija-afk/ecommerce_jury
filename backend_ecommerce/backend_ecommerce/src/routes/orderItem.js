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

/**
 * @swagger
 * /api/order-items:
 *   get:
 *     summary: Récupérer tous les articles de commande
 *     description: Renvoie la liste de tous les articles de commande pour l'utilisateur connecté. Route protégée par authentification.
 *     tags:
 *       - Articles de Commande
 *     security:
 *       - bearerAuth: []  # Protection par token
 *     responses:
 *       200:
 *         description: Liste des articles de commande
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_order_item:
 *                     type: integer
 *                     example: 1
 *                   order_id:
 *                     type: integer
 *                     example: 123
 *                   product_id:
 *                     type: integer
 *                     example: 456
 *                   quantity:
 *                     type: integer
 *                     example: 2
 *                   price:
 *                     type: number
 *                     format: float
 *                     example: 29.99
 *       404:
 *         description: Aucun article de commande trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/order-items', verifieToken, getAllOrderItems);

/**
 * @swagger
 * /api/order-items/{id}:
 *   get:
 *     summary: Récupérer un article de commande par son ID
 *     description: Renvoie les détails d'un article de commande spécifique en fonction de son ID. Route protégée par authentification.
 *     tags:
 *       - Articles de Commande
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de l'article de commande à récupérer
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []  # Protection par token
 *     responses:
 *       200:
 *         description: Détails de l'article de commande
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_order_item:
 *                   type: integer
 *                   example: 1
 *                 order_id:
 *                   type: integer
 *                   example: 123
 *                 product_id:
 *                   type: integer
 *                   example: 456
 *                 quantity:
 *                   type: integer
 *                   example: 2
 *                 price:
 *                   type: number
 *                   format: float
 *                   example: 29.99
 *       404:
 *         description: Article de commande non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/order-items/:id', verifieToken, getOrderItemById);

/**
 * @swagger
 * /api/order-items:
 *   post:
 *     summary: Créer un nouvel article de commande
 *     description: Crée un nouvel article de commande pour l'utilisateur connecté. Route protégée par authentification.
 *     tags:
 *       - Articles de Commande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *               - product_id
 *               - quantity
 *               - price
 *             properties:
 *               order_id:
 *                 type: integer
 *                 description: ID de la commande associée
 *                 example: 123
 *               product_id:
 *                 type: integer
 *                 description: ID du produit commandé
 *                 example: 456
 *               quantity:
 *                 type: integer
 *                 description: Quantité commandée
 *                 example: 2
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Prix unitaire du produit commandé
 *                 example: 29.99
 *     security:
 *       - bearerAuth: []  # Protection par token
 *     responses:
 *       201:
 *         description: Article de commande créé avec succès
 *       400:
 *         description: Données manquantes ou invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/order-items', verifieToken, createOrderItem);

/**
 * @swagger
 * /api/order-items/{id}:
 *   put:
 *     summary: Mettre à jour un article de commande
 *     description: Met à jour les informations d'un article de commande spécifique. Route protégée par authentification.
 *     tags:
 *       - Articles de Commande
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de l'article de commande à mettre à jour
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: Nouvelle quantité pour l'article de commande
 *                 example: 5
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Nouveau prix unitaire pour l'article de commande
 *                 example: 25.00
 *     security:
 *       - bearerAuth: []  # Protection par token
 *     responses:
 *       200:
 *         description: Article de commande mis à jour avec succès
 *       404:
 *         description: Article de commande non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/order-items/:id', verifieToken, updateOrderItem);

/**
 * @swagger
 * /api/order-items/{id}:
 *   delete:
 *     summary: Supprimer un article de commande
 *     description: Supprime un article de commande spécifique par son ID. Route protégée par authentification.
 *     tags:
 *       - Articles de Commande
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de l'article de commande à supprimer
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []  # Protection par token
 *     responses:
 *       200:
 *         description: Article de commande supprimé avec succès
 *       404:
 *         description: Article de commande non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/order-items/:id', verifieToken, deleteOrderItem);

export default router;
