
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchArticles } from './articleSlice';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ArticleList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const articles = useSelector((state: RootState) => state.articles.articles);
    const articleStatus = useSelector((state: RootState) => state.articles.status);
    const error = useSelector((state: RootState) => state.articles.error);

    useEffect(() => {
        if (articleStatus === 'idle') {
            dispatch(fetchArticles());
        }
    }, [articleStatus, dispatch]);

    let content;

    if (articleStatus === 'loading') {
        content = <p>Loading...</p>;
    } else if (articleStatus === 'succeeded') {
        content = (
            <Container className="mt-4">
                <Row>
                    {articles.map(article => (
                        <Col key={article.id} sm={12} md={6} lg={4} className='mb-4'>
                            <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" src={article.photo} alt={article.name} />
                                <Card.Body>
                                    <Card.Text>{article.name} {article.brand} {article.content} </Card.Text>
                                    <Button variant="primary">
                                        <Link to={`api/article/${article.id}`} style={{ color: 'white', textDecoration: 'none' }}>
                                            Voir les détails
                                        </Link>
                                    </Button>
                               
                                    
                            
                                    
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        );
    } else if (articleStatus === 'failed') {
        content = <p>{error}</p>;
    }

    return (
        <section>
            <h2>Articles</h2>
            {content}
        </section>
    );
};

export default ArticleList;

