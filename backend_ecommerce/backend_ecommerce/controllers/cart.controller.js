import { Cart, CartItem, Article } from '../models/index.js';
import { calculateTotalAmount } from '../utils/cart.util.js';

// Récupérer le panier par ID utilisateur
export const getCartByUserId = async (req, res) => {
    try {
        // Vérifiez si le paramètre `userId` est bien présent
        const userId = req.params.userId;
        
        if (!userId) {
            return res.status(400).json({ error: 'userId est manquant dans la requête' });
        }

        const cart = await Cart.findOne({
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

        if (!cart) {
            return res.status(404).json({ error: 'Panier non trouvé pour cet utilisateur' });
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error('Erreur lors de la récupération du panier :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération du panier' });
    }
};

// Créer un nouveau panier pour un utilisateur
export const createCart = async (req, res) => {
    try {
        const { userId } = req.params;

        // Vérifiez si un panier pour cet utilisateur existe déjà
        const existingCart = await Cart.findOne({ where: { user_fk: userId } });
        if (existingCart) {
            return res.status(400).json({ error: 'Un panier existe déjà pour cet utilisateur' });
        }

        // Créer un nouveau panier avec un total initial de 0
        const newCart = await Cart.create({ user_fk: userId, total_amount: 0 });

        // Vérifiez si des articles sont passés dans la requête pour ce panier
        const { cartItems } = req.body;
        if (Array.isArray(cartItems) && cartItems.length > 0) {
            // Ajouter chaque CartItem associé à ce panier
            for (const item of cartItems) {
                await CartItem.create({
                    cart_fk: newCart.id,
                    product_fk: item.product_fk,
                    quantity: item.quantity
                });
            }

            // Recalculer et mettre à jour le total_amount du panier
            await calculateTotalAmount(newCart.id);
        }

        // Recharger le panier avec son total mis à jour
        const updatedCart = await Cart.findByPk(newCart.id);

        res.status(201).json(updatedCart); // Renvoyer le panier mis à jour avec son total
    } catch (error) {
        console.error('Erreur lors de la création du panier :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la création du panier', detail: error.message });
    }
};

// Mettre à jour le montant total du panier
export const updateCartTotalAmount = async (req, res) => {
    try {
        const { userId } = req.params;
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
        const { userId } = req.params;
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
