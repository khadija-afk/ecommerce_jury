import stripe from './stripe.js';
import { Cart, CartItem, Article, User } from "../models/index.js";
import jwt from 'jsonwebtoken';
import { env } from '../config.js';

export const createStripeSession = async (req, res) => {
    const url = env.cors_url
    try {
        // Récupérer le token depuis le header Authorization
        const token = req.cookies?.access_token || req.headers["authorization"]?.split(" ")[1];

        if (!token) {
            return res.status(403).json({ error: 'Token non fourni ou manquant' });
        }

        // Vérifier et décoder le token
        const decoded = jwt.verify(token, env.token);
        const userId = decoded.id;

        // Trouver l'utilisateur par son ID
        const user = await User.findByPk(userId, { attributes: ['email'] });
        const customerEmail = user ? user.email : null;
        if (!customerEmail) {
            return res.status(400).json({ error: 'Email utilisateur introuvable' });
        }

        // Récupérer le panier de l'utilisateur
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

        console.log("Panier trouvé:", panier);

        // Calculer le montant total
        const totalAmount = panier.cartItems.reduce((total, item) => total + item.article.price * item.quantity, 0);
        console.log("Montant total calculé:", totalAmount);

        // Créer une session Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: panier.cartItems.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.article.name,
                        description: item.article.description || 'Description non disponible',
                        images: [item.article.photo[0]],
                    },
                    unit_amount: Math.round(item.article.price * 100),
                },
                quantity: item.quantity,
            })),
            customer_email: customerEmail,
            mode: 'payment',
            success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}&amount=${totalAmount}`,
            cancel_url: `${url}/cancel`,
        });

        console.log("Stripe session créée:", session);

        res.status(200).json({ sessionId: session.id });
    } catch (error) {
        console.error("Erreur lors de la création de la session Stripe :", error);
        res.status(400).json({ error: "Failed to create Stripe session", details: error.message });
    }
};
