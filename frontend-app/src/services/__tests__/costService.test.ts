import { describe, it, expect, vi, beforeEach } from 'vitest';
import { costService } from '../../services/costService';
import { supabase } from '../../supabaseClient';
import type { Cost } from '../../types';

vi.mock('../../supabaseClient', () => {
  const authGetUser = vi.fn();
  const fromMock = vi.fn();

  const client = {
    auth: {
      getUser: authGetUser,
    },
    from: fromMock,
  } as unknown as typeof supabase;

  return { supabase: client };
});

const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockOrder = vi.fn();

supabase.from = vi.fn().mockImplementation((_table: string) => ({
  select: mockSelect,
  insert: mockInsert,
  order: mockOrder,
}));

(supabase.auth.getUser as any) = vi.fn();

describe('Cost Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchCosts returns ordered list', async () => {
    mockOrder.mockResolvedValueOnce({ data: [{ id: '1' }], error: null });
    mockSelect.mockReturnValueOnce({ order: mockOrder });

    const costs = await costService.fetchCosts();
    expect(costs).toEqual([{ id: '1' }]);
    expect(mockSelect).toHaveBeenCalledWith('*, event:events(id,name)');
  });

  it('addCost throws when not authenticated', async () => {
    (supabase.auth.getUser as any).mockResolvedValueOnce({ data: { user: null } });
    await expect(costService.addCost({
      event_id: null,
      name: 'Booth',
      category: 'Fee',
      amount: 10,
      date: '2025-01-01',
    } as Omit<Cost, 'id' | 'user_id'>)).rejects.toThrow('User not authenticated for cost recording.');
  });

  it('addCost inserts correctly when authenticated', async () => {
    (supabase.auth.getUser as any).mockResolvedValueOnce({ data: { user: { id: 'u1' } } });
    mockInsert.mockReturnValueOnce({ select: () => ({ single: () => Promise.resolve({ data: { id: 'c1' }, error: null }) }) });

    const cost = await costService.addCost({
      event_id: 'e1',
      name: 'Booth',
      category: 'Fee',
      amount: 10,
      date: '2025-01-01',
    } as Omit<Cost, 'id' | 'user_id'>);

    expect(cost).toEqual({ id: 'c1' });
    expect(mockInsert).toHaveBeenCalled();
  });
});
