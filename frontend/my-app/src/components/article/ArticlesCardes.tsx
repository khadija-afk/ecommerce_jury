import React from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';

const cardsData = [
  {
    id: 1,
    image: 'path/to/image.jpg',
    title: 'Card Title 1',
    text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
  },
  {
    id: 2,
    image: 'path/to/image.jpg',
    title: 'Card Title 2',
    text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
  },
  {
    id: 3,
    image: 'path/to/image.jpg',
    title: 'Card Title 3',
    text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
  },
  {
    id: 4,
    image: 'path/to/image.jpg',
    title: 'Card Title 3',
    text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
  },
  {
    id: 5,
    image: 'path/to/image.jpg',
    title: 'Card Title 3',
    text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
  },
  {
    id: 6,
    image: 'path/to/image.jpg',
    title: 'Card Title 3',
    text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
  },
  {
    id: 7,
    image: 'path/to/image.jpg',
    title: 'Card Title 3',
    text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
  },
  {
    id: 8,
    image: 'path/to/image.jpg',
    title: 'Card Title 3',
    text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
  },
  {
    id: 9,
    image: 'path/to/image.jpg',
    title: 'Card Title 3',
    text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
  },
  {
    id: 10,
    image: 'path/to/image.jpg',
    title: 'Card Title 3',
    text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
  },
  {
    id: 11,
    image: 'path/to/image.jpg',
    title: 'Card Title 3',
    text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
  },
  {
    id: 12,
    image: 'path/to/image.jpg',
    title: 'Card Title 3',
    text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
  },
  {
    id: 13,
    image: 'path/to/image.jpg',
    title: 'Card Title 3',
    text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
  },
  {
    id: 14,
    image: 'path/to/image.jpg',
    title: 'Card Title 3',
    text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
  },
  {
    id: 15,
    image: 'path/to/image.jpg',
    title: 'Card Title 3',
    text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
  },
  {
    id: 16,
    image: 'path/to/image.jpg',
    title: 'Card Title 3',
    text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
  },
  
  

  
  
  
 
];

function CardComponent() {
  return (
    <Container className="mt-4">
      <Row>
        {cardsData.map(card => (
          <Col key={card.id} sm={12} md={6} lg={4}>
            <Card style={{ width: '18rem' }}>
              <Card.Img variant="top" src={card.image} />
              <Card.Body>
                <Card.Title>{card.title}</Card.Title>
                <Card.Text>{card.text}</Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default CardComponent;
