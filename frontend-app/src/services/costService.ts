import { supabase } from '../supabaseClient';
import type { Cost } from '../types';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const MOCK_API_BASE_URL = 'http://localhost:3001';

export const costService = {
  async fetchCosts(): Promise<Cost[]> {
    if (USE_MOCK_DATA) {
      console.log('Fetching costs from mock server...');
      const response = await fetch(`${MOCK_API_BASE_URL}/costs`);
      if (!response.ok) throw new Error('Failed to fetch mock costs');
      return response.json();
    }

    const { data, error } = await supabase
      .from('costs')
      .select('*');
    if (error) throw error;
    return data as Cost[];
  },

  // Add other CRUD operations for costs if needed later
};