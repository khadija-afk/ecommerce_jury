import React from "react";
import { useNavigate } from "react-router-dom";
import "./profileNavebare.css";

const ProfileNavBar = () => {
  const navigate = useNavigate();

  return (
    <div className="profile-navbar">
      <button onClick={() => navigate("/profil/orders")}>Vos Commandes</button>
      <button onClick={() => navigate("/profil/security")}>
        Connexion et Sécurité
      </button>
      <button onClick={() => navigate("/profil/adresse")}>
        Adresse et Livraison
      </button>
      <button onClick={() => navigate("/profil/A2FGenerat")}>
        Activer A2F
      </button>
      <button onClick={() => navigate("/profil/A2FVerefiy")}>
        Vérifier A2F
      </button>
      <button onClick={() => navigate("/profil/A2FDesactive")}>
        Désactiver A2F
      </button>
    </div>
  );
};

export default ProfileNavBar;
