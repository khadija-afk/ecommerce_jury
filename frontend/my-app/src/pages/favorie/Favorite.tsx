import React, { useContext, useEffect } from 'react';
import { FavorisContext } from "../../utils/FavorieContext";
import { usePanier } from '../../utils/PanierContext';
import './Favorite.css';

const Favoris = () => {
  const { favorites, removeFavorite, totalFavorites } = useContext(FavorisContext);
  const { addPanier } = usePanier();

  useEffect(() => {
    console.log("Favoris data:", favorites); // Pour afficher la structure des données dans la console
  }, [favorites]);

  return (
    <section>
      {favorites.length > 0 ? (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Contenu</th>
                <th>Prix</th>
                <th>Date ajoutée</th>
                <th>Ajouter au panier</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
                            {favorites.map((favorite, index) => (
                                <tr key={index}>
                                <td data-label="Photo">
                                    {/* Assurez-vous que `photo` est un tableau et contient au moins un élément */}
                                    {Array.isArray(favorite.Article.photo) && favorite.Article.photo.length > 0 ? (
                                    <img src={favorite.Article.photo[0]} alt={favorite.Article.name} />
                                    ) : (
                                    <span>Image non disponible</span>
                                    )}
                                </td>
                                <td data-label="Contenu">{favorite.Article.name}</td>
                                <td data-label="Prix">{favorite.Article.price} €</td>
                                <td data-label="Date ajoutée">
                                    {new Date(favorite.createdAt).toLocaleDateString()}
                                </td>
                                <td data-label="Ajouter au panier">
                                    <button className="button" onClick={() => addPanier(favorite.Article)}>
                                    Ajouter au panier
                                    </button>
                                </td>
                                <td data-label="Supprimer">
                                    <button
                                    className="removeButton"
                                    onClick={() => removeFavorite(favorite.id)}
                                    ></button>
                                </td>
                                </tr>
                            ))}
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
