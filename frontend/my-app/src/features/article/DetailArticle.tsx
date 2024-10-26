import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { usePanier } from '../../utils/PanierContext';
import { RootState, Article } from '../../types/Article';
import './DetailArticles.css';
import URL from '../../constants/Url';

import apiClient from '../../utils/axiosConfig';
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

    const article = articles.find(article => article.id === articleId);
    const [mainPhoto, setMainPhoto] = useState<string | null>(null);
    const reviewsRef = useRef<HTMLDivElement>(null);

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
                console.error(`Erreur lors de la récupération des données pour l'article ${article.id}:`, error);
            }
        });
    }, [articleStatus, dispatch, articles]);

    useEffect(() => {
        if (article && article.photo && article.photo.length > 0) {
            setMainPhoto(article.photo[0]);
        }
    }, [article]);

    const handleAddToPanier = async (article: Article) => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = user.id;

            if (!userId) {
                throw new Error("Utilisateur non connecté ou ID manquant");
            }

            const cartResponse = await apiClient.get(`api/api/cart/cart`, {
                withCredentials: true,
            });

            const cartId = cartResponse.data.id;

            await apiClient.post(URL.POST_CART_ITEMS, {
                cart_fk: cartId,
                product_fk: article.id,
                quantity: 1
            }, {
                withCredentials: true
            });

            addPanier(article);
            console.log('Article ajouté au panier');
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'article au panier :", error);
        }
    };

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
            {article && mainPhoto && article.photo &&
                <section className='bloc__detail'>
                    <div className="photo-container">
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
                        <div className="main-photo-container">
                            <img
                                src={mainPhoto}
                                alt={article.name}
                                className="main-photo"
                            />
                        </div>
                    </div>
                    <div className="details-container">
                        <h2>{article.name}</h2>
                        {ratings[articleId] !== undefined && (
                            <div className="rating-summary">
                                {renderStars(ratings[articleId])}
                                {/* <span className="rating-text">
                                    Note : {ratings[articleId]} sur 5
                                </span> */}
                                <span onClick={scrollToReviews} className="reviews-link" role="button" style={{ cursor: 'pointer' }}>
                                    Voir les avis
                                </span>

                            </div>
                        )}
                        <p className="price">{article.price} €</p>
                        <p>{article.content}</p>
                        <button onClick={() => handleAddToPanier(article)}>
                            AJOUTER AU PANIER ({article.price} €)
                        </button>
                    </div>
                </section>
            }

            {/* Section des avis */}
            <section className="reviews-section" ref={reviewsRef}>
                <h3>Avis</h3>
                <ReviewsList productId={articleId} />
                <ReviewForm productId={articleId} onReviewAdded={() => console.log("Avis ajouté")} />
            </section>
        </div>
    );
};

export default DetailArticle;
