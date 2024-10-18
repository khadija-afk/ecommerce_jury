import React, { useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js'; // Importation de useStripe et useElements
import { usePanier } from '../../utils/PanierContext';
import { useNavigate } from 'react-router-dom';
import { fetchFromApi } from '../../utils/helpers/Stripe'; // Remplacez par le bon chemin d'importation

import axios from 'axios';

const Checkout = () => {
  const stripe = useStripe(); // Initialisation de Stripe
  const elements = useElements(); // Initialisation de Elements
  const { totalPrice, panier, setPanier } = usePanier(); // Assurez-vous que 'panier' et 'setPanier' sont bien utilisés
  const [address, setAddress] = useState(''); 
  const [paymentMethod, setPaymentMethod] = useState(''); 
  const [showStripe, setShowStripe] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const [orderId, setOrderId] = useState(null); 
  const navigate = useNavigate();

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      console.error("Stripe.js n'est pas encore chargé.");
      return;
    }

    // Préparation des items pour Stripe Checkout
    const line_items = panier.map(cartItem => {
        const imgUrl = cartItem.article.photo && cartItem.article.photo.length > 0 ? cartItem.article.photo[0] : '';
        const priceInCents = Math.round(cartItem.article.price * 100);

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

    const bodyData = {
      line_items,
      customer_email: 'votre.email@example.com',
      address,
      paymentMethod
    };

    try {
      const response = await axios.post('/api/api/stripe/create-checkout-session', bodyData, {
        withCredentials: true,
      });

      const { sessionId, error } = response.data;

      if (error) {
        console.error("API Error:", error);
        return;
      }

      const result = await stripe.redirectToCheckout({ sessionId });

      if (result?.error) {
        console.error("Stripe redirect error:", result.error.message);
      } else {
        setPanier([]);
        console.log("Commande passée avec succès, panier vidé !");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Validation de la Commande</h2>
      <p>Total: {totalPrice} €</p>

      <h3>Adresse de Livraison</h3>
      <input 
        type="text" 
        placeholder="Adresse de livraison" 
        value={address} 
        onChange={e => setAddress(e.target.value)} 
      />

      <h3>Méthode de Paiement</h3>
      <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
        <option value="">Sélectionnez une méthode de paiement</option>
        <option value="credit_card">Carte de Crédit</option>
        <option value="stripe">Stripe</option>
      </select>

      <button onClick={handleCheckout} disabled={loading}>
        {loading ? 'Traitement...' : 'Passer la commande'}
      </button>
    </div>
  );
};

export default Checkout;
