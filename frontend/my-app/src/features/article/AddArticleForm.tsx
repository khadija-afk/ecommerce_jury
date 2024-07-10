// src/features/article/AddArticleForm.tsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { addArticle } from './articleSlice';

const AddArticleForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user_fk = useSelector((state: RootState) => state.auth.user?.id); // Récupérez l'ID de l'utilisateur connecté

    const [articleData, setArticleData] = useState({
        name: '',
        content: '',
        brand: '',
        price: 0,
        status: false,
        stock: 0,
        user_fk: user_fk || 0, // Initialiser avec l'ID de l'utilisateur connecté
        categorie_fk: 0
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setArticleData({ ...articleData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(addArticle(articleData));
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Nom</label>
                <input type="text" name="name" value={articleData.name} onChange={handleChange} />
            </div>
            <div>
                <label>Contenu</label>
                <textarea name="content" value={articleData.content} onChange={handleChange}></textarea>
            </div>
            <div>
                <label>Marque</label>
                <input type="text" name="brand" value={articleData.brand} onChange={handleChange} />
            </div>
            <div>
                <label>Prix</label>
                <input type="number" name="price" value={articleData.price} onChange={handleChange} />
            </div>
            <div>
                <label>Stock</label>
                <input type="number" name="stock" value={articleData.stock} onChange={handleChange} />
            </div>
            <div>
                <label>Categorie ID</label>
                <input type="number" name="categorie_fk" value={articleData.categorie_fk} onChange={handleChange} />
            </div>
            <button type="submit">Ajouter un article</button>
        </form>
    );
};

export default AddArticleForm;
