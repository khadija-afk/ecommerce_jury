import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { debounce } from 'lodash';

// Définition du type d'article
interface Article {
  id: number;
  name: string;
  price: number;
  quantite: number;
  // Ajoutez d'autres propriétés nécessaires
}

// Définition du type du contexte
interface PanierContextType {
  panier: Article[];
  totalPrice: number;
  totalArticle: number;
  addPanier: (product: Article) => void;
  incremente: (index: number) => void;
  decremente: (index: number) => void;
  removeArticle: (index: number) => void;
  priceArticleByQuantity: (price: number, quantity: number) => number;
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
  const [panier, setPanier] = useState<Article[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Charger le panier depuis le localStorage
  useEffect(() => {
    const loadPanier = async () => {
      try {
        const panierJSON = localStorage.getItem("panier");
        if (panierJSON) {
          setPanier(JSON.parse(panierJSON));
        }
      } catch (error) {
        console.error('Error loading panier:', error);
      }
    };
    loadPanier();
  }, []);

  // Mettre à jour le prix total lorsque le panier change
  useEffect(() => {
    const total = panier.reduce((acc, item) => acc + item.quantite * item.price, 0);
    setTotalPrice(parseFloat(total.toFixed(2)));
  }, [panier]);

  // Fonction pour sauvegarder le panier dans le localStorage après un délai
  const savePanierToLocalStorage = debounce((nouveauPanier: Article[]) => {
    localStorage.setItem('panier', JSON.stringify(nouveauPanier));
  }, 1000);

  // Fonction pour obtenir le nombre total d'articles dans le panier
  const totalArticle = () => panier.reduce((acc, item) => acc + item.quantite, 0);

  // Fonction pour calculer le prix total d'un article en fonction de sa quantité
  const priceArticleByQuantity = (price: number, quantity: number) => parseFloat((price * quantity).toFixed(2));

  // Fonction pour ajouter un article au panier
  const addPanier = async (product: Article) => {
    try {
      const panierJSON = localStorage.getItem("panier");
      let nouveauPanier: Article[] = panierJSON ? JSON.parse(panierJSON) : [];
  
      const articleFinded = nouveauPanier.find(item => item.id === product.id);
  
      if (articleFinded) {
        articleFinded.quantite += 1;
      } else {
        nouveauPanier.push({ ...product, quantite: 1 });
      }
  
      setPanier(nouveauPanier);
      savePanierToLocalStorage(nouveauPanier);
    } catch (error) {
      console.error('Error adding item to panier:', error);
    }
  };

  // Fonction pour incrémenter la quantité d'un article dans le panier
  const incremente = (index: number) => {
    const nouveauPanier = [...panier];
    nouveauPanier[index].quantite++;
    setPanier(nouveauPanier);
    savePanierToLocalStorage(nouveauPanier);
  };

  // Fonction pour décrémenter la quantité d'un article dans le panier
  const decremente = (index: number) => {
    const nouveauPanier = [...panier];
    if (nouveauPanier[index].quantite > 1) {
      nouveauPanier[index].quantite--;
      setPanier(nouveauPanier);
      savePanierToLocalStorage(nouveauPanier);
    }
  };

  // Fonction pour supprimer un article du panier
  const removeArticle = (index: number) => {
    const nouveauPanier = panier.filter((_, i) => i !== index);
    setPanier(nouveauPanier);
    savePanierToLocalStorage(nouveauPanier);
  };

  // Retour du fournisseur de contexte avec les valeurs et les enfants
  return (
    <PanierContext.Provider value={{
      panier,
      totalPrice,
      totalArticle,
      addPanier,
      incremente,
      decremente,
      removeArticle,
      priceArticleByQuantity
    }}>
      {children}
    </PanierContext.Provider>
  );
};
