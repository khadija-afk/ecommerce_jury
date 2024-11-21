import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Liens légaux */}
        <div className="footer-links">
          <h4>Liens Légaux</h4>
          <ul>
            <li><a href="/privacy-policy">Politique de Confidentialité</a></li>
            <li><a href="/terms-conditions">Conditions Générales</a></li>
            <li><a href="/cookie-settings">Paramètres des Cookies</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-contact">
          <h4>Besoin d'aide ?</h4>
          <p>Téléphone : +33 7 58 73 52 90</p>
          <p>Email : <a href="mailto:khadijaa.kenzi@gmail.com">khadijaa.kenzi@gmail.com</a></p>
          <p>Horaires : Lundi-Dimanche, 09h-19h</p>
        </div>

        {/* Formulaire de contact */}
        <div className="footer-form">
          <h4>Contactez-nous</h4>
          <form>
            <input type="text" placeholder="Entrez votre nom" />
            <input type="email" placeholder="Entrez votre email" />
            <textarea placeholder="Entrez votre message"></textarea>
            <button type="submit">Envoyer</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 KenziShop. Tous droits réservés.</p>
        <div className="social-icons">
          <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
