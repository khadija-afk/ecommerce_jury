import React from 'react';
import { Link } from 'react-router-dom';

const NoResults: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Aucun résultat trouvé</h1>
      <p>Désolé, nous n'avons trouvé aucun article correspondant à votre recherche.</p>
      <Link to="/">Retour à l'accueil</Link>
    </div>
  );
};

export default NoResults;
