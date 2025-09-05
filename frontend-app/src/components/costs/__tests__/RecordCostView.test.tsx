import React from 'react';
import { render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock fetch to avoid network calls
global.fetch = vi.fn();

// Mock EventSelector to properly display selectedEventId
vi.mock('../../events/EventSelector', () => ({ 
  default: ({ selectedEventId }: { selectedEventId?: string }) => (
    <div data-testid="selected-event" data-selected-id={selectedEventId || 'undefined'}>
      {selectedEventId || 'no-selection'}
    </div>
  )
}));

import RecordCostView from '../RecordCostView';
import { I18nProvider } from '../../../../src/contexts/I18nContext';
import productsReducer from '../../../../src/store/features/products/productsSlice';
import salesReducer from '../../../../src/store/features/sales/salesSlice';
import eventsReducer from '../../../../src/store/features/events/eventsSlice';
import authReducer from '../../../../src/store/features/auth/authSlice';
import categoriesReducer from '../../../../src/store/features/categories/categoriesSlice';
import costsReducer from '../../../../src/store/features/costs/costsSlice';
import costCategoriesReducer from '../../../../src/store/features/costCategories/costCategoriesSlice';
import uiReducer from '../../../../src/store/features/ui/uiSlice';

// Helper to create a test store with preloaded state
const createTestStore = (preloadedState = {}) =>
  configureStore({
    reducer: {
      products: productsReducer,
      sales: salesReducer,
      events: eventsReducer,
      auth: authReducer,
      categories: categoriesReducer,
      costs: costsReducer,
      costCategories: costCategoriesReducer,
      ui: uiReducer,
    },
    preloadedState,
  });

describe('RecordCostView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful fetch response for translations
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ test_key: 'Test Translation' }),
    });
  });

  test('renders the record cost form with all required fields', async () => {
    const event = {
      id: 'e1',
      name: 'Event 1',
      description: '',
      link: '',
      start_date: '2025-01-01',
      end_date: '2025-01-02',
      venue: '',
      city: ''
    };
    const store = createTestStore({
      events: { events: [event], loading: false, error: null },
      costCategories: { categories: [], loading: false, error: null },
      costs: { costs: [], loading: false, error: null }
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/costs/record']}>  
          <I18nProvider>
            <Routes>
              <Route path="/costs/record" element={<RecordCostView />} />
            </Routes>
          </I18nProvider>
        </MemoryRouter>
      </Provider>
    );

    // Check that the form renders with all required fields
    expect(screen.getByTestId('record-cost-view')).toBeInTheDocument();
    expect(screen.getByTestId('cost-name')).toBeInTheDocument();
    expect(screen.getByTestId('cost-category-select')).toBeInTheDocument();
    expect(screen.getByTestId('cost-date')).toBeInTheDocument();
    expect(screen.getByTestId('record-cost')).toBeInTheDocument();
    
    // Check that the EventSelector is rendered
    expect(screen.getByTestId('selected-event')).toBeInTheDocument();
  });
});
