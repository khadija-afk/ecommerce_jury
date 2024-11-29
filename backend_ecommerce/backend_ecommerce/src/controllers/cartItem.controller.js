import { CartItem, Cart } from "../models/index.js";
import { calculateTotalAmount } from "../utils/cart.util.js";
import { verifieToken } from "../auth.js"; // Assurez-vous d'importer votre middleware de vérification du token
import * as Service from "../services/service.js";

// Récupérer tous les articles du panier
export const getAllCartItems = async (req, res) => {
  try {
    const cartItems = await CartItem.findAll();
    res.status(200).json(cartItems);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Erreur serveur lors de la récupération des articles du panier",
      });
  }
};

// Récupérer un article du panier par son ID
export const getCartItemById = async (req, res) => {
  try {
    const cartItem = await Service.get(CartItem, req.params.id);
    return res.status(200).json(cartItem);
  } catch (error) {
    return res.status(error.status).json({ error: error.error });
  }
};

// Ajouter un nouvel article ou incrémenter la quantité dans le panier
export const addCartItem = async (req, res) => {
  let newCartItem;
  const { product_fk, quantity } = req.body;
  let userId = req.user.id; // Assurez-vous que `req.user.id` provient du middleware JWT
  let existingCartItem;

  let cart = await Cart.findOne({ where: { user_fk: userId } });
  if (!cart) {
    // Si pas de panier, en créer un
    cart = await Cart.create({ user_fk: userId, total_amount: 0 });
  }

  try {
    existingCartItem = await CartItem.findOne({
      where: {
        cart_fk: cart.id,
        product_fk: product_fk,
      },
    });

    if (existingCartItem) {
      // Si l'article existe, augmenter la quantité
      const newQuantity = existingCartItem.quantity + quantity;
      await existingCartItem.update({ quantity: newQuantity });

      // Recalculer le total du panier
      await calculateTotalAmount(cart.id);

      return res.status(200).json(existingCartItem);
    }

    // Si l'article n'existe pas encore, le créer
    newCartItem = await CartItem.create({
      cart_fk: cart.id,
      product_fk,
      quantity,
    });

    // Recalculer et mettre à jour le total du panier
    await calculateTotalAmount(cart.id);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur serveur lors de l'ajout de l'article au panier" });
  }

  res.status(201).json(newCartItem);
};

// Supprimer un article du panier
export const deleteCartItem = async (req, res) => {
  const { id } = req.params;

  // Trouver l'article du panier avant de le supprimer pour récupérer le cart_fk
  let cartItem = await CartItem.findOne({ where: { id } });

  if (!cartItem) {
    return res.status(404).json({ error: "Article du panier non trouvé" });
  }

  let cartId = cartItem.cart_fk;

  try {
    // Supprimer l'article du panier en utilisant l'id
    await CartItem.destroy({ where: { id } });

    // Recalculer le montant total du panier après la suppression de l'article
    await calculateTotalAmount(cartId);
  } catch (error) {
    console.error("Erreur lors de la suppression de l'article :", error);
    return res
      .status(500)
      .json({ error: "Erreur serveur lors de la suppression de l'article" });
  }
  return res.status(204).send(); // Pas de contenu
};

// Mettre à jour un article du panier
export const updateCartItem = async (req, res) => {
  let cartItem;

  try {
    cartItem = await Service.get(CartItem, req.params.id);
  } catch (error) {
    return res.status(error.status).json({ error: error.error });
  }

  try {
    // Mise à jour de l'article
    await cartItem.update(req.body);
    // Recalculer et mettre à jour le total_amount du panier
    await calculateTotalAmount(cartItem.cart_fk);
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de l'article du panier :",
      error,
    );
    return res
      .status(500)
      .json({
        error: "Erreur serveur lors de la mise à jour de l'article du panier",
      });
  }
  return res.status(200).json(cartItem);
};

// Fonction pour vider le panier d'un utilisateur
// Fonction pour vider le panier d'un utilisateur et réinitialiser le total_amount
export const clearUserCart = async (req, res) => {
  try {
    const userId = req.user.id; // ID de l'utilisateur connecté

    // Récupérer l'ID du panier associé à l'utilisateur
    const userCart = await Cart.findOne({
      where: { user_fk: userId },
      attributes: ['id', 'total_amount'], // Récupère l'ID et le total_amount du panier
    });

    if (!userCart) {
      return res.status(404).json({ error: "Panier non trouvé pour cet utilisateur." });
    }

    // Supprimer tous les articles du panier en utilisant `cart_fk`
    await CartItem.destroy({
      where: { cart_fk: userCart.id },
    });

    // Réinitialiser le total_amount à zéro
    userCart.total_amount = 0;
    await userCart.save();

    res.status(200).json({ message: "Le panier a été vidé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression des articles du panier :", error);
    res.status(500).json({ error: "Erreur serveur lors de la suppression des articles du panier." });
  }
};
