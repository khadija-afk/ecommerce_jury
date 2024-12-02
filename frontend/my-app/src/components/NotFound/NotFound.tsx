import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css'; // Pour styliser la page

const NotFound: React.FC = () => {
    return (
        <div className="not-found-container">
            <h1>404</h1>
            <p>Oups ! La page que vous cherchez n'existe pas.</p>
            <Link to="/" className="back-home">
                Retour à l'accueil
            </Link>
        </div>
    );
};

export default NotFound;
