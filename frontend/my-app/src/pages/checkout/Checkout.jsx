import React, { useState } from 'react';
import { usePanier } from '../../utils/PanierContext';
import { useNavigate } from 'react-router-dom';
import StripeCheckout from '../../components/stripe/StripeCheckout';
import axios from 'axios';

const Checkout = () => {
  const { totalPrice } = usePanier(); // Utiliser uniquement le montant total
  const [address, setAddress] = useState(''); // Champ pour l'adresse de livraison
  const [paymentMethod, setPaymentMethod] = useState(''); // Champ pour la méthode de paiement
  const [showStripe, setShowStripe] = useState(false); // Afficher ou non StripeCheckout
  const [orderId, setOrderId] = useState(null); // Stocker l'ID de la commande créée
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!address || !paymentMethod) {
      alert('Veuillez fournir une adresse de livraison et sélectionner un moyen de paiement.');
      return;
    }

    try {
      // Envoyer seulement le total et l'adresse au backend pour créer la commande
      const orderResponse = await axios.post(
        'http://localhost:9090/api/order/orders',
        {
          total: totalPrice,
          address: address,
          paymentMethod: paymentMethod
        },
        {
          withCredentials: true, // Envoyer les cookies dans la requête
        }
      );

      if (orderResponse.status === 201) {
        // Si la commande est créée avec succès, montrer StripeCheckout
        setOrderId(orderResponse.data.orderId); // Stocker l'ID de la commande
        setShowStripe(true); // Afficher le composant Stripe pour le paiement
      }
    } catch (error) {
      console.error('Erreur lors de la création de la commande :', error);
      alert('Erreur lors de la création de la commande. Veuillez réessayer.');
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

      <button onClick={handleCheckout}>Passer la commande</button>

      {/* Afficher StripeCheckout après validation de la commande */}
      {showStripe && <StripeCheckout orderId={orderId} />}
    </div>
  );
};

export default Checkout;
