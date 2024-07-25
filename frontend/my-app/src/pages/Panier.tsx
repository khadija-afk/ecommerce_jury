import React, { useContext } from 'react';
import { PanierContext } from '../utils/PanierContext';

const Panier = () => {
    const { incremente, decremente, panier, priceArticleByQuantity, totalPrice, removeArticle, totalArticle } = useContext(PanierContext);

    return (
        <section>
            {panier.length > 0 ?
                <>
                    <div style={styles.root}>
                        {panier.map((article, index) => (
                            <div key={index} style={styles.articleContainer}>
                                <p style={styles.title}>{article.name}</p>
                                <img
                                    style={styles.image}
                                    src={article.photo}
                                    alt={article.name}
                                />
                                <p>Prix : {priceArticleByQuantity(article.price, article.quantite)} $</p>
                                <div style={styles.quantity}>
                                    <p style={styles.click} onClick={() => decremente(index)}>-</p>
                                    <p>{article.quantite}</p>
                                    <p style={styles.click} onClick={() => incremente(index)}>+</p>
                                </div>
                                <button style={styles.removeButton} onClick={() => removeArticle(index)}>Remove</button>
                            </div>
                        ))}
                    </div>
                    <div style={styles.totalContainer}>
                        <p>Total du panier : {totalPrice} $</p>
                        <button>Passer la commande ({totalArticle()} articles)</button>
                    </div>
                </>
                :
                <p>Panier Vide ! </p>
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
