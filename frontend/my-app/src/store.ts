// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './auth/inscription/userSlice';
import authReducer from './auth/connexion/authSlice';
import articleReducer from './features/article/articleSlice'; // Importez le reducer des articles
import reviewReducer from './features/review/reviewSlice';



const store = configureStore({
    reducer: {
        user: userReducer,
        auth: authReducer,
        articles: articleReducer, // Ajoutez le reducer des articles ici
        reviews: reviewReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
