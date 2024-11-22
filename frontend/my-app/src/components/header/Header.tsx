import React, { useState, useEffect, useContext, useRef } from 'react';
import { Navbar, Nav, Container, Form, FormControl, Button, Badge, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { usePanier } from '../../utils/PanierContext';
import { useFavoris } from '../../utils/FavorieContext';
import { useAuth } from '../../utils/AuthCantext'; // Import du AuthContext
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHeart, faShoppingCart, faSearch, faSignOutAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header: React.FC = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [userFirstName, setUserFirstName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { totalArticle } = usePanier(); // Utilisation du hook personnalisé pour extraire les données
  const { totalFavorites } = useFavoris();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  // Vérification de l'authentification
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/api/user/check_auth', {
          method: 'GET',
          credentials: 'include', // Inclure les cookies HttpOnly
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log('Données utilisateur reçues :', responseData);

          if (responseData && responseData.id && responseData.firstName) {
            setIsAuthenticated(true);
            setUserFirstName(responseData.firstName);
          } else {
            setIsAuthenticated(false);
            setUserFirstName('');
          }
        } else {
          setIsAuthenticated(false);
          setUserFirstName('');
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification :', error);
        setIsAuthenticated(false);
        setUserFirstName('');
      }
    };

    checkAuthStatus();
  }, [setIsAuthenticated]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/api/Log/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setIsAuthenticated(false);
        setUserFirstName('');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
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
          <Navbar.Brand href="/">KenziShop</Navbar.Brand>

          <div className="d-flex align-items-center w-50">
            <Form className="d-flex mx-auto search-center" onSubmit={handleSearch} ref={searchRef}>
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
            {isAuthenticated ? (
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
                <Badge  bg="danger"
                pill
                style={{
                  minWidth: '24px',
                  minHeight: '24px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                }}
                className="position-absolute top-0 start-100 translate-middle"
              >
                  {totalFavorites()}
                </Badge>
              )}
            </Nav.Link>

            <Nav.Link href="/panier" className="position-relative mx-3">
              <FontAwesomeIcon icon={faShoppingCart} />
              {totalArticle > 0 && (
                <Badge bg="danger"
                pill
                style={{
                  minWidth: '24px',
                  minHeight: '24px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                }}
                className="position-absolute top-0 start-100 translate-middle"
              >
                  {totalArticle}
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
