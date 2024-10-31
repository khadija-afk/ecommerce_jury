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

interface CartItem {
  id: number;
  cart_fk: number;
  product_fk: number;
  quantity: number;
  article: Article;
}

interface PanierContextType {
  panier: CartItem[];
  totalPrice: number;
  totalArticle: () => number;
  addPanier: (product: Article) => void;
  incremente: (index: number) => void;
  decremente: (index: number) => void;
  removeArticle: (index: number) => void;
  priceArticleByQuantity: (price: number, quantity: number) => number;
  setPanier: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export const PanierContext = createContext<PanierContextType | undefined>(undefined);

export const usePanier = () => {
  const context = useContext(PanierContext);
  if (!context) {
    throw new Error('usePanier must be used within a PanierProvider');
  }
  return context;
};

// Fonction pour vérifier si l'utilisateur est authentifié
const isAuthenticated = () => {
  return document.cookie.split(';').some((cookie) => cookie.trim().startsWith('authCookie='));
};

export const PanierProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [panier, setPanier] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const recalculateTotalPrice = (panier: CartItem[]) => {
    const total = panier.reduce((acc, item) => {
      const price = parseFloat(item.article.price.toString()) || 0;
      const quantity = item.quantity || 1;
      return acc + price * quantity;
    }, 0);
    return parseFloat(total.toFixed(2));
  };

  useEffect(() => {
    // Charger le panier uniquement si l'utilisateur est authentifié
    if (!isAuthenticated()) return;

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

  const totalArticle = () => panier.reduce((acc, item) => acc + item.quantity, 0);

  const priceArticleByQuantity = (price: number, quantity: number) =>
    parseFloat((price * quantity).toFixed(2));

  const addPanier = async (product: Article) => {
    if (!isAuthenticated()) {
      console.warn("Non authentifié : impossible d'ajouter au panier.");
      return;
    }
    try {
      const newCartItem: CartItem = {
        id: Math.random(),
        cart_fk: 1,
        product_fk: product.id,
        quantity: 1,
        article: { ...product },
      };

      const updatedPanier = [...panier, newCartItem];
      setPanier(updatedPanier);
      setTotalPrice(recalculateTotalPrice(updatedPanier));

      await apiClient.post(
        '/api/api/cartItem/cart-items',
        { product_fk: product.id, quantity: 1 },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier :", error);
    }
  };

  const incremente = async (index: number) => {
    const updatedCartItem = { ...panier[index], quantity: panier[index].quantity + 1 };
    const updatedPanier = [...panier];
    updatedPanier[index] = updatedCartItem;

    setPanier(updatedPanier);
    setTotalPrice(recalculateTotalPrice(updatedPanier));

    try {
      await apiClient.put(
        `api/api/cartItem/cart-items/${updatedCartItem.id}`,
        { quantity: updatedCartItem.quantity },
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité sur le serveur :', error);
    }
  };

  const decremente = async (index: number) => {
    if (panier[index].quantity <= 1) return;

    const updatedCartItem = { ...panier[index], quantity: panier[index].quantity - 1 };
    const updatedPanier = [...panier];
    updatedPanier[index] = updatedCartItem;

    setPanier(updatedPanier);
    setTotalPrice(recalculateTotalPrice(updatedPanier));

    try {
      await apiClient.put(
        `api/api/cartItem/cart-items/${updatedCartItem.id}`,
        { quantity: updatedCartItem.quantity },
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité sur le serveur :', error);
    }
  };

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
      console.error("Erreur lors de la suppression de l'article du panier :", error);
    }
  };

  return (
    <PanierContext.Provider
      value={{
        panier,
        totalPrice,
        totalArticle,
        addPanier,
        incremente,
        decremente,
        removeArticle,
        priceArticleByQuantity,
        setPanier,
      }}
    >
      {children}
    </PanierContext.Provider>
  );
};
