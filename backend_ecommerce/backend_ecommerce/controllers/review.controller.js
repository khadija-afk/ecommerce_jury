// controllers/reviewController.js
import { Review } from '../models/index.js';

// Get all reviews
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll();
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error getting reviews:', error);
        res.status(500).json({ error: 'Server error while getting reviews' });
    }
};

// Get review by ID
export const getReviewById = async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.status(200).json(review);
    } catch (error) {
        console.error('Error getting review:', error);
        res.status(500).json({ error: 'Server error while getting review' });
    }
};

// Create a new review
export const createReview = async (req, res) => {
    try {
        const { product_fk, rating, comment } = req.body;
        const user_fk = req.user.id; // Utiliser l'ID de l'utilisateur connecté

        const newReview = await Review.create({ user_fk, product_fk, rating, comment });
        res.status(201).json(newReview);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ error: 'Server error while creating review', detail: error.message });
    }
};

// Update a review
export const updateReview = async (req, res) => {
    try {
        const { product_fk, rating, comment } = req.body;
        const user_fk = req.user.id; // Utiliser l'ID de l'utilisateur connecté

        const review = await Review.findByPk(req.params.id);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        await review.update({ user_fk, product_fk, rating, comment });
        res.status(200).json(review);
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ error: 'Server error while updating review' });
    }
};

// Delete a review
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        await review.destroy();
        return res.status(200).json({ message: "avis supprimer" });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Server error while deleting review' });
    }
};
