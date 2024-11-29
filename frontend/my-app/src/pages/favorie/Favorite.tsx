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
        <div className="table-responsive">
         {/* Utilisation de table-responsive */}
          <table >
            
            <thead>
              <tr>
                <th >Photo</th>
                <th >Nom</th>
                <th >Prix</th>
                <th >Date ajoutée</th>
                <th >Ajouter au panier</th>
                <th >Supprimer</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map((favorite, index) => {
                const article = favorite.Article || favorite;

                if (!article) {
                  console.warn("Article manquant :", favorite);
                  return null;
                }

                const photoUrl = Array.isArray(article.photo) && article.photo.length > 0
                  ? article.photo[0].split(",")[0].trim()
                  : "default-image-url.jpg";

                return (
                  <tr key={index}>
                    <td data-label="Photo">
                      <img src={photoUrl} alt={article.name} style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                    </td>
                    <td data-label="Nom" >{article.name}</td>
                    <td data-label="Prix">{article.price} €</td>
                    <td data-label="Date ajoutée" >
                      {new Date(favorite.createdAt).toLocaleDateString()}
                    </td>
                    <td data-label="Ajouter au panier">
                      <button className="button" onClick={() => addPanier(article)}>
                        Ajouter au panier
                      </button>
                    </td>
                    <td data-label="Supprimer" >
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
          
        </div>
      ) : (
        <div className="empty-favoris">
          <p>Votre favoris est vide!</p>
        </div>
      )}
    </section>
  );
};

export default Favoris;
