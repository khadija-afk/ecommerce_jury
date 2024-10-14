import express from 'express';
import * as categorieController from '../controllers/categorie.controller.js';
import { verifieToken } from '../auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Récupérer toutes les catégories
 *     description: Renvoie la liste de toutes les catégories disponibles dans le système.
 *     tags:
 *       - Catégories
 *     responses:
 *       200:
 *         description: Liste des catégories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_category:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Électronique"
 *                   description:
 *                     type: string
 *                     example: "Appareils et gadgets électroniques"
 *       404:
 *         description: Aucune catégorie trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/', categorieController.getAllCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Récupérer une catégorie par son ID
 *     description: Renvoie les détails d'une catégorie spécifique en fonction de son ID.
 *     tags:
 *       - Catégories
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la catégorie à récupérer
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Détails de la catégorie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_category:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Électronique"
 *                 description:
 *                   type: string
 *                   example: "Appareils et gadgets électroniques"
 *       404:
 *         description: Catégorie non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', categorieController.getCategoryById);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Créer une nouvelle catégorie
 *     description: Permet de créer une nouvelle catégorie dans le système.
 *     tags:
 *       - Catégories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom de la catégorie
 *                 example: "Mode"
 *               description:
 *                 type: string
 *                 description: Description de la catégorie
 *                 example: "Vêtements et accessoires de mode"
 *     responses:
 *       201:
 *         description: Catégorie créée avec succès
 *       400:
 *         description: Données invalides ou manquantes
 *       500:
 *         description: Erreur serveur
 */
router.post('/', categorieController.createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Mettre à jour une catégorie
 *     description: Permet de mettre à jour les informations d'une catégorie spécifique.
 *     tags:
 *       - Catégories
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la catégorie à mettre à jour
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
 *               name:
 *                 type: string
 *                 description: Nom de la catégorie
 *                 example: "Mode"
 *               description:
 *                 type: string
 *                 description: Description de la catégorie
 *                 example: "Vêtements et accessoires de mode"
 *     responses:
 *       200:
 *         description: Catégorie mise à jour avec succès
 *       404:
 *         description: Catégorie non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', categorieController.updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Supprimer une catégorie
 *     description: Supprime une catégorie spécifique par son ID.
 *     tags:
 *       - Catégories
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la catégorie à supprimer
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Catégorie supprimée avec succès
 *       404:
 *         description: Catégorie non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', categorieController.deleteCategory);

export default router;
