import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import apiClient from '../../utils/axiosConfig';
import { Box, Button, TextField, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import './ReviewForm.css';

const ReviewForm = ({ productId, onReviewAdded }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [fieldErrors, setFieldErrors] = useState<{ rating?: string; comment?: string; general?: string }>({});
    const [modalMessage, setModalMessage] = useState<string | null>(null);
    const [modalType, setModalType] = useState<'success' | 'error' | null>(null);

    const handleCloseModal = () => {
        setModalMessage(null);
        setModalType(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFieldErrors({});
        setModalMessage(null);

        // Validation locale
        const errors: { rating?: string; comment?: string } = {};
        if (rating === 0) {
            errors.rating = "Veuillez sélectionner une note.";
        }
        if (comment.trim() === "") {
            errors.comment = "Veuillez entrer un commentaire.";
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        try {
            const response = await apiClient.post(
                `api/api/review`,
                { product_fk: productId, rating, comment },
                { withCredentials: true }
            );

            if (response.status === 201) {
                onReviewAdded(response.data);
                setRating(0);
                setComment('');
                setFieldErrors({});
                setModalType('success');
                setModalMessage("Votre avis a été envoyé avec succès. Il sera visible une fois approuvé.");
            }
        } catch (err: any) {
            if (err.response) {
                const errorMessage = err.response.data?.error || "Une erreur s'est produite. Veuillez réessayer.";
                setModalType('error');
                setModalMessage(errorMessage);
            } else {
                setModalType('error');
                setModalMessage("Impossible de communiquer avec le serveur. Veuillez réessayer.");
            }
        }
    };

    const handleStarClick = (starRating: number) => {
        setRating(starRating);
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    color={i <= rating ? "#ffc107" : "#e4e5e9"}
                    onClick={() => handleStarClick(i)}
                    style={{ cursor: 'pointer', marginRight: '5px' }}
                />
            );
        }
        return stars;
    };

    return (
        <Box className="review-form" sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
                Ajouter un avis
            </Typography>

            <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">Note :</Typography>
                    {renderStars()}
                    {fieldErrors.rating && (
                        <Typography variant="body2" color="error">
                            {fieldErrors.rating}
                        </Typography>
                    )}
                </Box>
                <Box sx={{ mb: 2 }}>
                    <TextField
                        label="Commentaire"
                        multiline
                        rows={4}
                        fullWidth
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        error={!!fieldErrors.comment}
                        helperText={fieldErrors.comment}
                    />
                </Box>
                <Button type="submit" variant="contained" color="primary">
                    Envoyer l'avis
                </Button>
            </form>

            {/* Modal pour les messages */}
            <Dialog
                open={modalMessage !== null}
                onClose={handleCloseModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {modalType === 'success' ? "Succès" : "Erreur"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {modalMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Fermer
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ReviewForm;
