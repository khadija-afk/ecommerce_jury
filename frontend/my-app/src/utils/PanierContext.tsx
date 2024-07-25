import React, { createContext, useState, useEffect } from 'react'
import { debounce } from 'lodash';

// Création du contexte PanierContext
export const PanierContext = createContext()

// Création du fournisseur de contexte PanierProvider
export const PanierProvider = ({ children }) => {
  // État pour suivre si les données sont en cours de chargement
  const [isLoading, setIsLoading] = useState(false)

  // État pour stocker les articles dans le panier
  const [panier, setPanier] = useState([]);
  // État pour stocker le prix total des articles dans le panier
  const [totalPrice, setTotalPrice] = useState(0);

  // Effet pour charger le panier depuis le localStorage lorsque le composant est monté
  useEffect(() => {
    const loadPanier = async () => {
      try {
        const panierJSON = await localStorage.getItem("panier");
        if (panierJSON !== null) {
          const panierStorage = JSON.parse(panierJSON);
          setPanier(panierStorage);
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadPanier();
  }, []);

  // Effet pour calculer et mettre à jour le prix total lorsque le panier change
  useEffect(() => {
    let total = 0;
    panier.forEach(item => total += item.quantite * item.price) 
    setTotalPrice(parseFloat(total.toFixed(2)));
  }, [panier]);

  // Fonction debounce pour sauvegarder le panier dans le localStorage après une seconde
  const savePanierToLocalStorage = debounce((nouveauPanier) => {
    localStorage.setItem('panier', JSON.stringify(nouveauPanier))
  }, 1000);  

  // Fonction pour calculer le nombre total d'articles dans le panier
  const totalArticle = () => {
    let totalArticle = 0;
    panier.forEach(item => totalArticle += item.quantite);
    return totalArticle;
  }

  // Fonction pour calculer le prix total d'un article en fonction de sa quantité
  const priceArticleByQuantity = (price, quantity) => {
    const result = price * quantity
    return parseFloat(result.toFixed(2))
  }

  // Fonction pour incrémenter la quantité d'un article dans le panier
  const incremente = (index) => {
    const nouveauPanier = [...panier]
    nouveauPanier[index].quantite++
    setPanier(nouveauPanier)
    savePanierToLocalStorage(nouveauPanier)
  }

  // Fonction pour décrémenter la quantité d'un article dans le panier
  const decremente = (index) => {
    const nouveauPanier = [...panier]
    if(nouveauPanier[index].quantite > 1){
      nouveauPanier[index].quantite--
      setPanier(nouveauPanier)
      savePanierToLocalStorage(nouveauPanier)
    }
  }

  // Fonction pour supprimer un article du panier
  const removeArticle = (index) => {
    const nouveauPanier = [...panier]
    nouveauPanier.splice(index, 1)
    setPanier(nouveauPanier)
    savePanierToLocalStorage(nouveauPanier)
  }

  // Fonction pour ajouter un article au panier
  const addPanier = async (product) => {
    try {
      console.log(product)
      // Récupérer le panier depuis le storage
      const panier = await localStorage.getItem("panier");
      let nouveauPanier = [];
  
      if (panier !== null) {
        // Si le panier existe déjà dans le storage, on le convertit en tableau d'objets
        nouveauPanier = JSON.parse(panier);
        // Vérifier si l'article sélectionné existe déjà dans le panier
        const articleFinded = nouveauPanier.find(item => item.id == product.id);
  
        // si l'article existe déjà, on augmente sa quantité de 1
        if (articleFinded) {
          articleFinded.quantite += 1;
        } else {
          // sinon on ajoute l'article dans le panier
          nouveauPanier.push({ ...product, quantite: 1 });
        }
      } else {
        // sinon on ajoute l'article dans le panier
        nouveauPanier.push({ ...product, quantite: 1 });
      }
      // Enregistrer le nouveau panier dans le storage grâce à setItem
      savePanierToLocalStorage(nouveauPanier)
      setPanier(nouveauPanier);
    } catch (error) {
      console.log(error);
    }
  }

  // Retour du fournisseur de contexte avec les valeurs et les enfants
  return (
    <PanierContext.Provider value={{ incremente, decremente, addPanier, priceArticleByQuantity, totalArticle, panier, totalPrice, removeArticle }}>
      {children}
    </PanierContext.Provider>
  )
}
