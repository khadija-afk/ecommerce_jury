import express from "express";

  import {
  login,
  register,
  getAll,
  getById,
  updateById,
  deleteById,
  checkAuth, 
  updateByEmail
}from "../controllers/user.controller.js";

const router = express.Router();


/**
 * @swagger
 * /api/user/sign:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     description: Permet à un utilisateur de se connecter avec un email et un mot de passe.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *                 description: L'adresse email de l'utilisateur.
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *                 description: Le mot de passe de l'utilisateur.
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Jeton d'authentification JWT pour les futures requêtes.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *       400:
 *         description: Requête invalide (mauvais email ou mot de passe manquant)
 *       401:
 *         description: Échec de l'authentification (mauvais mot de passe ou utilisateur introuvable)
 *       500:
 *         description: Erreur serveur
 */
router.post("/sign", login);


router.post("/add", register);
// Route pour obtenir tous les utilisateurs
router.get("/all", getAll);
// Route pour obtenir un utilisateur spécifique par son ID
router.get("/get/:id", getById);
// Route pour mettre à jour un utilisateur spécifique par son ID
router.put("/update/:id", updateById);
// Route pour mettre à jour un utilisateur spécifique par son email
router.put("/update", updateByEmail);
// Route pour supprimer un utilisateur spécifique par son ID
router.delete("/delete/:id", deleteById);
// Route pour la vérification d'authentification
router.get('/check_auth', checkAuth);


export default router;
