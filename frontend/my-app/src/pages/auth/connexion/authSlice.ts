import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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

export const signInUser = createAsyncThunk(
    'auth/signInUser',
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const instance = axios.create({
                withCredentials: true
            });
            const response = await instance.post('/api/user/sign', credentials);
            const { token } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 404) {
                    return rejectWithValue('Utilisateur non trouvé. Veuillez vérifier vos identifiants.');
                } else if (error.response.status === 400) {
                    return rejectWithValue('Mot de passe incorrect. Veuillez réessayer.');
                }
            }
            return rejectWithValue('Une erreur inattendue s\'est produite. Veuillez réessayer plus tard.');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signOut(state) {
            state.user = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signInUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(signInUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(signInUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { signOut } = authSlice.actions;

export default authSlice.reducer;
