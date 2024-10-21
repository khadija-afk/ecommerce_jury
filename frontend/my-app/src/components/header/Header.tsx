import React, { useState, useEffect, useContext, useRef } from 'react';
import { Navbar, Nav, Container, Form, FormControl, Button, Badge, NavDropdown, Offcanvas } from 'react-bootstrap';
import './Header.css';
import { PanierContext } from '../../utils/PanierContext';
import { useFavoris } from '../../utils/FavorieContext';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

import apiClient from '../../utils/axiosConfig';

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { totalArticle } = useContext(PanierContext);
  const { totalFavorites } = useFavoris();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  // État pour afficher/cacher l'Offcanvas sur mobile
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/api/user/check_auth', {
          method: 'GET',
          credentials: 'include'
        });
        setIsLoggedIn(response.ok);
      } catch (error) {
        console.error('Error checking authentication status:', error);
      }
    };
    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/api/Log/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setIsLoggedIn(false); // Met à jour l'état après la déconnexion
        navigate('/sign');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      navigate(`/search?query=${searchTerm}`);
    }
  };

  return (
    <header>
      <Navbar expand="lg" bg="white" variant="light" className="py-3">
        <Container fluid>
          {/* Logo et barre de recherche à gauche */}
          <div className="d-flex align-items-center w-50">
            <Navbar.Brand href="/">KenziShop</Navbar.Brand>
            <Form className="d-flex mx-3 w-100" onSubmit={handleSearch} ref={searchRef}>
              <FormControl
                type="search"
                placeholder="Rechercher"
                className="me-2 w-75"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Button variant="outline-primary" type="submit">
                <i className="bi bi-search"></i>
              </Button>
            </Form>
          </div>

          {/* Icônes affichées uniquement sur les grands écrans */}
          <Nav className="ms-auto d-none d-md-flex align-items-center">
            {isLoggedIn ? (
              <NavDropdown title="Mon compte" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i> Déconnexion
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown title="Bonjour, identifiez-vous" id="basic-nav-dropdown">
                <NavDropdown.Item href="/sign">
                  <i className="fas fa-user"></i> Se connecter
                </NavDropdown.Item>
                <NavDropdown.Item href="/register">
                  <i className="fas fa-square"></i> Inscription
                </NavDropdown.Item>
              </NavDropdown>
            )}

            <Nav.Link href="/favoris" className="position-relative">
              <i className="bi bi-heart"></i>
              {totalFavorites() > 0 && (
                <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                  {totalFavorites()}
                </Badge>
              )}
            </Nav.Link>

            <Nav.Link href="/panier" className="position-relative mx-3">
              <i className="bi bi-cart"></i>
              {totalArticle() > 0 && (
                <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                  {totalArticle()}
                </Badge>
              )}
            </Nav.Link>
          </Nav>

          {/* Bouton pour afficher le Offcanvas sur les petits écrans */}
          <Button variant="outline-primary" className="d-md-none" onClick={handleShowOffcanvas}>
            <i className="fas fa-bars"></i>
          </Button>

          {/* Offcanvas pour mobile */}
          <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} placement="end">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="d-flex flex-column">
                {isLoggedIn ? (
                  <NavDropdown title="Mon compte" id="offcanvas-nav-dropdown">
                    <NavDropdown.Item onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt"></i> Déconnexion
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <NavDropdown title="Bonjour, identifiez-vous" id="offcanvas-nav-dropdown">
                    <NavDropdown.Item href="/sign">
                      <i className="fas fa-user"></i> Se connecter
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/register">
                      <i className="fas fa-square"></i> Inscription
                    </NavDropdown.Item>
                  </NavDropdown>
                )}

                <Nav.Link href="/favoris" className="position-relative">
                  <i className="fas fa-heart"></i>
                  {totalFavorites() > 0 && (
                    <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                      {totalFavorites()}
                    </Badge>
                  )}
                </Nav.Link>

                <Nav.Link href="/panier" className="position-relative mx-3">
                  <i className="fas fa-shopping-cart"></i>
                  {totalArticle() > 0 && (
                    <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                      {totalArticle()}
                    </Badge>
                  )}
                </Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Offcanvas>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
