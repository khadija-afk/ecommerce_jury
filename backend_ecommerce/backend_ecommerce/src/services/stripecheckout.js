import stripe from './stripe.js';
import { OrderDetails, OrderItems, PaymentDetails, Cart, CartItem, Article } from "../models/index.js";
import jwt from 'jsonwebtoken';
import { env } from '../config.js';

export const createStripeSession = async (req, res) => {
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

        // Créer la session Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: panier.cartItems.map(item => ({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: item.article.name,
                        description: item.article.description || 'Description non disponible',
                    },
                    unit_amount: Math.round(item.article.price * 100),
                },
                quantity: item.quantity,
            })),
            customer_email: decoded.email,
            mode: 'payment',
            success_url: `https://localhost/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `https://localhost/cancel`,
            shipping_address_collection: {
                allowed_countries: ['FR', 'US'],
            },
        });

        // Enregistrer la commande
        const newOrder = await OrderDetails.create({
            user_fk: decoded.id,
            total: panier.cartItems.reduce((total, item) => total + item.article.price * item.quantity, 0),
            address: address,
            paymentMethod: 'stripe',
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
            provider: 'Stripe',
            status: 'Pending',
        });

        res.status(200).json({ sessionId: session.id });
    } catch (error) {
        console.error("Erreur lors de la création de la session Stripe :", error);
        res.status(500).json({ error: 'Erreur serveur lors de la création de la session Stripe' });
    }
};
