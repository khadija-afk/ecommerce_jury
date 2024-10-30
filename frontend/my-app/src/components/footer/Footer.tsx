// Footer.js
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-sections">
        {/* Liens légaux */}
        <div className="footer-links">
          <h4>Liens Légaux</h4>
          <ul>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms-conditions">Terms and Conditions</a></li>
            <li><a href="/cookie-settings">Cookie Settings</a></li>
          </ul>
        </div>

        {/* Informations sur le site */}
        <div className="footer-about">
          <h4>Who We Are</h4>
          <p>Our website address is: <a href="https://klbtheme.com/blonwe">https://klbtheme.com/blonwe</a></p>
          <p>Our website shares data, collects visitor comments, and ensures the privacy and security of our users.</p>
        </div>

        {/* Informations de contact */}
        <div className="footer-contact">
          <h4>Besoin d'aide ?</h4>
          <p>Téléphone : 0 800 300-353</p>
          <p>Email : <a href="mailto:info@example.com">info@example.com</a></p>
          <p>Heures d’ouverture : Lundi-Dimanche 09:00-19:00</p>
        </div>
      </div>

      {/* Droits et réseaux sociaux */}
      <div className="footer-bottom">
        <p>&copy; 2024 Blonwe. All rights reserved. Powered by KLBTheme.</p>
        <div className="social-icons">
          {/* Icônes des réseaux sociaux */}
          <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noreferrer">Facebook</a>
          <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noreferrer">Twitter</a>
          <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer">Instagram</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
