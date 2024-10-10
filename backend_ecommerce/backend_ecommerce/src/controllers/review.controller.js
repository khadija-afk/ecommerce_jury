// controllers/reviewController.js
import { Sequelize } from "sequelize";
import { Review } from "../models/index.js";
import * as Service from "../services/service.js";

// Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll();
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error getting reviews:", error);
    res.status(500).json({ error: "Server error while getting reviews" });
  }
};

// Get review by ID
export const getReviewById = async (req, res) => {

  let review;
  try {
    review = await Service.get(Review, req.params.id);
    res.status(200).json(review);
  } catch (error) {
    return res.status(error.status).json({ error: error.error });
  }
};

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { product_fk, rating, comment } = req.body;
    const user_fk = req.user.id; // Utiliser l'ID de l'utilisateur connecté

    const newReview = await Review.create({
      user_fk,
      product_fk,
      rating,
      comment,
    });
    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error creating review:", error);
    res
      .status(500)
      .json({
        error: "Server error while creating review",
        detail: error.message,
      });
  }
};

// Update a review
export const updateReview = async (req, res) => {

  let review;
  
  try {

    review = await Service.get(Review, req.params.id);
  } catch (error) {
      return res.status(error.status).json({ error: error.error });
  }

  try {
    const { product_fk, rating, comment } = req.body;
    const user_fk = req.user.id; // Utiliser l'ID de l'utilisateur connecté
    await review.update({ user_fk, product_fk, rating, comment });
    res.status(200).json(review);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Server error while updating review" });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  const id = req.params.id;
  let review;
  try {
    review = await Service.get(Review, id);
    await Service.destroy(review);
    return res.status(200).json({ message: "avis supprimer" });
  } catch (error) {
    return res.status(error.status).json({ error: error.error });
  }
};

// Calculate average rating for a product
export const getAverageRating = async (req, res) => {
  try {
    const productId = req.params.productId;

    const reviews = await Review.findAll({
      where: { product_fk: productId },
      attributes: [
        [Sequelize.fn("AVG", Sequelize.col("rating")), "averageRating"],
      ],
      raw: true,
    });

    const averageRating = reviews[0].averageRating;

    res
      .status(200)
      .json({ averageRating: parseFloat(averageRating).toFixed(1) });
  } catch (error) {
    console.error("Error calculating average rating:", error);
    res
      .status(500)
      .json({ error: "Server error while calculating average rating" });
  }
};
