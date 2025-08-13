import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  toast: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  };
}

const initialState: UiState = {
  toast: {
    open: false,
    message: '',
    severity: 'info',
  },
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<{ message: string; severity: 'success' | 'error' | 'info' | 'warning' }>) => {
      state.toast.open = true;
      state.toast.message = action.payload.message;
      state.toast.severity = action.payload.severity;
    },
    hideToast: (state) => {
      state.toast.open = false;
      state.toast.message = '';
    },
  },
});

export const {
  showToast,
  hideToast,
} = uiSlice.actions;

export default uiSlice.reducer;