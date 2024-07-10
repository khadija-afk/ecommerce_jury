// src/features/category/AddCategoryForm.tsx

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { addCategory } from './categorySlice';

const AddCategoryForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [categoryData, setCategoryData] = useState({
        name: '',
        description: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCategoryData({ ...categoryData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(addCategory(categoryData));
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Nom</label>
                <input type="text" name="name" value={categoryData.name} onChange={handleChange} />
            </div>
            <div>
                <label>Description</label>
                <textarea name="description" value={categoryData.description} onChange={handleChange}></textarea>
            </div>
            <button type="submit">Ajouter une catégorie</button>
        </form>
    );
};

export default AddCategoryForm;
