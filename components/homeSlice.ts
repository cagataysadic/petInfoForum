import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export interface Brand {
    brandName: string;
    brandInfo: string;
}

export interface Product {
    productName: string;
    brands: Brand[];
}

export interface Animal {
    _id: string,
    animalName: string;
    animalInfo: string;
    careProducts: Product[];
}

export interface HomeState {
    animals: Animal[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    errorMessage: string | null;
}

const initialState: HomeState = {
    animals: [],
    status: 'idle',
    errorMessage: null,
}

export const fetchAnimals = createAsyncThunk<Animal[]>(
  'animals/fetchAnimals',
  async () => {
    const res = await axios.get('/api/animal');
    return res.data;
  }
);

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchAnimals.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchAnimals.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.animals = action.payload;
        })
        .addCase(fetchAnimals.rejected, (state) => {
            state.status = 'failed';
            state.errorMessage = 'An error occured during fetching current pets process';
        })
    }
});

export default homeSlice.reducer;