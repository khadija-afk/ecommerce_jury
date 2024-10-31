import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const CookieSettingsModal: React.FC = () => {
  const [showModal, setShowModal] = useState(true);
  const [cookiePreferences, setCookiePreferences] = useState({
    publicites: false,
    performance: false,
    relationClient: false,
    reseauxSociaux: false,
    personnalisation: false,
    fonctionnels: true, // toujours actif et non modifiable
  });

  const handleTogglePreference = (category: string) => {
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
    savePreferences();
  };

  const handleValidate = () => {
    setShowModal(false);
    savePreferences();
  };

  const savePreferences = () => {
    localStorage.setItem('userCookiePreferences', JSON.stringify(cookiePreferences));
    // Ici, vous pouvez également envoyer les préférences au backend via une API si nécessaire
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Votre choix relatif aux cookies</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Les cookies sont importants pour le bon fonctionnement d'un site. Afin d'améliorer votre expérience, nous utilisons des cookies pour conserver les informations de connexion et fournir une connexion sûre, optimiser les performances du site, vous proposer des services complémentaires, collecter des statistiques anonymes en vue d'optimiser les fonctionnalités du site, d’adapter le contenu à vos centres d’intérêts et vous permettre de partager des informations sur les réseaux sociaux.
        </p>
        <p>Veuillez sélectionner vos préférences pour chaque catégorie de cookies, puis cliquez sur « Valider » pour confirmer. Vous pouvez modifier votre choix à tout moment depuis la page des paramètres de cookies.</p>
        
        <Form>
          {[
            { label: "Publicités personnalisées", key: "publicites", description: "Kiabi utilise des traceurs pour afficher de la publicité personnalisée en fonction de votre navigation et de votre profil." },
            { label: "Performance", key: "performance", description: "Kiabi utilise des solutions d’optimisation et de suivi de navigation pour améliorer l’expérience." },
            { label: "Relation Client", key: "relationClient", description: "Kiabi propose des chats pour faciliter votre recherche et répondre à vos questions." },
            { label: "Réseaux sociaux", key: "reseauxSociaux", description: "Notre site permet le partage de contenu sur les réseaux sociaux et l'identification via vos identifiants sociaux." },
            { label: "Personnalisation", key: "personnalisation", description: "Nos sites utilisent des cookies pour personnaliser l’affichage de nos produits et services." },
            { label: "Fonctionnels", key: "fonctionnels", description: "Les cookies fonctionnels et techniques sont nécessaires pour fournir nos services et ne peuvent pas être désactivés." },
          ].map(({ label, key, description }) => (
            <Form.Group as={Row} className="mb-3" key={key}>
              <Form.Label column sm="8">
                <strong>{label}</strong> - {description}
              </Form.Label>
              <Col sm="4" className="text-end">
                {key !== "fonctionnels" ? (
                  <Form.Check 
                    type="switch"
                    id={`${key}-switch`}
                    checked={cookiePreferences[key]}
                    onChange={() => handleTogglePreference(key)}
                  />
                ) : (
                  <span>Activé</span>
                )}
              </Col>
            </Form.Group>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleDeclineAll}>Tous refuser</Button>
        <Button variant="primary" onClick={handleAcceptAll}>Tous accepter</Button>
        <Button variant="success" onClick={handleValidate}>Valider</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CookieSettingsModal;
