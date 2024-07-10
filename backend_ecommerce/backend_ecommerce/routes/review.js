import express from 'express';
import { verifieToken } from '../auth.js';
import { getAllReviews, getReviewById, createReview, updateReview, deleteReview } from '../controllers/review.controller.js';

const router = express.Router();

// Get all reviews
router.get('/', getAllReviews);

// Get review by ID
router.get('/:id', getReviewById);

// Create a new review
router.post('/',verifieToken, createReview);

// Update a review
router.put('/:id',verifieToken, updateReview);

// Delete a review
router.delete('/:id',verifieToken, deleteReview);

export default router;
