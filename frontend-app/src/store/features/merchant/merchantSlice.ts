import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Merchant } from '../../../types';

interface MerchantState {
  merchant: Merchant | null;
  loading: boolean;
  error: string | null;
}

const initialState: MerchantState = {
  merchant: null,
  loading: false,
  error: null,
};

export const merchantSlice = createSlice({
  name: 'merchant',
  initialState,
  reducers: {
    fetchMerchantCommand: (state) => {
      state.loading = true;
      state.error = null;
    },
    merchantFetchedEvent: (state, action: PayloadAction<Merchant | null>) => {
      state.merchant = action.payload;
      state.loading = false;
    },
    merchantErrorEvent: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchMerchantCommand,
  merchantFetchedEvent,
  merchantErrorEvent,
} = merchantSlice.actions;

export default merchantSlice.reducer;