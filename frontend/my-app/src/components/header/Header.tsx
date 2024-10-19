import React, { useState, useEffect, useContext } from 'react';
import { Navbar, Nav, Container, NavDropdown, Form, FormControl, Button, Badge } from 'react-bootstrap';
import './Header.css';
import { PanierContext } from '../../utils/PanierContext';
import { useFavoris } from '../../utils/FavorieContext';
import { useNavigate } from 'react-router-dom'; // Utilisé pour rediriger vers la page de résultats
import axios from 'axios';

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // État pour le terme de recherche
  const { totalArticle } = useContext(PanierContext);
  const { totalFavorites } = useFavoris();
  const navigate = useNavigate(); // Utiliser `useNavigate` pour rediriger

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/api/user/check_auth', {
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
      const response = await fetch('/api/api/Log/logout', {
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

  // Gérer la soumission de la recherche
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêcher le rechargement de la page

    if (searchTerm.trim() === '') {
      return;
    }

    // Effectuer la requête à l'API de recherche
    try {
      const response = await axios.get(`api/api/search/search?query=${searchTerm}`);
      if (response.data.length === 0) {
        // Si aucun résultat n'est trouvé, rediriger vers la page "Aucun résultat trouvé"
        navigate('/no-results');
      } else {
        // Rediriger vers la page de résultats de recherche (si tu en as une)
        navigate(`/search?query=${searchTerm}`);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      navigate('/no-results'); // Rediriger vers la page d'erreur en cas de problème
    }
  };

  return (
    <header>
      <Navbar expand="lg" bg="white" variant="light" collapseOnSelect>
        <Container fluid>
          <Navbar.Brand href="/">KenziShop</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto w-100">
              <Form className="d-flex mx-auto my-2 my-lg-0 w-100" onSubmit={handleSearch}>
                <FormControl
                  type="search"
                  placeholder="Rechercher"
                  className="mr-2 w-100"
                  aria-label="Search"
                  value={searchTerm} // Liaison avec l'état
                  onChange={(e) => setSearchTerm(e.target.value)} // Mettre à jour le terme de recherche
                />
                <Button variant="outline-success" type="submit" className="ml-2">
                  Search
                </Button>
              </Form>
            </Nav>
            <Nav className="d-flex align-items-center">
              {isLoggedIn ? (
                <NavDropdown title="Bonjour, utilisateur" id="basic-nav-dropdown">
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
                <i className="fas fa-heart"></i>
                {totalFavorites() > 0 && (
                  <Badge bg="danger" pill className="badge">
                    {totalFavorites()}
                  </Badge>
                )}
              </Nav.Link>

              <Nav.Link href="/panier" className="position-relative">
                <i className="fas fa-shopping-cart"></i>
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
