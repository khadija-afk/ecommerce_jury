import React, { useState } from 'react';
import './Footer.css';
import apiClient from '../../utils/axiosConfig';

const Footer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState<'success' | 'error' | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponseMessage('');
    setResponseType(null);

    try {
      const response = await apiClient.post('/api/cantact/contact', formData);
      setResponseMessage('Votre message a été envoyé avec succès !');
      setResponseType('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error: any) {
      setResponseMessage(
        error.response?.data?.error || "Une erreur s'est produite lors de l'envoi de votre message. Veuillez réessayer."
      );
      setResponseType('error');
    }
  };

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
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Entrez votre nom"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Entrez votre email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Entrez votre message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit">Envoyer</button>
          </form>

          {/* Message de réponse */}
          {responseMessage && (
            <div
              className={`response-message ${responseType === 'success' ? 'success' : 'error'}`}
            >
              {responseMessage}
            </div>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 ELLE&STYLE. Tous droits réservés.</p>
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
