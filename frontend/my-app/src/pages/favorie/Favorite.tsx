import React, { useContext } from 'react';
import { FavorisContext } from "../../utils/FavorieContext";
import { usePanier } from '../../utils/PanierContext'; // Pour ajouter au panier
import './Favorite.css'; // Importer le fichier CSS

const Favoris = () => {
    const { favorites, removeFavorite, totalFavorites } = useContext(FavorisContext);
    const { addPanier } = usePanier(); // Utilisation du contexte du panier

    return (
        <section>
            {favorites.length > 0 ?
                <>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Photo</th>
                                <th>Nom</th>
                                <th>Contenu</th>
                                <th>Prix</th>
                                <th>Date ajoutée</th>
                                <th>Ajouter au panier</th>
                                <th> </th>
                            </tr>
                        </thead>
                        <tbody>
                            {favorites.map((article, index) => (
                                <tr key={index}>
                                    <td>
                                        <img
                                            src={article.photo}
                                            alt={article.name}
                                        />
                                    </td>
                                    <td>{article.name}</td>
                                    <td>{article.content}</td>
                                    <td>{article.price} €</td>
                                    <td>{new Date().toLocaleDateString()}</td> {/* Supposons que c'est la date actuelle */}
                                    <td>
                                        <button className="button" onClick={() => addPanier(article)}>Ajouter au panier</button>
                                    </td>

                                    <td>
                                    <button className="removeButton" onClick={() => removeFavorite(article.id)}></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="totalContainer">
                        <p>Total des favoris : {totalFavorites()} articles</p>
                    </div>
                </>
                :
                <p>Pas de favoris !</p>
            }
        </section>
    );
}

export default Favoris;
