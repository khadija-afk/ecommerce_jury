import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface NewCategoryData {
    name: string;
    description: string;
}

interface Category {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

interface CategoryState {
    categories: Category[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CategoryState = {
    categories: [],
    status: 'idle',
    error: null,
};

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
    const response = await axios.get('http://localhost:9090/api/categorie/');
    return response.data as Category[];
});

export const addCategory = createAsyncThunk('categories/addCategory', async (category: NewCategoryData) => {
    const response = await axios.post('http://localhost:9090/api/categorie/', category);
    return response.data as Category;
});

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
                state.status = 'succeeded';
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(addCategory.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addCategory.fulfilled, (state, action: PayloadAction<Category>) => {
                state.status = 'succeeded';
                state.categories.push(action.payload);
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    },
});

export default categorySlice.reducer;
