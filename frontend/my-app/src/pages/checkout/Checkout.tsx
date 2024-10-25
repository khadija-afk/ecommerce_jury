import React, { useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js'; // Stripe
import { usePanier } from '../../utils/PanierContext';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../utils/axiosConfig';
import './Checkout.css'; // Assurez-vous d'ajouter le fichier CSS pour styliser

const Checkout = () => {
  const stripe = useStripe(); 
  const elements = useElements(); 
  const { totalPrice, panier, setPanier } = usePanier();
  const [address, setAddress] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async (e) => {
    e.preventDefault();

    // Validation des champs obligatoires
    if (!firstName || !lastName || !address || !city || !phone || !email || !paymentMethod) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setLoading(true);

    if (paymentMethod === 'stripe') {
      // Logique Stripe
      if (!stripe || !elements) {
        console.error("Stripe.js n'est pas encore chargé.");
        return;
      }

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
        customer_email: email,
        address,
        paymentMethod
      };

      try {
        const response = await apiClient.post('/api/api/stripe/create-checkout-session', bodyData, {
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
      }
    } else if (paymentMethod === 'cheque') {
      // Logique pour le règlement par chèque
      try {
        const response = await apiClient.post('/api/api/order/orders', {
          address,
          paymentMethod: 'cheque',
          panier,
          total: totalPrice
        }, { withCredentials: true });

        if (response.status === 200) {
          setPanier([]);
          alert("Merci pour votre commande. Veuillez envoyer votre chèque à l'adresse indiquée.");
          navigate('/success');
        }
      } catch (error) {
        console.error("Erreur lors du paiement par chèque:", error);
      }
    } else {
      console.error("Veuillez sélectionner une méthode de paiement.");
    }

    setLoading(false);
  };

  return (
    <div className="checkout-container">
      {/* Formulaire de paiement à gauche */}
      <div className="checkout-form">
        
        <input 
          type="text" 
          placeholder="Prénom" 
          value={firstName} 
          onChange={e => setFirstName(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Nom" 
          value={lastName} 
          onChange={e => setLastName(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Adresse de livraison" 
          value={address} 
          onChange={e => setAddress(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Ville" 
          value={city} 
          onChange={e => setCity(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Téléphone" 
          value={phone} 
          onChange={e => setPhone(e.target.value)} 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
        />
        <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
          <option value="">Sélectionnez une méthode de paiement</option>
          <option value="cheque">Règlement par chèque</option>
          <option value="stripe">Stripe</option>
        </select>

        {paymentMethod === 'cheque' && (
          <div>
            <h4>Instructions pour le règlement par chèque :</h4>
            <p>
              Veuillez envoyer votre chèque à l'adresse suivante :
              <br />
              <strong>KenziShop</strong>
              <br />
              123, rue de l'Exemple
              <br />
              75001 Paris, France
            </p>
            <p>Votre commande sera traitée après réception de votre chèque.</p>
          </div>
        )}

      </div>

      {/* Récapitulatif du panier à droite */}
      <div className="checkout-summary">
        <h3>Votre Commande</h3>
        {panier.map((cartItem, index) => (
          <div key={index} className="summary-item">
            <p>{cartItem.article.name} × {cartItem.quantity} — {cartItem.article.price} €</p>
          </div>
        ))}
        <p>Sous-total: {totalPrice.toFixed(2)} €</p>
        <p>Frais d'expédition: 15.00 € (Tarif forfaitaire)</p>
        <p>Total: {(totalPrice + 15.00).toFixed(2)} €</p>

        <button className="checkout-button" onClick={handleCheckout} disabled={loading}>
          {loading ? 'Traitement...' : 'Passer la commande'}
        </button>
      </div>

    </div>
  );
};

export default Checkout;
