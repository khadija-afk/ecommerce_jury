import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Assurez-vous d'avoir installé les icônes Bootstrap
import './Header.css';

const Header = () => {
  return (
    <header >
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
              <NavDropdown title="Bonjour, identifiez-vous" id="basic-nav-dropdown">
                <NavDropdown.Item href="/sign"><i className='fas fa-user'></i> Se connecter</NavDropdown.Item>
                <NavDropdown.Item href="/register"><i className='fas fa-square'></i> Inscription</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="/panier"><i className='fas fa-shopping-cart'></i> Panier</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
