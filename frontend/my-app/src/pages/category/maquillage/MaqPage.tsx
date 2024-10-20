import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './MaqPage.css';

const MaquillagePage = () => {
  // Exemple de données pour les produits de maquillage
  const maquillages = [
    {
      id: 1,
      name: 'Rouge à lèvres mat',
      price: 14.99,
    },
    {
      id: 2,
      name: 'Palette d’ombres à paupières',
      price: 29.99,
    },
    {
      id: 3,
      name: 'Fond de teint liquide',
      price: 24.99,
    },
    {
      id: 4,
      name: 'Mascara volume intense',
      price: 19.99,
    },
    // Ajoutez d'autres produits ici
  ];

  return (
    <Container fluid className="maquillage-page">
      <h2 className="text-center my-4">Maquillage</h2>

      {/* Liste des maquillages en grille */}
      <Row className="product-grid">
        {maquillages.map((product) => (
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

export default MaquillagePage;
