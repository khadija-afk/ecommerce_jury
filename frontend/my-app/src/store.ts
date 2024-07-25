// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './auth/inscription/userSlice';
import authReducer from './auth/connexion/authSlice';
import articleReducer from './features/article/articleSlice'; 
import reviewReducer from './features/review/reviewSlice';



const store = configureStore({
    reducer: {
        user: userReducer,
        auth: authReducer,
        articles: articleReducer, 
        reviews: reviewReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
