import { Order } from '../models/index.js';

// Récupérer toutes les commandes
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.status(200).json(orders);
    } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des commandes' });
    }
};

// Récupérer une commande par son ID
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error('Erreur lors de la récupération de la commande:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération de la commande' });
    }
};

// Créer une nouvelle commande
export const createOrder = async (req, res) => {
    try {
        const { user_fk, status, total_amount, shipping_address, shipping_city, shipping_postal_code, shipping_country } = req.body;
        if (!user_fk || !status || !total_amount || !shipping_address || !shipping_city || !shipping_postal_code || !shipping_country) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }
        const newOrder = await Order.create({ user_fk, status, total_amount, shipping_address, shipping_city, shipping_postal_code, shipping_country });
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Erreur lors de la création de la commande:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la création de la commande', detail: error.message});
    }
};

// Mettre à jour une commande
export const updateOrder = async (req, res) => {
    try {
        const { user_id, status, total_amount, shipping_address, shipping_city, shipping_postal_code, shipping_country } = req.body;
        const order = await Order.findByPk(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }
        await order.update({ user_id, status, total_amount, shipping_address, shipping_city, shipping_postal_code, shipping_country });
        res.status(200).json(order);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la commande:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de la commande' });
    }
};

// Supprimer une commande
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
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
