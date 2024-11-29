import express from 'express';
import { getCartByUserId, updateCartTotalAmount, deleteCart } from '../controllers/cart.controller.js';
import { verifieToken } from '../auth.js'; // Importer le middleware de vérification du token

const router = express.Router();

/**
 * @swagger
 * /api/cart/{id}:
 *   get:
 *     summary: Récupérer le panier d'un utilisateur par ID
 *     description: Renvoie le panier d'un utilisateur spécifique en fonction de son ID.
 *     tags:
 *       - Panier
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de l'utilisateur pour lequel récupérer le panier
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []  # Ajoute la vérification du token
 *     responses:
 *       200:
 *         description: Détails du panier de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_cart:
 *                   type: integer
 *                   example: 1
 *                 totalAmount:
 *                   type: number
 *                   format: float
 *                   example: 120.50
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_product:
 *                         type: integer
 *                         example: 101
 *                       name:
 *                         type: string
 *                         example: "T-shirt"
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *                       price:
 *                         type: number
 *                         format: float
 *                         example: 29.99
 *       404:
 *         description: Panier non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/cart', verifieToken, getCartByUserId);

/**
 * @swagger
 * /api/cart:
 *   put:
 *     summary: Mettre à jour le montant total du panier
 *     description: Met à jour le montant total du panier en fonction des articles ajoutés ou modifiés.
 *     tags:
 *       - Panier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_cart
 *               - totalAmount
 *             properties:
 *               id_cart:
 *                 type: integer
 *                 description: ID du panier
 *                 example: 1
 *               totalAmount:
 *                 type: number
 *                 format: float
 *                 description: Montant total du panier mis à jour
 *                 example: 250.75
 *     security:
 *       - bearerAuth: []  # Ajoute la vérification du token
 *     responses:
 *       200:
 *         description: Montant total mis à jour
 *       404:
 *         description: Panier non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/cart', verifieToken, updateCartTotalAmount);

/**
 * @swagger
 * /api/cart/{id}:
 *   delete:
 *     summary: Supprimer le panier d'un utilisateur
 *     description: Supprime le panier d'un utilisateur en fonction de l'ID.
 *     tags:
 *       - Panier
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de l'utilisateur pour lequel supprimer le panier
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []  # Ajoute la vérification du token
 *     responses:
 *       200:
 *         description: Panier supprimé
 *       404:
 *         description: Panier non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/cart/:id', verifieToken, deleteCart);

export default router;
