import stripe from "./stripe.js"; // Assurez-vous que vous avez bien configuré votre instance Stripe
import { OrderDetails, PaymentDetails } from "../models/index.js"; // Importez vos modèles

const handleStripeWebhook = async (req, res) => {
    const event = req.body; // Stripe envoie le webhook sous forme brute

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;

                // Rechercher la commande correspondante via l'ID de la session de paiement
                const order = await OrderDetails.findOne({ where: { payment_session_id: session.id } });

                if (order) {
                    // Mettre à jour le statut du paiement à "Paid"
                    await PaymentDetails.update({ status: 'Paid' }, { where: { order_fk: order.id } });

                    // Mettre à jour le statut de la commande à "Completed"
                    await order.update({ status: 'Completed' });
                } else {
                    console.error('Commande non trouvée pour la session de paiement:', session.id);
                }

                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.status(200).send();
    } catch (error) {
        console.error("Erreur lors du traitement du webhook :", error);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
};

export default { handleStripeWebhook };
