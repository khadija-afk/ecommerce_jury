// routes/article.js
import express from 'express';
import { verifieToken } from '../auth.js';
import upload from '../multer.config.js'; // Importer la config Multer
import { verifyRole } from '../authMidlleware.js';
import {
  add,
  getAll,
  getById,
  updateById,
  deleteById,
  getByUser,
  getReview,
  getArticlesByCategory
} from "../controllers/article.controller.js";

/**
 * @swagger
 * /api/article/{id}:
 *   get:
 *     summary: Récupérer un élément par ID
 *     description: Renvoie les détails d'un élément spécifique en fonction de l'ID fourni.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Détails de l'élément
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello, world!
 * /api/article:
 *   post:
 *     summary: Renvoie un article
 *     parameters:
 *       - name: article_id
 *         required: true
 *     responses:
 *       200:
 *         description: Message de bienvenue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello, world!
 *   get:
 *     summary: Renvoie un article
 *     parameters:
 *       - name: id
 *         in: formData
 *         type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Message de bienvenue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   name: string
 *                   example: CLIO
 *   put:
 *     summary: Renvoie un article
 *     responses:
 *       200:
 *         description: Message de bienvenue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello, world!
 *   delete:
 *     summary: Renvoie un article
 *     responses:
 *       200:
 *         description: Message de bienvenue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello, world!
 */

const router = express.Router();

/**
 * @swagger
 * /api/article/{id}:
 *   get:
 *     summary: Récupérer un élément par ID
 */
router.post('/', verifieToken, upload.single('photo'), verifyRole(['admin']), add);

/**
 * @swagger
 * /api/article/{id}:
 *   get:
 *     summary: Récupérer un élément par ID
 */
router.get('/', getAll);

/**
 * @swagger
 * /api/article/{id}:
 *   get:
 *     summary: Récupérer un élément par ID
 */
router.get('/:id', getById);

/**
 * @swagger
 * /api/article/{id}:
 *   put:
 *     summary: Récupérer un élément par ID
 */
router.put('/:id', verifieToken, verifyRole(['admin']),upload.single('photo'), updateById);

/**
 * @swagger
 * /api/article/{id}:
 *   get:
 *     summary: Récupérer un élément par ID
 */
router.delete('/:id', verifieToken,verifyRole(['admin']), deleteById);


/**
 * @swagger
 * /api/article/{id}:
 *   get:
 *     summary: Récupérer un élément par ID
 */
router.get('/user/articles', verifieToken, getByUser);

/**
 * @swagger
 * /api/article/{id}:
 *   get:
 *     summary: Récupérer un éléme
 */
router.get('/:id/avis', getReview);

router.get('/category/:id', getArticlesByCategory)
export default router;