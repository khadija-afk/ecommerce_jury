import { OrderItems, OrderDetails } from '../models/index.js';

// Récupérer tous les articles de commande de l'utilisateur connecté
export const getAllOrderItems = async (req, res) => {
    try {
        const userId = req.user.id; // Utiliser l'ID de l'utilisateur connecté

        const orderItems = await OrderItems.findAll({
            include: [
                {
                    model: OrderDetails,
                    where: { user_fk: userId }, // Associer les articles de commande aux commandes de l'utilisateur connecté
                },
            ],
        });
        res.status(200).json(orderItems);
    } catch (error) {
        console.error('Erreur lors de la récupération des articles de commande:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des articles de commande' });
    }
};

// Récupérer un article de commande par son ID pour l'utilisateur connecté
export const getOrderItemById = async (req, res) => {
    try {
        // Récupérer l'article de commande par son ID
        const orderItem = await OrderItems.findByPk(req.params.id);

        // Vérifier si l'article de commande existe
        if (!orderItem) {
            return res.status(404).json({ error: 'Order item not found' });
        }

        // Retourner l'article de commande
        return res.status(200).json(orderItem);
    } catch (error) {
        console.error('Captured error:', error); 
        return res.status(500).json({ error: 'Server error while retrieving the order item' });
    }
};

// Créer un nouvel article de commande pour l'utilisateur connecté
export const createOrderItem = async (req, res) => {
    try {
        const { order_fk, product_fk, quantity, price } = req.body;
        const userId = req.user.id; // Utiliser l'ID de l'utilisateur connecté

        // Vérification des champs obligatoires
        if (!order_fk || !product_fk || !quantity || !price) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }

        // Vérification que la commande appartient bien à l'utilisateur connecté
        const order = await OrderDetails.findOne({ where: { id: order_fk, user_fk: userId } });
        if (!order) {
            return res.status(403).json({ error: 'Vous ne pouvez pas ajouter des articles à une commande qui ne vous appartient pas' });
        }

        // Création de l'article de commande
        const newOrderItem = await OrderItems.create({ order_fk, product_fk, quantity, price });
        res.status(201).json(newOrderItem);
    } catch (error) {
        console.error('Erreur lors de la création de l\'article de commande:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la création de l\'article de commande' });
    }
};

// Mettre à jour un article de commande pour l'utilisateur connecté
export const updateOrderItem = async (req, res) => {
    try {
        const { order_fk, product_fk, quantity, price } = req.body;
        const userId = req.user.id; // Utiliser l'ID de l'utilisateur connecté

        const orderItem = await OrderItems.findOne({
            where: { id: req.params.id },
            include: [
                {
                    model: OrderDetails,
                    where: { user_fk: userId }, // S'assurer que l'article de commande appartient à une commande de l'utilisateur
                },
            ],
        });

        if (!orderItem) {
            return res.status(404).json({ error: 'Article de commande non trouvé' });
        }

        await orderItem.update({ order_fk, product_fk, quantity, price });
        res.status(200).json(orderItem);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'article de commande:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de l\'article de commande' });
    }
};

// Supprimer un article de commande pour l'utilisateur connecté
export const deleteOrderItem = async (req, res) => {
    try {
        const userId = req.user.id; // Utiliser l'ID de l'utilisateur connecté

        const orderItem = await OrderItems.findOne({
            where: { id: req.params.id },
            include: [
                {
                    model: OrderDetails,
                    where: { user_fk: userId }, // S'assurer que l'article de commande appartient à une commande de l'utilisateur
                },
            ],
        });

        if (!orderItem) {
            return res.status(404).json({ error: 'Article de commande non trouvé' });
        }

        await orderItem.destroy();
        res.status(200).json({ message: 'Article de commande supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'article de commande:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la suppression de l\'article de commande', detail: error.message });
    }
};
