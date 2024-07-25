import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import UncontrolledExample from '../components/slider/Slider';
import ArticleListe from '../features/article/ArticleList';
//import Layout from '../components/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';


const Home = () => {
  return (


    <div>
   
        <Container>
        <h1>Welcome to KenziShop</h1>
        
        <Row>
          <Col>
            <UncontrolledExample />
          </Col>
        </Row>
        
        <h2 className="my-4">Our Products</h2>
        <Row>
          <Col>
            <ArticleListe />
          </Col>
        </Row>
      </Container>
    </div>
    
        
        
        
      
      

  
    
  );
}

export default Home;
