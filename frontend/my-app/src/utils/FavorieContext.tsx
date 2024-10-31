import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import apiClient from './axiosConfig';

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

// Fonction pour vérifier si le cookie d'authentification existe
const isAuthenticated = () => {
  return document.cookie.split(';').some((cookie) => cookie.trim().startsWith('authCookie='));
};

export const FavorisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Article[]>([]);

  useEffect(() => {
    // Ne pas effectuer la récupération si l'utilisateur n'est pas authentifié
    if (!isAuthenticated()) return;

    const fetchFavorites = async () => {
      try {
        const response = await apiClient.get('api/api/favorie');
        setFavorites(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des favoris :", error);
      }
    };

    fetchFavorites();
  }, []);

  const addFavorite = async (article: Article) => {
    if (!isAuthenticated()) {
      console.warn("Non authentifié : impossible d'ajouter aux favoris.");
      return;
    }
    try {
      await apiClient.post('api/api/favorie', { product_fk: article.id });
      setFavorites((prevFavorites) => [...prevFavorites, article]);
    } catch (error) {
      console.error("Erreur lors de l'ajout aux favoris :", error);
    }
  };

  const removeFavorite = async (id: number) => {
    if (!isAuthenticated()) {
      console.warn("Non authentifié : impossible de supprimer des favoris.");
      return;
    }
    try {
      await apiClient.delete(`api/api/favorie/${id}`);
      setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression du favori :", error);
    }
  };

  const totalFavorites = () => {
    return favorites.length;
  };

  return (
    <FavorisContext.Provider value={{ favorites, addFavorite, removeFavorite, totalFavorites }}>
      {children}
    </FavorisContext.Provider>
  );
};
