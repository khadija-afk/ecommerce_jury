import { OrderItem } from '../models/index.js';

// Récupérer tous les articles de commande
export const getAllOrderItems = async (req, res) => {
    try {
        const orderItems = await OrderItem.findAll();
        res.status(200).json(orderItems);
    } catch (error) {
        console.error('Erreur lors de la récupération des articles de commande:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des articles de commande' });
    }
};

// Récupérer un article de commande par son ID
export const getOrderItemById = async (req, res) => {
    try {
        const orderItem = await OrderItem.findByPk(req.params.id);
        if (!orderItem) {
            return res.status(404).json({ error: 'Article de commande non trouvé' });
        }
        res.status(200).json(orderItem);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'article de commande:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération de l\'article de commande' });
    }
};

// Créer un nouvel article de commande
export const createOrderItem = async (req, res) => {
    try {
        const { order_fk, product_fk, quantity, price } = req.body;
        if (!order_fk || !product_fk || !quantity || !price) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }
        const newOrderItem = await OrderItem.create({ order_fk, product_fk, quantity, price });
        res.status(201).json(newOrderItem);
    } catch (error) {
        console.error('Erreur lors de la création de l\'article de commande:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la création de l\'article de commande' });
    }
};

// Mettre à jour un article de commande
export const updateOrderItem = async (req, res) => {
    try {
        const { order_id, product_id, quantity, price } = req.body;
        const orderItem = await OrderItem.findByPk(req.params.id);
        if (!orderItem) {
            return res.status(404).json({ error: 'Article de commande non trouvé' });
        }
        await orderItem.update({ order_id, product_id, quantity, price });
        res.status(200).json(orderItem);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'article de commande:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de l\'article de commande' });
    }
};

// Supprimer un article de commande
export const deleteOrderItem = async (req, res) => {
    try {
        const orderItem = await OrderItem.findByPk(req.params.id);
        if (!orderItem) {
            return res.status(404).json({ error: 'Article de commande non trouvé' });
        }
        await orderItem.destroy();
        res.status(200).json({ message: 'article de commande supprimée' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'article de commande:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la suppression de l\'article de commande', detail: error.message });
    }
};
