import express from 'express';
import stripe from './stripe.js'; // Assure-toi que tu importes bien la configuration Stripe
import { OrderDetails, PaymentDetails } from "../models/index.js"; // Import des modèles de base de données

const router = express.Router();

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Assure-toi que cette variable d'environnement est bien configurée

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
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;

            try {
                // Récupérer la commande à partir de la session de paiement Stripe
                const order = await OrderDetails.findOne({ where: { payment_session_id: session.id } });

                if (order) {
                    // Mettre à jour le statut du paiement et de la commande
                    await PaymentDetails.update({ status: 'Paid' }, { where: { order_fk: order.id } });
                    await order.update({ status: 'Completed' });

                    console.log('Order and payment details updated successfully.');
                }
            } catch (error) {
                console.error('Error processing the checkout.session.completed event:', error);
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Répondre à Stripe pour confirmer la réception
    res.status(200).send();
});

export default router;
