// routes/article.js
import express from 'express';
import { verifieToken } from '../auth.js';
import {
  add,
  getAll,
  getById,
  updateById,
  deleteById,
  // getByAsc,
  // getByDesc,
  getByUser,
  getReview
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
router.post('/', verifieToken, add);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', verifieToken, updateById);
router.delete('/:id', verifieToken, deleteById);
// router.get('/sort/asc', getByAsc);
// router.get('/sort/desc', getByDesc);
router.get('/user/articles', verifieToken, getByUser);
router.get('/:id/avis', getReview);
export default router;