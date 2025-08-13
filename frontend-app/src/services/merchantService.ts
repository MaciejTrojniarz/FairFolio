import { supabase } from '../supabaseClient';
import type { Merchant } from '../types';

export const merchantService = {
  async fetchMerchant(): Promise<Merchant | null> {
    const { data, error } = await supabase
      .from('merchant')
      .select('*')
      .single(); // Assuming a single merchant entry per user
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows found"
    return data as Merchant | null;
  },
};