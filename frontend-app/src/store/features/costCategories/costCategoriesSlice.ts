import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CostCategory } from '../../../types';

interface CostCategoriesState {
  categories: CostCategory[];
  loading: boolean;
  error: string | null;
}

const initialState: CostCategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

export const costCategoriesSlice = createSlice({
  name: 'costCategories',
  initialState,
  reducers: {
    fetchCostCategoriesCommand: (state) => {
      state.loading = true;
      state.error = null;
    },
    addCostCategoryCommand: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    costCategoriesFetchedEvent: (state, action: PayloadAction<CostCategory[]>) => {
      state.categories = action.payload;
      state.loading = false;
    },
    costCategoryAddedEvent: (state, action: PayloadAction<CostCategory>) => {
      state.categories.push(action.payload);
      state.loading = false;
    },
    costCategoriesErrorEvent: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const fetchCostCategoriesCommand = costCategoriesSlice.actions.fetchCostCategoriesCommand;
export const addCostCategoryCommand = costCategoriesSlice.actions.addCostCategoryCommand;
export const costCategoriesFetchedEvent = costCategoriesSlice.actions.costCategoriesFetchedEvent;
export const costCategoryAddedEvent = costCategoriesSlice.actions.costCategoryAddedEvent;
export const costCategoriesErrorEvent = costCategoriesSlice.actions.costCategoriesErrorEvent;

export default costCategoriesSlice.reducer;
