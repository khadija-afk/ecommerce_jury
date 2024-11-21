import React, { useContext, useEffect } from 'react';
import { FavorisContext } from "../../utils/FavorieContext";
import { usePanier } from '../../utils/PanierContext';
import './Favorite.css';

const Favoris = () => {
  const { favorites, removeFavorite } = useContext(FavorisContext);
  const { addPanier } = usePanier();

  useEffect(() => {
    console.log("Favoris data:", favorites); // Affiche la structure des données dans la console
  }, [favorites]);

  return (
    <section>
      {favorites.length > 0 ? (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Nom</th>
                <th>Prix</th>
                <th>Date ajoutée</th>
                <th>Ajouter au panier</th>
                <th>Supprimer</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map((favorite, index) => {
                // Déterminez si les données se trouvent dans `Article` ou directement dans l'objet
                const article = favorite.Article || favorite;

                // Vérifiez si l'article est valide
                if (!article) {
                  console.warn("Article manquant dans le favori :", favorite);
                  return null; // Ignorez les favoris sans article
                }

                // Sélectionnez la première photo si elle existe
                const photoUrl = Array.isArray(article.photo) && article.photo.length > 0
                  ? article.photo[0].split(",")[0].trim() // Prenez la première photo et nettoyez les espaces
                  : "default-image-url.jpg"; // Image par défaut

                return (
                  <tr key={index}>
                    <td data-label="Photo">
                      <img src={photoUrl} alt={article.name} />
                    </td>
                    <td data-label="Nom">{article.name}</td>
                    <td data-label="Prix">{article.price} €</td>
                    <td data-label="Date ajoutée">
                      {new Date(favorite.createdAt).toLocaleDateString()}
                    </td>
                    <td data-label="Ajouter au panier">
                      <button
                        className="button"
                        onClick={() => addPanier(article)}
                      >
                        Ajouter au panier
                      </button>
                    </td>
                    <td data-label="Supprimer">
                      <button
                        className="removeButton"
                        onClick={() => removeFavorite(article.id)}
                      >
                        
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      ) : (
        <p>Pas de favoris !</p>
      )}
    </section>
  );
};

export default Favoris;
