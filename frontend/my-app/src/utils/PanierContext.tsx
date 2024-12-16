import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import apiClient from './axiosConfig';
import { useAuth } from './AuthCantext';

interface Article {
  id: number;
  name: string;
  price: number;
  content: string;
  quantity?: number; 
  photo: string;
}

interface CartItem {
  id: number;
  cart_fk: number;
  product_fk: number;
  quantity: number;
  article: Article;
}

export interface PanierContextType {
  panier: CartItem[];
  totalPrice: number;
  totalArticle: number;
  addPanier: (product: Article) => void;
  incremente: (productId: number) => void;
  decremente: (productId: number) => void;
  removeArticle: (productId: number) => void;
  setPanier: React.Dispatch<React.SetStateAction<CartItem[]>>;
  recalculateTotals: (updatedPanier: CartItem[]) => void; // Ajoutez cette ligne
}


export const PanierContext = createContext<PanierContextType | undefined>(undefined);

export const usePanier = () => {
  const context = useContext(PanierContext);
  if (!context) {
    throw new Error('usePanier must be used within a PanierProvider');
  }
  return context;
};

export const PanierProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [panier, setPanier] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalArticle, setTotalArticle] = useState(0);

  // Recalculer le total des articles et le prix total
  const recalculateTotals = (updatedPanier: CartItem[]) => {
    const newTotalPrice = updatedPanier.reduce(
      (acc, item) => acc + item.article.price * item.quantity,
      0
    );
    const newTotalArticle = updatedPanier.reduce((acc, item) => acc + item.quantity, 0);
    setTotalPrice(newTotalPrice);
    setTotalArticle(newTotalArticle);
  };

  // Charger le panier initial
  useEffect(() => {
    if (!isAuthenticated) {
      setPanier([]); // Réinitialisez le panier si déconnecté
      setTotalPrice(0);
      setTotalArticle(0);
      return;
    }

    const loadPanier = async () => {
      try {
        const response = await apiClient.get('/api/cart/cart', { withCredentials: true });
        const cartItems = response.data.cartItems || [];
        setPanier(cartItems);
        recalculateTotals(cartItems);
      } catch (error) {
        console.error('Erreur lors du chargement du panier :', error);
      }
    };

    loadPanier();
  }, [isAuthenticated]);

  // Ajouter un article au panier ou augmenter sa quantité si déjà présent
  const addPanier = async (product: Article) => {
    if (!isAuthenticated) {
      console.warn('Non authentifié : impossible d\'ajouter au panier.');
      return;
    }
  
    try {
      const existingItemIndex = panier.findIndex((item) => item.product_fk === product.id);
  
      if (existingItemIndex !== -1) {
        // Si l'article existe déjà, mettre à jour sa quantité
        const updatedItem = { ...panier[existingItemIndex] };
        updatedItem.quantity += 1;
  
        const updatedPanier = [...panier];
        updatedPanier[existingItemIndex] = updatedItem;
  
        // Mettre à jour l'état du panier avant d'envoyer la requête
        setPanier(updatedPanier);
  
        // Mettre à jour côté serveur
        await apiClient.put(
          `/api/cartItem/cart-items/${updatedItem.id}`,
          { quantity: updatedItem.quantity },
          { withCredentials: true }
        );
  
        // Recalculer les totaux après mise à jour
        recalculateTotals(updatedPanier);
      } else {
        // Ajouter un nouvel article
        const response = await apiClient.post(
          '/api/cartItem/cart-items',
          { product_fk: product.id, quantity: 1 },
          { withCredentials: true }
        );
  
        const newCartItem = { ...response.data, article: product };
        const updatedPanier = [...panier, newCartItem];
  
        // Mettre à jour l'état du panier et recalculer
        setPanier(updatedPanier);
        recalculateTotals(updatedPanier);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier :', error);
    }
  };
  

  // Incrémenter la quantité d'un article dans le panier
  const incremente = async (productId: number) => {
    const updatedPanier = panier.map((item) =>
      item.product_fk === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setPanier(updatedPanier);
    recalculateTotals(updatedPanier);

    try {
      const item = panier.find((item) => item.product_fk === productId);
      if (item) {
        await apiClient.put(
          `/api/cartItem/cart-items/${item.id}`,
          { quantity: item.quantity + 1 },
          { withCredentials: true }
        );
      }
    } catch (error) {
      console.error('Erreur lors de l\'incrémentation de l\'article :', error);
    }
  };

  // Décrémenter la quantité d'un article dans le panier
  const decremente = async (productId: number) => {
    const updatedPanier = panier
      .map((item) =>
        item.product_fk === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    setPanier(updatedPanier);
    recalculateTotals(updatedPanier);

    try {
      const item = panier.find((item) => item.product_fk === productId);
      if (item && item.quantity > 1) {
        await apiClient.put(
          `/api/cartItem/cart-items/${item.id}`,
          { quantity: item.quantity - 1 },
          { withCredentials: true }
        );
      } else if (item && item.quantity === 1) {
        await apiClient.delete(`/api/cartItem/cart-items/${item.id}`, {
          withCredentials: true,
        });
      }
    } catch (error) {
      console.error('Erreur lors de la décrémentation de l\'article :', error);
    }
  };

  // Supprimer un article du panier
  const removeArticle = async (productId: number) => {
    const updatedPanier = panier.filter((item) => item.product_fk !== productId);
    setPanier(updatedPanier);
    recalculateTotals(updatedPanier);

    try {
      const item = panier.find((item) => item.product_fk === productId);
      if (item) {
        await apiClient.delete(`/api/cartItem/cart-items/${item.id}`, {
          withCredentials: true,
        });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article :', error);
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
        setPanier,
        recalculateTotals, // Ajoutez recalculateTotals ici
        
      }}
    >
      {children}
    </PanierContext.Provider>
  );
};
