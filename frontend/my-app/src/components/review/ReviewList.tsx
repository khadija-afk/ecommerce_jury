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
                if (error.response && error.response.status !== 500) {
                    console.warn("Aucun avis pour ce produit.");
                } else {
                    console.error("Erreur lors de la récupération des avis :", error);
                }
            }
        };

        const fetchAverageRating = async () => {
            try {
                const response = await apiClient.get(`api/api/review/${productId}/average`);
                setAverageRating(response.data.averageRating || 0);
            } catch (error) {
                if (error.response && error.response.status !== 500) {
                    console.warn("Pas de note moyenne disponible pour ce produit.");
                } else {
                    console.error("Erreur lors du calcul de la note moyenne :", error);
                }
            }
        };

        fetchReviews();
        fetchAverageRating();
    }, [productId]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <FontAwesomeIcon
                key={i}
                icon={faStar}
                color={i < rating ? '#ffc107' : '#e4e5e9'}
            />
        ));
    };

    return (
        <div className="reviews-list">
            <h3>
            <span>{renderStars(averageRating)}</span> {averageRating} / 5{' '}
                
            </h3>
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review.id} className="review" style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #ccc' }}>
                        <div className="review-header" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <FontAwesomeIcon icon={faUserCircle} size="2x" style={{ marginRight: '10px', color: '#888' }} />
                            <div>
                                <p style={{ margin: 0, fontWeight: 'bold' }}>
                                    {review['User.firstName'] && review['User.lastName'] 
                                        ? `${review['User.firstName']} ${review['User.lastName']}` 
                                        : 'Utilisateur Anonyme'}
                                </p>
                                <p style={{ margin: 0, color: '#888' }}>{formatDate(review.createdAt)}</p>
                            </div>
                        </div>
                        <p style={{ margin: '5px 0' }}>
                            <strong>Note : {review.rating} / 5</strong>{' '}
                            {renderStars(review.rating)}
                        </p>
                        <p style={{ margin: '5px 0', fontStyle: 'italic' }}>{review.comment}</p>
                    </div>
                ))
            ) : (
                <p>Aucun avis pour ce produit.</p>
            )}
        </div>
    );
};

export default ReviewsList;
