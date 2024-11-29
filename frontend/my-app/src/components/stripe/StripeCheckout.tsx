import React, { useContext, useEffect, useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { PanierContext } from "../../utils/PanierContext";
import { fetchFromApi } from "../../utils/helpers/Stripe";
import axios from 'axios';

const StripeCheckout = ({ orderId }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false); // Nouvel état pour le chargement
    const stripe = useStripe();
    const { panier, setPanier } = useContext(PanierContext); // Récupérer le panier du contexte

    // Récupérer l'email de l'utilisateur connecté via le backend
    useEffect(() => {
        const fetchUserEmail = async () => {
            try {
                const response = await axios.get('/api/api/user/check_auth', { withCredentials: true });
                setEmail(response.data.email);
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'email de l\'utilisateur', error);
            }
        };

        fetchUserEmail();
    }, []);

    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true); // Démarrer le chargement

        // Préparation des items pour Stripe Checkout
        const line_items = panier.map(cartItem => {
            const imgUrl = cartItem.article.photo && cartItem.article.photo.length > 0 ? cartItem.article.photo[0] : '';
            const priceInCents = Math.round(cartItem.article.price * 100); // Convertir le prix en centimes

            return {
                quantity: cartItem.quantity,
                price_data: {
                    currency: 'eur',
                    unit_amount: priceInCents,
                    product_data: {
                        name: cartItem.article.name || "Produit sans nom",
                        description: cartItem.article.description || "Description non disponible",
                        images: imgUrl ? [imgUrl] : []
                    }
                }
            };
        });

        try {
            // Envoyer les articles, l'email et l'ID de la commande au backend
            const response = await fetchFromApi('api/stripe/create-checkout-session', {
                body: { line_items, customer_email: email, orderId },
                withCredentials: true
            });

            if (!response) {
                throw new Error("API response is undefined");
            }

            const { sessionId, error } = response;

            if (error) {
                console.error("API Error:", error);
                return;
            }

            // Redirection vers Stripe Checkout
            const result = await stripe?.redirectToCheckout({ sessionId });

            if (result?.error) {
                console.error("Stripe redirect error:", result.error.message);
            } else {
                // Vider le panier après paiement réussi
                setPanier([]);
                console.log("Commande passée avec succès, panier vidé !");
            }
        } catch (error) {
            console.error("Error during checkout:", error);
        } finally {
            setLoading(false); // Arrêter le chargement
        }
    };

    return (
        <>
            <form onSubmit={handleCheckout}>
                <button type="submit" disabled={loading}>
                    {loading ? 'Traitement...' : 'Passer la commande'}
                </button>
            </form>
        </>
    );
};

export default StripeCheckout;
