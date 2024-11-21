import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import apiClient from './axiosConfig';
import { useAuth } from './AuthCantext';

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

export const PanierProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [panier, setPanier] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const recalculateTotalPrice = (panier: CartItem[]) => {
    return panier.reduce((acc, item) => acc + item.article.price * item.quantity, 0);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setPanier([]); // Réinitialisez le panier si déconnecté
      setTotalPrice(0);
      return;
    }

    const loadPanier = async () => {
      try {
        const response = await apiClient.get('/api/api/cart/cart', { withCredentials: true });
        setPanier(response.data.cartItems || []);
        setTotalPrice(recalculateTotalPrice(response.data.cartItems || []));
      } catch (error) {
        console.error('Erreur lors du chargement du panier :', error);
      }
    };

    loadPanier();
  }, [isAuthenticated]);

  const totalArticle = () => panier.reduce((acc, item) => acc + item.quantity, 0);

  const addPanier = async (product: Article) => {
    if (!isAuthenticated) {
      console.warn('Non authentifié : impossible d\'ajouter au panier.');
      return;
    }
    try {
      const response = await apiClient.post(
        '/api/api/cartItem/cart-items',
        { product_fk: product.id, quantity: 1 },
        { withCredentials: true }
      );
      setPanier((prev) => [...prev, { ...response.data, article: product }]);
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier :', error);
    }
  };

  return (
    <PanierContext.Provider value={{ panier, totalPrice, totalArticle, addPanier, incremente: () => {}, decremente: () => {}, removeArticle: () => {}, setPanier }}>
      {children}
    </PanierContext.Provider>
  );
};
