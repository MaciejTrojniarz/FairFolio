import { supabase } from '../supabaseClient';
import type { Merchant } from '../types';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const MOCK_API_BASE_URL = 'http://localhost:3001';

export const merchantService = {
  async fetchMerchant(): Promise<Merchant | null> {
    if (USE_MOCK_DATA) {
      console.log('Fetching merchant from mock server...');
      const response = await fetch(`${MOCK_API_BASE_URL}/merchant`);
      if (!response.ok) throw new Error('Failed to fetch mock merchant');
      const data = await response.json();
      return data.length > 0 ? data[0] : null; // json-server returns an array
    }

    // In a real app, you'd fetch the current user's merchant data
    // For now, we'll assume a single merchant or fetch by user_id
    const { data, error } = await supabase
      .from('merchant') // Assuming a 'merchant' table in Supabase
      .select('*')
      .limit(1);

    if (error) throw error;
    return data.length > 0 ? data[0] as Merchant : null;
  },
};