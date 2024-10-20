import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './AccPage.css';

const AccessoiresPage = () => {
  // Exemple de données pour les produits d'accessoires
  const accessoires = [
    {
      id: 1,
      name: 'Montre en cuir',
      price: 79.99,
    },
    {
      id: 2,
      name: 'Sac à main en cuir',
      price: 129.99,
    },
    {
      id: 3,
      name: 'Chapeau de paille',
      price: 34.99,
    },
    {
      id: 4,
      name: 'Lunettes de soleil',
      price: 59.99,
    },
    // Ajoutez d'autres produits ici
  ];

  return (
    <Container fluid className="accessoires-page">
      <h2 className="text-center my-4">Accessoires</h2>

      {/* Liste des accessoires en grille */}
      <Row className="product-grid">
        {accessoires.map((product) => (
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

export default AccessoiresPage;
