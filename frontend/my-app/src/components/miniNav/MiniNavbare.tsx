import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Offcanvas, Button } from 'react-bootstrap';
import './MiniNavbare.css';

const MiniNavbar: React.FC = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  return (
    <nav className="mini-navbar">
      {/* Bouton visible uniquement sur mobile pour ouvrir le menu */}
      <Button variant="outline-primary" className="d-md-none" onClick={handleShowOffcanvas}>
        <i className="fas fa-bars"></i> Catégories
      </Button>

      {/* Liste visible sur grand écran */}
      <ul className="mini-navbar-list d-none d-md-flex">
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

      {/* Offcanvas pour les petits écrans */}
      <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Catégories</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="mini-navbar-list">
            <li className="mini-navbar-item">
              <Link to="/categorie/vetements" onClick={handleCloseOffcanvas}>Vêtements</Link>
            </li>
            <li className="mini-navbar-item">
              <Link to="/categorie/maquillage" onClick={handleCloseOffcanvas}>Maquillage</Link>
            </li>
            <li className="mini-navbar-item">
              <Link to="/categorie/accessoires" onClick={handleCloseOffcanvas}>Accessoires</Link>
            </li>
            <li className="mini-navbar-item">
              <Link to="/categorie/chaussures" onClick={handleCloseOffcanvas}>Chaussures</Link>
            </li>
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
    </nav>
  );
};

export default MiniNavbar;
