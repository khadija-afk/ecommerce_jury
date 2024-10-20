import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './ChaussPage.css';

const ChaussuresPage = () => {
  // Exemple de données pour les produits de la catégorie "Chaussures"
  const chaussures = [
    {
      id: 1,
      name: 'Sneakers tendance',
      price: 59.99,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      name: 'Chaussures de ville',
      price: 89.99,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 3,
      name: 'Sandales confort',
      price: 39.99,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 4,
      name: 'Bottes en cuir',
      price: 119.99,
      image: 'https://via.placeholder.com/150',
    },
    // Ajoutez d'autres produits ici
  ];

  return (
    <Container fluid className="chaussures-page">
      <h2 className="text-center my-4">Chaussures</h2>

      {/* Liste des chaussures en grille */}
      <Row className="product-grid">
        {chaussures.map((product) => (
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

export default ChaussuresPage;
