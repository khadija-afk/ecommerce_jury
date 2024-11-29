import { OrderDetails, OrderItems, PaymentDetails, Cart, CartItem, Article } from "../models/index.js";
import jwt from 'jsonwebtoken';
import { env } from "../config.js";

export const processChequePayment = async (req, res) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return res.status(403).json({ error: 'Token non fourni' });
        }

        const decoded = jwt.verify(token, env.token);
        const userId = decoded.id;

        const { address } = req.body;
        if (!address) {
            return res.status(400).json({ error: 'Adresse de livraison manquante' });
        }

        const panier = await Cart.findOne({
            where: { user_fk: userId },
            include: [{
                model: CartItem,
                as: 'cartItems',
                include: [{ model: Article, as: 'article' }]
            }],
        });

        if (!panier || !panier.cartItems.length) {
            return res.status(404).json({ error: 'Panier vide ou non trouvé' });
        }

        // Enregistrer la commande sans Stripe
        const newOrder = await OrderDetails.create({
            user_fk: decoded.id,
            total: panier.cartItems.reduce((total, item) => total + item.article.price * item.quantity, 0),
            address: address,
            paymentMethod: 'cheque',
        });

        await Promise.all(panier.cartItems.map(async item => {
            await OrderItems.create({
                order_fk: newOrder.id,
                product_fk: item.article.id,
                quantity: item.quantity,
                price: item.article.price,
            });
        }));

        await PaymentDetails.create({
            order_fk: newOrder.id,
            amount: panier.total_amount,
            provider: 'Cheque',
            status: 'Pending',
        });

        // Retourner une réponse appropriée pour le chèque
        return res.status(200).json({
            message: "Votre commande a été enregistrée avec succès. Veuillez envoyer votre chèque pour compléter le paiement."
        });
    } catch (error) {
        console.error("Erreur lors du traitement du paiement par chèque :", error);
        res.status(500).json({ error: 'Erreur serveur lors du traitement du paiement par chèque' });
    }
};
