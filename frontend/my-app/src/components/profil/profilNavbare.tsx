import React from "react";
import "./profileNavebare.css";

interface ProfileNavBarProps {
  handleNavLinkClick: (path: string) => void;
}

const ProfileNavBar: React.FC<ProfileNavBarProps> = ({ handleNavLinkClick }) => {
  return (
    <div className="profile-navbar">
      <button onClick={() => handleNavLinkClick("/profil/orders")}>
        Vos Commandes
      </button>
      <button onClick={() => handleNavLinkClick("/profil/security")}>
        Connexion et Sécurité
      </button>
      <button onClick={() => handleNavLinkClick("/profil/adresse")}>
        Adresse et Livraison
      </button>
      <button onClick={() => handleNavLinkClick("/profil/A2FGenerat")}>
        Activer A2F
      </button>
      <button onClick={() => handleNavLinkClick("/profil/A2FVerefiy")}>
        Vérifier A2F
      </button>
      <button onClick={() => handleNavLinkClick("/profil/A2FDesactive")}>
        Désactiver A2F
      </button>
    </div>
  );
};

export default ProfileNavBar;
