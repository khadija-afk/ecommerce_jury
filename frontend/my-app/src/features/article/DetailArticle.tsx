import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { usePanier } from "../../utils/PanierContext";
import { RootState, AppDispatch } from "../../store";
import "./DetailArticles.css";
import { getAverageRating } from "../../services/review/ReviewService";
import ReviewsList from "../../components/review/ReviewList";
import ReviewForm from "../../components/review/ReviewForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { fetchArticles } from "./articleSlice";

interface Article {
  id: number;
  name: string;
  content: string;
  price: number;
  photo: string;
}

const DetailArticle: React.FC = () => {
  const { addPanier } = usePanier();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const articleId = Number(id);

  const articles = useSelector((state: RootState) => state.articles.articles) as Article[];
  const articleStatus = useSelector((state: RootState) => state.articles.status);
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});
  const [mainPhoto, setMainPhoto] = useState<string>("default-image-url.jpg");
  const reviewsRef = useRef<HTMLDivElement>(null);

  const article = articles.find((a) => a.id === articleId);

  useEffect(() => {
    if (articleStatus === "idle") {
      dispatch(fetchArticles());
    }

    if (articles.length > 0) {
      const fetchRatings = async () => {
        const ratingsData: { [key: number]: number } = {};
        for (const a of articles) {
          try {
            const avgRating = await getAverageRating(a.id);
            ratingsData[a.id] = avgRating;
          } catch (error) {
            console.error(`Erreur pour l'article ${a.id}:`, error);
          }
        }
        setRatings(ratingsData);
      };
      fetchRatings();
    }
  }, [articleStatus, dispatch, articles]);

  useEffect(() => {
    if (article?.photo && Array.isArray(article.photo) && article.photo.length > 0) {
      setMainPhoto(article.photo[0]);
    }
  }, [article]);

  const handleThumbnailClick = (photo: string) => {
    setMainPhoto(photo);
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(null)
      .map((_, i) =>
        rating >= i + 1 ? (
          <FontAwesomeIcon icon={faStar} key={i} color="#ffc107" />
        ) : rating > i ? (
          <FontAwesomeIcon icon={faStarHalfAlt} key={i} color="#ffc107" />
        ) : (
          <FontAwesomeIcon icon={faStar} key={i} color="#e4e5e9" />
        )
      );
  };

  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      {article ? (
        <section className="bloc__detail">
          <div className="photo-container">
            <div className="main-photo-container">
            <img
                src={article.photo || "default-image.jpg"} // Image par défaut si aucune photo n'est disponible
                alt={article.name}
                className="main-photo"
              />
            </div>
            {/* <div className="thumbnails-container">
              {Array.isArray(article.photo) && article.photo.length > 0 ? (
                article.photo.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    className="thumbnail"
                    onClick={() => handleThumbnailClick(img)}
                    alt={`${article.name} ${index}`}
                  />
                ))
              ) : (
                <p>Aucune photo disponible</p>
              )}
            </div> */}
          </div>
          <div className="details-container">
            <h2>{article.name}</h2>
            {ratings[articleId] !== undefined && (
              <div className="rating-summary">
                {renderStars(ratings[articleId])}
                <span onClick={scrollToReviews} className="reviews-link" role="button">
                  Voir les avis
                </span>
              </div>
            )}
            <p className="price">{article.price} €</p>
            <p>{article.content}</p>
            <button onClick={() => addPanier(article)}>AJOUTER AU PANIER ({article.price} €)</button>
          </div>
        </section>
      ) : (
        <p>Chargement...</p>
      )}
      <div className="separator"></div>
      <section className="reviews-section" ref={reviewsRef}>
        <ReviewsList productId={articleId} />
        <ReviewForm productId={articleId} onReviewAdded={() => {}} />
      </section>
    </div>
  );
};

export default DetailArticle;
