import React, { useState, useEffect } from 'react';
import axios from 'axios';
import apiClient from '../../utils/axiosConfig';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({});

  useEffect(() => {
    apiClient.get('/api/api/user/profil', { withCredentials: true })
      .then((response) => {
        setUser(response.data);
        setUpdatedData(response.data);
      })
      .catch((error) => console.error('Erreur lors de la récupération du profil utilisateur :', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  const handleSave = () => {
    apiClient.put('/api/api/user/updateProfil', updatedData, { withCredentials: true })
      .then((response) => {
        setUser(response.data.user);
        setIsEditing(false);
      })
      .catch((error) => console.error('Erreur lors de la mise à jour du profil :', error));
  };

  if (!user) return <p>Chargement...</p>;

  return (
    <div>
      <h2>Mon Profil</h2>
      {isEditing ? (
        <>
          <input
            type="text"
            name="firstName"
            value={updatedData.firstName}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="lastName"
            value={updatedData.lastName}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            value={updatedData.email}
            onChange={handleInputChange}
          />
          <button onClick={handleSave}>Enregistrer</button>
        </>
      ) : (
        <>
          <p><strong>Nom :</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Email :</strong> {user.email}</p>
          <button onClick={() => setIsEditing(true)}>Modifier</button>
        </>
      )}
    </div>
  );
};

export default UserProfile;
