import React, { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Badge,
  NavDropdown,
  Offcanvas,
  Form,
  FormControl,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { usePanier } from "../../utils/PanierContext";
import { useFavoris } from "../../utils/FavorieContext";
import { useAuth } from "../../utils/AuthCantext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUser,
  faHeart,
  faShoppingCart,
  faSearch,
  faSignOutAlt,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import MiniNavbar from "../miniNav/MiniNavbare";
import ProfileNavBar from "../profil/profilNavbare"; // Import du ProfileNavBar
import "./Header.css";

const Header: React.FC = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [userFirstName, setUserFirstName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { totalArticle } = usePanier();
  const { totalFavorites } = useFavoris();
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showSearchOffcanvas, setShowSearchOffcanvas] = useState(false); // Offcanvas de recherche
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("/api/api/user/check_auth", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const responseData = await response.json();
          if (responseData && responseData.id && responseData.firstName) {
            setIsAuthenticated(true);
            setUserFirstName(responseData.firstName);
          } else {
            setIsAuthenticated(false);
            setUserFirstName("");
          }
        } else {
          setIsAuthenticated(false);
          setUserFirstName("");
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification :", error);
        setIsAuthenticated(false);
        setUserFirstName("");
      }
    };

    checkAuthStatus();
  }, [setIsAuthenticated, isAuthenticated]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/search?query=${searchTerm}`);
      setShowSearchOffcanvas(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/api/Log/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setIsAuthenticated(false);
        setUserFirstName("");
        setShowOffcanvas(false);
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  const handleNavLinkClick = (path: string) => {
    navigate(path);
    setShowOffcanvas(false);
    setShowSearchOffcanvas(false);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu((prev) => !prev);
  };

  return (
    <header>
      <Navbar expand="lg" bg="white" variant="light" className="py-3 navbar-custom">
        <Container fluid>
          <Navbar.Brand href="/">KenziShop</Navbar.Brand>

          <Form className="d-none d-lg-flex mx-auto search-center" onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Rechercher"
              className="search-bar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-primary" type="submit">
              <FontAwesomeIcon icon={faSearch} />
            </Button>
          </Form>


          {/* Icône de recherche pour petits écrans */}
          <Button
            variant="outline-secondary"
            className="d-lg-none mx-auto"
            onClick={() => setShowSearchOffcanvas(true)}
          >
            <FontAwesomeIcon icon={faSearch} />
          </Button>

          {/* Icône de menu pour petits écrans */}
          <Button
            variant="outline-secondary"
            className="d-lg-none ms-auto"
            onClick={() => setShowOffcanvas(true)}
          >
            <FontAwesomeIcon icon={faBars} />
          </Button>

          {/* Barre de navigation pour grands écrans */}
          <Nav className="d-none d-lg-flex align-items-center ms-auto">
            <Nav.Link href="/favoris" className="position-relative me-3">
              <FontAwesomeIcon icon={faHeart} />
              {totalFavorites() > 0 && (
                <Badge bg="danger" pill className="icon-badge">
                  {totalFavorites()}
                </Badge>
              )}
            </Nav.Link>

            <Nav.Link href="/panier" className="position-relative me-3">
              <FontAwesomeIcon icon={faShoppingCart} />
              {totalArticle > 0 && (
                <Badge bg="danger" pill className="icon-badge">
                  {totalArticle}
                </Badge>
              )}
            </Nav.Link>

            {isAuthenticated ? (
                  <NavDropdown title={`Salut, ${userFirstName}`} id="user-dropdown">
                    <NavDropdown.Item onClick={() => handleNavLinkClick("/profil")}>
                      <FontAwesomeIcon icon={faUserCircle} className="me-2" />
                      Mon compte
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={handleLogout}>
                      <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                      Déconnexion
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <NavDropdown title="Compte" id="user-dropdown">
                    <NavDropdown.Item onClick={() => handleNavLinkClick("/sign")}>
                      <FontAwesomeIcon icon={faUser} className="me-2" />
                      Se connecter
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => handleNavLinkClick("/register")}>
                      <FontAwesomeIcon icon={faUser} className="me-2" />
                      Inscription
                    </NavDropdown.Item>
                  </NavDropdown>
                )}

          </Nav>
        </Container>
      </Navbar>

      {/* Offcanvas Menu Principal */}
      <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="d-flex flex-column align-items-start">
            <Nav.Link onClick={() => handleNavLinkClick("/favoris")} className="position-relative mb-2">
              <FontAwesomeIcon icon={faHeart} className="me-2" />
              Favoris
              {totalFavorites() > 0 && (
                <Badge bg="danger" pill className="icon-badge ms-2">
                  {totalFavorites()}
                </Badge>
              )}
            </Nav.Link>

            <Nav.Link onClick={() => handleNavLinkClick("/panier")} className="position-relative mb-2">
              <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
              Panier
              {totalArticle > 0 && (
                <Badge bg="danger" pill className="icon-badge ms-2">
                  {totalArticle}
                </Badge>
              )}
            </Nav.Link>

            {isAuthenticated ? (
              <>
                <Nav.Link onClick={toggleProfileMenu} className="mb-2">
                  <FontAwesomeIcon icon={faUserCircle} className="me-2" />
                  Mon compte
                </Nav.Link>
                <Nav.Link onClick={handleLogout} className="mb-2">
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                  Déconnexion
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link onClick={() => handleNavLinkClick("/sign")} className="mb-2">
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  Se connecter
                </Nav.Link>
                <Nav.Link onClick={() => handleNavLinkClick("/register")} className="mb-2">
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  Inscription
                </Nav.Link>
              </>
            )}
          </Nav>

          {showProfileMenu && <ProfileNavBar handleNavLinkClick={handleNavLinkClick} />}
          <MiniNavbar handleNavLinkClick={handleNavLinkClick} />
        </Offcanvas.Body>
      </Offcanvas>

      {/* Offcanvas Recherche */}
      <Offcanvas show={showSearchOffcanvas} onHide={() => setShowSearchOffcanvas(false)} placement="top">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Rechercher</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form className="d-flex mb-3" onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Rechercher"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="me-2"
            />
            <Button variant="primary" type="submit">
              Rechercher
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </header>
  );
};

export default Header;
