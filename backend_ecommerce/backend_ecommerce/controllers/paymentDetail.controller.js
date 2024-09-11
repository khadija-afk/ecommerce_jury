import { PaymentDetails } from '../models/index.js';

// Récupérer tous les détails de paiement (protégé)
export const getAllPaymentDetails = async (req, res) => {
    try {
        const paymentDetails = await PaymentDetails.findAll();
        res.status(200).json(paymentDetails);
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de paiement :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des détails de paiement' });
    }
};

// Récupérer un détail de paiement par son ID (protégé)
export const getPaymentDetailById = async (req, res) => {
    try {
        const paymentDetail = await PaymentDetails.findByPk(req.params.id);
        if (!paymentDetail) {
            return res.status(404).json({ error: 'Détail de paiement non trouvé' });
        }
        res.status(200).json(paymentDetail);
    } catch (error) {
        console.error('Erreur lors de la récupération du détail de paiement :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération du détail de paiement' });
    }
};

// Ajouter un nouveau détail de paiement (protégé)
export const addPaymentDetail = async (req, res) => {
    try {
        const { order_fk, amount, provider, status } = req.body;

        if (!order_fk || !amount || !provider) {
            return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis' });
        }

        const newPaymentDetail = await PaymentDetails.create({ order_fk, amount, provider, status });
        res.status(201).json(newPaymentDetail);
    } catch (error) {
        console.error('Erreur lors de l\'ajout du détail de paiement :', error);
        res.status(500).json({ error: 'Erreur serveur lors de l\'ajout du détail de paiement' });
    }
};

// Mettre à jour un détail de paiement (protégé)
export const updatePaymentDetail = async (req, res) => {
    try {
        const paymentDetail = await PaymentDetails.findByPk(req.params.id);
        if (!paymentDetail) {
            return res.status(404).json({ error: 'Détail de paiement non trouvé' });
        }
        await paymentDetail.update(req.body);
        res.status(200).json(paymentDetail);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du détail de paiement :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du détail de paiement' });
    }
};

// Supprimer un détail de paiement (protégé)
export const deletePaymentDetail = async (req, res) => {
    try {
        const paymentDetail = await PaymentDetails.findByPk(req.params.id);
        if (!paymentDetail) {
            return res.status(404).json({ error: 'Détail de paiement non trouvé' });
        }
        await paymentDetail.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Erreur lors de la suppression du détail de paiement :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la suppression du détail de paiement' });
    }
};
