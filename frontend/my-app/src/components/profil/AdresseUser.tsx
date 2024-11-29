import React, { useState, useEffect } from 'react';
import apiClient from '../../utils/axiosConfig';
import './AdresseUser.css';

const UserAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'France',
    phone: '',
    type: 'livraison',
  });
  const [editAddress, setEditAddress] = useState(null); // Adresse en cours d'édition
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/api/api/adresse/addresses', {
          withCredentials: true,
        });
        setAddresses(response.data);
      } catch (err) {
        console.error('Erreur lors du chargement des adresses :', err);
        setError('Impossible de charger vos adresses.');
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
  };

  const handleAddAddress = async () => {
    try {
      const response = await apiClient.post('/api/api/adresse/addresses', newAddress, {
        withCredentials: true,
      });
      setAddresses([...addresses, response.data]);
      setNewAddress({
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'France',
        phone: '',
        type: 'livraison',
      });
    } catch (err) {
      console.error('Erreur lors de l\'ajout de l\'adresse :', err);
    }
  };

  const handleEditAddress = (address) => {
    setEditAddress(address);
  };

  const handleUpdateAddress = async () => {
    try {
      const response = await apiClient.put(
        `/api/api/adresse/addresses/${editAddress.id}`,
        editAddress,
        { withCredentials: true }
      );
      setAddresses((prev) =>
        prev.map((addr) => (addr.id === editAddress.id ? response.data : addr))
      );
      setEditAddress(null);
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'adresse :', err);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await apiClient.delete(`/api/api/adresse/addresses/${id}`, { withCredentials: true });
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'adresse :', err);
    }
  };

  if (loading) return <p>Chargement de vos adresses...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="addresses-container">
      <h2>Vos Adresses</h2>
      {addresses.map((address) => (
        <div className="address-card" key={address.id}>
          <p><strong>Adresse :</strong> {address.address_line1}</p>
          {address.address_line2 && <p>{address.address_line2}</p>}
          <p><strong>Ville :</strong> {address.city}</p>
          <p><strong>Code Postal :</strong> {address.postal_code}</p>
          <p><strong>Pays :</strong> {address.country}</p>
          <p><strong>Téléphone :</strong> {address.phone}</p>
          <button onClick={() => handleEditAddress(address)}>Modifier</button>
          <button onClick={() => handleDeleteAddress(address.id)}>Supprimer</button>
        </div>
      ))}

      {editAddress && (
        <div className="edit-address-form">
          <h3>Modifier l'adresse</h3>
          <input
            name="address_line1"
            value={editAddress.address_line1}
            onChange={(e) =>
              setEditAddress({ ...editAddress, address_line1: e.target.value })
            }
            placeholder="Ligne d'adresse 1"
          />
          <input
            name="address_line2"
            value={editAddress.address_line2}
            onChange={(e) =>
              setEditAddress({ ...editAddress, address_line2: e.target.value })
            }
            placeholder="Ligne d'adresse 2 (optionnel)"
          />
          <input
            name="city"
            value={editAddress.city}
            onChange={(e) =>
              setEditAddress({ ...editAddress, city: e.target.value })
            }
            placeholder="Ville"
          />
          <input
            name="postal_code"
            value={editAddress.postal_code}
            onChange={(e) =>
              setEditAddress({ ...editAddress, postal_code: e.target.value })
            }
            placeholder="Code Postal"
          />
          <button onClick={handleUpdateAddress}>Mettre à jour</button>
        </div>
      )}

      <div className="add-address-form">
        <h3>Ajouter une nouvelle adresse</h3>
        <input
          name="address_line1"
          value={newAddress.address_line1}
          onChange={handleInputChange}
          placeholder="Ligne d'adresse 1"
        />
        <input
          name="address_line2"
          value={newAddress.address_line2}
          onChange={handleInputChange}
          placeholder="Ligne d'adresse 2 (optionnel)"
        />
        <input
          name="city"
          value={newAddress.city}
          onChange={handleInputChange}
          placeholder="Ville"
        />
        <input
          name="postal_code"
          value={newAddress.postal_code}
          onChange={handleInputChange}
          placeholder="Code Postal"
        />
        <button onClick={handleAddAddress}>Ajouter l'adresse</button>
      </div>
    </div>
  );
};

export default UserAddresses;
