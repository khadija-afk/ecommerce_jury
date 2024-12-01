import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import apiClient from './axiosConfig';
import { useAuth } from './AuthCantext';


export interface Article {
  id: number; // ID unique de l'article
  name: string;
  photo: string[];
  price: number;
  content: string; // Description obligatoire
  createdAt?: string; // Optionnel si ce champ n'est pas toujours présent
}

export interface FavorisContextType {
  favorites: Article[]; // Liste des articles favoris
  addFavorite: (article: Article) => void; // Ajouter un favori
  removeFavorite: (product_fk: number) => void; // Supprimer un favori par ID
  isFavorite: (product_fk: number) => boolean; // Vérifier si un article est dans les favoris
  totalFavorites: () => number; // Nombre total de favoris
  setFavorites: React.Dispatch<React.SetStateAction<Article[]>>; // Fonction pour mettre à jour les favoris
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
        const response = await apiClient.get('/api/favorie', { withCredentials: true });
        if (response.data && Array.isArray(response.data)) {
          setFavorites(response.data.map((fav: any) => fav.Article)); // Mappage des articles favoris
          console.log('Favoris récupérés avec succès :', response.data);
        } else {
          console.warn('Réponse inattendue pour les favoris :', response.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des favoris :', error);
      }
    };

    fetchFavorites();
  }, [isAuthenticated]);

  const isFavorite = (product_fk: number): boolean => {
    return favorites.some((fav) => fav.id === product_fk);
  };

  const addFavorite = async (article: Article) => {
    if (!isAuthenticated) {
      console.warn('Non authentifié : impossible d\'ajouter aux favoris.');
      return;
    }

    if (!article || !article.id) {
      console.error('L\'article ou son ID est invalide.');
      return;
    }

    if (isFavorite(article.id)) {
      console.warn('Cet article est déjà dans vos favoris.');
      return;
    }

    try {
      const response = await apiClient.post(
        '/api/favorie',
        { product_fk: article.id },
        { withCredentials: true }
      );

      if (response.status === 201) {
        setFavorites((prev) => [...prev, article]);
        console.log(`Favori ajouté : ${article.name}`);
      } else {
        console.warn('Erreur inattendue lors de l\'ajout du favori :', response);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris :', error);
    }
  };

  const removeFavorite = async (product_fk: number) => {
    if (!isAuthenticated) {
      console.warn('Non authentifié : impossible de supprimer des favoris.');
      return;
    }

    try {
      await apiClient.delete(`/api/favorie/${product_fk}`, { withCredentials: true });

      setFavorites((prev) => prev.filter((fav) => fav.id !== product_fk));
      console.log(`Favori avec product_fk=${product_fk} supprimé avec succès.`);
    } catch (error) {
      console.error('Erreur lors de la suppression du favori :', error);
    }
  };

  const totalFavorites = () => favorites.length;

  return (
    <FavorisContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        totalFavorites,
        setFavorites,
      }}
    >
      {children}
    </FavorisContext.Provider>
  );
};
