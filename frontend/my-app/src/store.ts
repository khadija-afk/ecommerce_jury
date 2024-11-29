// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './pages/auth/inscription/userSlice';
import authReducer from './pages/auth/connexion/authSlice';
import articleReducer from './features/article/articleSlice'; 




const store = configureStore({
    reducer: {
        user: userReducer,
        auth: authReducer,
        articles: articleReducer, 
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
