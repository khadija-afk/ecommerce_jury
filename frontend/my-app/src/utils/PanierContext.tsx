import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import apiClient from './axiosConfig';

// Définition du type d'article
interface Article {
  id: number;
  name: string;
  price: number;
  quantity: number;
  photo: string[];
}

// Définition du type CartItem
interface CartItem {
  id: number;
  cart_fk: number;
  product_fk: number;
  quantity: number;
  article: Article; // Un CartItem contient un Article
}

// Définition du type du contexte
interface PanierContextType {
  panier: CartItem[]; // Panier est une liste d'articles de type CartItem
  totalPrice: number;
  totalArticle: () => number;
  addPanier: (product: Article) => void;
  incremente: (index: number) => void;
  decremente: (index: number) => void;
  removeArticle: (index: number) => void;
  priceArticleByQuantity: (price: number, quantity: number) => number;
  setPanier: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

// Création du contexte
export const PanierContext = createContext<PanierContextType | undefined>(undefined);

// Création du hook personnalisé pour utiliser le PanierContext
export const usePanier = () => {
  const context = useContext(PanierContext);
  if (!context) {
    throw new Error('usePanier must be used within a PanierProvider');
  }
  return context;
};

// Création du fournisseur de contexte
export const PanierProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [panier, setPanier] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // recalculer le prix total
  const recalculateTotalPrice = (panier: CartItem[]) => {
    const total = panier.reduce((acc, item) => {
      const price = parseFloat(item.article.price.toString()) || 0; // S'assurer que le prix est un nombre
      const quantity = item.quantity || 1; // Quantité par défaut à 1 si non définie
      return acc + price * quantity;
    }, 0);

    return parseFloat(total.toFixed(2)); // Arrondir à 2 décimales pour le total
  };

  // Charger le panier depuis le backend
  useEffect(() => {
    const loadPanier = async () => {
      try {
        const response = await apiClient.get('/api/api/cart/cart', { withCredentials: true });
        const panierData = response.data.cartItems || [];
        setPanier(panierData);
        setTotalPrice(recalculateTotalPrice(panierData));
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
      }
    };
    loadPanier();
  }, []);

  // Fonction pour obtenir le nombre total d'articles dans le panier
  const totalArticle = () => panier.reduce((acc, item) => acc + item.quantity, 0);

  // Fonction pour calculer le prix total d'un article en fonction de sa quantité
  const priceArticleByQuantity = (price: number, quantity: number) => parseFloat((price * quantity).toFixed(2));

  // Fonction pour ajouter un article au panier
  const addPanier = async (product: Article) => {
    try {
      const newCartItem: CartItem = {
        id: Math.random(), // Utilisation d'un ID temporaire pour l'instant
        cart_fk: 1, // L'ID du panier peut être récupéré dynamiquement si nécessaire
        product_fk: product.id,
        quantity: 1, // Par défaut, 1 article est ajouté
        article: { ...product }, // L'article ajouté doit inclure toutes les propriétés d'un article
      };

      const updatedPanier = [...panier, newCartItem];
      setPanier(updatedPanier);
      setTotalPrice(recalculateTotalPrice(updatedPanier));

      // Envoi de l'article au backend (API)
      await apiClient.post('/api/api/cartItem/cart-items', {
        product_fk: product.id,
        quantity: 1,
      }, {
        withCredentials: true
      });

    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier :', error);
    }
  };

  // Fonction pour incrémenter la quantité d'un article
  const incremente = async (index: number) => {
    const updatedCartItem = { ...panier[index], quantity: panier[index].quantity + 1 };
    const updatedPanier = [...panier];
    updatedPanier[index] = updatedCartItem;

    setPanier(updatedPanier);
    setTotalPrice(recalculateTotalPrice(updatedPanier));

    // Mise à jour du serveur
    try {
      await apiClient.put(`api/api/cartItem/cart-items/${updatedCartItem.id}`, {
        quantity: updatedCartItem.quantity,
      }, {
        withCredentials: true,
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité sur le serveur :', error);
    }
  };

  // Fonction pour décrémenter la quantité d'un article
  const decremente = async (index: number) => {
    if (panier[index].quantity <= 1) return;

    const updatedCartItem = { ...panier[index], quantity: panier[index].quantity - 1 };
    const updatedPanier = [...panier];
    updatedPanier[index] = updatedCartItem;

    setPanier(updatedPanier);
    setTotalPrice(recalculateTotalPrice(updatedPanier));

    try {
      await apiClient.put(`api/api/cartItem/cart-items/${updatedCartItem.id}`, {
        quantity: updatedCartItem.quantity,
      }, {
        withCredentials: true,
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité sur le serveur :', error);
    }
  };

  // Fonction pour supprimer un article du panier
  const removeArticle = async (index: number) => {
    const articleToRemove = panier[index];

    const updatedPanier = panier.filter((_, i) => i !== index);
    setPanier(updatedPanier);
    setTotalPrice(recalculateTotalPrice(updatedPanier));

    try {
      await apiClient.delete(`api/api/cartItem/cart-items/${articleToRemove.id}`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article du panier :', error);
    }
  };

  return (
    <PanierContext.Provider value={{
      panier,
      totalPrice,
      totalArticle,
      addPanier,
      incremente,
      decremente,
      removeArticle,
      priceArticleByQuantity,
      setPanier,
    }}>
      {children}
    </PanierContext.Provider>
  );
};
