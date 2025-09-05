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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    recordCostCommand: (state, _action: PayloadAction<{ eventId?: string; name: string; costCategoryId?: string | null; amount: number; date: string }>) => {
      state.loading = true;
      state.error = null;
    },
    costsFetchedEvent: (state, action: PayloadAction<Cost[]>) => {
      state.costs = action.payload;
      state.loading = false;
    },
    costRecordedEvent: (state, action: PayloadAction<Cost>) => {
      state.costs.unshift(action.payload);
      state.loading = false;
    },
    costUpdatedEvent: (state, action: PayloadAction<Cost>) => {
      const index = state.costs.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.costs[index] = action.payload;
      }
      state.loading = false;
    },
    costsErrorEvent: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateCostCommand: (state, _action: PayloadAction<{ costId: string; updates: Partial<Omit<Cost, 'id' | 'user_id'>> }>) => {
      state.loading = true;
      state.error = null;
    },
  },
});

export const fetchCostsCommand = costsSlice.actions.fetchCostsCommand;
export const recordCostCommand = costsSlice.actions.recordCostCommand;
export const costsFetchedEvent = costsSlice.actions.costsFetchedEvent;
export const costRecordedEvent = costsSlice.actions.costRecordedEvent;
export const costUpdatedEvent = costsSlice.actions.costUpdatedEvent;
export const updateCostCommand = costsSlice.actions.updateCostCommand;
export const costsErrorEvent = costsSlice.actions.costsErrorEvent;

export default costsSlice.reducer;