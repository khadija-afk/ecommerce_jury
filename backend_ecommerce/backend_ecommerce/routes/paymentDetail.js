import express from 'express';
import {
    getAllPaymentDetails,
    getPaymentDetailById,
    addPaymentDetail,
    updatePaymentDetail,
    deletePaymentDetail
} from '../controllers/paymentDetail.controller.js';
import { verifieToken } from '../auth.js'; // Middleware pour la vérification du token

const router = express.Router();

// Récupérer tous les détails de paiement (protégé)
router.get('/payment-details', verifieToken, getAllPaymentDetails);

// Récupérer un détail de paiement par son ID (protégé)
router.get('/payment-details/:id', verifieToken, getPaymentDetailById);

// Ajouter un nouveau détail de paiement (protégé)
router.post('/payment-details', verifieToken, addPaymentDetail);

// Mettre à jour un détail de paiement (protégé)
router.put('/payment-details/:id', verifieToken, updatePaymentDetail);

// Supprimer un détail de paiement (protégé)
router.delete('/payment-details/:id', verifieToken, deletePaymentDetail);

export default router;
