import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchArticles } from './articleSlice';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './ArticleListe.css';
import { getAverageRating, Review } from '../../services/review/ReviewService';

const ArticleList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const articles = useSelector((state: RootState) => state.articles.articles);
    const articleStatus = useSelector((state: RootState) => state.articles.status);
    const error = useSelector((state: RootState) => state.articles.error);

    const [ratings, setRatings] = useState<{ [key: number]: number }>({});
    const [reviews, setReviews] = useState<{ [key: number]: Review[] }>({});
    const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});

    useEffect(() => {
        if (articleStatus === 'idle') {
            dispatch(fetchArticles());
        }

        articles.forEach(async (article) => {
            try {
                const avgRating = await getAverageRating(article.id);
                setRatings((prevRatings) => ({
                    ...prevRatings,
                    [article.id]: avgRating,
                }));
            } catch (error) {
                console.error(`Error fetching data for article ${article.id}:`, error);
            }
        });
    }, [articleStatus, dispatch, articles]);

    const handleFavoriteClick = (articleId: number) => {
        setFavorites((prevFavorites) => ({
            ...prevFavorites,
            [articleId]: !prevFavorites[articleId], // Toggle the favorite status
        }));
    };

    let content;

    if (articleStatus === 'loading') {
        content = <p>Loading...</p>;
    } else if (articleStatus === 'succeeded') {
        content = (
            <Container className="mt-4">
                <Row className="custom-row">
                    {articles.map((article, index) => (
                        <Col key={`${article.id}-${index}`} sm={12} md={6} lg={4} className='mb-4'>
                            <Card className="custom-card">
                                <div className="favorite-icon" onClick={() => handleFavoriteClick(article.id)}>
                                    <span className={favorites[article.id] ? 'red' : ''}>♥</span>
                                </div>
                                {Array.isArray(article.photo) && article.photo.length > 0 ? (
                                    <Link to={`api/article/${article.id}`}>
                                        <Card.Img
                                            variant="top"
                                            src={article.photo[0]}
                                            alt={`Photo de ${article.name}`}
                                            className="custom-card-img"
                                        />
                                    </Link>
                                ) : (
                                    <Card.Img variant="top" src="default-image-url.jpg" alt="Default Image" />
                                )}
                                <Card.Body className="custom-card-body">
                                    <Card.Text className="custom-card-text">
                                        Voir les détails
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                            <div className="article-info">
                                <h5>{article.name}</h5>
                                <p>{article.content}</p>
                                <p className="article-price">Prix : {article.price} €</p>
                                <div className="article-rating">
                                    {Array(5).fill(null).map((_, i) => (
                                        <span key={i} className={i < (ratings[article.id] || 0) ? "star filled" : "star"}>
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <div className="article-reviews">
                                    {reviews[article.id]?.map((review) => (
                                        <div key={review.id}>
                                            <strong>Note: {review.rating}</strong>
                                            <p>{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
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
