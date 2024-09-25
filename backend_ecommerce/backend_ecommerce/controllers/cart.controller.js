import { Cart, CartItem, Article } from '../models/index.js';
import { calculateTotalAmount } from '../utils/cart.util.js';

// Récupérer le panier par ID utilisateur à partir du token
export const getCartByUserId = async (req, res) => {

    const userId = req.user.id; 
    let cart;
    try {
        cart = await Cart.findOne({
            where: { user_fk: userId },
            include: [
                {
                    model: CartItem,
                    as: 'cartItems',
                    include: [
                        {
                            model: Article,
                            as: 'article',
                            attributes: ['id', 'name', 'price', 'photo']
                        }
                    ]
                }
            ]
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du panier :', error);
        return res.status(500).json({ error: 'Erreur serveur lors de la récupération du panier' });
    }

    if (!cart) {
        return res.status(404).json({ error: 'Panier non trouvé pour cet utilisateur' });
    }

    return res.status(200).json(cart);
};

// Créer un nouveau panier pour un utilisateur
export const createCart = async (req, res) => {
    let userId;
    let newCart;
    userId = req.user.id;

    const existingCart = await Cart.findOne({ where: { user_fk: userId } });
    if (existingCart) {
        return res.status(200).json({ error: 'Un panier existe déjà pour cet utilisateur' });
    }

    try {
        // Créer un nouveau panier avec un total initial de 0
        newCart = await Cart.create({ user_fk: userId, total_amount: 0 });

    } catch (error) {
        console.error('Erreur lors de la création du panier :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la création du panier', detail: error.message });
    }

    return res.status(201).json(newCart); // Renvoyer le panier mis à jour avec son total

};

// Mettre à jour le montant total du panier
export const updateCartTotalAmount = async (req, res) => {
    try {
        const userId = req.user.id; // Utiliser l'ID de l'utilisateur extrait du token
        const { totalAmount } = req.body;

        // Validation du totalAmount
        if (totalAmount == null || isNaN(totalAmount)) {
            return res.status(400).json({ error: 'Montant total invalide' });
        }

        const cart = await Cart.findOne({ where: { user_fk: userId } });
        if (!cart) {
            return res.status(404).json({ error: 'Panier non trouvé pour cet utilisateur' });
        }

        await cart.update({ total_amount: totalAmount });
        res.status(200).json(cart);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du montant total du panier :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du montant total du panier' });
    }
};

// Supprimer un panier
export const deleteCart = async (req, res) => {
    try {
        const userId = req.user.id; // Utiliser l'ID de l'utilisateur extrait du token
        const cart = await Cart.findOne({ where: { user_fk: userId } });
        if (!cart) {
            return res.status(404).json({ error: 'Panier non trouvé pour cet utilisateur' });
        }

        await cart.destroy();
        res.status(204).send(); // 204 No Content, donc pas de contenu dans la réponse
    } catch (error) {
        console.error('Erreur lors de la suppression du panier :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la suppression du panier' });
    }
};
