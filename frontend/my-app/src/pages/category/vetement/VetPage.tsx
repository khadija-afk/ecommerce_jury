import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import apiClient from '../../../utils/axiosConfig';
import { useFavoris } from '../../../utils/FavorieContext';
import '../../../features/article/ArticleListe.css'; // Réutilise les styles de la page d'articles
import { getAverageRating, Review } from '../../../services/review/ReviewService';

const VetementsPage = () => {
  // État pour stocker les articles récupérés de l'API
  const [vetements, setVetements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<{ [key: number]: Review[] }>({});
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});

  const { favorites, addFavorite, removeFavorite } = useFavoris(); // Utilisation des favoris

  // Utiliser useEffect pour récupérer les articles de l'API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await apiClient.get('api/api/article/category/1');

        if (response.headers['content-type'] && response.headers['content-type'].includes('application/json')) {
          setVetements(response.data);  // Met à jour l'état avec les articles
        } else {
          throw new Error('Réponse inattendue: la réponse n\'est pas au format JSON.');
        }

        setLoading(false); // Met à jour l'état de chargement
      } catch (err) {
        console.error('Erreur lors de la récupération des articles:', err);
        setError('Erreur lors de la récupération des articles');
        setLoading(false);
      }
    };

    fetchArticles();  // Appeler la fonction pour récupérer les articles
  }, []);

  // Utiliser useEffect pour récupérer les évaluations et les reviews
  useEffect(() => {
    vetements.forEach(async (article: any) => {
      try {
        const avgRating = await getAverageRating(article.id);
        setRatings((prevRatings) => ({
          ...prevRatings,
          [article.id]: avgRating,
        }));
      } catch (error) {
        console.error(`Erreur lors de la récupération des données pour l'article ${article.id}:`, error);
      }
    });
  }, [vetements]);

  // Gérer le cas de chargement
  if (loading) {
    return <p>Chargement des articles...</p>;
  }

  // Gérer le cas d'erreur
  if (error) {
    return <p>{error}</p>;
  }

  const handleFavoriteClick = (article: any) => {
    if (favorites.some(fav => fav.id === article.id)) {
      removeFavorite(article.id);
    } else {
      addFavorite(article); // Ajoute l'objet article complet aux favoris
    }
  };

  return (
    <Container className="mt-4">
      <Row className="custom-row">
        {vetements.map((article: any, index) => (
          <Col key={`${article.id}-${index}`} sm={12} md={6} lg={4} className='mb-4'>
            <Card className="custom-card">
              <div className="favorite-icon" onClick={() => handleFavoriteClick(article)}>
                <span className={favorites.some(fav => fav.id === article.id) ? 'red' : ''}>♥</span>
              </div>
              {Array.isArray(article.photo) && article.photo.length > 0 ? (
                <Link to={`/article/${article.id}`}>
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
};

export default VetementsPage;
