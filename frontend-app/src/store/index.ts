import { configureStore } from '@reduxjs/toolkit';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import counterReducer from './features/counter/counterSlice';
import { counterEpics } from './features/counter/counterEpics';
import productsReducer from './features/products/productsSlice';
import { productsEpics } from './features/products/productsEpics';
import salesReducer from './features/sales/salesSlice';
import { recordSaleEpic, salesEpics as allSalesEpics } from './features/sales/salesEpics';
import merchantReducer from './features/merchant/merchantSlice';
import { fetchMerchantEpic } from './features/merchant/merchantEpics';
import eventsReducer from './features/events/eventsSlice'; // New import
import { eventsEpics as allEventsEpics } from './features/events/eventsEpics';
import costsReducer from './features/costs/costsSlice';
import { costsEpics as allCostsEpics } from './features/costs/costsEpics';
import uiReducer from './features/ui/uiSlice'; // New import

export const rootEpic = combineEpics(
  counterEpics,
  ...productsEpics,
  ...allSalesEpics,
  fetchMerchantEpic,
  ...allEventsEpics,
  ...allCostsEpics // Add all costs epics
);

const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    products: productsReducer,
    sales: salesReducer,
    merchant: merchantReducer,
    events: eventsReducer,
    costs: costsReducer,
    ui: uiReducer, // Add ui reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(epicMiddleware),
});

epicMiddleware.run(rootEpic);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;