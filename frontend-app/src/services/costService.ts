import { supabase } from '../supabaseClient';
import type { Cost } from '../types';

export const costService = {
  async fetchCosts(): Promise<Cost[]> {
    const { data, error } = await supabase
      .from('costs')
      .select('*')
      .order('date', { ascending: false });
    if (error) throw error;
    return data as Cost[];
  },
  async addCost(cost: Omit<Cost, 'id' | 'user_id'>): Promise<Cost> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated for cost recording.');
    }

    const { data, error } = await supabase
      .from('costs')
      .insert([
        {
          user_id: user.id,
          event_id: cost.event_id ?? null,
          name: cost.name,
          category: cost.category ?? null,
          amount: cost.amount,
          date: cost.date,
        },
      ])
      .select()
      .single();
    if (error) throw error;
    return data as Cost;
  },
  async updateCost(costId: string, updates: Partial<Omit<Cost, 'id' | 'user_id'>>): Promise<Cost> {
    const { data, error } = await supabase
      .from('costs')
      .update({
        event_id: updates.event_id ?? null,
        name: updates.name,
        category: updates.category ?? null,
        amount: updates.amount,
        date: updates.date,
      })
      .eq('id', costId)
      .select()
      .single();
    if (error) throw error;
    return data as Cost;
  },
};