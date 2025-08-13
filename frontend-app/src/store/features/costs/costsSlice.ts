import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Cost } from '../../../types';

interface CostsState {
  costs: Cost[];
  loading: boolean;
  error: string | null;
}

const initialState: CostsState = {
  costs: [],
  loading: false,
  error: null,
};

export const costsSlice = createSlice({
  name: 'costs',
  initialState,
  reducers: {
    fetchCostsCommand: (state) => {
      state.loading = true;
      state.error = null;
    },
    costsFetchedEvent: (state, action: PayloadAction<Cost[]>) => {
      state.costs = action.payload;
      state.loading = false;
    },
    costsErrorEvent: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchCostsCommand,
  costsFetchedEvent,
  costsErrorEvent,
} = costsSlice.actions;

export default costsSlice.reducer;