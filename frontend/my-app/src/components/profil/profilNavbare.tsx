import React from "react";
import { Link } from "react-router-dom";
import "./profileNavebare.css";

interface ProfileNavBarProps {
  handleNavLinkClick: (path: string) => void;
}

const ProfileNavBar: React.FC<ProfileNavBarProps> = ({ handleNavLinkClick }) => {
  return (
    <nav className="profile-navbar">
      <ul className="profile-navbar-list">
        <li className="profile-navbar-item">
          <Link to="/profil/orders" onClick={() => handleNavLinkClick("/profil/orders")}>
            Vos Commandes
          </Link>
        </li>
        <li className="profile-navbar-item">
          <Link to="/profil/security" onClick={() => handleNavLinkClick("/profil/security")}>
            Connexion et Sécurité
          </Link>
        </li>
        <li className="profile-navbar-item">
          <Link to="/profil/adresse" onClick={() => handleNavLinkClick("/profil/adresse")}>
            Adresse et Livraison
          </Link>
        </li>
        <li className="profile-navbar-item">
          <Link to="/profil/A2FGenerat" onClick={() => handleNavLinkClick("/profil/A2FGenerat")}>
            Activer A2F
          </Link>
        </li>
        <li className="profile-navbar-item">
          <Link to="/profil/A2FVerefiy" onClick={() => handleNavLinkClick("/profil/A2FVerefiy")}>
            Vérifier A2F
          </Link>
        </li>
        <li className="profile-navbar-item">
          <Link to="/profil/A2FDesactive" onClick={() => handleNavLinkClick("/profil/A2FDesactive")}>
            Désactiver A2F
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default ProfileNavBar;
