import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // Assurez-vous que axios est importé pour gérer les erreurs
import apiClient from '../../../utils/axiosConfig';

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    adresse: string;
    city: string;
    postale_code: string;
    country: string;
    updatedAt: string;
    createdAt: string;
}

interface AuthState {
    user: User | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    status: 'idle',
    error: null,
};

// Action asynchrone pour la connexion de l'utilisateur
export const signInUser = createAsyncThunk(
    'auth/signInUser',
    async (
        credentials: { email: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            // Ajout de withCredentials: true
            const response = await apiClient.post('/api/user/sign', credentials, {
                withCredentials: true, // Inclure les cookies dans la requête
            });
    
            const { access_token, user } = response.data;
    
            // Stocker les données de l'utilisateur dans le localStorage (si nécessaire)
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('user', JSON.stringify(user));
    
            return response.data; // Renvoie les données pour le store
        } catch (error) {
            // Gestion des erreurs spécifiques
            if (axios.isAxiosError(error) && error.response) {
                const status = error.response.status;
                if (status === 404) {
                    return rejectWithValue('Utilisateur non trouvé. Veuillez vérifier vos identifiants.');
                } else if (status === 400) {
                    return rejectWithValue('Mot de passe incorrect. Veuillez réessayer.');
                }
            }
            // Erreur par défaut
            return rejectWithValue('Une erreur inattendue s\'est produite. Veuillez réessayer plus tard.');
        }
    }
);

// Création du slice pour l'authentification
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signOut(state) {
            state.user = null;
            state.status = 'idle';
            state.error = null;

            // Nettoyer le localStorage lors de la déconnexion
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signInUser.pending, (state) => {
                state.status = 'loading';
                state.error = null; // Réinitialiser les erreurs en cas de nouvelle tentative
            })
            .addCase(signInUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user; // Utilisateur récupéré dans l'action
                state.error = null;
            })
            .addCase(signInUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string; // Erreur retournée par rejectWithValue
            });
    },
});

// Export des actions et du reducer
export const { signOut } = authSlice.actions;

export default authSlice.reducer;
