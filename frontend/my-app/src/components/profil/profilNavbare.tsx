import React from "react";
import { Link } from "react-router-dom";
import "./profileNavebare.css";

interface ProfileNavBarProps {
  handleNavLinkClick: (path: string) => void;
}

const ProfileNavBar: React.FC<ProfileNavBarProps> = ({ handleNavLinkClick }) => {
  return (
    <nav className="profile-navbar" aria-label="Profile Navigation">
      <ul className="profile-navbar-list">
        <li className="profile-navbar-item">
          <Link
            to="/profil/orders"
            onClick={() => handleNavLinkClick("/profil/orders")}
            className="profile-navbar-link"
          >
            Vos Commandes
          </Link>
        </li>
        <li className="profile-navbar-item">
          <Link
            to="/profil/adresse"
            onClick={() => handleNavLinkClick("/profil/adresse")}
            className="profile-navbar-link"
          >
            Adresse et Livraison
          </Link>
        </li>
        <li className="profile-navbar-item">
          <Link
            to="/profil/security"
            onClick={() => handleNavLinkClick("/profil/security")}
            className="profile-navbar-link"
          >
            Connexion et Sécurité
          </Link>
        </li>
       
        {/* <li className="profile-navbar-item">
          <Link
            to="/profil/A2FGenerat"
            onClick={() => handleNavLinkClick("/profil/A2FGenerat")}
            className="profile-navbar-link"
          >
            Activer A2F
          </Link>
        </li> */}
        {/* <li className="profile-navbar-item">
          <Link
            to="/profil/A2FVerefiy"
            onClick={() => handleNavLinkClick("/profil/A2FVerefiy")}
            className="profile-navbar-link"
          >
            Vérifier A2F
          </Link>
        </li> */}
        {/* <li className="profile-navbar-item">
          <Link
            to="/profil/A2FDesactive"
            onClick={() => handleNavLinkClick("/profil/A2FDesactive")}
            className="profile-navbar-link"
          >
            Désactiver A2F
          </Link>
        </li> */}
      </ul>
    </nav>
  );
};

export default ProfileNavBar;
