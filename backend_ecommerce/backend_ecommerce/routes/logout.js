import { Router } from 'express';

const router = Router();

// Route pour la déconnexion
router.post('/logout', (req, res) => {
  // Supprimer le cookie de l'accès (ou autres cookies de session si vous en avez)
  res.clearCookie('access_token', { httpOnly: true, path: '/' });

  // Répondre avec une confirmation de déconnexion
  res.status(200).json({ message: 'Logout successful' });
});

export default router;
