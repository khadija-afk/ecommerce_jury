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
    photo: string[];
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

// Instance Axios centralisée
const instance = axios.create({
    baseURL: '/api/api/article/',
    withCredentials: true,
});

// Token récupéré et vérifié
const token = localStorage.getItem('token');
if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
} else {
    console.warn('Aucun token disponible dans le localStorage.');
}

// Thunks
export const fetchArticles = createAsyncThunk<Article[]>(
    'articles/fetchArticles',
    async (_, { rejectWithValue }) => {
        try {
            const response = await instance.get('/');
            return response.data as Article[];
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Erreur lors du chargement des articles.');
        }
    }
);

export const addArticle = createAsyncThunk<Article, NewArticleData>(
    'articles/addArticle',
    async (article, { rejectWithValue }) => {
        try {
            const response = await instance.post('/', article);
            return response.data as Article;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Erreur lors de l\'ajout de l\'article.');
        }
    }
);

export const updateArticle = createAsyncThunk<Article, Article>(
    'articles/updateArticle',
    async (article, { rejectWithValue }) => {
        try {
            const response = await instance.put(`/${article.id}`, article);
            return response.data as Article;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Erreur lors de la mise à jour de l\'article.');
        }
    }
);

export const deleteArticle = createAsyncThunk<number, number>(
    'articles/deleteArticle',
    async (id, { rejectWithValue }) => {
        try {
            await instance.delete(`/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Erreur lors de la suppression de l\'article.');
        }
    }
);

// Slice
const articleSlice = createSlice({
    name: 'articles',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Articles
            .addCase(fetchArticles.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchArticles.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.articles = action.payload;
            })
            .addCase(fetchArticles.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // Add Article
            .addCase(addArticle.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addArticle.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.articles.push(action.payload);
            })
            .addCase(addArticle.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // Update Article
            .addCase(updateArticle.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateArticle.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.articles.findIndex((article) => article.id === action.payload.id);
                if (index !== -1) {
                    state.articles[index] = action.payload;
                }
            })
            .addCase(updateArticle.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // Delete Article
            .addCase(deleteArticle.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteArticle.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.articles = state.articles.filter((article) => article.id !== action.payload);
            })
            .addCase(deleteArticle.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export default articleSlice.reducer;
