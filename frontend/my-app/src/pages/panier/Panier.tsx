import React, { useContext, useEffect, useState } from 'react'; 
import { PanierContext } from "../../utils/PanierContext";
import axios from 'axios';
import StripeCheckout from '../../components/stripe/StripeCheckout';
import './Panier.css'; // Importer le fichier CSS

const Panier = () => {
    const { incremente, decremente, priceArticleByQuantity, totalArticle, panier, totalPrice, setPanier } = useContext(PanierContext);
    const userId = 33; // ID de l'utilisateur

    useEffect(() => {
        const fetchPanier = async () => {
            try {
                const response = await axios.get(`http://localhost:9090/api/cart/cart/${userId}`);
                const data = response.data;
        
                if (data && data.cartItems) {
                    console.log("Données reçues du serveur :", data.cartItems);  // Vérifier les données du serveur
                    setPanier(data.cartItems);
                } else {
                    console.error('Données inattendues : cartItems ou total_amount est manquant');
                    setPanier([]);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération du panier', error);
                setPanier([]);
            }
        };
    
        fetchPanier();
    }, [userId, setPanier]);
    

    const handleRemoveArticle = async (index) => {
        try {
            const cartItemId = panier[index]?.id;
            if (!cartItemId) return;

            await axios.delete(`http://localhost:9090/api/cartItem/cart-items/${cartItemId}`);
    
            const newPanier = panier.filter((_, i) => i !== index);
            setPanier(newPanier);
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'article', error);
        }
    };

    console.log('Total affiché dans le panier : ', totalPrice);

    return (
        <section>
            {panier.length > 0 ?
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
                                        <img
                                            src={cartItem.article.photo[0]} 
                                            alt={cartItem.article.name}
                                        />
                                    </td>
                                    <td>{cartItem.article.name}</td>
                                    <td>{cartItem.article.price} $</td>
                                    <td>
                                        <div className="quantityContainer">
                                            <button className="buttonquantite" onClick={() => decremente(index)}>-</button>
                                            <span className="quantityValue">{cartItem.quantity}</span>
                                            <button className="buttonquantite" onClick={() => incremente(index)}>+</button>
                                        </div>
                                    </td>
                                    <td>{(cartItem.article.price * cartItem.quantity).toFixed(2)} $</td> {/* Affiche le prix total par produit */}
                                    <td>
                                        <button className="removeButton" onClick={() => handleRemoveArticle(index)}></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    <div className="totalContainer">
                        <p>Total du panier : {totalPrice ? totalPrice.toFixed(2) : '0.00'} $</p>
                    </div>

                    <StripeCheckout />
                </>
                :
                <p>Panier Vide !</p>
            }
        </section>
    );
}

export default Panier;
