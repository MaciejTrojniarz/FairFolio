import { supabase } from '../supabaseClient';
import type { Cost } from '../types';

export const costService = {
  async fetchCosts(): Promise<Cost[]> {
    const { data, error } = await supabase
      .from('costs')
      .select('*')
      .order('date', { ascending: false });
    if (error) throw error;
    // Map description to name for compatibility
    const costsWithNames = (data as any[]).map(c => ({ ...c, name: c.description }));
    return costsWithNames as Cost[];
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
          description: cost.name,
          cost_category_id: (cost as { cost_category_id?: string }).cost_category_id ?? null,
          amount: cost.amount,
          date: cost.date,
        },
      ])
      .select()
      .single();
    if (error) throw error;
    // Ensure returned object has a name property for compatibility
    const inserted = data as any;
    inserted.name = inserted.description;
    return data as Cost;
  },
  async updateCost(costId: string, updates: Partial<Omit<Cost, 'id' | 'user_id'>>): Promise<Cost> {
    const { data, error } = await supabase
      .from('costs')
      .update({
        event_id: updates.event_id ?? null,
        description: updates.name,
        amount: updates.amount,
        date: updates.date,
      })
      .eq('id', costId)
      .select()
      .single();
    if (error) throw error;
    // Ensure returned object has a name property for compatibility
    const updated = data as any;
    updated.name = updated.description;
    return data as Cost;
  },
};