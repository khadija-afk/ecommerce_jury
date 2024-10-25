import React, { useContext } from 'react';
import { FavorisContext } from "../../utils/FavorieContext";
import { usePanier } from '../../utils/PanierContext'; // Pour ajouter au panier
import './Favorite.css'; // Importer le fichier CSS

const Favoris = () => {
    const { favorites, removeFavorite, totalFavorites } = useContext(FavorisContext);
    const { addPanier } = usePanier(); // Utilisation du contexte du panier

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
                            {favorites.map((article, index) => (
                                <tr key={index}>
                                    <td data-label="Photo">
                                        <img src={article.photo} alt={article.name} />
                                    </td>
                                    <td data-label="Contenu">{article.content}</td>
                                    <td data-label="Prix">{article.price} €</td>
                                    <td data-label="Date ajoutée">
                                        {new Date().toLocaleDateString()}
                                    </td>
                                    <td data-label="Ajouter au panier">
                                        <button className="button" onClick={() => addPanier(article)}>
                                            Ajouter au panier
                                        </button>
                                    </td>
                                    <td data-label="Supprimer">
                                        <button
                                            className="removeButton"
                                            onClick={() => removeFavorite(article.id)}
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
