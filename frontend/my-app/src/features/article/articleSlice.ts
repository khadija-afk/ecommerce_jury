import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface NewArticleData {
    name: string;
    content: string;
    brand: string;
    price: number;
    status: boolean;
    stock: number;
    user_fk: number;
    categorie_fk: number;
}

interface Article {
    id: number;
    name: string;
    content: string;
    brand: string;
    price: number;
    status: boolean;
    stock: number;
    user_fk: number;
    categorie_fk: number;
    photo: string;
    createdAt: string;
    updatedAt: string;
}

interface ArticleState {
    articles: Article[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ArticleState = {
    articles: [],
    status: 'idle',
    error: null,
};

// Get token from local storage
const token = localStorage.getItem('token');

export const fetchArticles = createAsyncThunk('articles/fetchArticles', async () => {
    const response = await axios.get('http://localhost:9090/api/article/', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data as Article[];
});

export const addArticle = createAsyncThunk('articles/addArticle', async (article: NewArticleData) => {
    const instance = axios.create({
        withCredentials: true
    });

    const token = localStorage.getItem('token');
    const response = await instance.post('http://localhost:9090/api/article/', article, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return response.data as Article;
});

const articleSlice = createSlice({
    name: 'articles',
    initialState,
    reducers: {
        FETCH_ARTICLE_START(state) {
            state.status = 'loading';
        },
        FETCH_ARTICLE_SUCCEEDED(state, action) {
            state.status = 'succeeded';
            state.articles.push(action.payload);
        },
        FETCH_ARTICLE_FAILED(state, action) {
            state.status = 'failed';
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchArticles.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchArticles.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.articles = action.payload;
            })
            .addCase(fetchArticles.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(addArticle.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addArticle.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.articles.push(action.payload);
            })
            .addCase(addArticle.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    },
});

export const { FETCH_ARTICLE_START, FETCH_ARTICLE_SUCCEEDED, FETCH_ARTICLE_FAILED } = articleSlice.actions;
export default articleSlice.reducer;
