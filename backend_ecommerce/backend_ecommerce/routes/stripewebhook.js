import express from 'express';
import stripe from './stripe.js'; // Assurez-vous que Stripe est bien configuré
import { OrderDetails, PaymentDetails, OrderItems } from "../models/index.js"; // Import des modèles de base de données

const router = express.Router();

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Assurez-vous que cette variable est bien configurée

    const sig = req.headers['stripe-signature']; // Récupérer la signature envoyée par Stripe

    let event;

    try {
        // Vérifier l'intégrité du webhook et sa signature
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Traiter l'événement Stripe
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        try {
            // Récupérer la commande à partir de la session de paiement Stripe
            const order = await OrderDetails.findOne({ where: { payment_session_id: session.id } });

            if (!order) {
                console.error('Order not found for session ID:', session.id);
                return res.status(404).send('Order not found');
            }

            // Créer les items de la commande
            const panier = await Cart.findOne({
                where: { user_fk: order.user_fk },
                include: [{ model: CartItem, as: 'cartItems', include: [{ model: Article, as: 'article' }] }]
            });

            if (!panier || !panier.cartItems.length) {
                console.error('Panier vide ou non trouvé pour l’utilisateur', order.user_fk);
                return res.status(404).send('Panier vide ou non trouvé');
            }

            // Créer chaque item dans la table OrderItems
            await Promise.all(panier.cartItems.map(async (item) => {
                await OrderItems.create({
                    order_fk: order.id,
                    product_fk: item.article.id,
                    quantity: item.quantity,
                    price: item.article.price,
                });
            }));

            // Mettre à jour les détails du paiement
            await PaymentDetails.create({
                order_fk: order.id,
                amount: session.amount_total / 100,
                provider: 'Stripe',
                status: 'Paid',
            });

            // Mettre à jour le statut de la commande
            await order.update({ status: 'Completed' });

            // Vider le panier après la commande
            await CartItem.destroy({ where: { cart_fk: panier.id } });

            console.log('Order and payment details updated successfully.');
        } catch (error) {
            console.error('Error processing the checkout.session.completed event:', error);
        }
    } else {
        console.log(`Unhandled event type ${event.type}`);
    }

    // Répondre à Stripe pour confirmer la réception
    res.status(200).send();
});

export default router;
