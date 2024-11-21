import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PanierContext } from "../../utils/PanierContext";
import apiClient from '../../utils/axiosConfig';
import './Panier.css';

const Panier = () => {
    const { incremente, decremente, panier, setPanier } = useContext(PanierContext);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Récupérer le panier de l'utilisateur
    const fetchCartByUser = async () => {
        try {
            const response = await apiClient.get('/api/api/cart/cart', { withCredentials: true });
            const data = response.data;
            setPanier(data.cartItems);
        } catch (error) {
            console.error('Erreur lors de la récupération du panier', error);
        }
    };

    // Recalculer le prix total
    const recalculateTotalPrice = (): number => {
        return panier.reduce((acc, item) => {
            const itemPrice = item.article?.price || 0;
            return acc + itemPrice * item.quantity;
        }, 0);
    };

    // Valider le panier
    const validateCart = async () => {
        try {
            const orderTotal = recalculateTotalPrice();

            const response = await apiClient.post('api/api/order/orders', {
                total: orderTotal,
            }, { withCredentials: true });

            const orderId = response.data.orderId;
            navigate(`/checkout/${orderId}`);
        } catch (error) {
            setErrorMessage("Une erreur est survenue lors de la validation du panier.");
            console.error('Erreur lors de la validation du panier', error);
        }
    };

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
                                    <td>{cartItem?.article?.price ? `${cartItem.article.price} €` : "Prix non disponible"}</td>
                                    <td>
                                        <div className="quantity-container">
                                            <button className="button" onClick={() => decremente(index)}>-</button>
                                            <span>{cartItem.quantity}</span>
                                            <button className="button" onClick={() => incremente(index)}>+</button>
                                        </div>
                                    </td>
                                    <td>{(cartItem?.article?.price * cartItem.quantity)?.toFixed(2) || "0.00"} €</td>
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
