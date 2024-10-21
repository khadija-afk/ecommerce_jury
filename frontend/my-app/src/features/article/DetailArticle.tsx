import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { usePanier } from '../../utils/PanierContext';
import { RootState, Article } from '../../types/Article';
import './DetailArticles.css';
import URL from '../../constants/Url';

import apiClient from '../../utils/axiosConfig';
import { getAverageRating } from '../../services/review/ReviewService'; // Pour récupérer la note moyenne

const DetailArticle: React.FC = () => {
    const { addPanier } = usePanier();
    const dispatch = useDispatch();
    const { id } = useParams<{ id: string }>();
    const articleId = Number(id);

    const article = useSelector((state: RootState) =>
        state.articles.articles.find(article => article.id === articleId)
    );

    const [mainPhoto, setMainPhoto] = useState<string | null>(null);
    const [averageRating, setAverageRating] = useState<number | null>(null);
    const [reviewCount, setReviewCount] = useState<number>(0);

    useEffect(() => {
        if (article && article.photo && article.photo.length > 0) {
            setMainPhoto(article.photo[0]);
        }
    }, [article]);

    useEffect(() => {
        const fetchArticleDetails = async () => {
            try {
                const response = await apiClient.get(`api/api/article/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                // Récupérer la note moyenne et le nombre d'avis
                const rating = await getAverageRating(articleId);
                setAverageRating(rating.average);
                setReviewCount(rating.count); // Par exemple, si votre API retourne aussi le nombre d'avis
            } catch (error) {
                console.error(error);
            }
        };

        fetchArticleDetails();
    }, [id, articleId, dispatch]);

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

            const response = await apiClient.post(URL.POST_CART_ITEMS, {
                cart_fk: cartId,
                product_fk: article.id,
                quantity: 1
            }, {
                withCredentials: true
            });

            addPanier(article);
            console.log('Article ajouté au panier:', response.data);
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'article au panier :', error);
        }
    };

    const handleThumbnailClick = (photo: string) => {
        setMainPhoto(photo);
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
                        {averageRating && reviewCount && (
                            <>
                                <p>{averageRating.toFixed(1)}/5</p>
                                <p>({reviewCount} avis)</p>
                            </>
                        )}
                        <p className="price">{article.price} €</p>
                        <p>{article.content}</p>
                        <button onClick={() => handleAddToPanier(article)}>
                            AJOUTER AU PANIER ({article.price} €)
                        </button>
                    </div>
                </section>
            }
        </div>
    );
};

export default DetailArticle;
