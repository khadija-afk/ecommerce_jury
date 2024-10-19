import React, { useState, useEffect, useContext, useRef } from 'react';
import { Navbar, Nav, Container, NavDropdown, Form, FormControl, Button, Badge, ListGroup } from 'react-bootstrap';
import './Header.css';
import { PanierContext } from '../../utils/PanierContext';
import { useFavoris } from '../../utils/FavorieContext';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../utils/axiosConfig';

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [suggestions, setSuggestions] = useState([]); 
  const [showSuggestions, setShowSuggestions] = useState(false); 
  const { totalArticle } = useContext(PanierContext);
  const { totalFavorites } = useFavoris();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null); // Référence pour la barre de recherche

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
        setIsLoggedIn(false);
        window.location.href = '/sign';
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    if (searchTerm.trim() !== '') {
      try {
        const response = await apiClient.get(`/api/api/search/search?query=${searchTerm}`);
        setSuggestions(response.data); 
        setShowSuggestions(true); 
      } catch (error) {
        console.error('Erreur lors de la récupération des suggestions:', error);
      }
    } else {
      setShowSuggestions(false); 
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion); 
    setShowSuggestions(false); 
    navigate(`/search?query=${suggestion}`);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault(); 

    if (searchTerm.trim() === '') {
      return;
    }

    try {
      const response = await apiClient.get(`/api/api/search/search?query=${searchTerm}`);
      if (response.data.length === 0) {
        navigate('/no-results');
      } else {
        navigate(`/search?query=${searchTerm}`);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      navigate('/no-results');
    }
  };

  // Gestion du clic en dehors de la barre de recherche pour fermer les suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false); // Fermer les suggestions
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchRef]);

  return (
    <header>
      <Navbar expand="lg" bg="white" variant="light" collapseOnSelect>
        <Container fluid>
          <Navbar.Brand href="/">KenziShop</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto w-100">
              <Form className="d-flex mx-auto my-2 my-lg-0 w-100" onSubmit={handleSearch} ref={searchRef}>
                <FormControl
                  type="search"
                  placeholder="Rechercher"
                  className="mr-2 w-100"
                  aria-label="Search"
                  value={searchTerm}
                  onChange={handleSearchChange} 
                />
                <Button variant="outline-success" type="submit" className="ml-2">
                  Search
                </Button>
              </Form>

              {/* Affichage des suggestions */}
              {showSuggestions && (
                <ListGroup className="suggestions-list">
                  {suggestions.map((suggestion) => (
                    <ListGroup.Item
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion.name)}
                      style={{ cursor: 'pointer' }}
                    >
                      {suggestion.name}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
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
