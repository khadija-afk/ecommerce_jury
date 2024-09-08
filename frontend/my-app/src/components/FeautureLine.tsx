// FeatureLine.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faStore, faTruck, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './FeatureLine.css'; // Assurez-vous de créer ce fichier CSS

const FeatureLine: React.FC = () => {
  return (
    <div className="feature-line">
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
  );
};

export default FeatureLine;
