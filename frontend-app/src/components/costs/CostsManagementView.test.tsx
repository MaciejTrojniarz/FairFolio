import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { render, screen, fireEvent } from '@testing-library/react';
import CostsManagementView from './CostsManagementView';
// Mock useI18n to avoid network calls and provider
vi.mock('../../contexts/useI18n', () => ({ useI18n: () => ({ t: (key: string) => key }) }));

describe('CostsManagementView', () => {
  const mockCosts = [
    { id: '1', date: '2025-08-01', name: 'Cost A', amount: 10.0, user_id: 'u', event: { id: 'e1', name: 'Event 1' } },
    { id: '2', date: '2025-08-02', name: 'Cost B', amount: 20.0, user_id: 'u', event: null },
    { id: '3', date: '2025-08-03', name: 'Cost C', amount: 30.0, user_id: 'u', event: { id: 'e2', name: 'Event 2' } },
  ];
  const mockEvents = [
    { id: 'e1', name: 'Event 1', user_id: 'u' },
    { id: 'e2', name: 'Event 2', user_id: 'u' },
  ];
  const mockState = {
    costs: { costs: mockCosts, loading: false, error: null },
    events: { events: mockEvents, loading: false, error: null },
  };
  const mockStore = {
    getState: () => mockState,
    subscribe: () => () => {},
    dispatch: vi.fn(),
  };

  beforeEach(() => {
    mockStore.dispatch.mockClear();
  });

  it('renders a table with all costs initially', () => {
    render(
      <Provider store={mockStore as any}>
        <CostsManagementView />
      </Provider>
    );

    // Expect all three cost rows to be in the document
    expect(screen.getByText('Cost A')).toBeInTheDocument();
    expect(screen.getByText('Cost B')).toBeInTheDocument();
    expect(screen.getByText('Cost C')).toBeInTheDocument();
  });

  it('filters to show only unassigned costs', () => {
    render(
      <Provider store={mockStore as any}>
        <CostsManagementView />
      </Provider>
    );

    const filterSelect = screen.getByLabelText('filter_event');
    fireEvent.mouseDown(filterSelect);
    const unassignedOption = screen.getByRole('option', { name: 'unassigned' });
    fireEvent.click(unassignedOption);

    // Only Cost B should remain
    expect(screen.queryByText('Cost A')).toBeNull();
    expect(screen.getByText('Cost B')).toBeInTheDocument();
    expect(screen.queryByText('Cost C')).toBeNull();
  });

  it('sorts costs ascending and descending by date', () => {
    render(
      <Provider store={mockStore as any}>
        <CostsManagementView />
      </Provider>
    );

    const sortButton = screen.getByRole('button', { name: /sort_desc/i });
    // Initial descending order: Cost C, Cost B, Cost A
    const rowsBefore = screen.getAllByRole('row');
    expect(rowsBefore[1]).toHaveTextContent('Cost C');

    // Click to toggle to ascending
    fireEvent.click(sortButton);
    const ascendingButton = screen.getByRole('button', { name: /sort_asc/i });
    expect(ascendingButton).toBeInTheDocument();
    const rowsAfter = screen.getAllByRole('row');
    // Now first data row should be Cost A
    expect(rowsAfter[1]).toHaveTextContent('Cost A');
  });
});
