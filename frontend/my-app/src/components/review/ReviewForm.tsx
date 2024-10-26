import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import apiClient from '../../utils/axiosConfig';
import './ReviewForm.css';

const ReviewForm = ({ productId, onReviewAdded }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post(`api/api/review`, {
                product_fk: productId,
                rating,
                comment,
            });
            if (response.status === 201) {
                onReviewAdded(response.data);
                setRating(0);
                setComment('');
                setError(null);
            }
        } catch (error) {
            setError("Vous devez acheter ce produit pour laisser un avis.");
        }
    };

    // Gestion du clic pour sélectionner la note
    const handleStarClick = (starRating) => {
        setRating(starRating);
    };

    // Affichage des étoiles interactives
    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    color={i <= rating ? "#ffc107" : "#e4e5e9"}
                    onClick={() => handleStarClick(i)}
                    style={{ cursor: 'pointer' }}
                />
            );
        }
        return stars;
    };

    return (
        <div className="review-form">
            <h3>Ajouter un avis</h3>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="rating">
                    <label>Note :</label>
                    {renderStars()}
                </div>
                <div className="comment">
                    <label>Commentaire :</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Envoyer l'avis</button>
            </form>
        </div>
    );
};

export default ReviewForm;
