import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Category } from '../../../types';

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    // Commands
    fetchCategoriesCommand: (state) => {
      state.loading = true;
      state.error = null;
    },
    addCategoryCommand: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    updateCategoryCommand: (state, action: PayloadAction<Category>) => {
      state.loading = true;
      state.error = null;
    },
    deleteCategoryCommand: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },

    // Events
    categoriesFetchedEvent: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
      state.loading = false;
    },
    categoryAddedEvent: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
      state.loading = false;
    },
    categoryUpdatedEvent: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
      state.loading = false;
    },
    categoryDeletedEvent: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter((c) => c.id !== action.payload);
      state.loading = false;
    },
    categoriesErrorEvent: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchCategoriesCommand,
  addCategoryCommand,
  updateCategoryCommand,
  deleteCategoryCommand,
  categoriesFetchedEvent,
  categoryAddedEvent,
  categoryUpdatedEvent,
  categoryDeletedEvent,
  categoriesErrorEvent,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;