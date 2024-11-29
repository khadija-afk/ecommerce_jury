// src/routes/passwordRoutes.js
import { Router } from 'express';
import {
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
} from '../controllers/forget.controller.js';

const router = Router();

// Route pour demander la réinitialisation du mot de passe
router.post('/request-reset', requestPasswordReset);

// Route pour vérifier la validité du token
router.get('/verify-token', verifyResetToken);

// Route pour réinitialiser le mot de passe
router.post('/reset-password', resetPassword);

export default router;
