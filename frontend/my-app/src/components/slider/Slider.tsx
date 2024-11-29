// UncontrolledExample.tsx
import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import ExampleCarouselsImages from '../Images/ExampleCarouselsImages';
import './Slider.css';

function UncontrolledExample() {
  return (
    <div className="carousel-container">
      <Carousel fade>
        <Carousel.Item>
          <ExampleCarouselsImages imageUrl="https://images.pexels.com/photos/26731366/pexels-photo-26731366/free-photo-of-lunettes-de-soleil-femme-debout-elegance.jpeg?auto=compress&cs=tinysrgb&w=600" altText="First slide" />
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <ExampleCarouselsImages imageUrl="https://images.pexels.com/photos/247287/pexels-photo-247287.jpeg?auto=compress&cs=tinysrgb&w=600" altText="Second slide" />
          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <ExampleCarouselsImages imageUrl="https://images.pexels.com/photos/36469/woman-person-flowers-wreaths.jpg?auto=compress&cs=tinysrgb&w=600" altText="Third slide" />
          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default UncontrolledExample;
