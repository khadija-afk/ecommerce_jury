// src/features/review/reviewSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface NewReviewData {
    product_fk: number;
    rating: number;
    comment: string;
}

interface Review {
    id: number;
    product_fk: number;
    rating: number;
    comment: string;
    user_fk: number;
    createdAt: string;
    updatedAt: string;
}

interface ReviewState {
    reviews: Review[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ReviewState = {
    reviews: [],
    status: 'idle',
    error: null,
};

// Get token from local storage
const token = localStorage.getItem('token');

export const fetchReviews = createAsyncThunk('reviews/fetchReviews', async () => {
    const response = await axios.get('http://localhost:3030/api/review/', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data as Review[];
});

export const addReview = createAsyncThunk('reviews/addReview', async (review: NewReviewData) => {
    const instance = axios.create({
        withCredentials: true
    });

    const response = await instance.post('http://localhost:3030/api/review/', review, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return response.data as Review;
});

const reviewSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReviews.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchReviews.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.reviews = action.payload;
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(addReview.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addReview.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.reviews.push(action.payload);
            })
            .addCase(addReview.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    },
});

export default reviewSlice.reducer;
