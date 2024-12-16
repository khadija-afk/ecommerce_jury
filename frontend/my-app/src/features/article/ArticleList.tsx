import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { fetchArticles } from "./articleSlice";
import { Card, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./ArticleListe.css";
import { getAverageRating, Review } from "../../services/review/ReviewService";
import { useFavoris } from "../../utils/FavorieContext";

export interface Article {
  id: number; // ID unique de l'article
  name: string;
  photo: string;
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
  

  //URL BACKEND
  const BASE_URL= import.meta.env.VITE_BASE_URL

  const isFavorite = (articleId: number): boolean => {
    return favorites.some((fav) => fav.id === articleId);
  };

  // Navigation vers les détails d'un article
  const handleNavigation = (article: Article) => {
    navigate(`/detailArticle/${article.id}`);
  };

  // Chargement initial des articles et des avis
  useEffect(() => {
    if (articleStatus === "idle") {
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

  // Gestion des favoris
  const handleFavoriteClick = (article: Article) => {
    if (isFavorite(article.id)) {
      removeFavorite(article.id);
    } else {
      addFavorite(article);
    }
  };

  // Contenu de la liste d'articles
  let content;

  if (articleStatus === "loading") {
    content = <p>Chargement...</p>;
  } else if (articleStatus === "succeeded") {
    content = (
      <Container className="mt-4">
  <Row className="custom-row">
    {articles.map((article) => (
      <Col key={article.id} sm={12} md={6} lg={4} className="mb-4">
        {/* Card contenant uniquement l'image */}
        <Card className="custom-card">
          <Card.Img
            variant="top"
            src={article.photo} // Utilise directement l'URL complète depuis `photo`
            alt={`Photo de ${article.name}`}
            className="custom-card-img"
          />
          <div
            className="favorite-icon"
            onClick={() => handleFavoriteClick(article)}
          >
            <span className={isFavorite(article.id) ? "red" : ""}>♥</span>
          </div>
        </Card>

        {/* Section en dehors de la carte pour les détails */}
        <div className="article-details text-center">
          <div className="article-rating">
            {Array(5)
              .fill(null)
              .map((_, i) => (
                <span
                  key={i}
                  className={i < (ratings[article.id] || 0) ? "star filled" : "star"}
                >
                  ★
                </span>
              ))}
            <span className="rating-count"> {reviews[article.id]?.length || 0}</span>
          </div>
          <h5 className="article-title">{article.name}</h5>
          <p className="article-price">{article.price} €</p>
                <button
                    onClick={() => handleNavigation(article)}
                    className="btn custom-button"
                  >
                    Voir les détails
                  </button>
        </div>
      </Col>
    ))}
  </Row>
</Container>

    


    );
  } else if (articleStatus === "failed") {
    content = <p>{error}</p>;
  }

  return <section>{content}</section>;
};

export default ArticleList;
