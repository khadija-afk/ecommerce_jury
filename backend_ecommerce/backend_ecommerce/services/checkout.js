import stripe from "./stripe.js";
import { env } from "../config.js";

const createCheckoutSession = async (req, res) => {
    const domainURL = env.web_app_url;

    console.log(`Domain URL: ${domainURL}`);
    console.log(`Success URL: ${domainURL}/success?session_id={CHECKOUT_SESSION_ID}`);
    console.log(`Cancel URL: ${domainURL}/cancel`);

    const { line_items, customer_email } = req.body;

    if (!line_items || !customer_email) {
        return res.status(400).json({ error: 'missing required parameters' });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items,
            customer_email,
            success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:3000/cancel`,
            shipping_address_collection: {
                allowed_countries: ['US', 'FR'],
            },
        });

        res.status(200).json({ sessionId: session.id });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};

export default { createCheckoutSession };
