// src/features/article/AddArticleForm.tsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { addArticle } from './articleSlice';
import './AddArticle.css'

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
        categorie_fk: 0,
        photo: ''
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
       <div>
        <div className='container-fluid'>
        <form onSubmit={handleSubmit} className="mx-auto mt-20">
            <div>
                <label htmlFor=''>Nom</label>
                <input type="text" name="name" value={articleData.name} onChange={handleChange} className='form-control'/>
            </div>
            <div>
                <label htmlFor=''>Contenu</label>
                <textarea name="content" value={articleData.content} onChange={handleChange} className='form-control'></textarea>
            </div>
            <div>
                <label htmlFor=''>Marque</label>
                <input type="text" name="brand" value={articleData.brand} onChange={handleChange} className='form-control'/>
            </div>
            <div>
                <label htmlFor=''>Prix</label>
                <input type="number" name="price" value={articleData.price} onChange={handleChange} className='form-control'/>
            </div>
            <div>
                <label htmlFor=''>Stock</label>
                <input type="number" name="stock" value={articleData.stock} onChange={handleChange} className='form-control'/>
            </div>
            <div>
                <label htmlFor=''>Categorie ID</label>
                <input type="number" name="categorie_fk" value={articleData.categorie_fk} onChange={handleChange} className='form-control'/>
            </div>
            
            <div>
                <label htmlFor=''>photo</label>
                <input type="text" name="photo" value={articleData.photo} onChange={handleChange} className='form-control'/>
            </div>
            <div>
                <button className= 'btn btn-success btn-block mt-3'>Ajouter un article</button>
            </div>
            
        </form>
        </div>
        </div>
    );
};

export default AddArticleForm;
