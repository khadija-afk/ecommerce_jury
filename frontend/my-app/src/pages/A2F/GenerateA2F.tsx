import React from "react";
import TwoFactorAuth from "../../components/A2F/GenerateA2F"; // Importez le composant

const TwoFactorAuthPage = () => {
  return (
    <div>
      <h1>Configurer l'A2F</h1>
      <p>Scannez le QR code et entrez le code généré pour activer l'A2F.</p>
      <TwoFactorAuth />
    </div>
  );
};

export default TwoFactorAuthPage;
