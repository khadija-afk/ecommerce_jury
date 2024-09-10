import React, { useContext, useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { PanierContext } from "../../utils/PanierContext";
import { fetchFromApi } from "../../utils/helpers/Stripe";

const StripeCheckout = () => {
    const [email, setEmail] = useState('');
    const stripe = useStripe();
    const { panier } = useContext(PanierContext);

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();

        // Préparation des items pour Stripe Checkout
        const line_items = panier.map(cartItem => {
            const imgUrl = cartItem.article.photo && cartItem.article.photo.length > 0 ? cartItem.article.photo[0] : '';
            const priceInCents = Math.round(cartItem.article.price * 100); // Convertir le prix en centimes

            return {
                quantity: cartItem.quantity, // Assurez-vous que la quantité est correcte
                price_data: {
                    currency: 'eur',
                    unit_amount: priceInCents, // Le prix doit être en centimes
                    product_data: {
                        name: cartItem.article.name || "Produit sans nom",
                        description: cartItem.article.description || "Description non disponible",
                        images: imgUrl ? [imgUrl] : []
                    }
                }
            };
        });

        console.log("Line items:", line_items); // Debug log pour vérifier les articles et leurs quantités

        try {
            const response = await fetchFromApi('api/stripe/create-checkout-session', {
                body: { line_items, customer_email: email }
            });

            if (!response) {
                throw new Error("API response is undefined");
            }

            const { sessionId, error } = response;

            if (error) {
                console.error("API Error:", error);
                return;
            }

            console.log("Session ID:", sessionId); // Debug log

            // Redirection vers Stripe Checkout
            const result = await stripe?.redirectToCheckout({ sessionId });

            if (result?.error) {
                console.error("Stripe redirect error:", result.error.message);
            }
        } catch (error) {
            console.error("Error during checkout:", error);
        }
    };

    return (
        <>
            <form onSubmit={handleCheckout}>
                <input
                    type="email"
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email"
                    value={email}
                />
                <button type="submit">
                    CHECKOUT
                </button>
            </form>
        </>
    );
};

export default StripeCheckout;
