// src/features/review/AddReviewForm.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { addReview } from './reviewSlice';

const AddReviewForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [reviewData, setReviewData] = useState({
        product_fk: 0,
        rating: 0,
        comment: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setReviewData({ ...reviewData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(addReview(reviewData));
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Product ID</label>
                <input type="number" name="product_fk" value={reviewData.product_fk} onChange={handleChange} />
            </div>
            <div>
                <label>Rating</label>
                <input type="number" name="rating" value={reviewData.rating} onChange={handleChange} />
            </div>
            <div>
                <label>Comment</label>
                <textarea name="comment" value={reviewData.comment} onChange={handleChange}></textarea>
            </div>
            <button type="submit">Add Review</button>
        </form>
    );
};

export default AddReviewForm;
