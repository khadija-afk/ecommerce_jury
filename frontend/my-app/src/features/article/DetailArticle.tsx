import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { usePanier } from '../../utils/PanierContext';
import * as ACTIONS from './articleSlice';
import { RootState, Article } from '../../types/Article';
import './DetailArticles.css';
import URL from '../../constants/Url';

const DetailArticle: React.FC = () => {
    const { addPanier } = usePanier();
    const dispatch = useDispatch();
    const { id } = useParams<{ id: string }>();
    const articleId = Number(id);

    const article = useSelector((state: RootState) =>
        state.articles.articles.find(article => article.id === articleId)
    );

    const [mainPhoto, setMainPhoto] = useState<string | null>(null);

    useEffect(() => {
        if (article && article.photo && article.photo.length > 0) {
            setMainPhoto(article.photo[0]);
        }
    }, [article]);

    useEffect(() => {
        const fetchArticle = async () => {
            dispatch(ACTIONS.FETCH_ARTICLE_START());
            try {
                const response = await axios.get(URL.GET_ONE_ARTICLE(id), {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                dispatch(ACTIONS.FETCH_ARTICLE_SUCCEEDED(response.data));
            } catch (error) {
                console.error(error);
                dispatch(ACTIONS.FETCH_ARTICLE_FAILED());
            }
        };

        fetchArticle();
    }, [id, dispatch]);

    const handleAddToPanier = async (article: Article) => {
        try {
            const userId = 33;  // Remplacez ceci par l'ID de l'utilisateur

            // Ajouter l'article au backend
            const response = await axios.post(URL.POST_CART_ITEMS, {
                cart_fk: 15,  // Remplacez par l'ID du panier
                product_fk: article.id,
                quantity: 1
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Ajouter l'article au contexte (local)
            addPanier(article);

            console.log('Article ajouté au panier:', response.data);
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'article au panier :', error);
        }
    };

    const handleThumbnailClick = (photo: string) => {
        setMainPhoto(photo);
    };

    return (
        <div>
            {article && mainPhoto && article.photo &&
                <section className='bloc__detail'>
                    <div className="photo-container">
                        <div className="thumbnails-container">
                            {article.photo.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    className="thumbnail"
                                    onClick={() => handleThumbnailClick(img)}
                                    alt={`${article.name} ${index}`}
                                />
                            ))}
                        </div>
                        <div className="main-photo-container">
                            <img
                                src={mainPhoto}
                                alt={article.name}
                                className="main-photo"
                            />
                        </div>
                    </div>
                    <div>
                        <h2>{article.name}</h2>
                        <p>{article.content}</p>
                        <p>{article.price} €</p>
                        <button onClick={() => handleAddToPanier(article)}>AJOUTER</button>
                    </div>
                </section>
            }
        </div>
    );
};

export default DetailArticle;
