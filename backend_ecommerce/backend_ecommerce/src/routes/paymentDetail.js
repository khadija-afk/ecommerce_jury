import express from 'express';
import {
    getAllPaymentDetails,
    getPaymentDetailById,
    addPaymentDetail,
    updatePaymentDetail,
    deletePaymentDetail
} from '../controllers/paymentDetail.controller.js';
import { verifieToken } from '../auth.js'; // Middleware pour la vérification du token

const router = express.Router();

/**
 * @swagger
 * /api/payment-details:
 *   get:
 *     summary: Récupérer tous les détails de paiement
 *     description: Renvoie la liste de tous les détails de paiement dans le système. Route protégée par authentification.
 *     tags:
 *       - Détails de Paiement
 *     security:
 *       - bearerAuth: []  # Protection par token
 *     responses:
 *       200:
 *         description: Liste des détails de paiement
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_payment_detail:
 *                     type: integer
 *                     example: 1
 *                   order_id:
 *                     type: integer
 *                     example: 123
 *                   payment_method:
 *                     type: string
 *                     example: "Carte de crédit"
 *                   amount:
 *                     type: number
 *                     format: float
 *                     example: 150.50
 *       404:
 *         description: Aucun détail de paiement trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/payment-details', verifieToken, getAllPaymentDetails);

/**
 * @swagger
 * /api/payment-details/{id}:
 *   get:
 *     summary: Récupérer un détail de paiement par son ID
 *     description: Renvoie les détails d'un paiement spécifique en fonction de son ID. Route protégée par authentification.
 *     tags:
 *       - Détails de Paiement
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du détail de paiement à récupérer
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []  # Protection par token
 *     responses:
 *       200:
 *         description: Détail de paiement trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_payment_detail:
 *                   type: integer
 *                   example: 1
 *                 order_id:
 *                   type: integer
 *                   example: 123
 *                 payment_method:
 *                   type: string
 *                   example: "Carte de crédit"
 *                 amount:
 *                   type: number
 *                   format: float
 *                   example: 150.50
 *       404:
 *         description: Détail de paiement non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/payment-details/:id', verifieToken, getPaymentDetailById);

/**
 * @swagger
 * /api/payment-details:
 *   post:
 *     summary: Ajouter un nouveau détail de paiement
 *     description: Crée un nouveau détail de paiement dans le système. Route protégée par authentification.
 *     tags:
 *       - Détails de Paiement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *               - payment_method
 *               - amount
 *             properties:
 *               order_id:
 *                 type: integer
 *                 description: ID de la commande associée
 *                 example: 123
 *               payment_method:
 *                 type: string
 *                 description: Méthode de paiement utilisée
 *                 example: "Carte de crédit"
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: Montant du paiement
 *                 example: 150.50
 *     security:
 *       - bearerAuth: []  # Protection par token
 *     responses:
 *       201:
 *         description: Détail de paiement créé avec succès
 *       400:
 *         description: Données manquantes ou invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/payment-details', verifieToken, addPaymentDetail);

/**
 * @swagger
 * /api/payment-details/{id}:
 *   put:
 *     summary: Mettre à jour un détail de paiement
 *     description: Met à jour les informations d'un détail de paiement spécifique. Route protégée par authentification.
 *     tags:
 *       - Détails de Paiement
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du détail de paiement à mettre à jour
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
 *               payment_method:
 *                 type: string
 *                 description: Nouvelle méthode de paiement
 *                 example: "Virement bancaire"
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: Nouveau montant du paiement
 *                 example: 200.00
 *     security:
 *       - bearerAuth: []  # Protection par token
 *     responses:
 *       200:
 *         description: Détail de paiement mis à jour avec succès
 *       404:
 *         description: Détail de paiement non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/payment-details/:id', verifieToken, updatePaymentDetail);

/**
 * @swagger
 * /api/payment-details/{id}:
 *   delete:
 *     summary: Supprimer un détail de paiement
 *     description: Supprime un détail de paiement spécifique par son ID. Route protégée par authentification.
 *     tags:
 *       - Détails de Paiement
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du détail de paiement à supprimer
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []  # Protection par token
 *     responses:
 *       200:
 *         description: Détail de paiement supprimé avec succès
 *       404:
 *         description: Détail de paiement non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/payment-details/:id', verifieToken, deletePaymentDetail);

export default router;
