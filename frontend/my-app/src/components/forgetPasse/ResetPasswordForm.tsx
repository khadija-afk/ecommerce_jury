import React, { useState } from 'react';

const ResetPasswordForm = () => {
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Code pour réinitialiser le mot de passe avec le serveur
    console.log('Nouveau mot de passe soumis :', newPassword);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Réinitialiser le mot de passe</h2>
      <input 
        type="password" 
        placeholder="Entrez le nouveau mot de passe" 
        value={newPassword} 
        onChange={(e) => setNewPassword(e.target.value)} 
        required 
      />
      <button type="submit">Réinitialiser</button>
    </form>
  );
};

export default ResetPasswordForm;
