import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { usePanier } from '../../utils/PanierContext';
import { RootState } from '../../types/Article';
import './DetailArticles.css';
import { getAverageRating } from '../../services/review/ReviewService';
import ReviewsList from '../../components/review/ReviewList';
import ReviewForm from '../../components/review/ReviewForm';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { fetchArticles } from './articleSlice';

const DetailArticle: React.FC = () => {
    const { addPanier } = usePanier();
    const dispatch = useDispatch();
    const { id } = useParams<{ id: string }>();
    const articleId = Number(id);

    const articles = useSelector((state: RootState) => state.articles.articles);
    const articleStatus = useSelector((state: RootState) => state.articles.status);
    const [ratings, setRatings] = useState<{ [key: number]: number }>({});
    const [mainPhoto, setMainPhoto] = useState<string | null>(null);
    const reviewsRef = useRef<HTMLDivElement>(null);

    const article = articles.find(article => article.id === articleId);

    useEffect(() => {
        if (articleStatus === 'idle') {
            dispatch(fetchArticles());
        }

        // Charger les notes moyennes pour chaque article
        articles.forEach(async (article) => {
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
    }, [articleStatus, dispatch, articles]);

    useEffect(() => {
        if (article && article.photo && article.photo.length > 0) {
            setMainPhoto(article.photo[0]);
        }
    }, [article]);

    const handleThumbnailClick = (photo: string) => {
        setMainPhoto(photo);
    };

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            if (rating >= i + 1) {
                stars.push(<FontAwesomeIcon icon={faStar} key={i} color="#ffc107" />);
            } else if (rating > i) {
                stars.push(<FontAwesomeIcon icon={faStarHalfAlt} key={i} color="#ffc107" />);
            } else {
                stars.push(<FontAwesomeIcon icon={faStar} key={i} color="#e4e5e9" />);
            }
        }
        return stars;
    };

    const scrollToReviews = () => {
        reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div>
    {article && mainPhoto && article.photo && (
        <section className="bloc__detail">
            <div className="photo-container">
                <div className="main-photo-container">
                    <img src={mainPhoto} alt={article.name} className="main-photo" />
                </div>
                <div className="thumbnails-container">
                    {article.photo.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            className="thumbnail"
                            onClick={() => handleThumbnailClick(img)}
                            alt={`${article.name} ${index}`}
                        />
                    ))}
                </div>
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
    )}

    {/* Séparateur entre les sections */}
    <div className="separator"></div>

    {/* Section des avis */}
    <section className="reviews-section" ref={reviewsRef}>
        {/* <h3>Avis</h3> */}
        <ReviewsList productId={articleId} />
        <ReviewForm productId={articleId} onReviewAdded={() => {}} />
    </section>
</div>

    );
};

export default DetailArticle;
