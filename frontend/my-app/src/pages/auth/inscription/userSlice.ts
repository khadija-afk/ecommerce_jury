// src/features/user/userSlice.ts
import { createSlice, createAsyncThunk, SerializedError } from '@reduxjs/toolkit';
import axios from 'axios';

interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
}

interface UserState {
    user: UserData | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: UserState = {
    user: null,
    status: 'idle',
    error: null,
};

// Modification de la fonction `registerUser` pour gérer les erreurs détaillées
export const registerUser = createAsyncThunk(
    'user/registerUser',
    async (userData: UserData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/user/add', userData);
            return response.data;
        } catch (error: any) {
            // Log pour vérifier la structure de l'erreur
            console.log('Erreur capturée dans userSlice :', error);

            // Vérifiez si l'erreur a une réponse et un message détaillé
            if (error.response && error.response.data && error.response.data.error) {
                return rejectWithValue(error.response.data.error);
            }
            // Retourne un message générique si l'erreur ne contient pas d'informations détaillées
            return rejectWithValue('Une erreur est survenue. Veuillez réessayer.');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
                state.error = null; // Réinitialise l'erreur lorsque la requête démarre
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
                state.error = null; // Pas d'erreur en cas de succès
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                // Utilise `action.payload` pour obtenir l'erreur détaillée transmise par `rejectWithValue`
                state.error = action.payload as string || 'Erreur inconnue';
            });
    },
});

export default userSlice.reducer;
export type { UserData };
