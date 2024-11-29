// routes/cookieConsent.js

import express from 'express';
import {saveConsent, getConsent} from '../controllers/userPreference.controller.js';

const router = express.Router();

// Route pour enregistrer le consentement de l'utilisateur
router.post('/save-consent',saveConsent);

// Route pour récupérer le consentement de l'utilisateur
router.get('/get-consent/:userId',getConsent);

export default router;
