import React, { useState, useEffect, useContext } from 'react';
import { Navbar, Nav, Container, NavDropdown, Form, FormControl, Button, Badge } from 'react-bootstrap';
import './Header.css';
import { PanierContext } from '../../utils/PanierContext';
import { useFavoris } from '../../utils/FavorieContext';

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { totalArticle } = useContext(PanierContext);
  const { totalFavorites } = useFavoris();

  useEffect(() => {
    console.log('Total favorites:', totalFavorites());
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('http://localhost:9090/api/user/check_auth', {
          method: 'GET',
          credentials: 'include' 
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
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        setIsLoggedIn(false);
        window.location.href = '/sign';
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

              <Nav.Link href="/favoris" className="position-relative">
                <i className='fas fa-heart'></i> {/* Icône de favoris */}
                {totalFavorites() > 0 && (
                  <Badge bg="danger" pill className="badge">
                    {totalFavorites()}
                  </Badge>
                )}
              </Nav.Link>

              <Nav.Link href="/panier" className="position-relative">
                <i className='fas fa-shopping-cart'></i>
                {totalArticle() > 0 && (
                  <Badge bg="danger" pill className="badge">
                    {totalArticle()}
                  </Badge>
                )}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
