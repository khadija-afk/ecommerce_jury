import { OrderDetails } from '../models/index.js';

// Récupérer toutes les commandes d'un utilisateur authentifié
export const getAllOrders = async (req, res) => {
    try {
        const userId = req.user.id; // Obtenir l'ID de l'utilisateur connecté
        const orders = await OrderDetails.findAll({ where: { user_fk: userId } });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des commandes' });
    }
};

// Récupérer une commande par son ID pour l'utilisateur connecté
export const getOrderById = async (req, res) => {
    try {
        const userId = req.user.id;
        const order = await OrderDetails.findOne({ where: { id: req.params.id, user_fk: userId } });
        if (!order) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error('Erreur lors de la récupération de la commande:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération de la commande' });
    }
};

// Créer une nouvelle commande pour l'utilisateur connecté
export const createOrder = async (req, res) => {
    try {
        const userId = req.user.id; // Utiliser l'ID de l'utilisateur connecté
        const { total, payment_fk } = req.body;

        // Vérification des paramètres
        if (!total) {
            return res.status(400).json({ error: 'Le total est requis' });
        }

        const newOrder = await OrderDetails.create({ user_fk: userId, total, payment_fk });
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Erreur lors de la création de la commande:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la création de la commande' });
    }
};

// Mettre à jour une commande pour l'utilisateur connecté
export const updateOrder = async (req, res) => {
    try {
        const userId = req.user.id; // Utiliser l'ID de l'utilisateur connecté
        const { total, payment_fk } = req.body;

        const order = await OrderDetails.findOne({ where: { id: req.params.id, user_fk: userId } });
        if (!order) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }

        await order.update({ total, payment_fk });
        res.status(200).json(order);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la commande:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de la commande' });
    }
};

// Supprimer une commande pour l'utilisateur connecté
export const deleteOrder = async (req, res) => {
    try {
        const userId = req.user.id; // Utiliser l'ID de l'utilisateur connecté
        const order = await OrderDetails.findOne({ where: { id: req.params.id, user_fk: userId } });

        if (!order) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }

        await order.destroy();
        res.status(200).json({ message: 'Commande supprimée' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la commande:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la suppression de la commande' });
    }
};
