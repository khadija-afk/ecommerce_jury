import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { usePanier } from '../../utils/PanierContext';

// CONTEXTE
import * as ACTIONS from './articleSlice';
import { RootState, Article } from '../../types/Article';

// Style
import './DetailArticles.css'

const URL = {
    GET_ONE_ARTICLE: (id: string) => `http://localhost:9090/api/article/${id}`
};

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
            setMainPhoto(article.photo[0]); // Initialiser la photo principale
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

    const handleAddToPanier = (article: Article) => {
        addPanier(article);
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
