// Importer les modules nécessaires
import express from 'express';
import stripe from '../services/checkout.js';
import { verifieToken } from '../auth.js';

// Créer un routeur express
const router = express.Router();

// Définir la route pour créer une session de paiement
router.post("/create-checkout-session", verifieToken, stripe.createCheckoutSession);

// Exporter le routeur pour qu'il puisse être utilisé dans l'application principale
export default router;
