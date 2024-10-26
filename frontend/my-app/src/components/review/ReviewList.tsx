import React, { useEffect, useState } from 'react';
import apiClient from '../../utils/axiosConfig';

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

    return (
        <div className="reviews-list">
            <h3>Note moyenne : {averageRating} / 5</h3>
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review.id} className="review">
                        <p>Note : {review.rating} / 5</p>
                        <p>{review.comment}</p>
                        <small>Par utilisateur {review.user_fk}</small>
                    </div>
                ))
            ) : (
                <p>Aucun avis pour ce produit.</p>
            )}
        </div>
    );
};

export default ReviewsList;
