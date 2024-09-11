import stripe from "./stripe.js";
import { env } from "../config.js";

const createCheckoutSession = async (req, res) => {
    const domainURL = env.web_app_url;

    console.log(`Domain URL: ${domainURL}`);
    console.log(`Success URL: ${domainURL}/success?session_id={CHECKOUT_SESSION_ID}`);
    console.log(`Cancel URL: ${domainURL}/cancel`);

    // Récupérer les line_items depuis le corps de la requête et l'email de l'utilisateur depuis le token
    const { line_items } = req.body;
    const customer_email = req.user.email; // Récupération de l'email utilisateur depuis le token JWT déchiffré

    // Vérifier si les line_items sont présents
    if (!line_items) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        // Créer une session Stripe Checkout
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items,
            customer_email, // Utiliser l'email de l'utilisateur extrait du token
            success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:3000/cancel`,
            shipping_address_collection: {
                allowed_countries: ['US', 'FR'], // Ajouter les pays autorisés pour la livraison
            },
        });

        // Réponse avec l'ID de session Stripe
        res.status(200).json({ sessionId: session.id });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

export default { createCheckoutSession };
