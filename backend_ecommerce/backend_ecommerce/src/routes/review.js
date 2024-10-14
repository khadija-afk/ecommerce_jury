import express from 'express';
import { verifieToken } from '../auth.js';
import { getAllReviews, getReviewById, createReview, updateReview, deleteReview, getAverageRating } from '../controllers/review.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Récupérer tous les avis
 *     description: Renvoie une liste de tous les avis disponibles.
 *     tags:
 *       - Avis
 *     responses:
 *       200:
 *         description: Liste des avis
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_review:
 *                     type: integer
 *                     example: 1
 *                   product_id:
 *                     type: integer
 *                     example: 123
 *                   user_id:
 *                     type: integer
 *                     example: 456
 *                   rating:
 *                     type: integer
 *                     example: 5
 *                   comment:
 *                     type: string
 *                     example: "Excellent produit"
 *       404:
 *         description: Aucun avis trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/', getAllReviews);

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Récupérer un avis par son ID
 *     description: Renvoie les détails d'un avis spécifique en fonction de son ID.
 *     tags:
 *       - Avis
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de l'avis à récupérer
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Détails de l'avis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_review:
 *                   type: integer
 *                   example: 1
 *                 product_id:
 *                   type: integer
 *                   example: 123
 *                 user_id:
 *                   type: integer
 *                   example: 456
 *                 rating:
 *                   type: integer
 *                   example: 5
 *                 comment:
 *                   type: string
 *                   example: "Excellent produit"
 *       404:
 *         description: Avis non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', getReviewById);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Créer un nouvel avis
 *     description: Permet de créer un nouvel avis sur un produit. Route protégée par authentification.
 *     tags:
 *       - Avis
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - rating
 *               - comment
 *             properties:
 *               product_id:
 *                 type: integer
 *                 description: ID du produit associé à l'avis
 *                 example: 123
 *               rating:
 *                 type: integer
 *                 description: Note de l'avis (entre 1 et 5)
 *                 example: 5
 *               comment:
 *                 type: string
 *                 description: Commentaire de l'utilisateur sur le produit
 *                 example: "Excellent produit"
 *     security:
 *       - bearerAuth: []  # Protection par token
 *     responses:
 *       201:
 *         description: Avis créé avec succès
 *       400:
 *         description: Données invalides ou manquantes
 *       500:
 *         description: Erreur serveur
 */
router.post('/', verifieToken, createReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Mettre à jour un avis
 *     description: Met à jour un avis existant. Route protégée par authentification.
 *     tags:
 *       - Avis
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de l'avis à mettre à jour
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
 *               rating:
 *                 type: integer
 *                 description: Nouvelle note pour l'avis
 *                 example: 4
 *               comment:
 *                 type: string
 *                 description: Nouveau commentaire pour l'avis
 *                 example: "Bon produit, mais améliorable"
 *     security:
 *       - bearerAuth: []  # Protection par token
 *     responses:
 *       200:
 *         description: Avis mis à jour avec succès
 *       404:
 *         description: Avis non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', verifieToken, updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Supprimer un avis
 *     description: Supprime un avis spécifique par son ID. Route protégée par authentification.
 *     tags:
 *       - Avis
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de l'avis à supprimer
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []  # Protection par token
 *     responses:
 *       200:
 *         description: Avis supprimé avec succès
 *       404:
 *         description: Avis non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', verifieToken, deleteReview);

/**
 * @swagger
 * /api/reviews/{productId}/average:
 *   get:
 *     summary: Récupérer la note moyenne d'un produit
 *     description: Calcule et renvoie la note moyenne d'un produit spécifique en fonction de ses avis.
 *     tags:
 *       - Avis
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: ID du produit pour lequel calculer la note moyenne
 *         schema:
 *           type: integer
 *           example: 123
 *     responses:
 *       200:
 *         description: Note moyenne calculée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product_id:
 *                   type: integer
 *                   example: 123
 *                 average_rating:
 *                   type: number
 *                   format: float
 *                   example: 4.5
 *       404:
 *         description: Aucun avis trouvé pour ce produit
 *       500:
 *         description: Erreur serveur
 */
router.get('/:productId/average', getAverageRating);

export default router;
