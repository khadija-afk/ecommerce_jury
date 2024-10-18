import React, { useContext, useEffect, useState } from 'react';
import { PanierContext } from "../../utils/PanierContext";
import axios from 'axios';
import Checkout from '../checkout/Checkout'
import './Panier.css'; // Importer le fichier CSS

const Panier = () => {
    const { incremente, decremente, priceArticleByQuantity, totalArticle, panier, totalPrice, setPanier } = useContext(PanierContext);

    // Récupérer le panier de l'utilisateur
    const fetchCartByUser = async () => {
        try {
            const response = await axios.get('/api/api/cart/cart', {
                withCredentials: true // Envoyer les cookies dans la requête
            });
            const data = response.data;
            console.log("Données du panier reçues : ", data);
            setPanier(data.cartItems);  // Mettre à jour le contexte avec les articles du panier
        } catch (error) {
            console.error('Erreur lors de la récupération du panier', error);
        }
    };

    // Recalculer le prix total
    const recalculateTotalPrice = () => {
        const total = panier.reduce((acc, item) => {
            const itemPrice = item.article?.price || 0;  // Utiliser la propriété 'article'
            return acc + itemPrice * item.quantity;
        }, 0);
        return total.toFixed(2);
    };

    // Charger le panier au montage du composant
    useEffect(() => {
        fetchCartByUser();
    }, []);

    // Supprimer un article
    const handleRemoveArticle = async (index) => {
        try {
            const cartItemId = panier[index]?.id;
            if (!cartItemId) return;

            await axios.delete(`/api/cartItem/cart-items/${cartItemId}`, {
                withCredentials: true
            });

            const newPanier = panier.filter((_, i) => i !== index);
            setPanier(newPanier);
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'article', error);
        }
    };

    return (
        <section>
            {panier.length > 0 ? (
                <>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Photo</th>
                                <th>Produit</th>
                                <th>Prix Unitaire</th>
                                <th>Quantité</th>
                                <th>Prix Total</th>
                                <th>Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {panier.map((cartItem, index) => (
                                <tr key={index}>
                                    <td>
                                        {cartItem?.article?.photo?.[0] ? (
                                            <img
                                                src={cartItem.article.photo[0]}
                                                alt={cartItem.article.name}
                                            />
                                        ) : (
                                            <span>Pas d'image</span>
                                        )}
                                    </td>
                                    <td>{cartItem?.article?.name || "Nom du produit manquant"}</td>
                                    <td>{cartItem?.article?.price ? `${cartItem.article.price} $` : "Prix non disponible"}</td>
                                    <td>
                                        <div className="quantityContainer">
                                            <button className="buttonquantite" onClick={() => decremente(index)}>-</button>
                                            <span className="quantityValue">{cartItem.quantity}</span>
                                            <button className="buttonquantite" onClick={() => incremente(index)}>+</button>
                                        </div>
                                    </td>
                                    <td>{(cartItem?.article?.price * cartItem.quantity)?.toFixed(2) || "0.00"} $</td>
                                    <td>
                                        <button className="removeButton" onClick={() => handleRemoveArticle(index)}>Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="totalContainer">
                        <p>Total du panier : {recalculateTotalPrice()} $</p>
                    </div>

                    <Checkout />
                </>
            ) : (
                <p>Panier Vide !</p>
            )}
        </section>
    );
};

export default Panier;
