import express from 'express';
import {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    downloadInvoice
} from '../controllers/orderDetails.controller.js'; // Assurez-vous que le nom est correct
import { verifieToken } from '../auth.js'; // Middleware pour vérifier le token

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Récupérer toutes les commandes
 *     description: Renvoie la liste de toutes les commandes dans le système. Route protégée par authentification.
 *     tags:
 *       - Commandes
 *     security:
 *       - bearerAuth: []  # Protection par token
 *     responses:
 *       200:
 *         description: Liste des commandes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_order:
 *                     type: integer
 *                     example: 1
 *                   user_id:
 *                     type: integer
 *                     example: 123
 *                   total_price:
 *                     type: number
 *                     format: float
 *                     example: 150.50
 *                   status:
 *                     type: string
 *                     example: "En cours"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-10-12T10:30:00Z"
 *       404:
 *         description: Aucune commande trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/orders', verifieToken, getAllOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Récupérer une commande par son ID
 *     description: Renvoie les détails d'une commande spécifique en fonction de son ID. Route protégée par authentification.
 *     tags:
 *       - Commandes
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la commande à récupérer
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []  # Protection par token
 *     responses:
 *       200:
 *         description: Détails de la commande
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_order:
 *                   type: integer
 *                   example: 1
 *                 user_id:
 *                   type: integer
 *                   example: 123
 *                 total_price:
 *                   type: number
 *                   format: float
 *                   example: 150.50
 *                 status:
 *                   type: string
 *                   example: "En cours"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-12T10:30:00Z"
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/orders/:id', verifieToken, getOrderById);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Créer une nouvelle commande
 *     description: Crée une nouvelle commande dans le système. Route protégée par authentification.
 *     tags:
 *       - Commandes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - total_price
 *               - status
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID de l'utilisateur qui passe la commande
 *                 example: 123
 *               total_price:
 *                 type: number
 *                 format: float
 *                 description: Prix total de la commande
 *                 example: 150.50
 *               status:
 *                 type: string
 *                 description: Statut de la commande
 *                 example: "En cours"
 *     security:
 *       - bearerAuth: []  # Protection par token
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 *       400:
 *         description: Données invalides ou manquantes
 *       500:
 *         description: Erreur serveur
 */
router.post('/orders', verifieToken, createOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Mettre à jour une commande
 *     description: Met à jour les informations d'une commande spécifique. Route protégée par authentification.
 *     tags:
 *       - Commandes
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la commande à mettre à jour
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
 *               total_price:
 *                 type: number
 *                 format: float
 *                 description: Nouveau prix total de la commande
 *                 example: 200.00
 *               status:
 *                 type: string
 *                 description: Nouveau statut de la commande
 *                 example: "Livrée"
 *     security:
 *       - bearerAuth: []  # Protection par token
 *     responses:
 *       200:
 *         description: Commande mise à jour avec succès
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put('/orders/:id', verifieToken, updateOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Supprimer une commande
 *     description: Supprime une commande spécifique par son ID. Route protégée par authentification.
 *     tags:
 *       - Commandes
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la commande à supprimer
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []  # Protection par token
 *     responses:
 *       200:
 *         description: Commande supprimée avec succès
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/orders/:id', verifieToken, deleteOrder);
router.get('/order/:orderId/invoice', verifieToken, downloadInvoice);

export default router;
