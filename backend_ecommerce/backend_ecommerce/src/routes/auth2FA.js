import express from 'express';
import { generate2FASecret, activate2FA, verify2FA, disable2FA } from '../controllers/auth2FA.controller.js';
import { verifieToken } from '../auth.js'; // Middleware pour vérifier si l'utilisateur est connecté

const router = express.Router();

// Route pour générer le QR code et la clé secrète
router.get('/generate', verifieToken, generate2FASecret);

// Route pour activer l'A2F
router.post('/activate', verifieToken, activate2FA);

// Route pour vérifier le code A2F lors de la connexion
router.post('/verify', verifieToken, verify2FA);

// Route pour désactiver l'A2F
router.post('/disable', verifieToken, disable2FA);

export default router;
