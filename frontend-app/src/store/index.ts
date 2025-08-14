import { configureStore } from '@reduxjs/toolkit';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import productsReducer from './features/products/productsSlice';
import { productsEpics } from './features/products/productsEpics';
import salesReducer from './features/sales/salesSlice';
import { salesEpics as allSalesEpics } from './features/sales/salesEpics';

import eventsReducer from './features/events/eventsSlice'; // New import
import { eventsEpics as allEventsEpics } from './features/events/eventsEpics';
import costsReducer from './features/costs/costsSlice';
import { costsEpics as allCostsEpics } from './features/costs/costsEpics';
import uiReducer from './features/ui/uiSlice';
import authReducer from './features/auth/authSlice';
import categoriesReducer from './features/categories/categoriesSlice'; // NEW IMPORT
import { categoriesEpics as allCategoriesEpics } from './features/categories/categoriesEpics'; // NEW IMPORT

export const rootEpic = combineEpics(
  ...productsEpics,
  ...allSalesEpics,
  ...allEventsEpics,
  ...allCostsEpics, // Add all costs epics
  ...allCategoriesEpics, // NEW: Add all categories epics
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const epicMiddleware = createEpicMiddleware<unknown, unknown, any>();

export const store = configureStore({
  reducer: {
    products: productsReducer,
    sales: salesReducer,
    
    events: eventsReducer,
    costs: costsReducer,
    ui: uiReducer, // Add ui reducer
    auth: authReducer, // Add auth reducer
    categories: categoriesReducer, // NEW: Add categories reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(epicMiddleware),
});

epicMiddleware.run(rootEpic);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;