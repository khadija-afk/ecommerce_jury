import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

interface CookiePreferences {
  publicites: boolean;
  performance: boolean;
  relationClient: boolean;
  reseauxSociaux: boolean;
  personnalisation: boolean;
  fonctionnels: boolean;
}

interface CookieSettingsModalProps {
  onClose: () => void;
}

const CookieSettingsModal: React.FC<CookieSettingsModalProps> = ({ onClose }) => {
  const [showModal, setShowModal] = useState<boolean>(true);
  const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences>({
    publicites: false,
    performance: false,
    relationClient: false,
    reseauxSociaux: false,
    personnalisation: false,
    fonctionnels: true, // toujours actif et non modifiable
  });

  const handleTogglePreference = (category: keyof CookiePreferences) => {
    if (category === 'fonctionnels') return;
    setCookiePreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      publicites: true,
      performance: true,
      relationClient: true,
      reseauxSociaux: true,
      personnalisation: true,
      fonctionnels: true,
    };
    setCookiePreferences(allAccepted);
    savePreferences(allAccepted);
    closeAndSave();
  };

  const handleDeclineAll = () => {
    const noneAccepted = {
      publicites: false,
      performance: false,
      relationClient: false,
      reseauxSociaux: false,
      personnalisation: false,
      fonctionnels: true,
    };
    setCookiePreferences(noneAccepted);
    savePreferences(noneAccepted);
    closeAndSave();
  };

  const savePreferences = (preferences: CookiePreferences) => {
    localStorage.setItem('userCookiePreferences', JSON.stringify(preferences));
  };

  const closeAndSave = () => {
    setShowModal(false);
    onClose();
  };

  return (
    <Modal show={showModal} onHide={closeAndSave} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Vos préférences relatives aux cookies</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {Object.keys(cookiePreferences).map((key) => {
            if (key === 'fonctionnels') return null; // Les cookies fonctionnels sont toujours actifs

            return (
              <Form.Check
                key={key}
                type="checkbox"
                id={`cookie-${key}`}
                label={key}
                checked={cookiePreferences[key as keyof CookiePreferences]}
                onChange={() => handleTogglePreference(key as keyof CookiePreferences)}
              />
            );
          })}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleDeclineAll}>
          Tous refuser
        </Button>
        <Button variant="primary" onClick={handleAcceptAll}>
          Tous accepter
        </Button>
        <Button variant="success" onClick={closeAndSave}>
          Valider
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CookieSettingsModal;
