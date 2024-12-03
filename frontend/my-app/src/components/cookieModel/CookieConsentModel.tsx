import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

interface CookieConsentModalProps {
  onOpenSettings: () => void;
}

const CookieConsentModal: React.FC<CookieConsentModalProps> = ({ onOpenSettings }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const userConsent = localStorage.getItem("userCookieConsent");
    // Afficher le modal uniquement si aucun consentement n'a été donné
    if (!userConsent) {
      setShowModal(true);
    }
  }, []);

  const saveConsent = (consent: boolean) => {
    // Enregistrer le consentement dans le localStorage avec une date
    localStorage.setItem(
      "userCookieConsent",
      JSON.stringify({ consent, date: new Date().toISOString() })
    );
    setShowModal(false); // Fermer le modal après avoir enregistré le consentement
  };

  const handleAccept = () => saveConsent(true);

  const handleDecline = () => saveConsent(false);

  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      centered
      dialogClassName="custom-cookie-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Gérer mes cookies</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Kiabi et ses partenaires utilisent des cookies pour adapter le contenu
          de notre site à vos préférences, vous donner accès à des solutions de
          la relation client (chat et avis client), vous proposer des offres et
          publicités personnalisées ou encore pour réaliser des mesures de
          performance.
        </p>
        <p>
          Une fois votre choix réalisé, nous le conserverons pendant 6 mois. Vous pouvez
          changer d'avis à tout moment depuis le lien « Les cookies » en bas à gauche
          de chaque page de notre site.
        </p>
        <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
          Consulter la politique cookies
        </a>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onOpenSettings}>
          Paramétrer
        </Button>
        <Button variant="primary" onClick={handleAccept}>
          Accepter
        </Button>
        <Button variant="outline-secondary" onClick={handleDecline}>
          Refuser
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CookieConsentModal;
