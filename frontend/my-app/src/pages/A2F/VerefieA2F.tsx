import React, { useState, useEffect } from "react";
import Verify2FA from "../../components/A2F/VerefiyA2F"; // Importez le composant
import apiClient from "../../utils/axiosConfig";

const Verify2FAPage = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Récupérer l'ID de l'utilisateur connecté
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await apiClient.get("/api/api/user/check_auth", {
          withCredentials: true,
        });
        setUserId(response.data.id); // ID utilisateur
      } catch (err) {
        setError(
          "Erreur lors de la récupération des informations utilisateur. Veuillez vous connecter."
        );
      }
    };

    fetchUserId();
  }, []);

  const handleSuccess = () => {
    console.log("Vérification réussie !");
  };

  return (
    <div>
      <h1>Vérification du code A2F</h1>
      <p>Veuillez entrer le code généré par votre application d'authentification.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {userId ? (
        <Verify2FA userId={userId} onSuccess={handleSuccess} />
      ) : (
        <p>Chargement des informations utilisateur...</p>
      )}
    </div>
  );
};

export default Verify2FAPage;
