import { describe, it, expect } from 'vitest';
import reducer, { fetchCostsCommand, costsFetchedEvent, recordCostCommand, costRecordedEvent, costsErrorEvent } from '../costsSlice';
import type { Cost } from '../../../../types';

describe('costsSlice', () => {
  it('sets loading on fetchCostsCommand', () => {
    const state = reducer(undefined, fetchCostsCommand());
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('populates costs on costsFetchedEvent', () => {
    const costs: any[] = [{ id: '1' }];
    const state = reducer(undefined, costsFetchedEvent(costs as unknown as Cost[]));
    expect(state.costs).toEqual(costs);
    expect(state.loading).toBe(false);
  });

  it('sets loading on recordCostCommand', () => {
    const state = reducer(undefined, recordCostCommand({ name: 'X', amount: 1, date: '2025-01-01' } as any));
    expect(state.loading).toBe(true);
  });

  it('prepends on costRecordedEvent', () => {
    const initial = { costs: [{ id: 'a' } as any], loading: true, error: null };
    const state = reducer(initial as any, costRecordedEvent({ id: 'b' } as any));
    expect(state.costs[0]).toEqual({ id: 'b' });
    expect(state.loading).toBe(false);
  });

  it('sets error on costsErrorEvent', () => {
    const state = reducer(undefined, costsErrorEvent('boom'));
    expect(state.error).toBe('boom');
    expect(state.loading).toBe(false);
  });
});
