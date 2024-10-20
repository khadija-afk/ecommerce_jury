import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './VetPage.css';

const VetementsPage = () => {
  // Exemple de données pour les produits de la catégorie "Vêtements"
  const vetements = [
    {
      id: 1,
      name: 'T-shirt classique',
      price: 19.99,
    },
    {
      id: 2,
      name: 'Jeans slim',
      price: 49.99,
    },
    {
      id: 3,
      name: 'Blouson en cuir',
      price: 89.99,
    },
    {
      id: 4,
      name: 'Robe d’été',
      price: 39.99,
    },
    // Ajoutez d'autres produits ici
  ];

  return (
    <Container fluid className="vetements-page">
      <h2 className="text-center my-4">Vêtements</h2>

      {/* Liste des vêtements en grille */}
      <Row className="product-grid">
        {vetements.map((product) => (
          <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card>
              <Card.Img variant="top" src={product.image} />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>
                  Prix: {product.price.toFixed(2)} €
                </Card.Text>
                <Button variant="primary">Ajouter au panier</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default VetementsPage;
