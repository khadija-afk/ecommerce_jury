import React from "react";
import { Outlet } from "react-router-dom";
import ProfileNavBar from "../../components/profil/profilNavbare";
import "./profil.css";

const UserProfilePage: React.FC = () => {
  const handleNavLinkClick = (navItem: string) => {
    console.log(`Navigation vers : ${navItem}`);
    // Implémentez une logique supplémentaire si nécessaire, par ex. changer d'onglet
  };

  return (
    <div className="user-profile-container">
      <ProfileNavBar handleNavLinkClick={handleNavLinkClick} />
      <div className="user-profile-content">
        <Outlet />
      </div>
    </div>
  );
};

export default UserProfilePage;
