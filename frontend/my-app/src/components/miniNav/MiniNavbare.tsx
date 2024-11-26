import React from 'react';
import { Link } from 'react-router-dom';
import './MiniNavbare.css';

const MiniNavbar: React.FC = () => {
  return (
    <nav className="mini-navbar">
      <ul className="mini-navbar-list">
        <li className="mini-navbar-item">
          <Link to="/categorie/vetements">Vêtements</Link>
        </li>
        <li className="mini-navbar-item">
          <Link to="/categorie/maquillage">Maquillage</Link>
        </li>
        <li className="mini-navbar-item">
          <Link to="/categorie/accessoires">Accessoires</Link>
        </li>
        <li className="mini-navbar-item">
          <Link to="/categorie/chaussures">Chaussures</Link>
        </li>
      </ul>
    </nav>
  );
};

export default MiniNavbar;
