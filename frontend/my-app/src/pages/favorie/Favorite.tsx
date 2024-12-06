import React, { useContext, useEffect } from 'react';
import { FavorisContext, FavorisContextType, Article } from '../../utils/FavorieContext';
import { usePanier } from '../../utils/PanierContext';
import './Favorite.css';

const Favoris: React.FC = () => {
  const { favorites, removeFavorite } = useContext(FavorisContext) as FavorisContextType;
  const { addPanier } = usePanier();

  useEffect(() => {
    console.log('Favoris data:', favorites); // Affiche la structure des données dans la console
  }, [favorites]);

  return (
    <section>
      {favorites.length > 0 ? (
        <div className="table-responsive">
          <table>
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
              {favorites.map((favorite: Article, index: number) => {
                // Validation des données
                if (!favorite) {
                  console.warn('Article manquant :', favorite);
                  return null;
                }

                const photoUrl =
                typeof favorite.photo === 'string'
                  ? favorite.photo
                  : Array.isArray(favorite.photo) && favorite.photo > 0
                  ? favorite.photo[0]
                  : 'default-image-url.jpg'; // Image par défaut

                return (
                  <tr key={index}>
                    <td data-label="Photo">
                      <img
                        src={photoUrl}
                        alt={favorite.name}
                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      />
                    </td>
                    <td data-label="Nom">{favorite.name}</td>
                    <td data-label="Prix">{favorite.price} €</td>
                    <td data-label="Date ajoutée">
                      {favorite.createdAt
                        ? new Date(favorite.createdAt).toLocaleDateString()
                        : 'Non spécifiée'}
                    </td>
                    <td data-label="Ajouter au panier">
                      <button className="button" onClick={() => addPanier(favorite)}>
                        Ajouter au panier
                      </button>
                    </td>
                    <td data-label="Supprimer">
                      <button
                        className="removeButton"
                        onClick={() => removeFavorite(favorite.id)}
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
