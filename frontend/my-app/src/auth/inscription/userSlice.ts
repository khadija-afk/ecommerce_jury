// src/features/user/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    adresse: string;
    city: string;
    postale_code: string;
    country: string;
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

export const registerUser = createAsyncThunk('user/registerUser', async (userData: UserData) => {
    const response = await axios.post('http://localhost:3030/api/user/add', userData);
    return response.data;
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    },
});

export default userSlice.reducer;
export type { UserData };
