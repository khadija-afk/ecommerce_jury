import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import { PanierContext, PanierContextType } from '../../utils/PanierContext';
import apiClient from '../../utils/axiosConfig';
import './Panier.css';

const Panier = () => {
    const { incremente, decremente, panier, setPanier, removeArticle } = useContext(PanierContext) as PanierContextType;

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Récupérer le panier de l'utilisateur
    const fetchCartByUser = async () => {
        try {
            
           
                
         

            const response = await apiClient.get('/api/cart/cart', {
                withCredentials: true, // Assurez-vous que les cookies sont inclus
            });

            if (response.data && response.data.cartItems) {
                setPanier(response.data.cartItems || []);
            } else {
                console.warn('Aucune donnée de panier reçue.');
                setPanier([]);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du panier :', error);
            setErrorMessage('Impossible de récupérer les données du panier.');
        }
    };

    // Recalculer le prix total
    const recalculateTotalPrice = (): number => {
        return panier.reduce(
            (acc, item) => acc + (item.article?.price || 0) * item.quantity,
            0
        );
    };

    // Valider le panier
    const validateCart = async () => {
        try {
            const orderItems = panier.map((item) => ({
                product_fk: item.product_fk,
                quantity: item.quantity,
                price: item.article?.price || 0,
            }));

            const response = await apiClient.post(
                '/api/order/orders',
                {
                    total: recalculateTotalPrice(),
                    items: orderItems,
                },
                { withCredentials: true }
            );

            const orderId = response.data.orderId;
            navigate(`/checkout/${orderId}`);
        } catch (error) {
            console.error('Erreur lors de la validation du panier :', error);
            setErrorMessage(
                "Une erreur est survenue lors de la validation du panier. Veuillez réessayer."
            );
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
                    <div className="table-responsive">
                        <table>
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
                                {panier.map((cartItem) => (
                                    <tr key={cartItem.product_fk}>
                                        <td>
                                            {cartItem.article?.photo ? (
                                                <img
                                                    src={cartItem.article.photo}
                                                    alt={cartItem.article.name}
                                                />
                                            ) : (
                                                <span>Pas d'image</span>
                                            )}
                                        </td>
                                        <td>{cartItem.article?.name || "Nom non disponible"}</td>
                                        <td>
                                            {cartItem.article?.price
                                                ? `${cartItem.article.price} €`
                                                : "Non disponible"}
                                        </td>
                                        <td>
                                            <div className="quantity-control" >
                                                <button className='button'
                                                    
                                                    onClick={() =>
                                                        decremente(cartItem.product_fk)
                                                    }
                                                    title="Diminuer la quantité"
                                                >
                                                <FontAwesomeIcon icon={faMinus} />
                                                </button>
                                                <span className="quantity">{cartItem.quantity}</span>
                                                <button  className='button'
                                                    
                                                    onClick={() =>
                                                        incremente(cartItem.product_fk)
                                                    }
                                                     title="Augmenter la quantité"
                                                >
                                                <FontAwesomeIcon icon={faPlus} />
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            {(
                                                (cartItem.article?.price || 0) *
                                                cartItem.quantity
                                            ).toFixed(2)}{' '}
                                            €
                                        </td>
                                        <td data-label="Supprimer">
                                            <button
                                                className="removeButton"
                                                onClick={() => removeArticle(cartItem.product_fk)}
                                            >
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

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
