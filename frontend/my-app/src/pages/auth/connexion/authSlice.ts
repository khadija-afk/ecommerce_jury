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

export const signInUser = createAsyncThunk('auth/signInUser', async (credentials: { email: string; password: string }) => {
    const instance  = axios.create({
        withCredentials: true
    })
    const response = await instance.post('/api/api/user/sign', credentials);
    const { token } = response.data;
    console.log(token)
    const user = response.data;
    console.log(user)
    console.log(response)
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
    
});

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
                state.error = action.error.message || null;
            });
    },
});

export const { signOut } = authSlice.actions;

export default authSlice.reducer;
