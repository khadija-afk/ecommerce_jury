import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import ExampleCarouselsImages from '../Images/ExampleCarouselsImages';
import './Slider.css';

function UncontrolledExample() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Détecte si la largeur est mobile
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Vérification initiale

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="carousel-container"
      style={{
        marginLeft: isMobile ? '10px' : '100px',
        marginRight: isMobile ? '10px' : '100px',
      }}
    >
      <Carousel fade>
        {/* Premier slide */}
        <Carousel.Item>
          <ExampleCarouselsImages
            imageUrl="https://images.pexels.com/photos/458381/pexels-photo-458381.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            altText="First slide"
          />
          <Carousel.Caption>
            <h3>Découvrez la mode qui vous inspire</h3>
            <p>Exprimez votre féminité avec des styles qui subliment votre personnalité.</p>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Deuxième slide */}
        <Carousel.Item>
          <ExampleCarouselsImages
            imageUrl="https://images.pexels.com/photos/1038000/pexels-photo-1038000.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            altText="Second slide"
          />
          <Carousel.Caption>
            <h3>Élégance au quotidien</h3>
            <p>Explorez nos collections modernes pour une allure chic et intemporelle.</p>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Troisième slide */}
        <Carousel.Item>
          <ExampleCarouselsImages
            imageUrl="https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=600"
            altText="Third slide"
          />
          <Carousel.Caption>
            <h3>Confiance et style</h3>
            <p>Des tenues qui allient confort et sophistication pour toutes les occasions.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default UncontrolledExample;
