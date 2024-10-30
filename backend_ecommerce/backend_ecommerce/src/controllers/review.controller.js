// controllers/reviewController.js
import { Sequelize } from "sequelize";
import { Review, OrderDetails, OrderItems, Article, User } from "../models/index.js";
import * as Service from "../services/service.js";

// Get all reviews grouped by product with product details
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        {
          model: Article,
          attributes: ['id', 'name', 'price'], // Récupère uniquement les champs nécessaires du produit
        }
      ],
      attributes: [
        'id',
        'product_fk',
        'user_fk',
        'rating',
        'comment',
        [Sequelize.fn("AVG", Sequelize.col("rating")), "averageRating"]
      ],
      group: ['Review.id', 'Review.product_fk', 'Review.user_fk', 'Review.rating', 'Review.comment', 'Article.id'], // Ajoute toutes les colonnes nécessaires
      raw: true
    });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error getting reviews:", error);
    res.status(500).json({ error: "Server error while getting reviews" });
  }
};

// Get reviews by product ID
export const getReviewsByProductId = async (req, res) => {
  try {
    const productId = req.params.productId; // Récupère l'ID du produit depuis les paramètres de la requête

    const reviews = await Review.findAll({
      where: { product_fk: productId },
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName'] // Récupérer le nom et prénom
        },
        {
          model: Article,
          attributes: ['id', 'name', 'price']
        }
      ],
      attributes: ['id', 'product_fk', 'user_fk', 'rating', 'comment', 'createdAt'],
      raw: true
    });

    res.status(200).json(reviews);
  } catch (error) {
    console.error(`Error fetching reviews for product ${productId}:`, error);
    res.status(500).json({ error: "Server error while fetching reviews for product" });
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

// Create a new review with purchase verification and single-review restriction
export const createReview = async (req, res) => {
  try {
    const { product_fk, rating, comment } = req.body;
    const user_fk = req.user.id; // Utiliser l'ID de l'utilisateur connecté

    // Vérifie si l'utilisateur a acheté le produit
    const hasPurchased = await OrderDetails.findOne({
      where: { user_fk },
      include: [
        {
          model: OrderItems,
          where: { product_fk },
          attributes: [], // On ne récupère que les commandes contenant ce produit
        },
      ],
    });

    if (!hasPurchased) {
      return res.status(403).json({ error: "Vous ne pouvez pas laisser un avis pour un produit non acheté." });
    }

    // Vérifie si un avis existe déjà pour cet utilisateur et ce produit
    const existingReview = await Review.findOne({
      where: {
        user_fk,
        product_fk
      }
    });

    if (existingReview) {
      return res.status(403).json({ error: "Vous avez déjà laissé un avis pour ce produit." });
    }

    // Crée un nouvel avis si l'utilisateur a acheté le produit et n'a pas encore laissé d'avis
    const newReview = await Review.create({
      user_fk,
      product_fk,
      rating,
      comment,
    });

    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({
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
