import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

// Définition du type d'article
interface Article {
  id: number;
  name: string;
  price: number;
  quantity: number;
  // Ajoutez d'autres propriétés nécessaires
}

// Définition du type du contexte
interface PanierContextType {
  panier: Article[];
  totalPrice: number;
  totalArticle: () => number;
  addPanier: (product: Article) => void;
  incremente: (index: number) => void;
  decremente: (index: number) => void;
  removeArticle: (index: number) => void;
  priceArticleByQuantity: (price: number, quantity: number) => number;
  setPanier: React.Dispatch<React.SetStateAction<Article[]>>; // Assurez-vous de l'inclure ici
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

  // Fonction pour recalculer le prix totale

  const recalculateTotalPrice = (panier: Article[]) => {
    const total = panier.reduce((acc, item) => {
        const articleData = item.article || {}; // Accède à l'objet article imbriqué
        const price = articleData.price || 0;   // Récupère le prix depuis item.article
        const quantity = item.quantity || 1;    // Utilise la quantité de l'article
        const itemTotal = price * quantity;

        console.log(`Article: ${articleData.name || 'Inconnu'}, Prix: ${price}, Quantité: ${quantity}, Total Article: ${itemTotal}`);

        return acc + itemTotal;
    }, 0);
    return parseFloat(total.toFixed(2));
};




  // Charger le panier depuis le localStorage
  useEffect(() => {
    const loadPanier = async () => {
        try {
            const panierJSON = localStorage.getItem("panier");
            if (panierJSON) {
                const panierData = JSON.parse(panierJSON);
                console.log("Panier chargé : ", panierData);  // Vérifier les données du panier
                setPanier(panierData);
            }
        } catch (error) {
            console.error('Error loading panier:', error);
        }
    };
    loadPanier();
}, []);

  // Recalcul du prix total du panier lorsque le panier change
  useEffect(() => {
    setTotalPrice(recalculateTotalPrice(panier));
  }, [panier]);

  // Fonction pour sauvegarder le panier dans le localStorage après un délai
  const savePanierToLocalStorage = debounce((nouveauPanier: Article[]) => {
    localStorage.setItem('panier', JSON.stringify(nouveauPanier));
  }, 1000);

  // Fonction pour obtenir le nombre total d'articles dans le panier
  const totalArticle = () => panier.reduce((acc, item) => acc + item.quantity, 0);

  // Fonction pour calculer le prix total d'un article en fonction de sa quantité
  const priceArticleByQuantity = (price: number, quantity: number) => parseFloat((price * quantity).toFixed(2));

  // Fonction pour ajouter un article au panier
  const addPanier = async (product: Article) => {
    try {
      const panierJSON = localStorage.getItem("panier");
      let nouveauPanier: Article[] = panierJSON ? JSON.parse(panierJSON) : [];
  
      const articleFinded = nouveauPanier.find(item => item.id === product.id);
  
      if (articleFinded) {
        articleFinded.quantity += 1;
      } else {
        nouveauPanier.push({ ...product, quantity: 1 });
      }
  
      setPanier(nouveauPanier);
      savePanierToLocalStorage(nouveauPanier);
    } catch (error) {
      console.error('Error adding item to panier:', error);
    }
  };

  const incremente = async (index: number) => {
    const updatedCartItem = { ...panier[index], quantity: panier[index].quantity + 1 };
    const updatedPanier = [...panier];
    updatedPanier[index] = updatedCartItem;
    
    // Mettez à jour l'état local immédiatement
    setPanier(updatedPanier);
    setTotalPrice(recalculateTotalPrice(updatedPanier)); // Recalculez le total

    // Mettez à jour le serveur pour synchroniser la quantité
    try {
        await axios.put(`http://localhost:9090/api/cartItem/cart-items/${updatedCartItem.id}`, {
            quantity: updatedCartItem.quantity
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la quantité sur le serveur :', error);
        // Si une erreur se produit, rétablir l'état précédent
        updatedCartItem.quantity -= 1;
        setPanier(updatedPanier);
        setTotalPrice(recalculateTotalPrice(updatedPanier)); // Réinitialiser le total
    }
};

const decremente = async (index: number) => {
  if (panier[index].quantity <= 1) return; // Empêche la quantité d'aller en dessous de 1

  const updatedCartItem = { ...panier[index], quantity: panier[index].quantity - 1 };
  const updatedPanier = [...panier];
  updatedPanier[index] = updatedCartItem;

  // Mettez à jour l'état local immédiatement
  setPanier(updatedPanier);
  setTotalPrice(recalculateTotalPrice(updatedPanier)); // Recalculez le total

  // Mettez à jour le serveur pour synchroniser la quantité
  try {
      await axios.put(`http://localhost:9090/api/cartItem/cart-items/${updatedCartItem.id}`, {
          quantity: updatedCartItem.quantity
      });
  } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité sur le serveur :', error);
      // Si une erreur se produit, rétablir l'état précédent
      updatedCartItem.quantity += 1;
      setPanier(updatedPanier);
      setTotalPrice(recalculateTotalPrice(updatedPanier));  // Réinitialiser le total
  }
};

  // Fonction pour supprimer un article du panier
  const removeArticle = (index: number) => {
    const nouveauPanier = panier.filter((_, i) => i !== index);
    setPanier(nouveauPanier);
    setTotalPrice(recalculateTotalPrice(nouveauPanier));  // Recalculer le total après suppression
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
      priceArticleByQuantity,
      setPanier // Inclure ici
    }}>
      {children}
    </PanierContext.Provider>
  );
};
