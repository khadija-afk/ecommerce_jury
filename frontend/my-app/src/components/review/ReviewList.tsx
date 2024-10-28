import React, { useEffect, useState } from 'react';
import apiClient from '../../utils/axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUserCircle } from '@fortawesome/free-solid-svg-icons';

const ReviewsList = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await apiClient.get(`api/api/review/product/${productId}`);
                setReviews(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des avis :", error);
            }
        };

        const fetchAverageRating = async () => {
            try {
                const response = await apiClient.get(`api/api/review/${productId}/average`);
                setAverageRating(response.data.averageRating);
            } catch (error) {
                console.error("Erreur lors du calcul de la note moyenne :", error);
            }
        };

        fetchReviews();
        fetchAverageRating();
    }, [productId]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="reviews-list">
            <h3>Note moyenne : {averageRating} / 5</h3>
            {reviews.length > 0 ? (
                reviews.map((review) => {
                    console.log("Created at:", review.createdAt); // Vérifiez ici la valeur de createdAt pour chaque avis
                    return (
                        <div key={review.id} className="review" style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #ccc' }}>
                            <div className="review-header" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                <FontAwesomeIcon icon={faUserCircle} size="2x" style={{ marginRight: '10px', color: '#888' }} />
                                <div>
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>{review.user_fk || 'Utilisateur Anonyme'}</p>
                                    <p style={{ margin: 0, color: '#888' }}>{formatDate(review.createdAt)}</p>
                                </div>
                            </div>
                            <p style={{ margin: '5px 0' }}>
                                <strong>Note : {review.rating} / 5</strong>{' '}
                                {Array.from({ length: 5 }, (_, i) => (
                                    <FontAwesomeIcon
                                        key={i}
                                        icon={faStar}
                                        color={i < review.rating ? '#ffc107' : '#e4e5e9'}
                                    />
                                ))}
                            </p>
                            <p style={{ margin: '5px 0', fontStyle: 'italic' }}>{review.comment}</p>
                        </div>
                    );
                })
            ) : (
                <p>Aucun avis pour ce produit.</p>
            )}
        </div>
    );
    
};

export default ReviewsList;
