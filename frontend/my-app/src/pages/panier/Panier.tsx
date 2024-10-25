import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Utilisé pour la redirection
import { PanierContext } from "../../utils/PanierContext";
import apiClient from '../../utils/axiosConfig';
import './Panier.css';

const Panier = () => {
    const { incremente, decremente, totalArticle, panier, totalPrice, setPanier } = useContext(PanierContext);
    const [shippingCost, setShippingCost] = useState(15.00); // Exemple de frais de livraison fixe
    const [shippingMethod, setShippingMethod] = useState('Tarif forfaitaire'); // Méthode d'expédition par défaut
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

    // Fonction pour supprimer un article du panier
    const handleRemoveCartItem = async (index) => {
        try {
            const cartItemId = panier[index]?.id; // Récupère l'ID de l'article à supprimer
            if (!cartItemId) return;

            // Supprimer l'article via l'API
            await apiClient.delete(`/api/api/cartItem/cart-items/${cartItemId}`, {
                withCredentials: true
            });

            // Mettre à jour le panier localement après suppression
            const newPanier = panier.filter((_, i) => i !== index);
            setPanier(newPanier); // Mise à jour de l'état du panier
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'article', error);
        }
    };

    // Recalculer le prix total des articles
    const recalculateTotalPrice = () => {
        const total = panier.reduce((acc, item) => {
            const itemPrice = item.article?.price || 0;
            return acc + itemPrice * item.quantity;
        }, 0);
        return total.toFixed(2);
    };

    // Calculer le total final (articles + frais d'expédition)
    const calculateFinalTotal = () => {
        const totalPrice = parseFloat(recalculateTotalPrice());
        return (totalPrice + shippingCost).toFixed(2);
    };

    useEffect(() => {
        fetchCartByUser();
    }, []);

    // Fonction pour rediriger vers la page checkout
    const proceedToCheckout = () => {
        navigate('/checkout'); // Redirige vers la page de paiement
    };

    return (
        <section className="panier-section">
            {panier.length > 0 ? (
                <div className="panier-layout">
                    {/* Table du panier à gauche */}
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
                                        <td data-label="Supprimer">
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

                    {/* Cart totals à droite */}
                    <div className="cart-totals">
                        <h3>Total du Panier</h3>
                        <p>Sous-total : {recalculateTotalPrice()} $</p>
                        <div className="shippingOptions">
                            <p>Expédition</p>
                            <p>Tarif forfaitaire: {shippingCost.toFixed(2)} $</p>
                            <p>Expédition vers CA. <a href="#">Changer d'adresse</a></p>
                        </div>
                        <p>Total : {calculateFinalTotal()} $</p>
                        <button className="checkoutButton" onClick={proceedToCheckout}>
                            Procéder au paiement
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
