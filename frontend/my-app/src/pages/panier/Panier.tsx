import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PanierContext } from "../../utils/PanierContext";
import apiClient from '../../utils/axiosConfig';
import './Panier.css';

const Panier = () => {
    const { incremente, decremente, panier, setPanier, removeArticle } = useContext(PanierContext);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Récupérer le panier de l'utilisateur
    const fetchCartByUser = async () => {
        try {
            const response = await apiClient.get('/api/api/cart/cart', { withCredentials: true });
            setPanier(response.data.cartItems || []);
        } catch (error) {
            console.error('Erreur lors de la récupération du panier :', error);
        }
    };

    // Recalculer le prix total
    const recalculateTotalPrice = (): number => {
        return panier.reduce((acc, item) => acc + (item.article?.price || 0) * item.quantity, 0);
    };

    // Valider le panier
    const validateCart = async () => {
        try {
            const orderItems = panier.map((item) => ({
                product_fk: item.product_fk,
                quantity: item.quantity,
                price: item.article.price,
            }));

            const response = await apiClient.post('/api/api/order/orders', {
                total: recalculateTotalPrice(),
                items: orderItems,
            }, { withCredentials: true });

            const orderId = response.data.orderId;
            navigate(`/checkout/${orderId}`);
        } catch (error) {
            setErrorMessage("Une erreur est survenue lors de la validation du panier.");
            console.error('Erreur lors de la validation du panier :', error);
        }
    };

    // Charger les données du panier au montage
    useEffect(() => {
        fetchCartByUser();
    }, []);

    return (
        <section className="panier-section">
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
                                <tr key={cartItem.product_fk}>
                                    <td>
                                        {cartItem.article?.photo?.[0] ? (
                                            <img
                                                src={cartItem.article.photo[0]}
                                                alt={cartItem.article.name}
                                            />
                                        ) : (
                                            <span>Pas d'image</span>
                                        )}
                                    </td>
                                    <td>{cartItem.article?.name || "Nom du produit manquant"}</td>
                                    <td>{cartItem.article?.price ? `${cartItem.article.price} €` : "Prix non disponible"}</td>
                                    <td>
                                        <div className="quantity-container">
                                            <button
                                                className="button"
                                                onClick={() => decremente(cartItem.product_fk)}
                                            >
                                                -
                                            </button>
                                            <span>{cartItem.quantity}</span>
                                            <button
                                                className="button"
                                                onClick={() => incremente(cartItem.product_fk)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td>{(cartItem.article?.price * cartItem.quantity)?.toFixed(2) || "0.00"} €</td>
                                    <td>
                                        <button
                                            className="removeButton"
                                            onClick={() => removeArticle(cartItem.product_fk)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="cart-summary">
                        <button className="checkoutButton" onClick={validateCart}>
                            Valider le panier - Total : {recalculateTotalPrice().toFixed(2)} €
                        </button>
                    </div>
                </>
            ) : (
                <div className="empty-cart">
                    <p>Votre panier est vide !</p>
                </div>
            )}

            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </section>
    );
};

export default Panier;
