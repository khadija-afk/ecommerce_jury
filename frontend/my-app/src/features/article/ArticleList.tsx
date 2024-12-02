import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchArticles } from './articleSlice';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './ArticleListe.css';
import { getAverageRating, Review } from '../../services/review/ReviewService';
import { useFavoris } from '../../utils/FavorieContext';

export interface Article {
    id: number; // ID unique de l'article
    name: string;
    photo: string[];
    price: number;
    content: string; // Description obligatoire
    createdAt?: string; // Optionnel si ce champ n'est pas toujours présent
  }

const ArticleList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const articles = useSelector((state: RootState) => state.articles.articles) as Article[];
    const articleStatus = useSelector((state: RootState) => state.articles.status);
    const error = useSelector((state: RootState) => state.articles.error);
    const navigate = useNavigate();

    const { favorites, addFavorite, removeFavorite } = useFavoris();

    const [ratings, setRatings] = useState<{ [key: number]: number }>({});
    const [reviews, setReviews] = useState<{ [key: number]: Review[] }>({});

    const isFavorite = (articleId: number): boolean => {
        return favorites.some((fav) => fav.id === articleId);
    };

    const handleNavigation = (article: Article) => {
        navigate(`/detailArticle/${article.id}`);
    };

    useEffect(() => {
        if (articleStatus === 'idle') {
            dispatch(fetchArticles());
        }

        const fetchRatingsAndReviews = async () => {
            for (const article of articles) {
                try {
                    const avgRating = await getAverageRating(article.id);
                    setRatings((prevRatings) => ({
                        ...prevRatings,
                        [article.id]: avgRating,
                    }));
                } catch (error) {
                    console.error(`Error fetching data for article ${article.id}:`, error);
                }
            }
        };

        if (articles.length > 0) {
            fetchRatingsAndReviews();
        }
    }, [articleStatus, dispatch, articles]);

    const handleFavoriteClick = (article: Article) => {
        if (isFavorite(article.id)) {
            removeFavorite(article.id);
        } else {
            addFavorite(article);
        }
    };

    let content;

    if (articleStatus === 'loading') {
        content = <p>Loading...</p>;
    } else if (articleStatus === 'succeeded') {
        content = (
            <Container className="mt-4">
                <Row className="custom-row">
                    {articles.map((article) => (
                        <Col key={article.id} sm={12} md={6} lg={4} className="mb-4">
                            <Card className="custom-card">
                                <div className="favorite-icon" onClick={() => handleFavoriteClick(article)}>
                                    <span className={isFavorite(article.id) ? 'red' : ''}>♥</span>
                                </div>
                                {Array.isArray(article.photo) && article.photo.length > 0 ? (
                                   <div onClick={() => handleNavigation(article)} style={{ cursor: "pointer" }}>
                                   <Card.Img
                                       variant="top"
                                       src={article.photo[0]}
                                       alt={`Photo de ${article.name}`}
                                       className="custom-card-img"
                                   />
                               </div>
                                ) : (
                                    <Card.Img
                                        variant="top"
                                        src={typeof article.photo === 'string' ? article.photo : 'default-image-url.jpg'}
                                        alt="Default Image"
                                    />
                                )}
                                <Card.Body className="custom-card-body">
                                    <Card.Text className="custom-card-text">Voir les détails</Card.Text>
                                </Card.Body>
                            </Card>
                            <div className="article-info">
                                <h5>{article.name}</h5>
                                <p>{article.content}</p>
                                <p className="article-price">Prix : {article.price} €</p>
                                <div className="article-rating">
                                    {Array(5)
                                        .fill(null)
                                        .map((_, i) => (
                                            <span
                                                key={i}
                                                className={i < (ratings[article.id] || 0) ? 'star filled' : 'star'}
                                            >
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

    return <section>{content}</section>;
};

export default ArticleList;
