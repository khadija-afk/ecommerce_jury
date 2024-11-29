import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import UncontrolledExample from '../../components/slider/Slider';
import ArticleListe from '../../features/article/ArticleList';
import FeatureLine from '../../components/FeautureLine';

import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

const Home = () => {
  return (
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
  );
}

export default Home;
