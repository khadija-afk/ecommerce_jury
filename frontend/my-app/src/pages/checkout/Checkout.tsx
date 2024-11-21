import React, { useState, useEffect } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import apiClient from '../../utils/axiosConfig';
import './Checkout.css';

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { orderId } = useParams();
  const { state } = useLocation(); // Récupérer le total depuis le state de la navigation
  const [total, setTotal] = useState(state?.total || 0); // Total initial
  const [address, setAddress] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Si le total n'est pas fourni, le récupérer depuis l'API
  useEffect(() => {
    if (!state?.total) {
      apiClient
        .get(`/api/api/order/orders/${orderId}`, { withCredentials: true })
        .then((response) => setTotal(response.data.total))
        .catch((err) => console.error("Erreur lors de la récupération des détails de la commande :", err));
    }
  }, [orderId, state]);

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !address || !city || !phone || !email || !paymentMethod) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setLoading(true);

    try {
      // Création de `PaymentDetail`
      const paymentDetailResponse = await apiClient.post(
        '/api/api/payment/payment-details',
        {
          order_fk: orderId,
          amount: total, // Utiliser le total récupéré
          provider: paymentMethod,
          status: 'Pending',
        },
        { withCredentials: true }
      );

      const paymentDetailId = paymentDetailResponse.data.id;

      // Stocker les ID dans le localStorage
      localStorage.setItem('orderId', orderId);
      localStorage.setItem('paymentDetailId', paymentDetailId);

      if (paymentMethod === 'stripe') {
        if (!stripe || !elements) {
          console.error("Stripe.js n'est pas encore chargé.");
          setLoading(false);
          return;
        }

        const response = await apiClient.post(
          '/api/api/stripe/create-checkout-session',
          {
            paymentMethod: 'stripe',
            line_items: [],
            customer_email: email,
            address: {
              line1: address,
              city,
              state: 'CA',
              postal_code: '94111',
              country: 'US',
            },
          },
          { withCredentials: true }
        );

        const { sessionId, error } = response.data;

        if (error) {
          console.error("Erreur API :", error);
          setLoading(false);
          return;
        }

        await stripe.redirectToCheckout({ sessionId });
      } else if (paymentMethod === 'cheque') {
        alert("Merci pour votre commande. Veuillez envoyer votre chèque à l'adresse indiquée.");
        navigate(`/success`);
      }
    } catch (error) {
      console.error("Erreur lors de la création du paiement :", error);
    }

    setLoading(false);
  };

  return (
    <div className="checkout-container">
      <div className="checkout-form">
        <input type="text" placeholder="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <input type="text" placeholder="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <input type="text" placeholder="Adresse de livraison" value={address} onChange={(e) => setAddress(e.target.value)} />
        <input type="text" placeholder="Ville" value={city} onChange={(e) => setCity(e.target.value)} />
        <input type="text" placeholder="Téléphone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="">Choisir une méthode de paiement</option>
          <option value="cheque">Paiement par chèque</option>
          <option value="stripe">Stripe</option>
        </select>
      </div>

      <div className="checkout-summary">
        <h3>Résumé de votre commande</h3>
        <p>Sous-total : {total} €</p>

        <button className="checkout-button" onClick={handleCheckout} disabled={loading}>
          {loading ? 'Traitement...' : 'Valider la commande'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
