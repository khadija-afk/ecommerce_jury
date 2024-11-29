import React, { useState, useEffect } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import apiClient from '../../utils/axiosConfig';
import './Checkout.css';

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { orderId } = useParams();
  const { state } = useLocation();
  const [total, setTotal] = useState(state?.total || 0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedAddressDetails, setSelectedAddressDetails] = useState(null);
  const [newAddress, setNewAddress] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    postal_code: '',
    country: 'France',
  });
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Charger les adresses utilisateur
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await apiClient.get('/api/api/adresse/addresses', {
          withCredentials: true,
        });
        setAddresses(response.data);

        if (response.data.length > 0) {
          setSelectedAddressId(response.data[0].id);
          setSelectedAddressDetails(response.data[0]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des adresses utilisateur :', error);
      }
    };

    fetchAddresses();
  }, []);

  // Récupérer le total si non fourni
  useEffect(() => {
    if (!state?.total) {
      apiClient
        .get(`/api/api/order/orders/${orderId}`, { withCredentials: true })
        .then((response) => setTotal(response.data.total))
        .catch((err) =>
          console.error('Erreur lors de la récupération des détails de la commande :', err)
        );
    }
  }, [orderId, state]);

  const handleAddressSelection = (addressId) => {
    setSelectedAddressId(addressId);
    const address = addresses.find((addr) => addr.id === addressId);
    setSelectedAddressDetails(address);
  };

  const handleAddNewAddress = async () => {
    try {
      const response = await apiClient.post('/api/api/adresse/addresses', newAddress, {
        withCredentials: true,
      });
      setAddresses([...addresses, response.data]); // Ajouter la nouvelle adresse à la liste
      setShowNewAddressForm(false); // Masquer le formulaire après ajout
      setSelectedAddressId(response.data.id); // Sélectionner la nouvelle adresse
      setSelectedAddressDetails(response.data); // Définir les détails de la nouvelle adresse
      setNewAddress({
        address_line1: '',
        address_line2: '',
        city: '',
        postal_code: '',
        country: 'France',
      }); // Réinitialiser le formulaire
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la nouvelle adresse :', error);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!selectedAddressId || !paymentMethod) {
      alert('Veuillez sélectionner une adresse et une méthode de paiement.');
      return;
    }

    setLoading(true);

    try {
      const paymentDetailResponse = await apiClient.post(
        '/api/api/payment/payment-details',
        {
          order_fk: orderId,
          amount: total,
          provider: paymentMethod,
          status: 'Pending',
          fk_addr_fk: selectedAddressId,
        },
        { withCredentials: true }
      );

      const paymentDetailId = paymentDetailResponse.data.id;

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
            customer_email: selectedAddressDetails.email || '',
            address: {
              line1: selectedAddressDetails.address_line1,
              city: selectedAddressDetails.city,
              postal_code: selectedAddressDetails.postal_code,
              country: selectedAddressDetails.country,
            },
          },
          { withCredentials: true }
        );

        const { sessionId, error } = response.data;

        if (error) {
          console.error('Erreur API :', error);
          setLoading(false);
          return;
        }

        await stripe.redirectToCheckout({ sessionId });
      } else if (paymentMethod === 'cheque') {
        alert('Merci pour votre commande. Veuillez envoyer votre chèque à l\'adresse indiquée.');
        navigate(`/success`);
      }
    } catch (error) {
      console.error('Erreur lors de la création du paiement :', error);
    }

    setLoading(false);
  };

  return (
    <div className="checkout-container">
      <div className="checkout-address">
        <h3>Sélectionnez une adresse de livraison</h3>
        {addresses.length > 0 ? (
          <div className="address-options">
            {addresses.map((address) => (
              <label key={address.id} className="address-option">
                <input
                  type="radio"
                  name="selectedAddress"
                  value={address.id}
                  onChange={() => handleAddressSelection(address.id)}
                  checked={selectedAddressId === address.id}
                />
                {address.address_line1}, {address.city} ({address.postal_code})
              </label>
            ))}
          </div>
        ) : (
          <p>Aucune adresse enregistrée. Veuillez en ajouter une depuis votre profil.</p>
        )}
        {selectedAddressDetails && (
          <div className="address-details">
            <h4>Détails de l'adresse sélectionnée</h4>
            <p><strong>Adresse :</strong> {selectedAddressDetails.address_line1}</p>
            {selectedAddressDetails.address_line2 && (
              <p><strong>Complément :</strong> {selectedAddressDetails.address_line2}</p>
            )}
            <p><strong>Ville :</strong> {selectedAddressDetails.city}</p>
            <p><strong>Code Postal :</strong> {selectedAddressDetails.postal_code}</p>
            <p><strong>Pays :</strong> {selectedAddressDetails.country}</p>
          </div>
        )}
        <button onClick={() => setShowNewAddressForm(!showNewAddressForm)}>
          {showNewAddressForm ? 'Annuler' : 'Ajouter une nouvelle adresse'}
        </button>
        {showNewAddressForm && (
          <div className="new-address-form">
            <input
              type="text"
              placeholder="Adresse ligne 1"
              value={newAddress.address_line1}
              onChange={(e) =>
                setNewAddress({ ...newAddress, address_line1: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Adresse ligne 2 (optionnel)"
              value={newAddress.address_line2}
              onChange={(e) =>
                setNewAddress({ ...newAddress, address_line2: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Ville"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
            />
            <input
              type="text"
              placeholder="Code postal"
              value={newAddress.postal_code}
              onChange={(e) =>
                setNewAddress({ ...newAddress, postal_code: e.target.value })
              }
            />
            <button onClick={handleAddNewAddress}>Ajouter l'adresse</button>
          </div>
        )}
      </div>

      <div className="checkout-summary">
        <h3>Résumé de votre commande</h3>
        <p>Sous-total : {total} €</p>

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="">Choisir une méthode de paiement</option>
          <option value="cheque">Paiement par chèque</option>
          <option value="stripe">Stripe</option>
        </select>

        <button className="checkout-button" onClick={handleCheckout} disabled={loading}>
          {loading ? 'Traitement...' : `Valider la commande - Total : ${total} €`}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
