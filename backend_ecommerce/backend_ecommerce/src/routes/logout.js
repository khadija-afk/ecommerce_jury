import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: Déconnexion de l'utilisateur
 *     description: Déconnecte l'utilisateur en supprimant le cookie d'accès.
 *     tags:
 *       - Authentification
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout successful"
 *       500:
 *         description: Erreur serveur
 */
router.post('/logout', (req, res) => {
  // Supprimer le cookie d'accès (ou autres cookies de session si vous en avez)
  res.clearCookie('access_token', { httpOnly: true, path: '/' });

  // Répondre avec une confirmation de déconnexion
  res.status(200).json({ message: 'Logout successful' });
});

export default router;
