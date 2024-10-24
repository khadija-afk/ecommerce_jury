import React, { useState, useEffect, useContext, useRef } from 'react';
import { Navbar, Nav, Container, Form, FormControl, Button, Badge, NavDropdown, Offcanvas } from 'react-bootstrap';
import './Header.css';
import { PanierContext } from '../../utils/PanierContext';
import { useFavoris } from '../../utils/FavorieContext';
import { useNavigate } from 'react-router-dom';

// Import FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHeart, faShoppingCart, faBars, faSearch, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import apiClient from '../../utils/axiosConfig';

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { totalArticle } = useContext(PanierContext);
  const { totalFavorites } = useFavoris();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

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
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            </Form>
          </div>

          <Nav className="ms-auto d-none d-md-flex align-items-center">
            {isLoggedIn ? (
              <NavDropdown title="Mon compte" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} /> Déconnexion
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown title="Bonjour, identifiez-vous" id="basic-nav-dropdown">
                <NavDropdown.Item href="/sign">
                  <FontAwesomeIcon icon={faUser} /> Se connecter
                </NavDropdown.Item>
                <NavDropdown.Item href="/register">
                  <FontAwesomeIcon icon={faUser} /> Inscription
                </NavDropdown.Item>
              </NavDropdown>
            )}

            <Nav.Link href="/favoris" className="position-relative">
              <FontAwesomeIcon icon={faHeart} />
              {totalFavorites() > 0 && (
                <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                  {totalFavorites()}
                </Badge>
              )}
            </Nav.Link>

            <Nav.Link href="/panier" className="position-relative mx-3">
              <FontAwesomeIcon icon={faShoppingCart} />
              {totalArticle() > 0 && (
                <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                  {totalArticle()}
                </Badge>
              )}
            </Nav.Link>
          </Nav>

          <Button variant="outline-primary" className="d-md-none" onClick={handleShowOffcanvas}>
            <FontAwesomeIcon icon={faBars} />
          </Button>

          <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} placement="end">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="d-flex flex-column">
                {isLoggedIn ? (
                  <NavDropdown title="Mon compte" id="offcanvas-nav-dropdown">
                    <NavDropdown.Item onClick={handleLogout}>
                      <FontAwesomeIcon icon={faSignOutAlt} /> Déconnexion
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <NavDropdown title="Bonjour, identifiez-vous" id="offcanvas-nav-dropdown">
                    <NavDropdown.Item href="/sign">
                      <FontAwesomeIcon icon={faUser} /> Se connecter
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/register">
                      <FontAwesomeIcon icon={faUser} /> Inscription
                    </NavDropdown.Item>
                  </NavDropdown>
                )}

                <Nav.Link href="/favoris" className="position-relative">
                  <FontAwesomeIcon icon={faHeart} />
                  {totalFavorites() > 0 && (
                    <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                      {totalFavorites()}
                    </Badge>
                  )}
                </Nav.Link>

                <Nav.Link href="/panier" className="position-relative mx-3">
                  <FontAwesomeIcon icon={faShoppingCart} />
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
