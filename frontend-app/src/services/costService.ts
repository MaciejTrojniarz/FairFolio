import { supabase } from '../supabaseClient';
import type { Cost } from '../types';

export const costService = {
  async fetchCosts(): Promise<Cost[]> {
    const { data, error } = await supabase
      .from('costs')
      .select('*');
    if (error) throw error;
    return data as Cost[];
  },
  // Add other CRUD operations for costs if needed later
};