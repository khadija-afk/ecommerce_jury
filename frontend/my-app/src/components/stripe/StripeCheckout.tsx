import React, { useContext, useEffect, useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { PanierContextType, PanierContext } from "../../utils/PanierContext";
import axios from "axios";
import apiClient from "@/utils/axiosConfig";

// Définition des types pour un article dans le panier
interface Article {
  id: number;
  name: string;
  content: string;
  price: number;
  photo: string;
}

interface CartItem {
  article: Article;
  quantity: number;
}

interface StripeCheckoutProps {
  orderId: string;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ orderId }) => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const stripe = useStripe();
  const { panier, setPanier } = useContext(PanierContext) as PanierContextType;

  // Récupérer l'email de l'utilisateur connecté
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await apiClient.get("/api/user/check_auth", {
          withCredentials: true,
        });
        setEmail(response.data.email);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'email de l'utilisateur :",
          error
        );
      }
    };

    fetchUserEmail();
  }, []);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Préparation des items pour Stripe Checkout
    const line_items = panier.map((cartItem: CartItem) => {
      const imgUrl =
        cartItem.article.photo && cartItem.article.photo.length > 0
          ? cartItem.article.photo[0]
          : "";
      const priceInCents = Math.round(cartItem.article.price * 100); // Convertir le prix en centimes

      return {
        quantity: cartItem.quantity,
        price_data: {
          currency: "eur",
          unit_amount: priceInCents,
          product_data: {
            name: cartItem.article.name || "Produit sans nom",
            description: cartItem.article.content || "Description non disponible",
            images: imgUrl ? [imgUrl] : [],
          },
        },
      };
    });

    try {
      // Effectuer la requête pour créer une session de paiement
      const { data } = await apiClient.post(
        "/api/stripe/create-checkout-session",
        {}, // Pas de données supplémentaires dans le corps
        { withCredentials: true } // Option pour inclure les cookies
      );
    
      // Vérification de la réponse
      if (!data.sessionId) {
        console.error("Erreur API Stripe : Session ID manquant", data.error || "Erreur inconnue");
        return;
      }
    
      // Redirection vers Stripe Checkout
      const result = await stripe?.redirectToCheckout({ sessionId: data.sessionId });
    
      // Vérification du résultat de la redirection
      if (result?.error) {
        console.error("Erreur de redirection Stripe :", result.error.message);
      } else {
        // Vider le panier après paiement réussi
        setPanier([]);
        console.log("Commande passée avec succès, panier vidé !");
      }
    } catch (error) {
      // Gestion des erreurs Axios
      if (axios.isAxiosError(error)) {
        console.error("Erreur API Axios :", error.response?.data || error.message);
      } else {
        console.error("Erreur pendant le paiement :", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCheckout}>
      <button type="submit" disabled={loading}>
        {loading ? "Traitement en cours..." : "Passer la commande"}
      </button>
    </form>
  );
};

export default StripeCheckout;
