import React from "react";
import Disable2FA from "../../components/A2F/DesactiveA2F"; // Importez le composant

const Disable2FAPage = () => {
  return (
    <div>
      <h1>Désactiver l'A2F</h1>
      <p>Entrez le code OTP pour désactiver l'authentification à deux facteurs.</p>
      <Disable2FA  /> {/* Remplacez `3` par l'ID utilisateur dynamique */}
    </div>
  );
};

export default Disable2FAPage;
