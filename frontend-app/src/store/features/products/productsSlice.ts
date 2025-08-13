import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../../types';

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Commands (actions that trigger side effects)
    fetchProductsCommand: (state) => {
      state.loading = true;
      state.error = null;
    },
    addProductCommand: (state, action: PayloadAction<Omit<Product, 'id' | 'user_id'>>) => {
      state.loading = true;
      state.error = null;
    },
    updateProductCommand: (state, action: PayloadAction<Product>) => {
      state.loading = true;
      state.error = null;
    },
    deleteProductCommand: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },

    // Events (actions that update state based on side effect results)
    productsFetchedEvent: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.loading = false;
    },
    productAddedEvent: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
      state.loading = false;
    },
    productUpdatedEvent: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
      state.loading = false;
    },
    productDeletedEvent: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
      state.loading = false;
    },
    productsErrorEvent: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchProductsCommand,
  addProductCommand,
  updateProductCommand,
  deleteProductCommand,
  productsFetchedEvent,
  productAddedEvent,
  productUpdatedEvent,
  productDeletedEvent,
  productsErrorEvent,
} = productsSlice.actions;

export default productsSlice.reducer;