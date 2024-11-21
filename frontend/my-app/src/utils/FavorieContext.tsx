import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import apiClient from './axiosConfig';
import { useAuth } from './AuthCantext';

interface Article {
  id: number;
  name: string;
  photo: string;
  price: number;
}

interface FavorisContextType {
  favorites: Article[];
  addFavorite: (article: Article) => void;
  removeFavorite: (id: number) => void;
  totalFavorites: () => number;
}

export const FavorisContext = createContext<FavorisContextType | undefined>(undefined);

export const useFavoris = () => {
  const context = useContext(FavorisContext);
  if (!context) {
    throw new Error('useFavoris must be used within a FavorisProvider');
  }
  return context;
};

export const FavorisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<Article[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      setFavorites([]); // Réinitialiser les favoris si déconnecté
      return;
    }

    const fetchFavorites = async () => {
      try {
        const response = await apiClient.get('/api/api/favorie', { withCredentials: true });
        setFavorites(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des favoris :', error);
      }
    };

    fetchFavorites();
  }, [isAuthenticated]);

  const addFavorite = async (article: Article) => {
    if (!isAuthenticated) {
      console.warn('Non authentifié : impossible d\'ajouter aux favoris.');
      return;
    }
    try {
      await apiClient.post('/api/api/favorie', { product_fk: article.id }, { withCredentials: true });
      setFavorites((prev) => [...prev, article]);
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris :', error);
    }
  };

  const removeFavorite = async (id: number) => {
    if (!isAuthenticated) {
      console.warn('Non authentifié : impossible de supprimer des favoris.');
      return;
    }
    try {
      await apiClient.delete(`/api/api/favorie/${id}`, { withCredentials: true });
      setFavorites((prev) => prev.filter((fav) => fav.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression du favori :', error);
    }
  };

  const totalFavorites = () => favorites.length;

  return (
    <FavorisContext.Provider value={{ favorites, addFavorite, removeFavorite, totalFavorites }}>
      {children}
    </FavorisContext.Provider>
  );
};
