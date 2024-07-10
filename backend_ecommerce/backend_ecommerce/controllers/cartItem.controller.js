import { CartItem } from '../models/index.js';

// Récupérer tous les articles du panier
export const getAllCartItems = async (req, res) => {
    try {
        const cartItems = await CartItem.findAll();
        res.status(200).json(cartItems);
    } catch (error) {
        console.error('Erreur lors de la récupération des articles du panier :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des articles du panier' });
    }
};

// Récupérer un article du panier par son ID
export const getCartItemById = async (req, res) => {
    try {
        const cartItem = await CartItem.findByPk(req.params.id);
        if (!cartItem) {
            return res.status(404).json({ error: 'Article du panier non trouvé' });
        }
        res.status(200).json(cartItem);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'article du panier :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération de l\'article du panier' });
    }
};

// Ajouter un nouvel article au panier
export const addCartItem = async (req, res) => {
    try {
        const newCartItem = await CartItem.create(req.body);
        res.status(201).json(newCartItem);
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'article au panier :', error);
        res.status(500).json({ error: 'Erreur serveur lors de l\'ajout de l\'article au panier' });
    }
};

// Mettre à jour un article du panier
export const updateCartItem = async (req, res) => {
    try {
        const cartItem = await CartItem.findByPk(req.params.id);
        if (!cartItem) {
            return res.status(404).json({ error: 'Article du panier non trouvé' });
        }
        await cartItem.update(req.body);
        res.status(200).json(cartItem);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'article du panier :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de l\'article du panier' });
    }
};

// Supprimer un article du panier
export const deleteCartItem = async (req, res) => {
    try {
        const cartItem = await CartItem.findByPk(req.params.id);
        if (!cartItem) {
            return res.status(404).json({ error: 'Article du panier non trouvé' });
        }
        await cartItem.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'article du panier :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la suppression de l\'article du panier' });
    }
};
