import React from "react";
import { Outlet } from "react-router-dom";
import ProfileNavBar from "../../components/profil/profilNavbare";
import "./profil.css"; // Ajoutez un fichier CSS si nécessaire

const UserProfilePage = () => {
  return (
    <div className="user-profile-container">
      <ProfileNavBar /> {/* Ajout du mini-navbar */}
      <div className="user-profile-content">
        <Outlet /> {/* Permet de charger les sous-routes */}
      </div>
    </div>
  );
};

export default UserProfilePage;
