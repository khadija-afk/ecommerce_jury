import { Cart, CartItem, Article } from "../models/index.js";
import { calculateTotalAmount } from "../utils/cart.util.js";

import * as Service from "../services/service.js";


// Récupérer le panier par ID utilisateur à partir du token
export const getCartByUserId = async (req, res) => {
  try {
    // Récupérer l'ID de l'utilisateur connecté à partir de req.user (injecté par un middleware JWT par exemple)
    const userId = req.user.id;

    // Rechercher le panier associé à cet utilisateur
    const cart = await Cart.findOne({
      where: { user_fk: userId }, // Assure-toi que user_fk est la clé étrangère de l'utilisateur dans le modèle Cart
    });

    // Si aucun panier n'est trouvé, renvoyer une erreur 404
    if (!cart) {
      return res.status(404).json({ error: "Panier non trouvé pour cet utilisateur" });
    }

    // Si le panier est trouvé, renvoyer les détails du panier
    res.status(200).json(cart);
  } catch (error) {
    console.error("Erreur lors de la récupération du panier :", error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération du panier" });
  }
};
// Mettre à jour le montant total du panier
export const updateCartTotalAmount = async (req, res) => {
  try {
    const userId = req.user.id; // Utiliser l'ID de l'utilisateur extrait du token
    const { totalAmount } = req.body;

    // Validation du totalAmount
    if (totalAmount == null || isNaN(totalAmount)) {
      return res.status(400).json({ error: "Montant total invalide" });
    }

    const cart = await Cart.findOne({ where: { user_fk: userId } });
    if (!cart) {
      return res
        .status(404)
        .json({ error: "Panier non trouvé pour cet utilisateur" });
    }

    await cart.update({ total_amount: totalAmount });
    res.status(200).json(cart);
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du montant total du panier :",
      error,
    );
    res
      .status(500)
      .json({
        error:
          "Erreur serveur lors de la mise à jour du montant total du panier",
      });
  }
};

// Supprimer un panier
export const deleteCart = async (req, res) => {
  let id = req.params.id
  let cart
  try {
    cart =  await Service.get(Cart, id);
    await Service.destroy(cart, req.user.id);

    return res.status(204).send(); 
  } catch (error) {
    return res.status(error.status).json({ error: error.error });
  }
};
