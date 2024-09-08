import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

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
  const [favorites, setFavorites] = useState<Article[]>(() => {
    // Charger les favoris depuis localStorage
    const storedFavorites = localStorage.getItem('favorites');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  useEffect(() => {
    // Sauvegarder les favoris dans localStorage à chaque mise à jour
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (article: Article) => {
    setFavorites((prevFavorites) => {
      const isAlreadyFavorite = prevFavorites.some(fav => fav.id === article.id);
      if (!isAlreadyFavorite) {
        const updatedFavorites = [...prevFavorites, article];
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        return updatedFavorites;
      }
      return prevFavorites;
    });
  };

  const removeFavorite = (id: number) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.filter(fav => fav.id !== id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
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
