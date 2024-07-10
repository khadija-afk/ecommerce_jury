import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchArticles } from './articleSlice';

const ArticleList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const articles = useSelector((state: RootState) => state.articles.articles);
    const articleStatus = useSelector((state: RootState) => state.articles.status);
    const error = useSelector((state: RootState) => state.articles.error);

    useEffect(() => {
        if (articleStatus === 'idle') {
            dispatch(fetchArticles());
        }
    }, [articleStatus, dispatch]);

    let content;

    if (articleStatus === 'loading') {
        content = <p>Loading...</p>;
    } else if (articleStatus === 'succeeded') {
        content = articles.map(article => (
            <div key={article.id}>
                <h3>{article.name}</h3>
                <p>{article.content}</p>
                <p>{article.brand}</p>
                <p>{article.price}</p>
                <p>{article.stock}</p>
            </div>
        ));
    } else if (articleStatus === 'failed') {
        content = <p>{error}</p>;
    }

    return (
        <section>
            <h2>Articles</h2>
            {content}
        </section>
    );
};

export default ArticleList;
