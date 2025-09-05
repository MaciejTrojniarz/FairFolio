import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
// Mock useI18n to bypass translation provider
vi.mock('../../contexts/useI18n', () => ({ useI18n: () => ({ t: (key: string) => key }) }));

// Mock the form hook with proper functions
const mockSetName = vi.fn();
const mockSetEventId = vi.fn();
const mockSetCategoryId = vi.fn();
const mockSetAmount = vi.fn();
const mockSetDate = vi.fn();
const mockSetOpenDialog = vi.fn();
const mockSetNewCategoryName = vi.fn();
const mockHandleSaveCategory = vi.fn();
const mockHandleSubmit = vi.fn();

vi.mock('./useEditCostForm', () => ({ 
  useEditCostForm: () => ({
    loading: false,
    error: null,
    name: 'Test Cost',
    setName: mockSetName,
    eventId: 'e1',
    setEventId: mockSetEventId,
    categoryId: 'c1',
    setCategoryId: mockSetCategoryId,
    amount: '42.5',
    setAmount: mockSetAmount,
    date: '2025-09-01',
    setDate: mockSetDate,
    openDialog: false,
    setOpenDialog: mockSetOpenDialog,
    newCategoryName: '',
    setNewCategoryName: mockSetNewCategoryName,
    handleSaveCategory: mockHandleSaveCategory,
    canSubmit: true,
    handleSubmit: mockHandleSubmit,
    categories: [{ id: 'c1', name: 'Category 1' }],
    categoriesLoading: false,
  })
}));
import EditCostView from './EditCostView';
import * as ReactRouterDom from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import costsReducer from '../../store/features/costs/costsSlice';
import costCategoriesReducer from '../../store/features/costCategories/costCategoriesSlice';
import eventsReducer from '../../store/features/events/eventsSlice';
import uiReducer from '../../store/features/ui/uiSlice';

describe('EditCostView', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        costs: costsReducer,
        costCategories: costCategoriesReducer,
        events: eventsReducer,
        ui: uiReducer,
      },
      preloadedState: {
        costCategories: { categories: [{ id: 'c1', name: 'Category 1' }], loading: false, error: null },
        events: { events: [{ id: 'e1', name: 'Event 1' }], loading: false, error: null },
      },
    });
    vi.clearAllMocks();
  });

  it('renders form with populated values', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/costs/1/edit']}>
          <Routes>
            <Route path="/costs/:id/edit" element={<EditCostView />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Check that form fields are populated with mock values
    expect(screen.getByDisplayValue('Test Cost')).toBeInTheDocument();
    expect(screen.getByDisplayValue('42.5')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2025-09-01')).toBeInTheDocument();
    
    // Check that the update button is enabled (canSubmit is true in mock)
    const updateButton = screen.getByRole('button', { name: /update_cost_button/i });
    expect(updateButton).not.toBeDisabled();
  });

  it('calls handleSubmit when update button is clicked', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/costs/1/edit']}>
          <Routes>
            <Route path="/costs/:id/edit" element={<EditCostView />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Form loaded by hook, value available
    expect(screen.getByDisplayValue('Test Cost')).toBeInTheDocument();

    // Click the update button
    const updateButton = screen.getByRole('button', { name: /update_cost_button/i });
    fireEvent.click(updateButton);

    // Verify that the mock handleSubmit function was called
    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  });

  it('calls setName when name field is changed', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/costs/1/edit']}>
          <Routes>
            <Route path="/costs/:id/edit" element={<EditCostView />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Change name field
    const nameInput = screen.getByLabelText(/cost_name_label/i);
    fireEvent.change(nameInput, { target: { value: 'Updated Cost' } });

    // Verify that setName was called with the new value
    expect(mockSetName).toHaveBeenCalledWith('Updated Cost');
  });
});
