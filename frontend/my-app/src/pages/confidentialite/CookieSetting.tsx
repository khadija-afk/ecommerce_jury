// CookieSettings.tsx
import React, { useState } from 'react';

const CookieSettings: React.FC = () => {
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
  });

  const handleToggle = (cookieType: string) => {
    setPreferences((prev) => ({
      ...prev,
      [cookieType]: !prev[cookieType as keyof typeof preferences],
    }));
  };

  const handleSave = () => {
    // Sauvegarde des préférences, peut-être dans un localStorage ou backend API
    console.log('Préférences sauvegardées :', preferences);
    alert("Vos préférences de cookies ont été sauvegardées.");
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', marginLeft: '100px' }}>
      <h1>Paramètres des Cookies</h1>
      <p>
        Nous utilisons des cookies pour optimiser votre expérience. Vous pouvez
        choisir quels types de cookies vous souhaitez autoriser.
      </p>

      <div style={{ margin: '20px 0' }}>
        <h3>Types de cookies</h3>

        <label style={{ display: 'block', margin: '10px 0' }}>
          <input
            type="checkbox"
            checked={preferences.essential}
            disabled
          />
          <span>Cookies Essentiels (Toujours activés)</span>
        </label>

        <label style={{ display: 'block', margin: '10px 0' }}>
          <input
            type="checkbox"
            checked={preferences.analytics}
            onChange={() => handleToggle('analytics')}
          />
          <span>Cookies Analytiques</span>
        </label>

        <label style={{ display: 'block', margin: '10px 0' }}>
          <input
            type="checkbox"
            checked={preferences.marketing}
            onChange={() => handleToggle('marketing')}
          />
          <span>Cookies Marketing</span>
        </label>
      </div>

      <button onClick={handleSave} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>
        Sauvegarder les préférences
      </button>
    </div>
  );
};

export default CookieSettings;
