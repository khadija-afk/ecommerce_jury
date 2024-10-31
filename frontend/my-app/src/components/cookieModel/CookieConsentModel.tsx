import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import CookieConsent from 'react-cookie-consent';
import apiClient from '../../utils/axiosConfig';

// Générer un ID temporaire pour les utilisateurs non connectés
const generateTempId = () => `temp_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

const CookieConsentModal: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const userConsent = localStorage.getItem('userCookieConsent');
    if (!userConsent) {
      setShowModal(true);
    }
  }, []);

  const handleAccept = async () => {
    localStorage.setItem('userCookieConsent', 'accepted');
    setShowModal(false);

    const userId = localStorage.getItem('tempUserId') || generateTempId();
    localStorage.setItem('tempUserId', userId); // Sauvegarde de l'identifiant temporaire

    try {
      await apiClient.post('api/api/cookie/save-consent', { userId, consent: true });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du consentement:', error);
    }
  };

  const handleDecline = async () => {
    localStorage.setItem('userCookieConsent', 'declined');
    setShowModal(false);

    const userId = localStorage.getItem('tempUserId') || generateTempId();
    localStorage.setItem('tempUserId', userId);

    try {
      await apiClient.post('api/api/cookie/save-consent', { userId, consent: false });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du refus:', error);
    }
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Paramètres de Cookies</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Ce site utilise des cookies pour améliorer votre expérience utilisateur.</p>
        <CookieConsent
          enableDeclineButton
          onAccept={handleAccept}
          onDecline={handleDecline}
          buttonText="Accepter"
          declineButtonText="Refuser"
          style={{ background: "#2B373B", color: "white" }}
          buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
          declineButtonStyle={{ color: "white", background: "red" }}
        >
          <p>En acceptant, vous consentez à l'utilisation de cookies pour optimiser votre expérience.</p>
        </CookieConsent>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CookieConsentModal;
