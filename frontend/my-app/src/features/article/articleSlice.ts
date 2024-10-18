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
console.log(token)

export const fetchArticles = createAsyncThunk('articles/fetchArticles', async () => {
    const response = await axios.get('/api/api/article/', {
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
    const response = await instance.post('/api/api/article/', article, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return response.data as Article;
});

export const updateArticle = createAsyncThunk('articles/updateArticle', async (article: Article) => {
    const instance = axios.create({
      withCredentials: true
    });
  
    const token = localStorage.getItem('token');
    const response = await instance.put(`/api/article/${article.id}`, article, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data as Article;
});

export const deleteArticle = createAsyncThunk('articles/deleteArticle', async (id: number) => {
    const instance = axios.create({
        withCredentials: true
      });
    const token = localStorage.getItem('token');
    const response = await instance.delete(`/api/article/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
          }

    });

    return id;
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
        addToPanier: (state, action) => {
            state.panier.push(action.payload);
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
            })
            .addCase(updateArticle.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateArticle.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.articles.push(action.payload);
            })
            .addCase(updateArticle.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })

            .addCase(deleteArticle.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteArticle.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Supprime l'article de l'état par son ID
                state.articles = state.articles.filter(article => article.id !== action.payload);
            })
            .addCase(deleteArticle.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    },
});

export const { FETCH_ARTICLE_START, FETCH_ARTICLE_SUCCEEDED, FETCH_ARTICLE_FAILED } = articleSlice.actions;
export default articleSlice.reducer;
