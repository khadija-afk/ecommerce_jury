import { CartItem, Cart } from '../models/index.js';
import { calculateTotalAmount } from '../utils/cart.util.js';
import { verifieToken } from '../auth.js'; // Assurez-vous d'importer votre middleware de vérification du token

// Récupérer tous les articles du panier
export const getAllCartItems = async (req, res) => {
    try {
        const cartItems = await CartItem.findAll();
        res.status(200).json(cartItems);
    } catch (error) {
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

// Ajouter un nouvel article ou incrémenter la quantité dans le panier
export const addCartItem = async (req, res) => {
    try {
        const { product_fk, quantity } = req.body;
        const userId = req.user.id; // Assurez-vous que `req.user.id` provient du middleware JWT

        // Vérifier si un panier existe pour cet utilisateur
        let cart = await Cart.findOne({ where: { user_fk: userId } });
        if (!cart) {
            // Si pas de panier, en créer un
            cart = await Cart.create({ user_fk: userId, total_amount: 0 });
        }

        // Vérifier si l'article existe déjà dans le panier
        const existingCartItem = await CartItem.findOne({
            where: {
                cart_fk: cart.id,
                product_fk: product_fk
            }
        });

        if (existingCartItem) {
            // Si l'article existe, augmenter la quantité
            const newQuantity = existingCartItem.quantity + quantity;
            await existingCartItem.update({ quantity: newQuantity });

            // Recalculer le total du panier
            await calculateTotalAmount(cart.id);

            return res.status(200).json(existingCartItem);
        }

        // Si l'article n'existe pas encore, le créer
        const newCartItem = await CartItem.create({ cart_fk: cart.id, product_fk, quantity });

        // Recalculer et mettre à jour le total du panier
        await calculateTotalAmount(cart.id);

        res.status(201).json(newCartItem);
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'article au panier :', error);
        res.status(500).json({ error: 'Erreur serveur lors de l\'ajout de l\'article au panier' });
    }
};

// Supprimer un article du panier
export const deleteCartItem = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'id est requis' });
        }

        // Trouver l'article du panier avant de le supprimer pour récupérer le cart_fk
        const cartItem = await CartItem.findOne({ where: { id } });

        if (!cartItem) {
            return res.status(404).json({ error: 'Article du panier non trouvé' });
        }

        const cartId = cartItem.cart_fk;

        // Supprimer l'article du panier en utilisant l'id
        await CartItem.destroy({ where: { id } });

        // Recalculer le montant total du panier après la suppression de l'article
        await calculateTotalAmount(cartId);

        res.status(204).send(); // Pas de contenu
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'article :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la suppression de l\'article' });
    }
};

// Mettre à jour un article du panier
export const updateCartItem = async (req, res) => {
    try {
        const cartItem = await CartItem.findByPk(req.params.id);
        if (!cartItem) {
            return res.status(404).json({ error: 'Article du panier non trouvé' });
        }

        // Mise à jour de l'article
        await cartItem.update(req.body);

        // Recalculer et mettre à jour le total_amount du panier
        await calculateTotalAmount(cartItem.cart_fk);

        res.status(200).json(cartItem);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'article du panier :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de l\'article du panier' });
    }
};
