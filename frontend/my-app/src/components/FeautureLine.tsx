import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faStore, faTruck, faCheckCircle, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import './FeatureLine.css';

const FeatureLine: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true); // Ouvert par défaut sur les grands écrans
  const [isMobile, setIsMobile] = useState(false);

  // Gérer la détection des petits écrans
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
        setIsOpen(true); // Toujours ouvert sur les grands écrans
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Vérifier une première fois lors du montage du composant

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleFeatureLine = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="feature-line-container">
      {/* Bouton pour basculer l'affichage des fonctionnalités sur petits écrans */}
      {isMobile && (
        <div className="feature-line-toggle" onClick={toggleFeatureLine}>
          <span>Features</span>
          <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} className="toggle-icon" />
        </div>
      )}

      {/* Affichage des fonctionnalités */}
      <div className={`feature-line ${isOpen ? 'open' : 'closed'}`}>
        <div className="feature-item">
          <FontAwesomeIcon icon={faCreditCard} className="feature-icon" />
          <span>Installments Without Card</span>
        </div>
        <div className="feature-item">
          <FontAwesomeIcon icon={faStore} className="feature-icon" />
          <span>Free pickup in stores</span>
        </div>
        <div className="feature-item">
          <FontAwesomeIcon icon={faTruck} className="feature-icon" />
          <span>Free delivery from €35</span>
        </div>
        <div className="feature-item">
          <FontAwesomeIcon icon={faCheckCircle} className="feature-icon" />
          <span>Track your order</span>
        </div>
        <div className="feature-item">
          <FontAwesomeIcon icon={faCheckCircle} className="feature-icon" />
          <span>100% Customer satisfaction rate</span>
        </div>
      </div>
    </div>
  );
};

export default FeatureLine;
