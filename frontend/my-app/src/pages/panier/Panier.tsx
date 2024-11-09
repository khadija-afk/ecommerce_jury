import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Utilisé pour la redirection
import { PanierContext } from "../../utils/PanierContext";
import apiClient from '../../utils/axiosConfig';
import './Panier.css';

const Panier = () => {
    const { incremente, decremente, panier, setPanier } = useContext(PanierContext);
    const [shippingCost, setShippingCost] = useState(15.00); // Exemple de frais de livraison fixe
    const navigate = useNavigate(); // Hook pour la navigation

    // Récupérer le panier de l'utilisateur
    const fetchCartByUser = async () => {
        try {
            const response = await apiClient.get('/api/api/cart/cart', {
                withCredentials: true 
            });
            const data = response.data;
            setPanier(data.cartItems);  
        } catch (error) {
            console.error('Erreur lors de la récupération du panier', error);
        }
    };

    // Fonction pour recalculer le prix total des articles dans le panier
    const recalculateTotalPrice = () => {
        const total = panier.reduce((acc, item) => {
            const itemPrice = item.article?.price || 0;
            return acc + itemPrice * item.quantity;
        }, 0);
        return total.toFixed(2);
    };

    // Créer une commande et les articles de commande
    const createOrderWithItems = async () => {
        try {
            // Calcul du total de la commande
            const orderTotal = parseFloat(recalculateTotalPrice()) + shippingCost;
            
            // Création de la commande principale (OrderDetails)
            const orderResponse = await apiClient.post('api/api/order/orders', {
                total: orderTotal,
            }, {
                withCredentials: true
            });

            const orderId = orderResponse.data.orderId;

            // Créer les articles de commande (OrderItems) associés
            await Promise.all(
                panier.map(async (item) => {
                    return apiClient.post('api/api/orderItem/order-items', {
                        order_fk: orderId,
                        product_fk: item.article.id,
                        quantity: item.quantity,
                        price: item.article.price
                    }, {
                        withCredentials: true
                    });
                })
            );

            // Redirection vers la confirmation de commande
            navigate(`/checkout/${orderId}`);
        } catch (error) {
            console.error('Erreur lors de la création de la commande avec les articles', error);
        }
    };

    useEffect(() => {
        fetchCartByUser();
    }, []);

    return (
        <section className="panier-section">
            {panier.length > 0 ? (
                <div className="panier-layout">
                    {/* Table du panier */}
                    <div className="panier-table">
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
                                            <button
                                                className="removeButton"
                                                onClick={() => handleRemoveCartItem(index)}
                                            ></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Cart totals */}
                    <div className="cart-totals">
                        <h3>Total du Panier</h3>
                        <p>Sous-total : {recalculateTotalPrice()} $</p>
                        <div className="shippingOptions">
                            <p>Expédition</p>
                            <p>Tarif forfaitaire: {shippingCost.toFixed(2)} $</p>
                            <p>Expédition vers CA. <a href="#">Changer d'adresse</a></p>
                        </div>
                        <p>Total : {(parseFloat(recalculateTotalPrice()) + shippingCost).toFixed(2)} $</p>
                        <button className="checkoutButton" onClick={createOrderWithItems}>
                            valider panier
                        </button>
                    </div>
                </div>
            ) : (
                <p>Panier Vide !</p>
            )}
        </section>
    );
};

export default Panier;
