import React, { useState, useEffect, useContext, useRef } from 'react';
import { Navbar, Nav, Container, Form, FormControl, Button, Badge, NavDropdown, Offcanvas } from 'react-bootstrap';
import './Header.css';
import { PanierContext } from '../../utils/PanierContext';
import { useFavoris } from '../../utils/FavorieContext';
import { useNavigate } from 'react-router-dom';

// Import FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHeart, faShoppingCart, faBars, faSearch, faSignOutAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';

import apiClient from '../../utils/axiosConfig';

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userFirstName, setUserFirstName] = useState('');
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
          credentials: 'include',
        });

        if (response.ok) {
          const userData = await response.json(); // Supposons que le backend renvoie l'utilisateur connecté
          setIsLoggedIn(true);
          setUserFirstName(userData.firstName); // Assurez-vous que le prénom est inclus dans la réponse
        } else {
          setIsLoggedIn(false);
          setUserFirstName('');
        }
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
        credentials: 'include',
      });

      if (response.ok) {
        setIsLoggedIn(false);
        setUserFirstName('');
        navigate('/sign');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <Navbar expand="lg" bg="white" variant="light" className="py-3 navbar-custom">
        <Container fluid>
          <div>
            <Navbar.Brand href="/">KenziShop</Navbar.Brand>
          </div>
          <div className="d-flex align-items-center w-50">
            <Form className="d-flex mx-auto search-center w-" onSubmit={handleSearch} ref={searchRef}>
              <FormControl
                type="search"
                placeholder="Rechercher"
                className="search-bar"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Button variant="outline-primary" type="submit">
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            </Form>
          </div>

          <Nav className="d-none d-md-flex align-items-center">
            {isLoggedIn ? (
              <NavDropdown title={`Salut, ${userFirstName}`} id="basic-nav-dropdown">
                 <NavDropdown.Item href="/profil">
                      <FontAwesomeIcon icon={faUserCircle} /> Mon compte
                  </NavDropdown.Item>
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
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
