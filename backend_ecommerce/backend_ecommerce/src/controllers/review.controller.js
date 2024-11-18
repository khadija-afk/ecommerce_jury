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
// Get reviews by product ID
export const getReviewsByProductId = async (req, res) => {
  const productId = req.params.productId; // Récupère l'ID du produit depuis les paramètres de la requête
  try {
    const reviews = await Review.findAll({
      where: { product_fk: productId, status: 'approved'},
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

    // Vérifie si l'utilisateur a acheté le produit dans une commande validée
    const hasPurchased = await OrderDetails.findOne({
      where: { 
        user_fk,
        status: 'validé' // Vérifie que la commande est validée
      },
      include: [
        {
          model: OrderItems,
          where: { product_fk },
          attributes: [], // On ne récupère que les commandes contenant ce produit
        },
      ],
    });

    if (!hasPurchased) {
      return res.status(403).json({ error: "Vous ne pouvez pas laisser un avis pour un produit non acheté ou commande non validée." });
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
    // Récupérer l'ID de l'avis
    const reviewId = req.params.id;
    if (!reviewId) {
      return res.status(400).json({ error: "ID de l'avis manquant." });
    }

    // Trouver l'avis
    review = await Service.get(Review, reviewId);
    if (!review) {
      return res.status(404).json({ error: "Avis introuvable." });
    }

    // Vérifier si l'utilisateur connecté est le créateur de l'avis
    if (review.user_fk !== req.user.id) {
      return res.status(403).json({ error: "Vous n'êtes pas autorisé à modifier cet avis." });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de l'avis :", error);
    return res.status(500).json({ error: "Erreur serveur lors de la récupération de l'avis." });
  }

  try {
    // Mettre à jour l'avis
    const { product_fk, rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ error: "Les champs rating et comment sont requis." });
    }

    // Mettre à jour l'avis et redéfinir le statut sur 'pending'
    const updatedReview = await review.update({
      product_fk,
      rating,
      comment,
      status: "pending", // Réinitialise le statut après modification
    });

    res.status(200).json(updatedReview);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'avis :", error);
    res.status(500).json({ error: "Erreur serveur lors de la mise à jour de l'avis." });
  }
};


// Delete a review
export const deleteReview = async (req, res) => {
  const reviewId = req.params.id;
  let review;

  try {
    // Récupérer l'avis
    review = await Service.get(Review, reviewId);

    if (!review) {
      return res.status(404).json({ error: "Avis introuvable." });
    }

    // Vérifier si l'utilisateur connecté est autorisé à supprimer l'avis
    const isAdmin = req.user.role === 'admin'; // Vérifie si l'utilisateur est un administrateur
    const isOwner = review.user_fk === req.user.id; // Vérifie si l'utilisateur est le créateur de l'avis

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Vous n'êtes pas autorisé à supprimer cet avis." });
    }

    // Supprimer l'avis
    await Service.destroy(review);
    return res.status(200).json({ message: "Avis supprimé avec succès." });

  } catch (error) {
    console.error("Erreur lors de la suppression de l'avis :", error);
    return res.status(500).json({ error: "Erreur serveur lors de la suppression de l'avis." });
  }
};


// Calculate average rating for a product
// Calculate average rating for a product
export const getAverageRating = async (req, res) => {
  try {
    const productId = req.params.productId;

    // Inclure la condition "status: 'approved'"
    const reviews = await Review.findAll({
      where: {
        product_fk: productId,
        status: 'approved', // Seules les évaluations approuvées sont prises en compte
      },
      attributes: [
        [Sequelize.fn("AVG", Sequelize.col("rating")), "averageRating"],
      ],
      raw: true,
    });

    const averageRating = reviews[0].averageRating;

    res
      .status(200)
      .json({ 
        averageRating: averageRating 
          ? parseFloat(averageRating).toFixed(1) 
          : "0", // Retourner "N/A" si aucune évaluation approuvée
      });
  } catch (error) {
    console.error("Error calculating average rating:", error);
    res
      .status(500)
      .json({ error: "Server error while calculating average rating" });
  }
};

export const getPendingReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({ where: { status: 'pending' } });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Erreur lors de la récupération des avis en attente :", error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des avis en attente." });
  }
};
export const approveReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({ error: "Avis introuvable" });
    }

    await review.update({ status: 'approved' });
    res.status(200).json({ message: "Avis approuvé avec succès", review });
  } catch (error) {
    console.error("Erreur lors de l'approbation de l'avis :", error);
    res.status(500).json({ error: "Erreur serveur lors de l'approbation de l'avis." });
  }
};
export const rejectReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({ error: "Avis introuvable" });
    }

    await review.update({ status: 'rejected' });
    res.status(200).json({ message: "Avis rejeté avec succès", review });
  } catch (error) {
    console.error("Erreur lors du rejet de l'avis :", error);
    res.status(500).json({ error: "Erreur serveur lors du rejet de l'avis." });
  }
};

