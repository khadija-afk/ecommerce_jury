import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import UncontrolledExample from '../../components/slider/Slider';
import ArticleListe from '../../features/article/ArticleList';
import FeatureLine from '../../components/FeautureLine';
//import Layout from '../components/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';


const Home = () => {
  return (


    <div>
   
        <Container>
        <Row>
          <Col>
            <UncontrolledExample />
            <FeatureLine />
          </Col>
        </Row>
        
        
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
