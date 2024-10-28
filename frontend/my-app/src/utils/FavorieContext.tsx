import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import apiClient from './axiosConfig'; // Importez votre configuration Axios

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
  const [favorites, setFavorites] = useState<Article[]>([]);

  useEffect(() => {
    // Charger les favoris depuis le backend au chargement du composant
    const fetchFavorites = async () => {
      try {
        const response = await apiClient.get('api/api/favorie'); // Remplacez par l'endpoint de votre API
        setFavorites(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des favoris :", error);
      }
    };

    fetchFavorites();
  }, []);

  const addFavorite = async (article: Article) => {
    try {
      await apiClient.post('api/api/favorie', { product_fk: article.id }); // Ajoutez l'article aux favoris via l'API
      setFavorites((prevFavorites) => [...prevFavorites, article]);
    } catch (error) {
      console.error("Erreur lors de l'ajout aux favoris :", error);
    }
  };

  const removeFavorite = async (id: number) => {
    try {
      await apiClient.delete(`api/api/favorie/${id}`); // Supprimez l'article des favoris via l'API
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
