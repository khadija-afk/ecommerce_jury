import React, { useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { usePanier } from '../../utils/PanierContext';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../utils/axiosConfig';
import './Checkout.css';

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { totalPrice, panier } = usePanier();
  const { orderId } = useParams();
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

    if (!firstName || !lastName || !address || !city || !phone || !email || !paymentMethod) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const calculatedTotalPrice = panier.reduce((acc, item) => acc + item.article.price * item.quantity, 0);

      // Création de `PaymentDetail`
      const paymentDetailResponse = await apiClient.post('/api/api/payment/payment-details', {
        order_fk: orderId,
        amount: calculatedTotalPrice,
        provider: paymentMethod,
        status: 'Pending'
      }, { withCredentials: true });

      const paymentDetailId = paymentDetailResponse.data.id;
      
      // Stocker les ID dans le local storage
      localStorage.setItem('orderId', orderId);
      localStorage.setItem('paymentDetailId', paymentDetailId);

      if (paymentMethod === 'stripe') {
        if (!stripe || !elements) {
          console.error("Stripe.js is not loaded yet.");
          setLoading(false);
          return;
        }

        const line_items = panier.map(cartItem => {
          const imgUrl = cartItem.article.photo?.[0] || '';
          const priceInCents = Math.round(cartItem.article.price * 100);

          return {
            quantity: cartItem.quantity,
            price_data: {
              currency: "usd",
              unit_amount: priceInCents,
              product_data: {
                name: cartItem.article.name || "Produit sans nom",
                description: cartItem.article.description || "Description non disponible",
                images: [imgUrl]
              }
            }
          };
        });

        const addressData = {
          line1: address,
          city: city,
          state: "CA",
          postal_code: "94111",
          country: "US"
        };

        const bodyData = {
          paymentMethod: "stripe",
          line_items,
          customer_email: email,
          address: addressData
        };

        const response = await apiClient.post('/api/api/stripe/create-checkout-session', bodyData, {
          withCredentials: true,
        });

        const { sessionId, error } = response.data;

        if (error) {
          console.error("API Error:", error);
          setLoading(false);
          return;
        }

        try {
          console.log("Redirection vers Stripe Checkout avec sessionId :", sessionId);
          const result = await stripe.redirectToCheckout({ sessionId });
          
          if (result?.error) {
              console.error("Stripe redirect error:", result.error.message);
          }
        } catch (error) {
          console.error("Erreur lors de la redirection vers Stripe :", error);
        }
      } else if (paymentMethod === 'cheque') {
        alert("Thank you for your order. Please send your cheque to the provided address.");
        navigate(`/success`);
      } else {
        console.error("Please select a payment method.");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
    }

    setLoading(false);
  };

  return (
    <div className="checkout-container">
      <div className="checkout-form">
        <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
        <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
        <input type="text" placeholder="Shipping Address" value={address} onChange={e => setAddress(e.target.value)} />
        <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} />
        <input type="text" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
          <option value="">Select a payment method</option>
          <option value="cheque">Cheque Payment</option>
          <option value="stripe">Stripe</option>
        </select>

        {paymentMethod === 'cheque' && (
          <div>
            <h4>Instructions for cheque payment:</h4>
            <p>
              Please send your cheque to the following address:
              <br />
              <strong>KenziShop</strong>
              <br />
              123, Example Street
              <br />
              75001 Paris, France
            </p>
            <p>Your order will be processed upon receipt of your cheque.</p>
          </div>
        )}
      </div>

      <div className="checkout-summary">
        <h3>Your Order</h3>
        {panier.map((cartItem, index) => (
          <div key={index} className="summary-item">
            <p>{cartItem.article.name} × {cartItem.quantity} — {cartItem.article.price} €</p>
          </div>
        ))}
        <p>Subtotal: {totalPrice.toFixed(2)} €</p>
        <p>Shipping Fee: 15.00 € (Flat Rate)</p>
        <p>Total: {(totalPrice + 15.00).toFixed(2)} €</p>

        <button className="checkout-button" onClick={handleCheckout} disabled={loading}>
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
