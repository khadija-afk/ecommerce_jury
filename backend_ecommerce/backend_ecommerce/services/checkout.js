import stripe from "./stripe.js"; // Importation de la bibliothèque Stripe
import { env } from "../config.js"; // Importer les variables d'environnement (comme le secret Stripe)
import { OrderDetails, OrderItems, PaymentDetails, Cart, CartItem, Article } from "../models/index.js"; // Importez vos modèles
import jwt from 'jsonwebtoken'; // Importer jwt pour décoder le token

const createCheckoutSession = async (req, res) => {
    const domainURL = process.env.DOMAIN_URL;

    try {
        // Vérifier et décoder le token
        const token = req.cookies.access_token; // Ou depuis un header Authorization: Bearer <token>
        if (!token) {
            return res.status(403).json({ error: 'Token non fourni' });
        }

        const decoded = jwt.verify(token, env.token); 
        const userId = decoded.id; // Récupérer l'ID de l'utilisateur

        // Récupérer les détails du panier depuis la base de données
        const panier = await Cart.findOne({
            where: { user_fk: userId },
            include: [
                {
                    model: CartItem,
                    as: 'cartItems', // Assurez-vous que l'alias correspond à celui défini dans l'association
                    include: [
                        {
                            model: Article, // Assurez-vous que c'est bien 'Article'
                            as: 'article' // Alias utilisé dans l'association
                        }
                    ]
                },
            ],
        });

        if (!panier || !panier.cartItems.length) {
            return res.status(404).json({ error: 'Panier vide ou non trouvé' });
        }

        // Créer la session Stripe avec les items du panier
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: panier.cartItems.map(item => ({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: item.article.name, // Accéder aux informations du produit
                        description: item.article.description || 'Description non disponible',
                    },
                    unit_amount: Math.round(item.article.price * 100), // Le prix doit être en centimes
                },
                quantity: item.quantity,
            })),
            customer_email: decoded.email, // Utiliser l'email de l'utilisateur extrait du token
            mode: 'payment',
            success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:3000/cancel`,
            shipping_address_collection: {
                allowed_countries: ['FR', 'US'], // Pays autorisés pour la livraison
            },
        });

        // Réponse avec l'ID de session Stripe
        res.status(200).json({ sessionId: session.id });

        // Stocker les informations de la commande et du paiement dans la base de données
        const newOrder = await OrderDetails.create({
            user_fk: decoded.id, // Récupérer l'ID de l'utilisateur depuis le token
            total: panier.total_amount, // Supposons que panier a un champ total_amount
            address: req.body.address, // Adresse fournie dans la requête
            paymentMethod: req.body.paymentMethod,
        });

        // Enregistrer chaque article du panier dans la table OrderItems
        await Promise.all(panier.cartItems.map(async item => {
            await OrderItems.create({
                order_fk: newOrder.id, // L'ID de la commande nouvellement créée
                product_fk: item.article.id, // L'ID du produit
                quantity: item.quantity,
                price: item.article.price, // Prix unitaire de l'article
            });
        }));

        // Enregistrer les détails du paiement dans PaymentDetails
        await PaymentDetails.create({
            order_fk: newOrder.id, // L'ID de la commande
            amount: panier.total_amount, // Montant total de la commande
            provider: 'Stripe', // Méthode de paiement utilisée
            status: 'Pending', // Statut initial du paiement
        });

    } catch (error) {
        console.error("Erreur lors de la création de la session Stripe :", error);
        res.status(500).json({ error: 'Erreur serveur lors de la création de la session Stripe' });
    }
};

export default { createCheckoutSession };
