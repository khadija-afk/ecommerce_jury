import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

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
    if (category === "fonctionnels") return; // Ne pas permettre la modification des cookies fonctionnels
    setCookiePreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleAcceptAll = () => {
    setCookiePreferences({
      publicites: true,
      performance: true,
      relationClient: true,
      reseauxSociaux: true,
      personnalisation: true,
      fonctionnels: true,
    });
    setShowModal(false);
    onClose();
    savePreferences();
  };

  const handleDeclineAll = () => {
    setCookiePreferences({
      publicites: false,
      performance: false,
      relationClient: false,
      reseauxSociaux: false,
      personnalisation: false,
      fonctionnels: true,
    });
    setShowModal(false);
    onClose();
    savePreferences();
  };

  const handleValidate = () => {
    setShowModal(false);
    onClose();
    savePreferences();
  };

  const savePreferences = () => {
    localStorage.setItem(
      "userCookiePreferences",
      JSON.stringify(cookiePreferences)
    );
  };

  const preferencesList = [
    {
      label: "Publicités personnalisées",
      key: "publicites",
      description: "Afficher des publicités personnalisées selon votre navigation.",
    },
    {
      label: "Performance",
      key: "performance",
      description: "Suivre la navigation pour améliorer l'expérience utilisateur.",
    },
    // ... autres préférences
  ] as const;

  return (
    <Modal show={showModal} onHide={() => { setShowModal(false); onClose(); }} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Votre choix relatif aux cookies</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Contenu ici */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleDeclineAll}>
          Tous refuser
        </Button>
        <Button variant="primary" onClick={handleAcceptAll}>
          Tous accepter
        </Button>
        <Button variant="success" onClick={handleValidate}>
          Valider
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CookieSettingsModal;
