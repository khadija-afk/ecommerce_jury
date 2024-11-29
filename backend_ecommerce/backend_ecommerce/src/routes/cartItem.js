import express from 'express';
import { getAllCartItems, getCartItemById, addCartItem, updateCartItem, deleteCartItem, clearUserCart} from '../controllers/cartItem.controller.js';
import { verifieToken } from '../auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/cart-items:
 *   get:
 *     summary: Récupérer tous les articles du panier
 *     description: Renvoie tous les articles présents dans le panier de l'utilisateur connecté.
 *     tags:
 *       - Articles du Panier
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des articles du panier
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_cart_item:
 *                     type: integer
 *                     example: 1
 *                   product_name:
 *                     type: string
 *                     example: "Produit A"
 *                   quantity:
 *                     type: integer
 *                     example: 3
 *                   price:
 *                     type: number
 *                     format: float
 *                     example: 29.99
 *       404:
 *         description: Aucun article trouvé dans le panier
 *       500:
 *         description: Erreur serveur
 */
router.get('/cart-items', verifieToken, getAllCartItems);

/**
 * @swagger
 * /api/cart-items/{id}:
 *   get:
 *     summary: Récupérer un article du panier par son ID
 *     description: Renvoie les détails d'un article spécifique dans le panier en fonction de son ID.
 *     tags:
 *       - Articles du Panier
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de l'article à récupérer
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Détails de l'article
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_cart_item:
 *                   type: integer
 *                   example: 1
 *                 product_name:
 *                   type: string
 *                   example: "Produit A"
 *                 quantity:
 *                   type: integer
 *                   example: 3
 *                 price:
 *                   type: number
 *                   format: float
 *                   example: 29.99
 *       404:
 *         description: Article non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/cart-items/:id', verifieToken,  getCartItemById);

/**
 * @swagger
 * /api/cart-items:
 *   post:
 *     summary: Ajouter un nouvel article au panier
 *     description: Ajoute un nouvel article dans le panier de l'utilisateur connecté.
 *     tags:
 *       - Articles du Panier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - quantity
 *             properties:
 *               product_id:
 *                 type: integer
 *                 description: ID du produit à ajouter au panier
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 description: Quantité de produit à ajouter
 *                 example: 2
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Article ajouté au panier avec succès
 *       400:
 *         description: Données manquantes ou invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/cart-items', verifieToken, addCartItem);

/**
 * @swagger
 * /api/cart-items/{id}:
 *   put:
 *     summary: Mettre à jour un article du panier
 *     description: Met à jour les détails d'un article du panier, par exemple, pour modifier la quantité.
 *     tags:
 *       - Articles du Panier
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de l'article à mettre à jour
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
 *                 description: Nouvelle quantité pour l'article
 *                 example: 5
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Article mis à jour avec succès
 *       404:
 *         description: Article non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/cart-items/:id', verifieToken, updateCartItem);

/**
 * @swagger
 * /api/cart-items/{id}:
 *   delete:
 *     summary: Supprimer un article du panier
 *     description: Supprime un article spécifique du panier de l'utilisateur connecté.
 *     tags:
 *       - Articles du Panier
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de l'article à supprimer
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Article supprimé avec succès
 *       404:
 *         description: Article non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/cart-items/:id', verifieToken, deleteCartItem);


router.post('/cart-items/clear', verifieToken, clearUserCart);
export default router;
