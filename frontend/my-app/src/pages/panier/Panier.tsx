import React, { useContext, useEffect, useState } from 'react'; 
import { PanierContext } from "../../utils/PanierContext";
import axios from 'axios';
import StripeCheckout from '../../components/stripe/StripeCheckout';

const Panier = () => {
    const { incremente, decremente, priceArticleByQuantity, totalArticle, panier, setPanier } = useContext(PanierContext);
    const [totalAmount, setTotalAmount] = useState(0); // Utilisez useState pour stocker le total_amount
    const userId = 33; // ID de l'utilisateur

    useEffect(() => {
        const fetchPanier = async () => {
            try {
                const response = await axios.get(`http://localhost:9090/api/cart/cart/${userId}`);
                const data = response.data;

                if (data && data.cartItems) {
                    setPanier(data.cartItems); // Traiter `cartItems`
                    setTotalAmount(data.total_amount); // Récupérer le total_amount du backend
                } else {
                    console.error('Données inattendues : cartItems ou total_amount est manquant');
                    setPanier([]); // Réinitialiser à un tableau vide si les données ne contiennent pas d'articles
                }
            } catch (error) {
                console.error('Erreur lors de la récupération du panier', error);
                setPanier([]); // Réinitialiser à un tableau vide en cas d'erreur
            }
        };

        fetchPanier();
    }, [userId, setPanier]);

    const handleRemoveArticle = async (index: number) => {
        try {
            const cartItemId = panier[index]?.id; // Vérification de l'existence de l'élément dans le panier
            if (!cartItemId) return; // Ne rien faire si l'élément est introuvable
    
            await axios.delete(`http://localhost:9090/api/cartItem/cart-items/${cartItemId}`);
    
            // Mettre à jour l'état local et recalculer le montant total
            const newPanier = panier.filter((_, i) => i !== index);
            setPanier(newPanier);

            // Recalculer le montant total après suppression
            const updatedTotalAmount = newPanier.reduce(
                (total, item) => total + item.quantity * parseFloat(item.article.price),
                0
            );
            setTotalAmount(updatedTotalAmount);
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'article', error);
        }
    };

    return (
        <section>
            {panier.length > 0 ?
                <>
                    <div style={styles.root}>
                        {panier.map((cartItem, index) => (
                            <div key={index} style={styles.articleContainer}>
                                {cartItem.article && ( 
                                    <>
                                        <p style={styles.title}>{cartItem.article.name}</p>
                                        <img
                                            style={styles.image}
                                            src={cartItem.article.photo[0]} 
                                            alt={cartItem.article.name}
                                        />
                                        <p>Prix : {cartItem.article.price} $</p>
                                        <div style={styles.quantity}>
                                            <p style={styles.click} onClick={() => decremente(index)}>-</p>
                                            <p>{cartItem.quantity}</p>
                                            <p style={styles.click} onClick={() => incremente(index)}>+</p>
                                        </div>
                                        <button style={styles.removeButton} onClick={() => handleRemoveArticle(index)}>Remove</button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                    <div style={styles.totalContainer}>
                        <p>Total du panier : {totalAmount ? totalAmount.toFixed(2) : '0.00'} $</p>
                        <button>Passer la commande ({totalArticle() ? totalArticle() : '0'} articles)</button>
                    </div>

                    <StripeCheckout />
                </>
                :
                <p>Panier Vide !</p>
            }
        </section>
    );
}

const styles = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    articleContainer: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '1rem',
        width: '200px',
        textAlign: 'center',
    },
    quantity: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.5rem',
    },
    title: {
        fontSize: '1em',
        fontWeight: 'bold',
    },
    click: {
        cursor: 'pointer',
        userSelect: 'none',
        padding: '0 0.5rem',
    },
    image: {
        width: '100%',
        height: 'auto',
        marginBottom: '1rem',
    },
    removeButton: {
        marginTop: '1rem',
        backgroundColor: 'red',
        color: 'white',
        border: 'none',
        padding: '0.5rem',
        cursor: 'pointer',
        borderRadius: '4px',
    },
    totalContainer: {
        marginTop: '2rem',
        textAlign: 'center',
    }
}

export default Panier;
