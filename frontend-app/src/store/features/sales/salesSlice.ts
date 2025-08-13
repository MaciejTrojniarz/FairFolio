import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product, BasketItem, Sale, DetailedSaleItem } from '../../../types';

interface SalesState {
  basket: BasketItem[];
  totalAmount: number;
  salesHistory: (Sale & { items: DetailedSaleItem[] })[];
  selectedSale: Sale | null;
  selectedSaleItems: DetailedSaleItem[];
  loading: boolean;
  error: string | null;
}

const initialState: SalesState = {
  basket: [],
  totalAmount: 0,
  salesHistory: [],
  selectedSale: null,
  selectedSaleItems: [],
  loading: false,
  error: null,
};

export const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    // Commands (actions that trigger side effects)
    fetchSalesCommand: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSaleDetailsCommand: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
      state.selectedSale = null;
      state.selectedSaleItems = [];
    },
    recordSaleCommand: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSaleCommand: (state, action: PayloadAction<{ saleId: string; updatedSaleData: Partial<Sale>; updatedSaleItems: DetailedSaleItem[]; originalSaleItems: DetailedSaleItem[] }>) => {
      state.loading = true;
      state.error = null;
    },

    // Basket management actions
    addToBasket: (state, action: PayloadAction<Product>) => {
      const existingItem = state.basket.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.basket.push({ ...action.payload, quantity: 1 });
      }
      state.totalAmount = state.basket.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    removeFromBasket: (state, action: PayloadAction<string>) => {
      const existingItem = state.basket.find(item => item.id === action.payload);
      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        } else {
          state.basket = state.basket.filter(item => item.id !== action.payload);
        }
      }
      state.totalAmount = state.basket.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    clearBasket: (state) => {
      state.basket = [];
      state.totalAmount = 0;
    },

    // Events (actions that update state based on side effect results)
    salesFetchedEvent: (state, action: PayloadAction<(Sale & { items: DetailedSaleItem[] })[]>) => {
      state.salesHistory = action.payload;
      state.loading = false;
    },
    saleRecordedEvent: (state, action: PayloadAction<Sale & { items: DetailedSaleItem[] }>) => {
      state.salesHistory.push(action.payload);
      state.basket = [];
      state.totalAmount = 0;
      state.loading = false;
    },
    saleDetailsFetchedEvent: (state, action: PayloadAction<{ sale: Sale; items: DetailedSaleItem[] }>) => {
      state.selectedSale = action.payload.sale;
      state.selectedSaleItems = action.payload.items;
      state.loading = false;
    },
    salesErrorEvent: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchSalesCommand,
  fetchSaleDetailsCommand,
  recordSaleCommand,
  updateSaleCommand,
  addToBasket,
  removeFromBasket,
  clearBasket,
  salesFetchedEvent,
  saleRecordedEvent,
  saleDetailsFetchedEvent,
  salesErrorEvent,
} = salesSlice.actions;

export default salesSlice.reducer;