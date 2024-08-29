import React, { useState, useEffect, useContext } from 'react';
import { Navbar, Nav, Container, NavDropdown, Form, FormControl, Button, Badge } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Assurez-vous d'avoir installé les icônes Bootstrap
import './Header.css';
import { PanierContext } from '../../utils/PanierContext'; // Importation du contexte

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { totalArticle } = useContext(PanierContext); // Utilisation du contexte pour obtenir le nombre total d'articles

  useEffect(() => {
    // Fonction pour vérifier si l'utilisateur est connecté
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('http://localhost:3000/check_auth', {
          method: 'GET',
          credentials: 'include' // Inclure les cookies pour la requête
        });

        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:9090/api/Log/logout', {
        method: 'POST',
        credentials: 'include' // Inclure les cookies pour la requête
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message); // Affiche "Logout successful"
        setIsLoggedIn(false); // Met à jour l'état de connexion
        window.location.href = '/sign'; // Redirection vers la page de connexion
      } else {
        const error = await response.json();
        console.error('Logout error:', error.message);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <header>
      <Navbar expand="lg" bg='white' variant='white' collapseOnSelect>
        <Container>
          <Navbar.Brand href="/">KenziShop</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Form className="d-flex mx-auto my-2 my-lg-0">
                <FormControl
                  type="search"
                  placeholder="Search"
                  className="mr-2"
                  aria-label="Search"
                />
                <Button variant="outline-success">Search</Button>
              </Form>
            </Nav>
            <Nav>
              {isLoggedIn ? (
                <>
                  <NavDropdown title="Bonjour, utilisateur" id="basic-nav-dropdown">
                    <NavDropdown.Item onClick={handleLogout}>
                      <i className='fas fa-sign-out-alt'></i> Déconnexion
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <NavDropdown title="Bonjour, identifiez-vous" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/sign">
                    <i className='fas fa-user'></i> Se connecter
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/register">
                    <i className='fas fa-square'></i> Inscription
                  </NavDropdown.Item>
                </NavDropdown>
              )}
              <Nav.Link href="/panier">
                <i className='fas fa-shopping-cart'></i>
                {totalArticle() > 0 && (
                  <Badge bg="danger" pill className="ms-2">
                    {totalArticle()}
                  </Badge>
                )}
                {/* Panier */}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
