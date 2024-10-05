import { Cart, CartItem, Article } from '../models/index.js';

export const calculateTotalAmount = async (cartId) => {
    try {
        // Récupérer tous les articles du panier avec les détails des produits
        const cartItems = await CartItem.findAll({
            where: { cart_fk: cartId },
            include: [
                {
                    model: Article,
                    as: 'article', // Utilisation correcte de l'alias
                }
            ]
        });

        // Calculer le montant total
        const totalAmount = cartItems.reduce((total, item) => total + (item.quantity * item.article.price), 0); // Utilisez 'item.article.price'
        console.log('Total Amount Calculated:', totalAmount);

        // Mettre à jour le panier avec le montant total
        await Cart.update({ total_amount: totalAmount }, { where: { id: cartId } });
    } catch (error) {
        console.error('Erreur lors du calcul du montant total du panier :', error);
        throw error;
    }
};
