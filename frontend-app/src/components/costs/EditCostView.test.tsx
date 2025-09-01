import React from 'react';
import { Provider } from 'react-redux';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import EditCostView from './EditCostView';
import * as costService from '../../services/costService';

describe('EditCostView', () => {
  const mockCost = {
    id: '1',
    user_id: 'u',
    event: { id: 'e1', name: 'Event 1' },
    cost_category_id: 'c1',
    name: 'Test Cost',
    amount: 42.5,
    date: '2025-09-01',
  };
  const middlewares = [thunk];
  const mockStore = configureStore(middlewares);
  let store: any;

  beforeEach(() => {
    store = mockStore({
      costCategories: { categories: [{ id: 'c1', name: 'Category 1' }], loading: false },
      events: { events: [{ id: 'e1', name: 'Event 1' }], loading: false },
    });
    jest.spyOn(costService, 'fetchCostById').mockResolvedValue(mockCost as any);
    jest.spyOn(costService, 'updateCost').mockResolvedValue({ ...mockCost, name: 'Updated' } as any);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('shows loading then populates form', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/costs/1/edit']}>
          <Routes>
            <Route path="/costs/:id/edit" element={<EditCostView />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Initially loading spinner
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Wait for name field to appear
    const nameInput = await screen.findByDisplayValue('Test Cost');
    expect(nameInput).toBeInTheDocument();
    expect(screen.getByDisplayValue('42.5')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2025-09-01')).toBeInTheDocument();
  });

  it('submits updated cost and navigates back', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/costs/1/edit']}>
          <Routes>
            <Route path="/costs/:id/edit" element={<EditCostView />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Wait for form
    await screen.findByDisplayValue('Test Cost');

    // Change name
    fireEvent.change(screen.getByLabelText(/cost name label/i), { target: { value: 'Updated Cost' } });
    fireEvent.click(screen.getByRole('button', { name: /update cost/i }));

    await waitFor(() => {
      expect(costService.updateCost).toHaveBeenCalledWith('1', expect.objectContaining({ name: 'Updated Cost' }));
      expect(mockNavigate).toHaveBeenCalledWith('/costs');
    });
  });
});
